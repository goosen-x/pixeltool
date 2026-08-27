import { getAllPosts } from '@/lib/api-db'
import { PostPreview } from '@/components/blog/post-preview'
import { Metadata } from 'next'
import Script from 'next/script'

type Props = {
	params: Promise<{
		locale: string
	}>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
	const { locale } = await params
	const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://pixeltool.pro'
	const url = `${baseUrl}/blog`

	const currentMetadata = {
		title: 'Блог: разборы и инструкции по инструментам PixelTool',
		description:
			'Разборы и инструкции: единицы измерения, расчёты для здоровья, QR-коды и пароли, работа с текстом, CSS и форматы данных. С примерами и без лишней теории.'
	}

	return {
		title: currentMetadata.title,
		description: currentMetadata.description,
		// keywords не задаём по той же причине, что и в корневом layout: тег
		// поисковики игнорируют, а прежний список сужал блог до фронтенда,
		// хотя половина статей о расчётах, единицах и работе с текстом.
		openGraph: {
			title: currentMetadata.title,
			description: currentMetadata.description,
			url: url,
			siteName: 'PixelTool',
			locale: 'ru_RU',
			type: 'website',
			images: [
				{
					url: `/api/og?title=${encodeURIComponent('Блог')}&description=${encodeURIComponent(currentMetadata.description)}&locale=${locale}`,
					width: 1200,
					height: 630
				}
			]
		},
		twitter: {
			card: 'summary_large_image',
			title: currentMetadata.title,
			description: currentMetadata.description,
			images: [
				`/api/og?title=${encodeURIComponent('Блог')}&description=${encodeURIComponent(currentMetadata.description)}&locale=${locale}`
			],
			creator: '@pixeltool',
			site: '@pixeltool'
		},
		alternates: {
			canonical: url
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

export default async function Blog(props: Props) {
	// Статьи про демо-тулы (Post['demo']) не публикуются в листинге, пока тул
	// не утверждён финально — см. lib/constants/widgets/index.ts Widget['demo'].
	const posts = (await getAllPosts()).filter(post => !post.demo)
	const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://pixeltool.pro'

	// JSON-LD structured data for blog listing
	const structuredData = {
		'@context': 'https://schema.org',
		'@type': 'Blog',
		name: 'PixelTool Блог',
		description:
			'Разборы и инструкции: расчёты, единицы измерения, текст, CSS и форматы данных',
		url: `${baseUrl}/blog`,
		publisher: {
			'@type': 'Organization',
			name: 'PixelTool',
			logo: {
				'@type': 'ImageObject',
				url: `${baseUrl}/og-image.png`
			}
		},
		inLanguage: 'ru-RU',
		blogPost: posts.slice(0, 10).map(post => ({
			'@type': 'BlogPosting',
			headline: post.title,
			description: post.excerpt,
			url: `${baseUrl}/blog/${post.slug}`,
			datePublished: post.date,
			author: {
				'@type': 'Person',
				name: post.author.name,
				url: `${baseUrl}/blog/author`
			}
		}))
	}

	return (
		<>
			<Script
				id='blog-structured-data'
				type='application/ld+json'
				dangerouslySetInnerHTML={{
					__html: JSON.stringify(structuredData)
				}}
			/>
			<main>
				<div className='max-w-7xl mx-auto px-5 pt-12'>
					<div className='text-center mb-12'>
						<h1 className='text-4xl md:text-6xl font-bold text-foreground mb-4'>
							Блог
						</h1>
						<p className='text-xl text-muted-foreground max-w-2xl mx-auto'>
							Разборы и инструкции: расчёты, единицы измерения, работа с
							текстом, CSS и форматы данных
						</p>
					</div>
					<section>
						{posts.length === 0 ? (
							<div className='text-center py-16'>
								<p className='text-xl text-gray-600'>
									Пока нет опубликованных постов
								</p>
							</div>
						) : (
							<div className='grid grid-cols-1 md:grid-cols-2 md:gap-x-16 lg:gap-x-32 gap-y-20 md:gap-y-32 mb-32'>
								{posts.map(post => (
									<PostPreview
										key={post.slug}
										title={post.title}
										coverImage={post.coverImage}
										date={post.date}
										author={post.author}
										slug={post.slug}
										excerpt={post.excerpt}
									/>
								))}
							</div>
						)}
					</section>
				</div>
			</main>
		</>
	)
}

// Generate static params for both locales
export async function generateStaticParams() {
	return [{ locale: 'ru' }]
}

// Enable ISR with 30 minutes revalidation for blog listing
export const revalidate = 1800
