import { redirect } from 'next/navigation'
import { SOCIAL_LINKS } from '@/lib/constants/social-links'
import { NextRequest } from 'next/server'

export async function GET(
	request: NextRequest,
	{ params }: { params: { social: string } }
) {
	const { social } = params
	
	// Check if it's a valid social link
	const socialLink = SOCIAL_LINKS[social]
	if (!socialLink) {
		// Redirect to English homepage if invalid
		redirect('/en')
	}
	
	// Build the URL with English locale and UTM parameters
	const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://pixeltool.pro'
	const url = new URL(`${baseUrl}/en`)
	
	// Add UTM parameters
	url.searchParams.set('utm_source', socialLink.utm_source)
	url.searchParams.set('utm_medium', socialLink.utm_medium)
	
	if (socialLink.utm_campaign) {
		url.searchParams.set('utm_campaign', socialLink.utm_campaign)
	}
	
	// Optional: Log the redirect for analytics
	if (process.env.NODE_ENV === 'production') {
		console.log(`Social redirect: /s/${social} → ${url.toString()}`)
	}
	
	// Perform the redirect
	redirect(url.toString())
}