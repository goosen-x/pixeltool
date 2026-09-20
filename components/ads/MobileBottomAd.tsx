'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { dev } from '@/lib/config/env'
import { ADS_DISABLED } from '@/lib/config/ads'
import { loadYandexAds } from './loadYandexAds'

const BLOCK_ID = 'R-A-19531689-2'

// Яндекс запрещает Floor Ad и Top Ad одновременно на одной странице. На этом
// туле временно стоит TopAdBlock для сравнения (см. TopAdBlock.tsx) — Floor
// Ad там выключаем.
const EXCLUDED_PATHS = ['/tools/invisible-character']

/**
 * Floor Ad РСЯ — липкий блок внизу экрана на мобильном, вместо баннера тула
 * месяца сверху (тот теперь hidden lg:block, см. app/layout.tsx): верхний
 * баннер по кликам был около нуля.
 *
 * В отличие от AdSection/SidebarAd (общий блок, рендерится в свой контейнер
 * через renderTo) Floor Ad сам создаёт себе DOM, сам управляет position:fixed
 * и сам даёт кнопку закрытия — Яндекс прямо пишет, что размеры контейнера со
 * стороны сайта игнорируются, а появляется блок с задержкой (~2 сек) и
 * ложится ПОВЕРХ контента, не сдвигая его. Поэтому компонент ничего не
 * рисует сам, только один раз просит РСЯ отрисовать блок.
 *
 * Из этого следует ограничение, которое сайт со своей стороны не обойти:
 * ни резервировать место под блок, ни подвинуть от него ScrollToTop не
 * получится, пока сам Яндекс не даст на это точки расширения.
 */
export function MobileBottomAd() {
	const pathname = usePathname()
	const excluded = EXCLUDED_PATHS.includes(pathname)

	useEffect(() => {
		if (ADS_DISABLED || dev || excluded) return

		loadYandexAds()
		window.yaContextCb = window.yaContextCb || []
		window.yaContextCb.push(() => {
			window.Ya?.Context?.AdvManager?.render({
				blockId: BLOCK_ID,
				type: 'floorAd',
				platform: 'touch'
			})
		})
	}, [excluded])

	return null
}
