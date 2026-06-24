import { Module } from '@nestjs/common';
import { NotificationsController } from './notifications.controller';
import { NotificationsService } from './notifications.service';
import { RepositoryService } from './repository.service';
import { EmailService } from '../authentication/email.service';
import { AuthenticationModule } from '../authentication/authentication.module';
import { JwtOrSessionGuard } from '../common/guards/jwt-or-session.guard';

@Module({
  imports: [AuthenticationModule],
  controllers: [NotificationsController],
  providers: [NotificationsService, RepositoryService, EmailService, JwtOrSessionGuard],
  exports: [NotificationsService],
})
export class NotificationsModule {}
