/**
 * Сравнивает текущий продовский sitemap.xml со снапшотом с прошлого запуска
 * и показывает только новые URL — те, что реально появились с прошлой
 * проверки, а не весь исторический список. Снапшот — единственный источник
 * истины о том, что уже видели; никаких чекбоксов, которые расходятся с
 * тем, что реально отправлено в GSC.
 *
 * Использование:
 *   pnpm reindex-diff          — показать новые URL с прошлого запуска
 *   pnpm reindex-diff --commit — то же самое, но сразу обновить снапшот
 *     (считать все текущие URL уже увиденными). Обновлять снапшот стоит
 *     после того как реально отправили новые URL на переобход в GSC.
 */
import { writeFileSync, readFileSync, existsSync } from 'fs'
import { join } from 'path'

const SITEMAP_URL = 'https://pixeltool.pro/sitemap.xml'
const SNAPSHOT_PATH = join(process.cwd(), 'docs/seo/sitemap-snapshot.txt')

async function fetchSitemapUrls(): Promise<string[]> {
	const res = await fetch(SITEMAP_URL)
	if (!res.ok) {
		throw new Error(`Не удалось получить sitemap.xml: ${res.status}`)
	}
	const xml = await res.text()
	const urls = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map(m => m[1])
	return [...new Set(urls)].sort()
}

function readSnapshot(): Set<string> {
	if (!existsSync(SNAPSHOT_PATH)) return new Set()
	return new Set(
		readFileSync(SNAPSHOT_PATH, 'utf-8')
			.split('\n')
			.map(line => line.trim())
			.filter(Boolean)
	)
}

function writeSnapshot(urls: string[]) {
	writeFileSync(SNAPSHOT_PATH, urls.join('\n') + '\n', 'utf-8')
}

async function main() {
	const shouldCommit = process.argv.includes('--commit')

	const currentUrls = await fetchSitemapUrls()
	const previousUrls = readSnapshot()

	const newUrls = currentUrls.filter(url => !previousUrls.has(url))
	const removedUrls = [...previousUrls].filter(
		url => !currentUrls.includes(url)
	)

	if (previousUrls.size === 0) {
		console.log(
			`Снапшота ещё нет — это первый запуск. Сохраняю все ${currentUrls.length} текущих URL как известные, со следующего раза будет видна только реальная дельта.`
		)
		writeSnapshot(currentUrls)
		return
	}

	if (newUrls.length === 0) {
		console.log(
			'Новых страниц с прошлого снапшота нет. Всё, что видел sitemap, уже было показано раньше.'
		)
	} else {
		console.log(
			`Новые страницы (${newUrls.length}), не было в прошлом снапшоте:\n`
		)
		newUrls.forEach(url => console.log(url))
	}

	if (removedUrls.length > 0) {
		console.log(
			`\nПропали из sitemap с прошлого раза (${removedUrls.length}) — если это не редизайн категории/удаление тула, стоит проверить:`
		)
		removedUrls.forEach(url => console.log(url))
	}

	if (shouldCommit) {
		writeSnapshot(currentUrls)
		console.log(
			'\nСнапшот обновлён — эти URL больше не будут считаться новыми.'
		)
	} else if (newUrls.length > 0 || removedUrls.length > 0) {
		console.log(
			'\nСнапшот не обновлён (нет флага --commit). Запусти ещё раз с --commit после того как отправишь новые URL на переобход, иначе они появятся в списке снова.'
		)
	}
}

main().catch(error => {
	console.error(error)
	process.exit(1)
})
