import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { NewsItem, StoredNewsPayload } from './types/news-item.type';

type NewsRow = {
  article_id: string;
  title: string;
  description: string | null;
  link: string;
  image_url: string | null;
  source_id: string | null;
  source_url: string | null;
  category: string | null;
  language: string | null;
  country: string | null;
  pub_date: string | Date;
};

type SyncMetaRow = {
  lastSyncedAt: string | Date | null;
};

@Injectable()
export class NewsStorageRepository {
  constructor(private readonly db: DatabaseService) {}

  async read(): Promise<StoredNewsPayload> {
    try {
      const [rows, metaRows] = await Promise.all([
        this.db.query<NewsRow[]>(
          `SELECT
            article_id,
            title,
            description,
            link,
            image_url,
            source_id,
            source_url,
            category,
            language,
            country,
            pub_date
          FROM News
          ORDER BY pub_date DESC, id DESC`,
        ),
        this.db.query<SyncMetaRow[]>(
          'SELECT MAX(updated_at) AS lastSyncedAt FROM News',
        ),
      ]);

      return {
        items: rows.map((row) => this.mapRow(row)),
        lastSyncedAt: this.normalizeDate(metaRows[0]?.lastSyncedAt ?? null),
      };
    } catch {
      throw new InternalServerErrorException(
        'Doslo je do greske pri ucitavanju vijesti.',
      );
    }
  }

  async write(items: NewsItem[], lastSyncedAt: string): Promise<void> {
    try {
      await this.db.query('DELETE FROM News');

      if (items.length === 0) {
        return;
      }

      const placeholders = items
        .map(() => '(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)')
        .join(', ');

      const params = items.flatMap((item) => [
        item.articleId,
        item.title,
        item.description,
        item.link,
        item.imageUrl,
        item.source,
        item.sourceUrl,
        item.category,
        item.language,
        item.country,
        this.toMysqlDateTime(item.publishedAt),
        this.toMysqlDateTime(lastSyncedAt),
        this.toMysqlDateTime(lastSyncedAt),
      ]);

      await this.db.query(
        `INSERT INTO News (
          article_id,
          title,
          description,
          link,
          image_url,
          source_id,
          source_url,
          category,
          language,
          country,
          pub_date,
          created_at,
          updated_at
        ) VALUES ${placeholders}`,
        params,
      );
    } catch {
      throw new InternalServerErrorException(
        'Doslo je do greske pri cuvanju vijesti.',
      );
    }
  }

  private mapRow(row: NewsRow): NewsItem {
    return {
      articleId: row.article_id,
      title: row.title,
      description: row.description,
      link: row.link,
      imageUrl: row.image_url,
      source: row.source_id,
      sourceUrl: row.source_url,
      category: row.category,
      language: row.language,
      country: row.country,
      publishedAt: this.normalizeDate(row.pub_date) ?? new Date().toISOString(),
    };
  }

  private normalizeDate(value: string | Date | null) {
    if (!value) {
      return null;
    }

    const date = value instanceof Date ? value : new Date(value);
    return Number.isNaN(date.getTime()) ? null : date.toISOString();
  }

  private toMysqlDateTime(value: string) {
    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
      throw new InternalServerErrorException('Neispravan datum za vijesti.');
    }

    return date.toISOString().slice(0, 19).replace('T', ' ');
  }
}
