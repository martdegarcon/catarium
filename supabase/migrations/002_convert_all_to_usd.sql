  -- Миграция: конвертация всех валют в USD
  -- Все финансовые значения теперь хранятся в долларах

  -- Курсы конвертации (примерные)
  -- 1 USD = 91 RUB
  -- 1 USD = 7.2 CNY

  -- Конвертируем существующие данные в USD перед удалением полей валют
  -- Компании
  UPDATE companies 
  SET 
    average_salary = CASE 
      WHEN average_salary_currency = 'RUB' THEN average_salary / 91.0
      WHEN average_salary_currency = 'CNY' THEN average_salary / 7.2
      ELSE average_salary -- уже USD
    END,
    authorized_capital = CASE 
      WHEN authorized_capital_currency = 'RUB' THEN authorized_capital / 91.0
      WHEN authorized_capital_currency = 'CNY' THEN authorized_capital / 7.2
      ELSE authorized_capital -- уже USD
    END,
    net_profit = CASE 
      WHEN net_profit_currency = 'RUB' THEN net_profit / 91.0
      WHEN net_profit_currency = 'CNY' THEN net_profit / 7.2
      ELSE net_profit -- уже USD
    END,
    balance = CASE 
      WHEN balance_currency = 'RUB' THEN balance / 91.0
      WHEN balance_currency = 'CNY' THEN balance / 7.2
      ELSE balance -- уже USD
    END
  WHERE average_salary_currency IS NOT NULL 
    OR authorized_capital_currency IS NOT NULL 
    OR net_profit_currency IS NOT NULL 
    OR balance_currency IS NOT NULL;

  -- Вакансии
  UPDATE vacancies 
  SET 
    salary_min = CASE 
      WHEN salary_currency = 'RUB' THEN salary_min / 91.0
      WHEN salary_currency = 'CNY' THEN salary_min / 7.2
      ELSE salary_min -- уже USD
    END,
    salary_max = CASE 
      WHEN salary_currency = 'RUB' THEN salary_max / 91.0
      WHEN salary_currency = 'CNY' THEN salary_max / 7.2
      ELSE salary_max -- уже USD
    END
  WHERE salary_currency IS NOT NULL;

  -- Удаляем поля валют
  ALTER TABLE companies 
    DROP COLUMN IF EXISTS average_salary_currency,
    DROP COLUMN IF EXISTS authorized_capital_currency,
    DROP COLUMN IF EXISTS net_profit_currency,
    DROP COLUMN IF EXISTS balance_currency;

  ALTER TABLE vacancies 
    DROP COLUMN IF EXISTS salary_currency;

  -- Комментарии обновлены
  COMMENT ON COLUMN companies.average_salary IS 'Средняя зарплата в USD';
  COMMENT ON COLUMN companies.authorized_capital IS 'Уставной капитал в USD';
  COMMENT ON COLUMN companies.net_profit IS 'Чистая прибыль в USD';
  COMMENT ON COLUMN companies.balance IS 'Баланс в USD';
  COMMENT ON COLUMN vacancies.salary_min IS 'Минимальная зарплата в USD';
  COMMENT ON COLUMN vacancies.salary_max IS 'Максимальная зарплата в USD';
