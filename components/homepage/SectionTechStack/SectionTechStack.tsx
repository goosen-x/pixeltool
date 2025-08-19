'use client'

import { ComponentPropsWithoutRef, useState } from 'react'
import { cn } from '@/lib/utils'
import { motion } from 'framer-motion'
import {
	HoverCard,
	HoverCardContent,
	HoverCardTrigger
} from '@/components/ui/hover-card'

import { TechStackData } from './constants'
import { SectionTitle } from '@/components/global/SectionTitle'
import { useTranslations } from 'next-intl'

export const SectionTechStack = ({
	className,
	...rest
}: ComponentPropsWithoutRef<'section'>) => {
	const t = useTranslations('SectionTechStack')
	const [activeCategory, setActiveCategory] = useState<string | null>(null)

	return (
		<section className={cn('py-20 mb-24', className)} {...rest}>
			<SectionTitle className='mb-12 text-center' title={t('title')} />

			<div className='flex flex-col lg:flex-row gap-4 max-w-7xl mx-auto'>
				{TechStackData.map((category, index) => (
					<div
						key={category.name}
						className='flex-1'
						onMouseEnter={() => setActiveCategory(category.name)}
						onMouseLeave={() => setActiveCategory(null)}
					>
						<motion.div
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.5, delay: index * 0.1 }}
						>
							<div
								className={cn(
									'relative h-full p-6 rounded-2xl border-2 transition-all duration-300 overflow-hidden',
									'bg-background',
									'hover:shadow-2xl hover:scale-[1.02]',
									activeCategory === category.name
										? 'border-accent shadow-xl'
										: 'border-border/50'
								)}
							>
								{/* Background gradient effect */}
								<div
									className={cn(
										'absolute inset-0 opacity-0 transition-opacity duration-300',
										'bg-gradient-to-br from-accent/10 via-accent/5 to-transparent',
										activeCategory === category.name && 'opacity-100'
									)}
								/>

								{/* Content */}
								<div className='relative z-10'>
									{/* Header */}
									<div className='flex items-center justify-between mb-6 gap-2'>
										<h3 className='text-lg font-bold text-foreground flex-1'>
											{category.name === 'DevOps & Cloud'
												? t('devops')
												: category.name === 'Other Tools'
													? t('other')
													: t(category.name.toLowerCase())}
										</h3>
										<span
											className={cn(
												'text-xs px-2 py-1 rounded-full transition-colors whitespace-nowrap flex-shrink-0',
												'bg-muted text-muted-foreground',
												activeCategory === category.name &&
													'bg-accent text-white'
											)}
										>
											{category.techs.length} tools
										</span>
									</div>

									{/* Tech grid */}
									<div className='grid grid-cols-2 gap-2'>
										{category.techs.slice(0, 8).map((tech, techIndex) => (
											<motion.div
												key={tech.name}
												initial={{ opacity: 0, scale: 0.8 }}
												animate={{ opacity: 1, scale: 1 }}
												transition={{
													duration: 0.3,
													delay: index * 0.1 + techIndex * 0.02
												}}
											>
												<div
													className={cn(
														'group flex items-center gap-2 p-2 rounded-lg',
														'bg-background/50 border border-transparent',
														'hover:bg-accent/10 hover:border-accent/30 transition-all duration-200'
													)}
												>
													<span
														className={cn(
															'text-base transition-all duration-200',
															'text-muted-foreground group-hover:text-accent',
															activeCategory === category.name && 'text-accent'
														)}
													>
														{tech.icon}
													</span>
													<span className='text-xs font-medium truncate'>
														{tech.name}
													</span>
												</div>
											</motion.div>
										))}
									</div>

									{/* Show more indicator */}
									{category.techs.length > 8 && (
										<div className='mt-3 text-center'>
											<HoverCard openDelay={200} closeDelay={100}>
												<HoverCardTrigger asChild>
													<span className='text-xs text-muted-foreground hover:text-accent transition-colors cursor-pointer inline-block'>
														+{category.techs.length - 8} more
													</span>
												</HoverCardTrigger>
												<HoverCardContent
													className='w-auto p-3'
													align='center'
													sideOffset={5}
												>
													<motion.div
														initial={{ opacity: 0, y: 10, scale: 0.95 }}
														animate={{ opacity: 1, y: 0, scale: 1 }}
														exit={{ opacity: 0, y: 5, scale: 0.95 }}
														transition={{
															duration: 0.2,
															ease: [0.16, 1, 0.3, 1]
														}}
													>
														<div className='grid grid-cols-2 gap-2'>
															{category.techs.slice(8).map((tech, index) => (
																<motion.div
																	key={tech.name}
																	initial={{ opacity: 0, y: 5 }}
																	animate={{ opacity: 1, y: 0 }}
																	transition={{
																		duration: 0.2,
																		delay: index * 0.02,
																		ease: [0.16, 1, 0.3, 1]
																	}}
																>
																	<div className='flex items-center gap-2 p-2 rounded bg-muted/50'>
																		<span className='text-sm text-accent'>
																			{tech.icon}
																		</span>
																		<span className='text-xs font-medium'>
																			{tech.name}
																		</span>
																	</div>
																</motion.div>
															))}
														</div>
													</motion.div>
												</HoverCardContent>
											</HoverCard>
										</div>
									)}
								</div>

								{/* Decorative corner */}
								<div
									className={cn(
										'absolute top-0 right-0 w-20 h-20 opacity-0 transition-opacity duration-300',
										activeCategory === category.name && 'opacity-100'
									)}
								>
									<div className='absolute top-2 right-2 w-2 h-2 bg-accent rounded-full animate-pulse' />
								</div>
							</div>
						</motion.div>
					</div>
				))}
			</div>
		</section>
	)
}
