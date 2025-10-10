import { NextRequest, NextResponse } from 'next/server'
import { getOnlineCount } from '@/lib/redisOnline'

export async function GET(request: NextRequest) {
	try {
		// Get online users from Redis
		const onlineUsers = await getOnlineCount()

		console.log('👥 Online users from Redis:', onlineUsers)

		const response = NextResponse.json({
			onlineUsers,
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
			{ onlineUsers: 0, timestamp: new Date().toISOString() },
			{ status: 200 }
		)
	}
}
