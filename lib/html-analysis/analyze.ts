/**
 * Анализ качества HTML: семантика, доступность, заголовки.
 *
 * Чистая функция без побочных эффектов — принимает строку разметки, отдаёт
 * отчёт. Валидность W3C сюда не входит: она асинхронная (ходит на сервис) и
 * добавляется к отчёту отдельно (см. w3c.ts и merge.ts), чтобы это ядро
 * оставалось синхронным и тестируемым без сети.
 */

export type Severity = 'error' | 'warning'

export interface Check {
	id: string
	severity: Severity
	title: string
	/** Подробность: что именно и сколько. */
	detail: string
	/** Сколько элементов затронуто (для «3 картинки без alt»). */
	count: number
}

export type CategoryKey =
	| 'semantics'
	| 'accessibility'
	| 'headings'
	| 'validity'

export interface CategoryResult {
	key: CategoryKey
	label: string
	/** 0–100. */
	score: number
	checks: Check[]
}

export interface AnalysisStats {
	elements: number
	maxDepth: number
	images: number
	links: number
	formFields: number
	classes: number
	ids: number
}

export interface AnalysisReport {
	/** Целая страница (есть html/head/title) или фрагмент разметки. */
	isWholePage: boolean
	overall: number
	categories: CategoryResult[]
	stats: AnalysisStats
}

const ERROR_PENALTY = 15
const WARNING_PENALTY = 5

/** Балл категории: за каждую проблему снимаем вес, не уходя ниже нуля. */
export function scoreOf(checks: Check[]): number {
	const penalty = checks.reduce(
		(sum, check) =>
			sum + (check.severity === 'error' ? ERROR_PENALTY : WARNING_PENALTY),
		0
	)
	return Math.max(0, 100 - penalty)
}

/**
 * Целая страница или фрагмент. DOMParser всегда оборачивает вход в html/head/
 * body, поэтому наличие этих тегов ничего не говорит — смотрим на исходную
 * строку: у страницы есть doctype, <html>, <head>, <title> или <meta>.
 */
export function looksLikeWholePage(html: string): boolean {
	return /<(!doctype|html|head|title|meta)\b/i.test(html)
}

function checkSemantics(doc: Document, isWholePage: boolean): Check[] {
	const checks: Check[] = []
	const all = doc.body.querySelectorAll('*').length

	if (isWholePage) {
		const mains = doc.querySelectorAll('main').length
		if (mains === 0) {
			checks.push({
				id: 'no-main',
				severity: 'error',
				title: 'Нет элемента <main>',
				detail:
					'Основное содержимое страницы стоит обернуть в <main> — так его находят скринридеры и поисковики.',
				count: 1
			})
		} else if (mains > 1) {
			checks.push({
				id: 'multiple-main',
				severity: 'error',
				title: 'Несколько <main>',
				detail: `На странице ${mains} элементов <main>, а должен быть один.`,
				count: mains
			})
		}

		if (doc.querySelector('header') === null) {
			checks.push({
				id: 'no-header',
				severity: 'warning',
				title: 'Нет <header>',
				detail: 'Шапку страницы принято обозначать элементом <header>.',
				count: 1
			})
		}
		if (doc.querySelector('footer') === null) {
			checks.push({
				id: 'no-footer',
				severity: 'warning',
				title: 'Нет <footer>',
				detail: 'Подвал страницы принято обозначать элементом <footer>.',
				count: 1
			})
		}
		if (doc.querySelector('nav') === null) {
			checks.push({
				id: 'no-nav',
				severity: 'warning',
				title: 'Нет <nav>',
				detail: 'Блоки навигации стоит оборачивать в <nav>.',
				count: 1
			})
		}
	}

	// b/i вместо strong/em: старые презентационные теги.
	const bold = doc.querySelectorAll('b').length
	const italic = doc.querySelectorAll('i:not([class])').length
	const legacy = bold + italic
	if (legacy > 0) {
		checks.push({
			id: 'legacy-bi',
			severity: 'warning',
			title: '<b> и <i> вместо <strong> и <em>',
			detail: `Найдено ${legacy}: <b>/<i> задают только вид, а <strong>/<em> несут смысл выделения. (<i class> обычно иконка — не считается.)`,
			count: legacy
		})
	}

	// Засилье div: грубый признак несемантичной вёрстки.
	const divs = doc.querySelectorAll('div').length
	if (all >= 20 && divs / all > 0.5) {
		checks.push({
			id: 'div-soup',
			severity: 'warning',
			title: 'Много <div>',
			detail: `<div> — ${divs} из ${all} элементов (${Math.round((divs / all) * 100)}%). Часть можно заменить семантическими тегами: section, article, nav.`,
			count: divs
		})
	}

	return checks
}

