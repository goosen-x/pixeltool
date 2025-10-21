import type { Post } from './types/post'
import { getAllPostsFromFiles, getPostBySlugFromFile } from './api-file'

// Get all published posts from file system
export async function getAllPosts(): Promise<Post[]> {
	try {
		return getAllPostsFromFiles()
	} catch (error) {
		console.error('Error fetching posts from files:', error)
		return []
	}
}

// Get post by slug from file system
export async function getPostBySlug(slug: string): Promise<Post | null> {
	try {
		return getPostBySlugFromFile(slug)
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
