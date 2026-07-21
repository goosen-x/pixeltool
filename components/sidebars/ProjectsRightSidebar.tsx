'use client'

import { getWidgetByPath } from '@/lib/constants/widgets'
import { usePathname } from 'next/navigation'
import { AdSection } from '@/components/ads'
import { cn } from '@/lib/utils'
import { FeedbackCard } from './widgets/FeedbackCard'
import { RecentToolsCard } from './widgets/RecentToolsCard'

interface Props {
	/**
	 * true — страницы инструментов (ProjectsLayoutWrapper): там сайдбар живёт
	 * внутри h-[calc(100vh-5rem)]-колонки со своим скроллом, и h-full/overflow
	 * тянут его на всю эту колонку. false — страницы блога: обычный поток
	 * документа, сайдбар просто position:sticky и сам решает свою высоту по
	 * контенту. h-full там был мёртвым (проценты без заданной высоты предка),
	 * но лишний overflow-y-auto на нём создавал самостоятельный скролл-контейнер
	 * поверх обычной прокрутки страницы — не нужно.
	 */
	boundedHeight?: boolean
}

/**
 * Правый сайдбар. К конкретному инструменту привязана только звёздочка
 * «в избранное», поэтому сайдбар работает и там, где инструмента нет —
 * например, на страницах блога.
 */
export function ProjectsRightSidebar({ boundedHeight = true }: Props) {
	const pathname = usePathname()

	const widgetPath = pathname.split('/').pop()
	const widget = widgetPath ? getWidgetByPath(widgetPath) : undefined

	return (
		<aside
			className={cn(
				'w-72 xl:w-80 p-3 lg:p-4 space-y-3 lg:space-y-4 flex-shrink-0',
				boundedHeight && 'h-full overflow-y-auto projects-scroll'
			)}
		>
			<RecentToolsCard widget={widget ?? undefined} />
			<AdSection />
			<FeedbackCard />
		</aside>
	)
}
