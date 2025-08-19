// Widget functions using Supabase
import { supabase } from '@/lib/supabase/client'
import { unstable_cache } from 'next/cache'
import type { LocalizedWidget } from '@/lib/types/database-widgets'

// Cache configuration
const WIDGET_CACHE_TAG = 'widgets'

// Get all widgets with translations for a specific locale
export const getWidgets = unstable_cache(
	async (locale: 'en' | 'ru' = 'en'): Promise<LocalizedWidget[]> => {
		const { data, error } = await supabase
			.from('widgets')
			.select(
				`
        *,
        widget_translations!inner(title, description),
        widget_faqs(question, answer, sort_order),
        widget_related(related_widget_id),
        widget_tags(tag)
      `
			)
			.eq('widget_translations.locale', locale)
			.order('category')

		if (error) {
			console.error('Error fetching widgets:', error)
			return []
		}

		return (data || []).map(widget => ({
			id: widget.id,
			slug: widget.slug,
			icon: widget.icon,
			category: widget.category,
			title: widget.widget_translations[0].title,
			description: widget.widget_translations[0].description,
			is_new: widget.is_new,
			is_popular: widget.is_popular,
			faqs: widget.widget_faqs
				.filter((faq: any) => faq.locale === locale)
				.sort((a: any, b: any) => a.sort_order - b.sort_order)
				.map((faq: any) => ({ question: faq.question, answer: faq.answer })),
			related_ids: widget.widget_related.map((r: any) => r.related_widget_id),
			tags: widget.widget_tags.map((t: any) => t.tag)
		}))
	},
	[WIDGET_CACHE_TAG],
	{
		revalidate: 86400, // 24 hours
		tags: [WIDGET_CACHE_TAG]
	}
)

// Get widget by ID
export const getWidgetById = unstable_cache(
	async (
		id: string,
		locale: 'en' | 'ru' = 'en'
	): Promise<LocalizedWidget | null> => {
		const { data, error } = await supabase
			.from('widgets')
			.select(
				`
        *,
        widget_translations!inner(title, description),
        widget_faqs(question, answer, sort_order),
        widget_related(related_widget_id),
        widget_tags(tag)
      `
			)
			.eq('id', id)
			.eq('widget_translations.locale', locale)
			.single()

		if (error || !data) {
			console.error('Error fetching widget:', error)
			return null
		}

		return {
			id: data.id,
			slug: data.slug,
			icon: data.icon,
			category: data.category,
			title: data.widget_translations[0].title,
			description: data.widget_translations[0].description,
			is_new: data.is_new,
			is_popular: data.is_popular,
			faqs: data.widget_faqs
				.filter((faq: any) => faq.locale === locale)
				.sort((a: any, b: any) => a.sort_order - b.sort_order)
				.map((faq: any) => ({ question: faq.question, answer: faq.answer })),
			related_ids: data.widget_related.map((r: any) => r.related_widget_id),
			tags: data.widget_tags.map((t: any) => t.tag)
		}
	},
	['widget-by-id'],
	{
		revalidate: 86400,
		tags: ['widget-by-id']
	}
)

// Get widget by slug
export const getWidgetBySlug = unstable_cache(
	async (
		slug: string,
		locale: 'en' | 'ru' = 'en'
	): Promise<LocalizedWidget | null> => {
		const { data, error } = await supabase
			.from('widgets')
			.select(
				`
        *,
        widget_translations!inner(title, description),
        widget_faqs(question, answer, sort_order),
        widget_related(related_widget_id),
        widget_tags(tag)
      `
			)
			.eq('slug', slug)
			.eq('widget_translations.locale', locale)
			.single()

		if (error || !data) {
			return null
		}

		return {
			id: data.id,
			slug: data.slug,
			icon: data.icon,
			category: data.category,
			title: data.widget_translations[0].title,
			description: data.widget_translations[0].description,
			is_new: data.is_new,
			is_popular: data.is_popular,
			faqs: data.widget_faqs
				.filter((faq: any) => faq.locale === locale)
				.sort((a: any, b: any) => a.sort_order - b.sort_order)
				.map((faq: any) => ({ question: faq.question, answer: faq.answer })),
			related_ids: data.widget_related.map((r: any) => r.related_widget_id),
			tags: data.widget_tags.map((t: any) => t.tag)
		}
	},
	['widget-by-slug'],
	{
		revalidate: 86400,
		tags: ['widget-by-slug']
	}
)

