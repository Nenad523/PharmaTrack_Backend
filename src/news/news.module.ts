import { Module } from '@nestjs/common';
import { NewsController } from './news.controller';
import { NewsProviderService } from './news-provider.service';
import { NewsService } from './news.service';
import { NewsStorageRepository } from './news-storage.repository';

@Module({
  controllers: [NewsController],
  providers: [NewsService, NewsProviderService, NewsStorageRepository],
})
export class NewsModule {}
