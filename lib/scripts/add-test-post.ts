import { config } from 'dotenv'
import path from 'path'

// Load environment variables FIRST
config({ path: path.join(process.cwd(), '.env.local') })

async function addTestPost() {
	console.log('Adding test blog post...')

	// Dynamically import after env vars are loaded
	const { createBlogPost, getAllAuthors } = await import('../db/blog')

	try {
		// Get default author
		const authors = await getAllAuthors()
		const defaultAuthor = authors.find(a => a.name === 'Dmitry Borisenko')

		if (!defaultAuthor) {
			console.error('Default author not found!')
			return
		}

		const testPost = {
			slug: 'welcome-to-my-blog',
			title: 'Welcome to My Blog',
			excerpt: 'This is my first blog post using the new database system.',
			content: `# Welcome to My Blog

This is my first blog post using the new PostgreSQL database powered by Neon.

## Features

- **Database-driven content**: All blog posts are now stored in a PostgreSQL database
- **Rich content support**: Write posts in Markdown with full syntax support
- **Multi-author support**: Each post can have multiple authors
- **Internationalization**: Posts can be created in different languages

## Code Example

Here's a simple code example:

\`\`\`javascript
function greet(name) {
  return \`Hello, \${name}!\`;
}

console.log(greet('World'));
\`\`\`

## What's Next?

Stay tuned for more posts about web development, React, TypeScript, and more!`,
			cover_image: '/images/avatar.jpeg',
			published: true,
			locale: 'en',
			author_ids: [defaultAuthor.id]
		}

		const result = await createBlogPost(testPost)

		if (result) {
			console.log('✅ Test post created successfully!')
			console.log(`Visit: http://localhost:3000/en/blog/${result.slug}`)
		} else {
			console.log('❌ Failed to create test post')
		}
	} catch (error) {
		console.error('Error creating test post:', error)
	}
}

addTestPost()
