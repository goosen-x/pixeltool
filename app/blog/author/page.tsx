import { Metadata } from 'next'
import { getAllPosts } from '@/lib/api-db'
import { PostCard } from '@/components/blog/blog-listing'
import { OptimizedImage } from '@/components/ui/optimized-image'
import { socials } from '@/lib/constants/socials'

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://pixeltool.pro'
const AUTHOR_NAME = 'Дмитрий Борисенко'
const AUTHOR_PICTURE = '/images/avatar.jpeg'
const PAGE_URL = `${BASE_URL}/blog/author`
const SPEAKER_PAGE_URL = 'https://css.moscow/speakers/dmitry-borisenko/'

export const metadata: Metadata = {
	title: 'Дмитрий Борисенко — автор PixelTool',
	description:
		'Дмитрий Борисенко, CEO студии GooseLabs, которая делает PixelTool. Пишет статьи блога. Все статьи автора и ссылки на профили.',
	alternates: { canonical: '/blog/author' },
	openGraph: {
		title: 'Дмитрий Борисенко — автор PixelTool',
		description:
			'CEO студии GooseLabs, которая делает PixelTool. Пишет статьи блога.',
		url: PAGE_URL,
		siteName: 'PixelTool',
		type: 'profile',
		locale: 'ru_RU',
		images: [
			{
				url: `${BASE_URL}/api/og?title=${encodeURIComponent('Дмитрий Борисенко')}&description=${encodeURIComponent('CEO студии GooseLabs')}&locale=ru`,
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
		jobTitle: 'CEO',
		worksFor: {
			'@type': 'Organization',
			name: 'GooseLabs',
			url: 'https://gooselabs.ru'
		},
		sameAs: [...socials.map(social => social.href), SPEAKER_PAGE_URL]
	}

	return (
		<>
			<script
				type='application/ld+json'
				dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
			/>
			<main>
				<div className='max-w-3xl mx-auto px-5 pt-12'>
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
							CEO студии{' '}
							<a
								href='https://gooselabs.ru/?utm_source=pixeltool&utm_medium=referral&utm_campaign=author_page'
								target='_blank'
								rel='noopener'
								className='cursor-pointer text-foreground underline-offset-4 hover:text-primary hover:underline'
							>
								GooseLabs
							</a>
						</p>
					</div>

					<div className='max-w-xl mx-auto text-center mb-8 space-y-4 text-foreground/90'>
						<p>
							PixelTool делает наша студия GooseLabs. Задача сайта простая:
							чтобы нужный калькулятор, конвертер или генератор открывался сразу
							в браузере, без установки и регистрации.
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

					<section className='mb-16'>
						<h2 className='text-xl font-bold mb-4 text-center'>Выступления</h2>
						<a
							href={SPEAKER_PAGE_URL}
							target='_blank'
							rel='noopener'
							className='group block cursor-pointer rounded-2xl border border-border/60 bg-card p-5 transition-colors hover:border-primary/40'
						>
							<div className='font-semibold group-hover:text-primary transition-colors'>
								Сила псевдоселекторов в современном CSS
							</div>
							<div className='mt-1 text-sm text-muted-foreground'>
								Moscow CSS #29, Школа 21 · 6 ноября 2025
							</div>
						</a>
					</section>
				</div>

				{/* Статьи шире шапки профиля: сетка в ширину блога, те же карточки,
				    что в листинге /blog. */}
				<section className='max-w-7xl mx-auto px-5 pb-24'>
					<h2 className='text-2xl font-bold mb-8'>
						Статьи{' '}
						<span className='text-muted-foreground font-normal'>
							{posts.length}
						</span>
					</h2>
					{posts.length === 0 ? (
						<p className='text-muted-foreground'>
							Пока нет опубликованных статей
						</p>
					) : (
						<div className='grid gap-6 sm:grid-cols-2 lg:grid-cols-3'>
							{posts.map(post => (
								<PostCard
									key={post.slug}
									post={{
										slug: post.slug,
										title: post.title,
										excerpt: post.excerpt,
										date: post.date,
										coverImage: post.coverImage,
										category: post.category
									}}
								/>
							))}
						</div>
					)}
				</section>
			</main>
		</>
	)
}

export const revalidate = 1800
