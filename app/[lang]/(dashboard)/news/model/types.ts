import type { Locale } from "../../../dictionaries";

export type NewsItem = {
  id: number;
  language: Locale;
  title: string;
  content: string;
  tags: string[];
  category: string;
  image_url: string;
  published_at: string;
  reading_time?: string;
  status?: 'hot' | 'archive' | 'scheduled'; // Статус новости
};

