const RU_DATE_RE = /^(\d{1,2})\.(\d{1,2})\.(\d{4})$/

/** Форматирует ISO-строку (YYYY-MM-DD) в привычный вид ДД.ММ.ГГГГ. */
export function formatIsoToRu(iso: string): string {
	if (!iso) return ''
	const [year, month, day] = iso.split('-')
	if (!year || !month || !day) return ''
	return `${day}.${month}.${year}`
}

/**
 * Парсит дату в формате ДД.ММ.ГГГГ (без ведущих нулей тоже) в ISO-строку.
 * Возвращает null для неполного, невалидного ввода или несуществующей даты
 * (например, 31 февраля) — компонент трактует null как «пока не коммитим».
 */
export function parseRuDateToIso(text: string): string | null {
	const match = RU_DATE_RE.exec(text.trim())
	if (!match) return null

	const day = Number(match[1])
	const month = Number(match[2])
	const year = Number(match[3])

	const date = new Date(year, month - 1, day)
	const isRealDate =
		date.getFullYear() === year &&
		date.getMonth() === month - 1 &&
		date.getDate() === day

	if (!isRealDate) return null

	return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`
}
