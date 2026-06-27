/* eslint-disable prettier/prettier */
import { Injectable, NestMiddleware, BadRequestException } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

const CSRF_EXEMPT_PATHS = ['/api/v1/auth/login', '/api/v1/auth/register', '/api/v1/auth/mobile-login', '/api/v1/upload/medication-image', '/api/v1/upload/pharmacy-image', '/api/v1/medication/transcribe'];
const SAFE_METHODS = ['GET', 'HEAD', 'OPTIONS'];

@Injectable()
export class CsrfMiddleware implements NestMiddleware {
    use(req: Request, res: Response, next: NextFunction) {
        if (SAFE_METHODS.includes(req.method)) {
            return next();
        }

        const reqPath = req.originalUrl.split('?')[0];
        if (CSRF_EXEMPT_PATHS.includes(reqPath)) {
            return next();
        }

        // JWT-authenticated requests are inherently CSRF-safe (no cookies)
        if ((req.headers.authorization as string)?.startsWith('Bearer ')) {
            return next();
        }

        const token = req.headers['x-csrf-token'] as string;
        const sessionToken = (req.session as any)?.csrfToken;

        if (!token || !sessionToken || token !== sessionToken) {
            throw new BadRequestException('CSRF token nije validan.');
        }

        next();
    }
}
