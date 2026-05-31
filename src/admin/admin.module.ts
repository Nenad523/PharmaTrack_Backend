import { Module } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import { RepositoryService } from './repository.service';
import { DatabaseModule } from '../database/database.module';
import { EmbeddingService } from '../common/embedding/embedding.service';
import { NotificationsModule } from '../notifications/notifications.module';

@Module({
  imports: [DatabaseModule, NotificationsModule],
  providers: [AdminService, RepositoryService, EmbeddingService],
  controllers: [AdminController],
})
export class AdminModule {}
