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

const IMAGE_MIME_TYPES: Record<string, string> = {
	png: 'image/png',
	jpg: 'image/jpeg',
	jpeg: 'image/jpeg',
	webp: 'image/webp',
	gif: 'image/gif'
}

const imageMimeType = (url: string) => {
	const ext = url.split('.').pop()?.toLowerCase() ?? ''
	return IMAGE_MIME_TYPES[ext] ?? 'image/png'
}

/**
 * RSS-фид блога — Яндекс.Вебмастер использует его как канал «Свежее и
 * актуальное»: с фидом робот узнаёт о новых статьях за часы, а не дни.
 * Отдаёт все посты (getAllPostsFromFiles уже сортирует от новых к старым).
 */
export async function GET() {
	const posts = getAllPostsFromFiles()

	const items = posts
		.map(post => {
			const imageUrl = `${BASE_URL}${post.coverImage}`
			const imageType = imageMimeType(post.coverImage)

			return `
		<item>
			<title>${escapeXml(post.title)}</title>
			<link>${BASE_URL}/blog/${post.slug}</link>
			<guid isPermaLink="true">${BASE_URL}/blog/${post.slug}</guid>
			<pubDate>${new Date(post.date).toUTCString()}</pubDate>
			<description>${escapeXml(post.excerpt)}</description>
			<enclosure url="${imageUrl}" type="${imageType}" length="0"/>
			<media:content url="${imageUrl}" type="${imageType}" medium="image"/>
		</item>`
		})
		.join('')

	const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:media="http://search.yahoo.com/mrss/">
	<channel>
		<title>PixelTool — Блог</title>
		<link>${BASE_URL}/blog</link>
		<description>Разборы и инструкции: расчёты, единицы измерения, работа с текстом и форматами данных</description>
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