// Get widgets by category
export const getWidgetsByCategory = unstable_cache(
	async (
		category: string,
		locale: 'en' | 'ru' = 'en'
	): Promise<LocalizedWidget[]> => {
		const { data, error } = await supabase
			.from('widgets')
			.select(
				`
        *,
        widget_translations!inner(title, description)
      `
			)
			.eq('category', category)
			.eq('widget_translations.locale', locale)
			.order('widget_translations(title)')

		if (error) {
			console.error('Error fetching widgets by category:', error)
			return []
		}

		return (data || []).map(widget => ({
			id: widget.id,
			slug: widget.slug,
			icon: widget.icon,
			category: widget.category,
			title: widget.widget_translations[0].title,
			description: widget.widget_translations[0].description,
			is_new: widget.is_new,
			is_popular: widget.is_popular,
			faqs: [],
			related_ids: [],
			tags: []
		}))
	},
	['widgets-by-category'],
	{
		revalidate: 86400,
		tags: ['widgets-by-category']
	}
)

// Get widget FAQs
export const getWidgetFAQs = unstable_cache(
	async (
		widgetId: string,
		locale: 'en' | 'ru' = 'en'
	): Promise<{ question: string; answer: string }[]> => {
		const { data, error } = await supabase
			.from('widget_faqs')
			.select('question, answer')
			.eq('widget_id', widgetId)
			.eq('locale', locale)
			.order('sort_order')

		if (error) {
			console.error('Error fetching widget FAQs:', error)
			return []
		}

		return data || []
	},
	['widget-faqs'],
	{
		revalidate: 86400,
		tags: ['widget-faqs']
	}
)

// Get popular widgets
export const getPopularWidgets = unstable_cache(
	async (
		locale: 'en' | 'ru' = 'en',
		limit: number = 6
	): Promise<LocalizedWidget[]> => {
		const { data, error } = await supabase
			.from('widgets')
			.select(
				`
        *,
        widget_translations!inner(title, description)
      `
			)
			.eq('is_popular', true)
			.eq('widget_translations.locale', locale)
			.limit(limit)

		if (error) {
			console.error('Error fetching popular widgets:', error)
			return []
		}

		return (data || []).map(widget => ({
			id: widget.id,
			slug: widget.slug,
			icon: widget.icon,
			category: widget.category,
			title: widget.widget_translations[0].title,
			description: widget.widget_translations[0].description,
			is_new: widget.is_new,
			is_popular: widget.is_popular,
			faqs: [],
			related_ids: [],
			tags: []
		}))
	},
	['popular-widgets'],
	{
		revalidate: 86400,
		tags: ['popular-widgets']
	}
)

// Get new widgets
export const getNewWidgets = unstable_cache(
	async (
		locale: 'en' | 'ru' = 'en',
		limit: number = 6
	): Promise<LocalizedWidget[]> => {
		const { data, error } = await supabase
			.from('widgets')
			.select(
				`
        *,
        widget_translations!inner(title, description)
      `
			)
			.eq('is_new', true)
			.eq('widget_translations.locale', locale)
			.order('created_at', { ascending: false })
			.limit(limit)

		if (error) {
			console.error('Error fetching new widgets:', error)
			return []
		}

		return (data || []).map(widget => ({
			id: widget.id,
			slug: widget.slug,
			icon: widget.icon,
			category: widget.category,
			title: widget.widget_translations[0].title,
			description: widget.widget_translations[0].description,
			is_new: widget.is_new,
			is_popular: widget.is_popular,
			faqs: [],
			related_ids: [],
			tags: []
		}))
	},
	['new-widgets'],
	{
		revalidate: 86400,
		tags: ['new-widgets']
	}
)
