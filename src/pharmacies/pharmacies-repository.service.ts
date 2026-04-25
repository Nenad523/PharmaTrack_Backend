import { HttpException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { SearchDto } from './dto/search-dto';
import {
    MainSearch,
    PharmacyDoseRow,
    PharmacySearchRow,
    SearchDose,
} from './types/mainSearch.type';

@Injectable()
export class RepositoryService {

    constructor(private db: DatabaseService) {}

    async searchPharmacies(searchDto: SearchDto) {
        try {
            const {
                doseIds,
                uLat,
                uLng,
                sort,
                active,
                city,
                radius,
                name,
                address,
            } = searchDto;

            const dosePlaceholders = doseIds.map(() => '?').join(', ');
            const conditions: string[] = [];
            const whereParams: (string | number | boolean)[] = [];
            const havingConditions: string[] = [];
            const havingParams: number[] = [];
            const hasCoordinates = uLat !== undefined && uLng !== undefined;

            const distanceSql = hasCoordinates
                ? `6371 * ACOS(
                    LEAST(
                        1,
                        GREATEST(
                            -1,
                            COS(RADIANS(?)) *
                            COS(RADIANS(P.latitude)) *
                            COS(RADIANS(P.longitude) - RADIANS(?)) +
                            SIN(RADIANS(?)) *
                            SIN(RADIANS(P.latitude))
                        )
                    )
                )`
                : 'NULL';

            conditions.push(`EXISTS (
                SELECT 1
                FROM Inventory I
                WHERE I.pharmacy_id = P.id
                  AND P.isActive = 1
                  AND I.dose_id IN (${dosePlaceholders})
                  AND I.quantity > 0
            )`);
            whereParams.push(...doseIds);

            if (city?.length) {
                const cityPlaceholders = city.map(() => '?').join(', ');
                conditions.push(`C.name IN (${cityPlaceholders})`);
                whereParams.push(...city);
            }

            if (name?.trim()) {
                conditions.push('P.name LIKE ?');
                whereParams.push(`%${name.trim()}%`);
            }

            if (address?.trim()) {
                conditions.push('P.address LIKE ?');
                whereParams.push(`%${address.trim()}%`);
            }

            if (hasCoordinates && radius !== undefined) {
                havingConditions.push('distance <= ?');
                havingParams.push(radius);
            }

            const orderBy =
                sort === 'distance' && hasCoordinates
                    ? 'ORDER BY distance ASC, P.name ASC'
                    : 'ORDER BY P.name ASC';

            // Query 1: vracamo jedinstvene apoteke i distance racunamo samo jednom po apoteci.
            const pharmacyQuery = `
                SELECT
                    P.id,
                    P.name,
                    P.address,
                    C.name AS city,
                    P.latitude,
                    P.longitude,
                    ${distanceSql} AS distance
                FROM Pharmacy P
                JOIN City C ON C.id = P.city_id
                WHERE ${conditions.join(' AND ')}
                ${havingConditions.length ? `HAVING ${havingConditions.join(' AND ')}` : ''}
                ${orderBy}
            `;

            const pharmacyParams: (string | number | boolean)[] = [
                ...(hasCoordinates ? [uLat, uLng, uLat] : []),
                ...whereParams,
                ...havingParams,
            ];

            const pharmacyRows = await this.db.query<PharmacySearchRow[]>(
                pharmacyQuery,
                pharmacyParams,
            );

            if (pharmacyRows.length === 0) {
                return {
                    success: true,
                    data: [],
                    count: 0,
                };
            }

            const pharmacyIds = pharmacyRows.map((pharmacy) => pharmacy.id);
            const pharmacyIdPlaceholders = pharmacyIds.map(() => '?').join(', ');

            // Query 2: za nadjene apoteke ucitavamo samo trazene doze koje imaju na stanju.
            const doseRows = await this.db.query<PharmacyDoseRow[]>(
                `
                    SELECT
                        I.pharmacy_id AS pharmacyId,
                        D.id AS doseId,
                        D.strength,
                        I.quantity,
                        I.lastUpdated
                    FROM Inventory I
                    JOIN Doses D ON D.id = I.dose_id
                    WHERE I.pharmacy_id IN (${pharmacyIdPlaceholders})
                      AND I.dose_id IN (${dosePlaceholders})
                      AND I.quantity > 0
                    ORDER BY D.strength ASC
                `,
                [...pharmacyIds, ...doseIds],
            );

            const dosesByPharmacy = new Map<number, SearchDose[]>();

            for (const row of doseRows) {
                if (!dosesByPharmacy.has(row.pharmacyId)) {
                    dosesByPharmacy.set(row.pharmacyId, []);
                }

                dosesByPharmacy.get(row.pharmacyId)!.push({
                    doseId: row.doseId,
                    strength: row.strength,
                    quantity: row.quantity,
                    lastUpdated: row.lastUpdated,
                });
            }

            const data: MainSearch[] = pharmacyRows.map((pharmacy) => ({
                ...pharmacy,
                doses: dosesByPharmacy.get(pharmacy.id) ?? [],
            }));

            return {
                success: true,
                data,
                count: data.length,
            };
        } catch (error) {
            if (error instanceof HttpException) throw error;
            throw new InternalServerErrorException('Došlo je do greške.');
        }
    }
}
