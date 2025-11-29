-- Миграция для создания таблиц Politics
-- Всего 14 таблиц: политики, партии, министерства, правительство, справочники, user_group
-- Примечание: Таблица users уже существует для аутентификации, поэтому не создается здесь

-- ============================================================================
-- СПРАВОЧНИКИ (Dataset tables)
-- ============================================================================

-- Справочник полов
CREATE TABLE IF NOT EXISTS dataset_gender (
  uuid UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(63) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Справочник регионов/провинций
CREATE TABLE IF NOT EXISTS dataset_province (
  uuid UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(63) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Справочник университетов
CREATE TABLE IF NOT EXISTS dataset_university (
  uuid UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(511) NOT NULL,
  is_foreign BOOLEAN DEFAULT FALSE,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================================
-- ОСНОВНАЯ СУЩНОСТЬ - ПОЛИТИК
-- ============================================================================

CREATE TABLE IF NOT EXISTS politician (
  uuid UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  source_name VARCHAR(255),
  avatar_path VARCHAR(255),
  birthday DATE,
  is_married BOOLEAN,
  children INTEGER,
  military_service BOOLEAN,
  gender_uuid UUID REFERENCES dataset_gender(uuid) ON DELETE SET NULL,
  province_uuid UUID REFERENCES dataset_province(uuid) ON DELETE SET NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================================
-- ПОЛИТИЧЕСКИЕ ПАРТИИ
-- ============================================================================

-- Политическая партия
CREATE TABLE IF NOT EXISTS political_party (
  uuid UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  numbers INTEGER,
  is_active BOOLEAN DEFAULT TRUE,
  reveal_day INTEGER,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Должность в партии
CREATE TABLE IF NOT EXISTS political_party_position (
  uuid UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(127) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Членство в партии (junction table)
CREATE TABLE IF NOT EXISTS political_party_member (
  uuid UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  politician_uuid UUID NOT NULL REFERENCES politician(uuid) ON DELETE CASCADE,
  political_party_uuid UUID NOT NULL REFERENCES political_party(uuid) ON DELETE CASCADE,
  position_uuid UUID REFERENCES political_party_position(uuid) ON DELETE SET NULL,
  is_active BOOLEAN DEFAULT TRUE,
  reveal_day INTEGER,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================================
-- МИНИСТЕРСТВА
-- ============================================================================

-- Министерство
CREATE TABLE IF NOT EXISTS ministry (
  uuid UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  numbers INTEGER,
  is_active BOOLEAN DEFAULT TRUE,
  reveal_day INTEGER,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Должность в министерстве
CREATE TABLE IF NOT EXISTS ministry_position (
  uuid UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(127) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Членство в министерстве (junction table)
CREATE TABLE IF NOT EXISTS ministry_member (
  uuid UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  politician_uuid UUID NOT NULL REFERENCES politician(uuid) ON DELETE CASCADE,
  ministry_uuid UUID NOT NULL REFERENCES ministry(uuid) ON DELETE CASCADE,
  position_uuid UUID REFERENCES ministry_position(uuid) ON DELETE SET NULL,
  is_active BOOLEAN DEFAULT TRUE,
  reveal_day INTEGER,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================================
-- ПРАВИТЕЛЬСТВО
-- ============================================================================

-- Должность в правительстве
CREATE TABLE IF NOT EXISTS government_position (
  uuid UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(127) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Состав правительства (junction table)
CREATE TABLE IF NOT EXISTS government (
  uuid UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  politician_uuid UUID NOT NULL REFERENCES politician(uuid) ON DELETE CASCADE,
  position_uuid UUID NOT NULL REFERENCES government_position(uuid) ON DELETE CASCADE,
  is_active BOOLEAN DEFAULT TRUE,
  reveal_day INTEGER,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================================
-- ОБРАЗОВАНИЕ
-- ============================================================================

-- Образование политика (junction table)
CREATE TABLE IF NOT EXISTS politician_education (
  uuid UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  politician_uuid UUID NOT NULL REFERENCES politician(uuid) ON DELETE CASCADE,
  university_uuid UUID NOT NULL REFERENCES dataset_university(uuid) ON DELETE CASCADE,
  education_level VARCHAR(255), -- Уровень образования: Магистратура, Бакалавриат, и т.д.
  sequence_number INTEGER,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================================
-- ПОЛЬЗОВАТЕЛИ (для будущего использования)
-- ============================================================================
-- Примечание: Таблица users уже существует для аутентификации с другой структурой
-- Если нужна функциональность user_group, можно создать отдельную таблицу
-- или добавить колонки через ALTER TABLE в отдельной миграции

-- Группа пользователей
CREATE TABLE IF NOT EXISTS user_group (
  uuid UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(63) NOT NULL,
  start_date DATE,
  end_date DATE,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Примечание: Таблица users уже существует для аутентификации
-- Если нужно добавить функциональность group_uuid, используйте ALTER TABLE:
-- ALTER TABLE users ADD COLUMN IF NOT EXISTS group_uuid UUID REFERENCES user_group(uuid) ON DELETE SET NULL;

-- ============================================================================
-- ИНДЕКСЫ ДЛЯ ПРОИЗВОДИТЕЛЬНОСТИ
-- ============================================================================

-- Индексы для politician
CREATE INDEX IF NOT EXISTS idx_politician_gender_uuid ON politician(gender_uuid);
CREATE INDEX IF NOT EXISTS idx_politician_province_uuid ON politician(province_uuid);
CREATE INDEX IF NOT EXISTS idx_politician_name ON politician(name);

-- Индексы для political_party_member
CREATE INDEX IF NOT EXISTS idx_political_party_member_politician ON political_party_member(politician_uuid);
CREATE INDEX IF NOT EXISTS idx_political_party_member_party ON political_party_member(political_party_uuid);
CREATE INDEX IF NOT EXISTS idx_political_party_member_active ON political_party_member(is_active);

-- Индексы для ministry_member
CREATE INDEX IF NOT EXISTS idx_ministry_member_politician ON ministry_member(politician_uuid);
CREATE INDEX IF NOT EXISTS idx_ministry_member_ministry ON ministry_member(ministry_uuid);
CREATE INDEX IF NOT EXISTS idx_ministry_member_active ON ministry_member(is_active);

-- Индексы для government
CREATE INDEX IF NOT EXISTS idx_government_politician ON government(politician_uuid);
CREATE INDEX IF NOT EXISTS idx_government_position ON government(position_uuid);
CREATE INDEX IF NOT EXISTS idx_government_active ON government(is_active);

-- Индексы для politician_education
CREATE INDEX IF NOT EXISTS idx_politician_education_politician ON politician_education(politician_uuid);
CREATE INDEX IF NOT EXISTS idx_politician_education_university ON politician_education(university_uuid);

-- Индексы для users (закомментированы, так как таблица users уже существует)
-- Если добавите колонку group_uuid через ALTER TABLE, раскомментируйте:
-- CREATE INDEX IF NOT EXISTS idx_users_group_uuid ON users(group_uuid);
-- Индексы на login и is_active уже могут существовать

-- ============================================================================
-- КОММЕНТАРИИ К ТАБЛИЦАМ
-- ============================================================================

COMMENT ON TABLE politician IS 'Основная таблица политиков';
COMMENT ON TABLE political_party IS 'Таблица политических партий';
COMMENT ON TABLE political_party_member IS 'Связь между политиками и партиями';
COMMENT ON TABLE ministry IS 'Таблица министерств';
COMMENT ON TABLE ministry_member IS 'Связь между политиками и министерствами';
COMMENT ON TABLE government IS 'Состав правительства';
COMMENT ON TABLE politician_education IS 'Образование политиков';
COMMENT ON TABLE dataset_gender IS 'Справочник полов';
COMMENT ON TABLE dataset_province IS 'Справочник регионов/провинций';
COMMENT ON TABLE dataset_university IS 'Справочник университетов';

