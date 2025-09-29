import { Inter, Open_Sans } from 'next/font/google'

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
