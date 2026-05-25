import { ApiProperty } from "@nestjs/swagger"
import { IsString, Matches } from "class-validator"

export class CreateDutyDto {
    
    @ApiProperty({ example : '2026-04-01 20:00:00'})
    @IsString()
    @Matches(/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/, {
        message: 'Datum mora biti u formatu YYYY-MM-DD HH:MM:SS'
    })
    start_datetime!: string

    @ApiProperty({ example : '2026-04-02 08:00:00'})
    @IsString()
    @Matches(/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/, {
        message: 'Datum mora biti u formatu YYYY-MM-DD HH:MM:SS'
    })
    end_datetime!: string
    
}