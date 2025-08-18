import Script from 'next/script'
import { widgets } from '@/lib/constants/widgets'

interface ToolsListingStructuredDataProps {
	locale: string
	totalTools: number
}

export function ToolsListingStructuredData({
	locale,
	totalTools
}: ToolsListingStructuredDataProps) {
	const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://pixeltool.pro'
	const url = `${baseUrl}/${locale}/tools`

	// CollectionPage schema for tools listing
	const collectionPageSchema = {
		'@context': 'https://schema.org',
		'@type': 'CollectionPage',
		'@id': url,
		url: url,
		name:
			locale === 'ru'
				? 'Бесплатные Онлайн Инструменты для Разработчиков'
				: 'Free Online Developer Tools',
		description:
			locale === 'ru'
				? 'Коллекция из 65+ бесплатных онлайн инструментов для разработчиков, дизайнеров и создателей контента. Без регистрации.'
				: 'Collection of 65+ free online tools for developers, designers, and content creators. No registration required.',
		breadcrumb: {
			'@type': 'BreadcrumbList',
			itemListElement: [
				{
					'@type': 'ListItem',
					position: 1,
					name: locale === 'ru' ? 'Главная' : 'Home',
					item: baseUrl
				},
				{
					'@type': 'ListItem',
					position: 2,
					name: locale === 'ru' ? 'Инструменты' : 'Tools',
					item: url
				}
			]
		},
		mainEntity: {
			'@type': 'ItemList',
			numberOfItems: totalTools,
			itemListElement: widgets.slice(0, 20).map((widget, index) => ({
				'@type': 'ListItem',
				position: index + 1,
				item: {
					'@type': 'SoftwareApplication',
					name: widget.translationKey,
					url: `${baseUrl}/${locale}/tools/${widget.path}`,
					applicationCategory: 'WebApplication',
					operatingSystem: 'Web Browser',
					offers: {
						'@type': 'Offer',
						price: '0',
						priceCurrency: 'USD'
					}
				}
			}))
		},
		isPartOf: {
			'@type': 'WebSite',
			name: 'PixelTool',
			url: baseUrl
		}
	}

	// Organization schema
	const organizationSchema = {
		'@context': 'https://schema.org',
		'@type': 'Organization',
		'@id': `${baseUrl}#organization`,
		name: 'PixelTool',
		url: baseUrl,
		logo: {
			'@type': 'ImageObject',
			url: `${baseUrl}/logo.png`,
			width: 512,
			height: 512
		},
		sameAs: ['https://github.com/dmitriyborisenko', 'https://pixeltool.pro'],
		founder: {
			'@type': 'Person',
			name: 'Dmitry Borisenko',
			url: 'https://github.com/dmitriyborisenko'
		}
	}

	// WebSite schema with search action
	const websiteSchema = {
		'@context': 'https://schema.org',
		'@type': 'WebSite',
		'@id': `${baseUrl}#website`,
		url: baseUrl,
		name: 'PixelTool',
		description:
			locale === 'ru'
				? 'Бесплатные онлайн инструменты для разработчиков и дизайнеров'
				: 'Free online tools for developers and designers',
		publisher: {
			'@id': `${baseUrl}#organization`
		},
		potentialAction: {
			'@type': 'SearchAction',
			target: {
				'@type': 'EntryPoint',
				urlTemplate: `${baseUrl}/${locale}/tools?search={search_term_string}`
			},
			'query-input': 'required name=search_term_string'
		},
		inLanguage: locale
	}

	return (
		<>
			<Script
				id='structured-data-collection'
				type='application/ld+json'
				dangerouslySetInnerHTML={{
					__html: JSON.stringify(collectionPageSchema)
				}}
			/>
			<Script
				id='structured-data-organization'
				type='application/ld+json'
				dangerouslySetInnerHTML={{
					__html: JSON.stringify(organizationSchema)
				}}
			/>
			<Script
				id='structured-data-website'
				type='application/ld+json'
				dangerouslySetInnerHTML={{
					__html: JSON.stringify(websiteSchema)
				}}
			/>
		</>
	)
}
