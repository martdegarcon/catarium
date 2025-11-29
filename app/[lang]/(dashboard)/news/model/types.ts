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
  author?: string; // Автор новости
  status?: 'hot' | 'archive' | 'scheduled'; // Статус новости
  day_number?: number; // Номер дня в расписании пользователя
  sorted_order?: number; 
  is_hot?: boolean; 
};

