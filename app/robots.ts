import { MetadataRoute } from 'next'

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://pixeltool.pro'

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
				disallow: [
					'/api/',
					'/_next/',
					// Внутренние страницы: на проде их и так нет (флаг dev), запрет
					// здесь — на случай, если dev-сборка окажется на публичном хосте.
					'/dev/',
					'*/test-db',
					'*/test-redirect',
					'/private/',
					'*.json'
				],
				crawlDelay: 1
			},
			{
				userAgent: 'Googlebot',
				allow: '/',
				crawlDelay: 0
			},
			{
				userAgent: 'Yandexbot',
				allow: '/',
				crawlDelay: 0
			},
			{
				userAgent: 'Bingbot',
				allow: '/',
				crawlDelay: 0
			}
		],
		sitemap: `${BASE_URL}/sitemap.xml`,
		host: BASE_URL
	}
}
