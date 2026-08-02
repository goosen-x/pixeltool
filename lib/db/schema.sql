-- Таблица подписчиков лид-магнита (сайдбар: email → PDF с подборкой инструментов).
-- Применяется автоматически при первом обращении к БД, см. lib/db/index.ts.
CREATE TABLE IF NOT EXISTS leads (
	id SERIAL PRIMARY KEY,
	email TEXT NOT NULL UNIQUE,
	source TEXT,
	created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
	pdf_sent_at TIMESTAMPTZ
);
