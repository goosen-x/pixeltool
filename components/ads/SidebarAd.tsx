'use client'

import { useEffect } from 'react'
import { ADS_DISABLED } from '@/lib/config/ads'

declare global {
	interface Window {
		yaContextCb?: Array<() => void>
		Ya?: {
			Context: {
				AdvManager: {
					render: (params: { blockId: string; renderTo: string }) => void
				}
			}
		}
	}
}

export function SidebarAd() {
	useEffect(() => {
		if (ADS_DISABLED) return

		// Убедимся, что Яндекс.Контекст загружен
		if (window.yaContextCb) {
			window.yaContextCb.push(() => {
				if (window.Ya?.Context?.AdvManager) {
					window.Ya.Context.AdvManager.render({
						blockId: 'R-A-19531689-1',
						renderTo: 'yandex_rtb_R-A-19531689-1'
					})
				}
			})
		}
	}, [])

	// Пустой блок на 250px выглядел бы поломкой вёрстки, поэтому при
	// отключённой рекламе не рендерим ничего.
	if (ADS_DISABLED) return null

	return (
		<div className='sidebar-ad-container'>
			{/* Yandex.RTB R-A-19531689-1 */}
			<div id='yandex_rtb_R-A-19531689-1' className='sidebar-ad mx-auto' />
			<style jsx>{`
				.sidebar-ad-container {
					width: 100%;
					margin: 20px 0;
				}

				.sidebar-ad {
					width: 100%;
					max-width: 300px;
					min-height: 250px;
					background: transparent;
				}

				/* Адаптация для мобильных устройств */
				@media (max-width: 768px) {
					.sidebar-ad-container {
						display: flex;
						justify-content: center;
						margin: 20px 0;
					}
				}
			`}</style>
		</div>
	)
}
