/* eslint-disable prettier/prettier */

import { Injectable } from '@nestjs/common';
import { RepositoryService } from './repository.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthenticationService {

    constructor(private rep: RepositoryService){}

    async validateUser(email: string, password: string){
        
        const user = await this.rep.findByEmail(email);
        if (!user){
            return null;
        }

        const isMatch = await bcrypt.compare(password, user.passwordHash);
        if (!isMatch){
            return null;
        }

        return {
            id: user.id,
            fullName: user.fullName,
            email: user.email,
            role: user.role,
            pharmacy_id: user.pharmacy_id,
        };
    }

    async register(email: string, password: string, fullName: string){
        
        const existingUser = await this.rep.findByEmail(email);
        if (existingUser){
            throw new Error('User already exists');
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await this.rep.create({
            fullName,
            email,
            password: hashedPassword
        });

        return user;
    }
    
}
