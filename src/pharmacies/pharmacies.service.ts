import { Injectable } from '@nestjs/common';
import { RepositoryService } from './pharmacies-repository.service';
import { SearchDto } from './dto/search-dto';

@Injectable()
export class PharmaciesService {

    constructor(private repo: RepositoryService) {}

    searchPharmacies(searchDto: SearchDto){
        return this.repo.searchPharmacies(searchDto);
    }
}
