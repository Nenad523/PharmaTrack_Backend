import { HttpException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { CreateMedicationDto } from './dto/create-medication.dto';
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
}