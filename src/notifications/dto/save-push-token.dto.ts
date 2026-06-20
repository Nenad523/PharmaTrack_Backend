import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class SavePushTokenDto {
    @ApiProperty({ example: 'ExponentPushToken[xxxxxxxxxxxxxxxxxxxxxx]', description: 'Expo push token uređaja' })
    @IsString()
    @IsNotEmpty()
    token!: string;
}
