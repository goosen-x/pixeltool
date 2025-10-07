'use client'

import { Button } from '@/components/ui/button'
import { Sparkles, Github } from 'lucide-react'
import Link from 'next/link'
import { EnhancedWidgetSearch } from '@/components/tools/EnhancedWidgetSearch'
import { Metadata } from 'next'
import { widgets } from '@/lib/constants/widgets'

export const metadata: Metadata = {
	title: `Бесплатные инструменты для веб разработки и дизайна онлайн | PixelTool`,
	description: `${widgets.length}+ бесплатных онлайн инструментов: CSS генераторы, конвертеры, калькуляторы, форматировщики, валидаторы. Без установки, работает офлайн.`,
	keywords:
		'онлайн инструменты, инструменты разработчика, веб инструменты, css генератор, конвертер, калькулятор, бесплатные инструменты, форматировщик кода, генератор паролей, qr код, палитра цветов, рассчитать онлайн, посчитать онлайн',
	openGraph: {
		title: `Бесплатные инструменты для веб разработки и дизайна онлайн`,
		description: `${widgets.length}+ бесплатных инструментов: CSS генераторы, конвертеры, калькуляторы, форматировщики. Без установки, работает офлайн.`,
		url: 'https://pixeltool.ru/tools',
		siteName: 'PixelTool',
		type: 'website',
		locale: 'ru_RU'
	},
	twitter: {
		card: 'summary_large_image',
		title: `Бесплатные инструменты для веб разработки и дизайна онлайн`,
		description: `${widgets.length}+ бесплатных инструментов: CSS генераторы, конвертеры, калькуляторы. Работает офлайн.`
	},
	alternates: {
		canonical: 'https://pixeltool.ru/tools'
	}
}

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
		title: `Бесплатные Онлайн Инструменты - ${widgets.length}+ Утилит | PixelTool`,
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

// Force dynamic rendering to avoid build-time errors
export const dynamic = 'force-dynamic'

export default function ToolsPage({
	params
}: {
	params: Promise<{ locale: string }>
}) {
	// const { locale } = await params // Can't use await in non-async function, but we don't need locale anyway

	return (
		<div className='container mx-auto py-6 lg:py-8 px-4 sm:px-6 lg:px-8 max-w-7xl'>
			{/* Full Search Section */}
			<section className='relative overflow-hidden mb-12' id='tools-search'>
				<EnhancedWidgetSearch />
			</section>

			{/* CTA Section */}
			<section className='py-12 lg:py-20 -mx-4 sm:-mx-6 lg:-mx-8 px-4 bg-gradient-to-br from-primary/5 via-background to-accent/5'>
				<div className='container mx-auto px-4 text-center'>
					<div className='max-w-6xl mx-auto space-y-6'>
						<h2 className='text-3xl sm:text-4xl font-bold'>
							Не нашли нужный инструмент?
						</h2>
						<p className='text-lg text-muted-foreground'>
							Мы постоянно добавляем новые инструменты. Расскажите нам, что вам
							нужно!
						</p>
						<div className='flex gap-4 justify-center flex-wrap'>
							<Button size='lg' className='gap-2' asChild>
								<Link href='/contact'>
									<Sparkles className='w-5 h-5' />
									Предложить инструмент
								</Link>
							</Button>
							<Button size='lg' variant='outline' className='gap-2' asChild>
								<Link
									href='https://github.com/goosen-x/pixeltool'
									target='_blank'
								>
									<Github className='w-5 h-5' />
									GitHub
								</Link>
							</Button>
						</div>
					</div>
				</div>
			</section>
		</div>
	)
}
