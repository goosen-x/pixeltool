export default function Head() {
	const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://pixeltool.pro'

	return (
		<>
			{/* Preconnect to improve performance */}
			<link rel='preconnect' href='https://fonts.googleapis.com' />
			<link
				rel='preconnect'
				href='https://fonts.gstatic.com'
				crossOrigin='anonymous'
			/>

			{/* Additional meta tags for social media */}
			<meta property='og:determiner' content='the' />
			<meta property='og:rich_attachment' content='true' />

			{/* Telegram specific */}
			<meta property='tg:site_verification' content='' />

			{/* Theme color for different themes */}
			<meta
				name='theme-color'
				media='(prefers-color-scheme: light)'
				content='#ffffff'
			/>
			<meta
				name='theme-color'
				media='(prefers-color-scheme: dark)'
				content='#0f172a'
			/>

			{/* Apple specific */}
			<meta name='apple-mobile-web-app-capable' content='yes' />
			<meta name='apple-mobile-web-app-status-bar-style' content='default' />
			<link rel='apple-touch-icon' href='/icon.svg' />

			{/* Microsoft specific */}
			<meta name='msapplication-TileColor' content='#0f172a' />
			<meta name='msapplication-config' content='/browserconfig.xml' />

			{/* Security */}
			<meta httpEquiv='X-UA-Compatible' content='IE=edge' />
			<meta name='referrer' content='origin-when-cross-origin' />

			{/* Additional SEO */}
			<meta
				name='robots'
				content='index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1'
			/>
			<meta
				name='googlebot'
				content='index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1'
			/>
			<meta
				name='bingbot'
				content='index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1'
			/>
		</>
	)
}
