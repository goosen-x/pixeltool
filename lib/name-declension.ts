/**
 * Склонение русских фамилий, имён и отчеств по падежам.
 *
 * Правила по справочнику Д. Э. Розенталя («Справочник по правописанию и
 * литературной правке», раздел о склонении имён собственных): фамилии на
 * -ов/-ин склоняются по смешанному типу, на -ский/-ой как прилагательные,
 * мужские на согласный как существительные, а женские на согласный не
 * склоняются; на -о, -е, -и, -у, -ых/-их и на -а после гласной не
 * склоняются вовсе.
 *
 * Ударение по написанию не определить, поэтому там, где окончание
 * творительного падежа зависит от него (Ткачом / Абрамовичем), выбран более
 * частый в фамилиях вариант. Беглую гласную в фамилиях не убираем
 * (Кравец → Кравеца): справочники допускают такой вариант, чтобы фамилия
 * оставалась узнаваемой. В именах беглая гласная есть только у Павла, Льва
 * и Петра, они заданы исключениями.
 */

export type Gender = 'male' | 'female'

export type CaseId =
	| 'nominative'
	| 'genitive'
	| 'dative'
	| 'accusative'
	| 'instrumental'
	| 'prepositional'

export const CASES: { id: CaseId; label: string; question: string }[] = [
	{ id: 'nominative', label: 'Именительный', question: 'кто?' },
	{ id: 'genitive', label: 'Родительный', question: 'кого?' },
	{ id: 'dative', label: 'Дательный', question: 'кому?' },
	{ id: 'accusative', label: 'Винительный', question: 'кого?' },
	{ id: 'instrumental', label: 'Творительный', question: 'кем?' },
	{ id: 'prepositional', label: 'Предложный', question: 'о ком?' }
]

/** Шесть форм слова в порядке CASES. */
export type Forms = [string, string, string, string, string, string]

type Endings = [string, string, string, string, string]

const VOWELS = 'аеёиоуыэюя'
const VELAR = 'гкх'
const SIBILANT = 'жшчщ'

const last = (word: string, n = 1) => word.slice(-n)
/** Буква перед последними n буквами слова. */
const before = (word: string, n: number) => word.charAt(word.length - n - 1)

/** Отрезать `cut` букв и приставить окончания косвенных падежей. */
function apply(word: string, cut: number, endings: Endings): Forms {
	const stem = word.slice(0, word.length - cut)
	return [word, ...endings.map(e => stem + e)] as Forms
}

const same = (word: string): Forms => [word, word, word, word, word, word]

/** Существительное на -а (Анна, Никита, Глинка, Пуща). */
function firstDeclensionA(word: string): Forms {
	const p = before(word, 1)
	const gen = VELAR.includes(p) || SIBILANT.includes(p) ? 'и' : 'ы'
	const ins = SIBILANT.includes(p) || p === 'ц' ? 'ей' : 'ой'
	return apply(word, 1, [gen, 'е', 'у', ins, 'е'])
}

/** Существительное на -я (Катя, Дарья, Головня); на -ия отдельно. */
function firstDeclensionYa(word: string): Forms {
	if (word.endsWith('ия')) return apply(word, 1, ['и', 'и', 'ю', 'ей', 'и'])
	return apply(word, 1, ['и', 'е', 'ю', 'ей', 'е'])
}

/** Мужское существительное на твёрдый согласный (Иван, Шевчук). */
function masculineConsonant(word: string): Forms {
	// -ич безударное (Абрамовичем); у прочих шипящих и -ц ударение не
	// узнать, а Ткач, Кузнец, Кулиш чаще ударные: Ткачом
	const ins = word.endsWith('ич') ? 'ем' : 'ом'
	return apply(word, 0, ['а', 'у', 'а', ins, 'е'])
}

/** Мужское на -ь или на -й после гласной (Игорь, Сергей, Николай). */
function masculineSoft(word: string): Forms {
	return apply(word, 1, ['я', 'ю', 'я', 'ем', 'е'])
}

const isCyrillicWord = (word: string) => /^[а-яё]+$/.test(word)

// ---------------------------------------------------------------- имена

const FIRST_NAME_EXCEPTIONS: Record<string, Endings> = {
	павел: ['павла', 'павлу', 'павла', 'павлом', 'павле'],
	лев: ['льва', 'льву', 'льва', 'львом', 'льве'],
	пётр: ['петра', 'петру', 'петра', 'петром', 'петре'],
	петр: ['петра', 'петру', 'петра', 'петром', 'петре'],
	илья: ['ильи', 'илье', 'илью', 'ильёй', 'илье'],
	любовь: ['любови', 'любови', 'любовь', 'любовью', 'любови']
}

