import { getTranslations } from 'next-intl/server'
import Link from 'next/link'
import {
	ArrowRight,
	Code2,
	Palette,
	Zap,
	Globe,
	Sparkles,
	Terminal,
	Layers,
	DollarSign
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { HomePageStructuredData } from '@/components/seo/HomePageStructuredData'
import { OnlineUsers } from '@/components/global/OnlineUsers'
import { RippleLoader } from '@/components/global/RippleLoader'
import { HomePageTracker } from '@/components/analytics/HomePageTracker'
import { SectionWidgetsCarousel } from '@/components/homepage/SectionWidgetsCarousel'
import { widgets } from '@/lib/constants/widgets'
import { Metadata } from 'next'

interface Props {
	params: Promise<{ locale: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
	const { locale } = await params

	const metadata = {
		en: {
			title: `PixelTool - Free Online Developer Tools & Utilities | ${widgets.length}+ Tools`,
			description: `Professional web developer tools collection: CSS generators, color converters, formatters, validators, and ${widgets.length}+ more utilities. No installation required, 100% free, works offline.`,
			keywords:
				'developer tools, online tools, CSS generator, color converter, code formatter, web development, programming utilities, free tools, password generator, QR code generator'
		},
		ru: {
			title: `PixelTool - Бесплатные Онлайн Инструменты для Разработчиков | ${widgets.length}+ Инструментов`,
			description: `Профессиональная коллекция инструментов для веб-разработчиков: CSS генераторы, конвертеры цветов, форматировщики, валидаторы и ${widgets.length}+ утилит. Без установки, 100% бесплатно, работает офлайн.`,
			keywords:
				'инструменты разработчика, онлайн инструменты, CSS генератор, конвертер цветов, форматировщик кода, веб разработка, утилиты программирования, бесплатные инструменты'
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
			type: 'website',
			images: [
				{
					url: '/og-image.png',
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
			images: ['/og-image.png']
		},
		alternates: {
			canonical: `/${locale}`,
			languages: {
				en: '/en',
				ru: '/ru'
			}
		}
	}
}

export default async function HomePage({ params }: Props) {
	const { locale } = await params
	const t = await getTranslations('HomePage')

	return (
		<>
			<HomePageStructuredData />
			<HomePageTracker />
			<main className='min-h-screen bg-gradient-to-b from-background via-background to-muted/20'>
				{/* Hero Section */}
				<section className='relative px-4 pt-12 pb-24 sm:pt-32 sm:pb-40 sm:px-6 lg:px-8 overflow-hidden'>
					{/* Enhanced Background decoration - mobile optimized */}
					<div className='absolute inset-0 -z-10'>
						<div className='absolute top-10 -left-20 sm:top-20 sm:left-1/4 w-48 h-48 sm:w-96 sm:h-96 bg-gradient-to-br from-primary/20 to-accent/10 rounded-full blur-2xl sm:blur-3xl animate-pulse' />
						<div className='absolute bottom-10 -right-20 sm:bottom-20 sm:right-1/4 w-40 h-40 sm:w-80 sm:h-80 bg-gradient-to-br from-accent/20 to-primary/10 rounded-full blur-2xl sm:blur-3xl' />
						<div className='absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] sm:w-[600px] sm:h-[600px] bg-gradient-to-r from-primary/5 via-transparent to-accent/5 rounded-full blur-2xl sm:blur-3xl opacity-50 sm:opacity-100' />
					</div>

					{/* Floating particles - reduced on mobile */}
					<div className='absolute inset-0 -z-5 hidden sm:block'>
						<div className='absolute top-1/4 left-1/3 w-2 h-2 bg-primary/30 rounded-full animate-bounce [animation-delay:0s]' />
						<div className='absolute top-1/3 right-1/4 w-1.5 h-1.5 bg-accent/40 rounded-full animate-bounce [animation-delay:1s]' />
						<div className='absolute bottom-1/3 left-1/5 w-1 h-1 bg-primary/50 rounded-full animate-bounce [animation-delay:2s]' />
					</div>

					<div className='mx-auto max-w-7xl text-center'>
						{/* Status Badge with Online Users */}
						<div className='flex flex-row gap-3 justify-center items-center mb-6 sm:mb-8'>
							<OnlineUsers />
							<div className='inline-flex items-center gap-2 sm:gap-3 px-3 sm:px-5 py-2 sm:py-3 rounded-full bg-gradient-to-r from-primary/15 to-accent/15 border border-primary/30 backdrop-blur-sm shadow-lg hover:shadow-primary/20 transition-all duration-300'>
								<span className='text-xs sm:text-sm font-medium text-primary'>
									{t('hero.liveAndFree')}
								</span>
								<DollarSign className='w-3 h-3 sm:w-4 sm:h-4 text-primary' />
							</div>
						</div>

						{/* Main Title with ripple animation */}
						<div className='mb-8 sm:mb-12 flex flex-col sm:flex-row justify-center items-center gap-4 sm:gap-8'>
							<RippleLoader className='opacity-80 flex-shrink-0 scale-75 sm:scale-100' />
							<h1 className='text-6xl sm:text-7xl md:text-8xl lg:text-[11rem] font-heading font-black tracking-tight leading-none bg-gradient-to-br from-foreground via-foreground to-foreground/80 bg-clip-text text-transparent animate-gradient bg-300%'>
								PixelTool
							</h1>
						</div>

						{/* Enhanced subtitle */}
						<div className='mx-auto mb-8 sm:mb-10 max-w-4xl px-4'>
							<p className='text-xl sm:text-2xl md:text-3xl lg:text-4xl text-foreground/90 font-light mb-4 sm:mb-6 leading-relaxed'>
								{t('hero.subtitle')}
							</p>
							<p className='text-base sm:text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed'>
								{t('hero.subtitle2')}
							</p>
						</div>

						{/* Enhanced feature badges - mobile optimized grid */}
						<div className='grid grid-cols-2 sm:flex sm:flex-wrap gap-2 sm:gap-4 justify-center mb-8 sm:mb-12 px-2'>
							{[
								{
									icon: Sparkles,
									label: `${widgets.length}+ ${t('hero.features.professionalTools')}`,
									color: 'from-primary to-accent'
								},
								{
									icon: Zap,
									label: t('hero.features.noInstallation'),
									color: 'from-yellow-500 to-orange-500'
								},
								{
									icon: Globe,
									label: t('hero.features.freeForever'),
									color: 'from-green-500 to-emerald-500'
								},
								{
									icon: Zap,
									label: t('hero.features.lightningFast'),
									color: 'from-blue-500 to-cyan-500'
								}
							].map((item, idx) => (
								<div
									key={idx}
									className='group px-2.5 py-2 sm:px-6 sm:py-3 rounded-lg sm:rounded-2xl bg-background/60 backdrop-blur-sm border border-border/50 hover:border-primary/30 transition-all duration-300 hover:scale-105 min-h-[60px] flex items-center'
								>
									<div className='flex items-center gap-1.5 sm:gap-3 w-full'>
										<div
											className={`p-1 sm:p-2 rounded-md sm:rounded-xl bg-gradient-to-r ${item.color} flex-shrink-0`}
										>
											<item.icon className='w-3 h-3 sm:w-4 sm:h-4 text-white' />
										</div>
										<span className='text-[11px] sm:text-sm font-medium text-foreground break-words leading-tight'>
											{item.label}
										</span>
									</div>
								</div>
							))}
						</div>

						{/* Enhanced CTA Buttons - mobile optimized */}
						<div className='flex flex-col gap-4 sm:flex-row sm:gap-6 justify-center items-center px-4 w-full'>
							<Link href={`/${locale}/tools`} className='w-full sm:w-auto'>
								<Button
									size='lg'
									className='group gap-2 sm:gap-3 text-base sm:text-xl px-8 sm:px-12 h-14 sm:h-16 rounded-xl sm:rounded-2xl bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 shadow-xl sm:shadow-2xl hover:shadow-primary/30 transition-all duration-300 hover:scale-105 w-full sm:w-auto relative overflow-hidden'
								>
									<div className='absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300' />
									<Terminal className='h-5 w-5 sm:h-6 sm:w-6 group-hover:rotate-12 transition-transform z-10' />
									<span className='z-10 font-semibold'>{t('hero.exploreTools')}</span>
									<ArrowRight className='h-4 w-4 sm:h-5 sm:w-5 group-hover:translate-x-1 transition-transform z-10' />
								</Button>
							</Link>
							<Link
								href='https://github.com/goosen-x/pixeltool'
								target='_blank'
								className='w-full sm:w-auto'
							>
								<Button
									size='lg'
									variant='outline'
									className='gap-2 sm:gap-3 text-base sm:text-xl px-8 sm:px-12 h-14 sm:h-16 rounded-xl sm:rounded-2xl bg-background/95 backdrop-blur-sm border-2 border-border hover:border-primary hover:bg-primary/5 dark:hover:bg-primary/10 hover:text-primary transition-all duration-300 w-full sm:w-auto'
								>
									<Code2 className='h-5 w-5 sm:h-6 sm:w-6' />
									<span className='font-medium'>{t('hero.viewOnGitHub')}</span>
									<ArrowRight className='h-4 w-4 sm:h-5 sm:w-5' />
								</Button>
							</Link>
						</div>

						{/* Stats section - mobile optimized */}
						<div className='grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-4 md:gap-6 mt-12 sm:mt-16 md:mt-20 max-w-4xl mx-auto px-4'>
							{[
								{
									number: `${widgets.length}+`,
									label: t('hero.stats.toolsAvailable')
								},
								{ number: '2.5K+', label: t('hero.stats.happyUsers') },
								{ number: '99.9%', label: t('hero.stats.uptime') },
								{ number: '0$', label: t('hero.stats.alwaysFree') }
							].map((stat, idx) => (
								<div
									key={idx}
									className='text-center p-4 sm:p-5 md:p-6 rounded-xl sm:rounded-2xl bg-background/40 backdrop-blur-sm border border-border/30 hover:border-primary/30 transition-all duration-300 group'
								>
									<div className='text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-heading font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent mb-1 sm:mb-2 group-hover:scale-110 transition-transform'>
										{stat.number}
									</div>
									<div className='text-xs sm:text-sm text-muted-foreground font-medium'>
										{stat.label}
									</div>
								</div>
							))}
						</div>
					</div>
				</section>

				{/* Why Choose PixelTool Section */}
				<section className='relative px-4 py-24 sm:py-32 md:py-40 sm:px-6 lg:px-8 overflow-hidden'>
					{/* Background Effects - mobile optimized */}
					<div className='absolute inset-0 bg-gradient-to-b from-transparent via-primary/5 to-transparent' />
					<div className='absolute left-0 top-1/2 -translate-y-1/2 w-48 h-48 sm:w-96 sm:h-96 bg-gradient-to-r from-primary/10 to-transparent rounded-full blur-2xl sm:blur-3xl' />
					<div className='absolute right-0 top-1/2 -translate-y-1/2 w-48 h-48 sm:w-96 sm:h-96 bg-gradient-to-l from-accent/10 to-transparent rounded-full blur-2xl sm:blur-3xl' />

					<div className='relative mx-auto max-w-7xl'>
						{/* Section Header - mobile optimized */}
						<div className='text-center mb-12 sm:mb-20'>
							<div className='inline-flex items-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2 rounded-full bg-primary/10 border border-primary/20 mb-4 sm:mb-6'>
								<Sparkles className='w-3 h-3 sm:w-4 sm:h-4 text-primary' />
								<span className='text-xs sm:text-sm font-medium text-primary'>
									{t('whyChoose.trustedBy')}
								</span>
							</div>
							<h2 className='text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-heading font-bold mb-4 sm:mb-6 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent'>
								{t('whyChoose.title')}
							</h2>
							<p className='text-base sm:text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto px-4'>
								{t('whyChoose.subtitle')}
							</p>
						</div>

						{/* Features Grid - mobile optimized */}
						<div className='grid md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 mb-12 sm:mb-20'>
							{/* Feature 1 */}
							<div className='group relative'>
								<div className='absolute inset-0 bg-gradient-to-r from-primary/20 via-primary/10 to-transparent rounded-2xl sm:rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500' />
								<div className='relative h-full p-6 sm:p-8 rounded-2xl sm:rounded-3xl bg-background/60 backdrop-blur-sm border border-border/50 hover:border-primary/30 transition-all duration-300'>
									<div className='w-12 h-12 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl bg-gradient-to-r from-primary to-primary/80 flex items-center justify-center mb-4 sm:mb-6'>
										<Zap className='w-6 h-6 sm:w-7 sm:h-7 text-white' />
									</div>
									<h3 className='text-xl sm:text-2xl font-heading font-bold mb-3 sm:mb-4'>
										{t('whyChoose.feature1.title')}
									</h3>
									<p className='text-sm sm:text-base text-muted-foreground mb-4 sm:mb-6'>
										{t('whyChoose.feature1.description')}
									</p>
									<div className='flex flex-col sm:flex-row gap-3 sm:gap-4'>
										<div className='flex items-center gap-2'>
											<div className='w-2 h-2 rounded-full bg-green-500 flex-shrink-0' />
											<span className='text-xs sm:text-sm text-muted-foreground'>
												{t('whyChoose.feature1.point1')}
											</span>
										</div>
										<div className='flex items-center gap-2'>
											<div className='w-2 h-2 rounded-full bg-green-500 flex-shrink-0' />
											<span className='text-xs sm:text-sm text-muted-foreground'>
												{t('whyChoose.feature1.point2')}
											</span>
										</div>
									</div>
								</div>
							</div>

							{/* Feature 2 */}
							<div className='group relative'>
								<div className='absolute inset-0 bg-gradient-to-r from-accent/20 via-accent/10 to-transparent rounded-2xl sm:rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500' />
								<div className='relative h-full p-6 sm:p-8 rounded-2xl sm:rounded-3xl bg-background/60 backdrop-blur-sm border border-border/50 hover:border-accent/30 transition-all duration-300'>
									<div className='w-12 h-12 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl bg-gradient-to-r from-accent to-accent/80 flex items-center justify-center mb-4 sm:mb-6'>
										<Globe className='w-6 h-6 sm:w-7 sm:h-7 text-white' />
									</div>
									<h3 className='text-xl sm:text-2xl font-heading font-bold mb-3 sm:mb-4'>
										{t('whyChoose.feature2.title')}
									</h3>
									<p className='text-sm sm:text-base text-muted-foreground mb-4 sm:mb-6'>
										{t('whyChoose.feature2.description')}
									</p>
									<div className='flex flex-col sm:flex-row gap-3 sm:gap-4'>
										<div className='flex items-center gap-2'>
											<div className='w-2 h-2 rounded-full bg-green-500 flex-shrink-0' />
											<span className='text-xs sm:text-sm text-muted-foreground'>
												{t('whyChoose.feature2.point1')}
											</span>
										</div>
										<div className='flex items-center gap-2'>
											<div className='w-2 h-2 rounded-full bg-green-500 flex-shrink-0' />
											<span className='text-xs sm:text-sm text-muted-foreground'>
												{t('whyChoose.feature2.point2')}
											</span>
										</div>
									</div>
								</div>
							</div>

							{/* Feature 3 */}
							<div className='group relative'>
								<div className='absolute inset-0 bg-gradient-to-r from-green-500/20 via-green-500/10 to-transparent rounded-2xl sm:rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500' />
								<div className='relative h-full p-6 sm:p-8 rounded-2xl sm:rounded-3xl bg-background/60 backdrop-blur-sm border border-border/50 hover:border-green-500/30 transition-all duration-300'>
									<div className='w-12 h-12 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl bg-gradient-to-r from-green-500 to-green-500/80 flex items-center justify-center mb-4 sm:mb-6'>
										<Terminal className='w-6 h-6 sm:w-7 sm:h-7 text-white' />
									</div>
									<h3 className='text-xl sm:text-2xl font-heading font-bold mb-3 sm:mb-4'>
										{t('whyChoose.feature3.title')}
									</h3>
									<p className='text-sm sm:text-base text-muted-foreground mb-4 sm:mb-6'>
										{t('whyChoose.feature3.description')}
									</p>
									<div className='flex flex-col sm:flex-row gap-3 sm:gap-4'>
										<div className='flex items-center gap-2'>
											<div className='w-2 h-2 rounded-full bg-green-500 flex-shrink-0' />
											<span className='text-xs sm:text-sm text-muted-foreground'>
												{t('whyChoose.feature3.point1')}
											</span>
										</div>
										<div className='flex items-center gap-2'>
											<div className='w-2 h-2 rounded-full bg-green-500 flex-shrink-0' />
											<span className='text-xs sm:text-sm text-muted-foreground'>
												{t('whyChoose.feature3.point2')}
											</span>
										</div>
									</div>
								</div>
							</div>
						</div>

						{/* Trust Indicators - mobile optimized */}
						<div className='relative'>
							<div className='absolute inset-0 bg-gradient-to-r from-primary/5 via-accent/5 to-primary/5 rounded-2xl sm:rounded-3xl' />
							<div className='relative p-6 sm:p-8 md:p-12 rounded-2xl sm:rounded-3xl backdrop-blur-sm'>
								<div className='grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 md:gap-8'>
									<div className='text-center'>
										<div className='text-3xl sm:text-4xl md:text-5xl font-heading font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent mb-1 sm:mb-2'>
											2.5K+
										</div>
										<div className='text-xs sm:text-sm text-muted-foreground'>
											{t('whyChoose.stats.activeUsers')}
										</div>
									</div>
									<div className='text-center'>
										<div className='text-3xl sm:text-4xl md:text-5xl font-heading font-bold bg-gradient-to-r from-accent to-green-500 bg-clip-text text-transparent mb-1 sm:mb-2'>
											50K+
										</div>
										<div className='text-xs sm:text-sm text-muted-foreground'>
											{t('whyChoose.stats.monthlyUsage')}
										</div>
									</div>
									<div className='text-center'>
										<div className='text-3xl sm:text-4xl md:text-5xl font-heading font-bold bg-gradient-to-r from-green-500 to-blue-500 bg-clip-text text-transparent mb-1 sm:mb-2'>
											15+
										</div>
										<div className='text-xs sm:text-sm text-muted-foreground'>
											{t('whyChoose.stats.countries')}
										</div>
									</div>
									<div className='text-center'>
										<div className='text-3xl sm:text-4xl md:text-5xl font-heading font-bold bg-gradient-to-r from-blue-500 to-primary bg-clip-text text-transparent mb-1 sm:mb-2'>
											24/7
										</div>
										<div className='text-xs sm:text-sm text-muted-foreground'>
											Доступность сервиса
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</section>

				{/* Widgets Carousel Section */}
				<SectionWidgetsCarousel />
			</main>
		</>
	)
}
