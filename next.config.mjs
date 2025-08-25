import createNextIntlPlugin from 'next-intl/plugin'

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