/** Мужские имена на -а/-я. */
const MALE_A_NAMES = new Set([
	'никита',
	'илья',
	'фома',
	'кузьма',
	'лука',
	'савва',
	'данила',
	'гаврила',
	'мина',
	'ваня',
	'петя',
	'дима',
	'миша',
	'гриша',
	'паша',
	'лёша',
	'леша',
	'коля',
	'толя',
	'вова',
	'боря',
	'федя',
	'серёжа',
	'сережа',
	'юра',
	'костя',
	'стёпа',
	'степа',
	'гоша',
	'митя',
	'лёва',
	'лева',
	'слава'
])

/** Имена, по которым пол не понять. */
const AMBIGUOUS_NAMES = new Set([
	'саша',
	'женя',
	'валя',
	'шура',
	'сима',
	'мишель',
	'ким'
])

/** Женские имена на согласный или -ь. */
const FEMALE_CONSONANT_NAMES = new Set([
	'любовь',
	'нинель',
	'адель',
	'ассоль',
	'рашель',
	'эсфирь',
	'юдифь',
	'руфь',
	'рахиль',
	'кармен',
	'ирэн',
	'элен',
	'эллен',
	'николь',
	'изабель',
	'мариам',
	'айгуль',
	'гульнур',
	'динур'
])

function declineFirstNamePart(word: string, gender: Gender): Forms {
	const exception = FIRST_NAME_EXCEPTIONS[word]
	if (exception) return [word, ...exception] as Forms
	if (!isCyrillicWord(word) || word.length < 2) return same(word)

	const tail = last(word)
	if (tail === 'а') return firstDeclensionA(word)
	if (tail === 'я') return firstDeclensionYa(word)

	if (gender === 'female') {
		if (tail === 'ь') return apply(word, 1, ['и', 'и', 'ь', 'ью', 'и'])
		return same(word)
	}

	if (word.endsWith('ий')) return apply(word, 1, ['я', 'ю', 'я', 'ем', 'и'])
	if (tail === 'ь' || tail === 'й') return masculineSoft(word)
	if (VOWELS.includes(tail)) return same(word)
	return masculineConsonant(word)
}

// ------------------------------------------------------------- отчества

const STRESSED_ICH = new Set(['ильич', 'кузьмич', 'лукич', 'фомич'])
const TURKIC_MALE = /\s(оглы|улы|уулу)$/
const TURKIC_FEMALE = /\s(кызы|гызы)$/

function declinePatronymicPart(word: string, gender: Gender): Forms {
	if (!isCyrillicWord(word)) return same(word)
	if (gender === 'male' && word.endsWith('ич')) {
		const ins = STRESSED_ICH.has(word) ? 'ом' : 'ем'
		return apply(word, 0, ['а', 'у', 'а', ins, 'е'])
	}
	if (gender === 'female' && word.endsWith('на')) {
		return apply(word, 1, ['ы', 'е', 'у', 'ой', 'е'])
	}
	return same(word)
}

// -------------------------------------------------------------- фамилии

/** Французские фамилии с ударением на конце: по написанию их не отличить. */
const STRESSED_FOREIGN_SURNAMES = new Set([
	'дюма',
	'тома',
	'дега',
	'золя',
	'труайя',
	'петипа'
])

