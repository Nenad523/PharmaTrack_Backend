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
import { NewsModule } from './news/news.module';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { CsrfMiddleware } from './common/middleware/csrf.middleware';
import { CloudinaryModule } from './cloudinary/cloudinary.module';
import { EmbeddingService } from './common/embedding/embedding.service';
import { AdminModule } from './admin/admin.module';
import { NotificationsModule } from './notifications/notifications.module';

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
    CitiesModule,
    NewsModule,
    CloudinaryModule,
    AdminModule,
    NotificationsModule],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard
    },
    EmbeddingService
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(CsrfMiddleware).forRoutes('api/v1/*path');
  }
}
