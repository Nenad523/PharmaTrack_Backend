
import { Type, Transform } from 'class-transformer'
import { 
    IsInt, 
    Min,
    IsNumber,
    Max,
    IsOptional,
    IsDefined,
    IsString,
    IsBoolean,
    IsArray,
    IsIn,
    ArrayNotEmpty,
    ValidateIf
} from "class-validator";

import {
    ApiProperty,
    ApiPropertyOptional
} from '@nestjs/swagger' 

export class SearchDto {
    
    @Transform(({ value }) => Array.isArray(value) ? value : [value])
    @Type(() => Number)
    @IsArray()
    @ArrayNotEmpty()
    @IsInt({ each: true })
    @Min(0, { each: true })
    doseIds!: number[];

    @ValidateIf((o) =>
        o.uLat !== undefined ||
        o.uLng !== undefined ||
        o.radius !== undefined ||
        o.sort === 'distance',
    )
    @IsDefined({ message: 'uLat je obavezan kada koristis radius, sort=distance ili uLng.' })
    @Type(() => Number)
    @IsNumber()
    @Min(-90)
    @Max(90)
    uLat?: number; // x kooridnata korisnika koja se koristi pri soritanju rezultata
    
    @ValidateIf((o) =>
        o.uLat !== undefined ||
        o.uLng !== undefined ||
        o.radius !== undefined ||
        o.sort === 'distance',
    )
    @IsDefined({ message: 'uLng je obavezan kada koristis radius, sort=distance ili uLat.' })
    @Type(() => Number)
    @IsNumber()
    @Min(-180)
    @Max(180)
    uLng?: number; // y kooridnata korisnika koja se koristi pri soritanju rezultata

    @IsOptional()
    @IsIn(['az', 'distance'])
    sort: string = 'az';

    @IsOptional()
    @Transform(({value}) => value === 'true' || value === true)
    @IsBoolean()
    openNow?: boolean; // filter samo aktivnih apoteka
    
    @IsOptional()
    @Transform(({value}) => value === 'true' || value === true)
    @IsBoolean()
    onDuty?: boolean; // filter samo dezurnih apoteka

    @IsOptional()
    @Transform(({value}) => Array.isArray(value) ? value : [value])
    @IsArray()
    @IsString({ each: true })
    city?: string[]; // filtriranje po gradovima

    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    @Min(1)
    radius?: number; // filtriranje po udaljenosti od korisnika
    
    @IsOptional()
    @IsString()
    name?: string; // filtiriranje po nazivu apoteke

    @IsOptional()
    @IsString()
    address?: string; // filtiranje po adresi apoteke;
}
