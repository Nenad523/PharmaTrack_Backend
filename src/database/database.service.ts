/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import * as mysql from 'mysql2/promise';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class DatabaseService {
    private pool;

    constructor(private config: ConfigService){
        this.pool = mysql.createPool({
            host: this.config.get('DB_HOST'),
            port: parseInt(this.config.get('DB_PORT') ?? '3306', 10),
            user: this.config.get('DB_USERNAME'),
            password: this.config.get('DB_PASSWORD'),
            database: this.config.get('DB_NAME')
        }) 
    }

    async query<T>(sql: string, params?: any[]): Promise<T> {
        const [rows] = await this.pool.query(sql, params);
        return rows as T;
    }
}
