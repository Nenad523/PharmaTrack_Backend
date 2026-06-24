/* eslint-disable prettier/prettier */
import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import type { JwtPayload } from '../../authentication/jwt.strategy';

@Injectable()
export class JwtOrSessionGuard implements CanActivate {
    constructor(private jwtService: JwtService) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();

        if (request.user) return true;

        const authHeader = request.headers.authorization as string | undefined;
        if (!authHeader?.startsWith('Bearer ')) {
            throw new UnauthorizedException('Morate biti prijavljeni');
        }

        try {
            const token = authHeader.slice(7);
            const payload = await this.jwtService.verifyAsync<JwtPayload>(token, {
                secret: process.env.JWT_SECRET,
            });
            request.user = { id: payload.sub, email: payload.email, role: payload.role };
            return true;
        } catch {
            throw new UnauthorizedException('Nevažeći token.');
        }
    }
}
