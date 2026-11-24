/**
 * Транслитерация русского текста латиницей по трём схемам.
 *
 * - `gost`: ГОСТ 7.79-2000, система Б (без диакритики). Таблица сверена с
 *   текстом стандарта: ц → cz, но c перед i, e, y, j; ъ → ``, ь → `,
 *   ы → y`, э → e` (знак ` это гравис, U+0060).
 * - `passport`: загранпаспорт. Таблица из приложения «Транслитерация
 *   кириллических знаков» к приказу МВД России от 31.12.2019 № 996,
 *   она же рекомендации ICAO Doc 9303: ё → e, й → i, х → kh, ц → ts,
 *   щ → shch, ъ → ie, ь не передаётся, ю → iu, я → ia.
 * - `url`: обиходная «яндексовая» схема для адресов страниц. Официальной
 *   таблицы у Яндекса нет, это сложившаяся практика рунета: х → h,
 *   щ → sch, ъ и ь выбрасываются. Результат дополнительно приводится к виду
 *   адреса: строчные буквы, цифры и дефисы.
 */

export type TranslitStandard = 'gost' | 'passport' | 'url'

type Table = Record<string, string>

const COMMON: Table = {
	а: 'a',
	б: 'b',
	в: 'v',
	г: 'g',
	д: 'd',
	е: 'e',
	ж: 'zh',
	з: 'z',
	и: 'i',
	к: 'k',
	л: 'l',
	м: 'm',
	н: 'n',
	о: 'o',
	п: 'p',
	р: 'r',
	с: 's',
	т: 't',
	у: 'u',
	ф: 'f',
	ч: 'ch',
	ш: 'sh'
}

export const TABLES: Record<TranslitStandard, Table> = {
	gost: {
		...COMMON,
		ё: 'yo',
		й: 'j',
		х: 'x',
		ц: 'cz',
		щ: 'shh',
		ъ: '``',
		ы: 'y`',
		ь: '`',
		э: 'e`',
		ю: 'yu',
		я: 'ya'
	},
	passport: {
		...COMMON,
		ё: 'e',
		й: 'i',
		х: 'kh',
		ц: 'ts',
		щ: 'shch',
		ъ: 'ie',
		ы: 'y',
		ь: '',
		э: 'e',
		ю: 'iu',
		я: 'ia'
	},
	url: {
		...COMMON,
		ё: 'e',
		й: 'y',
		х: 'h',
		ц: 'c',
		щ: 'sch',
		ъ: '',
		ы: 'y',
		ь: '',
		э: 'e',
		ю: 'yu',
		я: 'ya'
	}
}

/** Порядок букв русского алфавита для таблиц на странице. */
export const RUSSIAN_ALPHABET = [
	...'абвгдеёжзийклмнопрстуфхцчшщъыьэюя'
] as const

const isLetter = (ch: string | undefined) =>
	ch !== undefined && ch.toLowerCase() !== ch.toUpperCase()

const isUpper = (ch: string | undefined) =>
	isLetter(ch) && ch === ch!.toUpperCase()

/**
 * ГОСТ 7.79-2000 Б: ц передаётся как c перед i, e, y, j и как cz во всех
 * остальных случаях. Смотрим, с какой латинской буквы начнётся следующая.
 */
function gostTse(next: string | undefined): string {
	if (next === undefined) return 'cz'
	const lower = next.toLowerCase()
	const out = TABLES.gost[lower] ?? lower
	return /^[ieyj]/.test(out) ? 'c' : 'cz'
}

/**
 * Регистр многобуквенной замены: «Щука» → Shchuka, «ЩУКА» → SHCHUKA.
 * Слово считается написанным капсом, если заглавная и соседняя буква.
 */
function applyCase(
	out: string,
	prev: string | undefined,
	next: string | undefined
): string {
	if (!out) return out
	const wordInCaps = isLetter(next) ? isUpper(next) : isUpper(prev)
	if (out.length === 1 || wordInCaps) return out.toUpperCase()
	return out[0].toUpperCase() + out.slice(1)
}

/**
 * Посимвольная транслитерация. Всё, чего нет в таблице (латиница, цифры,
 * знаки препинания, переносы строк), остаётся как есть.
 */
export function transliterate(
	text: string,
	standard: TranslitStandard
): string {
	const table = TABLES[standard]
	const chars = [...text]
	let result = ''

	for (let i = 0; i < chars.length; i++) {
		const ch = chars[i]
		const lower = ch.toLowerCase()
		let out =
			standard === 'gost' && lower === 'ц'
				? gostTse(chars[i + 1])
				: table[lower]

		if (out === undefined) {
			result += ch
			continue
		}
		if (ch !== lower) out = applyCase(out, chars[i - 1], chars[i + 1])
		result += out
	}

	return result
}

/**
 * Адрес страницы из заголовка: транслит по схеме url, строчные буквы,
 * всё, кроме латиницы и цифр, превращается в дефис, дефисы не повторяются
 * и не стоят по краям.
 */
export function toSlug(text: string): string {
	return transliterate(text.toLowerCase(), 'url')
		.normalize('NFKD')
		.replace(/[̀-ͯ]/g, '')
		.toLowerCase()
		.replace(/[^a-z0-9]+/g, '-')
		.replace(/^-+|-+$/g, '')
}

/** Результат для выбранной схемы: для url это готовый адрес построчно. */
export function convert(
	text: string,
	standard: TranslitStandard,
	options: { uppercase?: boolean } = {}
): string {
	if (standard === 'url') {
		return text
			.split('\n')
			.map(line => toSlug(line))
			.join('\n')
	}
	const out = transliterate(text, standard)
	return options.uppercase ? out.toUpperCase() : out
}
