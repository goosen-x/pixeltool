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

-- Оценки (звёзды 1-5) и счётчик просмотров тулов.
CREATE TABLE IF NOT EXISTS tool_stats (
	tool_id TEXT PRIMARY KEY,
	views BIGINT NOT NULL DEFAULT 0,
	rating_sum INTEGER NOT NULL DEFAULT 0,
	rating_count INTEGER NOT NULL DEFAULT 0
);

-- Просмотры тула за конкретный месяц (YYYY-MM, UTC) — источник данных для
-- автоматического выбора «инструмента месяца» (топ по просмотрам именно за
-- текущий месяц, не all-time). Растёт бессрочно по всем месяцам — история
-- пригодится для сравнения периодов, старые строки не чистим.
CREATE TABLE IF NOT EXISTS tool_views_monthly (
	tool_id TEXT NOT NULL,
	year_month TEXT NOT NULL,
	views BIGINT NOT NULL DEFAULT 0,
	PRIMARY KEY (tool_id, year_month)
);

-- Свободный комментарий, который просим при низкой оценке (≤3) —
-- лог отдельных сообщений, а не агрегат, поэтому отдельная таблица, а не
-- колонка в tool_stats. rating дублирует оценку, с которой пришёл комментарий,
-- чтобы не JOIN'ить с tool_stats (та хранит только текущую сумму, историю
-- по конкретному голосу не восстановить).
CREATE TABLE IF NOT EXISTS tool_feedback (
	id SERIAL PRIMARY KEY,
	tool_id TEXT NOT NULL,
	rating SMALLINT NOT NULL,
	comment TEXT NOT NULL,
	created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
