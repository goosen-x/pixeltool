import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase/client'
import { getOnlineCount } from '@/lib/redisOnline'

export async function GET(request: NextRequest) {
	try {
		// Get online users from Redis
		const onlineUsers = await getOnlineCount()

		console.log('👥 Online users from Redis:', onlineUsers)

		// Get today's unique sessions from Supabase (optional stats)
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
