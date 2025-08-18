import { NextRequest, NextResponse } from 'next/server'
import { getPostBySlug, updateBlogPost, deleteBlogPost } from '@/lib/db/blog'
import type { UpdateBlogPostData } from '@/lib/types/database'

interface RouteParams {
	params: Promise<{ slug: string }>
}

export async function GET(request: NextRequest, { params }: RouteParams) {
	try {
		const { slug } = await params
		const { searchParams } = new URL(request.url)
		const locale = searchParams.get('locale') || 'en'

		const post = await getPostBySlug(slug, locale)

		if (!post) {
			return NextResponse.json(
				{
					success: false,
					error: 'Post not found'
				},
				{ status: 404 }
			)
		}

		return NextResponse.json({
			success: true,
			data: post
		})
	} catch (error) {
		console.error('Error fetching post:', error)
		return NextResponse.json(
			{
				success: false,
				error: 'Failed to fetch post'
			},
			{ status: 500 }
		)
	}
}

export async function PATCH(request: NextRequest, { params }: RouteParams) {
	try {
		const { slug } = await params
		const body = (await request.json()) as Partial<UpdateBlogPostData>

		// First get the post to find its ID
		const existingPost = await getPostBySlug(slug, 'en')
		if (!existingPost) {
			return NextResponse.json(
				{
					success: false,
					error: 'Post not found'
				},
				{ status: 404 }
			)
		}

		const updateData: UpdateBlogPostData = {
			...body,
			id: existingPost.id
		}

		const post = await updateBlogPost(updateData)

		if (!post) {
			return NextResponse.json(
				{
					success: false,
					error: 'Failed to update post'
				},
				{ status: 500 }
			)
		}

		return NextResponse.json({
			success: true,
			data: post
		})
	} catch (error) {
		console.error('Error updating post:', error)
		return NextResponse.json(
			{
				success: false,
				error: 'Failed to update post'
			},
			{ status: 500 }
		)
	}
}

export async function DELETE(request: NextRequest, { params }: RouteParams) {
	try {
		const { slug } = await params

		// First get the post to find its ID
		const existingPost = await getPostBySlug(slug, 'en')
		if (!existingPost) {
			return NextResponse.json(
				{
					success: false,
					error: 'Post not found'
				},
				{ status: 404 }
			)
		}

		const success = await deleteBlogPost(existingPost.id)

		if (!success) {
			return NextResponse.json(
				{
					success: false,
					error: 'Failed to delete post'
				},
				{ status: 500 }
			)
		}

		return NextResponse.json({
			success: true,
			message: 'Post deleted successfully'
		})
	} catch (error) {
		console.error('Error deleting post:', error)
		return NextResponse.json(
			{
				success: false,
				error: 'Failed to delete post'
			},
			{ status: 500 }
		)
	}
}
