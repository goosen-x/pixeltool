'use client'

import { useEffect } from 'react'
import { dev } from '@/lib/config/env'
import { ADS_DISABLED } from '@/lib/config/ads'
import { loadYandexAds } from './loadYandexAds'

const BLOCK_ID = 'R-A-19531689-2'

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
 *
 * Top Ad (тот же формат, но сверху) пробовали на invisible-character для
 * сравнения — убрали 20.09.2026: он ложится ровно поверх sticky-хедера и
 * делает недоступными поиск/меню, а подвинуть его так же нельзя. У Floor Ad
 * такого конфликта нет — снизу страницы ничего критичного для навигации.
 */
export function MobileBottomAd() {
	useEffect(() => {
		if (ADS_DISABLED || dev) return

		loadYandexAds()
		window.yaContextCb = window.yaContextCb || []
		window.yaContextCb.push(() => {
			window.Ya?.Context?.AdvManager?.render({
				blockId: BLOCK_ID,
				type: 'floorAd',
				platform: 'touch'
			})
		})
	}, [])

	return null
}
