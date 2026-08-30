const RU_DATE_RE = /^(\d{1,2})\.(\d{1,2})\.(\d{4})$/
const RU_DATE_DIGITS_RE = /^(\d{2})(\d{2})(\d{4})$/

/**
 * Маска для живого ввода: цифры, набранные подряд без точек, сами
 * расставляются по местам ДД.ММ.ГГГГ по мере набора.
 */
export function maskRuDateInput(raw: string): string {
	const digits = raw.replace(/\D/g, '').slice(0, 8)
	const day = digits.slice(0, 2)
	const month = digits.slice(2, 4)
	const year = digits.slice(4, 8)

	let result = day
	if (month) result += `.${month}`
	if (year) result += `.${year}`
	return result
}

/** Форматирует ISO-строку (YYYY-MM-DD) в привычный вид ДД.ММ.ГГГГ. */
export function formatIsoToRu(iso: string): string {
	if (!iso) return ''
	const [year, month, day] = iso.split('-')
	if (!year || !month || !day) return ''
	return `${day}.${month}.${year}`
}

/**
 * Парсит дату в формате ДД.ММ.ГГГГ (без ведущих нулей тоже) в ISO-строку.
 * Также принимает 8 цифр подряд без разделителей (ДДММГГГГ) — так быстрее
 * набирать на мобильной цифровой клавиатуре. Возвращает null для неполного,
 * невалидного ввода или несуществующей даты (например, 31 февраля) —
 * компонент трактует null как «пока не коммитим».
 */
export function parseRuDateToIso(text: string): string | null {
	const trimmed = text.trim()
	const match = RU_DATE_RE.exec(trimmed) ?? RU_DATE_DIGITS_RE.exec(trimmed)
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
