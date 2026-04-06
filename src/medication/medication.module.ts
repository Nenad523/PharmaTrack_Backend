/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { MedicationController } from './medication.controller';
import { MedicationService } from './medication.service';
import { MedicationRepository } from './medication-repository.service';

@Module({
  controllers: [MedicationController],
  providers: [MedicationService, MedicationRepository]
})
export class MedicationModule {}
