'use client'

import { getWidgetByPath } from '@/lib/constants/widgets'
import { usePathname } from 'next/navigation'
import { AdSection } from '@/components/ads'
import { FeedbackCard } from './widgets/FeedbackCard'
import { RecentToolsCard } from './widgets/RecentToolsCard'

/**
 * Правый сайдбар. К конкретному инструменту привязана только звёздочка
 * «в избранное», поэтому сайдбар работает и там, где инструмента нет —
 * например, на страницах блога.
 */
export function ProjectsRightSidebar() {
	const pathname = usePathname()

	const widgetPath = pathname.split('/').pop()
	const widget = widgetPath ? getWidgetByPath(widgetPath) : undefined

	return (
		<aside className='w-72 xl:w-80 h-full p-3 lg:p-4 space-y-3 lg:space-y-4 overflow-y-auto projects-scroll flex-shrink-0'>
			<RecentToolsCard widget={widget ?? undefined} />
			<AdSection />
			<FeedbackCard />
		</aside>
	)
}
