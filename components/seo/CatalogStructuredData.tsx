import { publicWidgets } from '@/lib/constants/widgets'
import { CATEGORY_META } from '@/lib/constants/categories'
import { widgetMatchesCategory } from '@/lib/utils/filter-widgets'
import { getAllToolStats } from '@/lib/tool-stats/get-all-stats'
import { isDbUnavailableError } from '@/lib/db'

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://pixeltool.pro'

// Тот же порог, что в WidgetStructuredData: меньше голосов на странице тула
// выглядит накрученным.
const MIN_RATING_COUNT_FOR_SCHEMA = 5

interface Props {
	/** '' — общий каталог, иначе ключ категории. */
	category: string
}

/**
 * Разметка страницы каталога: CollectionPage со списком инструментов и FAQPage.
 *
 * Organization и WebSite здесь намеренно не описываются — они уже есть на всём
 * сайте (SiteStructuredData), и второе объявление было бы дублем.
 */
export async function CatalogStructuredData({ category }: Props) {
	const meta =
		CATEGORY_META[category as keyof typeof CATEGORY_META] ?? CATEGORY_META['']

	const url =
		category === '' ? `${BASE_URL}/tools` : `${BASE_URL}/tools/${category}`

	const items = publicWidgets.filter(widget =>
		widgetMatchesCategory(widget, category)
	)

	// Один сбой БД не должен ронять разметку каталога — просто без рейтингов,
	// как и до появления tool_stats.
	let toolStats: Awaited<ReturnType<typeof getAllToolStats>> = {}
	try {
		toolStats = await getAllToolStats()
	} catch (error) {
		if (!isDbUnavailableError(error)) {
			console.error(
				'Не удалось получить статистику тулов для JSON-LD каталога:',
				error
			)
		}
	}

	const collectionPage = {
		'@context': 'https://schema.org',
		'@type': 'CollectionPage',
		'@id': url,
		url,
		name: meta.heading,
		description: meta.metaDescription,
		inLanguage: 'ru',
		isPartOf: { '@id': `${BASE_URL}#website` },
		mainEntity: {
			'@type': 'ItemList',
			numberOfItems: items.length,
			// Перечисляем все инструменты категории, а не первые двадцать: список
			// нужен поисковику целиком, иначе половина каталога для него не
			// существует.
			itemListElement: items.map((widget, index) => {
				const stats = toolStats[widget.id]
				return {
					'@type': 'ListItem',
					position: index + 1,
					item: {
						'@type': 'SoftwareApplication',
						name: widget.title || widget.translationKey,
						description: widget.description,
						url: `${BASE_URL}/tools/${widget.path}`,
						applicationCategory: 'DeveloperApplication',
						operatingSystem: 'Web Browser',
						offers: {
							'@type': 'Offer',
							price: '0',
							priceCurrency: 'RUB'
						},
						// Реальные оценки из tool_stats, не выдуманные — показываем
						// только начиная с порога голосов, см.
						// MIN_RATING_COUNT_FOR_SCHEMA.
						...(stats && stats.ratingCount >= MIN_RATING_COUNT_FOR_SCHEMA
							? {
									aggregateRating: {
										'@type': 'AggregateRating',
										ratingValue: Number(stats.rating.toFixed(1)),
										ratingCount: stats.ratingCount,
										bestRating: 5,
										worstRating: 1
									}
								}
							: {})
					}
				}
			})
		}
	}

	const faqPage = {
		'@context': 'https://schema.org',
		'@type': 'FAQPage',
		'@id': `${url}#faq`,
		mainEntity: meta.faqs.map(faq => ({
			'@type': 'Question',
			name: faq.question,
			acceptedAnswer: {
				'@type': 'Answer',
				text: faq.answer
			}
		}))
	}

	return (
		<>
			<script
				type='application/ld+json'
				dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionPage) }}
			/>
			<script
				type='application/ld+json'
				dangerouslySetInnerHTML={{ __html: JSON.stringify(faqPage) }}
			/>
		</>
	)
}
