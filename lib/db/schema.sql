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

-- Оценки (звёзды 1-5) и счётчик просмотров статей блога — тот же принцип,
-- что у tool_stats, но отдельная таблица: у статей нет фидбека при низкой
-- оценке и помесячной разбивки (нет аналога «тула месяца» для блога).
CREATE TABLE IF NOT EXISTS blog_stats (
	post_id TEXT PRIMARY KEY,
	views BIGINT NOT NULL DEFAULT 0,
	rating_sum INTEGER NOT NULL DEFAULT 0,
	rating_count INTEGER NOT NULL DEFAULT 0
);

-- Форма контактов и виджет «Ошибка/Идея/Вопрос» раньше уходили только в
-- Telegram — если доставка падала (см. случай 03–19.08.2026, сервер не мог
-- достучаться до api.telegram.org две недели), сообщение терялось
-- безвозвратно, без единого следа. Теперь сначала пишутся сюда, Telegram —
-- best-effort уведомление поверх, а не единственная копия.
CREATE TABLE IF NOT EXISTS site_messages (
	id SERIAL PRIMARY KEY,
	source TEXT NOT NULL, -- 'contact' | 'feedback'
	type TEXT, -- у feedback: bug/feature/general; у contact всегда NULL
	name TEXT,
	email TEXT,
	subject TEXT NOT NULL,
	message TEXT NOT NULL,
	meta JSONB,
	created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
	telegram_sent_at TIMESTAMPTZ
);

-- Оценка «сработало / не сработало на конкретной площадке» — точечная, без
-- звезды и без текста. Завели, когда выяснилось: у invisible-character
-- 21 оценка со средней 2.48, а tool_feedback пуст — единственным выходом для
-- недовольства была общая звезда, площадку указать было негде, так низкая
-- оценка доставалась всему тулу за проблему одной конкретной кнопки. works
-- хранит обе стороны одним булевым полем, а не отдельной таблицей на каждую.
CREATE TABLE IF NOT EXISTS platform_feedback (
	id SERIAL PRIMARY KEY,
	tool_id TEXT NOT NULL,
	platform_id TEXT NOT NULL,
	char_id TEXT NOT NULL,
	works BOOLEAN NOT NULL,
	created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Готовая сумма к platform_feedback — читать grid при каждой загрузке
-- страницы через GROUP BY по сырому логу не хочется. Два счётчика, не один
-- net-score: цель не рейтинг, а диагностика «отвалилась ли площадка», а
-- «3 работает / 15 не работает» и «18 работает / 0 не работает» дают
-- одинаковый net +3, хотя это разные ситуации.
CREATE TABLE IF NOT EXISTS platform_feedback_stats (
	tool_id TEXT NOT NULL,
	platform_id TEXT NOT NULL,
	works_count INTEGER NOT NULL DEFAULT 0,
	broken_count INTEGER NOT NULL DEFAULT 0,
	PRIMARY KEY (tool_id, platform_id)
);

-- Импорт «Расширенной аналитики поисковых запросов по URL» из
-- Яндекс.Вебмастера (см. docs/seo/webmaster-url-report-2026-09.md) — по
-- странице за период, без разбивки по бакетам позиций (та детализация
-- остаётся в CSV/файле-отчёте). UNIQUE на (path, period), чтобы повторный
-- импорт того же отчёта обновлял строки, а не плодил дубли.
CREATE TABLE IF NOT EXISTS webmaster_url_stats (
	id SERIAL PRIMARY KEY,
	path TEXT NOT NULL,
	period_start DATE NOT NULL,
	period_end DATE NOT NULL,
	impressions BIGINT NOT NULL,
	clicks BIGINT NOT NULL,
	ctr NUMERIC NOT NULL,
	avg_position NUMERIC,
	avg_click_position NUMERIC,
	imported_at TIMESTAMPTZ NOT NULL DEFAULT now(),
	UNIQUE (path, period_start, period_end)
);
