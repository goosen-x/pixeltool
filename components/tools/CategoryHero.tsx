'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Search, X } from 'lucide-react'
import { widgetCategories, widgets } from '@/lib/constants/widgets'
import { CATEGORY_META } from '@/lib/constants/categories'

interface Props {
	selectedCategory: string
	onCategoryChange: (category: string) => void
	search: string
	onSearchChange: (query: string) => void
}

/** Сколько инструментов в категории — показываем на чипсе. */
function countIn(category: string): number {
	return category === ''
		? widgets.length
		: widgets.filter(widget => widget.category === category).length
}

export function CategoryHero({
	selectedCategory,
	onCategoryChange,
	search,
	onSearchChange
}: Props) {
	// Помним отвалившиеся картинки поимённо: если файла одной категории вдруг
	// нет, это не должно прятать картинки остальных.
	const [brokenImages, setBrokenImages] = useState<string[]>([])

	const meta =
		CATEGORY_META[selectedCategory as keyof typeof CATEGORY_META] ??
		CATEGORY_META['']

	return (
		<section className='relative overflow-hidden rounded-3xl border bg-card px-6 py-10 sm:px-10 sm:py-14'>
			{/* Контурная подложка. Линии чёрные, поэтому в тёмной теме инвертируем —
			    иначе они сливались бы с фоном. aria-hidden: это украшение, скринридеру
			    рассказывать о нём нечего. */}
			<Image
				src='/images/tools-hero-bg.png'
				alt=''
				aria-hidden
				width={1200}
				height={1200}
				priority
				className='pointer-events-none absolute -right-24 -top-32 w-[38rem] max-w-none select-none opacity-[0.07] dark:opacity-[0.12] dark:invert'
			/>

			<div className='relative grid items-center gap-8 lg:grid-cols-[1fr_auto]'>
				<div className='max-w-2xl'>
					{/* key на смене категории перезапускает появление текста */}
					<div key={selectedCategory || 'all'} className='animate-fade-in'>
						<h1 className='text-4xl font-bold tracking-tight sm:text-5xl'>
							{meta.title}
						</h1>
						{/* Описания у категорий разной длины — без минимальной высоты блок
						    подпрыгивал бы при каждом переключении. Запас на три строки. */}
						<p className='mt-4 min-h-[4.875rem] text-base leading-relaxed text-muted-foreground sm:min-h-[5.5rem] sm:text-lg'>
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

					<div className='relative mt-6 max-w-xl'>
						<Search className='pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground' />
						<Input
							value={search}
							onChange={event => onSearchChange(event.target.value)}
							placeholder='Поиск инструментов…'
							aria-label='Поиск инструментов'
							className='h-14 rounded-2xl border-border/50 bg-background/80 pl-12 pr-12 text-base shadow-sm backdrop-blur-sm transition-all hover:shadow-md focus:bg-background'
						/>
						{search && (
							<Button
								variant='ghost'
								size='sm'
								onClick={() => onSearchChange('')}
								aria-label='Очистить поиск'
								className='absolute right-2 top-1/2 h-8 w-8 -translate-y-1/2 cursor-pointer p-1'
							>
								<X className='h-4 w-4' />
							</Button>
						)}
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
