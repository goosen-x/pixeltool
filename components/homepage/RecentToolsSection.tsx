'use client'

import { publicWidgets } from '@/lib/constants/widgets'
import { ToolCard } from '@/components/tools/ToolCard'
import { useToolHistory } from '@/lib/hooks/useToolHistory'
import {
	Carousel,
	CarouselContent,
	CarouselItem,
	CarouselNext,
	CarouselPrevious
} from '@/components/ui/carousel'

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
		.map(id => publicWidgets.find(widget => widget.id === id))
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

				{/* На мобильном сжатый grid-cols-2 давил карточки настолько, что
				    текст описания и кнопка обрезались — карусель с
				    полутора-карточками в кадре решает то же место шире, без
				    сжатия контента, и намекает свайпом, что элементов больше. */}
				<div className='relative sm:px-8 lg:px-0'>
					<Carousel opts={{ align: 'start' }} className='w-full'>
						<CarouselContent className='-ml-4'>
							{items.map(widget => (
								<CarouselItem
									key={widget.id}
									className='basis-[85%] pl-4 sm:basis-1/2 lg:basis-1/4'
								>
									<ToolCard widget={widget} className='h-full' />
								</CarouselItem>
							))}
						</CarouselContent>
						<CarouselPrevious className='hidden sm:flex -left-4 lg:-left-12' />
						<CarouselNext className='hidden sm:flex -right-4 lg:-right-12' />
					</Carousel>

					<p className='mt-4 text-center text-xs text-muted-foreground sm:hidden'>
						Свайпайте для просмотра
					</p>
				</div>
			</div>
		</section>
	)
}
