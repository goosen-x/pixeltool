// import { getTranslations } from 'next-intl/server'
import { BlogCarousel } from './widgets/BlogCarousel'
import { getLatestPosts } from '@/lib/actions/posts'

type Props = {
	locale: string
}

export const SectionBlog = async ({ locale }: Props) => {
	// const t = await getTranslations('SectionBlog')

	let posts: any[] = []
	try {
		posts = await getLatestPosts({ limit: 6, locale })
	} catch (error) {
		console.warn('Failed to fetch blog posts:', error)
		// Continue with empty posts array
	}

	if (!posts || posts.length === 0) {
		return null
	}

	return (
		<section id='blog' className='py-16 sm:py-24'>
			<div className='mx-auto max-w-(--breakpoint-xl) px-4 sm:px-6 lg:px-8'>
				<div className='flex flex-col items-center text-center'>
					<h2 className='text-3xl font-heading font-bold tracking-tighter sm:text-4xl md:text-5xl text-foreground'>
						'Последнее из блога'
					</h2>
					<p className='mt-4 max-w-2xl text-gray-600 dark:text-gray-400 md:text-lg'>
						'Инсайты о веб-разработке, паттернах проектирования и технологических трендах'
					</p>
				</div>
				<div className='mt-12'>
					<BlogCarousel posts={posts} locale={locale} />
				</div>
			</div>
		</section>
	)
}
