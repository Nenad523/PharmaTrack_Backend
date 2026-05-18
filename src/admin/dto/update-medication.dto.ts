import { ApiProperty } from "@nestjs/swagger";
import { IsOptional, IsString, MaxLength, MinLength } from "class-validator";

export class UpdateMedicationDto {

    @ApiProperty({ example : 'Paracetamol Galenika'})
    @IsOptional()
    @IsString()
    @MinLength(3)
    @MaxLength(100)
    name?: string;

    @ApiProperty({ example: 'Tablete protiv bolova i povišene temperature.'})
    @IsOptional()
    @IsString()
    @MinLength(10, { message: 'Opis mora imati minimum 10 karaktera' })
    @MaxLength(1000)
    description?: string;

}