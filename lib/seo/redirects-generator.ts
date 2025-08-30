/**
 * SEO Redirects Generator
 * Автоматическая генерация альтернативных URL для захвата высокочастотных поисковых запросов
 *
 * Цель: Захватить 5.7M запросов/месяц:
 * - "рассчитать" (4.1M)
 * - "посчитать" (1.6M)
 */

interface RedirectMapping {
	source: string
	destination: string
	permanent: boolean
}

interface WidgetRedirect {
	path: string
	ruSynonyms: string[]
	enSynonyms: string[]
	category: 'calculator' | 'converter' | 'generator'
}

// Основные виджеты для SEO-оптимизации
const WIDGET_REDIRECTS: WidgetRedirect[] = [
	// ========== КАЛЬКУЛЯТОРЫ (высокий приоритет) ==========
	{
		path: 'bmi-calculator',
		ruSynonyms: ['bmi', 'imt', 'indeks-massy-tela', 'massa-tela'],
		enSynonyms: ['bmi', 'body-mass-index', 'weight-height'],
		category: 'calculator'
	},
	{
		path: 'percentage-calculator',
		ruSynonyms: ['procenty', 'procentov', 'protsenty', 'protsentov'],
		enSynonyms: ['percentage', 'percent'],
		category: 'calculator'
	},
	{
		path: 'age-calculator',
		ruSynonyms: ['vozrast', 'vozrasta', 'let', 'gody'],
		enSynonyms: ['age', 'years', 'birthday'],
		category: 'calculator'
	},
	{
		path: 'loan-calculator',
		ruSynonyms: ['kredit', 'kredita', 'zaem', 'zaima', 'ssuda'],
		enSynonyms: ['loan', 'credit', 'mortgage'],
		category: 'calculator'
	},
	{
		path: 'compound-interest-calculator',
		ruSynonyms: ['protsenty', 'vklad', 'vklada', 'deposita', 'investitsii'],
		enSynonyms: ['interest', 'investment', 'compound'],
		category: 'calculator'
	},
	{
		path: 'tip-calculator',
		ruSynonyms: ['chaevye', 'chaevyh', 'nalog-s-uslug'],
		enSynonyms: ['tip', 'gratuity', 'service'],
		category: 'calculator'
	},

	// ========== КОНВЕРТЕРЫ (средний приоритет) ==========
	{
		path: 'currency-converter',
		ruSynonyms: ['valutu', 'valuta', 'dengi', 'kurs', 'obmen'],
		enSynonyms: ['currency', 'exchange', 'money'],
		category: 'converter'
	},
	{
		path: 'temperature-converter',
		ruSynonyms: ['temperaturu', 'temperatura', 'gradus', 'celsi'],
		enSynonyms: ['temperature', 'celsius', 'fahrenheit', 'kelvin'],
		category: 'converter'
	},
	{
		path: 'color-converter',
		ruSynonyms: ['tsvet', 'tsveta', 'palitra', 'rgb', 'hex'],
		enSynonyms: ['color', 'colour', 'rgb', 'hex'],
		category: 'converter'
	}
]

// Высокочастотные русские синонимы для действий
const RU_ACTION_SYNONYMS = {
	calculator: [
		'rasschitat', // "рассчитать" - 4.1M запросов
		'poschitat', // "посчитать" - 1.6M запросов
		'raschet', // "расчет" - ~500K запросов
		'vychislit', // "вычислить" - ~300K запросов
		'uznat' // "узнать" - универсальный
	],
	converter: [
		'konvertirovat', // "конвертировать"
		'perevesti', // "перевести"
		'preobrazovat', // "преобразовать"
		'pereklyuchit' // "переключить"
	],
	generator: [
		'generirovat', // "генерировать"
		'sozdavat', // "создавать"
		'sdelat' // "сделать"
	]
}

// Английские синонимы
const EN_ACTION_SYNONYMS = {
	calculator: ['calculate', 'compute', 'find', 'get'],
	converter: ['convert', 'transform', 'change', 'switch'],
	generator: ['generate', 'create', 'make', 'build']
}

/**
 * Генерирует все возможные комбинации редиректов для виджета
 */
function generateWidgetRedirects(widget: WidgetRedirect): RedirectMapping[] {
	const redirects: RedirectMapping[] = []

	// Русские редиректы
	const ruActions = RU_ACTION_SYNONYMS[widget.category]
	for (const action of ruActions) {
		for (const synonym of widget.ruSynonyms) {
			redirects.push({
				source: `/${action}-${synonym}`,
				destination: `/ru/tools/${widget.path}`,
				permanent: true
			})
		}
	}

	// Английские редиректы
	const enActions = EN_ACTION_SYNONYMS[widget.category]
	for (const action of enActions) {
		for (const synonym of widget.enSynonyms) {
			redirects.push({
				source: `/${action}-${synonym}`,
				destination: `/en/tools/${widget.path}`,
				permanent: true
			})
		}
	}

	return redirects
}

