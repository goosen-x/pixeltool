// Отправляет все URL из sitemap.xml в IndexNow (api.indexnow.org — единая
// точка входа, разносит по Яндексу, Bing, Seznam и др. — Google IndexNow
// не поддерживает, для него автоматизации нет в принципе, см.
// docs/seo/reindex-queue.md). Гоняется после деплоя в CI, без зависимостей
// (только встроенный fetch, Node 20).
//
// Ключ должен совпадать с именем файла-верификатора в public/ —
// https://pixeltool.pro/<key>.txt должен отдавать сам ключ.
const INDEXNOW_KEY = '39e51804ccb7339c0f1ad5f7e5925d04'
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://pixeltool.pro'
const HOST = new URL(SITE_URL).host

async function main() {
	const sitemapRes = await fetch(`${SITE_URL}/sitemap.xml`)
	if (!sitemapRes.ok) {
		throw new Error(`Не удалось загрузить sitemap.xml: ${sitemapRes.status}`)
	}
	const xml = await sitemapRes.text()
	const urlList = [...xml.matchAll(/<loc>(.*?)<\/loc>/g)].map(m => m[1])

	if (urlList.length === 0) {
		throw new Error('sitemap.xml не содержит ни одного <loc> — проверь URL')
	}

	console.log(`Отправляю ${urlList.length} URL в IndexNow (${HOST})...`)

	const res = await fetch('https://api.indexnow.org/indexnow', {
		method: 'POST',
		headers: { 'Content-Type': 'application/json; charset=utf-8' },
		body: JSON.stringify({
			host: HOST,
			key: INDEXNOW_KEY,
			keyLocation: `${SITE_URL}/${INDEXNOW_KEY}.txt`,
			urlList
		})
	})

	// 200/202 — успех по спецификации IndexNow.
	if (res.status !== 200 && res.status !== 202) {
		const body = await res.text().catch(() => '')
		console.warn(`IndexNow ответил ${res.status}: ${body}`)
		return
	}

	console.log(`IndexNow принял ${urlList.length} URL (статус ${res.status})`)
}

main().catch(err => {
	// Не роняем деплой из-за сбоя переобхода — это дополнительный сигнал,
	// не критичная часть выкладки.
	console.warn('IndexNow: не удалось отправить URL —', err.message)
})
