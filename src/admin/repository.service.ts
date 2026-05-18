import { BadRequestException, HttpException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { CreateMedicationDto } from './dto/create-medication.dto';
import { EmbeddingService } from '../common/embedding/embedding.service';
import { UpdateMedicationDto } from './dto/update-medication.dto';
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
}