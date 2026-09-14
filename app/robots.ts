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

/**
 * Боты ИИ-ассистентов, которые ходят на сайт ради ответа конкретному человеку
 * и ставят на источник ссылку. Их запрет режет тот самый канал, ради которого
 * пишется llms.txt.
 *
 * Google-Extended и Applebot-Extended — не краулеры: это переключатели, можно
 * ли использовать уже скачанное в AI Overviews, Gemini и Apple Intelligence.
 * Своего обхода у них нет, но правило читается именно отсюда.
 * YandexAdditional отвечает за Алису и нейроответы Яндекса.
 */
const AI_ANSWER_BOTS = [
	'OAI-SearchBot',
	'ChatGPT-User',
	'PerplexityBot',
	'Perplexity-User',
	'Claude-User',
	'Claude-SearchBot',
	'Google-Extended',
	'Applebot-Extended',
	'YandexAdditional',
	'DuckAssistBot',
	'meta-externalagent'
]

/** Краулеры, собирающие корпуса для обучения моделей. */
const AI_TRAINING_BOTS = ['GPTBot', 'ClaudeBot', 'CCBot', 'Amazonbot']

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
			},
			// Боты, приводящие живой трафик из ИИ-ответов: пользователь спросил
			// ассистента, тот сходил на сайт и поставил ссылку. Пускаем без
			// оговорок — это ровно та выдача, ради которой всё и делается.
			...AI_ANSWER_BOTS.map(userAgent => ({
				userAgent,
				allow: ['/', '/api/og'],
				disallow: DISALLOW,
				crawlDelay: 0
			})),
			// Краулеры обучающих корпусов. Тоже пускаем: у PixelTool нет ни
			// платного, ни уникального контента, который стоило бы прятать, а
			// присутствие в корпусе повышает шанс, что модель вспомнит проект,
			// когда её спросят без доступа к поиску. Решение обратимо —
			// достаточно перенести строку в DISALLOWED_AI_BOTS ниже.
			...AI_TRAINING_BOTS.map(userAgent => ({
				userAgent,
				allow: ['/', '/api/og'],
				disallow: DISALLOW,
				crawlDelay: 0
			}))
		],
		sitemap: `${BASE_URL}/sitemap.xml`,
		host: BASE_URL
	}
}
