import {
    BadRequestException,
    HttpException,
    Injectable,
    InternalServerErrorException,
} from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { SearchDto } from './dto/search-dto';
import {
    AvailabilitySource,
    MainSearch,
    PharmacyAvailabilityRow,
    PharmacyDoseRow,
    PharmacySearchRow,
    SearchDose,
} from './types/mainSearch.type';

@Injectable()
export class PharmaciesRepository {

    constructor(private db: DatabaseService) {}

    async searchPharmacies(searchDto: SearchDto) {
        try {
            const {
                doseIds,
                uLat,
                uLng,
                sort,
                city,
                radius,
                name,
                address,
                openNow,
                onDuty,
            } = searchDto;

            const dosePlaceholders = doseIds.map(() => '?').join(', ');
            const conditions: string[] = [];
            const whereParams: (string | number | boolean)[] = [];
            const havingConditions: string[] = [];
            const havingParams: number[] = [];
            const hasCoordinates = uLat !== undefined && uLng !== undefined;

            if (radius !== undefined && !hasCoordinates) {
                throw new BadRequestException(
                    'radius zahtijeva i uLat i uLng parametre.',
                );
            }

            if (sort === 'distance' && !hasCoordinates) {
                throw new BadRequestException(
                    'sort=distance zahtijeva i uLat i uLng parametre.',
                );
            }

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

            conditions.push('P.isActive = 1');

            conditions.push(`EXISTS (
                SELECT 1
                FROM Inventory I
                WHERE I.pharmacy_id = P.id
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

            // Query 2: za nadjene apoteke nalazimo njihove availability cinjenice

            const availabilityRows = await this.db.query<PharmacyAvailabilityRow[]>(
                `
                    SELECT
                        P.id AS pharmacyId,

                        (
                            SELECT MIN(DS.end_datetime)
                            FROM DutySchedule DS
                            WHERE DS.pharmacy_id = P.id
                              AND NOW() BETWEEN DS.start_datetime AND DS.end_datetime
                        ) AS dutyEnd,

                        EXISTS (
                            SELECT 1
                            FROM PharmacyScheduleException PSE
                            WHERE PSE.pharmacy_id = P.id
                              AND PSE.exception_date = CURDATE()
                              AND PSE.is_closed = 1
                        ) AS hasClosedExceptionToday,

                        (
                            SELECT MIN(PSE.close_time)
                            FROM PharmacyScheduleException PSE
                            WHERE PSE.pharmacy_id = P.id
                              AND PSE.exception_date = CURDATE()
                              AND PSE.is_closed = 0
                              AND CURTIME() BETWEEN PSE.open_time AND PSE.close_time
                        ) AS activeExceptionClose,

                        (
                            SELECT MIN(WH.close_time)
                            FROM WorkingHours WH
                            WHERE WH.pharmacy_id = P.id
                              AND WH.day_of_week = WEEKDAY(CURDATE()) + 1
                              AND CURTIME() BETWEEN WH.open_time AND WH.close_time
                        ) AS workingHoursClose

                    FROM Pharmacy P
                    WHERE P.id IN (${pharmacyIdPlaceholders})
                `,
                pharmacyIds,
            );

            // Query 3: za nadjene apoteke ucitavamo samo trazene doze koje imaju na stanju.
            const doseRows = await this.db.query<PharmacyDoseRow[]>(
                `
                    SELECT
                        I.pharmacy_id AS pharmacyId,
                        D.id AS doseId,
                        D.strength,
                        I.lastUpdated
                    FROM Inventory I
                    JOIN Doses D ON D.id = I.dose_id
                    WHERE I.pharmacy_id IN (${pharmacyIdPlaceholders})
                      AND I.dose_id IN (${dosePlaceholders})
                      AND I.quantity > 0
                      AND D.isActive=1
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
                    lastUpdated: row.lastUpdated,
                });
            }

            const availabilityByPharmacy = new Map<number, PharmacyAvailabilityRow>();

            for (const row of availabilityRows) {
                availabilityByPharmacy.set(row.pharmacyId, row);
            }

            let data: MainSearch[] = pharmacyRows.map((pharmacy) => {
                const availability = availabilityByPharmacy.get(pharmacy.id);
                const dutyEnd = availability?.dutyEnd ?? null;
                const activeExceptionClose = availability?.activeExceptionClose ?? null;
                const workingHoursClose = availability?.workingHoursClose ?? null;
                const isOnDuty = dutyEnd !== null;

                let isOpenNow = false;
                let openUntil: string | null = null;
                let availabilitySource: AvailabilitySource = null;

                if (isOnDuty) {
                    isOpenNow = true;
                    openUntil = dutyEnd;
                    availabilitySource = 'duty';
                } else if (
                    Boolean(availability?.hasClosedExceptionToday) &&
                    activeExceptionClose === null
                ) {
                    isOpenNow = false;
                } else if (activeExceptionClose !== null) {
                    isOpenNow = true;
                    openUntil = activeExceptionClose;
                    availabilitySource = 'exception';
                } else if (workingHoursClose !== null) {
                    isOpenNow = true;
                    openUntil = workingHoursClose;
                    availabilitySource = 'working_hours';
                }

                return {
                    ...pharmacy,
                    isOpenNow,
                    isOnDuty,
                    openUntil,
                    availabilitySource,
                    doses: dosesByPharmacy.get(pharmacy.id) ?? [],
                };
            });

            if (openNow === true) {
                data = data.filter((pharmacy) => pharmacy.isOpenNow);
            }

            if (onDuty === true) {
                data = data.filter((pharmacy) => pharmacy.isOnDuty);
            }

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

    async getWorkingHours(id: number){
        
        const rows = await this.db.query<any[]>(
            `SELECT
                ELT(WH.day_of_week, 'Ponedeljak', 'Utorak', 'Srijeda', 'Četvrtak', 'Petak', 'Subota', 'Nedelja') AS day_of_week,
                WH.open_time,
                WH.close_time
            FROM WorkingHours WH
            WHERE WH.pharmacy_id = ?
            ORDER BY WH.day_of_week, WH.open_time`,
            [id],
        );

        if (rows.length === 0){
            throw new BadRequestException('Apoteka sa datim ID-em ne postoji.');
        }

        return {
            success: true,
            data: rows
        }
    }

    async getAllOnDuty(date: string){

    }
}
