import type { Metadata } from 'next'
import type { ReactNode } from 'react'

// Инструмент не в реестре widgets — метаданные заданы явно.
const title = 'Форматирование текста для соцсетей'
const description =
	'Форматируйте посты для ВКонтакте, Telegram, Instagram и других соцсетей: жирный, курсив, зачёркнутый текст, эмодзи и спецсимволы. Онлайн, без установки.'
const url = 'https://pixeltool.pro/tools/social-media-formatter'

export const metadata: Metadata = {
	title,
	description,
	alternates: { canonical: url },
	openGraph: {
		title,
		description,
		url,
		siteName: 'PixelTool',
		locale: 'ru_RU',
		type: 'website'
	},
	twitter: { card: 'summary_large_image', title, description }
}

export default function ToolLayout({ children }: { children: ReactNode }) {
	return children
}