function checkAccessibility(doc: Document, isWholePage: boolean): Check[] {
	const checks: Check[] = []

	if (isWholePage) {
		const html = doc.documentElement
		if (!html.getAttribute('lang')) {
			checks.push({
				id: 'no-lang',
				severity: 'error',
				title: 'Нет атрибута lang',
				detail:
					'У <html> не задан язык. Без него скринридер не знает, как читать текст, а браузер — предлагать ли перевод.',
				count: 1
			})
		}
	}

	const imagesNoAlt = Array.from(doc.querySelectorAll('img')).filter(
		img => !img.hasAttribute('alt')
	).length
	if (imagesNoAlt > 0) {
		checks.push({
			id: 'img-no-alt',
			severity: 'error',
			title: 'Картинки без alt',
			detail: `${imagesNoAlt} <img> без атрибута alt. Для декоративных ставьте пустой alt="", для смысловых — описание.`,
			count: imagesNoAlt
		})
	}

	// Поля форм без доступного имени.
	const fields = Array.from(
		doc.querySelectorAll('input:not([type="hidden"]), select, textarea')
	)
	const labelledIds = new Set(
		Array.from(doc.querySelectorAll('label[for]')).map(l =>
			l.getAttribute('for')
		)
	)
	const fieldsNoLabel = fields.filter(field => {
		if (field.getAttribute('aria-label')) return false
		if (field.getAttribute('aria-labelledby')) return false
		if (field.id && labelledIds.has(field.id)) return false
		if (field.closest('label')) return false
		return true
	}).length
	if (fieldsNoLabel > 0) {
		checks.push({
			id: 'field-no-label',
			severity: 'error',
			title: 'Поля без подписи',
			detail: `${fieldsNoLabel} полей формы без <label>, aria-label или обёртки в label. Скринридер прочитает их как безымянные.`,
			count: fieldsNoLabel
		})
	}

	// Дубли id.
	const ids = Array.from(doc.querySelectorAll('[id]')).map(el => el.id)
	const seen = new Set<string>()
	const dupes = new Set<string>()
	for (const id of ids) {
		if (seen.has(id)) dupes.add(id)
		seen.add(id)
	}
	if (dupes.size > 0) {
		checks.push({
			id: 'dup-id',
			severity: 'error',
			title: 'Повторяющиеся id',
			detail: `Повторяются: ${Array.from(dupes).slice(0, 5).join(', ')}${dupes.size > 5 ? '…' : ''}. id должен быть уникальным.`,
			count: dupes.size
		})
	}

	// Ссылки и кнопки без доступного текста.
	const emptyControls = Array.from(
		doc.querySelectorAll('a[href], button')
	).filter(el => {
		if (el.textContent?.trim()) return false
		if (el.getAttribute('aria-label')) return false
		if (el.querySelector('img[alt]:not([alt=""])')) return false
		if (el.getAttribute('title')) return false
		return true
	}).length
	if (emptyControls > 0) {
		checks.push({
			id: 'empty-control',
			severity: 'error',
			title: 'Ссылки и кнопки без текста',
			detail: `${emptyControls} ссылок/кнопок без доступного текста. Добавьте текст, aria-label или alt у вложенной картинки.`,
			count: emptyControls
		})
	}

	// Таблицы данных без заголовков.
	const tablesNoTh = Array.from(doc.querySelectorAll('table')).filter(
		table => table.querySelector('th') === null
	).length
	if (tablesNoTh > 0) {
		checks.push({
			id: 'table-no-th',
			severity: 'warning',
			title: 'Таблицы без заголовков',
			detail: `${tablesNoTh} таблиц без <th>. Заголовочные ячейки связывают данные со столбцом/строкой для скринридеров.`,
			count: tablesNoTh
		})
	}

	return checks
}

