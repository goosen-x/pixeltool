import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
	try {
		const body = await request.json()

		// Analytics tracking disabled - Supabase not used
		// Just return success to avoid breaking the frontend

		return NextResponse.json({
			success: true,
			processed: 0,
			eventIds: [],
			message: 'Analytics tracking disabled'
		})
	} catch (error) {
		console.error('Analytics tracking error:', error)
		return NextResponse.json({
			success: false,
			error: 'Failed to track events',
			processed: 0
		})
	}
}
