import { getAllPosts } from '@/lib/api-db'
import { RelatedPostsCarousel } from './related-posts-carousel'
import type { Post } from '@/lib/types/post'

interface Props {
	post: Post
}

const MIN_RELATED = 3

/**
 * Перелинковка статей. Связи заданы вручную во frontmatter (поле related):
 * подобранные по смыслу ссылки полезнее «похожих» статей, вычисленных
 * автоматически. Если ручных связей меньше MIN_RELATED (поле не заполнено
 * или заполнено частично) — добиваем список свежими остальными статьями,
 * чтобы в каждой статье было гарантированно минимум 3 карточки.
 */
export async function RelatedPosts({ post }: Props) {
	const all = await getAllPosts()

	const byRelated = (post.related ?? [])
		.map(slug => all.find(p => p.slug === slug))
		.filter((p): p is Post => Boolean(p) && p!.slug !== post.slug)

	const related = [...byRelated]
	if (related.length < MIN_RELATED) {
		const usedSlugs = new Set([post.slug, ...related.map(p => p.slug)])
		const fillers = all.filter(p => !usedSlugs.has(p.slug))
		related.push(...fillers.slice(0, MIN_RELATED - related.length))
	}

	if (related.length === 0) return null

	// Та же центрированная колонка, что у текста и обложки
	return (
		<section className='mx-auto mt-16 max-w-3xl border-t pt-10'>
			<h2 className='text-2xl font-bold tracking-tight'>Читайте также</h2>
			<RelatedPostsCarousel posts={related} />
		</section>
	)
}
