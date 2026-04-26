import { Injectable } from '@nestjs/common';
import { PharmaciesRepository } from './pharmacies-repository.service';
import { SearchDto } from './dto/search-dto';

@Injectable()
export class PharmaciesService {

    constructor(private repo: PharmaciesRepository) {}

    async searchPharmacies(searchDto: SearchDto){
        const response = await this.repo.searchPharmacies(searchDto);
        return response;
    }

    async getWorkingHours(id: number){
        const response = await this.repo.getWorkingHours(id);
        return response;
    }

    async getAllOnDuty(date: string){
        const response = await this.repo.getAllOnDuty(date);
        return response;
    }
}
