import { Anton, Geist_Mono, Inter, Onest, Open_Sans } from 'next/font/google'

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

// Моноширинный. Раньше его не было вовсе: font-mono отдавался системному
// шрифту, то есть на macOS SF Mono, на Windows Consolas, на Android Droid Sans
// Mono — три разных начертания и ни одно не связано с типографикой сайта.
// Geist Mono взят под Inter: та же высота строчных, поэтому моно-текст в
// бейджах и ячейках садится вровень с обычным, а не выпрыгивает крупнее.
// Кириллица нужна — в моноширинном у нас идут русские плейсхолдеры и inline-код.
export const geistMonoFont = Geist_Mono({
	subsets: ['latin', 'cyrillic'],
	variable: '--font-geist-mono',
	display: 'swap'
})
