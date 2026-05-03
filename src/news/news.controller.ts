import { Controller, Get, Post, Query } from '@nestjs/common';
import { ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { NewsService } from './news.service';

@ApiTags('News')
@Controller('api/v1/news')
export class NewsController {
  constructor(private readonly newsService: NewsService) {}

  @Get()
  @ApiOperation({ summary: 'Dohvatanje keširanih vijesti za početnu stranicu.' })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    description: 'Maksimalan broj vijesti koje se vraćaju.',
    example: 4,
  })
  getLatestNews(@Query('limit') limit?: string) {
    const parsedLimit = limit ? Number.parseInt(limit, 10) : undefined;
    return this.newsService.getLatest(parsedLimit);
  }

  @Post('refresh')
  @ApiOperation({ summary: 'Ručno pokretanje sinhronizacije vijesti.' })
  async refreshNews() {
    await this.newsService.refreshNow();

    return {
      success: true,
      message: 'Sinhronizacija vijesti je pokrenuta.',
    };
  }
}
