export type MorseLang = 'ru' | 'en'

const DIGITS: Record<string, string> = {
	'0': '-----',
	'1': '.----',
	'2': '..---',
	'3': '...--',
	'4': '....-',
	'5': '.....',
	'6': '-....',
	'7': '--...',
	'8': '---..',
	'9': '----.'
}

const PUNCTUATION: Record<string, string> = {
	'.': '.-.-.-',
	',': '--..--',
	'?': '..--..',
	"'": '.----.',
	'!': '-.-.--',
	'/': '-..-.',
	'(': '-.--.',
	')': '-.--.-',
	'&': '.-...',
	':': '---...',
	';': '-.-.-.',
	'=': '-...-',
	'+': '.-.-.',
	'-': '-....-',
	_: '..--.-',
	'"': '.-..-.',
	'@': '.--.-.'
}

const EN_LETTERS: Record<string, string> = {
	A: '.-',
	B: '-...',
	C: '-.-.',
	D: '-..',
	E: '.',
	F: '..-.',
	G: '--.',
	H: '....',
	I: '..',
	J: '.---',
	K: '-.-',
	L: '.-..',
	M: '--',
	N: '-.',
	O: '---',
	P: '.--.',
	Q: '--.-',
	R: '.-.',
	S: '...',
	T: '-',
	U: '..-',
	V: '...-',
	W: '.--',
	X: '-..-',
	Y: '-.--',
	Z: '--..'
}

const RU_LETTERS: Record<string, string> = {
	А: '.-',
	Б: '-...',
	В: '.--',
	Г: '--.',
	Д: '-..',
	// Ё стоит перед Е: у обеих код «.», а при разборе обратной таблицы
	// побеждает запись, добавленная последней — так декодирование «.»
	// возвращает более частую Е, а не Ё.
	Ё: '.',
	Е: '.',
	Ж: '...-',
	З: '--..',
	И: '..',
	Й: '.---',
	К: '-.-',
	Л: '.-..',
	М: '--',
	Н: '-.',
	О: '---',
	П: '.--.',
	Р: '.-.',
	С: '...',
	Т: '-',
	У: '..-',
	Ф: '..-.',
	Х: '....',
	Ц: '-.-.',
	Ч: '---.',
	Ш: '----',
	Щ: '--.-',
	Ъ: '--.--',
	Ы: '-.--',
	Ь: '-..-',
	Э: '..-..',
	Ю: '..--',
	Я: '.-.-'
}

const TABLES: Record<MorseLang, Record<string, string>> = {
	en: { ...EN_LETTERS, ...DIGITS, ...PUNCTUATION },
	ru: { ...RU_LETTERS, ...DIGITS, ...PUNCTUATION }
}

const REVERSE_TABLES: Record<MorseLang, Record<string, string>> = {
	en: Object.fromEntries(Object.entries(TABLES.en).map(([k, v]) => [v, k])),
	ru: Object.fromEntries(Object.entries(TABLES.ru).map(([k, v]) => [v, k]))
}

/**
 * Кириллица и латиница — разные диапазоны Unicode, буквы не пересекаются
 * по написанию. Поэтому при кодировании язык каждой буквы неоднозначности
 * не создаёт: таблица общая, «Hello Привет» кодируется корректно целиком,
 * без выбора «то ли русский, то ли английский» на весь текст сразу.
 */
const ENCODE_TABLE: Record<string, string> = {
	...EN_LETTERS,
	...RU_LETTERS,
	...DIGITS,
	...PUNCTUATION
}

export function textToMorse(text: string): string {
	return text
		.toUpperCase()
		.split(' ')
		.map(word =>
			[...word]
				.map(char => ENCODE_TABLE[char])
				.filter((code): code is string => Boolean(code))
				.join(' ')
		)
		.filter(Boolean)
		.join(' / ')
}

export function morseToText(morse: string, lang: MorseLang): string {
	const reverse = REVERSE_TABLES[lang]

	return morse
		.trim()
		.split('/')
		.map(word =>
			word
				.trim()
				.split(/\s+/)
				.filter(Boolean)
				.map(code => reverse[code] ?? '?')
				.join('')
		)
		.join(' ')
}

/**
 * Язык по исходному тексту для кодирования: считаем кириллические и
 * латинские буквы, побеждает та, которых больше. На цифрах/пунктуации
 * без единой буквы возвращаем текущий язык — незачем переключать его на
 * вводе одних цифр.
 */
export function detectTextLang(text: string, current: MorseLang): MorseLang {
	let cyrillic = 0
	let latin = 0

	for (const char of text) {
		if (/[а-яёА-ЯЁ]/.test(char)) cyrillic++
		else if (/[a-zA-Z]/.test(char)) latin++
	}

	if (cyrillic === 0 && latin === 0) return current
	return cyrillic >= latin ? 'ru' : 'en'
}

/**
 * Язык по коду Морзе для декодирования: пробуем обе таблицы и берём ту,
 * что даёт меньше нераспознанных символов «?». При равенстве (например,
 * код состоит только из цифр — они одинаковы в обеих таблицах) оставляем
 * текущий язык, чтобы не мигать между вариантами без повода.
 */
export function detectMorseLang(morse: string, current: MorseLang): MorseLang {
	const ruUnknown = (morseToText(morse, 'ru').match(/\?/g) ?? []).length
	const enUnknown = (morseToText(morse, 'en').match(/\?/g) ?? []).length

	if (ruUnknown === enUnknown) return current
	return ruUnknown < enUnknown ? 'ru' : 'en'
}
