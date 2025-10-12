import { supabaseServer } from '../supabase/server'
import type {
	BlogPost,
	Author,
	CreateBlogPostData,
	UpdateBlogPostData
} from '../types/database'

// Get all published blog posts with authors
export async function getAllPublishedPosts(
	locale: string = 'en'
): Promise<BlogPost[]> {
	try {
		const { data, error } = await supabaseServer
			.from('blog_posts')
			.select(
				`
				*,
				blog_post_authors (
					author:authors (*)
				)
			`
			)
			.eq('published', true)
			.eq('locale', locale)
			.order('published_at', { ascending: false })
			.order('created_at', { ascending: false })

		if (error) throw error

		// Transform data to match expected format
		return (data || []).map((post: any) => ({
			...post,
			authors:
				post.blog_post_authors?.map((bpa: any) => bpa.author).filter(Boolean) ||
				[]
		})) as BlogPost[]
	} catch (error) {
		console.error('Error fetching published posts:', error)
		return []
	}
}

// Get latest published blog posts with limit
export async function getLatestPublishedPosts(
	locale: string = 'en',
	limit: number = 6
): Promise<BlogPost[]> {
	try {
		const { data, error } = await supabaseServer
			.from('blog_posts')
			.select(
				`
				*,
				blog_post_authors (
					author:authors (*)
				)
			`
			)
			.eq('published', true)
			.eq('locale', locale)
			.order('published_at', { ascending: false })
			.order('created_at', { ascending: false })
			.limit(limit)

		if (error) throw error

		return (data || []).map((post: any) => ({
			...post,
			authors:
				post.blog_post_authors?.map((bpa: any) => bpa.author).filter(Boolean) ||
				[]
		})) as BlogPost[]
	} catch (error) {
		console.error('Error fetching latest posts:', error)
		return []
	}
}

// Get blog post by slug
export async function getPostBySlug(
	slug: string,
	locale: string = 'en'
): Promise<BlogPost | null> {
	try {
		const { data, error } = await supabaseServer
			.from('blog_posts')
			.select(
				`
				*,
				blog_post_authors (
					author:authors (*)
				)
			`
			)
			.eq('slug', slug)
			.eq('locale', locale)
			.eq('published', true)
			.single()

		if (error) throw error
		if (!data) return null

		return {
			...data,
			authors:
				data.blog_post_authors?.map((bpa: any) => bpa.author).filter(Boolean) ||
				[]
		} as BlogPost
	} catch (error) {
		console.error('Error fetching post by slug:', error)
		return null
	}
}

// Create a new blog post
export async function createBlogPost(
	data: CreateBlogPostData
): Promise<BlogPost | null> {
	try {
		const {
			slug,
			title,
			excerpt,
			content,
			cover_image,
			published = false,
			locale = 'en',
			author_ids = []
		} = data

		const published_at = published ? new Date().toISOString() : null

		// Insert blog post
		const { data: newPost, error: postError } = await supabaseServer
			.from('blog_posts')
			.insert({
				slug,
				title,
				excerpt: excerpt || null,
				content,
				cover_image: cover_image || null,
				published,
				locale,
				published_at
			})
			.select()
			.single()

		if (postError) throw postError
		if (!newPost) return null

		// Add authors
		if (author_ids.length > 0) {
			const authorRelations = author_ids.map(authorId => ({
				blog_post_id: newPost.id,
				author_id: authorId
			}))

			const { error: authorsError } = await supabaseServer
				.from('blog_post_authors')
				.insert(authorRelations)

			if (authorsError) {
				console.error('Error adding authors:', authorsError)
			}
		}

		return await getPostBySlug(newPost.slug, newPost.locale)
	} catch (error) {
		console.error('Error creating blog post:', error)
		return null
	}
}

// Update blog post
export async function updateBlogPost(
	data: UpdateBlogPostData
): Promise<BlogPost | null> {
	try {
		const { id, author_ids, ...updateData } = data

		// Prepare update object with published_at if publishing
		const updateObject: any = { ...updateData }
		if (updateData.published === true) {
			updateObject.published_at = new Date().toISOString()
		}

		const { data: updatedPost, error } = await supabaseServer
			.from('blog_posts')
			.update(updateObject)
			.eq('id', id)
			.select()
			.single()

		if (error) throw error
		if (!updatedPost) return null

		// Update authors if provided
		if (author_ids && author_ids.length > 0) {
			// Delete existing author relations
			await supabaseServer
				.from('blog_post_authors')
				.delete()
				.eq('blog_post_id', id)

			// Add new author relations
			const authorRelations = author_ids.map(authorId => ({
				blog_post_id: id,
				author_id: authorId
			}))

			await supabaseServer.from('blog_post_authors').insert(authorRelations)
		}

		return await getPostBySlug(updatedPost.slug, updatedPost.locale)
	} catch (error) {
		console.error('Error updating blog post:', error)
		return null
	}
}

// Delete blog post
export async function deleteBlogPost(id: number): Promise<boolean> {
	try {
		const { error } = await supabaseServer
			.from('blog_posts')
			.delete()
			.eq('id', id)

		if (error) throw error
		return true
	} catch (error) {
		console.error('Error deleting blog post:', error)
		return false
	}
}

// Get all authors
export async function getAllAuthors(): Promise<Author[]> {
	try {
		const { data, error } = await supabaseServer
			.from('authors')
			.select('*')
			.order('name', { ascending: true })

		if (error) throw error
		return (data || []) as Author[]
	} catch (error) {
		console.error('Error fetching authors:', error)
		return []
	}
}

// Initialize database with schema
export async function initializeDatabase(): Promise<boolean> {
	try {
		console.log('Database initialization should be done via Supabase Console')
		return true
	} catch (error) {
		console.error('Error initializing database:', error)
		return false
	}
}
