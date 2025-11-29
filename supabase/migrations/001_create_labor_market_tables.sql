-- Миграция для создания таблиц Labor Market
-- Таблицы: companies, vacancies, labor_market_news

-- Таблица компаний
CREATE TABLE IF NOT EXISTS companies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  name_ru TEXT,
  name_en TEXT,
  name_zh TEXT,
  description TEXT,
  description_ru TEXT,
  description_en TEXT,
  description_zh TEXT,
  logo_url TEXT,
  employee_count INTEGER,
  average_salary NUMERIC(12, 2), -- В USD
  founded_year INTEGER,
  authorized_capital NUMERIC(15, 2), -- Уставной капитал в USD
  net_profit NUMERIC(15, 2), -- Чистая прибыль в USD
  balance NUMERIC(15, 2), -- Баланс в USD
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Таблица вакансий
CREATE TABLE IF NOT EXISTS vacancies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  title_ru TEXT,
  title_en TEXT,
  title_zh TEXT,
  description TEXT NOT NULL,
  description_ru TEXT,
  description_en TEXT,
  description_zh TEXT,
  salary_min NUMERIC(10, 2), -- В USD
  salary_max NUMERIC(10, 2), -- В USD
  location TEXT,
  location_ru TEXT,
  location_en TEXT,
  location_zh TEXT,
  employment_type TEXT, -- full-time, part-time, contract, etc.
  requirements TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Таблица новостей для рынка труда (200 одинаковых для всех)
CREATE TABLE IF NOT EXISTS labor_market_news (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  language TEXT NOT NULL CHECK (language IN ('ru', 'en', 'zh')),
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  tags TEXT[],
  category TEXT,
  image_url TEXT,
  published_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  reading_time TEXT,
  author TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Индексы для производительности
CREATE INDEX IF NOT EXISTS idx_vacancies_company_id ON vacancies(company_id);
CREATE INDEX IF NOT EXISTS idx_labor_market_news_language ON labor_market_news(language);
CREATE INDEX IF NOT EXISTS idx_labor_market_news_published_at ON labor_market_news(published_at DESC);
CREATE INDEX IF NOT EXISTS idx_companies_name ON companies(name);

-- Комментарии к таблицам
COMMENT ON TABLE companies IS 'Таблица компаний с финансовой информацией';
COMMENT ON TABLE vacancies IS 'Таблица вакансий, связанных с компаниями';
COMMENT ON TABLE labor_market_news IS 'Таблица новостей рынка труда (200 одинаковых новостей для всех пользователей)';

