import { MetadataRoute } from 'next'
import { getAllPostsFromFiles } from '@/lib/api-file'
import { publicWidgets } from '@/lib/constants/widgets'
import { CATEGORY_KEYS } from '@/lib/constants/categories'
import { unitPairs } from '@/lib/constants/unit-pairs'
import { ZODIAC_PAGES } from '@/lib/constants/zodiac-pages'
import { GEOMETRY_PAGES } from '@/lib/constants/geometry-pages'

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://pixeltool.pro'

// Картинки (images[]) из sitemap убраны намеренно. Next.js сериализует их
// как <image:image> сразу после <loc>, то есть ПЕРЕД <lastmod>, а схема
// sitemaps.org требует обратного порядка: сначала базовые теги, расширения
// в конце. Google такой файл принимал, Яндекс.Вебмастер сообщал «Обнаружены
// ошибки в файлах Sitemap». Вернуть картинки можно только собственной
// сериализацией XML в route-хендлере — но заявлять там было нечего:
// у инструментов это автогенерённая OG-карточка из /api/og, в картиночном
// поиске она бесполезна, а обложки статей и так объявлены в og:image
// и в разметке самой страницы.

/**
 * Дата последнего значимого обновления статических страниц и инструментов.
 *
 * lastmod должен быть СТАБИЛЬНЫМ между билдами и меняться только при реальной
 * правке контента. Google доверяет lastmod по принципу «всё или ничего»: если
 * даты недостоверны (например, меняются на каждом деплое), он игнорирует сигнал
 * по всему сайту. Значимым считается изменение основного контента, structured
 * data или ссылок — не правка копирайта или пересборка.
 *
 * Обновляй руками при значимых изменениях набора инструментов/статики.
 * Дату отдельного инструмента можно переопределить через widget.updatedAt.
 */
const CONTENT_LAST_UPDATED = '2026-08-27'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
	// Get all blog posts
	// Статьи про демо-тулы (Post['demo']) не публикуются в sitemap — см.
	// Widget['demo'] в lib/constants/widgets/index.ts.
	const posts = getAllPostsFromFiles().filter(post => !post.demo)

	// Static routes
	// /settings сюда сознательно не входит — у неё noindex (app/settings/layout.tsx),
	// присутствие в sitemap.xml противоречило бы этому и путало Google (Ahrefs issue
	// "Noindex page in sitemap", 01.08.2026).
	const staticRoutes = [
		'',
		'/contact',
		'/blog',
		'/blog/author',
		'/tools',
		'/about',
		'/privacy',
		'/terms'
	]

	const sitemapEntries: MetadataRoute.Sitemap = []

	// Add static routes
	staticRoutes.forEach(route => {
		sitemapEntries.push({
			url: `${BASE_URL}${route}`,
			lastModified: CONTENT_LAST_UPDATED,
			changeFrequency: route === '' ? 'weekly' : 'monthly',
			priority: route === '' ? 1.0 : route === '/tools' ? 0.9 : 0.8
		})
	})

	// Страницы категорий (/tools/css и подобные) — у каждой свой заголовок,
	// текст и список инструментов, поэтому они индексируются отдельно.
	CATEGORY_KEYS.forEach(category => {
		sitemapEntries.push({
			url: `${BASE_URL}/tools/${category}`,
			lastModified: CONTENT_LAST_UPDATED,
			changeFrequency: 'monthly',
			priority: 0.8
		})
	})

	// Add widget routes — стабильная дата, с переопределением на уровне тула.
	// changeFrequency: 'monthly' — инструменты меняются редко, «weekly» вводил бы
	// в заблуждение.
	publicWidgets.forEach(widget => {
		sitemapEntries.push({
			url: `${BASE_URL}/tools/${widget.path}`,
			lastModified: widget.updatedAt || CONTENT_LAST_UPDATED,
			changeFrequency: 'monthly',
			priority: 0.9
		})
	})

	// Страницы пар единиц (/tools/unit-converter/мм-в-дюймы и т.п.) — не входят
	// в publicWidgets (это не отдельные тулы, а SEO-страницы одного хаба), тот
	// же паттерн, что у CATEGORY_KEYS выше.
	unitPairs.forEach(pair => {
		sitemapEntries.push({
			url: `${BASE_URL}/tools/unit-converter/${pair.slug}`,
			lastModified: CONTENT_LAST_UPDATED,
			changeFrequency: 'monthly',
			priority: 0.8
		})
	})

	// Страницы отдельных знаков (/tools/zodiac-sign/lev и т.п.) — тот же
	// паттерн, что у пар единиц: не самостоятельные тулы, а SEO-страницы
	// одного хаба, поэтому в publicWidgets их нет.
	ZODIAC_PAGES.forEach(page => {
		sitemapEntries.push({
			url: `${BASE_URL}/tools/zodiac-sign/${page.id}`,
			lastModified: CONTENT_LAST_UPDATED,
			changeFrequency: 'monthly',
			priority: 0.8
		})
	})

	// Страницы отдельных фигур (/tools/volume-calculator/cilindra и т.п.) —
	// тот же паттерн, что у пар единиц и знаков зодиака: SEO-страницы одного
	// хаба, в publicWidgets их нет.
	GEOMETRY_PAGES.forEach(page => {
		sitemapEntries.push({
			url: `${BASE_URL}/tools/${page.kind === 'area' ? 'area-calculator' : 'volume-calculator'}/${page.slug}`,
			lastModified: CONTENT_LAST_UPDATED,
			changeFrequency: 'monthly',
			priority: 0.8
		})
	})

	// Add blog post routes — реальная дата из фронтматтера поста
	posts.forEach(post => {
		sitemapEntries.push({
			url: `${BASE_URL}/blog/${post.slug}`,
			lastModified: post.date,
			changeFrequency: 'monthly',
			priority: 0.7
		})
	})

	return sitemapEntries
}
