import { config } from 'dotenv'
import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'

// Load environment variables FIRST
config({ path: path.join(process.cwd(), '.env.local') })

async function addRussianPost() {
	console.log('Adding Russian CSS Variables post...')

	// Dynamically import after env vars are loaded
	const { createBlogPost, getAllAuthors } = await import('../db/blog')

	try {
		// Get all authors
		const authors = await getAllAuthors()
		const defaultAuthor = authors.find(a => a.name === 'Dmitry Borisenko')

		if (!defaultAuthor) {
			console.error(
				'Default author not found. Please run database schema first.'
			)
			return
		}

		// Read the Russian markdown file
		const filePath = path.join(process.cwd(), '_posts/css-variables-ru.md')
		const fileContents = fs.readFileSync(filePath, 'utf8')
		const { data, content } = matter(fileContents)

		// Create blog post data
		const postData = {
			slug: 'css-variables',
			title: data.title,
			excerpt: data.excerpt,
			content,
			cover_image: data.coverImage || null,
			published: true,
			locale: 'ru',
			author_ids: [defaultAuthor.id]
		}

		console.log(`Adding: ${postData.title}`)

		try {
			const result = await createBlogPost(postData)
			if (result) {
				console.log(`✅ Successfully added Russian post: ${postData.title}`)
			} else {
				console.log(`⚠️  Post may already exist: ${postData.title}`)
			}
		} catch (error: any) {
			if (error.message?.includes('duplicate key')) {
				console.log(`⚠️  Already exists: ${postData.title}`)
			} else {
				console.error(`❌ Error adding post:`, error.message)
			}
		}

		console.log('Done!')
	} catch (error) {
		console.error('Failed to add Russian post:', error)
	}
}

// Run migration
addRussianPost()
