/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { User } from './types/User';
import { RegisterDto } from './dto/register.dto';
import { ResultSetHeader } from 'mysql2/promise';
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

    async create({fullName, email, password, verificationToken, verificationTokenExpiry}: RegisterDto){
        const result = await this.db.query<ResultSetHeader>(
            'INSERT INTO Users \
            (fullName, email, passwordHash, role, verificationToken, verificationTokenExpiry) VALUES (?, ?, ?, ?)',
            [fullName, email, password, 'user', verificationToken, verificationTokenExpiry]
        );

        if (result.affectedRows === 0) {
            throw new Error('User was not created');
        }

        return { id: result.insertId, email, fullName };
    }
}
