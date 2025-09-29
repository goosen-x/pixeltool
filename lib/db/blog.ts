import { sql } from './connection'
import { safeQuery } from './safe-query'
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
		// Check if database is configured
		if (!process.env.DATABASE_URL && !process.env.POSTGRES_URL) {
			console.warn('Database URL not configured, returning empty posts')
			return []
		}

		// Add timeout wrapper
		const timeoutPromise = new Promise<never>((_, reject) => {
			setTimeout(() => reject(new Error('Query timeout')), 2000)
		})

		const queryPromise = sql`
			SELECT
				bp.*,
				json_agg(
					json_build_object(
						'id', a.id,
						'name', a.name,
						'picture', a.picture,
						'bio', a.bio
					)
				) as authors
			FROM blog_posts bp
			LEFT JOIN blog_post_authors bpa ON bp.id = bpa.blog_post_id
			LEFT JOIN authors a ON bpa.author_id = a.id
			WHERE bp.published = true
				AND bp.locale = ${locale}
			GROUP BY bp.id
			ORDER BY bp.published_at DESC, bp.created_at DESC
		`

		const posts = await Promise.race([queryPromise, timeoutPromise])

		return posts.map((post: any) => ({
			...post,
			authors: post.authors?.filter(Boolean) || []
		})) as BlogPost[]
	} catch (error: any) {
		if (
			error?.message?.includes('timeout') ||
			error?.message?.includes('TimeoutError') ||
			error?.message?.includes('Query timeout')
		) {
			console.warn('Database connection timeout - returning empty posts')
		} else {
			console.error('Error fetching published posts:', error)
		}
		return []
	}
}

// Get latest published blog posts with limit
export async function getLatestPublishedPosts(
	locale: string = 'en',
	limit: number = 6
): Promise<BlogPost[]> {
	try {
		// Check if database is configured
		if (!process.env.DATABASE_URL && !process.env.POSTGRES_URL) {
			console.warn('Database URL not configured, returning empty posts')
			return []
		}

		// Add timeout wrapper
		const timeoutPromise = new Promise<never>((_, reject) => {
			setTimeout(() => reject(new Error('Query timeout')), 2000)
		})

		const queryPromise = sql`
			SELECT
				bp.*,
				json_agg(
					json_build_object(
						'id', a.id,
						'name', a.name,
						'picture', a.picture,
						'bio', a.bio
					)
				) as authors
			FROM blog_posts bp
			LEFT JOIN blog_post_authors bpa ON bp.id = bpa.blog_post_id
			LEFT JOIN authors a ON bpa.author_id = a.id
			WHERE bp.published = true
				AND bp.locale = ${locale}
			GROUP BY bp.id
			ORDER BY bp.published_at DESC, bp.created_at DESC
			LIMIT ${limit}
		`

		const posts = await Promise.race([queryPromise, timeoutPromise])

		return posts.map((post: any) => ({
			...post,
			authors: post.authors?.filter(Boolean) || []
		})) as BlogPost[]
	} catch (error: any) {
		if (
			error?.message?.includes('timeout') ||
			error?.message?.includes('TimeoutError') ||
			error?.message?.includes('Query timeout')
		) {
			console.warn('Database connection timeout - returning empty posts')
		} else {
			console.error('Error fetching latest posts:', error)
		}
		return []
	}
}

// Get blog post by slug
export async function getPostBySlug(
	slug: string,
	locale: string = 'en'
): Promise<BlogPost | null> {
	try {
		// Check if database is configured
		if (!process.env.DATABASE_URL && !process.env.POSTGRES_URL) {
			console.warn('Database URL not configured, returning null for post')
			return null
		}

		// Add timeout wrapper
		const timeoutPromise = new Promise<never>((_, reject) => {
			setTimeout(() => reject(new Error('Query timeout')), 2000)
		})

		const queryPromise = sql`
			SELECT
				bp.*,
				json_agg(
					json_build_object(
						'id', a.id,
						'name', a.name,
						'picture', a.picture,
						'bio', a.bio
					)
				) as authors
			FROM blog_posts bp
			LEFT JOIN blog_post_authors bpa ON bp.id = bpa.blog_post_id
			LEFT JOIN authors a ON bpa.author_id = a.id
			WHERE bp.slug = ${slug}
				AND bp.locale = ${locale}
				AND bp.published = true
			GROUP BY bp.id
			LIMIT 1
		`

		const result = await Promise.race([queryPromise, timeoutPromise])

		if (result.length === 0) {
			return null
		}

		const post = result[0]
		return {
			...post,
			authors: post.authors?.filter(Boolean) || []
		} as BlogPost
	} catch (error: any) {
		if (
			error?.message?.includes('timeout') ||
			error?.message?.includes('TimeoutError') ||
			error?.message?.includes('Query timeout')
		) {
			console.warn('Database connection timeout when fetching post by slug')
		} else {
			console.error('Error fetching post by slug:', error)
		}
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
		const result = await sql`
			INSERT INTO blog_posts (slug, title, excerpt, content, cover_image, published, locale, published_at)
			VALUES (${slug}, ${title}, ${excerpt || null}, ${content}, ${cover_image || null}, ${published}, ${locale}, ${published_at})
			RETURNING *
		`

		const newPost = result[0] as BlogPost

		// Add authors
		if (author_ids.length > 0) {
			for (const authorId of author_ids) {
				await sql`
					INSERT INTO blog_post_authors (blog_post_id, author_id)
					VALUES (${newPost.id}, ${authorId})
					ON CONFLICT DO NOTHING
				`
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
		const { id, ...updateData } = data
		const setClause = []
		const values = []

		// Build dynamic SET clause
		Object.entries(updateData).forEach(([key, value]) => {
			if (value !== undefined && key !== 'author_ids' && key !== 'tag_names') {
				setClause.push(`${key} = $${values.length + 1}`)
				values.push(value)
			}
		})

		if (setClause.length === 0) {
			return null
		}

		// Update published_at if publishing
		if (updateData.published === true) {
			setClause.push(`published_at = $${values.length + 1}`)
			values.push(new Date().toISOString())
		}

		const result = await sql`
			UPDATE blog_posts
			SET ${sql.unsafe(setClause.join(', '))}
			WHERE id = ${id}
			RETURNING *
		`

		if (result.length === 0) {
			return null
		}

		const updatedPost = result[0] as BlogPost
		return await getPostBySlug(updatedPost.slug, updatedPost.locale)
	} catch (error) {
		console.error('Error updating blog post:', error)
		return null
	}
}

// Delete blog post
export async function deleteBlogPost(id: number): Promise<boolean> {
	try {
		await sql`DELETE FROM blog_posts WHERE id = ${id}`
		return true
	} catch (error) {
		console.error('Error deleting blog post:', error)
		return false
	}
}

// Get all authors
export async function getAllAuthors(): Promise<Author[]> {
	try {
		const authors = await sql`
			SELECT * FROM authors
			ORDER BY name ASC
		`
		return authors as Author[]
	} catch (error) {
		console.error('Error fetching authors:', error)
		return []
	}
}

// Initialize database with schema
export async function initializeDatabase(): Promise<boolean> {
	try {
		// This would run the schema.sql file
		// For now, we'll create tables manually in Neon Console
		console.log('Database initialization should be done via Neon Console')
		return true
	} catch (error) {
		console.error('Error initializing database:', error)
		return false
	}
}
