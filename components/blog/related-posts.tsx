import { getAllPosts } from '@/lib/api-db'
import { RelatedPostsCarousel } from './related-posts-carousel'
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

	// Та же центрированная колонка, что у текста и обложки
	return (
		<section className='mx-auto mt-16 max-w-3xl border-t pt-10'>
			<h2 className='text-2xl font-bold tracking-tight'>Читайте также</h2>
			<RelatedPostsCarousel posts={related} />
		</section>
	)
}
