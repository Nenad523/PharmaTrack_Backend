/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

@Injectable()
export class RepositoryService {

    login(loginInfo: LoginDto){
        return loginInfo;
    }

    register(registerInfo: RegisterDto){
        return registerInfo;
    }
}
