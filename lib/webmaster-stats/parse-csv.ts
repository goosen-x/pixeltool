import { webmasterStatRowSchema, type WebmasterStatRow } from './schema'

/** Разбирает одну строку CSV с полями в кавычках (формат экспорта
 *  Яндекс.Вебмастера) — учитывает экранированные `""` внутри поля. */
function parseCsvLine(line: string): string[] {
	const fields: string[] = []
	let current = ''
	let inQuotes = false

	for (let i = 0; i < line.length; i++) {
		const char = line[i]
		if (inQuotes) {
			if (char === '"' && line[i + 1] === '"') {
				current += '"'
				i++
			} else if (char === '"') {
				inQuotes = false
			} else {
				current += char
			}
		} else if (char === '"') {
			inQuotes = true
		} else if (char === ',') {
			fields.push(current)
			current = ''
		} else {
			current += char
		}
	}
	fields.push(current)
	return fields
}

/**
 * Приводит дату к ISO, который ждёт схема.
 *
 * Вебмастер отдаёт период в российском формате `01.09.2026`, а `z.string().date()`
 * принимает только `2026-09-01`. Импорт падал на валидации Zod, и по сообщению
 * было не понять, что дело в формате даты, а не в самом файле. Принимаем оба
 * написания: ISO проходит как есть, `ДД.ММ.ГГГГ` переворачивается.
 */
function toIsoDate(value: string): string {
	const raw = value.trim()
	const ru = raw.match(/^(\d{2})\.(\d{2})\.(\d{4})$/)
	return ru ? `${ru[3]}-${ru[2]}-${ru[1]}` : raw
}

const toNumberOrNull = (value: string): number | null => {
	if (value.trim() === '') return null
	const n = Number(value)
	return Number.isFinite(n) ? n : null
}

/** Разбирает CSV из «Расширенной аналитики поисковых запросов по URL»
 *  Яндекс.Вебмастера (см. docs/seo/webmaster-url-report-2026-09.md) —
 *  только агрегаты по странице за период, без разбивки по бакетам позиций. */
export function parseWebmasterCsv(raw: string): WebmasterStatRow[] {
	const lines = raw.split(/\r?\n/).filter(line => line.trim().length > 0)
	const [, ...dataLines] = lines // первая строка — заголовок, пропускаем

	return dataLines.map(line => {
		const fields = parseCsvLine(line)
		const [
			path,
			datesRange,
			impressions,
			clicks,
			ctr,
			avgPosition,
			avgClickPosition
		] = fields
		// Разделитель у Вебмастера плавает: в одних выгрузках ` - `, в других
		// ` — ` или ` – `. Режем по любому тире с пробелами.
		const [periodStart, periodEnd] = (datesRange ?? '')
			.split(/\s+[-–—]\s+/)
			.map(part => toIsoDate(part))

		return webmasterStatRowSchema.parse({
			path,
			periodStart,
			periodEnd,
			impressions: Number(impressions) || 0,
			clicks: Number(clicks) || 0,
			ctr: Number(ctr) || 0,
			avgPosition: toNumberOrNull(avgPosition ?? ''),
			avgClickPosition: toNumberOrNull(avgClickPosition ?? '')
		})
	})
}
