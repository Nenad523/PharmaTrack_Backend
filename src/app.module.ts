/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable prettier/prettier */
import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './database/database.module';
import { ConfigModule } from '@nestjs/config';
import { MedicationModule } from './medication/medication.module';
import { AuthenticationModule } from './authentication/authentication.module';
import { PharmaciesModule } from './pharmacies/pharmacies.module';
import { CitiesModule } from './cities/cities.module';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { CsrfMiddleware } from './common/middleware/csrf.middleware';

@Module({
  imports: [
    ThrottlerModule.forRoot([
      {
        ttl: 60000,
        limit: 10
      }
    ]),
    ConfigModule.forRoot({
        isGlobal: true,
    }),
    DatabaseModule,
    MedicationModule,
    AuthenticationModule,
    PharmaciesModule,
    CitiesModule],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard
    }
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(CsrfMiddleware).forRoutes('api/v1/*path');
  }
}
