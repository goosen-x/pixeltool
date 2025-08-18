import { getTranslations } from 'next-intl/server'
import { Button } from '@/components/ui/button'
import { Sparkles, Github, Search, Zap, Filter, Star } from 'lucide-react'
import Link from 'next/link'
import { ToolsListingStructuredData } from '@/components/seo/ToolsListingStructuredData'
import { widgets } from '@/lib/constants/widgets'
import { Metadata } from 'next'

export async function generateMetadata({
	params
}: {
	params: Promise<{ locale: string }>
}): Promise<Metadata> {
	const { locale } = await params
	const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://pixeltool.pro'
	const url = `${baseUrl}/${locale}/tools`

	const metadata = {
		en: {
			title: `Free Online Developer Tools - ${widgets.length}+ Web Tools | PixelTool`,
			description: `Collection of ${widgets.length}+ free online tools for developers, designers, and content creators. CSS generators, converters, calculators, formatters, validators, and more. No registration required, works offline.`,
			keywords: [
				'online tools',
				'developer tools',
				'web tools',
				'css generator',
				'converter',
				'calculator',
				'free tools',
				'code formatter',
				'password generator',
				'qr code generator',
				'color picker',
				'html parser',
				'image tools',
				'text tools'
			].join(', ')
		},
		ru: {
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
	}

	const currentMetadata =
		metadata[locale as keyof typeof metadata] || metadata.en

	return {
		title: currentMetadata.title,
		description: currentMetadata.description,
		keywords: currentMetadata.keywords,

		openGraph: {
			title: currentMetadata.title,
			description: currentMetadata.description,
			url: url,
			siteName: 'PixelTool',
			locale: locale === 'ru' ? 'ru_RU' : 'en_US',
			type: 'website',
			images: [
				{
					url: `/api/og?title=${encodeURIComponent(locale === 'ru' ? 'Все инструменты' : 'All Tools')}&description=${encodeURIComponent(currentMetadata.description)}&locale=${locale}`,
					width: 1200,
					height: 630,
					alt: 'PixelTool - Professional Developer Tools'
				}
			]
		},

		twitter: {
			card: 'summary_large_image',
			title: currentMetadata.title,
			description: currentMetadata.description,
			images: [
				`/api/og?title=${encodeURIComponent(locale === 'ru' ? 'Все инструменты' : 'All Tools')}&description=${encodeURIComponent(currentMetadata.description)}&locale=${locale}`
			],
			creator: '@pixeltool'
		},

		alternates: {
			canonical: url,
			languages: {
				en: `${baseUrl}/en/tools`,
				ru: `${baseUrl}/ru/tools`
			}
		},

		robots: {
			index: true,
			follow: true,
			'max-image-preview': 'large',
			'max-snippet': -1,
			'max-video-preview': -1
		}
	}
}

export default async function ToolsPage({
	params
}: {
	params: Promise<{ locale: string }>
}) {
	const { locale } = await params
	const t = await getTranslations('widgets')

	return (
		<>
			<ToolsListingStructuredData locale={locale} totalTools={widgets.length} />

			{/* Full Search Section */}
			<section className='relative py-24 overflow-hidden' id='tools-search'>
				<div className='container relative z-10 mx-auto px-4'>
					<div className='text-center mb-16 space-y-6'>
						{/* Badge */}
						<div className='inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 backdrop-blur-sm border border-primary/20'>
							<Search className='w-4 h-4 text-primary' />
							<span className='text-sm font-medium text-primary'>
								{widgets.length} {locale === 'ru' ? 'инструментов' : 'tools'}
							</span>
						</div>

						{/* Title */}
						<h2
							className='text-4xl sm:text-5xl lg:text-6xl font-heading font-black'
							id='all-tools'
						>
							<span className='bg-gradient-to-r from-foreground via-primary to-accent bg-clip-text text-transparent animate-gradient bg-300%'>
								{locale === 'ru' ? 'Все инструменты' : 'All Tools'}
							</span>
						</h2>

						{/* Description */}
						<p className='text-xl sm:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed'>
							{locale === 'ru'
								? 'Найдите идеальный инструмент для вашей задачи'
								: 'Find the perfect tool for your task'}
						</p>
					</div>
					<div className='max-w-7xl mx-auto'>
						<EnhancedWidgetSearchWrapper locale={locale} />
					</div>
				</div>
			</section>

			{/* CTA Section */}
			<section className='py-20 bg-gradient-to-br from-primary/5 via-background to-accent/5'>
				<div className='container mx-auto px-4 text-center'>
					<div className='max-w-3xl mx-auto space-y-6'>
						<h2 className='text-3xl sm:text-4xl font-bold'>
							{locale === 'ru'
								? 'Не нашли нужный инструмент?'
								: "Didn't find what you need?"}
						</h2>
						<p className='text-lg text-muted-foreground'>
							{locale === 'ru'
								? 'Мы постоянно добавляем новые инструменты. Расскажите нам, что вам нужно!'
								: "We're constantly adding new tools. Let us know what you need!"}
						</p>
						<div className='flex gap-4 justify-center flex-wrap'>
							<Link href={`/${locale}/contact`}>
								<Button size='lg' className='gap-2'>
									<Sparkles className='w-5 h-5' />
									{locale === 'ru' ? 'Предложить инструмент' : 'Suggest a Tool'}
								</Button>
							</Link>
							<Link
								href='https://github.com/goosen-x/pixeltool'
								target='_blank'
							>
								<Button size='lg' variant='outline' className='gap-2'>
									<Github className='w-5 h-5' />
									{locale === 'ru' ? 'GitHub' : 'GitHub'}
								</Button>
							</Link>
						</div>
					</div>
				</div>
			</section>
		</>
	)
}

// Client Component Wrapper for EnhancedWidgetSearch
async function EnhancedWidgetSearchWrapper({ locale }: { locale: string }) {
	const { EnhancedWidgetSearch } = await import(
		'@/components/tools/EnhancedWidgetSearch'
	)
	return <EnhancedWidgetSearch locale={locale} />
}
