import { type Author } from './author'

export type Post = {
	slug: string
	title: string
	date: string
	coverImage: string
	author: Author
	excerpt: string
	ogImage: {
		url: string
	}
	content: string
	preview?: boolean
	/**
	 * Статья про демо-тул (Widget['demo']) — не публикуется на прод (не в
	 * листинге /blog, не в sitemap, noindex), доступна по прямой ссылке с
	 * плашкой. Снимать вместе с demo у тула, когда он утверждён финально.
	 */
	demo?: boolean
	/** Слаги связанных статей — задаются вручную во frontmatter */
	related?: string[]
}

// Legacy support - mapped from database types
export type LegacyPost = Post
