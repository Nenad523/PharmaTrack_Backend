/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable prettier/prettier */

import { Controller, Get, Query, Param } from '@nestjs/common';
import { MedicationDto } from './dto/medication-dto';
import { MedicationService } from './medication.service';
import { ParsePositiveIntPipe } from 'src/common/pipes/parse-positive-int.pipe';
import { ApiQuery } from '@nestjs/swagger';

@Controller('api/v1/medication')
export class MedicationController {

    constructor(private medicationService: MedicationService) {}

    @Get('/search')
    @ApiQuery({ name: 'name', required: false, type: String })
    searchMedications(@Query() medication: MedicationDto){
        return this.medicationService.searchAll(medication.name);
    }

    @Get(':id')
    searchMedication(@Param('id', ParsePositiveIntPipe) id: number){
        return this.medicationService.searchOne(id);
    }

    @Get(':id/doses')
    getDoses(@Param('id', ParsePositiveIntPipe) id: number){
        return this.medicationService.searchDoses(id);
    }

    @Get(':id/alternatives')
    getAlternatives(@Param('id', ParsePositiveIntPipe) id: number){
        return this.medicationService.getAlternatives(id);
    }
}
