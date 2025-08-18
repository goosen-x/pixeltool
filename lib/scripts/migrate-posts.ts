import { config } from 'dotenv'
import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'

// Load environment variables FIRST
config({ path: path.join(process.cwd(), '.env.local') })

const postsDirectory = path.join(process.cwd(), '_posts')

async function migratePosts() {
	console.log('Starting migration of markdown posts to database...')

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

		// Get all markdown files
		const fileNames = fs.readdirSync(postsDirectory)
		const markdownFiles = fileNames.filter(name => name.endsWith('.md'))

		console.log(`Found ${markdownFiles.length} markdown files to migrate`)

		let successCount = 0
		let skipCount = 0
		let errorCount = 0

		for (const fileName of markdownFiles) {
			const slug = fileName.replace(/\.md$/, '')
			const fullPath = path.join(postsDirectory, fileName)
			const fileContents = fs.readFileSync(fullPath, 'utf8')
			const { data, content } = matter(fileContents)

			// Create blog post data
			const postData = {
				slug,
				title: data.title,
				excerpt: data.excerpt,
				content,
				cover_image: data.coverImage || null,
				published: true,
				locale: 'en',
				author_ids: [defaultAuthor.id]
			}

			console.log(`\nMigrating: ${postData.title}`)

			try {
				const result = await createBlogPost(postData)
				if (result) {
					console.log(`✅ Successfully migrated: ${postData.title}`)
					successCount++
				} else {
					console.log(`⚠️  Skipped (may already exist): ${postData.title}`)
					skipCount++
				}
			} catch (error: any) {
				if (error.message?.includes('duplicate key')) {
					console.log(`⚠️  Already exists: ${postData.title}`)
					skipCount++
				} else {
					console.error(`❌ Error migrating ${postData.title}:`, error.message)
					errorCount++
				}
			}
		}

		console.log('\n=== Migration Summary ===')
		console.log(`✅ Successfully migrated: ${successCount} posts`)
		console.log(`⚠️  Skipped/Already exists: ${skipCount} posts`)
		console.log(`❌ Errors: ${errorCount} posts`)
		console.log(`Total processed: ${markdownFiles.length} posts`)
		console.log('\nMigration completed!')
	} catch (error) {
		console.error('Migration failed:', error)
	}
}

// Run migration
migratePosts()
