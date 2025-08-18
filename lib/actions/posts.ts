import { getLatestPublishedPosts } from '../db/blog'
import type { Post } from '../db/schema'
import type { BlogPost } from '../types/database'

// Convert database BlogPost to Post format
function convertDbPostToPost(dbPost: BlogPost): Post {
	const primaryAuthor = dbPost.authors?.[0]

	// Calculate reading time based on content length (rough estimate)
	const wordsPerMinute = 200
	const wordCount = dbPost.content.split(/\s+/).length
	const readingTime = Math.ceil(wordCount / wordsPerMinute)

	return {
		id: dbPost.id,
		slug: dbPost.slug,
		title: dbPost.title,
		excerpt: dbPost.excerpt || '',
		content: dbPost.content,
		publishedAt: new Date(dbPost.published_at || dbPost.created_at),
		updatedAt: new Date(dbPost.updated_at),
		published: dbPost.published,
		coverImage: dbPost.cover_image || '',
		locale: dbPost.locale,
		category: 'Development', // You can add category to DB schema later
		readingTime,
		author: {
			name: primaryAuthor?.name || 'Unknown Author',
			picture: primaryAuthor?.picture || '/images/avatar.jpeg'
		}
	}
}

export async function getLatestPosts({
	limit = 6,
	locale = 'en'
}: {
	limit?: number
	locale?: string
}): Promise<Post[]> {
	try {
		const dbPosts = await getLatestPublishedPosts(locale, limit)
		return dbPosts.map(convertDbPostToPost)
	} catch (error) {
		console.error('Error fetching latest posts:', error)
		return []
	}
}
