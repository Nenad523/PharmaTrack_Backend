import { Injectable } from '@nestjs/common';
import { RepositoryService } from './repository.service';
import { CreateMedicationDto } from './dto/create-medication.dto';
import { UpdateMedicationDto } from './dto/update-medication.dto';
import { CreateIngredientDto } from './dto/create-ingredient.dto';
import { LinkIngredientDto } from './dto/link-ingredient.dto';
import { CreateDoseDto } from './dto/create-dose.dto';

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

    async getAllIngredients() {
        return this.repo.getAllIngredients();
    }

    async createIngredient(dto: CreateIngredientDto) {
        return this.repo.createIngredient(dto);
    }

    async linkIngredients(medicationId: number, dto: LinkIngredientDto) {
        return this.repo.linkIngredients(medicationId, dto);
    }

    async unlinkIngredient(medicationId: number, ingredientId: number) {
        return this.repo.unlinkIngredient(medicationId, ingredientId);
    }

    async createDoses(medicationId: number, dto: CreateDoseDto) {
        return this.repo.createDoses(medicationId, dto);
    }

    async deleteDose(medicationId: number, doseId: number) {
        return this.repo.deleteDose(medicationId, doseId);
    }
}