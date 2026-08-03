-- Таблица подписчиков лид-магнита (сайдбар: email → PDF с подборкой инструментов).
-- Применяется автоматически при первом обращении к БД, см. lib/db/index.ts.
CREATE TABLE IF NOT EXISTS leads (
	id SERIAL PRIMARY KEY,
	email TEXT NOT NULL UNIQUE,
	source TEXT,
	created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
	pdf_sent_at TIMESTAMPTZ
);

-- Доказательство согласия. По ч. 1 ст. 9 152-ФЗ факт получения согласия
-- обязан доказывать оператор, поэтому фиксируем не только «да», но и когда
-- и с какой редакцией документов человек согласился.
-- Согласие на рекламу отдельное (ст. 18 ФЗ «О рекламе»): без него можно
-- отправить только запрошенную шпаргалку и больше ничего.
ALTER TABLE leads ADD COLUMN IF NOT EXISTS consent_data_at TIMESTAMPTZ;
ALTER TABLE leads ADD COLUMN IF NOT EXISTS consent_ads_at TIMESTAMPTZ;
ALTER TABLE leads ADD COLUMN IF NOT EXISTS consent_version TEXT;
