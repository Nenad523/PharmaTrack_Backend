import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsPositive } from 'class-validator';

export class CreateNotificationDto {
    @ApiProperty({ example: 1, description: 'ID doze lijeka' })
    @IsInt()
    @IsPositive()
    dose_id!: number;
}
