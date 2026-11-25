/**
 * Шифр Цезаря — сдвиг каждой буквы на фиксированное число позиций по кругу
 * алфавита. Логика вынесена сюда целиком: круг на странице только рисует то,
 * что считают эти функции, и тесты проверяют арифметику, а не вёрстку.
 */

export type CaesarAlphabet = 'latin' | 'cyrillic'

/**
 * Кириллица взята полной, с Ё (33 буквы), а не усечённой до 32. Вариант без Ё
 * необратим: «ёж» после шифрования и расшифровки возвращается «ежом». Но в
 * школьных задачах и на других сайтах его встречают часто, и шифровка из 32
 * букв, вскрытая по 33, даёт мусор после буквы Е. Поэтому 32-буквенный
 * вариант доступен опцией `withYo: false` (см. {@link CaesarOptions}).
 */
export const CAESAR_ALPHABETS: Record<CaesarAlphabet, string> = {
	latin: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
	cyrillic: 'АБВГДЕЁЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯ'
}

export interface CaesarOptions {
	/**
	 * Считать ли Ё отдельной буквой русского алфавита. По умолчанию да
	 * (33 буквы). При `false` алфавит из 32 букв, а Ё в тексте шифруется как Е.
	 * На латиницу не влияет.
	 */
	withYo?: boolean
}

/** Буквы алфавита в верхнем регистре с учётом варианта с Ё или без. */
export const caesarLetters = (
	alphabet: CaesarAlphabet,
	options: CaesarOptions = {}
): string =>
	alphabet === 'cyrillic' && options.withYo === false
		? CAESAR_ALPHABETS.cyrillic.replace('Ё', '')
		: CAESAR_ALPHABETS[alphabet]

/** Длина алфавита — она же количество различимых ключей. */
export const alphabetSize = (
	alphabet: CaesarAlphabet,
	options: CaesarOptions = {}
): number => caesarLetters(alphabet, options).length

/** Сдвиг, приведённый к диапазону 0…N−1: −3 по латинице это то же, что 23. */
export const normalizeShift = (
	shift: number,
	alphabet: CaesarAlphabet,
	options: CaesarOptions = {}
): number => {
	const size = alphabetSize(alphabet, options)
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
	alphabet: CaesarAlphabet,
	options: CaesarOptions = {}
): string {
	if (!text) return ''

	const noYo = alphabet === 'cyrillic' && options.withYo === false
	// В алфавите без Ё буква Ё становится Е ещё до сдвига, иначе она прошла
	// бы насквозь как «чужой» символ и выдала бы шифровку
	const source = noYo ? text.replace(/Ё/g, 'Е').replace(/ё/g, 'е') : text

	const upper = caesarLetters(alphabet, options)
	const lower = upper.toLowerCase()
	const size = upper.length
	const step = normalizeShift(shift, alphabet, options)
	if (step === 0) return source

	let result = ''
	for (const char of source) {
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
	alphabet: CaesarAlphabet,
	options: CaesarOptions = {}
): string => caesarShift(text, shift, alphabet, options)

export const decryptCaesar = (
	text: string,
	shift: number,
	alphabet: CaesarAlphabet,
	options: CaesarOptions = {}
): string => caesarShift(text, -shift, alphabet, options)

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
	alphabet: CaesarAlphabet,
	options: CaesarOptions = {}
): CaesarGuess[] {
	const size = alphabetSize(alphabet, options)
	const guesses: CaesarGuess[] = []
	for (let shift = 1; shift < size; shift++) {
		guesses.push({ shift, text: decryptCaesar(text, shift, alphabet, options) })
	}
	return guesses
}

/**
 * Частоты букв в процентах: русские по Национальному корпусу русского языка,
 * английские по таблице Лиуанда. Те же цифры, что в таблице под инструментом.
 */
const LETTER_FREQUENCIES: Record<CaesarAlphabet, Record<string, number>> = {
	cyrillic: {
		О: 10.97,
		Е: 8.45,
		А: 8.01,
		И: 7.35,
		Н: 6.7,
		Т: 6.26,
		С: 5.47,
		Р: 4.73,
		В: 4.54,
		Л: 4.4,
		К: 3.49,
		М: 3.21,
		Д: 2.98,
		П: 2.81,
		У: 2.62,
		Я: 2.01,
		Ы: 1.9,
		Ь: 1.74,
		Г: 1.7,
		З: 1.65,
		Б: 1.59,
		Ч: 1.44,
		Й: 1.21,
		Х: 0.97,
		Ж: 0.94,
		Ш: 0.73,
		Ю: 0.64,
		Ц: 0.48,
		Щ: 0.36,
		Э: 0.32,
		Ф: 0.26,
		Ъ: 0.04,
		Ё: 0.04
	},
	latin: {
		E: 12.7,
		T: 9.06,
		A: 8.17,
		O: 7.51,
		I: 6.97,
		N: 6.75,
		S: 6.33,
		H: 6.09,
		R: 5.99,
		D: 4.25,
		L: 4.03,
		C: 2.78,
		U: 2.76,
		M: 2.41,
		W: 2.36,
		F: 2.23,
		G: 2.02,
		Y: 1.97,
		P: 1.93,
		B: 1.49,
		V: 0.98,
		K: 0.77,
		J: 0.15,
		X: 0.15,
		Q: 0.1,
		Z: 0.07
	}
}

