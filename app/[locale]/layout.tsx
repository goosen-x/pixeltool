import '../globals.css'
import '@/lib/utils/suppress-warnings'
import { cn } from '@/lib/utils'
import type { Metadata } from 'next'
import { Footer } from '@/components/layout'
import { NextIntlClientProvider } from 'next-intl'
import { getMessages } from 'next-intl/server'
import { Inter, Open_Sans } from 'next/font/google'
import { notFound } from 'next/navigation'
import { routing } from '@/i18n/routing'
import { dev } from '@/lib/config/env'
import { ReactNode } from 'react'
import YandexMetrika from '@/components/analytics/YandexMetrika'
import { ScrollToTop } from '@/components/global/ScrollToTop'
import { Toaster } from '@/components/ui/sonner'
import { ThemeProvider } from '@/components/providers/theme-provider'

// Font configurations
const inter = Inter({ 
  subsets: ['latin', 'cyrillic'],
  variable: '--font-sans',
  display: 'swap',
})

const openSans = Open_Sans({ 
  subsets: ['latin', 'cyrillic'],
  variable: '--font-heading',
  display: 'swap',
  weight: ['400', '500', '600', '700', '800'],
})

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
			description: 'Professional web developer tools: CSS generators, color converters, formatters, validators, and 50+ more utilities. No installation required, 100% free.',
		},
		ru: {
			title: {
				default: 'PixelTool - Бесплатные Онлайн Инструменты для Разработчиков',
				template: '%s | PixelTool'
			},
			description: 'Профессиональные инструменты для веб-разработчиков: CSS генераторы, конвертеры цветов, форматировщики и 50+ утилит. Без установки, 100% бесплатно.',
		}
	}

	const currentMetadata = metadata[locale as keyof typeof metadata] || metadata.en
	const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://pixeltool.pro'

	return {
		metadataBase: new URL(siteUrl),
		title: currentMetadata.title,
		description: currentMetadata.description,
		keywords: locale === 'ru' 
			? ['онлайн инструменты', 'веб разработка', 'CSS генератор', 'конвертер цветов', 'форматировщик кода', 'бесплатные утилиты']
			: ['online tools', 'web development', 'CSS generator', 'color converter', 'code formatter', 'free utilities'],
		authors: [{ name: 'Dmitry Borisenko' }],
		creator: 'Dmitry Borisenko',
		openGraph: {
			type: 'website',
			locale: locale === 'ru' ? 'ru_RU' : 'en_US',
			url: siteUrl,
			title: currentMetadata.title.default,
			description: currentMetadata.description,
			siteName: 'PixelTool',
			images: [{
				url: '/og-image.png',
				width: 1200,
				height: 630,
				alt: 'PixelTool - Professional Developer Tools'
			}],
		},
		twitter: {
			card: 'summary_large_image',
			title: currentMetadata.title.default,
			description: currentMetadata.description,
			images: ['/og-image.png'],
			creator: '@pixeltool',
		},
		alternates: {
			canonical: siteUrl,
			languages: {
				'en': `${siteUrl}/en`,
				'ru': `${siteUrl}/ru`,
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
				'max-snippet': -1,
			},
		},
		verification: {
			google: process.env.NEXT_PUBLIC_GOOGLE_VERIFICATION,
			yandex: process.env.NEXT_PUBLIC_YANDEX_VERIFICATION,
		},
	}
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
				"scroll-smooth scroll-pt-24",
				inter.variable,
				openSans.variable
			)}
			suppressHydrationWarning
		>
			<NextIntlClientProvider messages={messages}>
				<body
					className={cn(
						'min-h-screen bg-background font-sans antialiased',
						inter.className
					)}
				>
					<ThemeProvider
						attribute="class"
						defaultTheme="system"
						enableSystem
					>
						<YandexMetrika />
						{children}
						<ScrollToTop />
						<Toaster />
					</ThemeProvider>
				</body>
			</NextIntlClientProvider>
		</html>
	)
}
