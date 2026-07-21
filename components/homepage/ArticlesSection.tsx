import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { getAllPosts } from '@/lib/api-db'
import { PostPreview } from '@/components/blog/post-preview'

const DISPLAY_LIMIT = 3

export async function ArticlesSection() {
	const posts = (await getAllPosts()).slice(0, DISPLAY_LIMIT)

	if (posts.length === 0) return null

	return (
		<section className='relative px-4 py-12 sm:px-6 sm:py-16 lg:px-8'>
			<div className='mx-auto max-w-7xl'>
				<div className='mb-8 text-center sm:mb-12'>
					<h2 className='mb-4 font-heading text-3xl font-bold text-balance sm:text-4xl lg:text-5xl'>
						Гайды и статьи
					</h2>
					<p className='mx-auto max-w-3xl text-base text-muted-foreground sm:text-lg'>
						Разбираем, как устроены инструменты и задачи, которые они решают
					</p>
				</div>

				<div className='grid gap-8 sm:grid-cols-2 lg:grid-cols-3 lg:gap-10'>
					{posts.map(post => (
						<PostPreview
							key={post.slug}
							title={post.title}
							coverImage={post.coverImage}
							date={post.date}
							excerpt={post.excerpt}
							author={post.author}
							slug={post.slug}
						/>
					))}
				</div>

				<div className='mt-10 text-center sm:mt-12'>
					<Link
						href='/blog'
						className='inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl border-2 border-input bg-background px-5 py-2.5 text-sm font-semibold transition-all duration-200 ease-out hover:border-accent hover:bg-accent hover:text-accent-foreground sm:text-base'
					>
						Все статьи
						<ArrowRight className='h-3.5 w-3.5 sm:h-4 sm:w-4' />
					</Link>
				</div>
			</div>
		</section>
	)
}
