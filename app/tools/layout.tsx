'use client'

import { ReactNode } from 'react'
import { usePathname } from 'next/navigation'
import { ProjectsLayoutWrapper } from '@/components/sidebar/ProjectsLayoutWrapper'
import '../widget-transitions.css'

// Force dynamic rendering for all tools pages
export const dynamic = 'force-dynamic'
export const fetchCache = 'force-no-store'

type Props = {
	children: ReactNode
}

export default function ToolsLayout({ children }: Props) {
	const pathname = usePathname()

	// Check if we're on the /tools page (listing) or on a widget page
	const isToolsListing = pathname === '/tools' || pathname === '/tools/'

	// For /tools listing - no sidebar, just children
	if (isToolsListing) {
		return <>{children}</>
	}

	// For widget pages - wrap with sidebar
	return <ProjectsLayoutWrapper>{children}</ProjectsLayoutWrapper>
}
