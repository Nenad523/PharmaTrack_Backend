/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable prettier/prettier */
import { Controller, Post, Body } from '@nestjs/common';
import { AuthenticationService } from './authentication.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

@Controller('api/v1/auth')
export class AuthenticationController {

    constructor(private service: AuthenticationService) {}

    @Post('/login')
    login(@Body() loginInfo: LoginDto){
        return this.service.login(loginInfo);
    }

    @Post('/register')
    register(@Body() registerInfo: RegisterDto){
        return this.service.register(registerInfo);
    }
}
