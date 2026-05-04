/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable prettier/prettier */

import { Controller, Get, Query, Param } from '@nestjs/common';
import { MedicationDto } from './dto/medication-dto';
import { MedicationService } from './medication.service';
import { ParsePositiveIntPipe } from '../common/pipes/parse-positive-int.pipe';
import { ApiOperation, ApiQuery } from '@nestjs/swagger';

@Controller('api/v1/medication')
export class MedicationController {

    constructor(private medicationService: MedicationService) {}

    @ApiOperation({ 'summary' : 'Pretraga lijekova po nazivu.'})
    @Get('/search')
    @ApiQuery({ name: 'name', required: false, type: String })
    searchMedications(@Query() medication: MedicationDto){
        return this.medicationService.searchAll(medication.name);
    }

    @ApiOperation({ 'summary' : 'Dohvatanje popularnih lijekova'})
    @Get('/popular')
    getPopular(){
        return this.medicationService.getPopular();
    }

    @ApiOperation({ 'summary' : 'Dohvatanje detaljnih informacija o konkretnom lijeku.'})
    @Get(':id')
    searchMedication(@Param('id', ParsePositiveIntPipe) id: number){
        return this.medicationService.searchOne(id);
    }

    @ApiOperation({ 'summary' : 'Dohvatanje svih aktivnih doza za odabrani lijek.'})
    @Get(':id/doses')
    getDoses(@Param('id', ParsePositiveIntPipe) id: number){
        return this.medicationService.searchDoses(id);
    }

    @ApiOperation({ 'summary' : 'Dohvatanje alternativnih lijekova koji dijele istu aktivnu supstancu.'})
    @Get(':id/alternatives')
    getAlternatives(@Param('id', ParsePositiveIntPipe) id: number){
        return this.medicationService.getAlternatives(id);
    }

}
