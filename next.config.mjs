import createNextIntlPlugin from 'next-intl/plugin'
import { SEO_REDIRECTS } from './lib/seo/seo-redirects.mjs'

/** @type {import('next').NextConfig} */
const withNextIntl = createNextIntlPlugin()

const nextConfig = {
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

export default withNextIntl(nextConfig)
