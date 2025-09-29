import { ProjectsLayoutWrapper } from '@/components/sidebar/ProjectsLayoutWrapper'
import { ReactNode } from 'react'
import '../widget-transitions.css'

// Force dynamic rendering for all tools pages to avoid useSearchParams build errors
export const dynamic = 'force-dynamic'
export const fetchCache = 'force-no-store'

type Props = {
	children: ReactNode
}

export default function ProjectsLayout({ children }: Props) {
	return <ProjectsLayoutWrapper>{children}</ProjectsLayoutWrapper>
}
