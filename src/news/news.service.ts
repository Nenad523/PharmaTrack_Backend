import {
  Injectable,
  Logger,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import { NewsStorageRepository } from './news-storage.repository';
import { NewsProviderService } from './news-provider.service';
import { NewsItem } from './types/news-item.type';

const DAY_IN_MS = 24 * 60 * 60 * 1000;
const DEFAULT_LIMIT = 4;

@Injectable()
export class NewsService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(NewsService.name);
  private refreshTimer: NodeJS.Timeout | null = null;
  private refreshPromise: Promise<void> | null = null;

  constructor(
    private readonly repository: NewsStorageRepository,
    private readonly provider: NewsProviderService,
  ) {}

  async onModuleInit() {
    await this.scheduleRefreshCycle().catch((error: unknown) => {
      this.logger.error(
        `Neuspješna inicijalizacija news modula: ${this.getErrorMessage(error)}`,
      );
    });
  }

  onModuleDestroy() {
    if (this.refreshTimer) {
      clearTimeout(this.refreshTimer);
      this.refreshTimer = null;
    }
  }

  async getLatest(limit = DEFAULT_LIMIT) {
    const stored = await this.repository.read();
    const normalizedLimit = Number.isFinite(limit) && limit > 0 ? limit : DEFAULT_LIMIT;

    return {
      success: true,
      data: stored.items.slice(0, normalizedLimit),
      count: Math.min(stored.items.length, normalizedLimit),
      meta: {
        lastSyncedAt: stored.lastSyncedAt,
      },
    };
  }

  async refreshNow(): Promise<void> {
    if (this.refreshPromise) {
      return this.refreshPromise;
    }

    this.refreshPromise = this.performRefresh();

    try {
      await this.refreshPromise;
    } finally {
      this.refreshPromise = null;
    }
  }

  private async scheduleRefreshCycle() {
    const stored = await this.repository.read();
    const needsImmediateRefresh = this.shouldRefreshImmediately(
      stored.lastSyncedAt,
      stored.items.length,
    );

    if (needsImmediateRefresh) {
      void this.refreshNow().catch((error: unknown) => {
        this.logger.error(
          `Neuspješan početni sync vijesti: ${this.getErrorMessage(error)}`,
        );
      });
    }

    this.scheduleNextRefresh(stored.lastSyncedAt);
  }

  private scheduleNextRefresh(lastSyncedAt: string | null) {
    if (this.refreshTimer) {
      clearTimeout(this.refreshTimer);
    }

    const delay = this.getNextDelay(lastSyncedAt);

    this.refreshTimer = setTimeout(() => {
      void this.refreshNow()
        .catch((error: unknown) => {
          this.logger.error(
            `Neuspješan dnevni sync vijesti: ${this.getErrorMessage(error)}`,
          );
        })
        .finally(() => {
          void this.repository
            .read()
            .then((stored) => this.scheduleNextRefresh(stored.lastSyncedAt))
            .catch(() => this.scheduleNextRefresh(null));
        });
    }, delay);
  }

  private async performRefresh() {
    const items = await this.provider.fetchLatestNews();
    const timestamp = new Date().toISOString();

    await this.repository.write(this.sortNews(items), timestamp);
    this.scheduleNextRefresh(timestamp);
  }

  private sortNews(items: NewsItem[]) {
    return [...items].sort(
      (a, b) =>
        new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime(),
    );
  }

  private shouldRefreshImmediately(
    lastSyncedAt: string | null,
    itemsCount: number,
  ) {
    if (itemsCount === 0) {
      return true;
    }

    if (!lastSyncedAt) {
      return true;
    }

    const lastSyncTime = new Date(lastSyncedAt).getTime();

    if (Number.isNaN(lastSyncTime)) {
      return true;
    }

    return Date.now() - lastSyncTime >= DAY_IN_MS;
  }

  private getNextDelay(lastSyncedAt: string | null) {
    if (!lastSyncedAt) {
      return DAY_IN_MS;
    }

    const lastSyncTime = new Date(lastSyncedAt).getTime();

    if (Number.isNaN(lastSyncTime)) {
      return DAY_IN_MS;
    }

    const elapsed = Date.now() - lastSyncTime;
    return elapsed >= DAY_IN_MS ? 1000 : DAY_IN_MS - elapsed;
  }

  private getErrorMessage(error: unknown) {
    if (error instanceof Error && error.message) {
      return error.message;
    }

    return 'nepoznata greška';
  }
}
