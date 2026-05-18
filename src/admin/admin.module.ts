import { Module } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import { RepositoryController } from './repository/repository.controller';

@Module({
  providers: [AdminService],
  controllers: [AdminController, RepositoryController]
})
export class AdminModule {}
