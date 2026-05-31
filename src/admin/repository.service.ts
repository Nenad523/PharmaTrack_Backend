import { BadRequestException, HttpException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { CreateMedicationDto } from './dto/create-medication.dto';
import { UpdateMedicationDto } from './dto/update-medication.dto';
import { CreateIngredientDto } from './dto/create-ingredient.dto';
import { LinkIngredientDto } from './dto/link-ingredient.dto';
import { CreateDoseDto } from './dto/create-dose.dto';
import { CreatePharmacyDto } from './dto/create-pharmacy.dto';
import { UpdatePharmacyDto } from './dto/update-pharmacy.dto';
import { CreateWorkingHoursDto } from './dto/create-workingHours.dto';
import { UpdateWorkingHoursDto } from './dto/update-workingHours.dto';
import { CreateDutyDto } from './dto/create-duty.dto';
import { CreateScheduleExceptionDto } from './dto/create-scheduleException.dto';
import { UpdateScheduleExceptionDto } from './dto/update-scheduleException.dto';
import { UpdateInventoryDto } from './dto/update-inventory.dto';
import { EmbeddingService } from '../common/embedding/embedding.service';
import { ResultSetHeader } from 'mysql2';
@Injectable()
export class RepositoryService {

    constructor(private db: DatabaseService, 
                private embeddingService: EmbeddingService    
            ) {}

    async createMedication(dto: CreateMedicationDto) {
        try {
            const existing = await this.db.query<{ id: number }[]>(
                'SELECT id FROM Medication WHERE name = ?',
                [dto.name]
            );

            if (existing.length > 0)
                throw new BadRequestException(`Lijek sa nazivom "${dto.name}" već postoji.`);

            let embedding: number[] | null = null;

            if (dto.description)
                embedding = await this.embeddingService.getEmbedding(dto.description);

            const result = await this.db.query<{ insertId: number }>(
                'INSERT INTO Medication (name, description, isActive, embedding) VALUES (?, ?, 1, ?)',
                [dto.name, dto.description ?? null, embedding ? JSON.stringify(embedding) : null]
            );

            return {
                success: true,
                id: result.insertId,
            };
        } catch (error) {
            if (error instanceof HttpException) throw error;
            throw new InternalServerErrorException('Došlo je do greške pri kreiranju lijeka.');
        }
    }

    async updateMedication(id: number, dto: UpdateMedicationDto) {
        try {
            const existing = await this.db.query<{ id: number }[]>(
                'SELECT id FROM Medication WHERE id = ? AND isActive = 1',
                [id]
            );

            if (existing.length === 0)
                throw new NotFoundException(`Lijek sa ID-em ${id} ne postoji.`);

            const fields: string[] = [];
            const values: (string | number | null)[] = [];

            if (dto.name !== undefined) {
                fields.push('name = ?');
                values.push(dto.name);
            }

            if (dto.description !== undefined) {
                fields.push('description = ?');
                values.push(dto.description);
                const embedding = await this.embeddingService.getEmbedding(dto.description);
                fields.push('embedding = ?');
                values.push(JSON.stringify(embedding));
            }

            if (fields.length === 0)
                throw new BadRequestException('Nisu proslijeđena polja za izmjenu.');

            values.push(id);

            await this.db.query(
                `UPDATE Medication SET ${fields.join(', ')} WHERE id = ?`,
                values
            );

            return { success: true };
        } catch (error) {
            if (error instanceof HttpException) throw error;
            throw new InternalServerErrorException('Došlo je do greške pri izmjeni lijeka.');
        }
    }

    async deleteMedication(id: number) {
        try {
            const existing = await this.db.query<{ id: number }[]>(
                'SELECT id FROM Medication WHERE id = ? AND isActive = 1',
                [id]
            );

            if (existing.length === 0)
                throw new NotFoundException(`Lijek sa ID-em ${id} ne postoji.`);

            await this.db.query(
                'UPDATE Medication SET isActive = 0 WHERE id = ?',
                [id]
            );

            return { success: true };
        } catch (error) {
            if (error instanceof HttpException) throw error;
            throw new InternalServerErrorException('Došlo je do greške pri brisanju lijeka.');
        }
    }

    async getAllIngredients() {
        try {
            const rows = await this.db.query<{ id: number; name: string }[]>(
                'SELECT id, name FROM ActiveIngredient ORDER BY name ASC'
            );

            return { success: true, data: rows, count: rows.length };
        } catch (error) {
            if (error instanceof HttpException) throw error;
            throw new InternalServerErrorException('Došlo je do greške pri dohvatanju supstanci.');
        }
    }

    async createIngredient(dto: CreateIngredientDto) {
        try {
            const existing = await this.db.query<{ id: number }[]>(
                'SELECT id FROM ActiveIngredient WHERE name = ?',
                [dto.name]
            );

            if (existing.length > 0)
                throw new BadRequestException(`Aktivna supstanca "${dto.name}" već postoji.`);

            const result = await this.db.query<{ insertId: number }>(
                'INSERT INTO ActiveIngredient (name) VALUES (?)',
                [dto.name]
            );

            return { success: true, id: result.insertId };
        } catch (error) {
            if (error instanceof HttpException) throw error;
            throw new InternalServerErrorException('Došlo je do greške pri kreiranju supstance.');
        }
    }

    async linkIngredients(medicationId: number, dto: LinkIngredientDto) {
        try {
            const existing = await this.db.query<{ id: number }[]>(
                'SELECT id FROM Medication WHERE id = ? AND isActive = 1',
                [medicationId]
            );

            if (existing.length === 0)
                throw new NotFoundException(`Lijek sa ID-em ${medicationId} ne postoji.`);

            const placeholders = dto.ingredientIds.map(() => '(?, ?)').join(', ');
            const values = dto.ingredientIds.flatMap((ingId) => [medicationId, ingId]);

            await this.db.query(
                `INSERT IGNORE INTO Medication_ActiveIngredient (medication_id, activeIngredient_id) VALUES ${placeholders}`,
                values
            );

            return { success: true };
        } catch (error) {
            if (error instanceof HttpException) throw error;
            throw new InternalServerErrorException('Došlo je do greške pri dodavanju supstanci.');
        }
    }

    async unlinkIngredient(medicationId: number, ingredientId: number) {
        try {
            await this.db.query(
                'DELETE FROM Medication_ActiveIngredient WHERE medication_id = ? AND activeIngredient_id = ?',
                [medicationId, ingredientId]
            );

            return { success: true };
        } catch (error) {
            if (error instanceof HttpException) throw error;
            throw new InternalServerErrorException('Došlo je do greške pri uklanjanju supstance.');
        }
    }

    async createDoses(medicationId: number, dto: CreateDoseDto) {
        try {
            const existing = await this.db.query<{ id: number }[]>(
                'SELECT id FROM Medication WHERE id = ? AND isActive = 1',
                [medicationId]
            );

            if (existing.length === 0)
                throw new NotFoundException(`Lijek sa ID-em ${medicationId} ne postoji.`);

            const strengthPlaceholders = dto.strengths.map(() => '?').join(', ');
            const duplicates = await this.db.query<{ strength: string }[]>(
                `SELECT strength FROM Doses WHERE medication_id = ? AND strength IN (${strengthPlaceholders}) AND isActive = 1`,
                [medicationId, ...dto.strengths]
            );

            if (duplicates.length > 0) {
                const names = duplicates.map((d) => d.strength).join(', ');
                throw new BadRequestException(`Doze već postoje za ovaj lijek: ${names}.`);
            }

            const placeholders = dto.strengths.map(() => '(?, ?, 1)').join(', ');
            const values = dto.strengths.flatMap((strength) => [medicationId, strength]);

            await this.db.query(
                `INSERT INTO Doses (medication_id, strength, isActive) VALUES ${placeholders}`,
                values
            );

            return { success: true };
        } catch (error) {
            if (error instanceof HttpException) throw error;
            throw new InternalServerErrorException('Došlo je do greške pri dodavanju doza.');
        }
    }

    async deleteDose(medicationId: number, doseId: number) {
        try {
            const existing = await this.db.query<{ id: number }[]>(
                'SELECT id FROM Doses WHERE id = ? AND medication_id = ? AND isActive = 1',
                [doseId, medicationId]
            );

            if (existing.length === 0)
                throw new NotFoundException(`Doza sa ID-em ${doseId} ne postoji.`);

            await this.db.query(
                'UPDATE Doses SET isActive = 0 WHERE id = ?',
                [doseId]
            );

            return { success: true };
        } catch (error) {
            if (error instanceof HttpException) throw error;
            throw new InternalServerErrorException('Došlo je do greške pri brisanju doze.');
        }
    }

    async createPharmacy(dto: CreatePharmacyDto) {
        try {
            const existing = await this.db.query<any[]>(
                'SELECT id FROM Pharmacy WHERE name = ? AND address = ? AND isActive = 1',
                [dto.name, dto.address]
            );

            if (existing.length > 0) {
                throw new BadRequestException('Apoteka sa ovim nazivom i adresom već postoji');
            }

            const result = await this.db.query<ResultSetHeader>(
                'INSERT INTO Pharmacy (name, address, latitude, longitude, city_id, isActive) VALUES (?, ?, ?, ?, ?, 1)',
                [dto.name, dto.address, dto.latitude, dto.longitude, dto.city_id]
            );
            return { success: true, id: result.insertId };

        } catch (error) {
            if (error instanceof HttpException) throw error;
            throw new InternalServerErrorException('Došlo je do greške pri kreiranju apoteke.');
        }
    }

    async updatePharmacy(id: number, dto: UpdatePharmacyDto) {
        try {
            const result = await this.db.query<ResultSetHeader>(
                `UPDATE Pharmacy SET
                name = COALESCE(?, name),
                address = COALESCE(?, address),
                latitude = COALESCE(?, latitude),
                longitude = COALESCE(?, longitude),
                city_id = COALESCE(?, city_id)
                WHERE id = ?`,
                [dto.name ?? null, dto.address ?? null, dto.latitude ?? null, dto.longitude ?? null, dto.city_id ?? null, id]
            );

            if (result.affectedRows === 0)
                throw new NotFoundException(`Apoteka sa ID-em ${id} ne postoji.`);
            return { success: true };

        } catch (error) {
            if (error instanceof HttpException) throw error;
            throw new InternalServerErrorException('Došlo je do greške pri izmjeni apoteke.');
        }
    }

    async removePharmacy(id: number) {
        try {

            const existing = await this.db.query<{ id: number }[]>(
                'SELECT id FROM Pharmacy WHERE id = ? AND isActive = 1',
                [id]
            );

            if (existing.length === 0)
                throw new NotFoundException(`Apoteka sa ID-em ${id} ne postoji.`);

            await this.db.query(
                'UPDATE Pharmacy SET isActive = 0 WHERE id = ?',
                [id]
            );

            return { success: true };

        } catch (error) {
            if (error instanceof HttpException) throw error;
            throw new InternalServerErrorException('Došlo je do greške pri uklanjanju apoteke.');
        }
    }

    async createWorkingHours(pharmacyId: number, dto: CreateWorkingHoursDto) {
        try {

            const pharmacy = await this.db.query<{ id: number }[]>(
                'SELECT id FROM Pharmacy WHERE id = ? AND isActive = 1',
                [pharmacyId]
            );

            if (pharmacy.length === 0)
                throw new NotFoundException(`Apoteka sa ID-em ${pharmacyId} ne postoji.`);

            const existing = await this.db.query<{ id: number }[]>(
                'SELECT id FROM WorkingHours WHERE pharmacy_id = ? AND day_of_week = ?',
                [pharmacyId, dto.day_of_week]
            );

            if (existing.length > 0)
                throw new BadRequestException(`Radno vrijeme za ${dto.day_of_week} već postoji.`);

            const result = await this.db.query<ResultSetHeader>(
                'INSERT INTO WorkingHours (day_of_week, open_time, close_time,pharmacy_id) VALUES (?, ?, ?, ?)',
                [dto.day_of_week, dto.open_time, dto.close_time, pharmacyId]
            );

            return { success: true, id: result.insertId };

        } catch (error) {
            if (error instanceof HttpException) throw error;
            throw new InternalServerErrorException('Došlo je do greške pri dodavanju radnog vremena.');
        }
    }

    async updateWorkingHours(pharmacyId: number, whId: number, dto: UpdateWorkingHoursDto) {
        try {

            const existing = await this.db.query<{ id: number }[]>(
                'SELECT id FROM WorkingHours WHERE id = ? AND pharmacy_id = ?',
                [whId, pharmacyId]
            );

            if (existing.length === 0)
                throw new NotFoundException(`Radno vrijeme sa ID-em ${whId} ne postoji.`);

            const fields: string[] = [];
            const values: (string | number | null)[] = [];

            if (dto.day_of_week !== undefined) {
                fields.push('day_of_week = ?');
                values.push(dto.day_of_week);
            }
            if (dto.open_time !== undefined) {
                fields.push('open_time = ?');
                values.push(dto.open_time);
            }
            if (dto.close_time !== undefined) {
                fields.push('close_time = ?');
                values.push(dto.close_time);
            }

            if (fields.length === 0)
                throw new BadRequestException('Nisu proslijeđena polja za izmjenu.');

            values.push(whId);

            await this.db.query(
                `UPDATE WorkingHours SET ${fields.join(', ')} WHERE id = ?`,
                values
            );

            return { success: true };
        } catch (error) {
            if (error instanceof HttpException) throw error;
            throw new InternalServerErrorException('Došlo je do greške pri izmjeni radnog vremena.');
        }
    }

    async removeWorkingHours(pharmacyId: number, whId: number) {
        try {
            const existing = await this.db.query<{ id: number }[]>(
                'SELECT id FROM WorkingHours WHERE id = ? AND pharmacy_id = ?',
                [whId, pharmacyId]
            );

            if (existing.length === 0)
                throw new NotFoundException(`Radno vrijeme sa ID-em ${whId} ne postoji.`);

            await this.db.query(
                'DELETE FROM WorkingHours WHERE id = ?',
                [whId]
            );

            return { success: true };

        } catch (error) {
            if (error instanceof HttpException) throw error;
            throw new InternalServerErrorException('Došlo je do greške pri uklanjanju radnog vremena.');
        }
    }

    async createDuty(pharmacyId: number, dto: CreateDutyDto) {
        try {
            const pharmacy = await this.db.query<{ id: number }[]>(
                'SELECT id FROM Pharmacy WHERE id = ? AND isActive = 1',
                [pharmacyId]
            );

            if (pharmacy.length === 0)
                throw new NotFoundException(`Apoteka sa ID-em ${pharmacyId} ne postoji.`);

            const overlap = await this.db.query<{ id: number }[]>(
                `SELECT id FROM DutySchedule
                WHERE pharmacy_id = ?
                AND start_datetime < ? AND end_datetime > ?`,
                [pharmacyId, dto.end_datetime, dto.start_datetime]
            );

            if (overlap.length > 0)
                throw new BadRequestException('Dežurstvo se preklapa sa postojećim dežurstvom.');

            const result = await this.db.query<ResultSetHeader>(
                'INSERT INTO DutySchedule (start_datetime, end_datetime, pharmacy_id) VALUES (?, ?, ?)',
                [dto.start_datetime, dto.end_datetime, pharmacyId]
            );

            return { success: true, id: result.insertId };

        } catch (error) {
            if (error instanceof HttpException) throw error;
            throw new InternalServerErrorException('Došlo je do greške pri dodavanju dežurstva.');
        }
    }

    async removeDuty(pharmacyId: number, dutyId: number) {
        try {

            const existing = await this.db.query<{ id: number }[]>(
                'SELECT id FROM DutySchedule WHERE id = ? AND pharmacy_id = ?',
                [dutyId, pharmacyId]
            );

            if (existing.length === 0)
                throw new NotFoundException(`Dežurstvo sa ID-em ${dutyId} ne postoji.`);

            await this.db.query(
                'DELETE FROM DutySchedule WHERE id = ?',
                [dutyId]
            );

            return { success: true };

        } catch (error) {
            if (error instanceof HttpException) throw error;
            throw new InternalServerErrorException('Došlo je do greške pri uklanjanju dežurstva.');
        }
    }

    async createScheduleException(pharmacyId: number, dto: CreateScheduleExceptionDto) {
        try {
            const pharmacy = await this.db.query<{ id: number }[]>(
                'SELECT id FROM Pharmacy WHERE id = ? AND isActive = 1',
                [pharmacyId]
            );

            if (pharmacy.length === 0)
                throw new NotFoundException(`Apoteka sa ID-em ${pharmacyId} ne postoji.`);

            const existing = await this.db.query<{ id: number }[]>(
                'SELECT id FROM PharmacyScheduleException WHERE pharmacy_id = ? AND exception_date = ?',
                [pharmacyId, dto.exception_date]
            );

            if (existing.length > 0)
                throw new BadRequestException(`Izuzetak za datum ${dto.exception_date} već postoji.`);

            const result = await this.db.query<ResultSetHeader>(
                `INSERT INTO PharmacyScheduleException ( exception_date, name, open_time, close_time, is_closed, reason, pharmacy_id)
                VALUES (?, ?, ?, ?, ?, ?, ?)`,
                [pharmacyId, dto.exception_date, dto.name, dto.open_time ?? null, dto.close_time ?? null, dto.is_closed, dto.reason]
            );

            return { success: true, id: result.insertId };

        } catch (error) {
            if (error instanceof HttpException) throw error;
            throw new InternalServerErrorException('Došlo je do greške pri dodavanju izuzetka rasporeda.');
        }
    }

    async updateScheduleException(pharmacyId: number, exId: number, dto: UpdateScheduleExceptionDto) {
        try {
            const existing = await this.db.query<{ id: number }[]>(
                'SELECT id FROM PrimaryScheduleException WHERE id = ? AND pharmacy_id = ?',
                [exId, pharmacyId]
            );

            if (existing.length === 0)
                throw new NotFoundException(`Izuzetak sa ID-em ${exId} ne postoji.`);

            const fields: string[] = [];
            const values: (string | number | boolean | null)[] = [];

            if (dto.exception_date !== undefined) { fields.push('exception_date = ?'); values.push(dto.exception_date); }
            if (dto.name !== undefined) { fields.push('name = ?'); values.push(dto.name); }
            if (dto.open_time !== undefined) { fields.push('open_time = ?'); values.push(dto.open_time); }
            if (dto.close_time !== undefined) { fields.push('close_time = ?'); values.push(dto.close_time); }
            if (dto.is_closed !== undefined) { fields.push('is_closed = ?'); values.push(dto.is_closed); }
            if (dto.reason !== undefined) { fields.push('reason = ?'); values.push(dto.reason); }

            if (fields.length === 0)
                throw new BadRequestException('Nisu proslijeđena polja za izmjenu.');

            values.push(exId);

            await this.db.query(
                `UPDATE PrimaryScheduleException SET ${fields.join(', ')} WHERE id = ?`,
                values
            );

            return { success: true };
        } catch (error) {
            if (error instanceof HttpException) throw error;
            throw new InternalServerErrorException('Došlo je do greške pri izmjeni izuzetka rasporeda.');
        }
    }

    async updateInventory(pharmacyId: number, doseId: number, dto: UpdateInventoryDto) {
        try {
            const pharmacy = await this.db.query<{ id: number; name: string }[]>(
                'SELECT id, name FROM Pharmacy WHERE id = ? AND isActive = 1',
                [pharmacyId]
            );

            if (pharmacy.length === 0)
                throw new NotFoundException(`Apoteka sa ID-em ${pharmacyId} ne postoji.`);

            const dose = await this.db.query<{ id: number }[]>(
                'SELECT id FROM Doses WHERE id = ? AND isActive = 1',
                [doseId]
            );

            if (dose.length === 0)
                throw new NotFoundException(`Doza sa ID-em ${doseId} ne postoji.`);

            const current = await this.db.query<{ quantity: number }[]>(
                'SELECT quantity FROM Inventory WHERE pharmacy_id = ? AND dose_id = ?',
                [pharmacyId, doseId]
            );

            const wasUnavailable = current.length === 0 || current[0].quantity === 0;

            await this.db.query(
                `INSERT INTO Inventory (pharmacy_id, dose_id, quantity, lastUpdated)
                VALUES (?, ?, ?, NOW())
                ON DUPLICATE KEY UPDATE quantity = ?, lastUpdated = NOW()`,
                [pharmacyId, doseId, dto.quantity, dto.quantity]
            );

            return { pharmacyName: pharmacy[0].name, wasUnavailable };
        } catch (error) {
            if (error instanceof HttpException) throw error;
            throw new InternalServerErrorException('Došlo je do greške pri ažuriranju inventara.');
        }
    }

    async removeScheduleException(pharmacyId: number, exId: number) {
        try {
            const existing = await this.db.query<{ id: number }[]>(
                'SELECT id FROM PrimaryScheduleException WHERE id = ? AND pharmacy_id = ?',
                [exId, pharmacyId]
            );

            if (existing.length === 0)
                throw new NotFoundException(`Izuzetak sa ID-em ${exId} ne postoji.`);

            await this.db.query(
                'DELETE FROM PrimaryScheduleException WHERE id = ?',
                [exId]
            );

            return { success: true };
        } catch (error) {
            if (error instanceof HttpException) throw error;
            throw new InternalServerErrorException('Došlo je do greške pri uklanjanju izuzetka rasporeda.');
        }
    }
}