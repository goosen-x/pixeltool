'use client'

import { useState } from 'react'
import Image from 'next/image'
import { CATEGORY_META } from '@/lib/constants/categories'
import { CategoryChipsNav } from '@/components/tools/CategoryChipsNav'

interface Props {
	/** '' — общий каталог. Внутри не меняется: категорию выбирают ссылкой. */
	category: string
}

/**
 * Декоративная карточка с картинкой и градиентным фоном — только sm+. На
 * мобильном её место занимает компактный `MobileCatalogHeader` (заголовок +
 * поиск + фильтры + описание одной колонкой, без фонового изображения).
 */
export function CategoryHero({ category }: Props) {
	// Помним отвалившиеся картинки поимённо: если файла одной категории вдруг
	// нет, это не должно прятать картинки остальных.
	const [brokenImages, setBrokenImages] = useState<string[]>([])

	const meta =
		CATEGORY_META[category as keyof typeof CATEGORY_META] ?? CATEGORY_META['']

	// bg-muted, а не bg-card: в светлой теме card — чистый белый, и карточка
	// сливалась с фоном страницы
	return (
		<section className='relative isolate hidden overflow-hidden rounded-3xl border bg-background px-6 py-10 dark:bg-[#050816] sm:block sm:px-10 sm:py-14'>
			<div aria-hidden className='pointer-events-none absolute inset-0'>
				<Image
					src='/images/tools-hero-bg-light.avif'
					alt=''
					aria-hidden
					fill
					priority
					sizes='100vw'
					className='select-none object-cover object-center dark:hidden'
				/>
				<Image
					src='/images/tools-hero-bg-dark.avif'
					alt=''
					aria-hidden
					fill
					priority
					sizes='100vw'
					className='hidden select-none object-cover object-center dark:block'
				/>
				<div className='absolute inset-0 bg-gradient-to-r from-background/95 via-background/82 to-background/28 dark:from-background/92 dark:via-background/78 dark:to-background/12' />
			</div>

			<div className='relative grid items-center gap-8 lg:grid-cols-[1fr_auto]'>
				<div className='max-w-2xl'>
					{/* Заголовки и описания у категорий разной длины, а это разные
					    страницы — без запаса по высоте вся вёрстка ниже прыгала бы при
					    каждом переходе. Запас: две строки на заголовок, три на описание. */}
					{/* Не <h1> — настоящий заголовок один на страницу, рендерится один
					   раз в ToolsExplorer, а не в каждом из двух responsive-вариантов
					   (эта карточка и MobileCatalogHeader), иначе в разметке всегда
					   два <h1> одновременно: hidden/sm:block скрывает визуально, но
					   не убирает из HTML, который видят краулеры. */}
					<p
						aria-hidden='true'
						className='min-h-[9rem] text-balance text-3xl font-bold leading-tight tracking-tight sm:min-h-[6.5rem] sm:text-4xl'
					>
						{meta.heading}
					</p>
					<p className='mt-4 min-h-[7rem] text-base leading-relaxed text-muted-foreground sm:min-h-[5.5rem] sm:text-lg'>
						{meta.description}
					</p>

					{/* Чипсы — ссылки, а не фильтр на месте: у каждой категории свой
					    адрес, заголовок и текст, и поисковик должен их видеть */}
					<CategoryChipsNav category={category} className='mt-8' />
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
									quality={90}
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
