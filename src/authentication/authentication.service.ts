/* eslint-disable prettier/prettier */

import { Injectable } from '@nestjs/common';
import { RepositoryService } from './repository.service';
import * as bcrypt from 'bcrypt';
import { EmailService } from './email.service';
import * as crypto from 'crypto';

@Injectable()
export class AuthenticationService {

    constructor(private rep: RepositoryService, private emailService: EmailService){}

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

        const verificationToken = crypto.randomBytes(32).toString('hex');
        const verificationTokenExpiry = new Date(Date.now() + 24*60*60*1000);

        await this.rep.create({
            fullName,
            email,
            password: hashedPassword,
            verificationToken,
            verificationTokenExpiry
        });

        this.emailService.sendVerificationEmail(email, verificationToken);
        return { message : 'Registracija uspješna. Provjerite email za verifikaciju.'};
    }
    
}
