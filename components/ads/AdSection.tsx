'use client'

import { useEffect } from 'react'
import { Megaphone } from 'lucide-react'
import { dev } from '@/lib/config/env'

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

/**
 * Реклама временно отключена: аккаунт заблокирован в РСЯ (15.07.2026). Пока он
 * не разблокирован, блок не рендерится — иначе висел бы вечной заглушкой
 * «Загрузка рекламы…». Чтобы вернуть, снять этот флаг.
 */
const ADS_DISABLED = true

export function AdSection() {
	useEffect(() => {
		// Skip ads in development to avoid domain errors
		if (dev || ADS_DISABLED) {
			return
		}

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

	// Ничего не показываем: пустой блок-заглушка на 250px выглядел бы поломкой.
	if (ADS_DISABLED) {
		return null
	}

	return (
		<div
			id='yandex_rtb_R-A-19531689-1'
			className='w-full min-h-[250px] flex items-center justify-center'
		>
			<div className='text-center p-4'>
				<Megaphone className='h-8 w-8 mx-auto mb-2 text-muted-foreground/40' />
				<p className='text-sm text-muted-foreground/60'>
					{dev
						? 'Реклама отключена в режиме разработки'
						: 'Загрузка рекламы...'}
				</p>
			</div>
		</div>
	)
}
