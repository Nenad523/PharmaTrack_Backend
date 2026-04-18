/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable prettier/prettier */
import { Controller, Post, Request, UseGuards, Get, Body } from '@nestjs/common';
import { AuthenticationService } from './authentication.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('api/v1/auth')
export class AuthenticationController {

    constructor(private authService: AuthenticationService) {}

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

    @Get('/me')
    getMe(@Request() req){
        return req.user;
    }

    @Post('/logout')
    logout(@Request() req){
        req.logout(() => {});
        return { message : 'Logged out'};
    }

    @Post('/register')
    async register(@Body() body: RegisterDto) {
        const { email, password, fullName } = body;

        const user = await this.authService.register(email, password, fullName);

        return {
            id: user.id,
            email: user.email,
            fullName: user.fullName,
        };
    }
}
