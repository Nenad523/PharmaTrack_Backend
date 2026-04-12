/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { DatabaseService } from 'src/database/database.service';
@Injectable()
export class RepositoryService {

    constructor(private db: DatabaseService) {};
    
    login(loginInfo: LoginDto){
        return loginInfo;
    }

    register(registerInfo: RegisterDto){
        return registerInfo;
    }
}
