'use client'

import { ReactNode } from 'react'
import { usePathname } from 'next/navigation'
import { ProjectsLayoutWrapper } from '@/components/sidebar/ProjectsLayoutWrapper'

type Props = {
	children: ReactNode
}

export function ToolsLayoutClient({ children }: Props) {
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
