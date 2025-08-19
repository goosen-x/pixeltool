import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
	try {
		// Skip analytics tracking in development mode
		if (process.env.NODE_ENV !== 'production') {
			return NextResponse.json({
				success: true,
				message: 'Web Vitals tracking disabled in development mode'
			})
		}

		const body = await request.json()

		// Log the Web Vitals data (only in production)
		console.log('Web Vitals:', {
			metric: body.metric,
			value: body.value,
			id: body.id,
			url: body.url,
			timestamp: new Date().toISOString()
		})

		// Here you could send this data to your analytics service
		// Example: await sendToAnalytics(body)

		return NextResponse.json({ success: true })
	} catch (error) {
		console.error('Error processing Web Vitals:', error)
		return NextResponse.json(
			{ error: 'Failed to process Web Vitals' },
			{ status: 500 }
		)
	}
}
