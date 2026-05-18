import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';
import { AdminService } from './admin.service';
import { SessionGuard } from '../common/guards/session.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { CreateMedicationDto } from './dto/create-medication.dto';

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
}