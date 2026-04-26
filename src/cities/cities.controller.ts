import { Controller, Get } from '@nestjs/common';
import { CitiesService } from './cities.service';
import { ApiOperation } from '@nestjs/swagger';

@Controller('api/v1/cities')
export class CitiesController {

    constructor(private service: CitiesService){}

    @ApiOperation({ 'summary' : 'Dohvatanje liste svih gradova u sistemu.' })
    @Get()
    getAllCities(){
        return this.service.getAllCities();
    }
}
