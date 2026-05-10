/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { MedicationController } from './medication.controller';
import { MedicationService } from './medication.service';
import { MedicationRepository } from './medication-repository.service';
import { EmbeddingService } from '../common/embedding/embedding.service';
@Module({
  controllers: [MedicationController],
  providers: [MedicationService, MedicationRepository, EmbeddingService]
})
export class MedicationModule {}
