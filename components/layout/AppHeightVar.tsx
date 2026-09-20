'use client'

import { useEffect } from 'react'
import { measureAppHeight } from '@/lib/ui/app-height'

/** Держит --app-vh в актуальном состоянии — см. lib/ui/app-height.ts.
 *  window.visualViewport, когда он есть, точнее отражает реальную видимую
 *  область на iOS Safari, чем resize окна: тот не всегда стреляет в момент
 *  самой анимации сворачивания/разворачивания панели адреса. Ничего не
 *  рисует. */
export function AppHeightVar() {
	useEffect(() => {
		measureAppHeight()

		const viewport = window.visualViewport
		if (viewport) {
			viewport.addEventListener('resize', measureAppHeight)
			viewport.addEventListener('scroll', measureAppHeight)
		} else {
			window.addEventListener('resize', measureAppHeight)
		}

		return () => {
			if (viewport) {
				viewport.removeEventListener('resize', measureAppHeight)
				viewport.removeEventListener('scroll', measureAppHeight)
			} else {
				window.removeEventListener('resize', measureAppHeight)
			}
		}
	}, [])

	return null
}
