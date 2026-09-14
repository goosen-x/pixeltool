#!/usr/bin/env tsx
// scripts/cannibalization.ts
//
// Ищет страницы, которые конкурируют друг с другом за один интент: тул против
// статьи о том же, подстраница против своего хаба, две статьи об одном.
//
// Сигнал — пересечение значимых слов в title/H1/описании (Jaccard из
// lib/seo/topic-coverage.ts). Это кандидаты, а не приговор: окончательный
// ответ даёт выдача — две страницы каннибализируют друг друга, если по одному
// запросу поисковик показывает то одну, то другую. Проверять по GSC/Вебмастеру.
//
//   pnpm cannibalization            отчёт в stdout
//   pnpm cannibalization --json     машиночитаемо
import fs from 'node:fs'
import path from 'node:path'
import matter from 'gray-matter'

import { widgets } from '@/lib/constants/widgets'
import { TOOL_SUBPAGE_FAMILIES } from '@/lib/seo/tool-subpages'
import { tokenize, jaccardSimilarity } from '@/lib/seo/topic-coverage'

/**
 * Слова, которые есть у половины страниц каталога и потому ничего не говорят
 * о теме: без их отсева «Калькулятор объёма» и «Калькулятор процентов»
 * выглядят как дубли из-за одного общего слова.
 */
const STOPWORDS = new Set([
	'онлайн',
	'бесплатно',
	'бесплатный',
	'без',
	'регистрации',
	'быстро',
	'калькулятор',
	'генератор',
	'конвертер',
	'инструмент',
	'сервис',
	'pixeltool',
	'как',
	'что',
	'и',
	'в',
	'на',
	'с',
	'для',
	'по',
	'из',
	'к',
	'это',
	'или',
	'не',
	'а',
	'у',
	'о',
	'от',
	'до',
	'за',
	'же',
	'ли',
	'то',
	'сделать',
	'посчитать',
	'рассчитать',
	'узнать',
	'проверить',
	'перевести'
])

/**
 * Грубый стеммер: русская морфология ломает пересечение множеств в лоб —
 * «пропорций» и «пропорцию» это разные токены, хотя запрос один. Полноценный
 * стеммер сюда тащить незачем, обрезки до пяти букв достаточно, чтобы формы
 * одного слова схлопнулись. Ложные склейки («парол» ← «пароль»/«паролей»)
 * тут в плюс, а редкие чужие («конве» ← «конверт»/«конвертация») отсеиваются
 * глазами при чтении отчёта — он и так список кандидатов, а не приговор.
 */
const stem = (word: string): string =>
	word.length > 5 ? word.slice(0, 5) : word

const SIMILARITY_THRESHOLD = 0.25

interface Page {
	id: string
	url: string
	kind: 'tool' | 'subpage' | 'article'
	title: string
	tokens: Set<string>
	parent?: string
}

const significant = (text: string): Set<string> =>
	new Set(
		tokenize(text)
			.filter(word => word.length > 2 && !STOPWORDS.has(word))
			.map(stem)
	)

function collectPages(repoRoot: string): Page[] {
	const pages: Page[] = []

	for (const widget of widgets) {
		if (widget.demo) continue
		const text = [widget.title, widget.metaTitle, widget.description]
			.filter(Boolean)
			.join(' ')
		pages.push({
			id: `tool:${widget.path}`,
			url: `/tools/${widget.path}`,
			kind: 'tool',
			title: widget.title || widget.id,
			tokens: significant(text)
		})
	}

	for (const family of TOOL_SUBPAGE_FAMILIES) {
		for (const item of family.items) {
			pages.push({
				id: `page:${family.parentPath}/${item.slug}`,
				url: `/tools/${family.parentPath}/${item.slug}`,
				kind: 'subpage',
				title: item.label,
				tokens: significant(item.label),
				parent: `tool:${family.parentPath}`
			})
		}
	}

	const postsDir = path.join(repoRoot, '_posts')
	for (const name of fs.readdirSync(postsDir).filter(f => f.endsWith('.md'))) {
		const { data } = matter(fs.readFileSync(path.join(postsDir, name), 'utf-8'))
		const slug = name.replace(/\.md$/, '')
		const text = [data.title, data.excerpt].filter(Boolean).join(' ')
		pages.push({
			id: `post:${slug}`,
			url: `/blog/${slug}`,
			kind: 'article',
			title: typeof data.title === 'string' ? data.title : slug,
			tokens: significant(text)
		})
	}

	return pages
}

