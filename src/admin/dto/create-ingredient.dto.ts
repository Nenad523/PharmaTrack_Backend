import { ApiProperty } from '@nestjs/swagger';
import { IsString, MaxLength, MinLength } from 'class-validator';

export class CreateIngredientDto {

    @ApiProperty({ example: 'Paracetamol' })
    @IsString()
    @MinLength(2)
    @MaxLength(100)
    name!: string;
}