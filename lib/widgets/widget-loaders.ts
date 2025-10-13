/**
 * Централизованный маппинг всех виджетов для динамической загрузки
 * Автоматически генерируется из списка виджетов
 */

import { widgets } from '@/lib/constants/widgets'

/**
 * Тип для функции загрузчика виджета
 */
type WidgetLoader = () => Promise<{ default: React.ComponentType }>

/**
 * Маппинг путей виджетов на их загрузчики
 * Используется в [slug] роуте для динамической загрузки компонентов
 */
export const widgetLoaders: Record<string, WidgetLoader> = {
	// CSS виджеты
	'css-gradient-generator': () =>
		import('@/app/tools/(widgets)/css-gradient-generator/page'),
	'flexbox-generator': () =>
		import('@/app/tools/(widgets)/flexbox-generator/page'),
	'grid-generator': () => import('@/app/tools/(widgets)/grid-generator/page'),
	'css-box-shadow-generator': () =>
		import('@/app/tools/(widgets)/css-box-shadow-generator/page'),
	'css-clamp-calculator': () =>
		import('@/app/tools/(widgets)/css-clamp-calculator/page'),
	'css-bezier-curve-generator': () =>
		import('@/app/tools/(widgets)/css-bezier-curve-generator/page'),
	'css-keyframes-generator': () =>
		import('@/app/tools/(widgets)/css-keyframes-generator/page'),
	'css-specificity-calculator': () =>
		import('@/app/tools/(widgets)/css-specificity-calculator/page'),
	'px-rem-converter': () =>
		import('@/app/tools/(widgets)/px-rem-converter/page'),
	'css-minifier': () => import('@/app/tools/(widgets)/css-minifier/page'),

	// HTML виджеты
	'html-tree-visualizer': () =>
		import('@/app/tools/(widgets)/html-tree-visualizer/page'),
	'html-xml-parser': () => import('@/app/tools/(widgets)/html-xml-parser/page'),
	'opengraph-validator': () =>
		import('@/app/tools/(widgets)/opengraph-validator/page'),
	'favicon-generator': () =>
		import('@/app/tools/(widgets)/favicon-generator/page'),
	'seo-markdown-generator': () =>
		import('@/app/tools/(widgets)/seo-markdown-generator/page'),

	// JavaScript виджеты
	'json-tools': () => import('@/app/tools/(widgets)/json-tools/page'),
	'regex-tester': () => import('@/app/tools/(widgets)/regex-tester/page'),
	'javascript-syntax-checker': () =>
		import('@/app/tools/(widgets)/javascript-syntax-checker/page'),
	'js-validator': () => import('@/app/tools/(widgets)/js-validator/page'),
	'json-yaml-formatter': () =>
		import('@/app/tools/(widgets)/json-yaml-formatter/page'),
	'js-minifier': () => import('@/app/tools/(widgets)/js-minifier/page'),

	// Text виджеты
	'text-case-converter': () =>
		import('@/app/tools/(widgets)/text-case-converter/page'),
	'text-counter': () => import('@/app/tools/(widgets)/text-counter/page'),
	'text-diff-tool': () => import('@/app/tools/(widgets)/text-diff-tool/page'),
	'fancy-text-generator': () =>
		import('@/app/tools/(widgets)/fancy-text-generator/page'),
	'text-emoticons': () => import('@/app/tools/(widgets)/text-emoticons/page'),
	'text-to-speech': () => import('@/app/tools/(widgets)/text-to-speech/page'),
	'special-symbols-picker': () =>
		import('@/app/tools/(widgets)/special-symbols-picker/page'),
	'emoji-list': () => import('@/app/tools/(widgets)/emoji-list/page'),

	// Generator виджеты
	'password-generator': () =>
		import('@/app/tools/(widgets)/password-generator/page'),
	'qr-generator': () => import('@/app/tools/(widgets)/qr-generator/page'),
	'random-number-generator': () =>
		import('@/app/tools/(widgets)/random-number-generator/page'),
	'uuid-generator': () => import('@/app/tools/(widgets)/uuid-generator/page'),
	'mock-data-generator': () =>
		import('@/app/tools/(widgets)/mock-data-generator/page'),
	'random-list-generator': () =>
		import('@/app/tools/(widgets)/random-list-generator/page'),
	'ascii-art-generator': () =>
		import('@/app/tools/(widgets)/ascii-art-generator/page'),
	'coin-flip': () => import('@/app/tools/(widgets)/coin-flip/page'),
	'dice-roller': () => import('@/app/tools/(widgets)/dice-roller/page'),
	'draw-lots': () => import('@/app/tools/(widgets)/draw-lots/page'),
	'team-randomizer': () => import('@/app/tools/(widgets)/team-randomizer/page'),

	// Security виджеты
	'base64-encoder': () => import('@/app/tools/(widgets)/base64-encoder/page'),
	'jwt-decoder': () => import('@/app/tools/(widgets)/jwt-decoder/page'),
	'svg-to-base64-encoder': () =>
		import('@/app/tools/(widgets)/svg-to-base64-encoder/page'),

	// Tools виджеты
	'color-converter': () => import('@/app/tools/(widgets)/color-converter/page'),
	'color-contrast-checker': () =>
		import('@/app/tools/(widgets)/color-contrast-checker/page'),
	'image-size-checker': () =>
		import('@/app/tools/(widgets)/image-size-checker/page'),
	'utm-link-builder': () =>
		import('@/app/tools/(widgets)/utm-link-builder/page'),
	'timer-countdown': () => import('@/app/tools/(widgets)/timer-countdown/page'),
	'system-info': () => import('@/app/tools/(widgets)/system-info/page'),
	'youtube-thumbnail-downloader': () =>
		import('@/app/tools/(widgets)/youtube-thumbnail-downloader/page'),
	'mysql-syntax-checker': () =>
		import('@/app/tools/(widgets)/mysql-syntax-checker/page'),
	'php-syntax-checker': () =>
		import('@/app/tools/(widgets)/php-syntax-checker/page')
}

/**
 * Получает список всех доступных путей виджетов для generateStaticParams
 */
export function getAllWidgetPaths(): string[] {
	return widgets.map(widget => widget.path)
}

/**
 * Проверяет, существует ли loader для указанного пути
 */
export function hasWidgetLoader(path: string): boolean {
	return path in widgetLoaders
}

/**
 * Загружает компонент виджета по пути
 */
export async function loadWidgetComponent(
	path: string
): Promise<React.ComponentType | null> {
	const loader = widgetLoaders[path]
	if (!loader) return null

	try {
		const loadedModule = await loader()
		return loadedModule.default
	} catch (error) {
		console.error(`Failed to load widget: ${path}`, error)
		return null
	}
}
