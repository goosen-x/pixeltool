'use client'

import { Block } from '@/components/ui/block'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { OptimizedImage } from '@/components/ui/optimized-image'
import { FaGithub } from 'react-icons/fa'
import { ProjectDataType } from '../types'
import { TbWorld } from 'react-icons/tb'
import { useState } from 'react'
import { ModalDrawer } from '@/components/global/ModalDrawer'
import { useTranslations } from 'next-intl'

type Props = {
	project: ProjectDataType
}

export const ProjectBlock = ({ project }: Props) => {
	const [open, setOpen] = useState(false)

	const t = useTranslations('SectionProjects')
	const description = t(`projects.${project.name}.description`)

	const popupData = {
		title: t(`projects.${project.name}.name`),
		description: t(`projects.${project.name}.description`),
		company: t(`projects.${project.name}.company`),
		image: project.image,
		github: project.github,
		link: project.link,
		techs: project.techs,
		about: t('about')
	}

	return (
		<div className='flex flex-col col-span-12 md:col-span-6 p-0 relative overflow-hidden'>
			<ModalDrawer open={open} setOpen={setOpen} project={popupData}>
				text
			</ModalDrawer>

			<Block
				className='pb-0 rounded-t-2xl overflow-hidden relative cursor-pointer hover:bg-card/50 transition-bg duration-300'
				onClick={() => setOpen(true)}
			>
				<OptimizedImage
					className='mx-auto object-cover object-top h-64 w-[85%] group p-0  rounded-t-lg group-hover/block:scale-105 group-hover/block:rotate-1 transition-all duration-300'
					src={project.image}
					width={1000}
					height={2000}
					alt={t(`projects.${project.name}.name`)}
				/>
			</Block>
			<div className='flex justify-between items-center gap-4 my-4'>
				<p className='text-foreground text-2xl font-bold whitespace-nowrap'>
					{project.title}
				</p>
				<span className='h-px w-full bg-foreground grow' />
				<div className='shrink-0 flex items-center gap-2'>
					{project.github && (
						<Link href={project.github} target='_blank'>
							<FaGithub className='text-foreground text-2xl' />
						</Link>
					)}
					{project.link && (
						<Link href={project.link} target='_blank'>
							<TbWorld className='text-foreground text-2xl' />
						</Link>
					)}
				</div>
			</div>
			<ul className='flex flex-wrap gap-2 mb-4'>
				{project.techs.map(tech => (
					<li className='flex items-center gap-2' key={tech.name}>
						<Badge className='text-foreground/70' variant='outline'>
							{tech.icon}
							<span className='ml-2'>{tech.name}</span>
						</Badge>
					</li>
				))}
			</ul>
			<p className='line-clamp-2 text-foreground/70'>{description}</p>
			<Button
				className='text-foreground/70 hover:underline hover:text-blue-300 w-fit p-0'
				variant='link'
				onClick={() => setOpen(true)}
			>
				{`${t('moreButton')} >`}
			</Button>
		</div>
	)
}
