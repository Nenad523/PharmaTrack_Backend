import { Controller, Get, Query } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { PharmaciesService } from './pharmacies.service';
import { SearchDto } from './dto/search-dto';

@ApiTags('Pharmacies')
@Controller('api/v1/pharmacies')
export class PharmaciesController {

    constructor(private service: PharmaciesService){}

    @Get('/search')
    @ApiOperation({ summary: 'Pretraga apoteka po dostupnim dozama i filterima' })
    searchPharmacies(@Query() searchDto: SearchDto){
        return this.service.searchPharmacies(searchDto);
    }

}
