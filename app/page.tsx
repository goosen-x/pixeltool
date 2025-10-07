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
// import { HomePageStructuredData } from '@/components/seo/HomePageStructuredData' // Removed due to script rendering issue
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
	// const { locale } = await params // Not needed for Russian-only

	const metadata = {
		title: `Рассчитать и Посчитать Онлайн - ${widgets.length}+ Калькуляторов`,
		description: `Рассчитайте и посчитайте всё онлайн бесплатно! Калькуляторы процентов, ИМТ, валют. CSS генераторы, конвертеры. 100% бесплатно.`,
		keywords:
			'рассчитать онлайн, посчитать онлайн, калькулятор онлайн бесплатно, инструменты разработчика, онлайн калькуляторы, CSS генератор, конвертер цветов, форматировщик кода, веб разработка, бесплатные инструменты'
	}

	return {
		title: metadata.title,
		description: metadata.description,
		keywords: metadata.keywords,
		openGraph: {
			url: 'https://pixeltool.pro',
			type: 'website',
			title: metadata.title,
			description: metadata.description,
			images: [
				{
					url: 'https://pixeltool.pro/og-image.png',
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
			images: ['https://pixeltool.pro/og-image.png']
		},
		alternates: {
			canonical: 'https://pixeltool.pro'
		},
		other: {
			'application-ld+json': JSON.stringify({
				'@context': 'https://schema.org',
				'@type': 'WebApplication',
				name: 'PixelTool',
				alternateName: 'PixelTool Developer Tools',
				url: 'https://pixeltool.pro',
				description: metadata.description,
				applicationCategory: 'DeveloperApplication',
				operatingSystem: 'All',
				offers: {
					'@type': 'Offer',
					price: '0',
					priceCurrency: 'USD'
				}
			})
		}
	}
}

export default async function HomePage({ params }: Props) {
	const { locale } = await params

	return (
		<>
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
							<div className='inline-flex items-center gap-2 sm:gap-3 px-3 sm:px-5 py-2 sm:py-3 rounded-full bg-gradient-to-r from-primary/15 to-accent/15 border border-primary/30 backdrop-blur-sm shadow-lg'>
								<span className='text-xs sm:text-sm font-medium text-primary'>
									Бесплатно
								</span>
								<DollarSign className='w-3 h-3 sm:w-4 sm:h-4 text-primary' />
							</div>
						</div>

						{/* Main Title with ripple animation */}
						<div className='mb-8 sm:mb-12 flex flex-col sm:flex-row justify-center items-center gap-4 sm:gap-8'>
							<RippleLoader className='opacity-80 flex-shrink-0 scale-75 sm:scale-100' />
							<p className='text-6xl sm:text-7xl md:text-8xl lg:text-[11rem] font-heading font-black tracking-tight leading-none bg-gradient-to-br from-foreground via-foreground to-foreground/80 bg-clip-text text-transparent animate-gradient bg-300%'>
								PixelTool
							</p>
						</div>

						{/* Enhanced subtitle */}
						<div className='mx-auto mb-8 sm:mb-10 max-w-4xl px-4'>
							<h1 className='text-xl sm:text-2xl md:text-3xl lg:text-4xl text-foreground/90 font-light mb-4 sm:mb-6 leading-relaxed'>
								Мощные онлайн-инструменты для разработчиков и дизайнеров без
								установки
							</h1>
							<p className='text-base sm:text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed'>
								Профессиональные инструменты для разработчиков, дизайнеров. Всё
								что нужно, прямо в браузере
							</p>
						</div>

						{/* Enhanced feature badges - mobile optimized grid */}
						<div className='grid grid-cols-2 sm:flex sm:flex-wrap gap-2 sm:gap-4 justify-center mb-8 sm:mb-12 px-2'>
							{[
								{
									icon: Sparkles,
									label: `${widgets.length}+ Профессиональных Инструментов`,
									color: 'from-primary to-accent'
								},
								{
									icon: Zap,
									label: 'Установка Не Требуется',
									color: 'from-yellow-500 to-orange-500'
								},
								{
									icon: Globe,
									label: '100% Бесплатно Навсегда',
									color: 'from-green-500 to-emerald-500'
								},
								{
									icon: Zap,
									label: 'Молниеносно Быстро',
									color: 'from-blue-500 to-cyan-500'
								}
							].map((item, idx) => (
								<div
									key={idx}
									className='group px-2.5 py-2 sm:px-6 sm:py-3 rounded-lg sm:rounded-2xl bg-background/60 backdrop-blur-sm border border-border/50 min-h-[60px] flex items-center'
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
							<Link
								href='/tools'
								className='group inline-flex items-center justify-center gap-2 sm:gap-3 text-base sm:text-xl px-8 sm:px-12 h-14 sm:h-16 rounded-xl sm:rounded-2xl bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 shadow-xl sm:shadow-2xl hover:shadow-primary/30 transition-all duration-300 hover:scale-105 w-full sm:w-auto relative overflow-hidden font-semibold text-white'
							>
								<div className='absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300' />
								<Terminal className='h-5 w-5 sm:h-6 sm:w-6 group-hover:rotate-12 transition-transform z-10' />
								<span className='z-10'>Исследовать инструменты</span>
								<ArrowRight className='h-4 w-4 sm:h-5 sm:w-5 group-hover:translate-x-1 transition-transform z-10' />
							</Link>
							<Link
								href='https://github.com/goosen-x/pixeltool'
								target='_blank'
								className='group inline-flex items-center justify-center gap-2 sm:gap-3 text-base sm:text-xl px-8 sm:px-12 h-14 sm:h-16 rounded-xl sm:rounded-2xl bg-background/95 backdrop-blur-sm border-2 border-border hover:border-primary hover:bg-primary/5 dark:hover:bg-primary/10 hover:text-primary transition-all duration-300 w-full sm:w-auto font-medium'
							>
								<Code2 className='h-5 w-5 sm:h-6 sm:w-6' />
								<span>Открыть в GitHub</span>
								<ArrowRight className='h-4 w-4 sm:h-5 sm:w-5' />
							</Link>
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
									Доверяют разработчики
								</span>
							</div>
							<h2 className='text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-heading font-bold mb-4 sm:mb-6 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent'>
								Почему выбирают PixelTool?
							</h2>
							<p className='text-base sm:text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto px-4'>
								Мы создали платформу, которая экономит время разработчиков и
								дизайнеров, предоставляя все необходимые инструменты в одном
								месте
							</p>
						</div>

						{/* Features Grid - mobile optimized */}
						<div className='grid md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 mb-12 sm:mb-20'>
							{/* Feature 1 */}
							<div className='group relative'>
								<div className='absolute inset-0 bg-gradient-to-r from-primary/20 via-primary/10 to-transparent rounded-2xl sm:rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500' />
								<div className='relative min-h-full p-6 sm:p-8 rounded-2xl sm:rounded-3xl bg-background/60 backdrop-blur-sm border border-border/50 hover:border-primary/30 transition-all duration-300'>
									<div className='w-12 h-12 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl bg-gradient-to-r from-primary to-primary/80 flex items-center justify-center mb-4 sm:mb-6'>
										<Zap className='w-6 h-6 sm:w-7 sm:h-7 text-white' />
									</div>
									<p className='text-xl sm:text-2xl font-heading font-bold mb-3 sm:mb-4'>
										Молниеносная скорость
									</p>
									<p className='text-sm sm:text-base text-muted-foreground mb-4 sm:mb-6'>
										Все инструменты работают прямо в браузере без задержек.
										Никаких загрузок, установок или ожидания.
									</p>
									<div className='flex flex-col sm:flex-row gap-3 sm:gap-4'>
										<div className='flex items-center gap-2'>
											<div className='w-2 h-2 rounded-full bg-green-500 flex-shrink-0' />
											<span className='text-xs sm:text-sm text-muted-foreground'>
												0ms задержка
											</span>
										</div>
										<div className='flex items-center gap-2'>
											<div className='w-2 h-2 rounded-full bg-green-500 flex-shrink-0' />
											<span className='text-xs sm:text-sm text-muted-foreground'>
												Офлайн режим
											</span>
										</div>
									</div>
								</div>
							</div>

							{/* Feature 2 */}
							<div className='group relative'>
								<div className='absolute inset-0 bg-gradient-to-r from-accent/20 via-accent/10 to-transparent rounded-2xl sm:rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500' />
								<div className='relative min-h-full p-6 sm:p-8 rounded-2xl sm:rounded-3xl bg-background/60 backdrop-blur-sm border border-border/50 hover:border-accent/30 transition-all duration-300'>
									<div className='w-12 h-12 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl bg-gradient-to-r from-accent to-accent/80 flex items-center justify-center mb-4 sm:mb-6'>
										<Globe className='w-6 h-6 sm:w-7 sm:h-7 text-white' />
									</div>
									<p className='text-xl sm:text-2xl font-heading font-bold mb-3 sm:mb-4'>
										100% Бесплатно
									</p>
									<p className='text-sm sm:text-base text-muted-foreground mb-4 sm:mb-6'>
										Никаких скрытых платежей, подписок или ограничений. Все
										инструменты доступны бесплатно навсегда.
									</p>
									<div className='flex flex-col sm:flex-row gap-3 sm:gap-4'>
										<div className='flex items-center gap-2'>
											<div className='w-2 h-2 rounded-full bg-green-500 flex-shrink-0' />
											<span className='text-xs sm:text-sm text-muted-foreground'>
												Без регистрации
											</span>
										</div>
										<div className='flex items-center gap-2'>
											<div className='w-2 h-2 rounded-full bg-green-500 flex-shrink-0' />
											<span className='text-xs sm:text-sm text-muted-foreground'>
												Без лимитов
											</span>
										</div>
									</div>
								</div>
							</div>

							{/* Feature 3 */}
							<div className='group relative'>
								<div className='absolute inset-0 bg-gradient-to-r from-green-500/20 via-green-500/10 to-transparent rounded-2xl sm:rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500' />
								<div className='relative min-h-full p-6 sm:p-8 rounded-2xl sm:rounded-3xl bg-background/60 backdrop-blur-sm border border-border/50 hover:border-green-500/30 transition-all duration-300'>
									<div className='w-12 h-12 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl bg-gradient-to-r from-green-500 to-green-500/80 flex items-center justify-center mb-4 sm:mb-6'>
										<Terminal className='w-6 h-6 sm:w-7 sm:h-7 text-white' />
									</div>
									<p className='text-xl sm:text-2xl font-heading font-bold mb-3 sm:mb-4'>
										50+ Инструментов
									</p>
									<p className='text-sm sm:text-base text-muted-foreground mb-4 sm:mb-6'>
										От CSS генераторов до конвертеров изображений - всё что
										нужно современному разработчику.
									</p>
									<div className='flex flex-col sm:flex-row gap-3 sm:gap-4'>
										<div className='flex items-center gap-2'>
											<div className='w-2 h-2 rounded-full bg-green-500 flex-shrink-0' />
											<span className='text-xs sm:text-sm text-muted-foreground'>
												Новые каждую неделю
											</span>
										</div>
										<div className='flex items-center gap-2'>
											<div className='w-2 h-2 rounded-full bg-green-500 flex-shrink-0' />
											<span className='text-xs sm:text-sm text-muted-foreground'>
												Open Source
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
											Довольных разработчиков
										</div>
									</div>
									<div className='text-center'>
										<div className='text-3xl sm:text-4xl md:text-5xl font-heading font-bold bg-gradient-to-r from-accent to-green-500 bg-clip-text text-transparent mb-1 sm:mb-2'>
											50K+
										</div>
										<div className='text-xs sm:text-sm text-muted-foreground'>
											Задач выполнено
										</div>
									</div>
									<div className='text-center'>
										<div className='text-3xl sm:text-4xl md:text-5xl font-heading font-bold bg-gradient-to-r from-green-500 to-blue-500 bg-clip-text text-transparent mb-1 sm:mb-2'>
											15+
										</div>
										<div className='text-xs sm:text-sm text-muted-foreground'>
											Стран охвачено
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

				{/* What Can You Calculate Section */}
				<section className='relative px-4 py-16 sm:py-24 md:py-32 sm:px-6 lg:px-8 bg-gradient-to-b from-muted/10 to-background'>
					{/* Background decoration */}
					<div className='absolute inset-0 -z-10'>
						<div className='absolute top-10 left-10 w-32 h-32 sm:w-64 sm:h-64 bg-gradient-to-br from-primary/10 to-accent/10 rounded-full blur-2xl opacity-60' />
						<div className='absolute bottom-10 right-10 w-32 h-32 sm:w-64 sm:h-64 bg-gradient-to-br from-accent/10 to-primary/10 rounded-full blur-2xl opacity-60' />
					</div>

					<div className='relative mx-auto max-w-7xl'>
						{/* Section Header */}
						<div className='text-center mb-12 sm:mb-16 md:mb-20'>
							<div className='inline-flex items-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2 rounded-full bg-primary/10 border border-primary/20 mb-4 sm:mb-6'>
								<Sparkles className='w-3 h-3 sm:w-4 sm:h-4 text-primary' />
								<span className='text-xs sm:text-sm font-medium text-primary'>
									Калькуляторы и счетчики
								</span>
							</div>
							<h2 className='text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-heading font-bold mb-4 sm:mb-6 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent'>
								Что можно рассчитать и посчитать?
							</h2>
							<p className='text-base sm:text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto px-4'>
								Мощные онлайн калькуляторы для расчёта финансов, математических
								вычислений и конвертации единиц измерения. Всё бесплатно и без
								регистрации.
							</p>
						</div>

						{/* Calculation Categories Grid */}
						<div className='grid md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 mb-12 sm:mb-16'>
							{/* Financial Calculations */}
							<div className='group relative'>
								<div className='absolute inset-0 bg-gradient-to-r from-green-500/20 via-green-500/10 to-transparent rounded-2xl sm:rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500' />
								<div className='relative h-full p-6 sm:p-8 rounded-2xl sm:rounded-3xl bg-background/60 backdrop-blur-sm border border-border/50 hover:border-green-500/30 transition-all duration-300'>
									<div className='w-12 h-12 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl bg-gradient-to-r from-green-500 to-green-500/80 flex items-center justify-center mb-4 sm:mb-6'>
										<DollarSign className='w-6 h-6 sm:w-7 sm:h-7 text-white' />
									</div>
									<h3 className='text-xl sm:text-2xl font-heading font-bold mb-3 sm:mb-4'>
										Финансовые расчёты
									</h3>
									<p className='text-sm sm:text-base text-muted-foreground mb-4 sm:mb-6'>
										Рассчитайте проценты, скидки, курсы валют и многое другое
									</p>
									<div className='space-y-2'>
										{[
											'Посчитать проценты от суммы',
											'Рассчитать скидки и наценки',
											'Конвертация валют',
											'Калькулятор НДС и налогов'
										].map((item: string, idx: number) => (
											<div
												key={idx}
												className='flex items-center gap-2 text-xs sm:text-sm text-muted-foreground'
											>
												<div className='w-1.5 h-1.5 rounded-full bg-green-500 flex-shrink-0' />
												<span>{item}</span>
											</div>
										))}
									</div>
								</div>
							</div>

							{/* Mathematical Calculations */}
							<div className='group relative'>
								<div className='absolute inset-0 bg-gradient-to-r from-blue-500/20 via-blue-500/10 to-transparent rounded-2xl sm:rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500' />
								<div className='relative h-full p-6 sm:p-8 rounded-2xl sm:rounded-3xl bg-background/60 backdrop-blur-sm border border-border/50 hover:border-blue-500/30 transition-all duration-300'>
									<div className='w-12 h-12 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl bg-gradient-to-r from-blue-500 to-blue-500/80 flex items-center justify-center mb-4 sm:mb-6'>
										<Terminal className='w-6 h-6 sm:w-7 sm:h-7 text-white' />
									</div>
									<h3 className='text-xl sm:text-2xl font-heading font-bold mb-3 sm:mb-4'>
										Математические вычисления
									</h3>
									<p className='text-sm sm:text-base text-muted-foreground mb-4 sm:mb-6'>
										От простых вычислений до сложных математических операций
									</p>
									<div className='space-y-2'>
										{[
											'Посчитать количество дней между датами',
											'Рассчитать площадь и объём',
											'Генератор случайных чисел',
											'Математические формулы и константы'
										].map((item: string, idx: number) => (
											<div
												key={idx}
												className='flex items-center gap-2 text-xs sm:text-sm text-muted-foreground'
											>
												<div className='w-1.5 h-1.5 rounded-full bg-blue-500 flex-shrink-0' />
												<span>{item}</span>
											</div>
										))}
									</div>
								</div>
							</div>

							{/* Unit Conversions */}
							<div className='group relative'>
								<div className='absolute inset-0 bg-gradient-to-r from-purple-500/20 via-purple-500/10 to-transparent rounded-2xl sm:rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500' />
								<div className='relative h-full p-6 sm:p-8 rounded-2xl sm:rounded-3xl bg-background/60 backdrop-blur-sm border border-border/50 hover:border-purple-500/30 transition-all duration-300'>
									<div className='w-12 h-12 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl bg-gradient-to-r from-purple-500 to-purple-500/80 flex items-center justify-center mb-4 sm:mb-6'>
										<Layers className='w-6 h-6 sm:w-7 sm:h-7 text-white' />
									</div>
									<h3 className='text-xl sm:text-2xl font-heading font-bold mb-3 sm:mb-4'>
										Конвертация единиц
									</h3>
									<p className='text-sm sm:text-base text-muted-foreground mb-4 sm:mb-6'>
										Лёгкое преобразование единиц измерения в любой системе
									</p>
									<div className='space-y-2'>
										{[
											'Перевод веса, длины, объёма',
											'Конвертация температуры',
											'Преобразование цветов',
											'Конвертер систем счисления'
										].map((item: string, idx: number) => (
											<div
												key={idx}
												className='flex items-center gap-2 text-xs sm:text-sm text-muted-foreground'
											>
												<div className='w-1.5 h-1.5 rounded-full bg-purple-500 flex-shrink-0' />
												<span>{item}</span>
											</div>
										))}
									</div>
								</div>
							</div>
						</div>

						{/* CTA Section */}
						<div className='text-center'>
							<div className='inline-flex items-center justify-center gap-3 px-8 sm:px-12 h-14 sm:h-16 rounded-xl sm:rounded-2xl bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 shadow-xl hover:shadow-primary/30 transition-all duration-300 hover:scale-105'>
								<Link
									href='/tools'
									className='flex items-center gap-3 text-base sm:text-xl font-semibold text-white'
								>
									<Terminal className='h-5 w-5 sm:h-6 sm:w-6' />
									<span>Начать считать</span>
									<ArrowRight className='h-4 w-4 sm:h-5 sm:w-5' />
								</Link>
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
