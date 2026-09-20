export function HomePageStructuredData() {
	const structuredData = {
		'@context': 'https://schema.org',
		'@type': 'WebApplication',
		name: 'PixelTool',
		alternateName: 'PixelTool: онлайн-инструменты',
		url: 'https://pixeltool.pro',
		description:
			'Онлайн-инструменты для повседневных и рабочих задач: случайные числа, QR-коды, пароли, эмодзи, работа с текстом, конвертер единиц измерения и генераторы CSS. Всё считается в браузере, без установки и регистрации.',
		// UtilitiesApplication, а не DeveloperApplication: раздел разработки лишь
		// один из пятнадцати, остальные тулы бытовые. Множественное число не
		// опечатка — в словаре schema.org значение называется именно так, а
		// стоявшее здесь 'UtilityApplication' не существует и игнорировалось.
		applicationCategory: 'UtilitiesApplication',
		operatingSystem: 'All',
		offers: {
			'@type': 'Offer',
			price: '0',
			priceCurrency: 'RUB'
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
				url: 'https://pixeltool.pro/favicon-512x512.png'
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
		// Список ведёт к самим разделам, а не перечисляет случайные восемь
		// инструментов: прежний обещал «более 50», когда их уже 124.
		featureList: [
			'Рандомайзер: случайные числа, жеребьёвка, кубик',
			'Текст: счётчики, сравнение, эмодзи и символы',
			'Изображения и PDF: сжатие, конвертация, удаление фона',
			'Финансы: НДС, НДФЛ, отпускные, больничный',
			'Математика: площадь, объём, проценты, единицы измерения',
			'Разработка: CSS, HTML, JSON, регулярные выражения',
			'Здоровье, дата и время, авто и другие бытовые расчёты'
		]
	}

	return (
		<script
			type='application/ld+json'
			dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
		/>
	)
}
