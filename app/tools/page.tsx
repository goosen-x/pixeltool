'use client'

import { Button } from '@/components/ui/button'
import { Sparkles, Github } from 'lucide-react'
import Link from 'next/link'
import { EnhancedWidgetSearch } from '@/components/tools/EnhancedWidgetSearch'

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
		<>
			{/* Full Search Section */}
			<section className='relative overflow-hidden' id='tools-search'>
				<EnhancedWidgetSearch />
			</section>

			{/* CTA Section */}
			<section className='py-20 bg-gradient-to-br from-primary/5 via-background to-accent/5'>
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
							<Link href='/contact'>
								<Button size='lg' className='gap-2'>
									<Sparkles className='w-5 h-5' />
									Предложить инструмент
								</Button>
							</Link>
							<Link
								href='https://github.com/goosen-x/pixeltool'
								target='_blank'
							>
								<Button size='lg' variant='outline' className='gap-2'>
									<Github className='w-5 h-5' />
									GitHub
								</Button>
							</Link>
						</div>
					</div>
				</div>
			</section>
		</>
	)
}
