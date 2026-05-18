import { ApiProperty } from '@nestjs/swagger';
import { IsString, MaxLength, MinLength } from 'class-validator';

export class CreateDoseDto {

    @ApiProperty({ example: '500mg' })
    @IsString()
    @MinLength(1)
    @MaxLength(50)
    strength!: string;
}