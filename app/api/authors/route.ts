import { NextRequest, NextResponse } from 'next/server'
import { getAllAuthors } from '@/lib/db/blog'

export async function GET(request: NextRequest) {
	try {
		const authors = await getAllAuthors()

		return NextResponse.json({
			success: true,
			data: authors
		})
	} catch (error) {
		console.error('Error fetching authors:', error)
		return NextResponse.json(
			{
				success: false,
				error: 'Failed to fetch authors'
			},
			{ status: 500 }
		)
	}
}
