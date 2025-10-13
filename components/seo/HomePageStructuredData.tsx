export function HomePageStructuredData() {
	const structuredData = {
		'@context': 'https://schema.org',
		'@type': 'WebApplication',
		name: 'PixelTool',
		alternateName: 'PixelTool Developer Tools',
		url: 'https://pixeltool.pro',
		description:
			'Профессиональные инструменты для веб-разработчиков: CSS генераторы, конвертеры цветов, форматировщики, валидаторы и более 50 утилит. Без установки, 100% бесплатно.',
		applicationCategory: 'DeveloperApplication',
		operatingSystem: 'All',
		offers: {
			'@type': 'Offer',
			price: '0',
			priceCurrency: 'USD'
		},
		author: {
			'@type': 'Person',
			name: 'Dmitry Borisenko',
			url: 'https://github.com/goosen-x/pixeltool'
		},
		publisher: {
			'@type': 'Organization',
			name: 'PixelTool',
			logo: {
				'@type': 'ImageObject',
				url: 'https://pixeltool.pro/logo.png'
			}
		},
		potentialAction: [
			{
				'@type': 'UseAction',
				target: {
					'@type': 'EntryPoint',
					urlTemplate: 'https://pixeltool.pro/tools/{tool_name}',
					actionPlatform: [
						'http://schema.org/DesktopWebPlatform',
						'http://schema.org/MobileWebPlatform'
					]
				}
			}
		],
		featureList: [
			'CSS Clamp Калькулятор',
			'Конвертер Цветов',
			'Генератор Паролей',
			'Генератор QR Кодов',
			'HTML/XML Парсер',
			'Проверка Размера Изображений',
			'Конвертер Регистра Текста',
			'И более 50 инструментов'
		],
		screenshot: [
			{
				'@type': 'ImageObject',
				url: 'https://pixeltool.pro/screenshots/tools-page.png',
				caption: 'PixelTool Tools Collection'
			}
		]
	}

	return (
		<script
			type='application/ld+json'
			dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
		/>
	)
}
