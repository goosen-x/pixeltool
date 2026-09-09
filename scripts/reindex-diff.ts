/**
 * Список страниц, у которых контент изменился с прошлой фиксации, — то есть
 * тех, чья проиндексированная в Google копия скорее всего устарела. Их несут
 * руками в Search Console: «Проверка URL» → «Запросить индексирование».
 *
 * Почему именно этот список и почему только он:
 *
 * 1. Непроиндексированные страницы здесь НЕ ищутся. Их лучше и полнее даёт
 *    сам Search Console — отчёт «Страницы», фильтр «Не проиндексированы», с
 *    причиной по каждой. Он же находит старые страницы, которые никогда не
 *    попадали в индекс, а дифф к ним слеп по устройству: они не новые.
 * 2. А вот устаревшую копию Search Console показать не может. Такая страница
 *    в его отчёте зелёная — она проиндексирована. Google не знает, что мы
 *    поменяли текст; узнать это можно только поштучно, сравнив в «Проверке
 *    URL» просканированную версию с живой. На 278 страницах так не работают.
 *    Зато это знает наш lastmod — на нём и построен этот список.
 *
 * Яндекс и Bing здесь ни при чём: там обе задачи закрыты автоматически через
 * scripts/indexnow.mjs, и состояние у него отдельное (см. GOOGLE_STATE и
 * INDEXNOW_STATE) — иначе он, отрабатывая в CI первым, съедал бы дельту.
 *
 * Использование:
 *   pnpm reindex-diff          — показать, что изменилось с прошлой фиксации
 *   pnpm reindex-diff --commit — зафиксировать текущее состояние. Запускать
 *     после того, как реально отправили страницы в Search Console.
 */
import {
	fetchSitemapEntries,
	loadSnapshot,
	saveSnapshot,
	computeDelta,
	GOOGLE_STATE
} from './lib/sitemap-state.mjs'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://pixeltool.pro'

async function main() {
	const shouldCommit = process.argv.includes('--commit')

	const current = await fetchSitemapEntries(SITE_URL)
	const { entries: previous, source } = await loadSnapshot(GOOGLE_STATE)
	const delta = computeDelta(current, previous)

	console.log(
		`В sitemap ${current.length} URL. Состояние: ${source}` +
			(source === 'none'
				? ' — фиксации ещё не было.'
				: `, ${previous.length} URL.`)
	)

	if (delta.isFirstRun) {
		const saved = await saveSnapshot(current, GOOGLE_STATE)
		console.log(
			`\nПервый запуск — фиксирую текущие lastmod как отправную точку (${saved.join(', ') || 'никуда'}). Со следующего раза будут видны реальные изменения.`
		)
		if (delta.toSubmit.length > 0) {
			console.log(
				`\nИзменены за последнюю неделю (${delta.toSubmit.length}) — их копия в индексе может быть устаревшей:\n`
			)
			delta.toSubmit.forEach(entry =>
				console.log(`${entry.url}  (${entry.lastmod})`)
			)
		}
		printFooter()
		return
	}

	if (delta.changed.length === 0) {
		console.log('\nИзменившегося контента с прошлой фиксации нет.')
	} else {
		console.log(
			`\nИзменился контент — lastmod сдвинулся (${delta.changed.length}). Копия в индексе Google может быть устаревшей:\n`
		)
		delta.changed.forEach(entry => {
			const was = previous.find(item => item.url === entry.url)?.lastmod
			console.log(`${entry.url}  (${was} → ${entry.lastmod})`)
		})
	}

	if (delta.removed.length > 0) {
		console.log(
			`\nПропали из sitemap с прошлой фиксации (${delta.removed.length}) — если это не редизайн категории или удаление тула, стоит проверить:`
		)
		delta.removed.forEach(url => console.log(url))
	}

	if (shouldCommit) {
		const saved = await saveSnapshot(current, GOOGLE_STATE)
		console.log(
			`\nСостояние зафиксировано (${saved.join(', ') || 'никуда'}) — эти страницы больше не считаются изменившимися.`
		)
	} else if (delta.changed.length > 0) {
		console.log(
			'\nСостояние не зафиксировано (нет флага --commit). Запусти ещё раз с --commit после отправки в Search Console, иначе те же страницы появятся снова.'
		)
	}

	printFooter()
}

function printFooter() {
	console.log(
		'\nНепроиндексированные страницы этот список не показывает и не должен:\n' +
			'смотри отчёт «Страницы» в Search Console, фильтр «Не проиндексированы».'
	)
}

main().catch(error => {
	console.error(error)
	process.exit(1)
})
