import { Metadata } from 'next'

export const metadata: Metadata = {
	title: 'Настройки',
	description:
		'Настройте внешний вид и поведение приложения PixelTool под ваши предпочтения. Выбор темы оформления.',
	keywords: 'настройки, тема, оформление, персонализация, предпочтения',
	// Утилитарная страница настроек — нет SEO-ценности, закрываем от индексации
	robots: { index: false, follow: true },
	alternates: { canonical: '/settings' },
	openGraph: {
		title: 'Настройки',
		description:
			'Настройте внешний вид и поведение приложения PixelTool под ваши предпочтения.',
		url: 'https://pixeltool.pro/settings',
		siteName: 'PixelTool',
		type: 'website'
	}
}

export default function SettingsLayout({
	children
}: {
	children: React.ReactNode
}) {
	return children
}
