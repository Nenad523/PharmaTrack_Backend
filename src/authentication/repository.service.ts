/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable prettier/prettier */
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { User } from './types/User';
import { ResultSetHeader } from 'mysql2/promise';

type CreateUserInput = {
    fullName: string;
    email: string;
    password: string;
    verificationToken: string;
    verificationTokenExpiry: Date;
};

@Injectable()
export class RepositoryService {

    constructor(private db: DatabaseService) {};
    
    async findByEmail(email: string){
        const users = await this.db.query<User[]>(
            'SELECT * from Users WHERE email = ?', [email]);
        
        return users[0] ?? null;
    }

    async findById(id: number){
        const users = await this.db.query<User[]>(
            'SELECT * from Users WHERE id = ?', [id]);

        return users[0] ?? null;
    }

    async findByToken(verificationToken: string){
        const users = await this.db.query<any[]>(
            'SELECT * from Users WHERE verificationToken = ? \
             AND verificationTokenExpiry > NOW()', [verificationToken]
        );

        return users;
    }

    async updateToken(verificationToken: string){
        const result = await this.db.query<ResultSetHeader>(
            'UPDATE Users SET \
                isVerified=1, \
                verificationTokenExpiry=NULL,\
                verificationToken=NULL \
                WHERE verificationToken=?', [verificationToken]
        );

        if (result.affectedRows === 0){
            throw new InternalServerErrorException('Došlo je do greške.');
        }
    }

    async create({fullName, email, password, verificationToken, verificationTokenExpiry}: CreateUserInput){
        const result = await this.db.query<ResultSetHeader>(
            'INSERT INTO Users \
            (fullName, email, passwordHash, role, verificationToken, verificationTokenExpiry) VALUES (?, ?, ?, ?, ?, ?)',
            [fullName, email, password, 'user', verificationToken, verificationTokenExpiry]
        );

        if (result.affectedRows === 0) {
            throw new Error('User was not created');
        }

        return { id: result.insertId, email, fullName };
    }
}
