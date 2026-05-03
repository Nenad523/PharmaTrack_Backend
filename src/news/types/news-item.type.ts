export type NewsItem = {
  articleId: string;
  title: string;
  description: string | null;
  link: string;
  imageUrl: string | null;
  source: string | null;
  sourceUrl: string | null;
  category: string | null;
  language: string | null;
  country: string | null;
  publishedAt: string;
};

export type StoredNewsPayload = {
  items: NewsItem[];
  lastSyncedAt: string | null;
};
