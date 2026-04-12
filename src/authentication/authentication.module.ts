/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { AuthenticationService } from './authentication.service';
import { RepositoryService } from './repository.service';

@Module({
  providers: [AuthenticationService, RepositoryService]
})
export class AuthenticationModule {}