/**
 * Генерирует общие landing-страницы для категорий
 */
function generateCategoryLandingRedirects(): RedirectMapping[] {
	return [
		// Русские общие landing
		{ source: '/rasschitat', destination: '/ru/tools', permanent: true },
		{ source: '/poschitat', destination: '/ru/tools', permanent: true },
		{ source: '/raschet', destination: '/ru/tools', permanent: true },
		{ source: '/vychislit', destination: '/ru/tools', permanent: true },
		{ source: '/kalkulyator', destination: '/ru/tools', permanent: true },

		{ source: '/konvertirovat', destination: '/ru/tools', permanent: true },
		{ source: '/perevesti', destination: '/ru/tools', permanent: true },
		{ source: '/konverter', destination: '/ru/tools', permanent: true },

		{ source: '/generirovat', destination: '/ru/tools', permanent: true },
		{ source: '/sozdavat', destination: '/ru/tools', permanent: true },
		{ source: '/generator', destination: '/ru/tools', permanent: true },

		// Английские общие landing
		{ source: '/calculate', destination: '/en/tools', permanent: true },
		{ source: '/compute', destination: '/en/tools', permanent: true },
		{ source: '/calculator', destination: '/en/tools', permanent: true },

		{ source: '/convert', destination: '/en/tools', permanent: true },
		{ source: '/transform', destination: '/en/tools', permanent: true },
		{ source: '/converter', destination: '/en/tools', permanent: true },

		{ source: '/generate', destination: '/en/tools', permanent: true },
		{ source: '/create', destination: '/en/tools', permanent: true },
		{ source: '/generator', destination: '/en/tools', permanent: true },

		// Специальные редиректы для опечаток
		{ source: '/konkuylyator', destination: '/ru/tools', permanent: true }, // "конкулятор" - 25K опечаток
		{ source: '/kalkulator', destination: '/ru/tools', permanent: true }, // другая популярная опечатка
		{ source: '/calcuilator', destination: '/en/tools', permanent: true } // английская опечатка
	]
}

/**
 * Основная функция генерации всех SEO-редиректов
 */
export function generateAllSEORedirects(): RedirectMapping[] {
	const allRedirects: RedirectMapping[] = []

	// Генерируем редиректы для каждого виджета
	for (const widget of WIDGET_REDIRECTS) {
		allRedirects.push(...generateWidgetRedirects(widget))
	}

	// Добавляем общие landing редиректы
	allRedirects.push(...generateCategoryLandingRedirects())

	// Убираем дубликаты
	const uniqueRedirects = allRedirects.filter(
		(redirect, index, self) =>
			index === self.findIndex(r => r.source === redirect.source)
	)

	return uniqueRedirects
}

/**
 * Валидация редиректов - проверяем на конфликты и корректность
 */
export function validateRedirects(redirects: RedirectMapping[]): {
	valid: boolean
	errors: string[]
	warnings: string[]
} {
	const errors: string[] = []
	const warnings: string[] = []

	// Проверяем дубликаты source
	const sources = redirects.map(r => r.source)
	const duplicateSources = sources.filter(
		(source, index) => sources.indexOf(source) !== index
	)
	if (duplicateSources.length > 0) {
		errors.push(
			`Duplicate source URLs found: ${[...new Set(duplicateSources)].join(', ')}`
		)
	}

	// Проверяем циклические редиректы
	for (const redirect of redirects) {
		if (redirect.source === redirect.destination) {
			errors.push(
				`Circular redirect detected: ${redirect.source} -> ${redirect.destination}`
			)
		}
	}

	// Проверяем длину URL (SEO рекомендация)
	for (const redirect of redirects) {
		if (redirect.source.length > 100) {
			warnings.push(
				`Long source URL (${redirect.source.length} chars): ${redirect.source}`
			)
		}
	}

	return {
		valid: errors.length === 0,
		errors,
		warnings
	}
}

/**
 * Экспорт готовых редиректов для Next.js config
 */
export const SEO_REDIRECTS = generateAllSEORedirects()

// Отладочная информация (только в development)
if (process.env.NODE_ENV === 'development') {
	console.log(
		`\n🚀 SEO Redirects Generated: ${SEO_REDIRECTS.length} total redirects`
	)
	console.log(`📊 Expected traffic capture: ~5.7M searches/month`)
	console.log(
		`🎯 High-frequency targets: "рассчитать" (4.1M) + "посчитать" (1.6M)`
	)

	// Валидация
	const validation = validateRedirects(SEO_REDIRECTS)
	if (!validation.valid) {
		console.error('❌ Redirect validation failed:', validation.errors)
	} else if (validation.warnings.length > 0) {
		console.warn('⚠️ Redirect warnings:', validation.warnings)
	} else {
		console.log('✅ All redirects validated successfully')
	}
}
