import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getAllPosts, getPostBySlug } from '@/lib/api-db'
import markdownToHtml from '@/lib/helpers/markdownToHtml'
import Alert from '@/components/blog/alert'
import { PostBodyWithHighlight } from '@/components/blog/post-body-with-highlight'
import { PostHeader } from '@/components/blog/post-header'
import { Breadcrumbs } from '@/components/seo/Breadcrumbs'
import { ProjectsRightSidebar } from '@/components/sidebars'
import { RelatedPosts } from '@/components/blog/related-posts'

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

	return (
		<>
			{/* Обычный <script> (не next/script) — BlogPosting попадает в SSR-HTML */}
			<script
				type='application/ld+json'
				dangerouslySetInnerHTML={{
					__html: JSON.stringify(structuredData)
				}}
			/>
			<main className='mx-auto max-w-6xl px-4 sm:px-6 lg:px-8'>
				<Breadcrumbs
					items={[
						{ name: 'Главная', url: '/' },
						{ name: 'Блог', url: '/blog' },
						{ name: post.title, url: `/blog/${post.slug}` }
					]}
				/>
				{/* <Alert preview={post.preview} /> */}
				{post.demo && (
					<div className='mt-6 rounded-lg border border-dashed border-amber-500/50 bg-amber-500/10 px-4 py-2.5 text-sm text-amber-700 dark:text-amber-400'>
						Демо-версия — статья про тул, который ещё не утверждён финально и не
						опубликован на прод.
					</div>
				)}
				{/* Сайдбар прячем на узких экранах: в статье он второстепенен,
				    а текст важнее — на мобильном он бы вытеснил чтение */}
				<div className='flex gap-8'>
					<article className='mb-32 min-w-0 flex-1'>
						<PostHeader
							title={post.title}
							coverImage={post.coverImage}
							date={post.date}
							author={post.author}
							slug={post.slug}
						/>
						<PostBodyWithHighlight content={content} />
						<RelatedPosts post={post} />
					</article>

					<div className='hidden lg:block'>
						{/* top-24 = высота хедера (h-20/5rem) + отступ — иначе сайдбар
						    прилипает выше хедера и уезжает под него при скролле */}
						<div className='sticky top-24'>
							<ProjectsRightSidebar boundedHeight={false} />
						</div>
					</div>
				</div>
			</main>
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
			title: 'Статья не найдена',
			description: 'Запрошенная статья не найдена.'
		}
	}

	const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://pixeltool.pro'
	const articleUrl = `${baseUrl}/blog/${post.slug}`
	const title = post.title
	const imageUrl = post.coverImage
		? `${baseUrl}${post.coverImage}`
		: `${baseUrl}/og-image.png`
	// Обложки статей — 16:9, а не 1.91:1 как og-image.png. Врать в width/height
	// нельзя: соцсети, которые доверяют мета-тегам, а не реальным пропорциям
	// файла (не все перепроверяют), обрежут картинку под неверное соотношение.
	const imageWidth = post.coverImage ? 1600 : 1200
	const imageHeight = post.coverImage ? 900 : 630

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
					width: imageWidth,
					height: imageHeight,
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
		robots: post.demo
			? { index: false, follow: false }
			: {
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

// Только слаги из generateStaticParams. Без этого любой несуществующий слаг
// попадал в рендер страницы, notFound() внутри ISR-маршрута кэшировался как
// обычный ответ и отдавался с кодом 200 (soft-404: Google видит «страницу»
// вместо ошибки). Статьи лежат файлами в репозитории и появляются только
// вместе с новым билдом, так что закрытый список ничего не ломает.
export const dynamicParams = false
