import { Module } from '@nestjs/common';
import { NotificationsController } from './notifications.controller';
import { NotificationsService } from './notifications.service';
import { RepositoryService } from './repository.service';
import { EmailService } from '../authentication/email.service';

@Module({
  controllers: [NotificationsController],
  providers: [NotificationsService, RepositoryService, EmailService],
  exports: [NotificationsService],
})
export class NotificationsModule {}