function declineSurnamePart(word: string, gender: Gender): Forms {
	if (!isCyrillicWord(word) || word.length < 2) return same(word)

	// Не склоняются при любом поле: Шевченко, Дурново, Гёте, Черных, Ли, Ру
	if (/[оеэиыую]$/.test(word) || /(ых|их)$/.test(word)) return same(word)
	// -а/-я после гласной (Галуа, Моруа), кроме -ия (Берия) и -ая/-яя
	if (/[аеёиоуыэюя][ая]$/.test(word) && !/(ия|ая|яя)$/.test(word)) {
		return same(word)
	}
	if (STRESSED_FOREIGN_SURNAMES.has(word)) return same(word)

	if (gender === 'female') {
		if (/(ов|ев|ёв|ин|ын)а$/.test(word)) {
			return apply(word, 1, ['ой', 'ой', 'у', 'ой', 'ой'])
		}
		if (word.endsWith('яя')) {
			return apply(word, 2, ['ей', 'ей', 'юю', 'ей', 'ей'])
		}
		if (word.endsWith('ая')) {
			const soft = SIBILANT.includes(before(word, 2))
			const e = soft ? 'ей' : 'ой'
			return apply(word, 2, [e, e, 'ую', e, e])
		}
		if (last(word) === 'а') return firstDeclensionA(word)
		if (last(word) === 'я') return firstDeclensionYa(word)
		// Шевчук, Гоголь, Палей у женщин не склоняются
		return same(word)
	}

	if (/(ов|ев|ёв|ин|ын)$/.test(word)) {
		return apply(word, 0, ['а', 'у', 'а', 'ым', 'е'])
	}
	// Цой, Бой: в односложной фамилии -ой не окончание прилагательного
	const stemHasVowel = /[аеёиоуыэюя]/.test(word.slice(0, -2))
	if (!stemHasVowel && /[оыи]й$/.test(word)) return masculineSoft(word)
	if (word.endsWith('ый')) {
		return apply(word, 2, ['ого', 'ому', 'ого', 'ым', 'ом'])
	}
	if (word.endsWith('ой')) {
		const p = before(word, 2)
		const ins = VELAR.includes(p) || SIBILANT.includes(p) ? 'им' : 'ым'
		return apply(word, 2, ['ого', 'ому', 'ого', ins, 'ом'])
	}
	if (word.endsWith('ий')) {
		const p = before(word, 2)
		if (VELAR.includes(p)) {
			// Достоевский, Горький
			return apply(word, 2, ['ого', 'ому', 'ого', 'им', 'ом'])
		}
		if (SIBILANT.includes(p) || p === 'н') {
			// Рыжий, Задорожний
			return apply(word, 2, ['его', 'ему', 'его', 'им', 'ем'])
		}
		// Гарматий: как существительное
		return apply(word, 1, ['я', 'ю', 'я', 'ем', 'и'])
	}
	const tail = last(word)
	if (tail === 'ь' || tail === 'й') return masculineSoft(word)
	if (tail === 'а') return firstDeclensionA(word)
	if (tail === 'я') return firstDeclensionYa(word)
	return masculineConsonant(word)
}

// ------------------------------------------------------------- регистр

/** Вернуть регистр как во введённом слове: ИВАНОВ → ИВАНОВА, иванов → Иванова. */
function matchCase(original: string, form: string): string {
	const letters = original.replace(/[^a-zа-яё]/gi, '')
	if (letters.length > 1 && letters === letters.toUpperCase()) {
		return form.toUpperCase()
	}
	return form.charAt(0).toUpperCase() + form.slice(1)
}

/** Приставки в фамилиях, которые не склоняются: Тер-Петросян, фон Браун. */
const SURNAME_PREFIXES = new Set([
	'тер',
	'сен',
	'сент',
	'фон',
	'ван',
	'дер',
	'де',
	'ди',
	'дю',
	'да',
	'ла',
	'ле',
	'ибн',
	'бен',
	'аль',
	'эль',
	'мак'
])

/**
 * Склонить слово с дефисами по частям (Римский-Корсаков, Анна-Мария).
 * Части из `keep` (приставки) не склоняются, если за ними есть ещё часть.
 */
function byParts(
	input: string,
	gender: Gender,
	declinePart: (word: string, gender: Gender) => Forms,
	keep?: Set<string>
): Forms {
	const trimmed = input.trim().replace(/\s+/g, ' ')
	if (!trimmed) return same('')
	// разделители остаются в массиве на нечётных местах
	const pieces = trimmed.split(/([ -])/)
	const declined = pieces.map((piece, i) => {
		if (i % 2 === 1 || !piece) return same(piece)
		const lower = piece.toLowerCase()
		if (keep?.has(lower) && i < pieces.length - 1) return same(piece)
		return declinePart(lower, gender).map(f => matchCase(piece, f)) as Forms
	})
	return CASES.map((_, i) => declined.map(f => f[i]).join('')) as Forms
}

export function declineFirstName(name: string, gender: Gender): Forms {
	return byParts(name, gender, declineFirstNamePart)
}

export function declineSurname(surname: string, gender: Gender): Forms {
	return byParts(surname, gender, declineSurnamePart, SURNAME_PREFIXES)
}

export function declinePatronymic(patronymic: string, gender: Gender): Forms {
	const trimmed = patronymic.trim().replace(/\s+/g, ' ')
	const lower = trimmed.toLowerCase()
	// Гейдар оглы, Алиевна кызы: тюркские отчества не склоняются
	if (TURKIC_MALE.test(lower) || TURKIC_FEMALE.test(lower)) {
		const fixed = trimmed
			.split(' ')
			.map((w, i, arr) =>
				i === arr.length - 1 ? w.toLowerCase() : matchCase(w, w.toLowerCase())
			)
			.join(' ')
		return same(fixed)
	}
	return byParts(trimmed, gender, declinePatronymicPart)
}

