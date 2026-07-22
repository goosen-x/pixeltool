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
 * По две карточки в кадре. Подборка должна быть заметно длиннее кадра: embla
 * отключает зацикливание, если все слайды помещаются целиком (см. RelatedTools).
 */
export function RelatedToolsCarousel({ widgets }: Props) {
	return (
		// Боковые отступы освобождают место под стрелки: по умолчанию они стоят
		// на -left-12, то есть за краем контейнера, где их обрезает. Отступ уводит
		// сами карточки внутрь, а стрелки садятся в получившиеся поля — так они
		// не наезжают на текст карточек. На мобильном стрелки скрыты (см. ниже),
		// поэтому там достаточно небольшого воздуха по краям — полный запас под
		// стрелки только сжимал бы единственную карточку в кадре без причины.
		<Carousel
			opts={{ align: 'start', loop: true }}
			className='mt-3 px-4 sm:px-12'
		>
			{/* items-stretch тянет слайды на высоту самого высокого. ToolCard вешает
			    h-full на Card, но оборачивает её в <a>, у которой высота по контенту,
			    — поэтому высоту дожимаем ссылке через [&>a]:h-full

			    Отступы p-3 — запас под ховер: карточка приподнимается на
			    -translate-y-1 и отбрасывает тень, а viewport карусели с
			    overflow-hidden срезал бы их по краям. Padding внутри вьюпорта даёт
			    тени куда лечь. По горизонтали он гасит часть -ml-4, поэтому крайние
			    карточки просто уходят на 12px внутрь, а расстояние между слайдами
			    не меняется. */}
			<CarouselContent className='-ml-4 items-stretch p-3'>
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
					<CarouselPrevious className='left-0 hidden cursor-pointer sm:flex' />
					<CarouselNext className='right-0 hidden cursor-pointer sm:flex' />
				</>
			)}
		</Carousel>
	)
}