/**
 * Точный сигнал столкновения интентов, в отличие от Jaccard выше.
 *
 * Схожесть слов says только что страницы про одно и то же — а это нормально для
 * пары «инструмент + разбор»: «Калькулятор ИМТ» и «Как рассчитать ИМТ» делят
 * почти все слова и при этом ловят разные запросы. Настоящий конфликт выглядит
 * иначе: заголовок одной страницы целиком входит в начало заголовка другой
 * («Калькулятор бетона» и «Калькулятор бетона: сколько нужно на фундамент»).
 * Тогда обе борются за одну головную фразу, и поисковику приходится выбирать.
 */
function headlineStems(title: string): string[] {
	return tokenize(title)
		.filter(word => word.length > 2)
		.map(stem)
}

function startsWithTitleOf(a: Page, b: Page): boolean {
	const long = headlineStems(a.title)
	const short = headlineStems(b.title)
	if (short.length === 0 || short.length >= long.length) return false
	return short.every((token, i) => long[i] === token)
}

interface Pair {
	a: Page
	b: Page
	score: number
	/** Пара «страница и её собственный родитель» — ожидаемая, не конфликт. */
	family: boolean
}

function findPairs(pages: Page[]): Pair[] {
	const pairs: Pair[] = []

	for (let i = 0; i < pages.length; i++) {
		for (let j = i + 1; j < pages.length; j++) {
			const a = pages[i]
			const b = pages[j]
			const score = jaccardSimilarity([...a.tokens], [...b.tokens])
			if (score < SIMILARITY_THRESHOLD) continue

			const family =
				a.parent === b.id ||
				b.parent === a.id ||
				(!!a.parent && a.parent === b.parent)
			pairs.push({ a, b, score, family })
		}
	}

	return pairs.sort((x, y) => y.score - x.score)
}

function main(): void {
	const repoRoot = process.cwd()
	const pages = collectPages(repoRoot)
	const pairs = findPairs(pages)

	if (process.argv.includes('--json')) {
		process.stdout.write(
			JSON.stringify(
				pairs.map(p => ({
					a: p.a.url,
					b: p.b.url,
					aTitle: p.a.title,
					bTitle: p.b.title,
					kinds: `${p.a.kind}↔${p.b.kind}`,
					score: Number(p.score.toFixed(3)),
					family: p.family
				})),
				null,
				'\t'
			)
		)
		return
	}

	const conflicts = pairs.filter(p => !p.family)
	const crossType = conflicts.filter(p => p.a.kind !== p.b.kind)

	const headlineConflicts = pages.flatMap(a =>
		pages
			.filter(b => a.id !== b.id && a.parent !== b.id && b.parent !== a.id)
			.filter(b => startsWithTitleOf(a, b))
			.map(b => ({ longer: a, shorter: b }))
	)

	console.log(
		`ОДНА ГОЛОВНАЯ ФРАЗА НА ДВЕ СТРАНИЦЫ (${headlineConflicts.length}):`
	)
	if (headlineConflicts.length === 0) {
		console.log(
			'  нет — ни один заголовок не начинается с заголовка другой страницы\n'
		)
	}
	for (const { longer, shorter } of headlineConflicts) {
		console.log(`        ${shorter.url}  «${shorter.title}»`)
		console.log(
			`        ${longer.url}  «${longer.title}»  ← начинается с заголовка выше`
		)
	}
	console.log()

	console.log(
		`Страниц: ${pages.length}, пар выше порога ${SIMILARITY_THRESHOLD}: ${pairs.length}`
	)
	console.log(
		`Из них внутрисемейных (ожидаемых): ${pairs.length - conflicts.length}\n`
	)

	console.log(
		`РАЗНЫЕ ТИПЫ СТРАНИЦ — самый частый вид каннибализации (${crossType.length}):`
	)
	for (const p of crossType) {
		console.log(`  ${p.score.toFixed(2)}  ${p.a.kind}/${p.b.kind}`)
		console.log(`        ${p.a.url}  «${p.a.title}»`)
		console.log(`        ${p.b.url}  «${p.b.title}»`)
	}

	const sameType = conflicts.filter(p => p.a.kind === p.b.kind)
	console.log(`\nОДИН ТИП СТРАНИЦ (${sameType.length}):`)
	for (const p of sameType.slice(0, 40)) {
		console.log(`  ${p.score.toFixed(2)}  ${p.a.kind}`)
		console.log(`        ${p.a.url}  «${p.a.title}»`)
		console.log(`        ${p.b.url}  «${p.b.title}»`)
	}
	if (sameType.length > 40) console.log(`  … ещё ${sameType.length - 40}`)
}

main()
