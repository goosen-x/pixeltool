import { config } from 'dotenv'
import path from 'path'

// Load environment variables FIRST
config({ path: path.join(process.cwd(), '.env.local') })

async function listAllPosts() {
	// Dynamically import after env vars are loaded
	const { sql } = await import('../db/connection')

	try {
		const posts = await sql`
			SELECT slug, title, locale, published
			FROM blog_posts
			ORDER BY locale, created_at DESC
		`

		const englishPosts = posts.filter((p: any) => p.locale === 'en')
		const russianPosts = posts.filter((p: any) => p.locale === 'ru')

		console.log(`\n📚 Total posts in database: ${posts.length}`)
		console.log(`🇬🇧 English posts: ${englishPosts.length}`)
		console.log(`🇷🇺 Russian posts: ${russianPosts.length}\n`)

		if (englishPosts.length > 0) {
			console.log('=== English Posts ===')
			englishPosts.forEach((post: any, index: number) => {
				console.log(`${index + 1}. ${post.title}`)
				console.log(`   Slug: ${post.slug}`)
				console.log(`   Published: ${post.published ? 'Yes' : 'No'}\n`)
			})
		}

		if (russianPosts.length > 0) {
			console.log('\n=== Russian Posts ===')
			russianPosts.forEach((post: any, index: number) => {
				console.log(`${index + 1}. ${post.title}`)
				console.log(`   Slug: ${post.slug}`)
				console.log(`   Published: ${post.published ? 'Yes' : 'No'}\n`)
			})
		}
	} catch (error) {
		console.error('Error listing posts:', error)
	}
}

listAllPosts()
