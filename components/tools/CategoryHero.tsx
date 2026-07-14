'use client'

import { useState } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { widgetCategories, widgets } from '@/lib/constants/widgets'
import { CATEGORY_META } from '@/lib/constants/categories'
import { cn } from '@/lib/utils'

interface Props {
	selectedCategory: string
	onCategoryChange: (category: string) => void
}

/** Сколько инструментов в категории — показываем на чипсе. */
function countIn(category: string): number {
	return category === ''
		? widgets.length
		: widgets.filter(widget => widget.category === category).length
}

export function CategoryHero({ selectedCategory, onCategoryChange }: Props) {
	// Помним отвалившиеся картинки поимённо: если файла одной категории ещё нет,
	// это не должно прятать картинки остальных.
	const [brokenImages, setBrokenImages] = useState<string[]>([])
	const reduceMotion = useReducedMotion()

	const meta =
		CATEGORY_META[selectedCategory as keyof typeof CATEGORY_META] ??
		CATEGORY_META['']

	return (
		<section className='relative overflow-hidden rounded-3xl border bg-gradient-to-br from-primary/5 via-background to-accent/5 px-6 py-10 sm:px-10 sm:py-14'>
			<div className='grid items-center gap-8 lg:grid-cols-[1fr_auto]'>
				<div className='max-w-2xl'>
					<AnimatePresence mode='wait'>
						<motion.div
							key={selectedCategory || 'all'}
							initial={{ opacity: 0, y: 8 }}
							animate={{ opacity: 1, y: 0 }}
							exit={{ opacity: 0, y: -8 }}
							transition={{ duration: 0.25 }}
						>
							<h1 className='text-4xl font-bold tracking-tight sm:text-5xl'>
								{meta.title}
							</h1>
							<p className='mt-4 text-base leading-relaxed text-muted-foreground sm:text-lg'>
								{meta.description}
							</p>
						</motion.div>
					</AnimatePresence>

					<div className='mt-8 flex flex-wrap gap-2'>
						<Button
							variant={selectedCategory === '' ? 'default' : 'outline'}
							size='sm'
							onClick={() => onCategoryChange('')}
							className='cursor-pointer rounded-full'
						>
							Все
							<span className='ml-1.5 opacity-60'>{countIn('')}</span>
						</Button>

						{Object.entries(widgetCategories).map(([key, title]) => (
							<Button
								key={key}
								variant={selectedCategory === key ? 'default' : 'outline'}
								size='sm'
								onClick={() => onCategoryChange(key)}
								className='cursor-pointer rounded-full'
							>
								{title}
								<span className='ml-1.5 opacity-60'>{countIn(key)}</span>
							</Button>
						))}
					</div>
				</div>

				{/* Картинка левитирует: бесконечное покачивание по вертикали с лёгким
				    наклоном. repeatType mirror — чтобы не было рывка на стыке циклов.
				    Если файла категории ещё нет, блок просто не рисуется и вёрстка
				    не разъезжается. */}
				{!brokenImages.includes(meta.image) && (
					<div className='hidden lg:block'>
						<AnimatePresence mode='wait'>
							<motion.div
								key={meta.image}
								initial={{ opacity: 0, scale: 0.95 }}
								animate={{ opacity: 1, scale: 1 }}
								exit={{ opacity: 0, scale: 0.95 }}
								transition={{ duration: 0.3 }}
							>
								<motion.div
									animate={
										reduceMotion
											? undefined
											: { y: [0, -14, 0], rotate: [-1, 1, -1] }
									}
									transition={{
										duration: 6,
										repeat: Infinity,
										repeatType: 'mirror',
										ease: 'easeInOut'
									}}
									className={cn('relative h-64 w-64 xl:h-80 xl:w-80')}
								>
									<Image
										src={meta.image}
										alt=''
										fill
										priority
										sizes='320px'
										className='object-contain drop-shadow-2xl'
										onError={() =>
											setBrokenImages(current => [...current, meta.image])
										}
									/>
								</motion.div>
							</motion.div>
						</AnimatePresence>
					</div>
				)}
			</div>
		</section>
	)
}
