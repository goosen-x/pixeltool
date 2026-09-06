import { MetadataRoute } from 'next'

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://pixeltool.pro'

// Служебные разделы. Держим списком, потому что повторить их обязан КАЖДЫЙ
// блок правил: бот подчиняется только своей группе и правила из '*' не
// наследует. Раньше блоки Googlebot/Yandexbot/Bingbot состояли из одного
// Allow: '/' — то есть именно основным поисковикам /dev/, /api/ и /private/
// были разрешены, а запрет действовал лишь на всех остальных ботов.
const DISALLOW = [
	'/api/',
	'/_next/',
	// Внутренние страницы: на проде они отдают 404 по флагу dev, но запрет
	// держим вместе с мета-роботсом (lib/seo/noindex.ts) и заголовком
	// X-Robots-Tag из next.config.mjs — на случай страницы, которую снова
	// понадобится открыть на проде, и dev-сборки на публичном хосте.
	'/dev/',
	'*/test-db',
	'*/test-redirect',
	'/private/',
	'*.json'
]

export default function robots(): MetadataRoute.Robots {
	return {
		rules: [
			{
				userAgent: '*',
				// /api/og — превью-картинки тулов (og:image), их отдельно
				// разрешаем поверх общего запрета /api/: самое длинное совпадение
				// побеждает, так что боты картинок (напр. YandexImages, которая не
				// наследует правила от Yandexbot) всё равно их проиндексируют.
				allow: ['/', '/api/og'],
				disallow: DISALLOW,
				crawlDelay: 1
			},
			{
				userAgent: 'Googlebot',
				allow: ['/', '/api/og'],
				disallow: DISALLOW,
				crawlDelay: 0
			},
			{
				userAgent: 'Yandexbot',
				allow: ['/', '/api/og'],
				disallow: DISALLOW,
				crawlDelay: 0
			},
			{
				userAgent: 'Bingbot',
				allow: ['/', '/api/og'],
				disallow: DISALLOW,
				crawlDelay: 0
			}
		],
		sitemap: `${BASE_URL}/sitemap.xml`,
		host: BASE_URL
	}
}
