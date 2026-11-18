import { getAllPosts } from '@/lib/api-db'
import { BlogListing } from '@/components/blog/blog-listing'
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
			'Разборы и инструкции: единицы измерения, расчёты для здоровья, QR-коды и пароли, работа с текстом и форматами данных. С примерами и без лишней теории.'
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
			creator: '@goose_labs',
			site: '@goose_labs'
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
			'Разборы и инструкции: расчёты, единицы измерения, работа с текстом и форматами данных',
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
				<div className='max-w-7xl mx-auto px-5 pt-10 pb-24'>
					<div className='mb-10 lg:mb-12'>
						<h1 className='text-5xl md:text-7xl font-bold tracking-tight text-foreground'>
							Блог
						</h1>
						<p className='mt-4 max-w-2xl text-lg text-muted-foreground'>
							Разборы и инструкции: расчёты, единицы измерения, работа с текстом
							и форматами данных
						</p>
					</div>
					{posts.length === 0 ? (
						<div className='text-center py-16'>
							<p className='text-xl text-muted-foreground'>
								Пока нет опубликованных постов
							</p>
						</div>
					) : (
						// В клиент уходят только поля карточки: тексты статей (content)
						// раздули бы RSC-пейлоад листинга на сотни килобайт.
						<BlogListing
							posts={posts.map(post => ({
								slug: post.slug,
								title: post.title,
								excerpt: post.excerpt,
								date: post.date,
								coverImage: post.coverImage,
								category: post.category
							}))}
						/>
					)}
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
