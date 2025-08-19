import { NextRequest, NextResponse } from 'next/server'

export async function GET(
	request: NextRequest,
	{ params }: { params: Promise<{ appId: string }> }
) {
	const { appId } = await params
	const userAgent = request.headers.get('user-agent') || ''

	// Parse the appId which should be in format: ios:123456789,android:com.example.app
	const apps = appId.split(',').reduce(
		(acc, part) => {
			const [platform, id] = part.split(':')
			acc[platform] = id
			return acc
		},
		{} as Record<string, string>
	)

	// Detect platform from user agent
	const isIOS = /iPhone|iPad|iPod/i.test(userAgent)
	const isAndroid = /Android/i.test(userAgent)

	let redirectUrl = ''

	if (isIOS && apps.ios) {
		// Redirect to App Store
		redirectUrl = `https://apps.apple.com/app/id${apps.ios}`
	} else if (isAndroid && apps.android) {
		// Redirect to Google Play
		redirectUrl = `https://play.google.com/store/apps/details?id=${apps.android}`
	} else if (apps.ios) {
		// Default to iOS if platform can't be detected
		redirectUrl = `https://apps.apple.com/app/id${apps.ios}`
	} else if (apps.android) {
		// Fallback to Android
		redirectUrl = `https://play.google.com/store/apps/details?id=${apps.android}`
	} else {
		// No valid app IDs provided
		return new NextResponse('Invalid app configuration', { status: 400 })
	}

	// Permanent redirect to the app store
	return NextResponse.redirect(redirectUrl, { status: 301 })
}
