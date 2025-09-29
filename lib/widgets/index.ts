// Unified widget functions - Static data as primary, database as enhancement
// Now works with Russian language only (no locales)
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
export async function getWidgets(): Promise<LocalizedWidget[]> {
	const staticData = staticWidgets.getStaticWidgets()

	// Try to get fresh data from database (non-blocking)
	const isDbReady = await checkWidgetsDbReady()
	if (isDbReady) {
		// Use Supabase with Russian locale
		const dbFunction = () => supabaseWidgets.getWidgets('ru')

		return tryEnhanceFromDatabase(`widgets-ru`, dbFunction, staticData)
	}

	return staticData
}

// Get widget by ID
export async function getWidgetById(
	id: string
): Promise<LocalizedWidget | null> {
	const staticData = staticWidgets.getStaticWidgetById(id)
	if (!staticData) return null

	const isDbReady = await checkWidgetsDbReady()
	if (isDbReady) {
		const dbFunction = () =>
			supabaseWidgets.getWidgetById(id, 'ru').then(data => data || staticData)

		return tryEnhanceFromDatabase(`widget-${id}-ru`, dbFunction, staticData)
	}

	return staticData
}

// Get widget by slug
export async function getWidgetBySlug(
	slug: string
): Promise<LocalizedWidget | null> {
	const staticData = staticWidgets.getStaticWidgetBySlug(slug)
	if (!staticData) return null

	const isDbReady = await checkWidgetsDbReady()
	if (isDbReady) {
		const dbFunction = () =>
			supabaseWidgets
				.getWidgetBySlug(slug, 'ru')
				.then(data => data || staticData)

		return tryEnhanceFromDatabase(
			`widget-slug-${slug}-ru`,
			dbFunction,
			staticData
		)
	}

	return staticData
}

// Get widgets by category
export async function getWidgetsByCategory(
	category: string
): Promise<LocalizedWidget[]> {
	const staticData = staticWidgets.getStaticWidgetsByCategory(category)

	const isDbReady = await checkWidgetsDbReady()
	if (isDbReady) {
		const dbFunction = () =>
			supabaseWidgets.getWidgetsByCategory(category, 'ru')

		return tryEnhanceFromDatabase(
			`widgets-category-${category}-ru`,
			dbFunction,
			staticData
		)
	}

	return staticData
}

// Get widget FAQs
export async function getWidgetFAQs(
	widgetId: string
): Promise<{ question: string; answer: string }[]> {
	const staticData = staticWidgets.getStaticWidgetFAQs(widgetId)

	const isDbReady = await checkWidgetsDbReady()
	if (isDbReady) {
		const dbFunction = () => supabaseWidgets.getWidgetFAQs(widgetId, 'ru')

		return tryEnhanceFromDatabase(
			`widget-faqs-${widgetId}-ru`,
			dbFunction,
			staticData
		)
	}

	return staticData
}

// Get popular widgets
export async function getPopularWidgets(
	limit: number = 6
): Promise<LocalizedWidget[]> {
	const staticData = staticWidgets.getStaticPopularWidgets(limit)

	const isDbReady = await checkWidgetsDbReady()
	if (isDbReady) {
		const dbFunction = () => supabaseWidgets.getPopularWidgets('ru', limit)

		return tryEnhanceFromDatabase(
			`popular-widgets-ru-${limit}`,
			dbFunction,
			staticData
		)
	}

	return staticData
}

// Get new widgets
export async function getNewWidgets(
	limit: number = 6
): Promise<LocalizedWidget[]> {
	const staticData = staticWidgets.getStaticNewWidgets(limit)

	const isDbReady = await checkWidgetsDbReady()
	if (isDbReady) {
		const dbFunction = () => supabaseWidgets.getNewWidgets('ru', limit)

		return tryEnhanceFromDatabase(
			`new-widgets-ru-${limit}`,
			dbFunction,
			staticData
		)
	}

	return staticData
}

// Get widgets by tag
export async function getWidgetsByTag(tag: string): Promise<LocalizedWidget[]> {
	const staticData = staticWidgets.getStaticWidgetsByTag(tag)

	const isDbReady = await checkWidgetsDbReady()
	if (isDbReady) {
		return tryEnhanceFromDatabase(
			`widgets-tag-${tag}-ru`,
			async () => {
				const allWidgets = await supabaseWidgets.getWidgets('ru')
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
