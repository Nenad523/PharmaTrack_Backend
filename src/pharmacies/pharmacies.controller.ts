import { Controller, Get, Query } from '@nestjs/common';
import { PharmaciesService } from './pharmacies.service';
import { SearchDto } from './dto/search-dto';

@Controller('api/v1/pharmacies')
export class PharmaciesController {

    constructor(private service: PharmaciesService){}

    @Get('/search')
    searchPharmacies(@Query() searchDto: SearchDto){
        return this.service.searchPharmacies(searchDto);
    }

}
