import { ApiProperty } from '@nestjs/swagger';
import { IsIn, IsString, Matches } from "class-validator";

export class CreateWorkingHoursDto {
    
  @ApiProperty({ example: 'Monday' })
  @IsString()
  @IsIn(['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'])
  day_of_week!: string;

  @ApiProperty({ example: '07:00:00' })
  @IsString()
  @Matches(/^([01]\d|2[0-3]):([0-5]\d):([0-5]\d)$/, {
    message: 'Vrijeme mora biti u formatu HH:MM:SS'
  })
  open_time!: string;

  @ApiProperty({ example: '22:00:00' })
  @IsString()
  @Matches(/^([01]\d|2[0-3]):([0-5]\d):([0-5]\d)$/, {
    message: 'Vrijeme mora biti u formatu HH:MM:SS'
  })
  close_time!: string;

}