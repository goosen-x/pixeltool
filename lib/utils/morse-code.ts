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

export function textToMorse(text: string, lang: MorseLang): string {
	const table = TABLES[lang]

	return text
		.toUpperCase()
		.split(' ')
		.map(word =>
			[...word]
				.map(char => table[char])
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
