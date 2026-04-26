import { Module } from '@nestjs/common';
import { PharmaciesController } from './pharmacies.controller';
import { PharmaciesService } from './pharmacies.service';
import { PharmaciesRepository } from './pharmacies-repository.service';

@Module({
  controllers: [PharmaciesController],
  providers: [PharmaciesService, PharmaciesRepository]
})
export class PharmaciesModule {}
