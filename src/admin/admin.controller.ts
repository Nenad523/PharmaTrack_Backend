import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards } from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';
import { AdminService } from './admin.service';
import { SessionGuard } from '../common/guards/session.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { CreateMedicationDto } from './dto/create-medication.dto';
import { UpdateMedicationDto } from './dto/update-medication.dto';
import { CreateIngredientDto } from './dto/create-ingredient.dto';
import { LinkIngredientDto } from './dto/link-ingredient.dto';
import { ParsePositiveIntPipe } from '../common/pipes/parse-positive-int.pipe';

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
}