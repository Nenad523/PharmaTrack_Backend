/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { MedicationRepository } from './medication-repository.service';

@Injectable()
export class MedicationService {

    constructor(private rep: MedicationRepository) {}

    searchAll(name: string){
        return this.rep.searchAll(name);
    }

    searchOne(id: number){
        return this.rep.searchOne(id);
    }

    searchDoses(id: number){
        return this.rep.searchDoses(id);
    }

    getAlternatives(id: number){
        return this.rep.getAlternatives(id);
    }

    getPopular(){
        return this.rep.getPopular();
    }

}
