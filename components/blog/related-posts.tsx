import Link from 'next/link'
import { getAllPosts } from '@/lib/api-db'
import type { Post } from '@/lib/types/post'

interface Props {
	post: Post
}

/**
 * Перелинковка статей. Связи заданы вручную во frontmatter (поле related):
 * подобранные по смыслу ссылки полезнее «похожих» статей, вычисленных
 * автоматически. Если поле не заполнено — показываем свежие остальные статьи,
 * чтобы блок не пропадал.
 */
export async function RelatedPosts({ post }: Props) {
	const all = await getAllPosts()

	const byRelated = (post.related ?? [])
		.map(slug => all.find(p => p.slug === slug))
		.filter((p): p is Post => Boolean(p) && p!.slug !== post.slug)

	const related =
		byRelated.length > 0
			? byRelated.slice(0, 3)
			: all.filter(p => p.slug !== post.slug).slice(0, 3)

	if (related.length === 0) return null

	return (
		<section className='mt-16 border-t pt-10'>
			<h2 className='text-2xl font-bold tracking-tight'>Читайте также</h2>

			<div className='mt-6 grid gap-4 md:grid-cols-3'>
				{related.map(item => (
					<Link
						key={item.slug}
						href={`/blog/${item.slug}`}
						className='group block cursor-pointer rounded-xl border bg-card p-4 transition-colors hover:border-primary/40'
					>
						<h3 className='text-base font-semibold transition-colors group-hover:text-primary'>
							{item.title}
						</h3>
						<p className='mt-2 line-clamp-3 text-sm text-muted-foreground'>
							{item.excerpt}
						</p>
					</Link>
				))}
			</div>
		</section>
	)
}
