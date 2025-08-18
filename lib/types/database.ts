export interface BlogPost {
	id: number
	slug: string
	title: string
	excerpt: string | null
	content: string
	cover_image: string | null
	published: boolean
	locale: string
	created_at: string
	updated_at: string
	published_at: string | null
	authors?: Author[]
	tags?: Tag[]
}

export interface Author {
	id: number
	name: string
	email: string | null
	picture: string | null
	bio: string | null
	created_at: string
	updated_at: string
}

export interface Tag {
	id: number
	name: string
	slug: string
	created_at: string
}

export interface CreateBlogPostData {
	slug: string
	title: string
	excerpt?: string
	content: string
	cover_image?: string
	published?: boolean
	locale?: string
	author_ids?: number[]
	tag_names?: string[]
}

export interface UpdateBlogPostData extends Partial<CreateBlogPostData> {
	id: number
}
