import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getAllPosts, getPostBySlug } from '@/lib/api-db'
import markdownToHtml from '@/lib/helpers/markdownToHtml'
import Alert from '@/components/blog/alert'
import { PostBodyWithHighlight } from '@/components/blog/post-body-with-highlight'
import { PostHeader } from '@/components/blog/post-header'

export default async function Post(props: Params) {
	const params = await props.params
	const post = await getPostBySlug(params.slug, params.locale)

	if (!post) {
		return notFound()
	}

	const content = await markdownToHtml(post.content || '')

	return (
		<main>
			{/* <Alert preview={post.preview} /> */}
			<article className='mb-32'>
				<PostHeader
					title={post.title}
					coverImage={post.coverImage}
					date={post.date}
					author={post.author}
					slug={post.slug}
				/>
				<PostBodyWithHighlight content={content} />
			</article>
		</main>
	)
}

type Params = {
	params: Promise<{
		locale: string
		slug: string
	}>
}

export async function generateMetadata(props: Params): Promise<Metadata> {
	const params = await props.params
	const post = await getPostBySlug(params.slug, params.locale)

	if (!post) {
		return {
			title: 'Post Not Found | Dmitry Borisenko Blog',
			description: 'The requested blog post could not be found.'
		}
	}

	const title = `${post.title} | Dmitry Borisenko Blog`

	return {
		title,
		description: post.excerpt,
		openGraph: {
			title,
			description: post.excerpt,
			images: [post.ogImage.url]
		}
	}
}

export async function generateStaticParams() {
	try {
		// Generate static params for both locales
		const englishPosts = await getAllPosts('en')
		const russianPosts = await getAllPosts('ru')

		const params = [
			...englishPosts.map(post => ({
				locale: 'en',
				slug: post.slug
			})),
			...russianPosts.map(post => ({
				locale: 'ru',
				slug: post.slug
			}))
		]

		console.log(`Generated static params for ${params.length} blog posts`)
		return params
	} catch (error) {
		console.error('Error generating static params for blog posts:', error)
		// Return empty array if there's an error - pages will be generated on-demand
		return []
	}
}

// Enable ISR with 1 hour revalidation
export const revalidate = 3600
