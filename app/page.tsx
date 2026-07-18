import Link from 'next/link'
import {
	ArrowRight,
	Zap,
	Globe,
	Sparkles,
	Terminal,
	Dices,
	QrCode,
	Type
} from 'lucide-react'
import { HomePageTracker } from '@/components/analytics/HomePageTracker'
import { SectionWidgetsCarousel } from '@/components/homepage/SectionWidgetsCarousel'
import { HeroSection } from '@/components/homepage/HeroSection'
import { widgets, widgetCategories } from '@/lib/constants/widgets'
import { Metadata } from 'next'

interface Props {
	params: Promise<{ locale: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
	// const { locale } = await params // Not needed for Russian-only

	// Термы и порядок — из docs/seo/wordstat.md, секция «Главная» (снято 17.07.2026).
	// Ведём случайными числами (507k/мес) и эмодзи (541k), а не QR (41k): раньше
	// заголовок обещал «все онлайн-калькуляторы» под спрос в 2,3 млн, которого мы
	// не обслуживаем ни одним тулом — это обещание уводило людей в отказ.
	// keywords не задаём: поисковики игнорируют его с середины нулевых.
	const metadata = {
		// 69 символов — влезает в срез Яндекса (~70). «Бесплатно» несёт description.
		title: `Случайное число, QR-код, пароль, эмодзи — ${widgets.length} инструментов | PixelTool`,
		// 142 символа — влезает в срез (~160). Три опоры бренда в конце: бесплатно,
		// без установки и регистрации, прямо в браузере.
		description: `${widgets.length} бесплатных онлайн-инструментов: случайные числа, QR-коды, пароли, эмодзи, работа с текстом. Без установки и регистрации — прямо в браузере.`
	}

	return {
		title: metadata.title,
		description: metadata.description,
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
				<HeroSection />

				{/* Why Choose PixelTool Section */}
				<section className='relative px-4 py-12 sm:py-16 md:py-20 sm:px-6 lg:px-8 overflow-hidden'>
					{/* Background Effects - mobile optimized */}
					<div className='absolute inset-0 bg-gradient-to-b from-transparent via-primary/5 to-transparent' />
					<div className='absolute left-0 top-1/2 -translate-y-1/2 w-48 h-48 sm:w-96 sm:h-96 bg-gradient-to-r from-primary/10 to-transparent rounded-full blur-2xl sm:blur-3xl' />
					<div className='absolute right-0 top-1/2 -translate-y-1/2 w-48 h-48 sm:w-96 sm:h-96 bg-gradient-to-l from-accent/10 to-transparent rounded-full blur-2xl sm:blur-3xl' />

					<div
						aria-hidden='true'
						className='pointer-events-none absolute -inset-16 hidden md:block'
						style={{
							backdropFilter: 'blur(10px)',
							WebkitBackdropFilter: 'blur(10px)',
							maskImage:
								'linear-gradient(to right, transparent 0%, black 25%, black 75%, transparent 100%), linear-gradient(to bottom, transparent 0%, black 25%, black 75%, transparent 100%)',
							WebkitMaskImage:
								'linear-gradient(to right, transparent 0%, black 25%, black 75%, transparent 100%), linear-gradient(to bottom, transparent 0%, black 25%, black 75%, transparent 100%)',
							maskComposite: 'intersect',
							WebkitMaskComposite: 'source-in'
						}}
					></div>
					<div className='relative mx-auto max-w-7xl'>
						{/* Section Header - mobile optimized */}
						<div className='text-center mb-12 sm:mb-20'>
							<div className='inline-flex items-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2 rounded-full bg-primary/10 border border-primary/20 mb-4 sm:mb-6'>
								<Sparkles className='w-3 h-3 sm:w-4 sm:h-4 text-primary' />
								<span className='text-xs sm:text-sm font-medium text-primary'>
									Без установки и регистрации
								</span>
							</div>
							<h2 className='text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-heading font-bold mb-4 sm:mb-6'>
								Почему выбирают PixelTool?
							</h2>
							<p className='text-base sm:text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto px-4'>
								Не надо искать отдельный сайт под каждую мелочь и продираться
								через рекламу. Всё нужное — под рукой и работает сразу.
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
									<h3 className='text-xl sm:text-2xl font-heading font-bold mb-3 sm:mb-4'>
										Молниеносная скорость
									</h3>
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
									<h3 className='text-xl sm:text-2xl font-heading font-bold mb-3 sm:mb-4'>
										100% Бесплатно
									</h3>
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
									<h3 className='text-xl sm:text-2xl font-heading font-bold mb-3 sm:mb-4'>
										{widgets.length} инструментов
									</h3>
									<p className='text-sm sm:text-base text-muted-foreground mb-4 sm:mb-6'>
										От QR-кодов и генератора паролей до CSS-инструментов и
										работы с текстом — всё нужное под рукой.
									</p>
									<div className='flex flex-col sm:flex-row gap-3 sm:gap-4'>
										<div className='flex items-center gap-2'>
											<div className='w-2 h-2 rounded-full bg-green-500 flex-shrink-0' />
											<span className='text-xs sm:text-sm text-muted-foreground'>
												{Object.keys(widgetCategories).length} категорий
											</span>
										</div>
										<div className='flex items-center gap-2'>
											<div className='w-2 h-2 rounded-full bg-green-500 flex-shrink-0' />
											<span className='text-xs sm:text-sm text-muted-foreground'>
												От бытовых до рабочих
											</span>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</section>

				{/* Популярные категории */}
				<section className='relative px-4 py-12 sm:py-16 md:py-20 sm:px-6 lg:px-8 bg-gradient-to-b from-muted/10 to-background'>
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
									Популярные категории
								</span>
							</div>
							<h2 className='text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-heading font-bold mb-4 sm:mb-6'>
								Что можно сделать на PixelTool?
							</h2>
							<p className='text-base sm:text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto px-4'>
								Сгенерировать QR-код или пароль, бросить кости, найти эмодзи,
								посчитать символы в тексте. Всё бесплатно, без регистрации и
								прямо в браузере.
							</p>
						</div>

						{/* Calculation Categories Grid */}
						<div className='grid md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 mb-12 sm:mb-16'>
							{/* Генераторы */}
							<div className='group relative'>
								<div className='absolute inset-0 bg-gradient-to-r from-green-500/20 via-green-500/10 to-transparent rounded-2xl sm:rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500' />
								<div className='relative h-full p-6 sm:p-8 rounded-2xl sm:rounded-3xl bg-background/60 backdrop-blur-sm border border-border/50 hover:border-green-500/30 transition-all duration-300'>
									<div className='w-12 h-12 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl bg-gradient-to-r from-green-500 to-green-500/80 flex items-center justify-center mb-4 sm:mb-6'>
										<Dices className='w-6 h-6 sm:w-7 sm:h-7 text-white' />
									</div>
									<h3 className='text-xl sm:text-2xl font-heading font-bold mb-3 sm:mb-4'>
										Генераторы и рандомайзеры
									</h3>
									<p className='text-sm sm:text-base text-muted-foreground mb-4 sm:mb-6'>
										Случайные числа, выбор команд и принятие решений
									</p>
									<div className='space-y-2'>
										{[
											'Генератор случайных чисел',
											'Подбрасывание монеты',
											'Бросок костей',
											'Жеребьёвка и рандомайзер команд'
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

							{/* Коды и безопасность */}
							<div className='group relative'>
								<div className='absolute inset-0 bg-gradient-to-r from-blue-500/20 via-blue-500/10 to-transparent rounded-2xl sm:rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500' />
								<div className='relative h-full p-6 sm:p-8 rounded-2xl sm:rounded-3xl bg-background/60 backdrop-blur-sm border border-border/50 hover:border-blue-500/30 transition-all duration-300'>
									<div className='w-12 h-12 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl bg-gradient-to-r from-blue-500 to-blue-500/80 flex items-center justify-center mb-4 sm:mb-6'>
										<QrCode className='w-6 h-6 sm:w-7 sm:h-7 text-white' />
									</div>
									<h3 className='text-xl sm:text-2xl font-heading font-bold mb-3 sm:mb-4'>
										Коды и безопасность
									</h3>
									<p className='text-sm sm:text-base text-muted-foreground mb-4 sm:mb-6'>
										QR-коды, пароли и кодирование данных
									</p>
									<div className='space-y-2'>
										{[
											'Генератор QR-кодов',
											'Генератор паролей',
											'Base64 кодировщик',
											'Генератор UUID'
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

							{/* Текст и символы */}
							<div className='group relative'>
								<div className='absolute inset-0 bg-gradient-to-r from-purple-500/20 via-purple-500/10 to-transparent rounded-2xl sm:rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500' />
								<div className='relative h-full p-6 sm:p-8 rounded-2xl sm:rounded-3xl bg-background/60 backdrop-blur-sm border border-border/50 hover:border-purple-500/30 transition-all duration-300'>
									<div className='w-12 h-12 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl bg-gradient-to-r from-purple-500 to-purple-500/80 flex items-center justify-center mb-4 sm:mb-6'>
										<Type className='w-6 h-6 sm:w-7 sm:h-7 text-white' />
									</div>
									<h3 className='text-xl sm:text-2xl font-heading font-bold mb-3 sm:mb-4'>
										Текст и символы
									</h3>
									<p className='text-sm sm:text-base text-muted-foreground mb-4 sm:mb-6'>
										Эмодзи, спецсимволы и работа с текстом
									</p>
									<div className='space-y-2'>
										{[
											'Список эмодзи',
											'Специальные символы',
											'Счётчик текста',
											'Сравнение текстов'
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
									<span>Открыть все инструменты</span>
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
