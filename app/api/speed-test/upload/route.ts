import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
	try {
		// Read the uploaded data to measure speed
		const data = await request.arrayBuffer()
		const size = data.byteLength

		// Return success with size info
		return NextResponse.json({
			success: true,
			size,
			timestamp: Date.now()
		})
	} catch (error) {
		return NextResponse.json(
			{ success: false, error: 'Upload failed' },
			{ status: 500 }
		)
	}
}

// Allow larger uploads for speed test
export const maxDuration = 30 // 30 seconds timeout
export const dynamic = 'force-dynamic'
