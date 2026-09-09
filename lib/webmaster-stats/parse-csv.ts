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
		const [periodStart, periodEnd] = (datesRange ?? '')
			.split(' - ')
			.map(s => s.trim())

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
