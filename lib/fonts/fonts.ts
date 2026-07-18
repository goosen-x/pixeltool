import { Anton, Inter, Onest, Open_Sans } from 'next/font/google'

// Using Google Fonts with next/font
export const interFont = Inter({
	subsets: ['latin', 'cyrillic'],
	variable: '--font-inter',
	display: 'swap'
})

export const openSansFont = Open_Sans({
	subsets: ['latin', 'cyrillic'],
	variable: '--font-open-sans',
	display: 'swap'
})

export const antonFont = Anton({
	weight: '400',
	subsets: ['latin'],
	variable: '--font-anton',
	display: 'swap'
})

// Шрифт заголовков. Кириллица родная (рисовалась вместе с латиницей, а не
// адаптировалась) — важно, потому что заголовки у нас русские. Подключается
// через --font-heading в globals.css.
export const onestFont = Onest({
	subsets: ['latin', 'cyrillic'],
	variable: '--font-onest',
	display: 'swap'
})
