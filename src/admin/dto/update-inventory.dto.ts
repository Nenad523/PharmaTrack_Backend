import { ApiProperty } from '@nestjs/swagger';
import { IsInt, Min } from 'class-validator';

export class UpdateInventoryDto {
    @ApiProperty({ example: 10, description: 'Količina lijeka na stanju' })
    @IsInt()
    @Min(0)
    quantity!: number;
}