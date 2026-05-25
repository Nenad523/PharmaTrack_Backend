import { Body, Controller, Delete, Get, Param, Post, Put, Query, UseGuards } from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';
import { AdminService } from './admin.service';
import { SessionGuard } from '../common/guards/session.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { CreateMedicationDto } from './dto/create-medication.dto';
import { UpdateMedicationDto } from './dto/update-medication.dto';
import { CreateIngredientDto } from './dto/create-ingredient.dto';
import { LinkIngredientDto } from './dto/link-ingredient.dto';
import { CreateDoseDto } from './dto/create-dose.dto';
import { ParsePositiveIntPipe } from '../common/pipes/parse-positive-int.pipe';
import { CreatePharmacyDto } from './dto/create-pharmacy.dto';
import { UpdatePharmacyDto } from './dto/update-pharmacy.dto';
import { CreateWorkingHoursDto } from './dto/create-workingHours.dto';
import { UpdateWorkingHoursDto } from './dto/update-workingHours.dto';
import { CreateDutyDto } from './dto/create-duty.dto';
import { CreateScheduleExceptionDto } from './dto/create-scheduleException.dto';
import { UpdateScheduleExceptionDto } from './dto/update-scheduleException.dto';
@Controller('api/v1/admin')
@UseGuards(SessionGuard, RolesGuard)
@Roles('admin')
export class AdminController {

    constructor(private service: AdminService) {}

    @ApiOperation({ summary: 'Kreiranje novog lijeka' })
    @Post('/medications')
    async createMedication(@Body() dto: CreateMedicationDto) {
        return this.service.createMedication(dto);
    }

    @ApiOperation({ summary: 'Izmjena lijeka' })
    @Put('/medications/:id')
    async updateMedication(
        @Param('id', ParsePositiveIntPipe) id: number,
        @Body() dto: UpdateMedicationDto,
    ) {
        return this.service.updateMedication(id, dto);
    }

    @ApiOperation({ summary: 'Brisanje lijeka' })
    @Delete('/medications/:id')
    async deleteMedication(@Param('id', ParsePositiveIntPipe) id: number) {
        return this.service.deleteMedication(id);
    }

    @ApiOperation({ summary: 'Lista svih aktivnih supstanci' })
    @Get('/ingredients')
    async getAllIngredients() {
        return this.service.getAllIngredients();
    }

    @ApiOperation({ summary: 'Kreiranje nove aktivne supstance' })
    @Post('/ingredients')
    async createIngredient(@Body() dto: CreateIngredientDto) {
        return this.service.createIngredient(dto);
    }

    @ApiOperation({ summary: 'Dodavanje aktivnih supstanci lijeku' })
    @Post('/medications/:id/ingredients')
    async linkIngredients(
        @Param('id', ParsePositiveIntPipe) id: number,
        @Body() dto: LinkIngredientDto,
    ) {
        return this.service.linkIngredients(id, dto);
    }

    @ApiOperation({ summary: 'Uklanjanje aktivne supstance s lijeka' })
    @Delete('/medications/:id/ingredients/:ingredientId')
    async unlinkIngredient(
        @Param('id', ParsePositiveIntPipe) medicationId: number,
        @Param('ingredientId', ParsePositiveIntPipe) ingredientId: number,
    ) {
        return this.service.unlinkIngredient(medicationId, ingredientId);
    }

    @ApiOperation({ summary: 'Dodavanje doza lijeku' })
    @Post('/medications/:id/doses')
    async createDoses(
        @Param('id', ParsePositiveIntPipe) id: number,
        @Body() dto: CreateDoseDto,
    ) {
        return this.service.createDoses(id, dto);
    }

    @ApiOperation({ summary: 'Brisanje doze lijeka' })
    @Delete('/medications/:id/doses/:doseId')
    async deleteDose(
        @Param('id', ParsePositiveIntPipe) medicationId: number,
        @Param('doseId', ParsePositiveIntPipe) doseId: number,
    ) {
        return this.service.deleteDose(medicationId, doseId);
    }

    /// Endpointovi za apoteke V

    @ApiOperation({ summary: 'Pretraga apoteka po imenu' })
    @Get('/pharmacies')
    async searchPharmacies(@Query('name') name: string) {
        return this.service.searchPharmaciesAdmin(name ?? '');
    }

    @ApiOperation({ summary: 'Dohvatanje apoteke po ID-u za administraciju' })
    @Get('/pharmacies/:id')
    async getPharmacyById(@Param('id', ParsePositiveIntPipe) id: number) {
        return this.service.getPharmacyAdminById(id);
    }

    @ApiOperation({ summary: 'Dohvatanje radnog vremena apoteke sa ID-evima' })
    @Get('/pharmacies/:id/working-hours')
    async getPharmacyWorkingHours(@Param('id', ParsePositiveIntPipe) id: number) {
        return this.service.getPharmacyWorkingHoursAdmin(id);
    }

