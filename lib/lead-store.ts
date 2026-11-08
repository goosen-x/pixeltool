/* eslint-disable no-console */
// Общая база заявок всех сайтов GooseLabs. Одинаковый файл во всех проектах
// (gooselabs.ru, pixeltool.pro, portfolio.gooselabs.ru): меняешь здесь,
// переноси и туда.
//
// База одна: Postgres pixeltool на том же сервере, контейнеры сайтов
// подключены к сети pixeltool-net. Строка подключения в DATABASE_URL.
// Таблицы создаются сами при первой заявке. Заявки в site_leads: имя leads
// в этой базе уже занято подписчиками лид-магнита pixeltool.

import { Pool } from 'pg'

import type { Attribution } from './attribution'

export interface LeadRecord {
	site: string
	form: string
	name?: string
	phone?: string
	email?: string
	telegram?: string
	message?: string
	adsConsent?: boolean
	/** Все поля формы в том виде, в каком они ушли в Telegram */
	fields: Record<string, string | boolean>
	attribution?: Attribution
}

const SCHEMA = `
CREATE TABLE IF NOT EXISTS site_leads (
  id BIGSERIAL PRIMARY KEY,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  site TEXT NOT NULL,
  form TEXT NOT NULL,
  name TEXT,
  phone TEXT,
  email TEXT,
  telegram TEXT,
  message TEXT,
  ads_consent BOOLEAN NOT NULL DEFAULT false,
  fields JSONB NOT NULL DEFAULT '{}'::jsonb,
  page TEXT,
  utm_source TEXT,
  utm_medium TEXT,
  utm_campaign TEXT,
  utm_content TEXT,
  utm_term TEXT,
  yclid TEXT,
  gclid TEXT,
  ym_client_id TEXT,
  first_utm_source TEXT,
  first_utm_medium TEXT,
  first_utm_campaign TEXT,
  first_referrer TEXT,
  first_visit_at TIMESTAMPTZ,
  attribution JSONB,
  telegram_sent_at TIMESTAMPTZ
);
CREATE INDEX IF NOT EXISTS site_leads_created_at_idx ON site_leads (created_at DESC);
CREATE INDEX IF NOT EXISTS site_leads_site_idx ON site_leads (site);
CREATE INDEX IF NOT EXISTS site_leads_utm_idx ON site_leads (utm_source, utm_medium, utm_campaign);

-- Отзывы и баг-репорты всех сайтов. Таблица заведена в pixeltool
-- (lib/db/schema.sql там же), определение должно совпадать.
CREATE TABLE IF NOT EXISTS site_messages (
  id SERIAL PRIMARY KEY,
  source TEXT NOT NULL,
  type TEXT,
  name TEXT,
  email TEXT,
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  meta JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  telegram_sent_at TIMESTAMPTZ
);
ALTER TABLE site_messages ADD COLUMN IF NOT EXISTS site TEXT NOT NULL DEFAULT 'pixeltool.pro';
`

const globalForLeads = globalThis as unknown as {
	leadsPool?: Pool
	leadsSchema?: Promise<void>
}

function getPool(): Pool | null {
	const url = process.env.DATABASE_URL
	if (!url) return null
	if (!globalForLeads.leadsPool) {
		globalForLeads.leadsPool = new Pool({ connectionString: url, max: 3 })
	}
	return globalForLeads.leadsPool
}

async function ready(pool: Pool) {
	if (!globalForLeads.leadsSchema) {
		globalForLeads.leadsSchema = pool.query(SCHEMA).then(
			() => undefined,
			error => {
				globalForLeads.leadsSchema = undefined
				throw error
			}
		)
	}
	return globalForLeads.leadsSchema
}

function validDate(iso?: string): string | null {
	if (!iso) return null
	return Number.isNaN(new Date(iso).getTime()) ? null : iso
}

// Возвращает id заявки или null, если база не настроена или недоступна.
export async function saveLead(lead: LeadRecord): Promise<number | null> {
	const pool = getPool()
	if (!pool) {
		console.error('DATABASE_URL не задан: заявка не сохранена в базу')
		return null
	}
	const a = lead.attribution
	const last = a?.last
	const first = a?.first
	try {
		await ready(pool)
		const { rows } = await pool.query<{ id: string }>(
			`INSERT INTO site_leads (
        site, form, name, phone, email, telegram, message, ads_consent, fields,
        page, utm_source, utm_medium, utm_campaign, utm_content, utm_term,
        yclid, gclid, ym_client_id,
        first_utm_source, first_utm_medium, first_utm_campaign, first_referrer,
        first_visit_at, attribution
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8, $9,
        $10, $11, $12, $13, $14, $15,
        $16, $17, $18,
        $19, $20, $21, $22,
        $23, $24
      ) RETURNING id`,
			[
				lead.site,
				lead.form,
				lead.name || null,
				lead.phone || null,
				lead.email || null,
				lead.telegram || null,
				lead.message || null,
				lead.adsConsent ?? false,
				JSON.stringify(lead.fields),
				a?.page ?? null,
				last?.utm_source ?? null,
				last?.utm_medium ?? null,
				last?.utm_campaign ?? null,
				last?.utm_content ?? null,
				last?.utm_term ?? null,
				last?.yclid ?? first?.yclid ?? null,
				last?.gclid ?? first?.gclid ?? null,
				a?.ymClientId ?? null,
				first?.utm_source ?? null,
				first?.utm_medium ?? null,
				first?.utm_campaign ?? null,
				first?.referrer ?? null,
				validDate(first?.at),
				a ? JSON.stringify(a) : null
			]
		)
		return Number(rows[0].id)
	} catch (error) {
		console.error('Заявка не сохранена в базу:', error)
		return null
	}
}

export async function markLeadSent(id: number) {
	const pool = getPool()
	if (!pool) return
	try {
		await pool.query(
			'UPDATE site_leads SET telegram_sent_at = now() WHERE id = $1',
			[id]
		)
	} catch (error) {
		console.error('Не удалось отметить отправку заявки в Telegram:', error)
	}
}

export interface SiteMessageRecord {
	site: string
	/** contact | feedback */
	source: string
	/** bug | feature | general */
	type?: string
	name?: string
	email?: string
	subject: string
	message: string
	meta?: Record<string, unknown>
}

// Отзывы и баг-репорты: пишутся в site_messages той же базы.
export async function saveSiteMessage(
	record: SiteMessageRecord
): Promise<number | null> {
	const pool = getPool()
	if (!pool) {
		console.error('DATABASE_URL не задан: сообщение не сохранено в базу')
		return null
	}
	try {
		await ready(pool)
		const { rows } = await pool.query<{ id: number }>(
			`INSERT INTO site_messages (site, source, type, name, email, subject, message, meta)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING id`,
			[
				record.site,
				record.source,
				record.type ?? null,
				record.name ?? null,
				record.email ?? null,
				record.subject,
				record.message,
				record.meta ? JSON.stringify(record.meta) : null
			]
		)
		return rows[0].id
	} catch (error) {
		console.error('Сообщение не сохранено в базу:', error)
		return null
	}
}

export async function markSiteMessageSent(id: number) {
	const pool = getPool()
	if (!pool) return
	try {
		await pool.query(
			'UPDATE site_messages SET telegram_sent_at = now() WHERE id = $1',
			[id]
		)
	} catch (error) {
		console.error('Не удалось отметить отправку сообщения в Telegram:', error)
	}
}
