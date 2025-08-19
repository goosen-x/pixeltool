import { createBlogPost } from '../db/blog'
import fs from 'fs/promises'
import path from 'path'

async function addLiveCodeExamplePost() {
	try {
		// Read the example markdown file
		const examplePath = path.join(process.cwd(), '_posts/live-code-demo.md')
		const content = await fs.readFile(examplePath, 'utf-8')

		// Create the blog post
		const postData = {
			slug: 'interactive-code-examples-live-preview-demo',
			title: 'Interactive Code Examples: Live Preview Demo',
			excerpt:
				'See how our new live code preview feature works with interactive HTML, CSS, and JavaScript examples you can edit and run in real-time.',
			content: content,
			cover_image: '/images/avatar.jpeg',
			published: true,
			locale: 'en',
			author_ids: [1] // Default author (Dmitry Borisenko)
		}

		const result = await createBlogPost(postData)
		if (!result) {
			throw new Error('Failed to create blog post')
		}
		console.log('✅ Live code example post created successfully!')
		console.log('Post ID:', result.id)
		console.log('Slug:', result.slug)
		console.log('URL: http://localhost:3000/en/blog/' + result.slug)

		// Also create Russian version
		const ruPostData = {
			...postData,
			slug: 'interactive-code-examples-live-preview-demo',
			locale: 'ru',
			title: 'Интерактивные примеры кода: демонстрация живого превью',
			excerpt:
				'Посмотрите, как работает наша новая функция предварительного просмотра кода с интерактивными примерами HTML, CSS и JavaScript, которые можно редактировать и запускать в реальном времени.'
		}

		const ruResult = await createBlogPost(ruPostData)
		if (!ruResult) {
			throw new Error('Failed to create Russian blog post')
		}
		console.log('✅ Russian version created!')
		console.log('URL: http://localhost:3000/ru/blog/' + ruResult.slug)
	} catch (error) {
		console.error('❌ Error creating post:', error)
		process.exit(1)
	}
}

// Run the script
addLiveCodeExamplePost()
