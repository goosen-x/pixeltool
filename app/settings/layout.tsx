import { Metadata } from 'next'

export const metadata: Metadata = {
	title: 'Настройки | PixelTool',
	description: 'Настройте внешний вид и поведение приложения PixelTool под ваши предпочтения. Выбор темы оформления.',
	keywords: 'настройки, тема, оформление, персонализация, предпочтения',
	openGraph: {
		title: 'Настройки | PixelTool',
		description: 'Настройте внешний вид и поведение приложения PixelTool под ваши предпочтения.',
		url: 'https://pixeltool.ru/settings',
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