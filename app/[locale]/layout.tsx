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
import { GlobalGoalsTracker } from '@/components/analytics/GlobalGoalsTracker'
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
				default: 'PixelTool - Free Developer Tools',
				template: '%s | PixelTool'
			},
			description:
				'Professional web developer tools: CSS generators, formatters, validators. Free & works offline.'
		},
		ru: {
			title: {
				default: 'PixelTool - Инструменты Разработчика',
				template: '%s | PixelTool'
			},
			description:
				'Профессиональные инструменты для веб-разработчиков: CSS генераторы, форматировщики. Бесплатно.'
		}
	}

	const currentMetadata =
		metadata[locale as keyof typeof metadata] || metadata.en
	// Жестко задаем URL для Open Graph, так как env переменные могут не работать корректно
	const siteUrl = 'https://pixeltool.pro'

	// Shorten title and description for OG tags
	const ogTitle = currentMetadata.title.default.slice(0, 60)
	const ogDescription = currentMetadata.description.slice(0, 160)

	return {
		metadataBase: new URL(siteUrl),
		title: {
			default: currentMetadata.title.default || 'PixelTool',
			template: currentMetadata.title.template || '%s | PixelTool'
		},
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
			title: ogTitle,
			description: ogDescription,
			siteName: 'PixelTool',
			images: [
				{
					url: `https://pixeltool.pro/api/og?title=${encodeURIComponent(ogTitle)}&description=${encodeURIComponent(ogDescription)}&locale=${locale}`,
					width: 1200,
					height: 630,
					alt: 'PixelTool - Professional Developer Tools',
					type: 'image/png'
				},
				{
					url: 'https://pixeltool.pro/og-image.png',
					width: 1024,
					height: 1024,
					alt: 'PixelTool - Online tools for developers',
					type: 'image/png'
				}
			]
		},
		twitter: {
			card: 'summary_large_image',
			title: ogTitle,
			description: ogDescription,
			images: [
				'https://pixeltool.pro/og-image.png',
				`https://pixeltool.pro/api/og?title=${encodeURIComponent(ogTitle)}&description=${encodeURIComponent(ogDescription)}&locale=${locale}`
			],
			creator: '@pixeltool',
			site: '@pixeltool'
		},
		other: {
			// VK
			'vk:image': 'https://pixeltool.pro/og-image.png',
			// Mobile indicators for Yandex
			'mobile-web-app-capable': 'yes',
			HandheldFriendly: 'true',
			MobileOptimized: '320'
		},
		icons: [
			{
				rel: 'icon',
				url: '/favicon.ico',
				sizes: '16x16',
				type: 'image/x-icon'
			},
			{
				rel: 'icon',
				url: '/favicon-16x16.ico',
				sizes: '16x16',
				type: 'image/x-icon'
			},
			{
				rel: 'icon',
				url: '/favicon-32x32.png',
				sizes: '32x32',
				type: 'image/png'
			},
			{
				rel: 'icon',
				url: '/favicon-48x48.png',
				sizes: '48x48',
				type: 'image/png'
			},
			{
				rel: 'apple-touch-icon',
				url: '/favicon-57x57.png',
				sizes: '57x57'
			},
			{
				rel: 'apple-touch-icon',
				url: '/favicon-76x76.png',
				sizes: '76x76'
			},
			{
				rel: 'apple-touch-icon',
				url: '/favicon-120x120.png',
				sizes: '120x120'
			},
			{
				rel: 'apple-touch-icon',
				url: '/favicon-152x152.png',
				sizes: '152x152'
			},
			{
				rel: 'apple-touch-icon',
				url: '/favicon-180x180.png',
				sizes: '180x180'
			},
			{
				rel: 'icon',
				url: '/favicon-192x192.png',
				sizes: '192x192',
				type: 'image/png'
			},
			{
				rel: 'icon',
				url: '/favicon-512x512.png',
				sizes: '512x512',
				type: 'image/png'
			}
		],
		alternates: {
			canonical: `${siteUrl}/${locale}`,
			languages: {
				en: `${siteUrl}/en`,
				ru: `${siteUrl}/ru`,
				'x-default': siteUrl
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
			yandex: 'b2796581b70a9cad'
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
	maximumScale: 5,
	viewportFit: 'cover'
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
			<head>
				{/* Yandex.RTB */}
				<script
					dangerouslySetInnerHTML={{
						__html: `window.yaContextCb=window.yaContextCb||[]`
					}}
				/>
				<script src='https://yandex.ru/ads/system/context.js' async />
			</head>
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
						<GlobalGoalsTracker />
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
