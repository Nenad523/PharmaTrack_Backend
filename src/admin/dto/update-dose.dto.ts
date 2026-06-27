import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean } from 'class-validator';

export class UpdateDoseDto {
    @ApiProperty({ example: true })
    @IsBoolean()
    is_refundable!: boolean;
}
