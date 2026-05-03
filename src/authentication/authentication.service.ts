/* eslint-disable @typescript-eslint/no-floating-promises */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable prettier/prettier */

import { BadRequestException, UnauthorizedException, Injectable } from '@nestjs/common';
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
            throw new UnauthorizedException('Email nije validan.');
        }

        if (!user.isVerified){
            throw new UnauthorizedException(
                'Email adresa nije verifikovana. Provjerite inbox.');
        }

        const isMatch = await bcrypt.compare(password, user.passwordHash);
        if (!isMatch){
            throw new UnauthorizedException(
                'Email adresa ili lozinka nije validna.');
        }

        return {
            id: user.id,
            fullName: user.fullName,
            email: user.email,
            role: user.role,
            pharmacy_id: user.pharmacy_id,
        };
    }

    async verifyEmail(token: string){

        const users = await this.rep.findByToken(token);
        if (users.length === 0){
            throw new BadRequestException('Token nije validan ili je istekao.');
        }

        await this.rep.updateToken(token);
        return { message : 'Email uspješno verifikovan. Možete se prijaviti.'};
    }

    async register(email: string, password: string, fullName: string){

        const existingUser = await this.rep.findByEmail(email);
        if (existingUser){
            throw new BadRequestException('Korisnik sa ovom email adresom već postoji.');
        }

        if (
            password.length < 12 ||
            !/[A-Z]/.test(password) ||
            !/[a-z]/.test(password) ||
            !/[0-9]/.test(password) ||
            !/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)
        ) {
            throw new BadRequestException(
                'Lozinka mora imati najmanje 12 karaktera sa velikim i malim slovima, brojem i specijalnim karakterom.'
            );
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

        await this.emailService.sendVerificationEmail(email, verificationToken);
        return { message : 'Registracija uspješna. Provjerite email za verifikaciju.'};
    }
    
}
