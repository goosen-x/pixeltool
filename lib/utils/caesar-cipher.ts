/**
 * Шифр Цезаря — сдвиг каждой буквы на фиксированное число позиций по кругу
 * алфавита. Логика вынесена сюда целиком: круг на странице только рисует то,
 * что считают эти функции, и тесты проверяют арифметику, а не вёрстку.
 */

export type CaesarAlphabet = 'latin' | 'cyrillic'

/**
 * Кириллица взята полной, с Ё (33 буквы), а не усечённой до 32. Вариант без Ё
 * встречается чаще, но он необратим: «ёж» после шифрования и расшифровки
 * возвращается «ежом». Полный алфавит ничего не теряет.
 */
export const CAESAR_ALPHABETS: Record<CaesarAlphabet, string> = {
	latin: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
	cyrillic: 'АБВГДЕЁЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯ'
}

/** Длина алфавита — она же количество различимых ключей. */
export const alphabetSize = (alphabet: CaesarAlphabet): number =>
	CAESAR_ALPHABETS[alphabet].length

/** Сдвиг, приведённый к диапазону 0…N−1: −3 по латинице это то же, что 23. */
export const normalizeShift = (
	shift: number,
	alphabet: CaesarAlphabet
): number => {
	const size = alphabetSize(alphabet)
	return ((Math.trunc(shift) % size) + size) % size
}

/**
 * Сдвигает буквы выбранного алфавита на `shift` позиций вперёд. Отрицательный
 * сдвиг расшифровывает. Регистр сохраняется, всё остальное — цифры, пробелы,
 * знаки и буквы другого алфавита — проходит насквозь: так шифротекст остаётся
 * читаемым по структуре, и это же свойство делает шифр беззащитным перед
 * частотным анализом.
 */
export function caesarShift(
	text: string,
	shift: number,
	alphabet: CaesarAlphabet
): string {
	if (!text) return ''

	const upper = CAESAR_ALPHABETS[alphabet]
	const lower = upper.toLowerCase()
	const size = upper.length
	const step = normalizeShift(shift, alphabet)
	if (step === 0) return text

	let result = ''
	for (const char of text) {
		const upperIndex = upper.indexOf(char)
		if (upperIndex !== -1) {
			result += upper[(upperIndex + step) % size]
			continue
		}

		const lowerIndex = lower.indexOf(char)
		if (lowerIndex !== -1) {
			result += lower[(lowerIndex + step) % size]
			continue
		}

		result += char
	}

	return result
}

export const encryptCaesar = (
	text: string,
	shift: number,
	alphabet: CaesarAlphabet
): string => caesarShift(text, shift, alphabet)

export const decryptCaesar = (
	text: string,
	shift: number,
	alphabet: CaesarAlphabet
): string => caesarShift(text, -shift, alphabet)

export interface CaesarGuess {
	shift: number
	text: string
}

/**
 * Все осмысленные варианты расшифровки. Ключей у шифра ровно на один меньше,
 * чем букв в алфавите (нулевой сдвиг оставляет текст как есть), поэтому
 * перебор — не взлом, а просмотр 25 или 32 строк глазами.
 */
export function caesarBruteForce(
	text: string,
	alphabet: CaesarAlphabet
): CaesarGuess[] {
	const size = alphabetSize(alphabet)
	const guesses: CaesarGuess[] = []
	for (let shift = 1; shift < size; shift++) {
		guesses.push({ shift, text: decryptCaesar(text, shift, alphabet) })
	}
	return guesses
}

const LATIN_LETTERS = /[A-Za-z]/g
const CYRILLIC_LETTERS = /[А-Яа-яЁё]/g

/**
 * Какой алфавит переключить под введённый текст. Как и в переводчике азбуки
 * Морзе, это подсказка, а не жёсткое правило: при ничьей (пустая строка,
 * только цифры, поровну букв) остаётся то, что выбрал человек.
 */
export function detectAlphabet(
	text: string,
	current: CaesarAlphabet
): CaesarAlphabet {
	const latin = text.match(LATIN_LETTERS)?.length ?? 0
	const cyrillic = text.match(CYRILLIC_LETTERS)?.length ?? 0
	if (cyrillic > latin) return 'cyrillic'
	if (latin > cyrillic) return 'latin'
	return current
}

/** Есть ли в тексте буквы, которые при выбранном алфавите останутся как есть. */
export function hasForeignLetters(
	text: string,
	alphabet: CaesarAlphabet
): boolean {
	const foreign = alphabet === 'latin' ? CYRILLIC_LETTERS : LATIN_LETTERS
	foreign.lastIndex = 0
	return foreign.test(text)
}
