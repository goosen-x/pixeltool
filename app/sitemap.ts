import { MetadataRoute } from 'next'
import { getAllPostsFromFiles } from '@/lib/api-file'
import { widgets } from '@/lib/constants/widgets'
import { CATEGORY_KEYS } from '@/lib/constants/categories'
import { buildWidgetOgImagePath } from '@/lib/seo/build-widget-metadata'

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://pixeltool.pro'

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
const CONTENT_LAST_UPDATED = '2026-07-04'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
	// Get all blog posts
	const posts = getAllPostsFromFiles()

	// Static routes
	const staticRoutes = ['', '/contact', '/blog', '/tools', '/settings']

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
	// images — расширение sitemap для картиночного поиска (Google/Yandex Images):
	// та же превьюшка /api/og, что отдаётся в og:image, здесь явно заявлена
	// как изображение страницы, чтобы боты картинок её обязательно нашли.
	widgets.forEach(widget => {
		sitemapEntries.push({
			url: `${BASE_URL}/tools/${widget.path}`,
			lastModified: widget.updatedAt || CONTENT_LAST_UPDATED,
			changeFrequency: 'monthly',
			priority: 0.9,
			images: [`${BASE_URL}${buildWidgetOgImagePath(widget)}`]
		})
	})

	// Add blog post routes — реальная дата из фронтматтера поста
	posts.forEach(post => {
		const hasRealCover =
			Boolean(post.coverImage) && post.coverImage !== '/images/avatar.jpeg'

		sitemapEntries.push({
			url: `${BASE_URL}/blog/${post.slug}`,
			lastModified: post.date,
			changeFrequency: 'monthly',
			priority: 0.7,
			...(hasRealCover && { images: [`${BASE_URL}${post.coverImage}`] })
		})
	})

	return sitemapEntries
}
