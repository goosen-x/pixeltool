/**
 * Поиск букв-двойников из другого алфавита.
 *
 * Проблема не в том, что человек набрал текст не в той раскладке — такое видно
 * сразу («ghbdtn»). Ломает жизнь другое: при копировании из вордов, писем и
 * веба в русское слово попадает латинская буква, неотличимая от кириллической.
 * «Пароль» с латинской «о» выглядит правильно, но не находится поиском, не
 * совпадает при сравнении и не подходит при входе.
 *
 * Определяем так: слово считается заражённым, только если в нём есть буквы
 * обоих алфавитов. Одинокое латинское слово внутри русского текста —
 * нормальная ситуация («купить iPhone»), и трогать его нельзя.
 */

/**
 * Пары визуально неразличимых букв, кириллица → латиница.
 *
 * В нижнем регистре таких пар всего семь: только у них начертания совпадают
 * полностью. «к» и «k», «м» и «m», «н» и «h», «т» и «t», «в» и «b» похожи, но
 * различимы — включать их значило бы предлагать замену там, где подмены нет.
 * В верхнем регистре совпадений больше, потому что прописные проще.
 *
 * Отдельно добавлены буквы расширенной кириллицы (і, ј, ѕ, һ, ԛ, ԝ): в русском
 * тексте их не бывает вовсе, так что встреченная — всегда чужая.
 */
export const CYRILLIC_TO_LATIN: Record<string, string> = {
	А: 'A',
	В: 'B',
	Е: 'E',
	К: 'K',
	М: 'M',
	Н: 'H',
	О: 'O',
	Р: 'P',
	С: 'C',
	Т: 'T',
	У: 'Y',
	Х: 'X',
	а: 'a',
	е: 'e',
	о: 'o',
	р: 'p',
	с: 'c',
	у: 'y',
	х: 'x',
	І: 'I',
	Ј: 'J',
	Ѕ: 'S',
	Һ: 'H',
	Ԛ: 'Q',
	Ԝ: 'W',
	і: 'i',
	ј: 'j',
	ѕ: 's',
	һ: 'h',
	ԛ: 'q',
	ԝ: 'w'
}

/**
 * Обратные пары, латиница → кириллица. Не зеркало предыдущей карты: у
 * латинских i, j, s, q, w, h в русском алфавите замены нет, поэтому такая
 * буква в русском слове помечается как чужая, но исправить её нельзя —
 * инструмент честно об этом говорит вместо того, чтобы подставить украинскую
 * «і» в русский текст.
 */
export const LATIN_TO_CYRILLIC: Record<string, string> = {
	A: 'А',
	B: 'В',
	C: 'С',
	E: 'Е',
	H: 'Н',
	K: 'К',
	M: 'М',
	O: 'О',
	P: 'Р',
	T: 'Т',
	X: 'Х',
	Y: 'У',
	a: 'а',
	c: 'с',
	e: 'е',
	o: 'о',
	p: 'р',
	x: 'х',
	y: 'у'
}

export type Script = 'cyrillic' | 'latin'

const CYRILLIC = /\p{Script=Cyrillic}/u
const LATIN = /\p{Script=Latin}/u
/** Слово — непрерывный отрезок букв любого из двух алфавитов. */
const WORD = /[\p{Script=Cyrillic}\p{Script=Latin}]+/gu

export function scriptOf(char: string): Script | null {
	if (CYRILLIC.test(char)) return 'cyrillic'
	if (LATIN.test(char)) return 'latin'
	return null
}

export interface ScriptIssue {
	/** Позиция символа в исходном тексте. */
	index: number
	char: string
	/** Из какого алфавита буква, оказавшаяся чужой в этом слове. */
	from: Script
	/** Чем заменить; null — пары в целевом алфавите не существует. */
	suggestion: string | null
}

export interface MixedWord {
	word: string
	/** Позиция начала слова в исходном тексте. */
	start: number
	/** Алфавит, которым слово набрано на самом деле. */
	dominant: Script
	/**
	 * true — бесспорные буквы есть у обоих алфавитов сразу, то есть слово
	 * двуязычное намеренно («adminистратора», «IPхост»). Чужие буквы в нём
	 * показываются, но замену инструмент не предлагает: она бы его испортила.
	 */
	ambiguous: boolean
	issues: ScriptIssue[]
}

