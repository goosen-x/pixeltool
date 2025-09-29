import { SEO_REDIRECTS } from './lib/seo/seo-redirects.mjs'

/** @type {import('next').NextConfig} */

const nextConfig = {
	output: 'standalone',
	eslint: {
		ignoreDuringBuilds: true,
	},
	images: {
		domains: [
			'lh3.googleusercontent.com',
			'pbs.twimg.com',
			'images.unsplash.com',
			'img.youtube.com',
			'www.codewars.com'
		]
	},
	// Force dynamic rendering for all pages to avoid useSearchParams build errors
	experimental: {
		// This forces all pages to be dynamically rendered at request time
		// instead of being statically generated at build time
		appDir: true,
		// Disable static generation for pages that use useSearchParams
		// This is a workaround for Next.js 15 compatibility issues
		runtime: 'nodejs',
		serverComponents: true,
	},
	// SEO Redirects - захват 5.7M поисковых запросов/месяц
	// "рассчитать" (4.1M) + "посчитать" (1.6M) + синонимы
	async redirects() {
		return SEO_REDIRECTS
	},
	// Отключаем кеширование в режиме разработки
	...process.env.NODE_ENV === 'development' && {
		onDemandEntries: {
			maxInactiveAge: 0,
			pagesBufferLength: 1,
		},
		webpack: (config, { dev }) => {
			if (dev) {
				// Отключаем кеширование webpack в dev режиме
				config.cache = false
			}
			return config
		}
	}
}

export default nextConfig
