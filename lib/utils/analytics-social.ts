// Track social link redirect
export function trackSocialRedirect(social: string, source: string = 'direct') {
	if (typeof window === 'undefined') return
	
	// Track with Yandex Metrika if available
	if (window.ym && process.env.NEXT_PUBLIC_YANDEX_METRIKA_ID) {
		const metrikaId = parseInt(process.env.NEXT_PUBLIC_YANDEX_METRIKA_ID, 10)
		if (!isNaN(metrikaId)) {
			window.ym(
				metrikaId,
				'reachGoal',
				'social_redirect',
				{
					social,
					source,
					timestamp: new Date().toISOString()
				}
			)
		}
	}
	
	// Track with Google Analytics if available
	if ((window as any).gtag) {
		(window as any).gtag('event', 'social_redirect', {
			social_network: social,
			event_category: 'engagement',
			event_label: source,
			value: 1
		})
	}
	
	// Log to console in development
	if (process.env.NODE_ENV === 'development') {
		console.log('Social redirect tracked:', { social, source })
	}
}

// Generate social share URL
export function generateShareUrl(platform: string, url: string, text?: string): string {
	const encodedUrl = encodeURIComponent(url)
	const encodedText = text ? encodeURIComponent(text) : ''
	
	switch (platform) {
		case 'twitter':
		case 'x':
			return `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedText}`
		
		case 'facebook':
			return `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`
		
		case 'linkedin':
			return `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`
		
		case 'telegram':
			return `https://t.me/share/url?url=${encodedUrl}&text=${encodedText}`
		
		case 'whatsapp':
			return `https://wa.me/?text=${encodedText}%20${encodedUrl}`
		
		case 'vkontakte':
			return `https://vk.com/share.php?url=${encodedUrl}&title=${encodedText}`
		
		case 'reddit':
			return `https://reddit.com/submit?url=${encodedUrl}&title=${encodedText}`
		
		default:
			return url
	}
}

