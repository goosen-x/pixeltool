import {
	getAllPublishedPosts,
	getPostBySlug as getDbPostBySlug
} from './db/blog'
import type { BlogPost } from './types/database'
import type { Post } from './types/post'
import type { Author } from './types/author'
import { getAllPostsFromFiles, getPostBySlugFromFile } from './api-file'

// Convert database BlogPost to legacy Post format
function convertDbPostToLegacy(dbPost: BlogPost): Post {
	const primaryAuthor = dbPost.authors?.[0]

	const author: Author = {
		name: primaryAuthor?.name || 'Unknown Author',
		picture: primaryAuthor?.picture || '/images/avatar.jpeg'
	}

	return {
		slug: dbPost.slug,
		title: dbPost.title,
		date: new Date(dbPost.published_at || dbPost.created_at).toISOString(),
		coverImage: dbPost.cover_image || '/images/avatar.jpeg',
		author,
		excerpt: dbPost.excerpt || '',
		ogImage: {
			url: dbPost.cover_image || '/images/avatar.jpeg'
		},
		content: dbPost.content,
		preview: false
	}
}

// Get all published posts
export async function getAllPosts(locale: string = 'en'): Promise<Post[]> {
	try {
		const dbPosts = await getAllPublishedPosts(locale)

		// If we get posts from DB, use them
		if (dbPosts && dbPosts.length > 0) {
			return dbPosts.map(convertDbPostToLegacy)
		}

		// If no posts from DB (but no error), fallback to files
		console.warn('No posts found in database, falling back to file system')
		return getAllPostsFromFiles(locale)
	} catch (error) {
		console.error('Error fetching posts from database:', error)
		// Fallback to file system
		try {
			return getAllPostsFromFiles(locale)
		} catch (fileError) {
			console.error('Error fetching posts from files:', fileError)
			return []
		}
	}
}

// Get post by slug
export async function getPostBySlug(
	slug: string,
	locale: string = 'en'
): Promise<Post | null> {
	try {
		const dbPost = await getDbPostBySlug(slug, locale)
		if (!dbPost) {
			// If not found in DB, try fallback to file system
			try {
				return getPostBySlugFromFile(slug)
			} catch (fileError) {
				console.error('Error fetching post from file:', fileError)
				return null
			}
		}
		return convertDbPostToLegacy(dbPost)
	} catch (error) {
		console.error('Error fetching post by slug from database:', error)
		// Fallback to file system
		try {
			return getPostBySlugFromFile(slug, locale)
		} catch (fileError) {
			console.error('Error fetching post from file:', fileError)
			return null
		}
	}
}

// Legacy function for compatibility
export function getPostSlugs(): string[] {
	// This function is no longer used but kept for compatibility
	console.warn('getPostSlugs is deprecated when using database')
	return []
}
