import { Injectable } from '@nestjs/common';
import { RepositoryService } from './repository.service';
import { CreateMedicationDto } from './dto/create-medication.dto';
import { UpdateMedicationDto } from './dto/update-medication.dto';

@Injectable()
export class AdminService {

    constructor(private repo: RepositoryService) {}

    async createMedication(dto: CreateMedicationDto) {
        return this.repo.createMedication(dto);
    }

    async updateMedication(id: number, dto: UpdateMedicationDto) {
        return this.repo.updateMedication(id, dto);
    }

    async deleteMedication(id: number) {
        return this.repo.deleteMedication(id);
    }
}