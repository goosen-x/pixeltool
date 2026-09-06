import { SEO_REDIRECTS } from './lib/seo/seo-redirects.mjs'

/** @type {import('next').NextConfig} */

const nextConfig = {
	output: 'standalone',
	images: {
		qualities: [75, 90],
		remotePatterns: [
			{ protocol: 'https', hostname: 'lh3.googleusercontent.com' },
			{ protocol: 'https', hostname: 'pbs.twimg.com' },
			{ protocol: 'https', hostname: 'images.unsplash.com' },
			{ protocol: 'https', hostname: 'img.youtube.com' },
			{ protocol: 'https', hostname: 'www.codewars.com' }
		]
	},
	// SEO Redirects - захват 5.7M поисковых запросов/месяц
	// "рассчитать" (4.1M) + "посчитать" (1.6M) + синонимы
	async redirects() {
		return SEO_REDIRECTS
	},
	// Внутренние страницы (/dev/*) закрыты от индексации тремя способами:
	// мета-роботс (lib/seo/noindex.ts), Disallow в app/robots.ts и этот
	// заголовок. Заголовок нужен потому, что мета-тег живёт только в HTML —
	// на JSON, изображение или файл, отданный из-под /dev, он не действует.
	async headers() {
		return [
			{
				source: '/dev/:path*',
				headers: [
					{ key: 'X-Robots-Tag', value: 'noindex, nofollow, noarchive' }
				]
			}
		]
	},
	turbopack: {},
	// Отключаем кеширование в режиме разработки
	...(process.env.NODE_ENV === 'development' && {
		onDemandEntries: {
			maxInactiveAge: 0,
			pagesBufferLength: 1
		}
	})
}

export default nextConfig
