/**
 * Однократная загрузка context.js РСЯ — по требованию, а не в разметке layout'а.
 *
 * Раньше скрипт висел в app/layout.tsx с strategy='lazyOnload'. Но lazyOnload —
 * это window.load, то есть всё ещё внутри окна измерения PageSpeed, и на мобиле
 * это было чистой потерей: оба рекламных слота лежат под `hidden lg:block` /
 * `hidden xl:block`, объявление там не рисуется вообще, а 370 КБ рекламного JS
 * (context.js, партнёрские бандлы, собственный шрифт РСЯ) грузились на каждой
 * странице и давали длинные задачи в главном потоке.
 *
 * Теперь загрузку инициирует сам слот, когда подходит к вьюпорту (см.
 * useYandexAd). У display:none-контейнера пересечения не случается никогда,
 * поэтому на мобиле скрипт не запрашивается — показов от этого не убыло, их там
 * и не было.
 */
let started = false

export function loadYandexAds(): void {
	if (started || typeof document === 'undefined') return
	started = true

	// Очередь должна существовать до загрузки скрипта: колбэки на отрисовку
	// блоков кладутся в неё сразу, а разбирает их уже пришедший context.js.
	window.yaContextCb = window.yaContextCb || []

	const script = document.createElement('script')
	script.src = 'https://yandex.ru/ads/system/context.js'
	script.async = true
	document.head.appendChild(script)
}
