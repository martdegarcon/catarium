-- Добавляем поле current_day в таблицу user_news_start
ALTER TABLE user_news_start 
ADD COLUMN IF NOT EXISTS current_day INTEGER DEFAULT 1 CHECK (current_day >= 1 AND current_day <= 180);

-- Обновляем существующие записи, устанавливая current_day = 1
UPDATE user_news_start 
SET current_day = 1 
WHERE current_day IS NULL;

