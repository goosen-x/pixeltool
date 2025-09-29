// Static widget data - primary source of truth
// This ensures the app always works, even without database
// Now works without translation files - Russian only

import type { LocalizedWidget } from '@/lib/types/database-widgets'

// Static data for Russian language only
export const STATIC_WIDGETS_DATA: LocalizedWidget[] = []

// Import widget constants and FAQ data
import { widgets } from '@/lib/constants/widgets'
import { widgetFAQ } from '@/lib/seo/widget-faq'

// Convert and populate static data for Russian language
widgets.forEach(widget => {
	STATIC_WIDGETS_DATA.push({
		id: widget.id,
		slug: widget.path, // Use path as slug
		icon: widget.id, // Use widget ID as icon identifier
		category: widget.category,
		title: widget.title || widget.translationKey,
		description: widget.description || '',
		is_new: false, // Default to false
		is_popular: false, // Default to false
		faqs: widgetFAQ[widget.id]?.ru || [],
		related_ids: widget.recommendedTools || [],
		tags: widget.tags || []
	})
})

// Helper functions for static data (simplified for Russian only)
export function getStaticWidgets(): LocalizedWidget[] {
	return STATIC_WIDGETS_DATA
}

export function getStaticWidgetById(id: string): LocalizedWidget | null {
	return STATIC_WIDGETS_DATA.find(w => w.id === id) || null
}

export function getStaticWidgetBySlug(slug: string): LocalizedWidget | null {
	return STATIC_WIDGETS_DATA.find(w => w.slug === slug) || null
}

export function getStaticWidgetsByCategory(
	category: string
): LocalizedWidget[] {
	return STATIC_WIDGETS_DATA.filter(w => w.category === category)
}

export function getStaticPopularWidgets(limit: number = 6): LocalizedWidget[] {
	return STATIC_WIDGETS_DATA.filter(w => w.is_popular).slice(0, limit)
}

export function getStaticNewWidgets(limit: number = 6): LocalizedWidget[] {
	return STATIC_WIDGETS_DATA.filter(w => w.is_new).slice(0, limit)
}

export function getStaticWidgetsByTag(tag: string): LocalizedWidget[] {
	return STATIC_WIDGETS_DATA.filter(w => w.tags.includes(tag))
}

export function getStaticWidgetFAQs(
	widgetId: string
): { question: string; answer: string }[] {
	const widget = getStaticWidgetById(widgetId)
	return widget?.faqs || []
}
