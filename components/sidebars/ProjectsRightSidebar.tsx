'use client'

import { getWidgetByPath } from '@/lib/constants/widgets'
import { usePathname } from 'next/navigation'
import { AdSection } from '@/components/ads'
import { WidgetInfoCard } from './widgets/WidgetInfoCard'
import { UseCaseCard } from './widgets/UseCaseCard'
import { FeedbackCard } from './widgets/FeedbackCard'
import { QuickActionsCard } from './widgets/QuickActionsCard'

export function ProjectsRightSidebar() {
	const pathname = usePathname()

	// Extract widget path from URL
	const widgetPath = pathname.split('/').pop()
	const widget = widgetPath ? getWidgetByPath(widgetPath) : null

	if (!widget) return null

	return (
		<aside className='w-72 xl:w-80 h-full p-3 lg:p-4 space-y-3 lg:space-y-4 overflow-y-auto projects-scroll flex-shrink-0'>
			<WidgetInfoCard widget={widget} />
			<AdSection />
			<UseCaseCard widget={widget} />
			<QuickActionsCard />
			<FeedbackCard />
		</aside>
	)
}
