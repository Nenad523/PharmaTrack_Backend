import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { promises as fs } from 'fs';
import { dirname, resolve } from 'path';
import { ConfigService } from '@nestjs/config';
import { NewsItem, StoredNewsPayload } from './types/news-item.type';

const DEFAULT_CACHE_PATH = resolve(process.cwd(), 'data', 'news-cache.json');

@Injectable()
export class NewsStorageRepository {
  private readonly cachePath: string;

  constructor(private readonly configService: ConfigService) {
    this.cachePath = resolve(
      this.configService.get('NEWS_CACHE_FILE') ?? DEFAULT_CACHE_PATH,
    );
  }

  async read(): Promise<StoredNewsPayload> {
    try {
      await this.ensureFile();
      const content = await fs.readFile(this.cachePath, 'utf8');
      const parsed = JSON.parse(content) as Partial<StoredNewsPayload>;

      return {
        items: Array.isArray(parsed.items) ? parsed.items : [],
        lastSyncedAt:
          typeof parsed.lastSyncedAt === 'string' ? parsed.lastSyncedAt : null,
      };
    } catch {
      throw new InternalServerErrorException(
        'Došlo je do greške pri učitavanju vijesti.',
      );
    }
  }

  async write(items: NewsItem[], lastSyncedAt: string): Promise<void> {
    try {
      await this.ensureFile();
      const payload: StoredNewsPayload = {
        items,
        lastSyncedAt,
      };

      await fs.writeFile(this.cachePath, JSON.stringify(payload, null, 2), 'utf8');
    } catch {
      throw new InternalServerErrorException(
        'Došlo je do greške pri čuvanju vijesti.',
      );
    }
  }

  private async ensureFile(): Promise<void> {
    await fs.mkdir(dirname(this.cachePath), { recursive: true });

    try {
      await fs.access(this.cachePath);
    } catch {
      const initialPayload: StoredNewsPayload = {
        items: [],
        lastSyncedAt: null,
      };

      await fs.writeFile(
        this.cachePath,
        JSON.stringify(initialPayload, null, 2),
        'utf8',
      );
    }
  }
}
