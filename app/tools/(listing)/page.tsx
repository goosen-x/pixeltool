'use client'

import { useEffect, useState } from 'react'
import { useDebouncedValue } from '@/lib/hooks/useDebouncedValue'
import { widgetCategories } from '@/lib/constants/widgets'
import { Button } from '@/components/ui/button'
import Image from 'next/image'
import { EnhancedWidgetSearch } from '@/components/tools/EnhancedWidgetSearch'
import { CategoryHero } from '@/components/tools/CategoryHero'
import { FeedbackModal } from '@/components/feedback'

// Metadata can't be used in client components
/*
export async function generateMetadata({
	params
}: {
	params: Promise<{ locale: string }>
}): Promise<Metadata> {
	// const { locale } = await params // Not needed for Russian-only
	const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://pixeltool.pro'
	const url = `${baseUrl}/tools`

	const metadata = {
		title: `Бесплатные Онлайн Инструменты - ${widgets.length}+ Утилит`,
		description: `Коллекция из ${widgets.length}+ бесплатных онлайн инструментов для разработчиков, дизайнеров и создателей контента. CSS генераторы, конвертеры, калькуляторы, форматтеры, валидаторы и многое другое. Работает офлайн.`,
		keywords: [
			'онлайн инструменты',
			'инструменты разработчика',
			'веб инструменты',
			'css генератор',
			'конвертер',
			'калькулятор',
			'бесплатные инструменты',
			'форматировщик кода',
			'генератор паролей',
			'qr код',
			'палитра цветов'
		].join(', ')
	}

	return {
		title: metadata.title,
		description: metadata.description,
		keywords: metadata.keywords,

		openGraph: {
			title: metadata.title,
			description: metadata.description,
			url: url,
			siteName: 'PixelTool',
			locale: 'ru_RU',
			type: 'website',
			images: [
				{
					url: `/api/og?title=${encodeURIComponent('Все инструменты')}&description=${encodeURIComponent(metadata.description)}&locale=ru`,
					width: 1200,
					height: 630,
					alt: 'PixelTool - Профессиональные инструменты разработчика'
				}
			]
		},

		twitter: {
			card: 'summary_large_image',
			title: metadata.title,
			description: metadata.description,
			images: [
				`/api/og?title=${encodeURIComponent('Все инструменты')}&description=${encodeURIComponent(metadata.description)}&locale=ru`
			],
			creator: '@pixeltool'
		},

		alternates: {
			canonical: url
		},

		robots: {
			index: true,
			follow: true,
			'max-image-preview': 'large',
			'max-snippet': -1,
			'max-video-preview': -1
		},

		other: {
			'application-ld+json': JSON.stringify({
				'@context': 'https://schema.org',
				'@type': 'CollectionPage',
				'@id': url,
				url: url,
				name: 'Бесплатные Онлайн Инструменты для Разработчиков',
				description: `Коллекция из ${widgets.length}+ бесплатных онлайн инструментов для разработчиков, дизайнеров и создателей контента. Без регистрации.`,
				breadcrumb: {
					'@type': 'BreadcrumbList',
					itemListElement: [
						{
							'@type': 'ListItem',
							position: 1,
							name: 'Главная',
							item: baseUrl
						},
						{
							'@type': 'ListItem',
							position: 2,
							name: 'Инструменты',
							item: url
						}
					]
				},
				mainEntity: {
					'@type': 'ItemList',
					numberOfItems: widgets.length,
					itemListElement: widgets.slice(0, 20).map((widget, index) => ({
						'@type': 'ListItem',
						position: index + 1,
						item: {
							'@type': 'SoftwareApplication',
							name: widget.title || widget.translationKey,
							url: `${baseUrl}/tools/${widget.path}`,
							applicationCategory: 'WebApplication',
							operatingSystem: 'Web Browser',
							offers: {
								'@type': 'Offer',
								price: '0',
								priceCurrency: 'USD'
							}
						}
					}))
				},
				isPartOf: {
					'@type': 'WebSite',
					name: 'PixelTool',
					url: baseUrl
				}
			})
		}
	}
}
*/

