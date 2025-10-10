import type { Post } from './types/post'
import { getAllPostsFromFiles, getPostBySlugFromFile } from './api-file'

// Get all published posts from file system
export async function getAllPosts(locale: string = 'en'): Promise<Post[]> {
	try {
		return getAllPostsFromFiles(locale)
	} catch (error) {
		console.error('Error fetching posts from files:', error)
		return []
	}
}

// Get post by slug from file system
export async function getPostBySlug(
	slug: string,
	locale: string = 'en'
): Promise<Post | null> {
	try {
		return getPostBySlugFromFile(slug, locale)
	} catch (error) {
		console.error('Error fetching post from file:', error)
		return null
	}
}

// Legacy function for compatibility
export function getPostSlugs(): string[] {
	console.warn('getPostSlugs is deprecated')
	return []
}
