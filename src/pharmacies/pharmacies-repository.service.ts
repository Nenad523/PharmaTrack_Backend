import {
    BadRequestException,
    HttpException,
    Injectable,
    InternalServerErrorException,
    NotFoundException,
} from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { ResultSetHeader } from 'mysql2/promise';
import { SearchDto } from './dto/search-dto';
import {
    AvailabilitySource,
    MainSearch,
    PharmacyAvailabilityRow,
    PharmacyDetailRow,
    PharmacyDoseRow,
    PharmacySearchRow,
    SearchDose,
} from './types/mainSearch.type';

import { WorkingHours } from './types/workingHours.type';
import { OnDuty } from './types/onDuty.type';

const DEFAULT_AVAILABILITY_TIME_ZONE = 'Europe/Podgorica';
const WEEKDAY_NAMES = [
    'monday',
    'tuesday',
    'wednesday',
    'thursday',
    'friday',
    'saturday',
    'sunday',
];
const WORKING_HOURS_DAY_LABEL_SQL = `
    CASE
        WHEN CAST(day_of_week AS CHAR) REGEXP '^[0-9]+$'
            THEN ELT(CAST(day_of_week AS UNSIGNED), 'Ponedjeljak', 'Utorak', 'Srijeda', 'Četvrtak', 'Petak', 'Subota', 'Nedjelja')
        WHEN LOWER(CAST(day_of_week AS CHAR)) = 'monday' THEN 'Ponedjeljak'
        WHEN LOWER(CAST(day_of_week AS CHAR)) = 'tuesday' THEN 'Utorak'
        WHEN LOWER(CAST(day_of_week AS CHAR)) = 'wednesday' THEN 'Srijeda'
        WHEN LOWER(CAST(day_of_week AS CHAR)) = 'thursday' THEN 'Četvrtak'
        WHEN LOWER(CAST(day_of_week AS CHAR)) = 'friday' THEN 'Petak'
        WHEN LOWER(CAST(day_of_week AS CHAR)) = 'saturday' THEN 'Subota'
        WHEN LOWER(CAST(day_of_week AS CHAR)) = 'sunday' THEN 'Nedjelja'
        ELSE CAST(day_of_week AS CHAR)
    END
`;
const WORKING_HOURS_DAY_ORDER_SQL = `
    CASE
        WHEN CAST(day_of_week AS CHAR) REGEXP '^[0-9]+$'
            THEN CAST(day_of_week AS UNSIGNED)
        WHEN LOWER(CAST(day_of_week AS CHAR)) = 'monday' THEN 1
        WHEN LOWER(CAST(day_of_week AS CHAR)) = 'tuesday' THEN 2
        WHEN LOWER(CAST(day_of_week AS CHAR)) = 'wednesday' THEN 3
        WHEN LOWER(CAST(day_of_week AS CHAR)) = 'thursday' THEN 4
        WHEN LOWER(CAST(day_of_week AS CHAR)) = 'friday' THEN 5
        WHEN LOWER(CAST(day_of_week AS CHAR)) = 'saturday' THEN 6
        WHEN LOWER(CAST(day_of_week AS CHAR)) = 'sunday' THEN 7
        ELSE 8
    END
`;

type LocalAvailabilityClock = {
    dateTime: string;
    date: string;
    time: string;
    dayOfWeek: number;
    dayName: string;
};

const getAvailabilityTimeZone = () =>
    process.env.APP_TIMEZONE ??
    process.env.DB_TIMEZONE ??
    DEFAULT_AVAILABILITY_TIME_ZONE;

