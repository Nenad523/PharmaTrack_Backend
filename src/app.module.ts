/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './database/database.module';
import { ConfigModule } from '@nestjs/config';
import { MedicationModule } from './medication/medication.module';

@Module({
  imports: [
      ConfigModule.forRoot({
        isGlobal: true,
    }),
    DatabaseModule,
    MedicationModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
