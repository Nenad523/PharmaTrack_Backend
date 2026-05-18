import { HttpException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { CreateMedicationDto } from './dto/create-medication.dto';

@Injectable()
export class RepositoryService {

    constructor(private db: DatabaseService) {}

    async createMedication(dto: CreateMedicationDto) {
        try {
            const result = await this.db.query<{ insertId: number }>(
                'INSERT INTO Medication (name, description, isActive) VALUES (?, ?, 1)',
                [dto.name, dto.description ?? null]
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
}