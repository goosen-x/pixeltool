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
		// Атрибуция CLS (см. components/analytics/WebVitals.tsx) — одной
		// строкой JSON, чтобы её было удобно грепать из docker logs.
		if (body.metric === 'CLS' && Array.isArray(body.shifts)) {
			console.log(
				'CLS attribution:',
				JSON.stringify({
					url: body.url,
					value: body.value,
					vw: body.vw,
					vh: body.vh,
					shifts: body.shifts
				})
			)
		}

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