    @ApiOperation({ summary: 'Dohvatanje dežurstava apoteke sa ID-evima' })
    @Get('/pharmacies/:id/duty')
    async getPharmacyDuty(@Param('id', ParsePositiveIntPipe) id: number) {
        return this.service.getPharmacyDutyAdmin(id);
    }

    @ApiOperation({ summary: 'Dohvatanje izuzetaka rasporeda apoteke sa ID-evima' })
    @Get('/pharmacies/:id/schedule-exceptions')
    async getPharmacyScheduleExceptions(@Param('id', ParsePositiveIntPipe) id: number) {
        return this.service.getPharmacyScheduleExceptionsAdmin(id);
    }

    @ApiOperation({ summary : 'Dodavanje nove apoteke'})
    @Post('/pharmacies')
    async createPharmacy(
        @Body() dto: CreatePharmacyDto
    ) {
        return this.service.createPharmacy(dto);
    }

    @ApiOperation({ summary : 'Izmjenjivanje postojece apoteke'})
    @Put('/pharmacies/:id')
    async updatePharmacy(
        @Param('id', ParsePositiveIntPipe) id: number,
        @Body() dto: UpdatePharmacyDto
    ) {
        return this.service.updatePharmacy(id, dto);
    }

    @ApiOperation({ summary : 'Uklanjanje postojece apoteke'})
    @Delete('/pharmacies/:id')
    async removePharmacy(
        @Param('id', ParsePositiveIntPipe) id: number
    ) {
        return this.service.removePharmacy(id);
    }

    @ApiOperation({ summary : 'Dodavanje radnog vremena apoteke'})
    @Post('/pharmacies/:id/working-hours')
    async createWorkingHours(
        @Param('id', ParsePositiveIntPipe) id: number,
        @Body() dto: CreateWorkingHoursDto
    ) {
        return this.service.createWorkingHours(id, dto);
    }

    @ApiOperation({ summary : 'Izmjenjivanje radnog vremena apoteke'})
    @Put('/pharmacies/:id/working-hours/:whId')
    async updateWorkingHours(
        @Param('id', ParsePositiveIntPipe) id: number,
        @Param('whId', ParsePositiveIntPipe) whId: number,
        @Body() dto: UpdateWorkingHoursDto
    ) {
        return this.service.updateWorkingHours(id, whId, dto);
    }

    @ApiOperation({ summary : 'Uklanjanje radnog vremena apoteke'})
    @Delete('/pharmacies/:id/working-hours/:whId')
    async removeWorkingHours(
        @Param('id', ParsePositiveIntPipe) id: number,
        @Param('whId', ParsePositiveIntPipe) whId: number,
    ) {
        return this.service.removeWorkingHours(id, whId);
    }

    @ApiOperation({ summary: 'Dodavanje dežurstva apoteke' })
    @Post('/pharmacies/:id/duty')
    async createDuty(
        @Param('id', ParsePositiveIntPipe) id: number,
        @Body() dto: CreateDutyDto
    ) {
    return this.service.createDuty(id, dto);
    }

    @ApiOperation({ summary: 'Uklanjanje dežurstva apoteke' })
    @Delete('/pharmacies/:id/duty/:dutyId')
    async removeDuty(
        @Param('id', ParsePositiveIntPipe) id: number,
        @Param('dutyId', ParsePositiveIntPipe) dutyId: number
    ) {
    return this.service.removeDuty(id, dutyId);
    }

    @ApiOperation({ summary: 'Dodavanje izuzetka rasporeda apoteke' })
    @Post('/pharmacies/:id/schedule-exceptions')
    async createScheduleException(
        @Param('id', ParsePositiveIntPipe) id: number,
        @Body() dto: CreateScheduleExceptionDto
    ) {
    return this.service.createScheduleException(id, dto);
    }

    @ApiOperation({ summary: 'Izmjena izuzetka rasporeda apoteke' })
    @Put('/pharmacies/:id/schedule-exceptions/:exId')
    async updateScheduleException(
        @Param('id', ParsePositiveIntPipe) id: number,
        @Param('exId', ParsePositiveIntPipe) exId: number,
        @Body() dto: UpdateScheduleExceptionDto
    ) {
    return this.service.updateScheduleException(id, exId, dto);
    }

    @ApiOperation({ summary: 'Uklanjanje izuzetka rasporeda apoteke' })
    @Delete('/pharmacies/:id/schedule-exceptions/:exId')
    async removeScheduleException(
        @Param('id', ParsePositiveIntPipe) id: number,
        @Param('exId', ParsePositiveIntPipe) exId: number
    ) {
    return this.service.removeScheduleException(id, exId);
    }
}