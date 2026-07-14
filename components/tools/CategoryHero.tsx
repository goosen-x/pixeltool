'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Search, X, Grid3X3, List, Loader2 } from 'lucide-react'
import { widgetCategories, widgets } from '@/lib/constants/widgets'
import { CATEGORY_META } from '@/lib/constants/categories'
import { filterWidgets } from '@/lib/utils/filter-widgets'
import { cn } from '@/lib/utils'

interface Props {
	/** '' — общий каталог. Внутри не меняется: категорию выбирают ссылкой. */
	category: string
	search: string
	onSearchChange: (query: string) => void
	/** Отложенное значение — по нему считается «Найдено», как и сам список. */
	debouncedSearch: string
	isSearching: boolean
	viewMode: 'grid' | 'list'
	onViewModeChange: (mode: 'grid' | 'list') => void
}

/** Сколько инструментов в категории — показываем на чипсе. */
function countIn(category: string): number {
	return category === ''
		? widgets.length
		: widgets.filter(widget => widget.category === category).length
}

function hrefFor(category: string): string {
	return category === '' ? '/tools' : `/tools/${category}`
}

export function CategoryHero({
	category,
	search,
	onSearchChange,
	debouncedSearch,
	isSearching,
	viewMode,
	onViewModeChange
}: Props) {
	// Помним отвалившиеся картинки поимённо: если файла одной категории вдруг
	// нет, это не должно прятать картинки остальных.
	const [brokenImages, setBrokenImages] = useState<string[]>([])

	const meta =
		CATEGORY_META[category as keyof typeof CATEGORY_META] ?? CATEGORY_META['']

	const found = filterWidgets(widgets, debouncedSearch, category).length
	const chips: string[] = ['', ...Object.keys(widgetCategories)]

	// bg-muted, а не bg-card: в светлой теме card — чистый белый, и карточка
	// сливалась с фоном страницы
	return (
		<section className='relative overflow-hidden rounded-3xl border bg-muted px-6 py-10 dark:bg-card sm:px-10 sm:py-14'>
			{/* Контурная подложка. Линии чёрные, поэтому в тёмной теме инвертируем —
			    иначе они сливались бы с фоном. aria-hidden: это украшение,
			    скринридеру рассказывать о нём нечего. */}
			<Image
				src='/images/tools-hero-bg.png'
				alt=''
				aria-hidden
				width={1200}
				height={1200}
				priority
				className='pointer-events-none absolute -right-24 -top-32 w-[38rem] max-w-none select-none opacity-[0.14] dark:opacity-[0.12] dark:invert'
			/>

			<div className='relative grid items-center gap-8 lg:grid-cols-[1fr_auto]'>
				<div className='max-w-2xl'>
					<h1 className='text-3xl font-bold tracking-tight sm:text-4xl'>
						{meta.heading}
					</h1>
					<p className='mt-4 text-base leading-relaxed text-muted-foreground sm:text-lg'>
						{meta.description}
					</p>

					{/* Чипсы — ссылки, а не фильтр на месте: у каждой категории свой
					    адрес, заголовок и текст, и поисковик должен их видеть */}
					<nav aria-label='Категории инструментов' className='mt-8'>
						<ul className='flex flex-wrap gap-2'>
							{chips.map(key => {
								const active = key === category
								const chipMeta =
									CATEGORY_META[key as keyof typeof CATEGORY_META]

								return (
									<li key={key || 'all'}>
										<Link
											href={hrefFor(key)}
											aria-current={active ? 'page' : undefined}
											className={cn(
												'inline-flex cursor-pointer items-center gap-1.5 rounded-full border px-3 py-1.5 text-sm font-medium transition-colors',
												active
													? 'border-primary bg-primary text-primary-foreground'
													: // accent — синий, и чипс на ховере превращался в синюю
														// плашку с тёмным текстом. Подсвечиваем только рамку.
														'border-border bg-background text-foreground hover:border-primary/50'
											)}
										>
											{chipMeta.title}
											<span className='opacity-60'>{countIn(key)}</span>
										</Link>
									</li>
								)
							})}
						</ul>
					</nav>

					<div className='relative mt-6 max-w-xl'>
						<Search className='pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground' />
						<Input
							value={search}
							onChange={event => onSearchChange(event.target.value)}
							placeholder='Поиск инструментов…'
							aria-label='Поиск инструментов'
							className='h-14 rounded-2xl border-border/50 bg-background pl-12 pr-12 text-base'
						/>
						{isSearching ? (
							<Loader2
								aria-hidden
								className='absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 animate-spin text-muted-foreground'
							/>
						) : (
							search && (
								<Button
									variant='ghost'
									size='sm'
									onClick={() => onSearchChange('')}
									aria-label='Очистить поиск'
									className='absolute right-2 top-1/2 h-8 w-8 -translate-y-1/2 cursor-pointer p-1'
								>
									<X className='h-4 w-4' />
								</Button>
							)
						)}
					</div>

					{/* Экранный диктор не видит спиннер — сообщаем результат словами */}
					<span className='sr-only' role='status' aria-live='polite'>
						{isSearching ? 'Идёт поиск' : `Найдено инструментов: ${found}`}
					</span>
				</div>

				{!brokenImages.includes(meta.image) && (
					<div className='hidden lg:block'>
						{/* Картинка левитирует: анимация на CSS (см. .animate-levitate
						    в globals.css), она же гасится при prefers-reduced-motion */}
						<div
							key={meta.image}
							className='animate-scale-in relative h-52 w-52 xl:h-64 xl:w-64'
						>
							<div className='animate-levitate relative h-full w-full'>
								<Image
									src={meta.image}
									alt=''
									aria-hidden
									fill
									priority
									sizes='256px'
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

			{/* Результаты и режим показа — отдельным рядом по низу карточки */}
			<div className='relative mt-8 flex flex-wrap items-center justify-between gap-4 border-t pt-5'>
				<div className='flex items-center gap-2'>
					<span className='text-sm text-muted-foreground'>Найдено: {found}</span>
					{search !== '' && (
						<Button
							variant='ghost'
							size='sm'
							onClick={() => onSearchChange('')}
							className='h-7 cursor-pointer px-2'
						>
							<X className='mr-1 h-3 w-3' />
							Очистить поиск
						</Button>
					)}
				</div>

				<div className='flex items-center gap-1'>
					<Button
						variant={viewMode === 'grid' ? 'default' : 'ghost'}
						size='sm'
						onClick={() => onViewModeChange('grid')}
						aria-pressed={viewMode === 'grid'}
						className='h-8 cursor-pointer gap-1.5 px-3'
					>
						<Grid3X3 className='h-4 w-4' />
						Плиткой
					</Button>
					<Button
						variant={viewMode === 'list' ? 'default' : 'ghost'}
						size='sm'
						onClick={() => onViewModeChange('list')}
						aria-pressed={viewMode === 'list'}
						className='h-8 cursor-pointer gap-1.5 px-3'
					>
						<List className='h-4 w-4' />
						Списком
					</Button>
				</div>
			</div>
		</section>
	)
}
