/** Реальная видимая высота экрана в CSS-переменной --app-vh на <html>.
 *
 *  Каркас страниц тулов (ProjectsLayoutWrapper) держит колонку с жёстко
 *  зафиксированной высотой `calc(100dvh - var(--chrome-h))` — не min-height,
 *  а именно height. На iOS Safari во время самой анимации сворачивания
 *  панели адреса dvh у части версий не успевает пересчитаться синхронно с
 *  fixed/sticky-потомками внутри такого контейнера (задокументированный
 *  баг iOS 26 Safari) — колонка временно остаётся высотой «под старую»
 *  панель, контент обрезается снизу, появляется лишняя полоса скролла.
 *
 *  window.visualViewport.height, в отличие от dvh, даёт актуальную высоту
 *  без этой задержки — тот же принцип, что у --chrome-h
 *  (lib/ui/chrome-height.ts): не доверять единице измерения там, где важна
 *  точность прямо сейчас, а мерить по-настоящему.
 */
export const APP_HEIGHT_VAR = '--app-vh'

export function measureAppHeight(): void {
	if (typeof document === 'undefined') return

	const height = window.visualViewport?.height ?? window.innerHeight
	document.documentElement.style.setProperty(APP_HEIGHT_VAR, `${height}px`)
}
