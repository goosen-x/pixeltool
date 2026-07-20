import { HomePageTracker } from '@/components/analytics/HomePageTracker'
import { SectionWidgetsCarousel } from '@/components/homepage/SectionWidgetsCarousel'
import { HeroSection } from '@/components/homepage/HeroSection'
import { WhyChooseSection } from '@/components/homepage/WhyChooseSection'
import { widgets } from '@/lib/constants/widgets'
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
		// 69 символов — влезает в срез Яндекса (~70).
		title: `Случайное число, QR-код, пароль, эмодзи — ${widgets.length} инструментов | PixelTool`,
		// 142 символа — влезает в срез (~160). «Бесплатных» не пишем безусловно:
		// часть инструментов и монетизация (реклама/платные тулы) планируются —
		// см. заметку пользователя от 2026-07-20.
		description: `${widgets.length} онлайн-инструментов: случайные числа, QR-коды, пароли, эмодзи, работа с текстом. Без установки и регистрации — прямо в браузере.`
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

				<WhyChooseSection />

				{/* Widgets Carousel Section */}
				<SectionWidgetsCarousel />
			</main>
		</>
	)
}
