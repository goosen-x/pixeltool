import { NextResponse } from 'next/server'
import { getAllPublishedPosts } from '@/lib/db/blog'

export async function GET() {
	try {
		// Check environment variables
		const envInfo = {
			DATABASE_URL: process.env.DATABASE_URL ? 'Set' : 'Not set',
			POSTGRES_URL: process.env.POSTGRES_URL ? 'Set' : 'Not set',
			NODE_ENV: process.env.NODE_ENV
		}

		// Try to get posts
		let posts: any[] = []
		let dbError: string | null = null

		try {
			posts = await getAllPublishedPosts('en')
		} catch (error: any) {
			dbError = error.message
		}

		return NextResponse.json({
			success: true,
			env: envInfo,
			postsCount: posts.length,
			posts: posts.slice(0, 2), // Show first 2 posts
			error: dbError
		})
	} catch (error: any) {
		return NextResponse.json(
			{
				success: false,
				error: error.message
			},
			{ status: 500 }
		)
	}
}
