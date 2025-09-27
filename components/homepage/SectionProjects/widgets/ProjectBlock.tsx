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
// import { useTranslations } from 'next-intl'

type Props = {
	project: ProjectDataType
}

export const ProjectBlock = ({ project }: Props) => {
	const [open, setOpen] = useState(false)

	// const t = useTranslations('SectionProjects')
	
	// Static project data in Russian
	const projectData = {
		komponenta: {
			name: 'Komponenta',
			description: 'Этот проект представляет собой одностраничное приложение (SPA), разработанное с использованием чистого JavaScript (ES6+) без использования фреймворков, реализуя модульную структуру кода по шаблону MVC для улучшения масштабируемости и поддержки.',
			company: 'Компания специализируется на предоставлении профессиональной помощи в области личного банкротства. Предлагает комплексные услуги для клиентов, столкнувшихся с финансовыми трудностями.'
		},
		mba: {
			name: 'Московская Бизнес Академия',
			description: 'Проект включает в себя полную переработку и обновление веб-платформы Московской Бизнес Академии с использованием современного технологического стека. Разработка основана на Next.js, обеспечивая высокую производительность и SEO-оптимизацию.',
			company: 'Московская Бизнес Академия - это коммерческий институт онлайн бизнес-образования. Компания специализируется на предоставлении высококачественных образовательных программ в области бизнеса и менеджмента.'
		},
		digitalDyatel: {
			name: 'Digital Dyatel',
			description: 'Проект Digital Dyatel находится в активной разработке и представляет собой современную веб-платформу для управления репутацией и интернет-маркетинга. Разработка ведется с использованием Next.js.',
			company: 'Digital Dyatel специализируется на маркетинге и управлении онлайн-репутацией с использованием SEO. Компания предоставляет комплексные услуги ORM.'
		},
		healthshop: {
			name: 'Health Shop',
			description: 'Интернет-магазин здорового питания и спортивного питания с современным дизайном и удобной системой заказов.',
			company: 'Магазин товаров для здоровья и спорта'
		}
	}

	const currentProject = projectData[project.name as keyof typeof projectData]
	const description = currentProject?.description || project.title

	const popupData = {
		title: currentProject?.name || project.title,
		description: currentProject?.description || project.title,
		company: currentProject?.company || '',
		image: project.image,
		github: project.github,
		link: project.link,
		techs: project.techs,
		about: 'О проекте'
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
					alt={currentProject?.name || project.title}
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
				{'Узнать больше >'}
			</Button>
		</div>
	)
}
