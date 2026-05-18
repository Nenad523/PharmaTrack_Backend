import { Module } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import { RepositoryService } from './repository.service';
import { DatabaseModule } from '../database/database.module';
import { EmbeddingService } from '../common/embedding/embedding.service';

@Module({
  imports: [DatabaseModule],
  providers: [AdminService, RepositoryService, EmbeddingService],
  controllers: [AdminController],
})
export class AdminModule {}
