import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
@Injectable()
export class CitiesService {

    constructor(private db: DatabaseService){}

    async getAllCities(){
        const response = await this.db.query<string[]>(
            'SELECT id, name from City'
        );

        if (response.length === 0){
            throw new InternalServerErrorException('Došlo je do greške.');
        }

        return {
            success: true,
            data: response,
            count: response.length
        }
    }
}
