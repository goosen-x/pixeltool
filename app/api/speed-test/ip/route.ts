import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
	// Get IP from various headers
	const forwarded = request.headers.get('x-forwarded-for')
	const realIp = request.headers.get('x-real-ip')
	const ip = forwarded ? forwarded.split(',')[0].trim() : realIp || 'Unknown'

	// Get approximate location from Accept-Language header
	const language = request.headers.get('accept-language') || ''
	const locale = language.split(',')[0].split('-')[0]

	// Simple location mapping based on locale
	const locationMap: Record<string, string> = {
		ru: 'Russia',
		en: 'United States',
		de: 'Germany',
		fr: 'France',
		es: 'Spain',
		it: 'Italy',
		pt: 'Portugal',
		ja: 'Japan',
		ko: 'South Korea',
		zh: 'China'
	}

	const location = locationMap[locale] || 'Unknown Location'

	return NextResponse.json({
		ip,
		location,
		locale
	})
}
