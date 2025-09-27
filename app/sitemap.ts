import { MetadataRoute } from 'next'
import { getAllPostsFromFiles } from '@/lib/api-file'
import { widgets } from '@/lib/constants/widgets'

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://pixeltool.pro'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
	// Get all blog posts
	const posts = getAllPostsFromFiles()

	// Static routes
	const staticRoutes = ['', '/contact', '/blog', '/tools', '/settings']

	// Generate widget routes from widgets array
	const widgetRoutes = widgets.map(widget => `/tools/${widget.path}`)

	// Generate sitemap entries for all routes
	const sitemapEntries: MetadataRoute.Sitemap = []

	// Add static routes
	staticRoutes.forEach(route => {
		sitemapEntries.push({
			url: `${BASE_URL}${route}`,
			lastModified: new Date(),
			changeFrequency: route === '' ? 'weekly' : 'monthly',
			priority: route === '' ? 1.0 : route === '/tools' ? 0.9 : 0.8
		})
	})

	// Add widget routes
	widgetRoutes.forEach(route => {
		sitemapEntries.push({
			url: `${BASE_URL}${route}`,
			lastModified: new Date(),
			changeFrequency: 'weekly',
			priority: 0.9
		})
	})

	// Add blog post routes
	posts.forEach(post => {
		sitemapEntries.push({
			url: `${BASE_URL}/blog/${post.slug}`,
			lastModified: new Date(post.date || new Date()),
			changeFrequency: 'monthly',
			priority: 0.7
		})
	})

	return sitemapEntries
}
