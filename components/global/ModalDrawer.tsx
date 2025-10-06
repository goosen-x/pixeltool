'use client'

import {
	Drawer,
	DrawerClose,
	DrawerContent,
	DrawerDescription,
	DrawerFooter,
	DrawerHeader,
	DrawerOverlay,
	DrawerPortal,
	DrawerTitle,
	DrawerTrigger
} from '@/components/ui/drawer'
import { useMediaQuery } from '@/lib/hooks/useMediaQuery'
import { Dispatch, ReactNode, SetStateAction } from 'react'
import { Button } from '../ui/button'
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger
} from '../ui/dialog'

import { OptimizedImage } from '@/components/ui/optimized-image'
import Link from 'next/link'
import { FaGithub } from 'react-icons/fa6'
import { TbWorld } from 'react-icons/tb'
import { Badge } from '../ui/badge'
import { ScrollArea } from '../ui/scroll-area'

type Props = {
	open: boolean
	setOpen: Dispatch<SetStateAction<boolean>>
	children?: React.ReactNode
	project: {
		title: string
		description: string
		image: string
		company: string
		github?: string
		link?: string
		about: string
		techs: {
			name: string
			icon: ReactNode
		}[]
	}
}

export const ModalDrawer = ({ open, setOpen, project }: Props) => {
	const isDesktop = useMediaQuery('(min-width: 768px)')

	const { title, description, company, image, github, link, techs, about } =
		project

	return (
		<>
			{isDesktop ? (
				<Dialog open={open} onOpenChange={setOpen}>
					<DialogContent className=''>
						<DialogHeader>
							<DialogTitle className='sr-only'>{title}</DialogTitle>
						</DialogHeader>
						<div className='grid grid-cols-2 gap-x-10 gap-y-4'>
							<div className='flex items-center gap-2 col-span-2'>
								<p className='text-3xl font-black mb-2'>{title}</p>
								<div className='flex gap-2 text-foreground'>
									{github && (
										<Link href={github} target='_blank'>
											<FaGithub className='text-foreground text-2xl' />
										</Link>
									)}
									{link && (
										<Link href={link} target='_blank'>
											<TbWorld className='text-foreground text-2xl' />
										</Link>
									)}
								</div>
							</div>
							<div>
								<p className='mb-2'>{company}</p>
								<ul className='flex flex-wrap gap-2 mb-4'>
									{techs.map(tech => (
										<li className='flex items-center gap-2' key={tech.name}>
											<Badge variant='default'>
												{tech.icon}
												<span className='ml-2'>{tech.name}</span>
											</Badge>
										</li>
									))}
								</ul>
							</div>
							<OptimizedImage
								className='rounded-lg object-cover row-span-2 object-top-left h-20 md:h-44 lg:h-60 w-full shadow-[0_0_24px_rgba(34,42,53,0.06),0_1px_1px_rgba(0,0,0,0.05),0_0_0_1px_rgba(34,42,53,0.04),0_0_4px_rgba(34,42,53,0.08),0_16px_68px_rgba(47,48,55,0.05),0_1px_0_rgba(255,255,255,0.1)_inset]'
								src={image}
								width={500}
								height={500}
								alt={project.title}
							/>
							<div className='col-span-2'>
								<p className='font-bold text-base mb-2'>{about}</p>
								<p className='text-sm'>{description}</p>
							</div>
						</div>
					</DialogContent>
				</Dialog>
			) : (
				<Drawer open={open} onOpenChange={setOpen}>
					<DrawerContent>
						<DrawerHeader>
							<DrawerTitle className='sr-only'>{title}</DrawerTitle>
						</DrawerHeader>
						<ScrollArea className='overflow-auto p-4'>
							<div className='p-4'>
								<div className='flex items-center gap-2 col-span-2'>
									<p className='text-3xl font-black mb-4'>{title}</p>
									<div className='flex gap-2 text-foreground'>
										{github && (
											<Link href={github} target='_blank'>
												<FaGithub className='text-foreground text-2xl' />
											</Link>
										)}
										{link && (
											<Link href={link} target='_blank'>
												<TbWorld className='text-foreground text-2xl' />
											</Link>
										)}
									</div>
								</div>

								<OptimizedImage
									className='mb-8 rounded-lg object-cover row-span-2 object-top-left h-52 md:h-44 lg:h-60 w-full shadow-[0_0_24px_rgba(34,42,53,0.06),0_1px_1px_rgba(0,0,0,0.05),0_0_0_1px_rgba(34,42,53,0.04),0_0_4px_rgba(34,42,53,0.08),0_16px_68px_rgba(47,48,55,0.05),0_1px_0_rgba(255,255,255,0.1)_inset]'
									src={image}
									width={500}
									height={500}
									alt={project.title}
								/>
								<p className='mb-4'>{company}</p>

								<ul className='flex flex-wrap gap-2 mb-4'>
									{techs.map(tech => (
										<li className='flex items-center gap-2' key={tech.name}>
											<Badge variant='default'>
												{tech.icon}
												<span className='ml-2'>{tech.name}</span>
											</Badge>
										</li>
									))}
								</ul>

								<p className='font-bold text-base mb-2'>{about}</p>
								<p className='text-sm'>{description}</p>
							</div>
						</ScrollArea>
						<DrawerFooter>
							<DrawerClose>
								<Button variant='outline'>Закрыть</Button>
							</DrawerClose>
						</DrawerFooter>
					</DrawerContent>
				</Drawer>
			)}
		</>
	)
}
