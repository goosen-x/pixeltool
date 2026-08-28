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

	// DataCatalog (json/xml/yaml-тулы) и ImageObject (картиночные тулы) были
	// здесь раньше и убраны 28.08.2026 — Ahrefs нашёл на них schema.org
	// validation error (encodingFormat как список через запятую вместо одного
	// значения), и по факту разметка вообще не описывала ничего настоящего:
	// DataDownload.contentUrl указывал на HTML-страницу тула, а не на файл с
	// данными, ImageObject.contentUrl — на карточку og:image, а не на
	// «изображение, обработанное тулом» (сайт не хранит и не отдаёт
	// пользовательские результаты). Выдуманная разметка вместо честной.

	return schemas
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
						'You can create QR codes for URLs, WiFi credentials, and app store links.'
				},
				{
					question: 'What file formats are supported for download?',
					answer: 'Generated QR codes can be downloaded as a PNG file.'
				}
			],
			ru: [
				{
					question: 'Какие типы QR-кодов я могу создать?',
					answer:
						'Вы можете создавать QR-коды для ссылок (URL), Wi-Fi сетей и ссылок на магазины приложений.'
				},
				{
					question: 'Какие форматы файлов поддерживаются для загрузки?',
					answer: 'Сгенерированный QR-код можно скачать в формате PNG.'
				}
			]
		},
		qrScanner: {
			en: [
				{
					question: 'Do I need to install an app to scan a QR code?',
					answer:
						'No. The scanner works directly in your browser, using your camera or an uploaded image — no app required.'
				},
				{
					question: 'Is it safe to scan a QR code through the website?',
					answer:
						'Yes. Camera frames and uploaded images are processed locally in your browser — nothing is uploaded to a server.'
				}
			],
			ru: [
				{
					question:
						'Нужно ли устанавливать приложение, чтобы отсканировать QR-код?',
					answer:
						'Нет. Сканер работает прямо в браузере — через камеру или загруженное изображение, без установки приложений.'
				},
				{
					question: 'Безопасно ли сканировать QR-код через сайт?',
					answer:
						'Да. Кадры с камеры и загруженное изображение обрабатываются локально — ничего не отправляется на сервер.'
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
