import { Module } from '@nestjs/common';
import { PharmaciesController } from './pharmacies.controller';
import { PharmaciesService } from './pharmacies.service';
import { RepositoryService } from './pharmacies-repository.service';

@Module({
  controllers: [PharmaciesController],
  providers: [PharmaciesService, RepositoryService]
})
export class PharmaciesModule {}
