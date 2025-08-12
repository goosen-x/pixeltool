import { getTranslations } from 'next-intl/server'
import { WidgetSearch } from '@/components/tools/WidgetSearch'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { 
	Sparkles, 
	Search,
	Filter,
	Layers,
	Code2,
	Palette,
	Gauge,
	Shield
} from 'lucide-react'
import Link from 'next/link'
import { ToolsListingStructuredData } from '@/components/seo/ToolsListingStructuredData'
import { widgets } from '@/lib/constants/widgets'
import { Metadata } from 'next'

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
	const { locale } = await params
	const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://pixeltool.pro'
	const url = `${baseUrl}/${locale}/tools`
	
	const metadata = {
		en: {
			title: 'Free Online Developer Tools - 50+ Web Tools | PixelTool',
			description: 'Collection of 50+ free online tools for developers, designers, and content creators. CSS generators, converters, calculators, and more. No registration required.',
			keywords: 'online tools, developer tools, web tools, css generator, converter, calculator, free tools',
		},
		ru: {
			title: 'Бесплатные Онлайн Инструменты - 50+ Утилит | PixelTool',
			description: 'Коллекция из 50+ бесплатных онлайн инструментов для разработчиков, дизайнеров и создателей контента. CSS генераторы, конвертеры, калькуляторы и многое другое.',
			keywords: 'онлайн инструменты, инструменты разработчика, веб инструменты, css генератор, конвертер, калькулятор, бесплатные инструменты',
		}
	}
	
	const currentMetadata = metadata[locale as keyof typeof metadata] || metadata.en
	
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
			images: [`/api/og?title=${encodeURIComponent(locale === 'ru' ? 'Все инструменты' : 'All Tools')}&description=${encodeURIComponent(currentMetadata.description)}&locale=${locale}`],
			creator: '@pixeltool'
		},
		
		alternates: {
			canonical: url,
			languages: {
				'en': `${baseUrl}/en/tools`,
				'ru': `${baseUrl}/ru/tools`
			}
		}
	}
}

export default async function ProjectsPage({
	params
}: {
	params: Promise<{ locale: string }>
}) {
	const { locale } = await params
	const t = await getTranslations('projectsPage')

	return (
		<>
			<ToolsListingStructuredData locale={locale} totalTools={widgets.length} />
			<section className="container mx-auto px-4 py-8 sm:py-12">
				<WidgetSearch locale={locale} />
			</section>
		</>
	)
}