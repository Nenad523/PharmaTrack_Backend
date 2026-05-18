import { Body, Controller, Delete, Param, Post, Put, UseGuards } from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';
import { AdminService } from './admin.service';
import { SessionGuard } from '../common/guards/session.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { CreateMedicationDto } from './dto/create-medication.dto';
import { UpdateMedicationDto } from './dto/update-medication.dto';
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
}