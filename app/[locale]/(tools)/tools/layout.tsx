import { ProjectsLayoutWrapper } from '@/components/projects/ProjectsLayoutWrapper'
import { ReactNode } from 'react'
import '../../../widget-transitions.css'

type Props = {
	children: ReactNode
}

export default function ProjectsLayout({ children }: Props) {
	return <ProjectsLayoutWrapper>{children}</ProjectsLayoutWrapper>
}
