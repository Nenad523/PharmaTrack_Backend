import { Module } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import { RepositoryController } from './repository.controller';
import { RepositoryService } from './repository.service';

@Module({
  providers: [AdminService, RepositoryService],
  controllers: [AdminController, RepositoryController]
})
export class AdminModule {}
