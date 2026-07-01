import type { ReactNode } from 'react'
import { ProjectsLayoutWrapper } from '@/components/sidebars/ProjectsLayoutWrapper'

type Props = {
	children: ReactNode
}

export default function WidgetsLayout({ children }: Props) {
	return <ProjectsLayoutWrapper>{children}</ProjectsLayoutWrapper>
}
