/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { AuthenticationService } from './authentication.service';
import { RepositoryService } from './repository.service';
import { LocalStrategy } from './local-strategy.service';
import { JwtStrategy } from './jwt.strategy';
import { AuthenticationController } from './authentication.controller';
import { SessionSerializer } from './session.serializer';
import { EmailService } from './email.service';

@Module({
  imports: [
    PassportModule.register({ session: true }),
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '30d' },
    }),
  ],
  controllers: [AuthenticationController],
  providers: [AuthenticationService, RepositoryService, LocalStrategy, JwtStrategy, SessionSerializer, EmailService],
  exports: [JwtModule],
})
export class AuthenticationModule {}
