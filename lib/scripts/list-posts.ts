import { config } from 'dotenv'
import path from 'path'

// Load environment variables FIRST
config({ path: path.join(process.cwd(), '.env.local') })

async function listPosts() {
	// Dynamically import after env vars are loaded
	const { getAllPublishedPosts } = await import('../db/blog')

	try {
		const posts = await getAllPublishedPosts('en')

		console.log(`\n📚 Total posts in database: ${posts.length}\n`)

		posts.forEach((post, index) => {
			console.log(`${index + 1}. ${post.title}`)
			console.log(
				`   📅 Published: ${new Date(post.published_at || post.created_at).toLocaleDateString()}`
			)
			console.log(`   🔗 Slug: ${post.slug}`)
			console.log(`   📝 Excerpt: ${post.excerpt?.substring(0, 60)}...`)
			console.log('')
		})

		console.log(
			'\n✅ All posts are available at: http://localhost:3000/en/blog'
		)
	} catch (error) {
		console.error('Error listing posts:', error)
	}
}

listPosts()
