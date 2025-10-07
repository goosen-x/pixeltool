import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase/client'

export async function GET(request: NextRequest) {
	try {
		// Get online users (sessions active in the last 5 minutes across all widgets)
		const fiveMinutesAgo = new Date()
		fiveMinutesAgo.setMinutes(fiveMinutesAgo.getMinutes() - 5)

		console.log('🔍 Checking online users since:', fiveMinutesAgo.toISOString())

		const { data: onlineData, error: onlineError } = await supabase
			.from('usage_events')
			.select('session_id, timestamp, widget_id')
			.gte('timestamp', fiveMinutesAgo.toISOString())
			.order('timestamp', { ascending: false })

		if (onlineError) {
			console.error('Online users error:', onlineError)
			throw onlineError
		}

		// Count unique sessions
		const uniqueSessions = new Set(onlineData?.map(e => e.session_id) || [])
		const onlineUsers = uniqueSessions.size

		console.log('📊 Recent events:', onlineData?.length || 0)
		console.log('👥 Unique sessions:', Array.from(uniqueSessions))
		console.log('👥 Total online users:', onlineUsers)

		// Get some additional stats for the response
		const today = new Date()
		today.setHours(0, 0, 0, 0)

		const { data: todayData, error: todayError } = await supabase
			.from('usage_events')
			.select('session_id')
			.eq('event_type', 'view')
			.gte('timestamp', today.toISOString())

		if (todayError) {
			console.error('Today stats error:', todayError)
		}

		const todayUniqueSessions = new Set(todayData?.map(e => e.session_id) || [])
			.size

		const response = NextResponse.json({
			onlineUsers,
			todayUniqueSessions,
			timestamp: new Date().toISOString()
		})

		// Prevent caching
		response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate')
		response.headers.set('Pragma', 'no-cache')
		response.headers.set('Expires', '0')

		return response
	} catch (error) {
		console.error('Analytics online error:', error)
		return NextResponse.json(
			{ error: 'Failed to fetch online users' },
			{ status: 500 }
		)
	}
}
