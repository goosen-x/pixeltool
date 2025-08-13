import '../globals.css'
import '@/lib/utils/suppress-warnings'
import { cn } from '@/lib/utils'
import type { Metadata } from 'next'
import { Footer } from '@/components/layout'
import { NextIntlClientProvider } from 'next-intl'
import { getMessages } from 'next-intl/server'
import { notFound } from 'next/navigation'
import { routing } from '@/i18n/routing'
import { dev } from '@/lib/config/env'
import { ReactNode } from 'react'
import YandexMetrika from '@/components/analytics/YandexMetrika'
import { ScrollToTop } from '@/components/global/ScrollToTop'
import { Toaster } from '@/components/ui/sonner'
import { ThemeProvider } from '@/components/providers/theme-provider'
import { ServiceWorkerRegistration } from '@/components/global/ServiceWorkerRegistration'
import { WebVitals } from '@/components/analytics/WebVitals'
import { NavigationProgress } from '@/components/ui/navigation-progress'
import { CookieConsent } from '@/components/global/CookieConsent'
import { interFont, openSansFont } from '@/lib/fonts/fonts'

interface Props {
	children: ReactNode
	params: Promise<{ locale: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
	const { locale } = await params

	const metadata = {
		en: {
			title: {
				default: 'PixelTool - Free Online Developer Tools & Utilities',
				template: '%s | PixelTool'
			},
			description:
				'Professional web developer tools: CSS generators, color converters, formatters, validators, and 50+ more utilities. No installation required, 100% free.'
		},
		ru: {
			title: {
				default: 'PixelTool - Бесплатные Онлайн Инструменты для Разработчиков',
				template: '%s | PixelTool'
			},
			description:
				'Профессиональные инструменты для веб-разработчиков: CSS генераторы, конвертеры цветов, форматировщики и 50+ утилит. Без установки, 100% бесплатно.'
		}
	}

	const currentMetadata =
		metadata[locale as keyof typeof metadata] || metadata.en
	const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://pixeltool.pro'

	return {
		metadataBase: new URL(siteUrl),
		title: currentMetadata.title,
		description: currentMetadata.description,
		keywords:
			locale === 'ru'
				? [
						'онлайн инструменты',
						'веб разработка',
						'CSS генератор',
						'конвертер цветов',
						'форматировщик кода',
						'бесплатные утилиты',
						'инструменты разработчика',
						'калькулятор CSS',
						'генератор паролей',
						'QR код генератор',
						'конвертер изображений',
						'парсер HTML',
						'минификатор кода'
					]
				: [
						'online tools',
						'web development',
						'CSS generator',
						'color converter',
						'code formatter',
						'free utilities',
						'developer tools',
						'CSS calculator',
						'password generator',
						'QR code generator',
						'image converter',
						'HTML parser',
						'code minifier'
					],
		authors: [
			{ name: 'Dmitry Borisenko', url: 'https://github.com/goosen-x/pixeltool' }
		],
		creator: 'Dmitry Borisenko',
		publisher: 'PixelTool',
		category: 'technology',
		openGraph: {
			type: 'website',
			locale: locale === 'ru' ? 'ru_RU' : 'en_US',
			url: siteUrl,
			title: currentMetadata.title.default,
			description: currentMetadata.description,
			siteName: 'PixelTool',
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
			title: currentMetadata.title.default,
			description: currentMetadata.description,
			images: ['/og-image.png'],
			creator: '@pixeltool'
		},
		alternates: {
			canonical: siteUrl,
			languages: {
				en: `${siteUrl}/en`,
				ru: `${siteUrl}/ru`
			}
		},
		robots: {
			index: true,
			follow: true,
			googleBot: {
				index: true,
				follow: true,
				'max-video-preview': -1,
				'max-image-preview': 'large',
				'max-snippet': -1
			}
		},
		verification: {
			google: process.env.NEXT_PUBLIC_GOOGLE_VERIFICATION,
			yandex: process.env.NEXT_PUBLIC_YANDEX_VERIFICATION
		},
		manifest: '/manifest.json',
		appleWebApp: {
			capable: true,
			statusBarStyle: 'default',
			title: 'PixelTool'
		},
		formatDetection: {
			telephone: false
		}
	}
}

export const viewport = {
	width: 'device-width',
	initialScale: 1,
	maximumScale: 5
}

export default async function RootLayout({
	children,
	params
}: Readonly<Props>) {
	const locale = (await params).locale
	if (!routing.locales.includes(locale as any)) notFound()
	const messages = await getMessages()

	if (!dev) console.log = () => undefined

	return (
		<html
			lang={locale}
			className={cn(
				'scroll-smooth scroll-pt-24',
				interFont.variable,
				openSansFont.variable
			)}
			suppressHydrationWarning
		>
			<NextIntlClientProvider messages={messages}>
				<body
					className={cn(
						'min-h-screen bg-background font-sans antialiased',
						interFont.className
					)}
				>
					<ThemeProvider attribute='class' defaultTheme='system' enableSystem>
						<NavigationProgress />
						<YandexMetrika />
						<ServiceWorkerRegistration />
						<WebVitals />
						{children}
						<ScrollToTop />
						<Toaster />
						<CookieConsent />
					</ThemeProvider>
				</body>
			</NextIntlClientProvider>
		</html>
	)
}
