// Типы для раздела Politics

// ============================================================================
// СПРАВОЧНИКИ (Dataset tables)
// ============================================================================

export type DatasetGender = {
  uuid: string;
  name: string;
  updated_at: string;
  created_at: string;
};

export type DatasetProvince = {
  uuid: string;
  name: string;
  updated_at: string;
  created_at: string;
};

export type DatasetUniversity = {
  uuid: string;
  name: string;
  is_foreign: boolean;
  updated_at: string;
  created_at: string;
};

// ============================================================================
// ПОЛИТИЧЕСКИЕ ПАРТИИ
// ============================================================================

export type PoliticalPartyPosition = {
  uuid: string;
  name: string;
  updated_at: string;
  created_at: string;
};

export type PoliticalParty = {
  uuid: string;
  name: string;
  description?: string | null;
  numbers?: number | null;
  is_active: boolean;
  reveal_day?: number | null;
  updated_at: string;
  created_at: string;
};

export type PoliticalPartyMember = {
  uuid: string;
  politician_uuid: string;
  political_party_uuid: string;
  position_uuid?: string | null;
  is_active: boolean;
  reveal_day?: number | null;
  updated_at: string;
  created_at: string;
  // Relations
  politician?: Politician;
  political_party?: PoliticalParty;
  position?: PoliticalPartyPosition;
};

// ============================================================================
// МИНИСТЕРСТВА
// ============================================================================

export type MinistryPosition = {
  uuid: string;
  name: string;
  updated_at: string;
  created_at: string;
};

export type Ministry = {
  uuid: string;
  name: string;
  description?: string | null;
  numbers?: number | null;
  is_active: boolean;
  reveal_day?: number | null;
  updated_at: string;
  created_at: string;
};

export type MinistryMember = {
  uuid: string;
  politician_uuid: string;
  ministry_uuid: string;
  position_uuid?: string | null;
  is_active: boolean;
  reveal_day?: number | null;
  updated_at: string;
  created_at: string;
  // Relations
  politician?: Politician;
  ministry?: Ministry;
  position?: MinistryPosition;
};

// ============================================================================
// ПРАВИТЕЛЬСТВО
// ============================================================================

export type GovernmentPosition = {
  uuid: string;
  name: string;
  updated_at: string;
  created_at: string;
};

export type Government = {
  uuid: string;
  politician_uuid: string;
  position_uuid: string;
  is_active: boolean;
  reveal_day?: number | null;
  updated_at: string;
  created_at: string;
  // Relations
  politician?: Politician;
  position?: GovernmentPosition;
};

// ============================================================================
// ОБРАЗОВАНИЕ
// ============================================================================

export type PoliticianEducation = {
  uuid: string;
  politician_uuid: string;
  university_uuid: string;
  education_level?: string | null; // Уровень образования: Магистратура, Бакалавриат и т.д.
  sequence_number?: number | null;
  updated_at: string;
  created_at: string;
  // Relations
  politician?: Politician;
  university?: DatasetUniversity;
};

// ============================================================================
// ОСНОВНАЯ СУЩНОСТЬ - ПОЛИТИК
// ============================================================================

export type Politician = {
  uuid: string;
  name: string;
  source_name?: string | null;
  avatar_path?: string | null;
  birthday?: string | null; // DATE as string
  is_married?: boolean | null;
  children?: number | null;
  military_service?: boolean | null;
  gender_uuid?: string | null;
  province_uuid?: string | null;
  updated_at: string;
  created_at: string;
  // Relations (populated when fetching details)
  gender?: DatasetGender;
  province?: DatasetProvince;
  parties?: PoliticalPartyMember[];
  ministries?: MinistryMember[];
  government?: Government[];
  education?: PoliticianEducation[];
};

// ============================================================================
// ПОЛЬЗОВАТЕЛИ (для будущего использования)
// ============================================================================

export type UserGroup = {
  uuid: string;
  name: string;
  start_date?: string | null; // DATE as string
  end_date?: string | null; // DATE as string
  updated_at: string;
  created_at: string;
};

export type User = {
  uuid: string;
  fullname: string;
  login: string;
  password: string;
  group_uuid?: string | null;
  is_active: boolean;
  updated_at: string;
  created_at: string;
  // Relations
  group?: UserGroup;
};

// ============================================================================
// ТИПЫ ДЛЯ ВКЛАДОК
// ============================================================================

export type PoliticsTab = "home" | "persons" | "parties" | "political-structure";

