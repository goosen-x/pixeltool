import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getAllPosts, getPostBySlug } from '@/lib/api-db'
import markdownToHtml from '@/lib/helpers/markdownToHtml'
import Alert from '@/components/blog/alert'
import { PostBodyWithHighlight } from '@/components/blog/post-body-with-highlight'
import { PostHeader } from '@/components/blog/post-header'
import { Footer } from '@/components/layout'
import Script from 'next/script'

export default async function Post(props: Params) {
	const params = await props.params
	const post = await getPostBySlug(params.slug)

	if (!post) {
		return notFound()
	}

	const content = await markdownToHtml(post.content || '')
	const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://pixeltool.pro'
	const articleUrl = `${baseUrl}/blog/${post.slug}`

	// JSON-LD structured data for SEO
	const structuredData = {
		'@context': 'https://schema.org',
		'@type': 'BlogPosting',
		headline: post.title,
		description: post.excerpt,
		image: post.coverImage
			? `${baseUrl}${post.coverImage}`
			: `${baseUrl}/og-image.png`,
		datePublished: post.date,
		dateModified: post.date,
		author: {
			'@type': 'Person',
			name: post.author.name,
			image: post.author.picture
				? `${baseUrl}${post.author.picture}`
				: undefined,
			url: baseUrl
		},
		publisher: {
			'@type': 'Organization',
			name: 'PixelTool',
			logo: {
				'@type': 'ImageObject',
				url: `${baseUrl}/og-image.png`
			}
		},
		mainEntityOfPage: {
			'@type': 'WebPage',
			'@id': articleUrl
		},
		inLanguage: 'ru-RU'
	}

	const breadcrumbData = {
		'@context': 'https://schema.org',
		'@type': 'BreadcrumbList',
		itemListElement: [
			{
				'@type': 'ListItem',
				position: 1,
				name: 'Главная',
				item: baseUrl
			},
			{
				'@type': 'ListItem',
				position: 2,
				name: 'Блог',
				item: `${baseUrl}/blog`
			},
			{
				'@type': 'ListItem',
				position: 3,
				name: post.title,
				item: articleUrl
			}
		]
	}

	return (
		<>
			<Script
				id='article-structured-data'
				type='application/ld+json'
				dangerouslySetInnerHTML={{
					__html: JSON.stringify(structuredData)
				}}
			/>
			<Script
				id='breadcrumb-structured-data'
				type='application/ld+json'
				dangerouslySetInnerHTML={{
					__html: JSON.stringify(breadcrumbData)
				}}
			/>
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
			<Footer />
		</>
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
	const post = await getPostBySlug(params.slug)

	if (!post) {
		return {
			title: 'Статья не найдена | PixelTool Блог',
			description: 'Запрошенная статья не найдена.'
		}
	}

	const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://pixeltool.pro'
	const articleUrl = `${baseUrl}/blog/${post.slug}`
	const title = `${post.title} | PixelTool`
	const imageUrl = post.coverImage
		? `${baseUrl}${post.coverImage}`
		: `${baseUrl}/og-image.png`

	return {
		title,
		description: post.excerpt,
		authors: [
			{
				name: post.author.name,
				url: baseUrl
			}
		],
		creator: post.author.name,
		publisher: 'PixelTool',
		openGraph: {
			type: 'article',
			title,
			description: post.excerpt,
			url: articleUrl,
			siteName: 'PixelTool',
			locale: 'ru_RU',
			images: [
				{
					url: imageUrl,
					width: 1200,
					height: 630,
					alt: post.title
				}
			],
			publishedTime: post.date,
			modifiedTime: post.date,
			authors: [post.author.name]
		},
		twitter: {
			card: 'summary_large_image',
			title,
			description: post.excerpt,
			images: [imageUrl],
			creator: '@pixeltool',
			site: '@pixeltool'
		},
		alternates: {
			canonical: articleUrl
		},
		robots: {
			index: true,
			follow: true,
			googleBot: {
				index: true,
				follow: true,
				'max-video-preview': -1,
				'max-image-preview': 'large',
				'max-snippet': -1
			}
		}
	}
}

export async function generateStaticParams() {
	try {
		const posts = await getAllPosts()

		const params = posts.map(post => ({
			locale: 'ru',
			slug: post.slug
		}))

		console.log(`Generated static params for ${params.length} blog posts`)
		return params
	} catch (error) {
		console.error('Error generating static params for blog posts:', error)
		return []
	}
}

// Enable ISR with 1 hour revalidation
export const revalidate = 3600
