/* eslint-disable prettier/prettier */
import { ApiProperty } from '@nestjs/swagger';
import { IsString, MinLength, MaxLength, IsNumber, Min, Max } from 'class-validator';

export class CreatePharmacyDto {
    
  @ApiProperty({ example: 'Apoteka Zdravlje' })
  @IsString()
  @MinLength(3)
  @MaxLength(100)
  name!: string;

  @ApiProperty({ example: 'Bulevar Svetog Petra Cetinjskog 12, Podgorica' })
  @IsString()
  @MinLength(5)
  @MaxLength(200)
  address!: string;

  @ApiProperty({ example: 42.441286 })
  @IsNumber()
  @Min(-90)
  @Max(90)
  latitude!: number;

  @ApiProperty({ example: 19.262892 })
  @IsNumber()
  @Min(-180)
  @Max(180)
  longitude!: number;

  @ApiProperty({ example: 1 })
  @IsNumber()
  city_id!: number;
}