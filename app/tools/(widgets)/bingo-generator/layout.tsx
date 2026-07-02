import type { Metadata } from 'next'
import type { ReactNode } from 'react'

// Инструмент не в реестре widgets — метаданные заданы явно.
const title = 'Генератор карточек бинго'
const description =
	'Создавайте карточки для игры в бинго онлайн: свои слова, размер сетки, перемешивание и печать. Бесплатно, без регистрации.'
const url = 'https://pixeltool.pro/tools/bingo-generator'

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
