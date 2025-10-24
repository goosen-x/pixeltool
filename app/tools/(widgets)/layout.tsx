import type { ReactNode } from 'react'
import { ProjectsLayoutWrapper } from '@/components/sidebars/ProjectsLayoutWrapper'

// Force dynamic rendering for all widget pages
export const dynamic = 'force-dynamic'
export const fetchCache = 'force-no-store'

type Props = {
	children: ReactNode
}

export default function WidgetsLayout({ children }: Props) {
	return <ProjectsLayoutWrapper>{children}</ProjectsLayoutWrapper>
}
