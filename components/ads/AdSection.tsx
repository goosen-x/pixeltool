'use client'

import { useEffect } from 'react'
import { Megaphone } from 'lucide-react'

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

export function AdSection() {
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
		<div
			id='yandex_rtb_R-A-17015351-1'
			className='w-full min-h-[250px] rounded-lg border bg-muted/20 flex items-center justify-center'
		>
			<div className='text-center p-4'>
				<Megaphone className='h-8 w-8 mx-auto mb-2 text-muted-foreground/40' />
				<p className='text-sm text-muted-foreground/60'>Загрузка рекламы...</p>
			</div>
		</div>
	)
}
