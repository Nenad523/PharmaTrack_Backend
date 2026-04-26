/* eslint-disable @typescript-eslint/require-await */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable prettier/prettier */
import { Controller, Post, Request, UseGuards, Get, Body, Query } from '@nestjs/common';
import { AuthenticationService } from './authentication.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { AuthGuard } from '@nestjs/passport';
import { ApiOperation } from '@nestjs/swagger';

@Controller('api/v1/auth')
export class AuthenticationController {

    constructor(private authService: AuthenticationService) {}

    @ApiOperation({ 'summary' : 'Prijavljivanje putem emaila i lozinke'})
    @UseGuards(AuthGuard('local'))
    @Post('/login')
    async login(@Body() _loginDto: LoginDto, @Request() req){
        await new Promise<void>((resolve, reject) => {
            req.logIn(req.user, (error: unknown) => {
                if (error) {
                    reject(error instanceof Error ? error : new Error('Login failed'));
                    return;
                }

                resolve();
            });
        });

        return req.user;
    }

    @ApiOperation({ 'summary' : 'Dohvatanje podataka o trenutno prijavljenom korisniku.'})
    @Get('/me')
    getMe(@Request() req){
        return req.user;
    }

    @ApiOperation({ 'summary' : 'Odjavljivanje sa prijavljenog naloga.'})
    @Post('/logout')
    logout(@Request() req){
        req.logout(() => {});
        return { message : 'Logged out'};
    }

    @ApiOperation({ 'summary' : 'Kreiranje naloga.'})
    @Post('/register')
    async register(@Body() body: RegisterDto) {
        const { email, password, fullName } = body;

        return this.authService.register(email, password, fullName);
    }

    @ApiOperation({ 'summary' : 'Verifikacija mail adrese nakon kreiranja naloga.'})
    @Get('/verify-email')
    async verifyEmail(@Query('token') token: string){
        return this.authService.verifyEmail(token);
    }
}
