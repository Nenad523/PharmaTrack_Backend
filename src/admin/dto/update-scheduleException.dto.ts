import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean, IsOptional, IsString, Matches, IsIn } from "class-validator";

export class UpdateScheduleExceptionDto {

    @ApiProperty({ example: '2026-01-01'})
    @IsOptional()
    @IsString()
    @Matches(/^\d{4}-\d{2}-\d{2}/, {
        message: 'Datum mora biti u formatu YYYY-MM-DD'
    })
    exception_date?: string

    @ApiProperty({ example: 'Nova Godina'})
    @IsOptional()
    @IsString()
    name?: string

    @ApiProperty({ example: '19:00:00'})
    @IsOptional()
    @IsString()
    @Matches(/^([01]\d|2[0-3]):([0-5]\d):([0-5]\d)$/, {
        message: 'Vrijeme mora biti u formatu HH:MM:SS'
    })
    open_time?: string

    @ApiProperty({ example: '23:00:00'})
    @IsOptional()
    @IsString()
    @Matches(/^([01]\d|2[0-3]):([0-5]\d):([0-5]\d)$/, {
        message: 'Vrijeme mora biti u formatu HH:MM:SS'
    })
    close_time?: string

    @ApiProperty({ example: 'True/False'})
    @IsOptional()
    @IsBoolean()
    is_closed?: boolean

    @ApiProperty({ example: 'holiday' })
    @IsOptional()
    @IsIn(['holiday', 'special_hours', 'closure'], {
        message: "Razlog mora biti 'holiday', 'special_hours' ili 'closure'"
    })
    reason?: string
}