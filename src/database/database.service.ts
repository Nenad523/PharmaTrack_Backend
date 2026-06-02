/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable prettier/prettier */
import { Injectable, OnModuleDestroy, Logger } from '@nestjs/common';
import * as mysql from 'mysql2/promise';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class DatabaseService implements OnModuleDestroy {
    private pool;
    private logger = new Logger('DatabaseService');

    constructor(private config: ConfigService) {
        this.pool = mysql.createPool({
        host: this.config.get('DB_HOST'),
        port: parseInt(this.config.get('DB_PORT') ?? '3306', 10),
        user: this.config.get('DB_USERNAME'),
        password: this.config.get('DB_PASSWORD'),
        database: this.config.get('DB_NAME'),
        waitForConnections: true,
        connectionLimit: 10,
        queueLimit: 0,
        supportBigNumbers: true,
        bigNumberStrings: true,
        authPlugins: {
            caching_sha2_password: () => () => Buffer.alloc(0),
        },
        });

        this.pool.on('connection', (connection) => {
            const tz = this.config.get('DB_TIMEZONE') ?? 'Europe/Sarajevo';
            connection.query(`SET time_zone = '${tz}'`, (err) => {
                if (err) {
                    this.logger.error(`Failed to set timezone on connection: ${err.message}`);
                }
            });
        });
    }

    async onModuleDestroy() {
        await this.pool.end();
    }

    async query<T>(
            sql: string,
            params?: (string | number | boolean | null)[]
        ): Promise<T> {

        if (!sql || typeof sql !== 'string'){
            throw new Error('SQL query must be a non-empty string');
        }

        const placeholderCount = (sql.match(/\?/g) || []).length
        if (placeholderCount > 0 && (!params || params.length !== placeholderCount)) {
            this.logger.warn(`Query parameter mismatch: expected ${placeholderCount}, got ${params?.length || 0}`);
            throw new Error('SQL parameter count mismatch');
        }

        try {
            const [rows] = await this.pool.query(sql, params || []);
            return rows as T;
        } catch (error) {
            this.logger.error(`Database query failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
            throw error;
        }
    }
}
