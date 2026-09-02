/**
 * Число прописью по-русски.
 *
 * Нужно не только само по себе («сумма прописью» — отдельный запрос), но и
 * в счетах-фактурах, где итог обязан дублироваться словами. Поэтому модуль
 * общий: им пользуются и калькулятор НДС, и отдельная страница.
 *
 * Главная сложность русского счёта — род и склонение. «Один рубль», но
 * «одна тысяча»; «два рубля», но «две тысячи». Разряды женского рода
 * (тысячи) требуют своих форм первых двух числительных, и на этом
 * спотыкается большинство самодельных реализаций.
 */

const ONES_MASCULINE = [
	'',
	'один',
	'два',
	'три',
	'четыре',
	'пять',
	'шесть',
	'семь',
	'восемь',
	'девять'
]

const ONES_FEMININE = [
	'',
	'одна',
	'две',
	'три',
	'четыре',
	'пять',
	'шесть',
	'семь',
	'восемь',
	'девять'
]

const TEENS = [
	'десять',
	'одиннадцать',
	'двенадцать',
	'тринадцать',
	'четырнадцать',
	'пятнадцать',
	'шестнадцать',
	'семнадцать',
	'восемнадцать',
	'девятнадцать'
]

const TENS = [
	'',
	'',
	'двадцать',
	'тридцать',
	'сорок',
	'пятьдесят',
	'шестьдесят',
	'семьдесят',
	'восемьдесят',
	'девяносто'
]

const HUNDREDS = [
	'',
	'сто',
	'двести',
	'триста',
	'четыреста',
	'пятьсот',
	'шестьсот',
	'семьсот',
	'восемьсот',
	'девятьсот'
]

/** Три формы слова: 1 рубль, 2 рубля, 5 рублей. */
export type Forms = [string, string, string]

export function pluralForm(count: number, forms: Forms): string {
	const mod10 = count % 10
	const mod100 = count % 100

	if (mod100 >= 11 && mod100 <= 14) return forms[2]
	if (mod10 === 1) return forms[0]
	if (mod10 >= 2 && mod10 <= 4) return forms[1]
	return forms[2]
}

/** Разряды: у тысяч женский род, у остальных мужской. */
const SCALES: { forms: Forms; feminine: boolean }[] = [
	{ forms: ['', '', ''], feminine: false },
	{ forms: ['тысяча', 'тысячи', 'тысяч'], feminine: true },
	{ forms: ['миллион', 'миллиона', 'миллионов'], feminine: false },
	{ forms: ['миллиард', 'миллиарда', 'миллиардов'], feminine: false },
	{ forms: ['триллион', 'триллиона', 'триллионов'], feminine: false }
]

/** Группа из трёх цифр словами. */
function tripletToWords(value: number, feminine: boolean): string[] {
	const words: string[] = []
	const hundreds = Math.floor(value / 100)
	const rest = value % 100

	if (hundreds > 0) words.push(HUNDREDS[hundreds])

	if (rest >= 10 && rest <= 19) {
		words.push(TEENS[rest - 10])
	} else {
		const tens = Math.floor(rest / 10)
		const ones = rest % 10
		if (tens > 0) words.push(TENS[tens])
		if (ones > 0) words.push((feminine ? ONES_FEMININE : ONES_MASCULINE)[ones])
	}

	return words
}

/**
 * Целое число словами, с учётом рода единиц измерения.
 *
 * `feminine` относится к самому числу («одна», «две»), а не к разрядам:
 * у тысяч род всегда женский независимо от того, что считаем.
 */
export function integerToWords(value: number, feminine = false): string {
	if (!Number.isFinite(value)) return ''
	const whole = Math.floor(Math.abs(value))
	if (whole === 0) return 'ноль'

	const groups: number[] = []
	let rest = whole
	while (rest > 0) {
		groups.push(rest % 1000)
		rest = Math.floor(rest / 1000)
	}

	const words: string[] = []
	for (let index = groups.length - 1; index >= 0; index--) {
		const group = groups[index]
		if (group === 0) continue

		const scale = SCALES[index] ?? SCALES[SCALES.length - 1]
		// Род берётся от разряда, а у нулевого разряда — от единицы измерения
		const isFeminine = index === 0 ? feminine : scale.feminine
		words.push(...tripletToWords(group, isFeminine))

		if (index > 0) words.push(pluralForm(group, scale.forms))
	}

	const result = words.filter(Boolean).join(' ')
	return value < 0 ? `минус ${result}` : result
}

export const RUBLE_FORMS: Forms = ['рубль', 'рубля', 'рублей']
export const KOPECK_FORMS: Forms = ['копейка', 'копейки', 'копеек']

export interface MoneyToWordsOptions {
	/** Копейки цифрами, как принято в счетах: «пять рублей 40 копеек». */
	kopecksAsDigits?: boolean
	/** Первая буква заглавная — так пишут в документах. */
	capitalize?: boolean
	rubleForms?: Forms
	kopeckForms?: Forms
}

/**
 * Сумма прописью для документов.
 *
 * Копейки по бухгалтерской традиции пишут цифрами, а не словами: так их
 * труднее подделать дописыванием и проще сверить с итогом. Рубли — женского
 * рода? Нет, мужского, а вот копейки женского, поэтому у них свой набор
 * числительных, и «двадцать одна копейка» звучит иначе, чем «двадцать один
 * рубль».
 */
export function moneyToWords(
	amount: number,
	options: MoneyToWordsOptions = {}
): string {
	const {
		kopecksAsDigits = true,
		capitalize = true,
		rubleForms = RUBLE_FORMS,
		kopeckForms = KOPECK_FORMS
	} = options

	if (!Number.isFinite(amount)) return ''

	const negative = amount < 0
	const absolute = Math.abs(amount)
	// Округляем до копейки заранее: иначе 0.005 даст «ноль рублей 1 копейка»
	// при одном способе округления и «0 копеек» при другом.
	const totalKopecks = Math.round(absolute * 100)
	const rubles = Math.floor(totalKopecks / 100)
	const kopecks = totalKopecks % 100

	const rubleWords = integerToWords(rubles)
	const rubleUnit = pluralForm(rubles, rubleForms)
	const kopeckUnit = pluralForm(kopecks, kopeckForms)

	const kopeckPart = kopecksAsDigits
		? `${String(kopecks).padStart(2, '0')} ${kopeckUnit}`
		: `${kopecks === 0 ? 'ноль' : integerToWords(kopecks, true)} ${kopeckUnit}`

	let result = `${rubleWords} ${rubleUnit} ${kopeckPart}`
	if (negative) result = `минус ${result}`
	if (capitalize) result = result.charAt(0).toUpperCase() + result.slice(1)

	return result
}