const getLocalAvailabilityClock = (date = new Date()): LocalAvailabilityClock => {
    let parts: Record<string, string>;

    try {
        parts = Object.fromEntries(
            new Intl.DateTimeFormat('en-CA', {
                timeZone: getAvailabilityTimeZone(),
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
                hourCycle: 'h23',
            }).formatToParts(date).map((part) => [part.type, part.value]),
        );
    } catch {
        parts = Object.fromEntries(
            new Intl.DateTimeFormat('en-CA', {
                timeZone: DEFAULT_AVAILABILITY_TIME_ZONE,
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
                hourCycle: 'h23',
            }).formatToParts(date).map((part) => [part.type, part.value]),
        );
    }

    const localDate = `${parts.year}-${parts.month}-${parts.day}`;
    const localTime = `${parts.hour}:${parts.minute}:${parts.second}`;
    const utcDay = new Date(`${localDate}T00:00:00Z`).getUTCDay();
    const dayOfWeek = utcDay === 0 ? 7 : utcDay;

    return {
        dateTime: `${localDate} ${localTime}`,
        date: localDate,
        time: localTime,
        dayOfWeek,
        dayName: WEEKDAY_NAMES[dayOfWeek - 1],
    };
};

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
                trackSearch,
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
                    P.isActive,
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
            const availabilityClock = getLocalAvailabilityClock();

            // Query 2: za nadjene apoteke nalazimo njihove availability cinjenice

            const availabilityRows = await this.db.query<PharmacyAvailabilityRow[]>(
                `
                    SELECT
                        P.id AS pharmacyId,

                        (
                            SELECT MIN(DS.end_datetime)
                            FROM DutySchedule DS
                            WHERE DS.pharmacy_id = P.id
                              AND ? BETWEEN DS.start_datetime AND DS.end_datetime
                        ) AS dutyEnd,

                        EXISTS (
                            SELECT 1
                            FROM PharmacyScheduleException PSE
                            WHERE PSE.pharmacy_id = P.id
                              AND PSE.exception_date = ?
                              AND PSE.is_closed = 1
                        ) AS hasClosedExceptionToday,

                        (
                            SELECT MIN(PSE.close_time)
                            FROM PharmacyScheduleException PSE
                            WHERE PSE.pharmacy_id = P.id
                              AND PSE.exception_date = ?
                              AND PSE.is_closed = 0
                              AND ? BETWEEN PSE.open_time AND PSE.close_time
                        ) AS activeExceptionClose,

                        (
                            SELECT MIN(WH.close_time)
                            FROM WorkingHours WH
                            WHERE WH.pharmacy_id = P.id
                              AND (
                                  WH.day_of_week = ?
                                  OR LOWER(CAST(WH.day_of_week AS CHAR)) = ?
                              )
                              AND (
                                  ? BETWEEN WH.open_time AND WH.close_time
                                  OR (WH.open_time = '00:00:00' AND WH.close_time = '00:00:00')
                              )
                        ) AS workingHoursClose,

                        EXISTS (
                            SELECT 1
                            FROM WorkingHours WH
                            WHERE WH.pharmacy_id = P.id
                              AND (
                                  WH.day_of_week = ?
                                  OR LOWER(CAST(WH.day_of_week AS CHAR)) = ?
                              )
                              AND WH.open_time = '00:00:00'
                              AND WH.close_time = '00:00:00'
                        ) AS isOpenAllDay

                    FROM Pharmacy P
                    WHERE P.id IN (${pharmacyIdPlaceholders})
                `,
                [
                    availabilityClock.dateTime,
                    availabilityClock.date,
                    availabilityClock.date,
                    availabilityClock.time,
                    availabilityClock.dayOfWeek,
                    availabilityClock.dayName,
                    availabilityClock.time,
                    availabilityClock.dayOfWeek,
                    availabilityClock.dayName,
                    ...pharmacyIds,
                ],
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
                const isOpenAllDay = Boolean(availability?.isOpenAllDay);
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
                } else if (isOpenAllDay) {
                    isOpenNow = true;
                    availabilitySource = 'working_hours';
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
            
            if (trackSearch) {
                await this.db.query<ResultSetHeader>(
                    `UPDATE Medication M
                     JOIN Doses D ON D.medication_id = M.id
                     SET M.search_count = M.search_count + 1
                     WHERE D.id IN (${dosePlaceholders})`,
                    doseIds,
                );
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
        
        const rows = await this.db.query<WorkingHours[]>(
            `SELECT
                ${WORKING_HOURS_DAY_LABEL_SQL} AS day_of_week,
                WH.open_time,
                WH.close_time
            FROM WorkingHours WH
            WHERE WH.pharmacy_id = ?
            ORDER BY ${WORKING_HOURS_DAY_ORDER_SQL}, WH.open_time`,
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

    async getAllOnDuty(date: string) {
        if (!date) {
            throw new BadRequestException('Datum je obavezan parametar.');
        }

        if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
            throw new BadRequestException('Datum mora biti u formatu YYYY-MM-DD.');
        }

        try {
            const rows = await this.db.query<OnDuty[]>(
                `SELECT
                    P.id,
                    P.name,
                    P.address,
                    C.name AS city,
                    GROUP_CONCAT(PH.number SEPARATOR ', ') AS phone,
                    DS.start_datetime AS dutyStart,
                    DS.end_datetime AS dutyEnd
                FROM DutySchedule DS
                JOIN Pharmacy P ON P.id = DS.pharmacy_id
                JOIN City C ON C.id = P.city_id
                LEFT JOIN Phone PH ON PH.pharmacy_id = P.id
                WHERE ? BETWEEN DATE(DS.start_datetime) AND DATE(DS.end_datetime)
                  AND P.isActive = 1
                GROUP BY P.id, P.name, P.address, C.name, DS.start_datetime, DS.end_datetime
                ORDER BY P.name`,
                [date],
            );

            if (rows.length === 0) {
                throw new NotFoundException('Nema dežurnih apoteka za odabrani datum.');
            }

            return {
                success: true,
                data: rows,
                count: rows.length,
            };
        } catch (error) {
            if (error instanceof HttpException) throw error;
            throw new InternalServerErrorException('Došlo je do greške.');
        }
    }

    async getAboutPharmacy(id: number) {
        try {
            const availabilityClock = getLocalAvailabilityClock();
            const pharmacyRows = await this.db.query<PharmacyDetailRow[]>(
                `SELECT
                    P.id,
                    P.name,
                    P.address,
                    C.name AS city,
                    P.latitude,
                    P.longitude,
                    P.isActive,
                    DS.start_datetime AS dutyStart,
                    DS.end_datetime AS dutyEnd
                FROM Pharmacy P
                JOIN City C ON C.id = P.city_id
                LEFT JOIN DutySchedule DS
                    ON DS.pharmacy_id = P.id
                    AND ? BETWEEN DS.start_datetime AND DS.end_datetime
                WHERE P.id = ?
                LIMIT 1`,
                [availabilityClock.dateTime, id],
            );

            if (pharmacyRows.length === 0) {
                throw new NotFoundException('Apoteka sa datim ID-em ne postoji.');
            }

            const pharmacy = pharmacyRows[0];

            const [phones, workingHours] = await Promise.all([
                this.db.query<{ number: string }[]>(
                    `SELECT number FROM Phone WHERE pharmacy_id = ?`,
                    [id],
                ),
                this.db.query<WorkingHours[]>(
                    `SELECT
                        ${WORKING_HOURS_DAY_LABEL_SQL} AS day_of_week,
                        open_time AS open_time,
                        close_time AS close_time
                    FROM WorkingHours
                    WHERE pharmacy_id = ?
                    ORDER BY ${WORKING_HOURS_DAY_ORDER_SQL}, open_time`,
                    [id],
                ),
            ]);

            return {
                success: true,
                data: {
                    id: pharmacy.id,
                    name: pharmacy.name,
                    address: pharmacy.address,
                    city: pharmacy.city,
                    latitude: pharmacy.latitude,
                    longitude: pharmacy.longitude,
                    isActive: pharmacy.isActive,
                    isOnDuty: pharmacy.dutyStart !== null,
                    phones: phones.map(p => p.number),
                    workingHours,
                    dutySchedule: pharmacy.dutyStart
                        ? { startDatetime: pharmacy.dutyStart, endDatetime: pharmacy.dutyEnd }
                        : null,
                },
            };
        } catch (error) {
            if (error instanceof HttpException) throw error;
            throw new InternalServerErrorException('Došlo je do greške.');
        }
    }
}
