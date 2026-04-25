import { Injectable } from '@nestjs/common';
import { RepositoryService } from './pharmacies-repository.service';
import { SearchDto } from './dto/search-dto';

@Injectable()
export class PharmaciesService {

    constructor(private repo: RepositoryService) {}

    async searchPharmacies(searchDto: SearchDto){
        const response = await this.repo.searchPharmacies(searchDto);
        return response;
    }
}
