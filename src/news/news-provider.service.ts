import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NewsItem } from './types/news-item.type';

type NewsDataArticle = {
  article_id?: string;
  title?: string;
  description?: string | null;
  link?: string;
  image_url?: string | null;
  source_id?: string | null;
  source_url?: string | null;
  category?: string[] | string | null;
  language?: string | null;
  country?: string[] | string | null;
  pubDate?: string;
};

type NewsDataResponse = {
  results?: NewsDataArticle[];
  status?: string;
  message?: string;
  results_count?: number;
};

const HEALTH_CATEGORY_KEYWORDS = new Set([
  'health',
  'healthy living',
  'wellness',
  'medicine',
  'medical',
]);

const HEALTH_TEXT_KEYWORDS = [
  'zdrav',
  'lijek',
  'lek',
  'apotek',
  'bolnic',
  'doktor',
  'medicin',
  'terap',
  'infek',
  'virus',
  'vakcin',
  'pacijen',
  'farmac',
  'ambulant',
  'higijen',
  'srce',
  'pritisak',
  'dijabet',
  'karcin',
  'rak',
  'ishran',
  'san',
  'mental',
  'stres',
  'imunitet',
];

@Injectable()
export class NewsProviderService {
  private readonly endpoint = 'https://newsdata.io/api/1/latest';

  constructor(private readonly configService: ConfigService) {}

  async fetchLatestNews(): Promise<NewsItem[]> {
    const apiKey = this.configService.get<string>('NEWSDATA_API_KEY');

    if (!apiKey) {
      throw new InternalServerErrorException(
        'NEWSDATA_API_KEY nije podesen u backend okruzenju.',
      );
    }

    try {
      const items = await this.fetchAndNormalize(this.buildBaseParams(apiKey));
      return items.filter((item) => this.isHealthRelated(item));
    } catch (error) {
      throw new InternalServerErrorException(
        `NewsData.io sync nije uspio. ${this.getReadableErrorMessage(error)}`,
      );
    }
  }

  private buildBaseParams(apiKey: string) {
    const params = new URLSearchParams();

    params.set('apikey', apiKey);
    params.set(
      'q',
      this.configService.get<string>('NEWSDATA_QUERY') ??
        'zdravlje OR lijek OR lek OR apoteka OR medicina',
    );
    params.set(
      'language',
      this.configService.get<string>('NEWSDATA_LANGUAGE') ?? 'sr,hr,bs',
    );
    params.set(
      'size',
      this.configService.get<string>('NEWSDATA_PAGE_SIZE') ?? '8',
    );
    params.set('image', '1');
    params.set('removeduplicate', '1');

    const country = this.configService.get<string>('NEWSDATA_COUNTRY');
    const category = this.configService.get<string>('NEWSDATA_CATEGORY');

    if (country?.trim()) {
      params.set('country', country.trim());
    }

    if (category?.trim()) {
      params.set('category', category.trim());
    }

    return params;
  }

  private async fetchAndNormalize(params: URLSearchParams): Promise<NewsItem[]> {
    const url = new URL(this.endpoint);
    url.search = params.toString();

    const response = await fetch(url.toString(), {
      signal: AbortSignal.timeout(15000),
    });

    const rawBody = await response.text();
    const payload = this.parseResponseBody(rawBody);

    if (!response.ok) {
      const message =
        payload?.message ||
        `HTTP ${response.status}${rawBody ? ` - ${rawBody}` : ''}`;

      throw new Error(message);
    }

    const results = Array.isArray(payload?.results) ? payload.results : [];

    return results
      .map((item) => this.normalizeArticle(item))
      .filter((item): item is NewsItem => item !== null);
  }

  private parseResponseBody(rawBody: string): NewsDataResponse | null {
    try {
      return JSON.parse(rawBody) as NewsDataResponse;
    } catch {
      return null;
    }
  }

  private getReadableErrorMessage(error: unknown) {
    if (error instanceof Error && error.message) {
      return error.message;
    }

    return 'nepoznata greska';
  }

  private isHealthRelated(item: NewsItem) {
    const category = item.category?.toLowerCase().trim() ?? '';

    if (category && HEALTH_CATEGORY_KEYWORDS.has(category)) {
      return true;
    }

    const content = [item.title, item.description ?? '', item.category ?? '']
      .join(' ')
      .toLowerCase();

    return HEALTH_TEXT_KEYWORDS.some((keyword) => content.includes(keyword));
  }

  private normalizeArticle(item: NewsDataArticle): NewsItem | null {
    if (!item.article_id || !item.title || !item.link || !item.pubDate) {
      return null;
    }

    return {
      articleId: item.article_id,
      title: item.title.trim(),
      description: item.description?.trim() || null,
      link: item.link,
      imageUrl: item.image_url ?? null,
      source: item.source_id?.trim() || null,
      sourceUrl: item.source_url ?? null,
      category: this.normalizeListValue(item.category),
      language: item.language?.trim() || null,
      country: this.normalizeListValue(item.country),
      publishedAt: item.pubDate,
    };
  }

  private normalizeListValue(value: string[] | string | null | undefined) {
    if (Array.isArray(value)) {
      return value.length > 0 ? value[0] : null;
    }

    if (typeof value === 'string' && value.trim()) {
      return value.trim();
    }

    return null;
  }
}
