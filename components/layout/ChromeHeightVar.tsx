'use client'

import { useEffect } from 'react'
import { measureChromeHeight } from '@/lib/ui/chrome-height'

/** Держит --chrome-h в актуальном состоянии: при монтировании, при ресайзе
 *  (высота баннера зависит от переноса текста), после загрузки шрифтов и при
 *  любом изменении размеров самой шапки. Ничего не рисует. */
export function ChromeHeightVar() {
	useEffect(() => {
		measureChromeHeight()

		window.addEventListener('resize', measureChromeHeight)

		const observer =
			typeof ResizeObserver === 'undefined'
				? null
				: new ResizeObserver(() => measureChromeHeight())
		const banner = document.getElementById('tool-of-month-banner')
		const header =
			document.querySelector('[data-site-header]') ??
			document.querySelector('header')
		if (banner) observer?.observe(banner)
		if (header) observer?.observe(header)

		// Подмена системного шрифта на веб-шрифт меняет высоту строки в баннере.
		document.fonts?.ready.then(measureChromeHeight).catch(() => {})

		return () => {
			window.removeEventListener('resize', measureChromeHeight)
			observer?.disconnect()
		}
	}, [])

	return null
}