export default function ToolsPage() {
	// Поиск и категорию держим здесь: их вводят в шапке, а фильтруется по ним
	// список ниже — иначе два блока показывали бы разное.
	const [category, setCategory] = useState('')
	const [search, setSearch] = useState('')
	const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')

	// Поле откликается сразу, а список пересчитывается с задержкой — иначе он
	// перебирал бы полсотни виджетов на каждое нажатие клавиши.
	const debouncedSearch = useDebouncedValue(search, 250)
	const isSearching = search !== debouncedSearch

	// Футер ведёт на /tools?category=css — без этого параметр молча игнорировался
	// и все такие ссылки открывали просто общий список.
	useEffect(() => {
		const fromUrl = new URLSearchParams(window.location.search).get('category')
		if (fromUrl && fromUrl in widgetCategories) {
			setCategory(fromUrl)
		}
	}, [])

	return (
		<div className='container mx-auto py-6 lg:py-8 px-4 sm:px-6 lg:px-8 max-w-7xl'>
			<CategoryHero
				selectedCategory={category}
				onCategoryChange={setCategory}
				search={search}
				onSearchChange={setSearch}
				debouncedSearch={debouncedSearch}
				isSearching={isSearching}
				viewMode={viewMode}
				onViewModeChange={setViewMode}
			/>

			{/* Full Search Section */}
			<section
				className='relative overflow-hidden mb-12 mt-10'
				id='tools-search'
			>
				<EnhancedWidgetSearch
					embedded
					category={category}
					onCategoryChange={setCategory}
					search={debouncedSearch}
					onSearchChange={setSearch}
					viewMode={viewMode}
				/>
			</section>

			{/* Карточка-секция в том же ключе, что и шапка: та же скруглённая рамка
			    и та же контурная подложка */}
			{/* В светлой теме карточка на белом фоне страницы сливалась с ним — берём
			    muted (96% светлоты). Без прозрачности: с ней поверх белого выходило
			    почти чистые 255,255,255 и разницы не было видно. */}
			<section className='relative mb-12 overflow-hidden rounded-3xl border bg-muted px-6 py-12 dark:bg-card sm:px-10 sm:py-14'>
				{/* Контур ушёл в правый угол: слева теперь картинка, и там он лёг бы
				    прямо под неё */}
				<Image
					src='/images/patterns/contour-1.png'
					alt=''
					aria-hidden
					width={760}
					height={760}
					className='pointer-events-none absolute -right-[36rem] -top-16 w-[72rem] max-w-none select-none opacity-[0.08] dark:opacity-[0.1] dark:invert'
				/>

				{/* Картинка слева, текст справа. Без левитации: в шапке она уместна,
				    а здесь рядом с кнопкой только отвлекала бы от неё */}
				<div className='relative grid items-center gap-8 lg:grid-cols-[auto_1fr] lg:gap-16'>
					<div className='hidden lg:block'>
						<div className='relative h-40 w-56 xl:h-44 xl:w-64'>
							<Image
								src='/images/categories/suggest.png'
								alt=''
								aria-hidden
								fill
								sizes='384px'
								className='object-contain drop-shadow-2xl'
							/>
						</div>
					</div>

					<div className='max-w-xl space-y-4'>
						<h2 className='text-3xl font-bold tracking-tight sm:text-4xl'>
							Не нашли нужный инструмент?
						</h2>
						<p className='text-base leading-relaxed text-muted-foreground sm:text-lg'>
							Инструменты добавляются постоянно. Расскажите, чего вам не
							хватает, — это лучший способ повлиять на то, что появится
							следующим.
						</p>

						{/* Тот же попап, что открывается из карточки обратной связи в
						    сайдбаре, — заводить под это отдельную страницу незачем */}
						<div className='pt-2'>
							<FeedbackModal
								defaultType='feature'
								trigger={
									<Button size='lg' className='cursor-pointer'>
										Предложить инструмент
									</Button>
								}
							/>
						</div>
					</div>
				</div>
			</section>
		</div>
	)
}
