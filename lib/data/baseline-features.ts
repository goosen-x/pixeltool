/**
 * Статусы поддержки CSS-фич для плашки Baseline в статьях.
 *
 * Данные выверены вручную (июль 2026) по MDN / caniuse / web.dev Baseline.
 * Специально не тянем внешний API: статьи собираются статически, лишний
 * сетевой запрос на этапе сборки — источник хрупкости, а число фич обозримо.
 *
 * status:
 *   widely — Baseline Widely available: работает у всех, можно без оглядки
 *   newly  — Baseline Newly available: во всех движках, но недавно
 *   limited — поддерживают не все движки: только как прогрессивное улучшение
 */
export type BaselineStatus = 'widely' | 'newly' | 'limited'

export interface BaselineFeature {
	/** Как показать в заголовке плашки */
	title: string
	status: BaselineStatus
	/** Год, с которого фича доступна везде (для widely/newly) */
	since?: string
	/** Версии браузеров: Chrome · Safari · Firefox */
	browsers?: string
	/** Короткая оговорка, если она принципиальна */
	note?: string
	/** Ссылка на MDN */
	mdn?: string
}

export const BASELINE_FEATURES: Record<string, BaselineFeature> = {
	// Раскладка
	'container-type': {
		title: 'Container Queries',
		status: 'widely',
		since: '2023',
		browsers: 'Chrome 105 · Safari 16 · Firefox 110',
		mdn: 'https://developer.mozilla.org/ru/docs/Web/CSS/@container'
	},
	'style-queries': {
		title: 'Style Queries — @container style()',
		status: 'newly',
		since: 'май 2026',
		browsers: 'Chrome 111 · Safari 18 · Firefox 151',
		note: 'Работают только запросы к custom properties, обычные свойства не поддерживает ни один браузер',
		mdn: 'https://developer.mozilla.org/en-US/docs/Web/CSS/@container'
	},
	subgrid: {
		title: 'subgrid',
		status: 'widely',
		since: '2023',
		browsers: 'Chrome 117 · Safari 16 · Firefox 71',
		mdn: 'https://developer.mozilla.org/ru/docs/Web/CSS/CSS_grid_layout/Subgrid'
	},
	'grid-lanes': {
		title: 'Masonry — display: grid-lanes',
		status: 'limited',
		note: 'Спецификация переехала с grid-template-rows: masonry на display: grid-lanes. Движки мигрируют, Safari первым. Только как прогрессивное улучшение с фолбэком на обычный grid',
		mdn: 'https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_grid_layout/Masonry_layout'
	},
	flexbox: {
		title: 'Flexbox',
		status: 'widely',
		since: '2015',
		browsers: 'все браузеры',
		note: 'Вендорные префиксы (-webkit-box, -ms-flexbox) не нужны больше десяти лет',
		mdn: 'https://developer.mozilla.org/ru/docs/Web/CSS/CSS_flexible_box_layout'
	},
	'flex-gap': {
		title: 'gap во Flexbox',
		status: 'widely',
		since: '2021',
		browsers: 'Chrome 84 · Safari 14.1 · Firefox 63',
		note: 'Отрицательные margin-хаки для отступов больше не нужны',
		mdn: 'https://developer.mozilla.org/ru/docs/Web/CSS/gap'
	},
	grid: {
		title: 'CSS Grid',
		status: 'widely',
		since: '2017',
		browsers: 'все браузеры',
		mdn: 'https://developer.mozilla.org/ru/docs/Web/CSS/CSS_grid_layout'
	},

	// Значения и функции
	clamp: {
		title: 'clamp(), min(), max()',
		status: 'widely',
		since: '2020',
		browsers: 'Chrome 79 · Safari 13.1 · Firefox 75',
		mdn: 'https://developer.mozilla.org/ru/docs/Web/CSS/clamp'
	},
	'custom-properties': {
		title: 'CSS-переменные (custom properties)',
		status: 'widely',
		since: '2017',
		browsers: 'все браузеры',
		mdn: 'https://developer.mozilla.org/ru/docs/Web/CSS/Using_CSS_custom_properties'
	},
	property: {
		title: '@property',
		status: 'newly',
		since: '2024',
		browsers: 'Chrome 85 · Safari 16.4 · Firefox 128',
		note: 'Без @property переменную нельзя анимировать: браузер не знает её тип и переключает значение скачком',
		mdn: 'https://developer.mozilla.org/ru/docs/Web/CSS/@property'
	},
	'color-mix': {
		title: 'color-mix()',
		status: 'widely',
		since: '2023',
		browsers: 'Chrome 111 · Safari 16.2 · Firefox 113',
		mdn: 'https://developer.mozilla.org/ru/docs/Web/CSS/color_value/color-mix'
	},
	'aspect-ratio': {
		title: 'aspect-ratio',
		status: 'widely',
		since: '2021',
		browsers: 'Chrome 88 · Safari 15 · Firefox 89',
		mdn: 'https://developer.mozilla.org/ru/docs/Web/CSS/aspect-ratio'
	},
	dvh: {
		title: 'Динамические единицы — dvh, svh, lvh',
		status: 'widely',
		since: '2023',
		browsers: 'Chrome 108 · Safari 15.4 · Firefox 101',
		note: '100vh на мобильных уезжает под адресную строку — 100dvh этого не делает',
		mdn: 'https://developer.mozilla.org/ru/docs/Web/CSS/length'
	},

	// Селекторы
	has: {
		title: ':has() — родительский селектор',
		status: 'widely',
		since: '2023',
		browsers: 'Chrome 105 · Safari 15.4 · Firefox 121',
		mdn: 'https://developer.mozilla.org/ru/docs/Web/CSS/:has'
	},
	'is-where': {
		title: ':is() и :where()',
		status: 'widely',
		since: '2021',
		browsers: 'Chrome 88 · Safari 14 · Firefox 78',
		note: ':where() имеет нулевую специфичность, :is() — специфичность самого «тяжёлого» аргумента',
		mdn: 'https://developer.mozilla.org/ru/docs/Web/CSS/:where'
	},
	'focus-visible': {
		title: ':focus-visible',
		status: 'widely',
		since: '2022',
		browsers: 'Chrome 86 · Safari 15.4 · Firefox 85',
		note: 'Показывает кольцо фокуса только при навигации с клавиатуры — в отличие от :focus',
		mdn: 'https://developer.mozilla.org/ru/docs/Web/CSS/:focus-visible'
	},
	'user-valid': {
		title: ':user-valid и :user-invalid',
		status: 'widely',
		since: '2023',
		browsers: 'Chrome 119 · Safari 16.5 · Firefox 88',
		note: 'Срабатывают только после взаимодействия — пустое обязательное поле не краснеет сразу при загрузке',
		mdn: 'https://developer.mozilla.org/ru/docs/Web/CSS/:user-valid'
	},

	// Анимации
	'starting-style': {
		title: '@starting-style',
		status: 'newly',
		since: '2026',
		browsers: 'Chrome 117 · Safari 17.5 · Firefox 129',
		note: 'Анимация появления элемента из display: none — то, ради чего годами тащили JS',
		mdn: 'https://developer.mozilla.org/ru/docs/Web/CSS/@starting-style'
	},
	'linear-easing': {
		title: 'linear() — кривая по точкам',
		status: 'widely',
		since: 'июнь 2026',
		browsers: 'Chrome 113 · Safari 17.2 · Firefox 112',
		note: 'Настоящие пружины и отскоки, которые cubic-bezier изобразить не может',
		mdn: 'https://developer.mozilla.org/ru/docs/Web/CSS/easing-function'
	},
	'scroll-driven': {
		title: 'Анимации по скроллу — animation-timeline',
		status: 'limited',
		browsers: 'Chrome 115 · Safari 26',
		note: 'В Firefox пока за флагом. Подключать как прогрессивное улучшение',
		mdn: 'https://developer.mozilla.org/ru/docs/Web/CSS/animation-timeline'
	},
	'view-transitions': {
		title: 'View Transitions',
		status: 'newly',
		since: 'октябрь 2025',
		browsers: 'Chrome 111 · Safari 18 · Firefox 144',
		note: 'Переходы между документами (@view-transition) пока без Firefox',
		mdn: 'https://developer.mozilla.org/ru/docs/Web/API/View_Transitions_API'
	},
	'reduced-motion': {
		title: 'prefers-reduced-motion',
		status: 'widely',
		since: '2019',
		browsers: 'все браузеры',
		note: 'Не «хорошая практика», а требование доступности: часть людей отключает анимации из-за укачивания',
		mdn: 'https://developer.mozilla.org/ru/docs/Web/CSS/@media/prefers-reduced-motion'
	}
}
