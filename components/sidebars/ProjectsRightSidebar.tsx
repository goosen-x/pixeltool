'use client'

import { AdSection } from '@/components/ads'
import { cn } from '@/lib/utils'
import { FeedbackCard } from './widgets/FeedbackCard'

interface Props {
	/**
	 * true — страницы инструментов (ProjectsLayoutWrapper): там сайдбар живёт
	 * внутри h-[calc(var(--app-vh,100dvh)-var(--chrome-h,5rem))]-колонки со
	 * своим скроллом, и
	 * h-full/overflow
	 * тянут его на всю эту колонку. false — страницы блога: обычный поток
	 * документа, сайдбар просто position:sticky и сам решает свою высоту по
	 * контенту. h-full там был мёртвым (проценты без заданной высоты предка),
	 * но лишний overflow-y-auto на нём создавал самостоятельный скролл-контейнер
	 * поверх обычной прокрутки страницы — не нужно.
	 */
	boundedHeight?: boolean
}

/** Правый сайдбар. Избранное и недавние инструменты живут в шапке сайта — тут
 *  только обратная связь и реклама.
 *
 *  На тулах (boundedHeight) колонка — flex flex-col на известной высоте, а не
 *  space-y: рекламе нужно быть flex-1, чтобы дотягиваться до низа сама, без
 *  угаданного px (см. AdSection, prop fill). На блоге колонка sticky без
 *  фиксированной высоты — flex-grow тянуть не от чего, там у рекламы свой
 *  фиксированный min-h. */
export function ProjectsRightSidebar({ boundedHeight = true }: Props) {
	return (
		<aside
			className={cn(
				'w-72 xl:w-80 p-3 lg:p-4 flex-shrink-0',
				boundedHeight
					? 'h-full overflow-y-auto projects-scroll flex flex-col gap-3 lg:gap-4'
					: 'space-y-3 lg:space-y-4'
			)}
		>
			<AdSection fill={boundedHeight} />
			<FeedbackCard />
		</aside>
	)
}
