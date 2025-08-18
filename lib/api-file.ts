import { Post } from '@/lib/types/post'
import fs from 'fs'
import { join } from 'path'
import matter from 'gray-matter'

const postsDirectory = join(process.cwd(), '_posts')

export function getPostSlugs() {
	try {
		return fs.readdirSync(postsDirectory)
	} catch {
		return []
	}
}

export function getPostBySlugFromFile(
	slug: string,
	locale: string = 'en'
): Post {
	const realSlug = slug.replace(/\.md$/, '')

	// Try locale-specific file first
	let fullPath = join(postsDirectory, `${realSlug}-${locale}.md`)
	let fileContents: string

	try {
		fileContents = fs.readFileSync(fullPath, 'utf8')
	} catch {
		// Fallback to non-localized file
		fullPath = join(postsDirectory, `${realSlug}.md`)
		fileContents = fs.readFileSync(fullPath, 'utf8')
	}

	const { data, content } = matter(fileContents)

	return {
		slug: realSlug,
		title: data.title || realSlug,
		date: data.date || new Date().toISOString(),
		coverImage: data.coverImage || '/images/avatar.jpeg',
		author: data.author || {
			name: 'Dmitry Borisenko',
			picture: '/images/avatar.jpeg'
		},
		excerpt: data.excerpt || '',
		ogImage: data.ogImage || {
			url: data.coverImage || '/images/avatar.jpeg'
		},
		content,
		preview: data.preview || false
	}
}

export function getAllPostsFromFiles(locale: string = 'en'): Post[] {
	const slugs = getPostSlugs()
	const uniqueSlugs = new Set<string>()

	// Extract unique base slugs (without locale suffix)
	slugs.forEach(fileName => {
		if (fileName.endsWith('.md')) {
			const baseName = fileName.replace('.md', '')
			// Remove locale suffix if present (-en, -ru)
			const baseSlug = baseName.replace(/-(?:en|ru)$/, '')
			uniqueSlugs.add(baseSlug)
		}
	})

	const posts = Array.from(uniqueSlugs)
		.map(slug => {
			try {
				return getPostBySlugFromFile(slug, locale)
			} catch {
				return null
			}
		})
		.filter((post): post is Post => post !== null)
		.sort((post1, post2) => (post1.date > post2.date ? -1 : 1))
	return posts
}
