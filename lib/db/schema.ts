export interface Post {
	id: number
	slug: string
	title: string
	excerpt: string
	content: string
	publishedAt: Date
	updatedAt: Date
	published: boolean
	coverImage: string
	locale: string
	category: string
	readingTime: number
	author: {
		name: string
		picture: string
	}
}
