import { NextRequest, NextResponse } from 'next/server'
import { getDb, isDbUnavailableError } from '@/lib/db'

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
			try {
				const db = await getDb()
				await db.query(
					`INSERT INTO cls_shifts (url, value, vw, vh, shifts, user_agent)
					 VALUES ($1, $2, $3, $4, $5, $6)`,
					[
						String(body.url ?? '').slice(0, 500),
						Number(body.value) || 0,
						Number.isFinite(body.vw) ? Math.min(body.vw, 32000) : null,
						Number.isFinite(body.vh) ? Math.min(body.vh, 32000) : null,
						JSON.stringify(body.shifts.slice(0, 3)),
						request.headers.get('user-agent')?.slice(0, 300) ?? null
					]
				)
			} catch (error) {
				if (!isDbUnavailableError(error)) {
					console.error('CLS attribution не записана в БД:', error)
				}
			}
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
