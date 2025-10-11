import type { ReactNode } from 'react'
import { ProjectsLayoutWrapper } from '@/components/sidebar/ProjectsLayoutWrapper'
import './widget-transitions.css'

// Force dynamic rendering for all widget pages
export const dynamic = 'force-dynamic'
export const fetchCache = 'force-no-store'

type Props = {
	children: ReactNode
}

export default function WidgetsLayout({ children }: Props) {
	// Wrap all widget pages with ProjectsLayoutWrapper (includes sidebar)
	return <ProjectsLayoutWrapper>{children}</ProjectsLayoutWrapper>
}
