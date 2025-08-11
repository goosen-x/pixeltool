'use client'

import BreadcrumbHeader from '@/components/global/BreadcrumbHeader'
import { ProjectsSidebar } from '@/components/projects/ProjectsSidebar'
import { ProjectsFooter } from '@/components/projects/ProjectsFooter'
import { ProjectsRightSidebar } from '@/components/projects/ProjectsRightSidebar'
import { WidgetHeader, WidgetFAQ, WidgetWrapper } from '@/components/widgets'
import { RelatedTools } from '@/components/seo/RelatedTools'
import { getWidgetByPath } from '@/lib/constants/widgets'
import { useAnalytics } from '@/lib/hooks/useAnalytics'
import { ReactNode } from 'react'
import { usePathname } from 'next/navigation'
import '../../../widget-transitions.css'

type Props = {
	children: ReactNode
}

export default function ProjectsLayout({ children }: Props) {
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
							<WidgetWrapper>
								{widgetId && <WidgetHeader widgetId={widgetId} />}
								{children}
								{widgetId && (
									<>
										<RelatedTools currentTool={widgetId} />
										<WidgetFAQ widgetId={widgetId} />
									</>
								)}
							</WidgetWrapper>
						</div>
					</div>
					{widgetId && <ProjectsRightSidebar />}
				</div>
				<ProjectsFooter />
			</main>
		</div>
	)
}
