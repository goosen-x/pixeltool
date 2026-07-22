import { getAllPostsFromFiles } from '@/lib/api-file'

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://pixeltool.pro'

// Экранируем спецсимволы XML — заголовок/анонс статьи может содержать
// `&`, `<`, `>`, кавычки (например «px & rem»), без этого фид не парсится.
const escapeXml = (s: string) =>
	s
		.replace(/&/g, '&amp;')
		.replace(/</g, '&lt;')
		.replace(/>/g, '&gt;')
		.replace(/"/g, '&quot;')
		.replace(/'/g, '&apos;')

/**
 * RSS-фид блога — Яндекс.Вебмастер использует его как канал «Свежее и
 * актуальное»: с фидом робот узнаёт о новых статьях за часы, а не дни.
 * Отдаёт все посты (getAllPostsFromFiles уже сортирует от новых к старым).
 */
export async function GET() {
	const posts = getAllPostsFromFiles()

	const items = posts
		.map(
			post => `
		<item>
			<title>${escapeXml(post.title)}</title>
			<link>${BASE_URL}/blog/${post.slug}</link>
			<guid isPermaLink="true">${BASE_URL}/blog/${post.slug}</guid>
			<pubDate>${new Date(post.date).toUTCString()}</pubDate>
			<description>${escapeXml(post.excerpt)}</description>
		</item>`
		)
		.join('')

	const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
	<channel>
		<title>PixelTool — Блог</title>
		<link>${BASE_URL}/blog</link>
		<description>Статьи о вёрстке, CSS, HTML и веб-разработке от PixelTool</description>
		<language>ru</language>
		<atom:link xmlns:atom="http://www.w3.org/2005/Atom" href="${BASE_URL}/rss.xml" rel="self" type="application/rss+xml"/>${items}
	</channel>
</rss>`

	return new Response(rss, {
		headers: {
			'Content-Type': 'application/rss+xml; charset=utf-8'
		}
	})
}
