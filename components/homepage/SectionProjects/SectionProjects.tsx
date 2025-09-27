import { ComponentPropsWithoutRef } from 'react'
import { cn } from '@/lib/utils'

import { SectionTitle } from '@/components/global/SectionTitle'
import { ProjectBlock } from './widgets/ProjectBlock'
import { ProjectsData } from './constants'
// import { useTranslations } from 'next-intl'

export const SectionProjects = ({
	className,
	...rest
}: ComponentPropsWithoutRef<'section'>) => {
	// const t = useTranslations('SectionProjects')

	return (
		<section
			className={cn('grid grid-cols-12 gap-x-6 gap-y-10 mb-24', className)}
			{...rest}
		>
			<SectionTitle className='col-span-12' title='Проекты' />
			{ProjectsData.map(project => (
				<ProjectBlock project={project} key={project.name} />
			))}
		</section>
	)
}
