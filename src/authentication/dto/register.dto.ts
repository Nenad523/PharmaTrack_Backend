/* eslint-disable prettier/prettier */
import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MinLength } from 'class-validator';

export class RegisterDto{
    @ApiProperty({ example: 'John Doe' })
    @IsString()
    @MinLength(2)
    fullName: string

    @ApiProperty({ example: 'john@example.com' })
    @IsEmail()
    email: string

    @ApiProperty({ example: 'StrongPass123' })
    @IsString()
    @MinLength(6)
    password: string

    verificationToken: string
    verificationTokenExpiry: Date
}
