// Отправляет в IndexNow (api.indexnow.org — единая точка входа, разносит по
// Яндексу, Bing, Seznam и др.; Google IndexNow не поддерживает, для него
// автоматизации нет в принципе) только те URL, которые появились или у
// которых с прошлого раза изменился lastmod.
//
// Раньше здесь уходил ВЕСЬ sitemap на каждый push в main/dev: правка стилей
// объявляла изменившимися все 240 страниц. Поисковику это не запрещено, но
// сигнал обесценивается — та же логика, что в комментарии про lastmod в
// app/sitemap.ts: недостоверные даты обесценивают признак целиком.
//
// Гоняется после деплоя в CI, без зависимостей (встроенный fetch, Node 20).
//
// Состояние (какие URL с какими датами уже объявлены) лежит в S3, общее для
// всех машин проекта и своё у этого скрипта — с reindex-diff оно намеренно
// не делится, см. INDEXNOW_STATE в scripts/lib/sitemap-state.mjs. Без ключей S3 скрипт
// работает, но по локальному снапшоту, а в CI его нет: тогда отправляются
// страницы, изменённые за последнюю неделю, а не весь сайт.
//
// Ключ должен совпадать с именем файла-верификатора в public/ —
// https://pixeltool.pro/<key>.txt должен отдавать сам ключ.
import {
	fetchSitemapEntries,
	loadSnapshot,
	saveSnapshot,
	computeDelta,
	INDEXNOW_STATE
} from './lib/sitemap-state.mjs'

const INDEXNOW_KEY = '39e51804ccb7339c0f1ad5f7e5925d04'
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://pixeltool.pro'
const HOST = new URL(SITE_URL).host

async function submit(urlList) {
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
		return false
	}
	console.log(`IndexNow принял ${urlList.length} URL (статус ${res.status})`)
	return true
}

async function main() {
	const current = await fetchSitemapEntries(SITE_URL)
	const { entries: previous, source } = await loadSnapshot(INDEXNOW_STATE)
	const delta = computeDelta(current, previous)

	console.log(
		`В sitemap ${current.length} URL, снапшот: ${source}` +
			(source === 'none' ? ' (первый запуск)' : ` (${previous.length} URL)`)
	)

	if (delta.toSubmit.length === 0) {
		console.log('Отправлять нечего: ни новых страниц, ни изменившихся дат.')
		// Снапшот всё равно сохраняем: в нём могли появиться даты у страниц,
		// которые раньше лежали в старом формате без lastmod.
		const saved = await saveSnapshot(current, INDEXNOW_STATE)
		console.log(`Снапшот записан: ${saved.join(', ') || 'никуда'}`)
		return
	}

	if (delta.isFirstRun) {
		console.log(
			`Снапшота не было — отправляю только изменённые за последнюю неделю (${delta.toSubmit.length}), остальное принимаю как уже известное.`
		)
	} else {
		console.log(
			`Новых ${delta.added.length}, изменившихся ${delta.changed.length}` +
				(delta.removed.length > 0
					? `, пропало из sitemap ${delta.removed.length}`
					: '')
		)
	}
	delta.toSubmit.forEach(entry =>
		console.log(`  ${entry.url} (${entry.lastmod})`)
	)

	const ok = await submit(delta.toSubmit.map(entry => entry.url))
	if (!ok) {
		// Снапшот не двигаем: иначе неотправленные URL будут считаться
		// объявленными и следующий запуск их пропустит.
		console.warn('Снапшот не обновлён — те же URL попробуем в следующий раз.')
		return
	}

	const saved = await saveSnapshot(current, INDEXNOW_STATE)
	console.log(`Снапшот записан: ${saved.join(', ') || 'никуда'}`)
}

main().catch(err => {
	// Не роняем деплой из-за сбоя переобхода — это дополнительный сигнал,
	// не критичная часть выкладки.
	console.warn('IndexNow: не удалось отправить URL —', err.message)
})
