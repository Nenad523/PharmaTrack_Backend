/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable prettier/prettier */

import { IsString, MinLength, IsInt, Min, IsOptional } from 'class-validator';

export class MedicationDto {
    
    @IsString()
    @MinLength(3, { message : "Medication name must be at least 3 characters long."})
    name!: string;
}