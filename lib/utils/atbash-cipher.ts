/**
 * Шифр Атбаш — зеркальная замена алфавита: первая буква меняется местами с
 * последней, вторая с предпоследней и так далее. Ключа нет вообще, замена
 * всегда одна и та же, а шифрование и расшифровка — одна и та же операция:
 * применить зеркало дважды, и буква возвращается на своё место. Алфавиты и
 * вспомогательные функции определения языка переиспользованы из шифра
 * Цезаря — это тот же выбор кириллицы/латиницы для той же задачи.
 */

import {
	CAESAR_ALPHABETS,
	type CaesarAlphabet,
	detectAlphabet,
	hasForeignLetters
} from './caesar-cipher'

export type AtbashAlphabet = CaesarAlphabet
export const ATBASH_ALPHABETS = CAESAR_ALPHABETS
export { detectAlphabet, hasForeignLetters }

/**
 * Зеркалит буквы выбранного алфавита: буква с номером i становится буквой с
 * номером (n−1−i). Регистр сохраняется, всё остальное — цифры, пробелы,
 * знаки и буквы другого алфавита — проходит насквозь.
 */
export function atbashTransform(
	text: string,
	alphabet: AtbashAlphabet
): string {
	if (!text) return ''

	const upper = CAESAR_ALPHABETS[alphabet]
	const lower = upper.toLowerCase()
	const size = upper.length

	let result = ''
	for (const char of text) {
		const upperIndex = upper.indexOf(char)
		if (upperIndex !== -1) {
			result += upper[size - 1 - upperIndex]
			continue
		}

		const lowerIndex = lower.indexOf(char)
		if (lowerIndex !== -1) {
			result += lower[size - 1 - lowerIndex]
			continue
		}

		result += char
	}

	return result
}
