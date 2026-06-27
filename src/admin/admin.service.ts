import { Injectable } from '@nestjs/common';
import { RepositoryService } from './repository.service';
import { CreateMedicationDto } from './dto/create-medication.dto';
import { UpdateMedicationDto } from './dto/update-medication.dto';
import { CreateIngredientDto } from './dto/create-ingredient.dto';
import { LinkIngredientDto } from './dto/link-ingredient.dto';
import { CreateDoseDto } from './dto/create-dose.dto';
import { UpdateDoseDto } from './dto/update-dose.dto';
import { CreatePharmacyDto } from './dto/create-pharmacy.dto';
import { UpdatePharmacyDto } from './dto/update-pharmacy.dto';
import { CreateWorkingHoursDto } from './dto/create-workingHours.dto';
import { UpdateWorkingHoursDto } from './dto/update-workingHours.dto';
import { CreateDutyDto } from './dto/create-duty.dto';
import { CreateScheduleExceptionDto } from './dto/create-scheduleException.dto';
import { UpdateScheduleExceptionDto } from './dto/update-scheduleException.dto';
import { UpdateInventoryDto } from './dto/update-inventory.dto';
import { NotificationsService } from '../notifications/notifications.service';

@Injectable()
export class AdminService {

    constructor(
        private repo: RepositoryService,
        private notificationsService: NotificationsService,
    ) {}

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

    async updateDose(medicationId: number, doseId: number, dto: UpdateDoseDto) {
        return this.repo.updateDose(medicationId, doseId, dto);
    }

    async createPharmacy(dto: CreatePharmacyDto) {
        return this.repo.createPharmacy(dto);
    }

    async updatePharmacy(id: number, dto: UpdatePharmacyDto) {
        return this.repo.updatePharmacy(id, dto);
    }

    async removePharmacy(id: number) {
        return this.repo.removePharmacy(id);
    }

    async createWorkingHours(id: number, dto: CreateWorkingHoursDto) {
        return this.repo.createWorkingHours(id, dto);
    }

    async updateWorkingHours(id: number, whId: number, dto: UpdateWorkingHoursDto) {
        return this.repo.updateWorkingHours(id, whId, dto);
    }

    async removeWorkingHours(id: number, whId: number) {
        return this.repo.removeWorkingHours(id, whId);
    }

    async createDuty(id: number, dto: CreateDutyDto) {
        return this.repo.createDuty(id, dto);
    }

    async removeDuty(id: number, dutyId: number) {
        return this.repo.removeDuty(id, dutyId);
    }

    async createScheduleException(id: number, dto: CreateScheduleExceptionDto) {
        return this.repo.createScheduleException(id, dto);
    }

    async updateScheduleException(id: number, exId: number, dto: UpdateScheduleExceptionDto) {
        return this.repo.updateScheduleException(id, exId, dto);
    }

    async removeScheduleException(id: number, exId: number) {
        return this.repo.removeScheduleException(id, exId);
    }

    async updateInventory(pharmacyId: number, doseId: number, dto: UpdateInventoryDto) {
        const result = await this.repo.updateInventory(pharmacyId, doseId, dto);
        console.log(`[updateInventory] wasUnavailable=${result.wasUnavailable}, quantity=${dto.quantity}`);
        if (dto.quantity > 0 && result.wasUnavailable) {
            console.log(`[updateInventory] Okidam triggerForDose...`);
            void this.notificationsService.triggerForDose(doseId, result.pharmacyName);
        }
        return { success: true };
    }
  
    async searchPharmaciesAdmin(name: string) {
        return this.repo.searchPharmaciesAdmin(name);
    }

    async getPharmacyAdminById(id: number) {
        return this.repo.getPharmacyAdminById(id);
    }

    async getPharmacyWorkingHoursAdmin(pharmacyId: number) {
        return this.repo.getPharmacyWorkingHoursAdmin(pharmacyId);
    }

    async getPharmacyDutyAdmin(pharmacyId: number) {
        return this.repo.getPharmacyDutyAdmin(pharmacyId);
    }

    async getPharmacyScheduleExceptionsAdmin(pharmacyId: number) {
        return this.repo.getPharmacyScheduleExceptionsAdmin(pharmacyId);
    }
}