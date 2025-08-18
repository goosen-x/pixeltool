import localFont from 'next/font/local'

// Using local variable fonts
export const interFont = localFont({
	src: '../../public/fonts/Inter-VariableFont_opsz,wght.ttf',
	variable: '--font-inter',
	display: 'swap'
})

export const openSansFont = localFont({
	src: '../../public/fonts/OpenSans-VariableFont_wdth,wght.ttf',
	variable: '--font-open-sans',
	display: 'swap'
})
