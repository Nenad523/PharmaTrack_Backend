/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { AuthenticationService } from './authentication.service';
import { RepositoryService } from './repository.service';
import { LocalStrategy } from './local-strategy.service';
import { AuthenticationController } from './authentication.controller';
import { SessionSerializer } from './session.serializer';
import { EmailService } from './email.service';

@Module({
  imports: [PassportModule.register({ session: true })],
  controllers: [AuthenticationController],
  providers: [AuthenticationService, RepositoryService, LocalStrategy, SessionSerializer, EmailService]
})
export class AuthenticationModule {}
