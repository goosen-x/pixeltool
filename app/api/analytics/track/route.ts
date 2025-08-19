import { NextRequest, NextResponse } from 'next/server'
import { supabaseServer } from '@/lib/supabase/server'

export async function POST(request: NextRequest) {
	try {
		// Skip analytics tracking in development mode
		if (process.env.NODE_ENV === 'development') {
			return NextResponse.json({
				success: true,
				processed: 0,
				eventIds: [],
				message: 'Analytics disabled in development mode'
			})
		}

		const body = await request.json()

		// Handle both single events and batched events
		const events = body.events || [body]

		if (!Array.isArray(events) || events.length === 0) {
			return NextResponse.json({ error: 'No events provided' }, { status: 400 })
		}

		// Get referrer from request headers
		const referrer = request.headers.get('referer') || null
		const defaultUserAgent = request.headers.get('user-agent') || null

		// Prepare all event data for batch insert
		const eventDataArray = events.map(event => {
			const {
				widgetId,
				sessionId,
				eventType = 'view',
				locale,
				metadata = {}
			} = event

			if (!widgetId || !sessionId) {
				throw new Error('Widget ID and Session ID are required for all events')
			}

			return {
				widget_id: widgetId,
				session_id: sessionId,
				event_type: eventType,
				user_agent: metadata.userAgent || defaultUserAgent,
				referrer: referrer,
				metadata: {
					...metadata,
					locale
				}
			}
		})

		if (process.env.NODE_ENV !== 'production') {
			console.log('📊 Inserting', eventDataArray.length, 'events')
		}

		// Track all events in a single batch insert
		const { data, error } = await supabaseServer
			.from('usage_events')
			.insert(eventDataArray)
			.select()

		if (error) {
			console.error('Analytics tracking error:', error)
			// Don't fail the request - analytics should not break the app
			return NextResponse.json({
				success: false,
				error: error.message || 'Failed to track events',
				processed: 0
			})
		}

		return NextResponse.json({
			success: true,
			processed: data?.length || 0,
			eventIds: data?.map(d => d.id) || []
		})
	} catch (error) {
		console.error('Analytics tracking error:', error)
		// Don't fail the request - analytics should not break the app
		return NextResponse.json({
			success: false,
			error: 'Failed to track events',
			processed: 0
		})
	}
}