export interface AnalysisResult {
	words: MixedWord[]
	issues: ScriptIssue[]
	/** Сколько из найденных букв можно заменить автоматически. */
	fixable: number
	cyrillicCount: number
	latinCount: number
}

/**
 * Каким алфавитом слово набрано на самом деле и можно ли этому верить.
 *
 * Считаем не все буквы, а только те, у которых двойника нет: именно они
 * доказывают принадлежность. В слове «пaроль» латинская «a» — единственная
 * латинская буква, а бесспорно кириллических («п», «л», «ь») три, поэтому
 * слово русское. Простое большинство ошибалось бы на коротких словах вроде
 * «сoy», где двойников больше, чем настоящих букв.
 *
 * Если бесспорные буквы есть у обоих алфавитов сразу («adminистратора»,
 * «IPхост»), слово помечается как двуязычное. Различить намеренное сочетание и
 * подмену тут нельзя в принципе, поэтому показываем находку, но замену не
 * предлагаем: «администратора» превратилось бы в «adminctpatopa».
 */
function detectScript(word: string): { script: Script; ambiguous: boolean } {
	let cyrUnique = 0
	let latUnique = 0
	let cyr = 0
	let lat = 0

	for (const char of word) {
		const script = scriptOf(char)
		if (script === 'cyrillic') {
			cyr++
			if (!(char in CYRILLIC_TO_LATIN)) cyrUnique++
		} else if (script === 'latin') {
			lat++
			if (!(char in LATIN_TO_CYRILLIC)) latUnique++
		}
	}

	const ambiguous = cyrUnique > 0 && latUnique > 0

	if (cyrUnique !== latUnique) {
		return { script: cyrUnique > latUnique ? 'cyrillic' : 'latin', ambiguous }
	}
	// Бесспорных букв поровну — решаем по общему числу.
	if (cyr !== lat)
		return { script: cyr > lat ? 'cyrillic' : 'latin', ambiguous }
	// Полная ничья: считаем слово русским, сайт русскоязычный.
	return { script: 'cyrillic', ambiguous }
}

export function analyzeText(text: string): AnalysisResult {
	const words: MixedWord[] = []
	const issues: ScriptIssue[] = []
	let cyrillicCount = 0
	let latinCount = 0

	for (const match of text.matchAll(WORD)) {
		const word = match[0]
		const start = match.index ?? 0

		let hasCyrillic = false
		let hasLatin = false
		for (const char of word) {
			if (scriptOf(char) === 'cyrillic') hasCyrillic = true
			else hasLatin = true
		}

		if (hasCyrillic) cyrillicCount++
		if (hasLatin) latinCount++
		// Слово из одного алфавита — не наш случай, даже если оно латинское
		// посреди русского текста.
		if (!hasCyrillic || !hasLatin) continue

		const { script: dominant, ambiguous } = detectScript(word)
		const wordIssues: ScriptIssue[] = []

		for (let offset = 0; offset < word.length; offset++) {
			const char = word[offset]
			const script = scriptOf(char)
			if (!script || script === dominant) continue

			const suggestion = ambiguous
				? null
				: dominant === 'cyrillic'
					? (LATIN_TO_CYRILLIC[char] ?? null)
					: (CYRILLIC_TO_LATIN[char] ?? null)

			wordIssues.push({ index: start + offset, char, from: script, suggestion })
		}

		if (wordIssues.length > 0) {
			words.push({ word, start, dominant, ambiguous, issues: wordIssues })
			issues.push(...wordIssues)
		}
	}

	return {
		words,
		issues,
		fixable: issues.filter(issue => issue.suggestion !== null).length,
		cyrillicCount,
		latinCount
	}
}

/**
 * Заменяет найденные буквы на их двойников из нужного алфавита. Символы, для
 * которых замены нет, остаются как были — молча выбрасывать их нельзя.
 */
export function fixText(text: string, issues: ScriptIssue[]): string {
	if (issues.length === 0) return text

	// split('') намеренно вместо [...text]: индексы в ScriptIssue считаны по
	// UTF-16 (match.index и word[offset]), а разбор по кодовым точкам сдвинул бы
	// их на каждом эмодзи, встреченном раньше в тексте.
	const chars = text.split('')
	for (const issue of issues) {
		if (issue.suggestion) chars[issue.index] = issue.suggestion
	}
	return chars.join('')
}
