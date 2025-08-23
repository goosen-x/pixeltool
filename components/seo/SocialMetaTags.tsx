export function SocialMetaTags() {
	// Additional meta tags for better social media compatibility
	return (
		<>
			{/* Facebook */}
			<meta property='fb:app_id' content='' />
			<meta property='og:locale:alternate' content='ru_RU' />
			<meta property='og:locale:alternate' content='en_US' />

			{/* Pinterest */}
			<meta property='pinterest-rich-pin' content='true' />

			{/* LinkedIn */}
			<meta property='article:author' content='Dmitry Borisenko' />

			{/* WhatsApp */}
			<meta property='og:site' content='PixelTool' />

			{/* VK */}
			<meta property='vk:image' content='https://pixeltool.pro/og-image.png' />

			{/* Additional image formats for better compatibility */}
			<link rel='image_src' href='https://pixeltool.pro/og-image.png' />
		</>
	)
}
