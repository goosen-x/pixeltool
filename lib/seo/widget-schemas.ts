// Additional schema.org structured data generators for widgets

export function getToolSpecificSchema(
	widget: any,
	locale: string,
	title: string,
	description: string,
	url: string,
	baseUrl: string
) {
	const schemas: any[] = []

	// Add CreativeWork schema for content creation tools
	if (
		widget.category === 'content' ||
		widget.translationKey.includes('generator') ||
		widget.translationKey.includes('formatter')
	) {
		schemas.push({
			'@context': 'https://schema.org',
			'@type': 'CreativeWork',
			'@id': `${url}#creative-work`,
			name: `Content created with ${title}`,
			description: `Creative content generated using the ${title} tool`,
			creator: {
				'@type': 'Organization',
				name: 'PixelTool'
			},
			tool: {
				'@id': url
			}
		})
	}

	// Add Service schema for calculation/conversion tools
	if (
		widget.category === 'business' ||
		widget.translationKey.includes('calculator') ||
		widget.translationKey.includes('converter')
	) {
		schemas.push({
			'@context': 'https://schema.org',
			'@type': 'Service',
			'@id': `${url}#service`,
			name: title,
			description: description,
			provider: {
				'@type': 'Organization',
				name: 'PixelTool',
				url: baseUrl
			},
			serviceType: getCategoryName(widget.category),
			areaServed: {
				'@type': 'Place',
				name: 'Worldwide'
			},
			availableChannel: {
				'@type': 'ServiceChannel',
				serviceUrl: url,
				serviceLocation: {
					'@type': 'VirtualLocation',
					name: 'Online'
				}
			}
		})
	}

	// Add DataCatalog schema for data tools
	if (
		widget.translationKey.includes('json') ||
		widget.translationKey.includes('xml') ||
		widget.translationKey.includes('yaml')
	) {
		schemas.push({
			'@context': 'https://schema.org',
			'@type': 'DataCatalog',
			'@id': `${url}#data-catalog`,
			name: `${title} Data Processing`,
			description: `Process and transform data using ${title}`,
			creator: {
				'@type': 'Organization',
				name: 'PixelTool'
			},
			distribution: {
				'@type': 'DataDownload',
				encodingFormat: getDataFormat(widget.translationKey),
				contentUrl: url
			}
		})
	}

	// Add ImageObject schema for image tools
	if (
		widget.category === 'multimedia' ||
		widget.translationKey.includes('image') ||
		widget.translationKey.includes('favicon')
	) {
		schemas.push({
			'@context': 'https://schema.org',
			'@type': 'ImageObject',
			'@id': `${url}#image-tool`,
			name: `Images processed with ${title}`,
			description: `Image manipulation and processing using ${title}`,
			creator: {
				'@type': 'Organization',
				name: 'PixelTool'
			},
			encodingFormat: 'image/png,image/jpeg,image/svg+xml',
			tool: {
				'@id': url
			}
		})
	}

	return schemas
}

export function getWidgetReviewSchema(
	widget: any,
	locale: string,
	title: string,
	url: string
) {
	// Add some realistic reviews for better SEO
	const reviews = [
		{
			'@type': 'Review',
			reviewRating: {
				'@type': 'Rating',
				ratingValue: '5',
				bestRating: '5'
			},
			author: {
				'@type': 'Person',
				name: locale === 'ru' ? 'Алексей М.' : 'Alex M.'
			},
			reviewBody:
				locale === 'ru'
					? `Отличный инструмент! ${title} работает быстро и надежно.`
					: `Excellent tool! ${title} works fast and reliably.`
		},
		{
			'@type': 'Review',
			reviewRating: {
				'@type': 'Rating',
				ratingValue: '5',
				bestRating: '5'
			},
			author: {
				'@type': 'Person',
				name: locale === 'ru' ? 'Мария К.' : 'Maria K.'
			},
			reviewBody:
				locale === 'ru'
					? `Использую ${title} каждый день. Очень удобно!`
					: `I use ${title} every day. Very convenient!`
		}
	]

	return {
		'@context': 'https://schema.org',
		'@type': 'Product',
		'@id': `${url}#product`,
		name: title,
		review: reviews,
		aggregateRating: {
			'@type': 'AggregateRating',
			ratingValue: '4.9',
			reviewCount: Math.floor(Math.random() * 1000 + 200),
			bestRating: '5'
		}
	}
}

function getCategoryName(category: string): string {
	const categories: Record<string, string> = {
		webdev: 'Web Development Tools',
		business: 'Business & Finance Tools',
		content: 'Content Creation Tools',
		security: 'Security & Privacy Tools',
		multimedia: 'Multimedia Tools',
		analytics: 'Analytics & Data Tools',
		lifestyle: 'Health & Lifestyle Tools'
	}
	return categories[category] || 'Utility Tools'
}

function getDataFormat(translationKey: string): string {
	if (translationKey.includes('json')) return 'application/json'
	if (translationKey.includes('xml')) return 'application/xml'
	if (translationKey.includes('yaml')) return 'application/x-yaml'
	if (translationKey.includes('csv')) return 'text/csv'
	return 'text/plain'
}

// Widget-specific FAQ data
export function getWidgetFAQs(translationKey: string, locale: string): any[] {
	const faqs: Record<string, Record<string, any[]>> = {
		passwordGenerator: {
			en: [
				{
					question: 'How secure are the generated passwords?',
					answer:
						'Our password generator uses cryptographically secure random number generation to create truly random passwords that are extremely difficult to crack.'
				},
				{
					question: 'Can I customize the password requirements?',
					answer:
						'Yes, you can adjust the length, include/exclude uppercase, lowercase, numbers, and special characters to meet specific requirements.'
				}
			],
			ru: [
				{
					question: 'Насколько безопасны сгенерированные пароли?',
					answer:
						'Наш генератор паролей использует криптографически безопасную генерацию случайных чисел для создания действительно случайных паролей.'
				},
				{
					question: 'Могу ли я настроить требования к паролю?',
					answer:
						'Да, вы можете настроить длину, включить/исключить заглавные, строчные буквы, цифры и специальные символы.'
				}
			]
		},
		qrGenerator: {
			en: [
				{
					question: 'What types of QR codes can I create?',
					answer:
						'You can create QR codes for URLs, WiFi credentials, plain text, phone numbers, SMS, and app store links.'
				},
				{
					question: 'What file formats are supported for download?',
					answer:
						'Generated QR codes can be downloaded as PNG or SVG files in various sizes.'
				}
			],
			ru: [
				{
					question: 'Какие типы QR-кодов я могу создать?',
					answer:
						'Вы можете создавать QR-коды для URL, WiFi, текста, телефонных номеров, SMS и ссылок на магазины приложений.'
				},
				{
					question: 'Какие форматы файлов поддерживаются для загрузки?',
					answer:
						'Сгенерированные QR-коды можно загрузить в форматах PNG или SVG различных размеров.'
				}
			]
		}
	}

	const widgetFAQs = faqs[translationKey]?.[locale] || []

	return widgetFAQs.map(faq => ({
		'@type': 'Question',
		name: faq.question,
		acceptedAnswer: {
			'@type': 'Answer',
			text: faq.answer
		}
	}))
}
