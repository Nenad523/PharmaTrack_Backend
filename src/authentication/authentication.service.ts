/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable prettier/prettier */

import { Injectable } from '@nestjs/common';
import { RepositoryService } from './repository.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

@Injectable()
export class AuthenticationService {

    constructor(private rep: RepositoryService){}

    login(loginInfo: LoginDto){
        return this.rep.login(loginInfo);
    }

    register(registerInfo: RegisterDto){
        return this.rep.register(registerInfo);
    }
}
