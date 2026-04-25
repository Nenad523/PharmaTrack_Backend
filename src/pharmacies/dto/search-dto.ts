import { Transform, Type } from 'class-transformer';
import {
    ArrayNotEmpty,
    IsArray,
    IsBoolean,
    IsDefined,
    IsIn,
    IsInt,
    IsNumber,
    IsOptional,
    IsString,
    Max,
    Min,
    ValidateIf,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class SearchDto {

    @ApiProperty({
        type: [Number],
        example: [1, 2],
        description: 'Lista ID-eva doza koje apoteka treba da ima na stanju.',
    })
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
    @ApiPropertyOptional({
        example: 42.4304,
        description: 'Geografska sirina korisnika. Obavezna uz radius ili sort=distance.',
    })
    @IsDefined({ message: 'uLat je obavezan kada koristis radius, sort=distance ili uLng.' })
    @Type(() => Number)
    @IsNumber()
    @Min(-90)
    @Max(90)
    uLat?: number;

    @ValidateIf((o) =>
        o.uLat !== undefined ||
        o.uLng !== undefined ||
        o.radius !== undefined ||
        o.sort === 'distance',
    )
    @ApiPropertyOptional({
        example: 19.2594,
        description: 'Geografska duzina korisnika. Obavezna uz radius ili sort=distance.',
    })
    @IsDefined({ message: 'uLng je obavezan kada koristis radius, sort=distance ili uLat.' })
    @Type(() => Number)
    @IsNumber()
    @Min(-180)
    @Max(180)
    uLng?: number;

    @ApiPropertyOptional({
        enum: ['az', 'distance'],
        default: 'az',
        description: 'Sortiranje po nazivu ili udaljenosti.',
    })
    @IsOptional()
    @IsIn(['az', 'distance'])
    sort: string = 'az';

    @ApiPropertyOptional({
        example: true,
        description: 'Vraca samo apoteke koje trenutno rade.',
    })
    @IsOptional()
    @Transform(({ value }) => value === 'true' || value === true)
    @IsBoolean()
    openNow?: boolean;

    @ApiPropertyOptional({
        example: true,
        description: 'Vraca samo apoteke koje su trenutno dezurne.',
    })
    @IsOptional()
    @Transform(({ value }) => value === 'true' || value === true)
    @IsBoolean()
    onDuty?: boolean;

    @ApiPropertyOptional({
        type: [String],
        example: ['Podgorica', 'Niksic'],
        description: 'Lista gradova po kojima se filtrira pretraga.',
    })
    @IsOptional()
    @Transform(({ value }) => Array.isArray(value) ? value : [value])
    @IsArray()
    @IsString({ each: true })
    city?: string[];

    @ApiPropertyOptional({
        example: 5,
        description: 'Maksimalna udaljenost u kilometrima od korisnika. Trazi i uLat i uLng.',
    })
    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    @Min(1)
    radius?: number;

    @ApiPropertyOptional({
        example: 'Montefarm',
        description: 'Dio naziva apoteke.',
    })
    @IsOptional()
    @IsString()
    name?: string;

    @ApiPropertyOptional({
        example: 'Bulevar Svetog Petra Cetinjskog',
        description: 'Dio adrese apoteke.',
    })
    @IsOptional()
    @IsString()
    address?: string;
}
