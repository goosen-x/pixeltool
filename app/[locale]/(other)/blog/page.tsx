import { getAllPosts } from '@/lib/api-db'
import { PostPreview } from '@/components/blog/post-preview'
import { getTranslations } from 'next-intl/server'
import { Metadata } from 'next'

type Props = {
	params: Promise<{
		locale: string
	}>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
	const { locale } = await params
	const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://pixeltool.pro'
	const url = `${baseUrl}/${locale}/blog`

	const metadata = {
		en: {
			title: 'Blog - Developer Tutorials & Guides | PixelTool',
			description:
				'Read our latest articles about web development, CSS techniques, JavaScript tutorials, and developer tools. Learn from practical examples and code snippets.'
		},
		ru: {
			title: 'Блог - Туториалы и Руководства для Разработчиков | PixelTool',
			description:
				'Читайте наши статьи о веб-разработке, CSS техниках, JavaScript туториалах и инструментах разработчика. Учитесь на практических примерах и фрагментах кода.'
		}
	}

	const currentMetadata =
		metadata[locale as keyof typeof metadata] || metadata.en

	return {
		title: currentMetadata.title,
		description: currentMetadata.description,
		openGraph: {
			title: currentMetadata.title,
			description: currentMetadata.description,
			url: url,
			siteName: 'PixelTool',
			locale: locale === 'ru' ? 'ru_RU' : 'en_US',
			type: 'website',
			images: [
				{
					url: `/api/og?title=${encodeURIComponent(locale === 'ru' ? 'Блог' : 'Blog')}&description=${encodeURIComponent(currentMetadata.description)}&locale=${locale}`,
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
				`/api/og?title=${encodeURIComponent(locale === 'ru' ? 'Блог' : 'Blog')}&description=${encodeURIComponent(currentMetadata.description)}&locale=${locale}`
			]
		},
		alternates: {
			canonical: url,
			languages: {
				en: `${baseUrl}/en/blog`,
				ru: `${baseUrl}/ru/blog`
			}
		}
	}
}

export default async function Blog(props: Props) {
	const params = await props.params
	const t = await getTranslations('blog')

	const posts = await getAllPosts(params.locale)

	return (
		<main>
			<div className='max-w-7xl mx-auto px-5 pt-12'>
				<section>
					{posts.length === 0 ? (
						<div className='text-center py-16'>
							<p className='text-xl text-gray-600'>{t('noPosts')}</p>
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
	)
}

// Generate static params for both locales
export async function generateStaticParams() {
	return [{ locale: 'en' }, { locale: 'ru' }]
}

// Enable ISR with 30 minutes revalidation for blog listing
export const revalidate = 1800
