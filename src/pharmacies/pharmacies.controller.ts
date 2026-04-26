import { Controller, Get, Query } from '@nestjs/common';
import { ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { PharmaciesService } from './pharmacies.service';
import { SearchDto } from './dto/search-dto';

@ApiTags('Pharmacies')
@Controller('api/v1/pharmacies')
export class PharmaciesController {

    constructor(private service: PharmaciesService){}

    @Get('/search')
    @ApiOperation({ summary: 'Pretraga apoteka po dostupnim dozama i filterima' })
    @ApiQuery({
        name: 'doseIds',
        required: true,
        isArray: true,
        type: Number,
        description: 'Lista ID-eva doza koje apoteka treba da ima na stanju.',
        example: [1, 2],
    })
    @ApiQuery({
        name: 'uLat',
        required: false,
        type: Number,
        description: 'Geografska sirina korisnika. Obavezna uz radius ili sort=distance.',
        example: 42.4304,
    })
    @ApiQuery({
        name: 'uLng',
        required: false,
        type: Number,
        description: 'Geografska duzina korisnika. Obavezna uz radius ili sort=distance.',
        example: 19.2594,
    })
    @ApiQuery({
        name: 'sort',
        required: false,
        enum: ['az', 'distance'],
        description: 'Sortiranje po nazivu ili udaljenosti.',
        example: 'az',
    })
    @ApiQuery({
        name: 'openNow',
        required: false,
        type: Boolean,
        description: 'Vraca samo apoteke koje trenutno rade.',
        example: true,
    })
    @ApiQuery({
        name: 'onDuty',
        required: false,
        type: Boolean,
        description: 'Vraca samo apoteke koje su trenutno dezurne.',
        example: true,
    })
    @ApiQuery({
        name: 'city',
        required: false,
        isArray: true,
        type: String,
        description: 'Lista gradova po kojima se filtrira pretraga.',
        example: ['Podgorica', 'Niksic'],
    })
    @ApiQuery({
        name: 'radius',
        required: false,
        type: Number,
        description: 'Maksimalna udaljenost u kilometrima od korisnika. Trazi i uLat i uLng.',
        example: 5,
    })
    @ApiQuery({
        name: 'name',
        required: false,
        type: String,
        description: 'Dio naziva apoteke.',
        example: 'Montefarm',
    })
    @ApiQuery({
        name: 'address',
        required: false,
        type: String,
        description: 'Dio adrese apoteke.',
        example: 'Bulevar Svetog Petra Cetinjskog',
    })
    searchPharmacies(@Query() searchDto: SearchDto){
        return this.service.searchPharmacies(searchDto);
    }

}
