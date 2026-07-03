import { Widget } from '@/lib/constants/widgets'
import { getToolSpecificSchema } from '@/lib/seo/widget-schemas'

interface WidgetStructuredDataProps {
	widget: Widget
}

/**
 * Серверная структурная разметка страницы инструмента:
 * WebApplication + WebPage + доп. схемы.
 * Обычный <script> (не next/script) — JSON-LD попадает в SSR-HTML,
 * поэтому Яндекс/Google видят его сразу, без клиентской подгрузки.
 * FAQ здесь НЕ дублируем — его отдаёт FAQ.tsx (через WidgetFAQ).
 * Крошки — глобальный AutoBreadcrumbs / ProjectsLayoutWrapper.
 */
export function WidgetStructuredData({ widget }: WidgetStructuredDataProps) {
	const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://pixeltool.pro'
	const url = `${baseUrl}/tools/${widget.path}`
	const locale = 'ru'
	const title = widget.title || widget.id
	const description =
		widget.metaDescription ||
		widget.description ||
		`Онлайн-инструмент «${widget.title || widget.id}»`

	// WebApplication schema for tools (подтип SoftwareApplication для
	// браузерных приложений без установки — точнее для инструментов PixelTool)
	const softwareApplicationSchema = {
		'@context': 'https://schema.org',
		'@type': 'WebApplication',
		'@id': url,
		name: title,
		description: description,
		url: url,
		applicationCategory: 'DeveloperApplication',
		browserRequirements: 'Requires JavaScript. Requires HTML5.',
		applicationSubCategory: getCategoryName(widget.category),
		operatingSystem: 'Web Browser',
		offers: {
			'@type': 'Offer',
			price: '0',
			priceCurrency: 'USD'
		},
		author: {
			'@type': 'Organization',
			name: 'PixelTool',
			url: baseUrl
		},
		datePublished: '2024-01-01',
		dateModified: new Date().toISOString(),
		keywords: widget.tags?.join(', ') || '',
		inLanguage: locale,
		isAccessibleForFree: true,
		featureList: widget.tags || [],
		softwareVersion: '1.0'
	}

	// WebPage schema for SEO
	const webPageSchema = {
		'@context': 'https://schema.org',
		'@type': 'WebPage',
		'@id': `${url}#webpage`,
		url: url,
		name: `${title} - Online Tool`,
		description: description,
		mainEntity: {
			'@id': url
		},
		isPartOf: {
			'@type': 'WebSite',
			name: 'PixelTool',
			url: baseUrl
		}
	}

	// HowTo убран: Google больше не показывает rich-результат для HowTo (2023),
	// а шаблонные шаги пользы не давали.

	// FAQ разметку намеренно не создаём здесь — её отдаёт FAQ.tsx (WidgetFAQ),
	// чтобы на странице был ровно один FAQPage.

	// Get additional schemas
	const additionalSchemas = getToolSpecificSchema(
		widget,
		locale,
		title,
		description,
		url,
		baseUrl
	)

	return (
		<>
			<script
				type='application/ld+json'
				dangerouslySetInnerHTML={{
					__html: JSON.stringify(softwareApplicationSchema)
				}}
			/>
			<script
				type='application/ld+json'
				dangerouslySetInnerHTML={{
					__html: JSON.stringify(webPageSchema)
				}}
			/>
			{additionalSchemas.map((schema, index) => (
				<script
					key={`additional-schema-${index}`}
					type='application/ld+json'
					dangerouslySetInnerHTML={{
						__html: JSON.stringify(schema)
					}}
				/>
			))}
		</>
	)
}

function getCategoryName(category: string): string {
	const categories: Record<string, string> = {
		css: 'CSS Development Tools',
		html: 'HTML Development Tools',
		javascript: 'JavaScript Development Tools',
		text: 'Text Processing Tools',
		generators: 'Generator & Randomizer Tools',
		security: 'Security & Encoding Tools',
		tools: 'Utility Tools'
	}
	return categories[category] || 'Utility Tools'
}
