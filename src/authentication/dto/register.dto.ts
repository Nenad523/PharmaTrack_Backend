/* eslint-disable prettier/prettier */
import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MinLength, MaxLength, Matches } from 'class-validator';

export class RegisterDto {
  @ApiProperty({ example: 'John Doe' })
  @IsString()
  @MinLength(2, { message: 'Ime mora imati minimum 2 karaktera' })
  @MaxLength(100, { message: 'Ime može imati maksimalno 100 karaktera' })
  fullName!: string

  @ApiProperty({ example: 'john@example.com' })
  @IsEmail({}, { message: 'Unesite ispravnu email adresu' })
  @MaxLength(255, { message: 'Email može imati maksimalno 255 karaktera' })
  email!: string

  @ApiProperty({ example: 'StrongPass123!' })
  @IsString()
  @MinLength(8, { message: 'Lozinka mora imati minimum 8 karaktera' })
  @MaxLength(128, { message: 'Lozinka može imati maksimalno 128 karaktera' })
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, {
    message: 'Lozinka mora sadržavati velika slova, mala slova i brojeve'
  })
  password!: string
}