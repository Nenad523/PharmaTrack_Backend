/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable prettier/prettier */

import { PipeTransform, BadRequestException, ArgumentMetadata} from "@nestjs/common";

export class ParsePositiveIntPipe implements PipeTransform{
    
    transform(value: string){
        const val = parseInt(value, 10);

        if (isNaN(val)){
            throw new BadRequestException('Invalid number');
        }

        if (val <= 0){
            throw new BadRequestException('Must be greater than 0.');
        }

        return val;
    }
}