// ----------------------------------------------------------------- пол

export type FullName = { last: string; first: string; middle: string }

function genderByPatronymic(middle: string): Gender | null {
	const w = middle.trim().toLowerCase()
	if (!w) return null
	if (TURKIC_MALE.test(w) || /(вич|ьич|ич)$/.test(w)) return 'male'
	if (TURKIC_FEMALE.test(w) || /(вна|чна|шна)$/.test(w)) return 'female'
	return null
}

function genderByFirstName(first: string): Gender | null {
	const w = first.trim().toLowerCase().split('-')[0]
	if (!w || !isCyrillicWord(w)) return null
	if (AMBIGUOUS_NAMES.has(w)) return null
	if (MALE_A_NAMES.has(w)) return 'male'
	if (FEMALE_CONSONANT_NAMES.has(w)) return 'female'
	const tail = last(w)
	if (tail === 'а' || tail === 'я') return 'female'
	if (VOWELS.includes(tail)) return null
	return 'male'
}

function genderBySurname(surname: string): Gender | null {
	const w = surname.trim().toLowerCase().split('-').pop() ?? ''
	if (/(ова|ева|ёва|ина|ына|ая|яя)$/.test(w)) return 'female'
	if (/(ов|ев|ёв|ин|ын|ий|ый|ой)$/.test(w)) return 'male'
	return null
}

/** Пол по отчеству, потом по имени, потом по фамилии; null, если не понять. */
export function detectGender(name: FullName): Gender | null {
	return (
		genderByPatronymic(name.middle) ??
		genderByFirstName(name.first) ??
		genderBySurname(name.last)
	)
}

// --------------------------------------------------------------- целиком

export type DeclinedName = {
	gender: Gender
	/** true, если пол определили по ФИО, а не взяли по умолчанию */
	detected: boolean
	last: Forms
	first: Forms
	middle: Forms
}

export function declineFullName(
	name: FullName,
	forcedGender?: Gender
): DeclinedName {
	const auto = detectGender(name)
	const gender = forcedGender ?? auto ?? 'male'
	return {
		gender,
		detected: forcedGender ? true : auto !== null,
		last: declineSurname(name.last, gender),
		first: declineFirstName(name.first, gender),
		middle: declinePatronymic(name.middle, gender)
	}
}

export type NameFormat = 'fio' | 'iof' | 'initials'

/** Инициал имени или отчества: Анна-Мария → А.-М., Гейдар оглы → Г. */
function initial(word: string): string {
	const w = word.trim()
	if (!w) return ''
	if (TURKIC_MALE.test(w.toLowerCase()) || TURKIC_FEMALE.test(w.toLowerCase())) {
		return w.charAt(0).toUpperCase() + '.'
	}
	return w
		.split('-')
		.filter(Boolean)
		.map(part => part.charAt(0).toUpperCase() + '.')
		.join('-')
}

/** Собрать ФИО в одном падеже в нужном порядке. */
export function formatName(
	declined: DeclinedName,
	caseIndex: number,
	format: NameFormat
): string {
	const l = declined.last[caseIndex]
	const f = declined.first[caseIndex]
	const m = declined.middle[caseIndex]
	if (format === 'initials') {
		const initials = [initial(declined.first[0]), initial(declined.middle[0])]
			.filter(Boolean)
			.join(' ')
		return [l, initials].filter(Boolean).join(' ')
	}
	const parts = format === 'iof' ? [f, m, l] : [l, f, m]
	return parts.filter(Boolean).join(' ')
}

/**
 * Разложить вставленную строку «Иванов Иван Иванович» по трём полям.
 * Всё, что после второго слова, считается отчеством (Мамедов Ильхам
 * Гейдар оглы). Если второе слово похоже на отчество, порядок «Имя Отчество
 * Фамилия».
 */
export function splitFullName(input: string): FullName {
	const words = input.trim().split(/\s+/).filter(Boolean)
	if (words.length === 0) return { last: '', first: '', middle: '' }
	if (words.length === 1) return { last: words[0], first: '', middle: '' }
	if (words.length === 3 && genderByPatronymic(words[1])) {
		return { first: words[0], middle: words[1], last: words[2] }
	}
	return {
		last: words[0],
		first: words[1],
		middle: words.slice(2).join(' ')
	}
}
