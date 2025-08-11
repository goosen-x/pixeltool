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

// todo add metadata

export const metadata: Metadata = {
	title: 'Web Developer Borisenko Dmitry',
	description:
		'Projects and experience in web development: building modern applications using Next.js, Strapi, PostgreSQL, and other technologies.'
}

// todo http://localhost:3000/rufd (not found)

export default async function RootLayout({
	children,
	params
}: Readonly<{
	children: ReactNode
	params: Promise<{ locale: string }>
}>) {
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
