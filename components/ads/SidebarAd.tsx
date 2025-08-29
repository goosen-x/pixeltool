'use client'

import { useEffect } from 'react'

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
		// Убедимся, что Яндекс.Контекст загружен
		if (window.yaContextCb) {
			window.yaContextCb.push(() => {
				if (window.Ya?.Context?.AdvManager) {
					window.Ya.Context.AdvManager.render({
						blockId: 'R-A-17015351-1',
						renderTo: 'yandex_rtb_R-A-17015351-1'
					})
				}
			})
		}
	}, [])

	return (
		<div className='sidebar-ad-container'>
			{/* Yandex.RTB R-A-17015351-1 */}
			<div id='yandex_rtb_R-A-17015351-1' className='sidebar-ad mx-auto' />
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
