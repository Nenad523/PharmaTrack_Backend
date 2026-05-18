import { BadRequestException, HttpException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { CreateMedicationDto } from './dto/create-medication.dto';
import { UpdateMedicationDto } from './dto/update-medication.dto';
import { CreateIngredientDto } from './dto/create-ingredient.dto';
import { LinkIngredientDto } from './dto/link-ingredient.dto';
import { EmbeddingService } from '../common/embedding/embedding.service';
@Injectable()
export class RepositoryService {

    constructor(private db: DatabaseService, 
                private embeddingService: EmbeddingService    
            ) {}

    async createMedication(dto: CreateMedicationDto) {
        try {
            
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
}