function checkHeadings(doc: Document, isWholePage: boolean): Check[] {
	const checks: Check[] = []
	const headings = Array.from(
		doc.querySelectorAll('h1, h2, h3, h4, h5, h6')
	).map(el => Number(el.tagName[1]))

	const h1Count = headings.filter(level => level === 1).length

	if (isWholePage && h1Count === 0) {
		checks.push({
			id: 'no-h1',
			severity: 'error',
			title: 'Нет H1',
			detail: 'У страницы должен быть один заголовок H1 — главная тема.',
			count: 1
		})
	}
	if (h1Count > 1) {
		checks.push({
			id: 'multiple-h1',
			severity: 'warning',
			title: 'Несколько H1',
			detail: `Заголовков H1 — ${h1Count}. Обычно на странице он один.`,
			count: h1Count
		})
	}

	// Пропуски уровней: с h2 сразу на h4.
	let skips = 0
	for (let i = 1; i < headings.length; i++) {
		if (headings[i] - headings[i - 1] > 1) skips++
	}
	if (skips > 0) {
		checks.push({
			id: 'heading-skip',
			severity: 'warning',
			title: 'Пропуск уровней заголовков',
			detail: `${skips} раз уровень скачет больше чем на один (например с H2 на H4). Это ломает оглавление документа.`,
			count: skips
		})
	}

	return checks
}

function collectStats(doc: Document): AnalysisStats {
	const all = Array.from(doc.body.querySelectorAll('*'))

	let maxDepth = 0
	const depthOf = (el: Element): number => {
		let d = 0
		let node: Element | null = el
		while (node && node !== doc.body) {
			d++
			node = node.parentElement
		}
		return d
	}
	for (const el of all) maxDepth = Math.max(maxDepth, depthOf(el))

	const classes = new Set<string>()
	for (const el of all) {
		el.classList.forEach(c => classes.add(c))
	}

	return {
		elements: all.length,
		maxDepth,
		images: doc.querySelectorAll('img').length,
		links: doc.querySelectorAll('a[href]').length,
		formFields: doc.querySelectorAll('input, select, textarea').length,
		classes: classes.size,
		ids: doc.querySelectorAll('[id]').length
	}
}

const LABELS: Record<CategoryKey, string> = {
	semantics: 'Семантика',
	accessibility: 'Доступность',
	headings: 'Заголовки',
	validity: 'Валидность W3C'
}

/** Локальный анализ разметки. Категория validity добавляется отдельно. */
export function analyzeDocument(html: string): AnalysisReport {
	const doc = new DOMParser().parseFromString(html, 'text/html')
	const isWholePage = looksLikeWholePage(html)

	const categories: CategoryResult[] = [
		{ key: 'semantics', checks: checkSemantics(doc, isWholePage) },
		{ key: 'accessibility', checks: checkAccessibility(doc, isWholePage) },
		{ key: 'headings', checks: checkHeadings(doc, isWholePage) }
	].map(({ key, checks }) => ({
		key: key as CategoryKey,
		label: LABELS[key as CategoryKey],
		score: scoreOf(checks),
		checks
	}))

	const overall = Math.round(
		categories.reduce((sum, c) => sum + c.score, 0) / categories.length
	)

	return {
		isWholePage,
		overall,
		categories,
		stats: collectStats(doc)
	}
}
