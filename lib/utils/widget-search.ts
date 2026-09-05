import type { Widget } from '@/lib/constants/widgets'
import { widgetCategories } from '@/lib/constants/widgets'

/**
 * Поиск по инструментам: разбор запроса на слова, поиск по всем полям виджета
 * и ранжирование выдачи.
 *
 * Зачем отдельная утилита, а не `includes` по заголовку: подстрока целиком
 * ломается на любом порядке слов. Запрос «конвертер валют» не находил
 * «Конвертер валют онлайн по курсу ЦБ» ровно до тех пор, пока слова стояли
 * подряд, а «валют конвертер» не находил ничего. Здесь запрос разбирается на
 * слова, и каждое слово должно найтись хоть в каком-то поле (И, не ИЛИ), но
 * искать их можно в разных полях и в любом порядке.
 */

/**
 * Поля виджета, по которым ищем, и вес совпадения в каждом. Объект, а не enum:
 * веса совпадают между полями (в теге и в заголовке подстрока стоит одинаково),
 * а enum с повторяющимися значениями запрещён линтером.
 */
const WEIGHT = {
	titleWordPrefix: 10,
	titleSubstring: 6,
	tagExact: 8,
	tagPrefix: 6,
	pathPrefix: 5,
	useCase: 3,
	description: 2,
	category: 2
} as const

/** Бонусы за совпадение всего запроса целиком, а не по словам. */
const TITLE_PREFIX_BONUS = 25
const TITLE_SUBSTRING_BONUS = 12

/**
 * Раскладка: «gfhjkm» вместо «пароль». Человек не всегда замечает, что забыл
 * переключить язык, а выдача при этом пустая. Таблица покрывает ЙЦУКЕН, включая
 * знаки препинания на тех же клавишах.
 */
const QWERTY_TO_JCUKEN: Record<string, string> = {
	q: 'й',
	w: 'ц',
	e: 'у',
	r: 'к',
	t: 'е',
	y: 'н',
	u: 'г',
	i: 'ш',
	o: 'щ',
	p: 'з',
	'[': 'х',
	']': 'ъ',
	a: 'ф',
	s: 'ы',
	d: 'в',
	f: 'а',
	g: 'п',
	h: 'р',
	j: 'о',
	k: 'л',
	l: 'д',
	';': 'ж',
	"'": 'э',
	z: 'я',
	x: 'ч',
	c: 'с',
	v: 'м',
	b: 'и',
	n: 'т',
	m: 'ь',
	',': 'б',
	'.': 'ю'
}

/**
 * Приводим строку к виду, по которому сравниваем: нижний регистр, «ё» к «е»
 * (иначе «счётчик» не находится по «счетчик»), любая пунктуация к пробелу.
 */
export function normalizeSearchText(value: string): string {
	return value
		.toLowerCase()
		.replace(/ё/g, 'е')
		.replace(/[^\p{L}\p{N}]+/gu, ' ')
		.trim()
}

/** Перекладывает латиницу на кириллицу по позициям клавиш. */
export function switchKeyboardLayout(value: string): string {
	return value
		.toLowerCase()
		.split('')
		.map(char => QWERTY_TO_JCUKEN[char] ?? char)
		.join('')
}

/** Слово найдено как начало какого-нибудь слова в строке. */
function hasWordPrefix(haystack: string, token: string): boolean {
	if (haystack.startsWith(token)) return true
	return haystack.includes(' ' + token)
}

interface Searchable {
	widget: Widget
	title: string
	description: string
	useCase: string
	category: string
	path: string
	tags: string[]
}

function toSearchable(widget: Widget): Searchable {
	return {
		widget,
		// Заголовок и описание берём из реестра: это единственный источник
		// правды. Раньше глобальный поиск держал свой словарь по
		// translationKey, и 103 инструмента из 119 показывались в нём сырым
		// ключом вроде «tvSize», а по-русски не находились вовсе.
		title: normalizeSearchText(widget.title ?? widget.translationKey),
		description: normalizeSearchText(widget.description ?? ''),
		useCase: normalizeSearchText(widget.useCase ?? ''),
		category: normalizeSearchText(
			widgetCategories[widget.category] ?? widget.category
		),
		path: normalizeSearchText(widget.path ?? widget.id),
		tags: (widget.tags ?? []).map(normalizeSearchText)
	}
}

