/**
 * Перемешивание списка.
 *
 * Разбор ввода, честная перестановка Фишера — Йетса и форматирование
 * результата вынесены сюда из страницы, чтобы их можно было проверить тестом.
 */

export const MAX_ITEMS = 10_000

/** Источник случайных 32-битных чисел; в тестах подменяется. */
export type RandomUint32 = () => number

export const cryptoUint32: RandomUint32 = () => {
	const buf = new Uint32Array(1)
	crypto.getRandomValues(buf)
	return buf[0]
}

/**
 * Случайное целое 0…max-1 без перекоса от остатка: значения из «хвоста»
 * диапазона 2^32, который не делится на max нацело, отбрасываются.
 */
export function randomBelow(max: number, rand: RandomUint32 = cryptoUint32) {
	const range = 2 ** 32
	const limit = range - (range % max)
	let x = rand()
	while (x >= limit) x = rand()
	return x % max
}

/**
 * Разбивает текст на элементы. Обычно элемент это строка. Если строка одна,
 * а в ней есть запятые или точки с запятой («Аня, Боря, Вика»), режем по
 * ним: иначе перемешивать нечего, и кнопка будто бы не работает.
 */
export function parseItems(text: string): string[] {
	const lines = text
		.split(/\r\n|\r|\n/)
		.map(line => line.trim())
		.filter(line => line !== '')

	if (lines.length === 1) {
		const sep = lines[0].includes(';') ? ';' : lines[0].includes(',') ? ',' : ''
		if (sep) {
			const parts = lines[0]
				.split(sep)
				.map(part => part.trim())
				.filter(part => part !== '')
			if (parts.length > 1) return parts
		}
	}

	return lines
}

/** Перестановка Фишера — Йетса: каждый из n! порядков равновероятен. */
export function shuffle<T>(items: readonly T[], rand: RandomUint32 = cryptoUint32): T[] {
	const result = [...items]
	for (let i = result.length - 1; i > 0; i--) {
		const j = randomBelow(i + 1, rand)
		;[result[i], result[j]] = [result[j], result[i]]
	}
	return result
}

/** Совпал ли порядок с исходным (при 2–3 элементах это бывает часто). */
export function sameOrder<T>(a: readonly T[], b: readonly T[]) {
	return a.length === b.length && a.every((item, i) => item === b[i])
}

export function formatList(items: readonly string[], numbered: boolean) {
	return numbered
		? items.map((item, i) => `${i + 1}. ${item}`).join('\n')
		: items.join('\n')
}
