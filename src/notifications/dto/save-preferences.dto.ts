import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean } from 'class-validator';

export class SavePreferencesDto {
    @ApiProperty({ example: true, description: 'Da li su email obavještenja uključena' })
    @IsBoolean()
    email_enabled!: boolean;
}
