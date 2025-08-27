export interface SocialLink {
	id: string
	name: string
	shortCode: string
	utm_source: string
	utm_medium: string
	utm_campaign?: string
	icon?: string
	color?: string
}

export const SOCIAL_LINKS: Record<string, SocialLink> = {
	tk: {
		id: 'tiktok',
		name: 'TikTok',
		shortCode: 'tk',
		utm_source: 'tiktok',
		utm_medium: 'social',
		icon: '📱',
		color: '#000000'
	},
	ig: {
		id: 'instagram',
		name: 'Instagram',
		shortCode: 'ig',
		utm_source: 'instagram',
		utm_medium: 'social',
		icon: '📷',
		color: '#E4405F'
	},
	tw: {
		id: 'twitter',
		name: 'Twitter/X',
		shortCode: 'tw',
		utm_source: 'twitter',
		utm_medium: 'social',
		icon: '🐦',
		color: '#1DA1F2'
	},
	x: {
		id: 'x',
		name: 'X (Twitter)',
		shortCode: 'x',
		utm_source: 'x',
		utm_medium: 'social',
		icon: '✖️',
		color: '#000000'
	},
	fb: {
		id: 'facebook',
		name: 'Facebook',
		shortCode: 'fb',
		utm_source: 'facebook',
		utm_medium: 'social',
		icon: '👥',
		color: '#1877F2'
	},
	yt: {
		id: 'youtube',
		name: 'YouTube',
		shortCode: 'yt',
		utm_source: 'youtube',
		utm_medium: 'social',
		icon: '📺',
		color: '#FF0000'
	},
	ln: {
		id: 'linkedin',
		name: 'LinkedIn',
		shortCode: 'ln',
		utm_source: 'linkedin',
		utm_medium: 'social',
		icon: '💼',
		color: '#0A66C2'
	},
	tg: {
		id: 'telegram',
		name: 'Telegram',
		shortCode: 'tg',
		utm_source: 'telegram',
		utm_medium: 'social',
		icon: '✈️',
		color: '#26A5E4'
	},
	wa: {
		id: 'whatsapp',
		name: 'WhatsApp',
		shortCode: 'wa',
		utm_source: 'whatsapp',
		utm_medium: 'social',
		icon: '💬',
		color: '#25D366'
	},
	rd: {
		id: 'reddit',
		name: 'Reddit',
		shortCode: 'rd',
		utm_source: 'reddit',
		utm_medium: 'social',
		icon: '🤖',
		color: '#FF4500'
	},
	pin: {
		id: 'pinterest',
		name: 'Pinterest',
		shortCode: 'pin',
		utm_source: 'pinterest',
		utm_medium: 'social',
		icon: '📌',
		color: '#BD081C'
	},
	vk: {
		id: 'vkontakte',
		name: 'VKontakte',
		shortCode: 'vk',
		utm_source: 'vkontakte',
		utm_medium: 'social',
		icon: '🇷🇺',
		color: '#0077FF'
	},
	gh: {
		id: 'github',
		name: 'GitHub',
		shortCode: 'gh',
		utm_source: 'github',
		utm_medium: 'social',
		icon: '🐙',
		color: '#181717'
	},
	ph: {
		id: 'producthunt',
		name: 'Product Hunt',
		shortCode: 'ph',
		utm_source: 'producthunt',
		utm_medium: 'social',
		icon: '🚀',
		color: '#DA552F'
	}
}

// Get base URL function
export function getBaseUrl(): string {
	if (typeof window !== 'undefined') {
		return window.location.origin
	}
	
	// For server-side
	if (process.env.NEXT_PUBLIC_SITE_URL) {
		return process.env.NEXT_PUBLIC_SITE_URL
	}
	
	// Fallback
	return 'https://pixeltool.pro'
}

// Generate full URL with UTM parameters (defaults to English)
export function generateSocialUrl(
	shortCode: string, 
	additionalParams?: Record<string, string>,
	locale: string = 'en'
): string {
	const social = SOCIAL_LINKS[shortCode]
	if (!social) {
		return `${getBaseUrl()}/en`
	}
	
	const url = new URL(`${getBaseUrl()}/${locale}`)
	url.searchParams.set('utm_source', social.utm_source)
	url.searchParams.set('utm_medium', social.utm_medium)
	
	if (social.utm_campaign) {
		url.searchParams.set('utm_campaign', social.utm_campaign)
	}
	
	// Add any additional parameters
	if (additionalParams) {
		Object.entries(additionalParams).forEach(([key, value]) => {
			url.searchParams.set(key, value)
		})
	}
	
	return url.toString()
}

// Generate short link
export function generateShortLink(shortCode: string): string {
	return `${getBaseUrl()}/s/${shortCode}`
}

// Get all short links for display
export function getAllShortLinks(locale: string = 'en'): Array<{
	shortLink: string
	fullLink: string
	social: SocialLink
}> {
	return Object.values(SOCIAL_LINKS).map(social => ({
		shortLink: generateShortLink(social.shortCode),
		fullLink: generateSocialUrl(social.shortCode, undefined, locale),
		social
	}))
}