'use client'

import { usePathname } from 'next/navigation'
import { ProjectsSidebar } from '@/components/projects/ProjectsSidebar'
import { ProjectsFooter } from '@/components/projects/ProjectsFooter'
import { ProjectsRightSidebar } from '@/components/projects/ProjectsRightSidebar'
import { WidgetWrapper, WidgetHeader } from '@/components/widgets'
import { WidgetFAQ } from '@/components/widgets/WidgetFAQ'
import { RelatedTools } from '@/components/seo/RelatedTools'
import { getWidgetByPath } from '@/lib/constants/widgets'
import { useAnalytics } from '@/lib/hooks/useAnalytics'
import { ReactNode } from 'react'

type Props = {
	children: ReactNode
}

export function ProjectsLayoutWrapper({ children }: Props) {
	const pathname = usePathname()
	// Extract widget path from URL: /en/projects/widget-name -> widget-name
	const widgetPath = pathname.split('/').pop()
	const widget = widgetPath ? getWidgetByPath(widgetPath) : null
	const widgetId = widget?.id

	// Track analytics for the current widget
	useAnalytics(widgetId || '')

	return (
		<div className='flex h-full'>
			<ProjectsSidebar />
			<main className='flex-1 flex flex-col overflow-hidden'>
				<div className='flex-1 flex overflow-hidden'>
					<div className='flex-1 overflow-y-auto projects-scroll'>
						<div className='container mx-auto py-8 max-w-6xl'>
							{widgetId && <WidgetHeader widgetId={widgetId} />}
							<WidgetWrapper>
								{children}
								{widgetId && <RelatedTools currentTool={widgetId} />}
							</WidgetWrapper>
							{widgetId && <WidgetFAQ widgetId={widgetId} />}
						</div>
					</div>
					{widgetId && <ProjectsRightSidebar />}
				</div>
				<ProjectsFooter />
			</main>
		</div>
	)
}