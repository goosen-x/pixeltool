import { getTranslations } from 'next-intl/server'
import { EnhancedWidgetSearch } from '@/components/tools/EnhancedWidgetSearch'
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
	Shield,
	Keyboard
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
			description: 'Collection of 50+ free online tools for developers, designers, and content creators. CSS generators, converters, calculators, formatters, validators, and more. No registration required, works offline.',
			keywords: ['online tools', 'developer tools', 'web tools', 'css generator', 'converter', 'calculator', 'free tools', 'code formatter', 'password generator', 'qr code generator', 'color picker', 'html parser', 'image tools', 'text tools'].join(', '),
		},
		ru: {
			title: 'Бесплатные Онлайн Инструменты - 50+ Утилит | PixelTool',
			description: 'Коллекция из 50+ бесплатных онлайн инструментов для разработчиков, дизайнеров и создателей контента. CSS генераторы, конвертеры, калькуляторы, форматтеры, валидаторы и многое другое. Работает офлайн.',
			keywords: ['онлайн инструменты', 'инструменты разработчика', 'веб инструменты', 'css генератор', 'конвертер', 'калькулятор', 'бесплатные инструменты', 'форматировщик кода', 'генератор паролей', 'qr код', 'палитра цветов'].join(', '),
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
		},
		
		robots: {
			index: true,
			follow: true,
			'max-image-preview': 'large',
			'max-snippet': -1,
			'max-video-preview': -1,
		}
	}
}

export default async function ProjectsPage({
	params
}: {
	params: Promise<{ locale: string }>
}) {
	const { locale } = await params
	const t = await getTranslations('widgets')

	return (
		<>
			<ToolsListingStructuredData locale={locale} totalTools={widgets.length} />
			
			{/* Hero Section */}
			<section className="relative overflow-hidden">
				{/* Background gradients */}
				<div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5" />
				<div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent" />
				
				<div className="container mx-auto px-4 py-12 sm:py-16 lg:py-20">
					<div className="text-center max-w-5xl mx-auto space-y-6">
						{/* Animated Badge */}
						<div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 backdrop-blur-sm animate-pulse">
							<Sparkles className="w-4 h-4 text-primary" />
							<span className="text-sm font-medium text-primary">{widgets.length} Professional Tools</span>
						</div>
						
						{/* Title */}
						<h1 className="text-4xl sm:text-5xl lg:text-6xl font-heading font-bold">
							<span className="bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
								{t('title')}
							</span>
						</h1>
						
						{/* Description */}
						<p className="text-xl text-muted-foreground max-w-3xl mx-auto">
							{t('description')}
						</p>
						
						{/* Feature badges */}
						<div className="flex flex-wrap justify-center gap-3 pt-4">
							<Badge variant="secondary" className="px-4 py-2 text-sm backdrop-blur-sm bg-background/50">
								<Gauge className="w-4 h-4 mr-2" />
								Lightning Fast
							</Badge>
							<Badge variant="secondary" className="px-4 py-2 text-sm backdrop-blur-sm bg-background/50">
								<Shield className="w-4 h-4 mr-2" />
								100% Free
							</Badge>
							<Badge variant="secondary" className="px-4 py-2 text-sm backdrop-blur-sm bg-background/50">
								<Code2 className="w-4 h-4 mr-2" />
								No Installation
							</Badge>
							<Badge variant="secondary" className="px-4 py-2 text-sm backdrop-blur-sm bg-background/50">
								<Palette className="w-4 h-4 mr-2" />
								Works Offline
							</Badge>
						</div>
						
						{/* Keyboard Shortcuts */}
						<div className="mt-8 inline-flex flex-wrap items-center justify-center gap-2 px-6 py-3 rounded-2xl bg-background/50 backdrop-blur-sm border border-border/50">
							<div className="flex items-center gap-2">
								<Keyboard className="w-4 h-4 text-muted-foreground" />
								<span className="text-sm font-medium text-muted-foreground">Shortcuts:</span>
							</div>
							<div className="flex flex-wrap items-center gap-3 sm:gap-4">
								<div className="flex items-center gap-1">
									<kbd className="h-5 px-1.5 text-xs font-mono bg-muted rounded border border-border">⌘K</kbd>
									<span className="text-xs text-muted-foreground">Search</span>
								</div>
								<div className="flex items-center gap-1">
									<kbd className="h-5 px-1.5 text-xs font-mono bg-muted rounded border border-border">ESC</kbd>
									<span className="text-xs text-muted-foreground">Clear</span>
								</div>
								<div className="flex items-center gap-1">
									<kbd className="h-5 px-1.5 text-xs font-mono bg-muted rounded border border-border">⌘/</kbd>
									<span className="text-xs text-muted-foreground">Categories</span>
								</div>
							</div>
						</div>
					</div>
				</div>
			</section>
			
			{/* Tools Section */}
			<section className="container mx-auto px-4 py-8 sm:py-12">
				<EnhancedWidgetSearch locale={locale} />
			</section>
		</>
	)
}