/**
 * Насколько текст похож на обычный язык: сумма логарифмов частот его букв,
 * делённая на их число. Чем больше, тем правдоподобнее. Чужие символы не
 * учитываются. Для пустого текста — минус бесконечность.
 */
export function languageScore(text: string, alphabet: CaesarAlphabet): number {
	const table = LETTER_FREQUENCIES[alphabet]
	let sum = 0
	let count = 0
	for (const char of text.toUpperCase()) {
		const frequency = table[char]
		if (frequency === undefined) continue
		sum += Math.log(frequency)
		count++
	}
	return count === 0 ? -Infinity : sum / count
}

/**
 * Самые частые короткие слова и типичная лексика записок. На фразе из двух-трёх
 * слов частот букв мало, и «Мама мыла раму» по ним проигрывает мусорному
 * «Сесе саре хесш». Узнанное слово перевешивает такие случайности.
 */
const COMMON_WORDS: Record<CaesarAlphabet, Set<string>> = {
	cyrillic: new Set(
		(
			'и в не на я что он с как а то это по но к у из за ты мы вы она они его ' +
			'её ее мне меня тебя тебе нас вас был была было быть есть все всё так же ' +
			'от для о об до если уже или да нет вот где когда там тут здесь кто чем ' +
			'при только еще ещё бы ли ну даже очень можно надо будет может мой твой ' +
			'свой наш один два три привет пока спасибо люблю мама папа дом день ' +
			'время год жизнь человек сегодня завтра вчера хорошо ключ код шифр ' +
			'пароль под над через после без'
		)
			.toUpperCase()
			.split(' ')
	),
	latin: new Set(
		(
			'the and to of a in is it you that he was for on are with as i his they ' +
			'be at one have this from or had by not but what all were we when your ' +
			'can said there an each which she do how their if will up other about ' +
			'out many then them these so some her would make like him into time has ' +
			'look two more go see no way could people my than first been who its ' +
			'now find long down day did get come made may love hello world hi yes ' +
			'meet me secret key code under over good luck stop help'
		)
			.toUpperCase()
			.split(' ')
	)
}

/** Сколько весит доля узнанных слов против средней частоты букв. */
const WORD_WEIGHT = 1.5

/**
 * Насколько текст похож на обычный язык: средний логарифм частоты букв плюс
 * доля слов из списка частых. Чем больше, тем правдоподобнее.
 */
export function guessScore(text: string, alphabet: CaesarAlphabet): number {
	const letters = languageScore(text, alphabet)
	const words = text
		.toUpperCase()
		.split(/[^A-ZА-ЯЁ]+/)
		.filter(Boolean)
	if (words.length === 0) return letters
	const known = words.filter(word => COMMON_WORDS[alphabet].has(word)).length
	return letters + (WORD_WEIGHT * known) / words.length
}

/**
 * Варианты перебора, отсортированные от самого правдоподобного. Это тот же
 * частотный анализ, что описан под инструментом, только посчитанный за
 * человека. На фразе из нескольких слов верный ключ почти всегда первый, на
 * одном коротком слове порядок может ошибаться: «да» и «ну» одинаково
 * правдоподобны.
 */
export function rankCaesarGuesses(
	guesses: CaesarGuess[],
	alphabet: CaesarAlphabet
): CaesarGuess[] {
	return guesses
		.map(guess => ({ guess, score: guessScore(guess.text, alphabet) }))
		.sort((a, b) => b.score - a.score || a.guess.shift - b.guess.shift)
		.map(({ guess }) => guess)
}

/**
 * Не зашифрован ли русский текст алфавитом другой длины. Шифровка из 32 букв,
 * вскрытая по 33, даёт почти читаемый текст, где съехали все буквы после Е,
 * и наоборот. Сравниваем лучший вариант перебора в обоих алфавитах: если
 * другой заметно правдоподобнее, возвращаем его, иначе null.
 */
export function suggestYoVariant(
	text: string,
	withYo: boolean
): (CaesarGuess & { withYo: boolean }) | null {
	if (countLetters(text, 'cyrillic') < CONFIDENT_GUESS_LETTERS) return null
	const best = (yo: boolean) => {
		const [top] = rankCaesarGuesses(
			caesarBruteForce(text, 'cyrillic', { withYo: yo }),
			'cyrillic'
		)
		return { ...top, score: guessScore(top.text, 'cyrillic') }
	}
	const current = best(withYo)
	const other = best(!withYo)
	if (other.score - current.score < YO_SWITCH_MARGIN) return null
	return { shift: other.shift, text: other.text, withYo: !withYo }
}

/** Насколько вариант в другом алфавите должен быть лучше, чтобы его предложить. */
const YO_SWITCH_MARGIN = 0.3

/**
 * Сколько букв нужно, чтобы доверять первому месту перебора. Ниже порога
 * вариантов с похожими частотами слишком много.
 */
export const CONFIDENT_GUESS_LETTERS = 8

/** Число букв выбранного алфавита в тексте (с Ё и без неё одинаково). */
export const countLetters = (text: string, alphabet: CaesarAlphabet): number =>
	text.match(alphabet === 'latin' ? /[A-Za-z]/g : /[А-Яа-яЁё]/g)?.length ?? 0

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
