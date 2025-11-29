import type { Locale } from "../../../dictionaries";

// Все значения в БД хранятся в USD
export type Company = {
  id: string;
  name: string;
  name_ru?: string;
  name_en?: string;
  name_zh?: string;
  description?: string;
  description_ru?: string;
  description_en?: string;
  description_zh?: string;
  logo_url?: string;
  employee_count?: number | null;
  average_salary?: number | null; // В USD
  founded_year?: number | null;
  authorized_capital?: number | null; // В USD
  net_profit?: number | null; // В USD
  balance?: number | null; // В USD
  created_at: string;
  updated_at: string;
};

export type Vacancy = {
  id: string;
  company_id: string;
  title: string;
  title_ru?: string;
  title_en?: string;
  title_zh?: string;
  description: string;
  description_ru?: string;
  description_en?: string;
  description_zh?: string;
  salary_min?: number | null; // В USD
  salary_max?: number | null; // В USD
  location?: string;
  location_ru?: string;
  location_en?: string;
  location_zh?: string;
  employment_type?: string;
  requirements?: string[] | null;
  created_at: string;
  updated_at: string;
  company?: Company;
};

export type LaborMarketNews = {
  id: string;
  language: Locale;
  title: string;
  content: string;
  tags: string[];
  category?: string;
  image_url?: string;
  published_at: string;
  reading_time?: string;
  author?: string;
};

export type LaborMarketTab = "home" | "news" | "companies" | "vacancies";

