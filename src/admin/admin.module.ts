import { Module } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import { RepositoryService } from './repository.service';
import { DatabaseModule } from '../database/database.module';
import { EmbeddingService } from '../common/embedding/embedding.service';
import { NotificationsModule } from '../notifications/notifications.module';
import { AuthenticationModule } from '../authentication/authentication.module';

@Module({
  imports: [DatabaseModule, NotificationsModule, AuthenticationModule],
  providers: [AdminService, RepositoryService, EmbeddingService],
  controllers: [AdminController],
})
export class AdminModule {}
