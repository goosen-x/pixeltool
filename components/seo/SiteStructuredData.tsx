const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://pixeltool.pro'

/**
 * Глобальная структурная разметка сайта: Organization + WebSite (+ SearchAction
 * для sitelinks searchbox). Рендерится на КАЖДОЙ странице через корневой layout,
 * поэтому Яндекс/Google видят организацию и поиск по сайту на любом URL.
 * Серверный компонент — JSON-LD попадает в SSR-HTML.
 *
 * У узлов есть @id (#organization, #website), поэтому поисковики склеивают их,
 * а не считают дублями, даже если страница добавляет свою разметку с isPartOf.
 */
export function SiteStructuredData() {
	const organization = {
		'@context': 'https://schema.org',
		'@type': 'Organization',
		'@id': `${BASE_URL}#organization`,
		name: 'PixelTool',
		url: BASE_URL,
		logo: {
			'@type': 'ImageObject',
			url: `${BASE_URL}/logo.png`,
			width: 512,
			height: 512
		},
		sameAs: ['https://github.com/dmitriyborisenko', BASE_URL],
		founder: {
			'@type': 'Person',
			name: 'Dmitry Borisenko',
			url: 'https://github.com/dmitriyborisenko'
		}
	}

	const website = {
		'@context': 'https://schema.org',
		'@type': 'WebSite',
		'@id': `${BASE_URL}#website`,
		url: BASE_URL,
		name: 'PixelTool',
		description:
			'Бесплатные онлайн-инструменты для повседневных и рабочих задач: случайные числа, QR-коды, пароли, эмодзи, работа с текстом. Без установки и регистрации, прямо в браузере',
		publisher: { '@id': `${BASE_URL}#organization` },
		potentialAction: {
			'@type': 'SearchAction',
			target: {
				'@type': 'EntryPoint',
				urlTemplate: `${BASE_URL}/tools?search={search_term_string}`
			},
			'query-input': 'required name=search_term_string'
		},
		inLanguage: 'ru'
	}

	return (
		<>
			<script
				type='application/ld+json'
				dangerouslySetInnerHTML={{ __html: JSON.stringify(organization) }}
			/>
			<script
				type='application/ld+json'
				dangerouslySetInnerHTML={{ __html: JSON.stringify(website) }}
			/>
		</>
	)
}
