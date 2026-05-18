import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsPositive } from 'class-validator';

export class LinkIngredientDto {

    @ApiProperty({ example: 1 })
    @IsInt()
    @IsPositive()
    ingredientId!: number;
}