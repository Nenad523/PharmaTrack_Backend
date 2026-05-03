/* eslint-disable @typescript-eslint/require-await */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable prettier/prettier */
import { Controller, Post, Request, UseGuards, Get, Body, Query, BadRequestException } from '@nestjs/common';
import { AuthenticationService } from './authentication.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { AuthGuard } from '@nestjs/passport';
import { ApiOperation } from '@nestjs/swagger';
import { Throttle } from '@nestjs/throttler';

@Controller('api/v1/auth')
export class AuthenticationController {

    constructor(private authService: AuthenticationService) {}
    
    @ApiOperation({ 'summary' : 'Prijavljivanje putem emaila i lozinke'})
    @Throttle( { default : { limit: 5, ttl: 300000 } } )
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
    async logout(@Request() req): Promise<{ message: string }> {
        await new Promise<void>((resolve, reject) => {
            req.logout((err: Error) => {
                if (err) reject(err);
                else resolve();
            });
        });

        await new Promise<void>((resolve) => {
            req.session.destroy(() => resolve());
        });

        return { message: 'Logged out' };
    }

    @ApiOperation({ 'summary' : 'Kreiranje naloga.'})
    @Throttle( { default : { limit: 3, ttl: 600000}} )
    @Post('/register')
    async register(@Body() body: RegisterDto) {
        const { email, password, fullName } = body;

        return this.authService.register(email, password, fullName);
    }

    @ApiOperation({ 'summary' : 'Verifikacija mail adrese nakon kreiranja naloga.'})
    @Throttle({ default: { limit: 5, ttl: 3600000 } })
    @Get('/verify-email')
    async verifyEmail(@Query('token') token: string){
        if (!token || !/^[a-f0-9]{64}$/.test(token)) {
            // Constant-time delay prevents timing-based token enumeration
            await new Promise(resolve => setTimeout(resolve, 100 + Math.random() * 100));
            throw new BadRequestException('Token nije validan.');
        }

        try {
            return await this.authService.verifyEmail(token);
        } catch {
            await new Promise(resolve => setTimeout(resolve, 100 + Math.random() * 100));
            throw new BadRequestException('Token nije validan ili je istekao.');
        }
    }

    @ApiOperation({ 'summary' : 'Dohvatanje CSRF tokena za tekuću sesiju.' })
    @Get('/csrf-token')
    getCsrfToken(@Request() req){
        return { csrfToken: (req.session as any).csrfToken ?? null };
    }
}
