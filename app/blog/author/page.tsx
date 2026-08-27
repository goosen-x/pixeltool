import { Metadata } from 'next'
import { getAllPosts } from '@/lib/api-db'
import { PostPreview } from '@/components/blog/post-preview'
import { OptimizedImage } from '@/components/ui/optimized-image'
import { socials } from '@/lib/constants/socials'

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://pixeltool.pro'
const AUTHOR_NAME = 'Дмитрий Борисенко'
const AUTHOR_PICTURE = '/images/avatar.jpeg'
const PAGE_URL = `${BASE_URL}/blog/author`

export const metadata: Metadata = {
	title: 'Дмитрий Борисенко — автор PixelTool',
	description:
		'Дмитрий Борисенко — разработчик и автор PixelTool: пишет инструменты и статьи блога. Все статьи автора и ссылки на профили.',
	alternates: { canonical: '/blog/author' },
	openGraph: {
		title: 'Дмитрий Борисенко — автор PixelTool',
		description:
			'Разработчик и автор PixelTool: пишет инструменты и статьи блога.',
		url: PAGE_URL,
		siteName: 'PixelTool',
		type: 'profile',
		locale: 'ru_RU',
		images: [
			{
				url: `${BASE_URL}/api/og?title=${encodeURIComponent('Дмитрий Борисенко')}&description=${encodeURIComponent('Автор PixelTool')}&locale=ru`,
				width: 1200,
				height: 630
			}
		]
	},
	robots: {
		index: true,
		follow: true
	}
}

export default async function AuthorPage() {
	const posts = (await getAllPosts()).filter(
		post => !post.demo && post.author.name === AUTHOR_NAME
	)

	const structuredData = {
		'@context': 'https://schema.org',
		'@type': 'Person',
		'@id': `${PAGE_URL}#person`,
		name: AUTHOR_NAME,
		url: PAGE_URL,
		image: `${BASE_URL}${AUTHOR_PICTURE}`,
		jobTitle: 'Разработчик',
		worksFor: {
			'@type': 'Organization',
			name: 'PixelTool',
			url: BASE_URL
		},
		sameAs: socials.map(social => social.href)
	}

	return (
		<>
			<script
				type='application/ld+json'
				dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
			/>
			<main>
				<div className='max-w-3xl mx-auto px-5 pt-12 pb-16'>
					<div className='flex flex-col items-center text-center mb-8'>
						<OptimizedImage
							src={AUTHOR_PICTURE}
							alt={AUTHOR_NAME}
							width={96}
							height={96}
							className='w-24 h-24 rounded-full object-cover mb-4'
						/>
						<h1 className='text-3xl md:text-4xl font-bold tracking-tight mb-2'>
							{AUTHOR_NAME}
						</h1>
						<p className='text-muted-foreground'>
							Разработчик и автор PixelTool
						</p>
					</div>

					<div className='max-w-xl mx-auto text-center mb-8 space-y-4 text-foreground/90'>
						<p>
							Делаю PixelTool сам, от кода инструментов до текстов в блоге.
							Задача сайта простая: чтобы нужный калькулятор, конвертер или
							генератор открывался сразу в браузере, без установки и
							регистрации.
						</p>
						<p>
							В статьях разбираю то же, что и в инструментах: конкретные задачи,
							формулы и цифры, без воды.
						</p>
					</div>

					<div className='flex justify-center gap-3 mb-16'>
						{socials.map(social => (
							<a
								key={social.name}
								href={social.href}
								target='_blank'
								rel='noopener noreferrer'
								title={social.name}
								className='w-11 h-11 flex items-center justify-center rounded-lg border bg-card text-muted-foreground hover:text-primary transition-colors cursor-pointer'
							>
								<span className='text-lg'>{social.icon}</span>
							</a>
						))}
					</div>

					<h2 className='text-2xl font-bold mb-8'>Статьи</h2>
					{posts.length === 0 ? (
						<p className='text-muted-foreground'>
							Пока нет опубликованных статей
						</p>
					) : (
						<div className='grid grid-cols-1 gap-y-16'>
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
				</div>
			</main>
		</>
	)
}

export const revalidate = 1800