/** Лучший вес совпадения одного слова по всем полям. Ноль — не нашлось нигде. */
function scoreToken(item: Searchable, token: string): number {
	let best = 0

	if (hasWordPrefix(item.title, token)) best = WEIGHT.titleWordPrefix
	else if (item.title.includes(token)) best = WEIGHT.titleSubstring

	for (const tag of item.tags) {
		if (tag === token) best = Math.max(best, WEIGHT.tagExact)
		else if (hasWordPrefix(tag, token)) best = Math.max(best, WEIGHT.tagPrefix)
	}

	if (hasWordPrefix(item.path, token)) best = Math.max(best, WEIGHT.pathPrefix)
	if (item.useCase.includes(token)) best = Math.max(best, WEIGHT.useCase)
	if (item.description.includes(token))
		best = Math.max(best, WEIGHT.description)
	if (item.category.includes(token)) best = Math.max(best, WEIGHT.category)

	return best
}

function scoreWidget(
	item: Searchable,
	query: string,
	tokens: string[]
): number {
	let total = 0
	for (const token of tokens) {
		const score = scoreToken(item, token)
		// Хоть одно слово запроса не найдено нигде — инструмент не подходит.
		if (score === 0) return 0
		total += score
	}

	if (item.title.startsWith(query)) total += TITLE_PREFIX_BONUS
	else if (item.title.includes(query)) total += TITLE_SUBSTRING_BONUS

	return total
}

/**
 * Подходит ли инструмент под запрос, без подсчёта релевантности. Нужен там, где
 * порядок выдачи задаётся снаружи (каталог сортирует по категории, алфавиту или
 * просмотрам), а от поиска требуется только отбор.
 */
export function widgetMatchesQuery(widget: Widget, rawQuery: string): boolean {
	const query = normalizeSearchText(rawQuery)
	if (!query) return true

	const item = toSearchable(widget)
	if (scoreWidget(item, query, query.split(' ').filter(Boolean)) > 0)
		return true

	const swapped = normalizeSearchText(switchKeyboardLayout(query))
	if (swapped === query) return false
	return scoreWidget(item, swapped, swapped.split(' ').filter(Boolean)) > 0
}

export interface WidgetSearchOptions {
	/** Сколько инструментов вернуть. Без ограничения, если не задано. */
	limit?: number
}

/**
 * Возвращает инструменты, подходящие под запрос, от самых близких к самым
 * дальним. Пустой запрос даёт пустой массив: что показывать вместо выдачи,
 * решает вызывающий код.
 */
export function searchWidgets(
	widgets: Widget[],
	rawQuery: string,
	options: WidgetSearchOptions = {}
): Widget[] {
	const query = normalizeSearchText(rawQuery)
	if (!query) return []

	const items = widgets.map(toSearchable)

	const run = (q: string) => {
		const tokens = q.split(' ').filter(Boolean)
		const scored: { widget: Widget; score: number }[] = []
		for (const item of items) {
			const score = scoreWidget(item, q, tokens)
			if (score > 0) scored.push({ widget: item.widget, score })
		}
		return scored
	}

	let scored = run(query)

	// Ничего не нашлось — возможно, забыли переключить раскладку.
	if (scored.length === 0) {
		const swapped = normalizeSearchText(switchKeyboardLayout(query))
		if (swapped !== query) scored = run(swapped)
	}

	scored.sort((a, b) => {
		if (b.score !== a.score) return b.score - a.score
		// При равном счёте вперёд идёт то, что чаще ищут: спрос из Вордстата.
		const volume = (b.widget.searchVolume ?? 0) - (a.widget.searchVolume ?? 0)
		if (volume !== 0) return volume
		return (a.widget.title ?? '').localeCompare(b.widget.title ?? '', 'ru')
	})

	const result = scored.map(entry => entry.widget)
	return options.limit ? result.slice(0, options.limit) : result
}
