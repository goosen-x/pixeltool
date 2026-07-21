'use client'

import { widgets } from '@/lib/constants/widgets'
import { ToolCard } from '@/components/tools/ToolCard'
import { useToolHistory } from '@/lib/hooks/useToolHistory'

const DISPLAY_LIMIT = 4

/**
 * Персональная секция для вернувшихся посетителей: избранное + недавние из
 * localStorage (тот же useToolHistory, что и в сайдбаре /tools). Для новых
 * посетителей localStorage пуст, поэтому секция не рендерится вовсе — в
 * отличие от сайдбара каталога, здесь пустому состоянию нет смысла занимать
 * место на главной.
 */
export function RecentToolsSection() {
	const { recent, favorites, ready, isFavorite } = useToolHistory()

	if (!ready) return null

	const recentOnly = recent.filter(id => !isFavorite(id))
	const ids = [...favorites, ...recentOnly].slice(0, DISPLAY_LIMIT)

	const items = ids
		.map(id => widgets.find(widget => widget.id === id))
		.filter((widget): widget is NonNullable<typeof widget> => Boolean(widget))

	if (items.length === 0) return null

	return (
		<section className='relative px-4 py-12 sm:px-6 sm:py-16 lg:px-8'>
			<div className='mx-auto max-w-7xl'>
				<div className='mb-8 sm:mb-10'>
					<h2 className='mb-2 font-heading text-2xl font-bold sm:text-3xl'>
						Ваши инструменты
					</h2>
					<p className='text-sm text-muted-foreground sm:text-base'>
						Избранное и то, чем вы недавно пользовались
					</p>
				</div>

				<div className='grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4'>
					{items.map(widget => (
						<ToolCard key={widget.id} widget={widget} className='h-full' />
					))}
				</div>
			</div>
		</section>
	)
}
