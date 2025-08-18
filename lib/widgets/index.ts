// Unified widget functions - Static data as primary, database as enhancement
import * as staticWidgets from '@/lib/data/widgets-static'
import * as supabaseWidgets from '@/lib/db/widgets-supabase'
import { checkWidgetsDbReady } from '@/lib/db/check-widgets-db'
import { isSupabaseConfigured } from '@/lib/db/supabase-adapter'
import type { LocalizedWidget } from '@/lib/types/database-widgets'

// Cache for database results
const dbCache = new Map<string, { data: any; timestamp: number }>()
const CACHE_DURATION = 24 * 60 * 60 * 1000 // 24 hours

// Get from cache if available
function getFromCache<T>(key: string): T | null {
	const cached = dbCache.get(key)
	if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
		return cached.data as T
	}
	return null
}

// Save to cache
function saveToCache(key: string, data: any) {
	dbCache.set(key, { data, timestamp: Date.now() })
}

// Try to enhance static data with database data (non-blocking)
async function tryEnhanceFromDatabase<T>(
	key: string,
	dbFetcher: () => Promise<T>,
	staticData: T
): Promise<T> {
	// Check cache first
	const cached = getFromCache<T>(key)
	if (cached) return cached

	// Return static data immediately, try to update from DB in background
	if (typeof window === 'undefined') {
		// Server-side: try to fetch from DB with timeout
		try {
			const dbPromise = dbFetcher()
			const timeoutPromise = new Promise<T>((_, reject) =>
				setTimeout(() => reject(new Error('Database timeout')), 2000)
			)

			const result = await Promise.race([dbPromise, timeoutPromise])
			saveToCache(key, result)
			return result
		} catch {
			// Silently fall back to static data
			return staticData
		}
	}

	// Client-side: always use static data, update cache in background
	dbFetcher()
		.then(data => saveToCache(key, data))
		.catch(() => {}) // Silently ignore errors

	return staticData
}

// Get all widgets
export async function getWidgets(
	locale: 'en' | 'ru' = 'en'
): Promise<LocalizedWidget[]> {
	const staticData = staticWidgets.getStaticWidgets(locale)

	// Try to get fresh data from database (non-blocking)
	const isDbReady = await checkWidgetsDbReady()
	if (isDbReady) {
		// Use Supabase
		const dbFunction = () => supabaseWidgets.getWidgets(locale)

		return tryEnhanceFromDatabase(`widgets-${locale}`, dbFunction, staticData)
	}

	return staticData
}

// Get widget by ID
export async function getWidgetById(
	id: string,
	locale: 'en' | 'ru' = 'en'
): Promise<LocalizedWidget | null> {
	const staticData = staticWidgets.getStaticWidgetById(id, locale)
	if (!staticData) return null

	const isDbReady = await checkWidgetsDbReady()
	if (isDbReady) {
		const dbFunction = () =>
			supabaseWidgets.getWidgetById(id, locale).then(data => data || staticData)

		return tryEnhanceFromDatabase(
			`widget-${id}-${locale}`,
			dbFunction,
			staticData
		)
	}

	return staticData
}

// Get widget by slug
export async function getWidgetBySlug(
	slug: string,
	locale: 'en' | 'ru' = 'en'
): Promise<LocalizedWidget | null> {
	const staticData = staticWidgets.getStaticWidgetBySlug(slug, locale)
	if (!staticData) return null

	const isDbReady = await checkWidgetsDbReady()
	if (isDbReady) {
		const dbFunction = () =>
			supabaseWidgets
				.getWidgetBySlug(slug, locale)
				.then(data => data || staticData)

		return tryEnhanceFromDatabase(
			`widget-slug-${slug}-${locale}`,
			dbFunction,
			staticData
		)
	}

	return staticData
}

// Get widgets by category
export async function getWidgetsByCategory(
	category: string,
	locale: 'en' | 'ru' = 'en'
): Promise<LocalizedWidget[]> {
	const staticData = staticWidgets.getStaticWidgetsByCategory(category, locale)

	const isDbReady = await checkWidgetsDbReady()
	if (isDbReady) {
		const dbFunction = () =>
			supabaseWidgets.getWidgetsByCategory(category, locale)

		return tryEnhanceFromDatabase(
			`widgets-category-${category}-${locale}`,
			dbFunction,
			staticData
		)
	}

	return staticData
}

// Get widget FAQs
export async function getWidgetFAQs(
	widgetId: string,
	locale: 'en' | 'ru' = 'en'
): Promise<{ question: string; answer: string }[]> {
	const staticData = staticWidgets.getStaticWidgetFAQs(widgetId, locale)

	const isDbReady = await checkWidgetsDbReady()
	if (isDbReady) {
		const dbFunction = () => supabaseWidgets.getWidgetFAQs(widgetId, locale)

		return tryEnhanceFromDatabase(
			`widget-faqs-${widgetId}-${locale}`,
			dbFunction,
			staticData
		)
	}

	return staticData
}

// Get popular widgets
export async function getPopularWidgets(
	locale: 'en' | 'ru' = 'en',
	limit: number = 6
): Promise<LocalizedWidget[]> {
	const staticData = staticWidgets.getStaticPopularWidgets(locale, limit)

	const isDbReady = await checkWidgetsDbReady()
	if (isDbReady) {
		const dbFunction = () => supabaseWidgets.getPopularWidgets(locale, limit)

		return tryEnhanceFromDatabase(
			`popular-widgets-${locale}-${limit}`,
			dbFunction,
			staticData
		)
	}

	return staticData
}

// Get new widgets
export async function getNewWidgets(
	locale: 'en' | 'ru' = 'en',
	limit: number = 6
): Promise<LocalizedWidget[]> {
	const staticData = staticWidgets.getStaticNewWidgets(locale, limit)

	const isDbReady = await checkWidgetsDbReady()
	if (isDbReady) {
		const dbFunction = () => supabaseWidgets.getNewWidgets(locale, limit)

		return tryEnhanceFromDatabase(
			`new-widgets-${locale}-${limit}`,
			dbFunction,
			staticData
		)
	}

	return staticData
}

// Get widgets by tag
export async function getWidgetsByTag(
	tag: string,
	locale: 'en' | 'ru' = 'en'
): Promise<LocalizedWidget[]> {
	const staticData = staticWidgets.getStaticWidgetsByTag(tag, locale)

	const isDbReady = await checkWidgetsDbReady()
	if (isDbReady) {
		return tryEnhanceFromDatabase(
			`widgets-tag-${tag}-${locale}`,
			async () => {
				const allWidgets = await supabaseWidgets.getWidgets(locale)
				return allWidgets.filter(w => w.tags.includes(tag))
			},
			staticData
		)
	}

	return staticData
}

// Clear cache (useful for testing)
export function clearWidgetCache() {
	dbCache.clear()
}
