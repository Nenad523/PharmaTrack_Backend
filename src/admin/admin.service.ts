import { Injectable } from '@nestjs/common';
import { RepositoryService } from './repository.service';
import { CreateMedicationDto } from './dto/create-medication.dto';

@Injectable()
export class AdminService {

    constructor(private repo: RepositoryService) {}

    async createMedication(dto: CreateMedicationDto) {
        return this.repo.createMedication(dto);
    }
}