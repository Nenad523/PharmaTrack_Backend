import { ApiProperty } from '@nestjs/swagger';
import { ArrayMinSize, IsArray, IsInt, IsPositive } from 'class-validator';

export class LinkIngredientDto {

    @ApiProperty({ example: [1, 2, 3] })
    @IsArray()
    @ArrayMinSize(1)
    @IsInt({ each: true })
    @IsPositive({ each: true })
    ingredientIds!: number[];
}