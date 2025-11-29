-- Добавляем поле education_level в таблицу politician_education
ALTER TABLE politician_education 
ADD COLUMN IF NOT EXISTS education_level VARCHAR(255);

COMMENT ON COLUMN politician_education.education_level IS 'Уровень образования: Магистратура, Бакалавриат и т.д.';

