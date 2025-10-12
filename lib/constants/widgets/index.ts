export interface WidgetFAQ {
	question: string
	answer: string
}

export interface Widget {
	id: string
	icon: React.ComponentType<{ className?: string }>
	iconName?: string
	category:
		| 'css'
		| 'html'
		| 'javascript'
		| 'text'
		| 'generators'
		| 'security'
		| 'tools'
	translationKey: string
	path: string
	gradient: string
	title?: string
	description?: string
	useCase?: string
	recommendedTools?: string[]
	faqs?: WidgetFAQ[]
	tags?: string[]
	difficulty?: 'beginner' | 'intermediate' | 'advanced'
	metaDescription?: string
}

export { cssWidgets } from './css'
export { htmlWidgets } from './html'
export { javascriptWidgets } from './javascript'
export { textWidgets } from './text'
export { generatorWidgets } from './generators'
export { securityWidgets } from './security'
export { toolWidgets } from './tools'

import { cssWidgets } from './css'
import { htmlWidgets } from './html'
import { javascriptWidgets } from './javascript'
import { textWidgets } from './text'
import { generatorWidgets } from './generators'
import { securityWidgets } from './security'
import { toolWidgets } from './tools'

export const widgets: Widget[] = [
	...cssWidgets,
	...htmlWidgets,
	...javascriptWidgets,
	...textWidgets,
	...generatorWidgets,
	...securityWidgets,
	...toolWidgets
]

export const getWidgetById = (id: string): Widget | undefined => {
	return widgets.find(w => w.id === id)
}

export const getWidgetsByCategory = (
	category: Widget['category']
): Widget[] => {
	return widgets.filter(w => w.category === category)
}

export const getWidgetByPath = (path: string): Widget | undefined => {
	return widgets.find(widget => widget.path === path)
}

export const getRecommendedWidgets = (widgetId: string): Widget[] => {
	const widget = getWidgetById(widgetId)
	if (!widget?.recommendedTools) return []

	return widget.recommendedTools
		.map(id => getWidgetById(id))
		.filter((w): w is Widget => w !== undefined)
}

export const widgetCategories = {
	html: 'HTML',
	css: 'CSS',
	javascript: 'JavaScript',
	text: 'Текст',
	generators: 'Генераторы',
	security: 'Безопасность',
	tools: 'Утилиты'
} as const

export const getWidgetFAQs = (translationKey: string): any[] => {
	return []
}
