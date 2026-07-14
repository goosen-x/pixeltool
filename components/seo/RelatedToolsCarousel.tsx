'use client'

import {
	Carousel,
	CarouselContent,
	CarouselItem,
	CarouselNext,
	CarouselPrevious
} from '@/components/ui/carousel'
import { ToolCard } from '@/components/tools/ToolCard'
import type { Widget } from '@/lib/constants/widgets'

interface Props {
	widgets: Widget[]
}

/**
 * Карусель похожих инструментов — та же механика, что у карусели статей.
 *
 * По две карточки в кадре: embla отключает зацикливание, если все слайды
 * помещаются целиком, поэтому подборка должна быть длиннее кадра (см.
 * RelatedTools).
 */
export function RelatedToolsCarousel({ widgets }: Props) {
	return (
		<Carousel opts={{ align: 'start', loop: true }} className='mt-6'>
			{/* items-stretch тянет слайды на высоту самого высокого. ToolCard вешает
			    h-full на Card, но оборачивает её в <a>, у которой высота по контенту,
			    — поэтому высоту дожимаем ссылке через [&>a]:h-full */}
			<CarouselContent className='-ml-4 items-stretch'>
				{widgets.map(widget => (
					<CarouselItem key={widget.id} className='pl-4 sm:basis-1/2'>
						<div className='h-full [&>a]:h-full'>
							<ToolCard widget={widget} className='h-full' />
						</div>
					</CarouselItem>
				))}
			</CarouselContent>

			{widgets.length > 1 && (
				<>
					{/* По умолчанию стрелки уезжают на -left-12 — за край контейнера,
					    где их обрезает. Заводим внутрь кадра. */}
					<CarouselPrevious className='left-2 z-10 hidden cursor-pointer bg-background/90 shadow-md sm:flex' />
					<CarouselNext className='right-2 z-10 hidden cursor-pointer bg-background/90 shadow-md sm:flex' />
				</>
			)}
		</Carousel>
	)
}
