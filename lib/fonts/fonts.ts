import localFont from 'next/font/local'

export const tekturFont = localFont({
	src: [
		{
			path: '../../public/fonts/Tektur-Regular.ttf',
			weight: '400',
			style: 'normal'
		},
		{
			path: '../../public/fonts/Tektur-Bold.ttf',
			weight: '700',
			style: 'normal'
		}
	]
})

export const interFont = localFont({
	src: [
		{
			path: '../../public/fonts/Inter-VariableFont_opsz,wght.ttf',
			weight: '100 900',
			style: 'normal'
		},
		{
			path: '../../public/fonts/Inter-Italic-VariableFont_opsz,wght.ttf',
			weight: '100 900',
			style: 'italic'
		}
	],
	variable: '--font-sans',
	display: 'swap',
	fallback: ['system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Arial', 'sans-serif']
})

export const openSansFont = localFont({
	src: [
		{
			path: '../../public/fonts/OpenSans-VariableFont_wdth,wght.ttf',
			weight: '300 800',
			style: 'normal'
		},
		{
			path: '../../public/fonts/OpenSans-Italic-VariableFont_wdth,wght.ttf',
			weight: '300 800',
			style: 'italic'
		}
	],
	variable: '--font-heading',
	display: 'swap',
	fallback: ['system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Arial', 'sans-serif']
})
