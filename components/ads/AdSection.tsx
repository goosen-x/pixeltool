'use client'

import { useEffect } from 'react'
import { WidgetSection } from '@/components/widgets'
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
		<WidgetSection icon={<Megaphone className='h-5 w-5' />} title='Реклама'>
			<div className='ad-container'>
				{/* Yandex.RTB R-A-17015351-1 */}
				<div
					id='yandex_rtb_R-A-17015351-1'
					className='w-full min-h-[250px] flex items-center justify-center bg-muted/30 rounded-lg border-2 border-dashed border-muted-foreground/20'
				>
					<div className='text-center p-4'>
						<Megaphone className='h-8 w-8 mx-auto mb-2 text-muted-foreground/40' />
						<p className='text-sm text-muted-foreground/60'>
							Загрузка рекламы...
						</p>
					</div>
				</div>
			</div>
		</WidgetSection>
	)
}
