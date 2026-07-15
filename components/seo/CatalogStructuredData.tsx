import { widgets } from '@/lib/constants/widgets'
import { CATEGORY_META } from '@/lib/constants/categories'

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://pixeltool.pro'

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
export function CatalogStructuredData({ category }: Props) {
	const meta =
		CATEGORY_META[category as keyof typeof CATEGORY_META] ?? CATEGORY_META['']

	const url =
		category === '' ? `${BASE_URL}/tools` : `${BASE_URL}/tools/${category}`

	const items =
		category === ''
			? widgets
			: widgets.filter(widget => widget.category === category)

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
			itemListElement: items.map((widget, index) => ({
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
					}
				}
			}))
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
