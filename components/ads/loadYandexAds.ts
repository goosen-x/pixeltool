/**
 * Однократная загрузка context.js РСЯ — по требованию (при монтировании
 * первого рекламного слота), а не в разметке layout'а с strategy='lazyOnload'.
 *
 * Оба слота скрыты на мобиле классом `hidden` (`hidden lg:block` /
 * `hidden xl:block`), но это только CSS: компонент всё равно монтируется, эффект
 * отрабатывает и на мобильных ширинах — скрипт грузится, даже когда рекламу
 * никто не увидит. Раньше эту стоимость пытались убрать через
 * IntersectionObserver, но контейнер до заполнения имеет нулевую высоту, и в
 * части браузеров пересечение с нулевой площадью не засчитывается — реклама
 * переставала грузиться вообще. Решить это правильно (например, наблюдать за
 * родительским `aside`, а не за пустым контейнером) — отдельная задача.
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
