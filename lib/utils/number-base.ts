/**
 * Перевод чисел между системами счисления.
 *
 * Целую часть считаем через BigInt, а не Number: числа вроде
 * 11111111111111111111111111111111 в двоичной записи (32 единицы) не влезают
 * в double без потери младших разрядов, и без BigInt инструмент тихо врал бы
 * на длинных значениях — ровно на тех, ради которых его и открывают.
 */

export const MIN_BASE = 2
export const MAX_BASE = 36

const DIGITS = '0123456789abcdefghijklmnopqrstuvwxyz'

/** Сколько знаков дробной части считаем: дальше начинается шум округления. */
const FRACTION_DIGITS = 12

export type BaseConversion = {
	value: string | null
	/** Что не так с введённым числом, если перевести не удалось. */
	problem: string | null
}

function isValidDigits(text: string, base: number): boolean {
	const allowed = DIGITS.slice(0, base)
	return [...text].every(char => allowed.includes(char))
}

export function convertBase(
	raw: string,
	from: number,
	to: number
): BaseConversion {
	const input = raw.trim().toLowerCase().replace(/\s+/g, '')
	if (!input) return { value: null, problem: null }

	const negative = input.startsWith('-')
	const unsigned = negative ? input.slice(1) : input

	const [intPart = '', fracPart = ''] = unsigned.split('.')
	if (unsigned.split('.').length > 2) {
		return { value: null, problem: 'В числе больше одной точки.' }
	}
	if (!intPart && !fracPart) {
		return { value: null, problem: 'Введите число.' }
	}
	if (!isValidDigits(intPart + fracPart, from)) {
		const allowed = DIGITS.slice(0, from)
		return {
			value: null,
			problem: `В системе с основанием ${from} используются только цифры ${allowed.split('').join(' ')}.`
		}
	}

	// Целая часть: собираем значение по схеме Горнера в BigInt. Литералы вида
	// 0n здесь не годятся — цель компиляции проекта ниже ES2020, поэтому
	// пользуемся конструктором.
	let integer = BigInt(0)
	const bigFrom = BigInt(from)
	for (const char of intPart) {
		integer = integer * bigFrom + BigInt(DIGITS.indexOf(char))
	}

	let result = integer.toString(to)

	if (fracPart) {
		// Дробная часть считается умножением остатка на основание: каждый шаг
		// даёт очередную цифру. Обрываем, когда остаток обнулился, — иначе
		// периодические дроби (0.1 из десятичной в двоичную) уходят в
		// бесконечность.
		let fraction = 0
		for (let i = fracPart.length - 1; i >= 0; i--) {
			fraction = (fraction + DIGITS.indexOf(fracPart[i])) / from
		}
		let digits = ''
		for (let i = 0; i < FRACTION_DIGITS && fraction > 0; i++) {
			fraction *= to
			const digit = Math.floor(fraction)
			digits += DIGITS[digit]
			fraction -= digit
		}
		if (digits) result += `.${digits}`
	}

	return { value: (negative ? '-' : '') + result, problem: null }
}

/** Разбор числа по разрядам — для наглядной таблицы под результатом. */
export function explainDigits(
	raw: string,
	base: number
): { digit: string; power: number; value: string }[] {
	const input = raw.trim().toLowerCase().replace(/[\s-]/g, '').split('.')[0]
	if (!input || !isValidDigits(input, base)) return []

	return [...input].map((char, index) => {
		const power = input.length - index - 1
		let value = BigInt(DIGITS.indexOf(char))
		for (let step = 0; step < power; step++) value *= BigInt(base)
		return { digit: char, power, value: value.toString() }
	})
}
