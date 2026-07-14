'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { widgetCategories, widgets } from '@/lib/constants/widgets'
import { CATEGORY_META } from '@/lib/constants/categories'

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
	// Помним отвалившиеся картинки поимённо: если файла одной категории вдруг
	// нет, это не должно прятать картинки остальных.
	const [brokenImages, setBrokenImages] = useState<string[]>([])

	const meta =
		CATEGORY_META[selectedCategory as keyof typeof CATEGORY_META] ??
		CATEGORY_META['']

	return (
		<section className='relative overflow-hidden rounded-3xl border bg-gradient-to-br from-primary/5 via-background to-accent/5 px-6 py-10 sm:px-10 sm:py-14'>
			<div className='grid items-center gap-8 lg:grid-cols-[1fr_auto]'>
				<div className='max-w-2xl'>
					{/* key на смене категории перезапускает появление текста */}
					<div key={selectedCategory || 'all'} className='animate-fade-in'>
						<h1 className='text-4xl font-bold tracking-tight sm:text-5xl'>
							{meta.title}
						</h1>
						<p className='mt-4 text-base leading-relaxed text-muted-foreground sm:text-lg'>
							{meta.description}
						</p>
					</div>

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

				{/* Картинка левитирует: анимация на CSS (см. .animate-levitate в
				    globals.css), она же гасится при prefers-reduced-motion. Если файла
				    категории вдруг нет, блок просто не рисуется — вёрстка не поедет. */}
				{!brokenImages.includes(meta.image) && (
					<div className='hidden lg:block'>
						<div
							key={meta.image}
							className='animate-scale-in relative h-64 w-64 xl:h-80 xl:w-80'
						>
							<div className='animate-levitate relative h-full w-full'>
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
							</div>
						</div>
					</div>
				)}
			</div>
		</section>
	)
}
