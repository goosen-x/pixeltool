'use client'

import { useEffect } from 'react'
import { dev } from '@/lib/config/env'
import { ADS_DISABLED } from '@/lib/config/ads'
import { loadYandexAds } from './loadYandexAds'

const BLOCK_ID = 'R-A-19531689-3'

/**
 * Top Ad РСЯ — тестовый блок для сравнения с Floor Ad (MobileBottomAd):
 * та же механика (сам создаёт DOM, сам закрывается, сам фиксируется —
 * появляется через ~2 сек, поверх контента, без резерва места), только
 * сверху экрана вместо низа. Яндекс прямо запрещает Top Ad и Floor Ad
 * одновременно на одной странице — поэтому подключён точечно на одном тула
 * (сейчас invisible-character), а не глобально в layout, и MobileBottomAd
 * на этой же странице сам себя выключает (см. её usePathname-проверку).
 */
export function TopAdBlock() {
	useEffect(() => {
		if (ADS_DISABLED || dev) return

		loadYandexAds()
		window.yaContextCb = window.yaContextCb || []
		window.yaContextCb.push(() => {
			window.Ya?.Context?.AdvManager?.render({
				blockId: BLOCK_ID,
				type: 'topAd'
			})
		})
	}, [])

	return null
}
