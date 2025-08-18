import { NextRequest, NextResponse } from 'next/server'
import { getAllPublishedPosts, createBlogPost } from '@/lib/db/blog'
import type { CreateBlogPostData } from '@/lib/types/database'

export async function GET(request: NextRequest) {
	try {
		const { searchParams } = new URL(request.url)
		const locale = searchParams.get('locale') || 'en'

		const posts = await getAllPublishedPosts(locale)

		return NextResponse.json({
			success: true,
			data: posts
		})
	} catch (error) {
		console.error('Error fetching posts:', error)
		return NextResponse.json(
			{
				success: false,
				error: 'Failed to fetch posts'
			},
			{ status: 500 }
		)
	}
}

export async function POST(request: NextRequest) {
	try {
		const body = (await request.json()) as CreateBlogPostData

		// Validate required fields
		if (!body.slug || !body.title || !body.content) {
			return NextResponse.json(
				{
					success: false,
					error: 'Missing required fields: slug, title, content'
				},
				{ status: 400 }
			)
		}

		const post = await createBlogPost(body)

		if (!post) {
			return NextResponse.json(
				{
					success: false,
					error: 'Failed to create post'
				},
				{ status: 500 }
			)
		}

		return NextResponse.json(
			{
				success: true,
				data: post
			},
			{ status: 201 }
		)
	} catch (error) {
		console.error('Error creating post:', error)
		return NextResponse.json(
			{
				success: false,
				error: 'Failed to create post'
			},
			{ status: 500 }
		)
	}
}
