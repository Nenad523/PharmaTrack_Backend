import { ApiProperty } from '@nestjs/swagger';
import { ArrayMinSize, IsArray, IsString, MaxLength, MinLength } from 'class-validator';

export class CreateDoseDto {

    @ApiProperty({ example: ['500mg', '1000mg'] })
    @IsArray()
    @ArrayMinSize(1)
    @IsString({ each: true })
    @MinLength(1, { each: true })
    @MaxLength(50, { each: true })
    strengths!: string[];
}