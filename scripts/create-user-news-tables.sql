-- Таблица для хранения расписания новостей пользователя
CREATE TABLE IF NOT EXISTS user_news_schedule (
  id SERIAL PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  news_id INTEGER NOT NULL,
  language TEXT NOT NULL CHECK (language IN ('ru', 'en', 'zh')),
  day_number INTEGER NOT NULL CHECK (day_number >= 1 AND day_number <= 180),
  status TEXT NOT NULL DEFAULT 'scheduled' CHECK (status IN ('hot', 'archive', 'scheduled')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  CONSTRAINT user_news_schedule_unique UNIQUE (user_id, news_id, language, day_number)
);

CREATE INDEX idx_user_news_schedule_user_language ON user_news_schedule(user_id, language);
CREATE INDEX idx_user_news_schedule_day ON user_news_schedule(user_id, language, day_number);
CREATE INDEX idx_user_news_schedule_status ON user_news_schedule(user_id, language, status);

-- Таблица для отслеживания начала расписания пользователя
CREATE TABLE IF NOT EXISTS user_news_start (
  user_id UUID NOT NULL,
  language TEXT NOT NULL CHECK (language IN ('ru', 'en', 'zh')),
  start_date DATE NOT NULL,
  last_refresh TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  current_day INTEGER DEFAULT 1 CHECK (current_day >= 1 AND current_day <= 180),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  CONSTRAINT user_news_start_pkey PRIMARY KEY (user_id, language)
);

CREATE INDEX idx_user_news_start_user ON user_news_start(user_id);

-- Функция для автоматического обновления updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Триггер для автоматического обновления updated_at
DROP TRIGGER IF EXISTS update_user_news_schedule_updated_at ON user_news_schedule;
CREATE TRIGGER update_user_news_schedule_updated_at
  BEFORE UPDATE ON user_news_schedule
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

