/** Реальная высота «шапки сайта» (баннер инструмента месяца + Header) в CSS-
 *  переменной --chrome-h на <html>.
 *
 *  Страницы тулов рисуются ровно в один экран и вычитали из 100vh захардкоженные
 *  5rem — высоту одного только sticky-хедера (h-20). С баннером сверху хрома
 *  стала выше, и вместо «ровно экран» появлялась лишняя прокрутка, а мобильный
 *  фиксированный сайдбар (top-20) уезжал под баннер. Вторую магическую константу
 *  заводить нельзя — баннера может не быть вовсе (пустая БД), он может быть
 *  закрыт крестиком, и его высота зависит от переноса текста. Поэтому меряем
 *  фактическую высоту, а 5rem остаётся фоллбэком в самих calc() — до того, как
 *  эффект отработал, и если JS отключён.
 */
export const CHROME_HEIGHT_VAR = '--chrome-h'

const BANNER_ID = 'tool-of-month-banner'

function visibleHeight(element: Element | null): number {
	if (!element) return 0
	// display:none (инлайн-скрипт баннера прячет им уже закрытый баннер) даёт
	// нулевой прямоугольник — ровно то, что нужно.
	return element.getBoundingClientRect().height
}

export function measureChromeHeight(): void {
	if (typeof document === 'undefined') return

	const banner = document.getElementById(BANNER_ID)
	const header =
		document.querySelector('[data-site-header]') ??
		document.querySelector('header')
	const total = visibleHeight(banner) + visibleHeight(header)

	document.documentElement.style.setProperty(
		CHROME_HEIGHT_VAR,
		`${Math.round(total)}px`
	)
}
