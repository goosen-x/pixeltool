// Static widget data - primary source of truth
// This ensures the app always works, even without database

import type { LocalizedWidget } from '@/lib/types/database-widgets'

export const STATIC_WIDGETS_DATA: Record<'en' | 'ru', LocalizedWidget[]> = {
	en: [],
	ru: []
}

// We'll populate this from the existing constants
import { widgets } from '@/lib/constants/widgets'
import { widgetFAQ } from '@/lib/seo/widget-faq'

// Import translations
import enMessages from '@/messages/en.json'
import ruMessages from '@/messages/ru.json'

// Convert and populate static data
widgets.forEach(widget => {
	// Get translations from messages
	const enTranslation = (enMessages.widgets as any)[widget.translationKey]
	const ruTranslation = (ruMessages.widgets as any)[widget.translationKey]

	// English version
	STATIC_WIDGETS_DATA.en.push({
		id: widget.id,
		slug: widget.path, // Use path as slug
		icon: widget.id, // Use widget ID as icon identifier
		category: widget.category,
		title: enTranslation?.title || widget.translationKey,
		description: enTranslation?.description || '',
		is_new: false, // Default to false
		is_popular: false, // Default to false
		faqs: widgetFAQ[widget.id]?.en || [],
		related_ids: widget.recommendedTools || [],
		tags: widget.tags || []
	})

	// Russian version
	STATIC_WIDGETS_DATA.ru.push({
		id: widget.id,
		slug: widget.path, // Use path as slug
		icon: widget.id, // Use widget ID as icon identifier
		category: widget.category,
		title: ruTranslation?.title || widget.translationKey,
		description: ruTranslation?.description || '',
		is_new: false, // Default to false
		is_popular: false, // Default to false
		faqs: widgetFAQ[widget.id]?.ru || [],
		related_ids: widget.recommendedTools || [],
		tags: widget.tags || []
	})
})

// Helper functions for static data
export function getStaticWidgets(locale: 'en' | 'ru'): LocalizedWidget[] {
	return STATIC_WIDGETS_DATA[locale] || STATIC_WIDGETS_DATA.en
}

export function getStaticWidgetById(
	id: string,
	locale: 'en' | 'ru'
): LocalizedWidget | null {
	return STATIC_WIDGETS_DATA[locale].find(w => w.id === id) || null
}

export function getStaticWidgetBySlug(
	slug: string,
	locale: 'en' | 'ru'
): LocalizedWidget | null {
	return STATIC_WIDGETS_DATA[locale].find(w => w.slug === slug) || null
}

export function getStaticWidgetsByCategory(
	category: string,
	locale: 'en' | 'ru'
): LocalizedWidget[] {
	return STATIC_WIDGETS_DATA[locale].filter(w => w.category === category)
}

export function getStaticPopularWidgets(
	locale: 'en' | 'ru',
	limit: number = 6
): LocalizedWidget[] {
	return STATIC_WIDGETS_DATA[locale].filter(w => w.is_popular).slice(0, limit)
}

export function getStaticNewWidgets(
	locale: 'en' | 'ru',
	limit: number = 6
): LocalizedWidget[] {
	return STATIC_WIDGETS_DATA[locale].filter(w => w.is_new).slice(0, limit)
}

export function getStaticWidgetsByTag(
	tag: string,
	locale: 'en' | 'ru'
): LocalizedWidget[] {
	return STATIC_WIDGETS_DATA[locale].filter(w => w.tags.includes(tag))
}

export function getStaticWidgetFAQs(
	widgetId: string,
	locale: 'en' | 'ru'
): { question: string; answer: string }[] {
	const widget = getStaticWidgetById(widgetId, locale)
	return widget?.faqs || []
}
