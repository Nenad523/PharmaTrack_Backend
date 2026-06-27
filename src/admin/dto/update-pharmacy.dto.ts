/* eslint-disable prettier/prettier */
import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsOptional, IsString, MinLength, MaxLength, IsNumber, Min, Max } from 'class-validator';

export class UpdatePharmacyDto {
    
  @ApiProperty({ example: 'Apoteka Zdravlje' })
  @IsOptional()
  @IsString()
  @MinLength(3)
  @MaxLength(100)
  name?: string;

  @ApiProperty({ example: 'Bulevar Svetog Petra Cetinjskog 12, Podgorica' })
  @IsOptional()
  @IsString()
  @MinLength(5)
  @MaxLength(200)
  address?: string;

  @ApiProperty({ example: 42.441286 })
  @IsOptional()
  @IsNumber()
  @Min(-90)
  @Max(90)
  latitude?: number;

  @ApiProperty({ example: 19.262892 })
  @IsOptional()
  @IsNumber()
  @Min(-180)
  @Max(180)
  longitude?: number;

  @ApiProperty({ example: 1 })
  @IsOptional()
  @IsNumber()
  city_id?: number;

  @ApiProperty({ example: false })
  @IsOptional()
  @IsBoolean()
  is_state?: boolean;
}