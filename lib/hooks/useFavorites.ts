'use client'

import { useState, useEffect, useCallback } from 'react'
import { toast } from 'sonner'

const FAVORITES_KEY = 'pixeltool_favorite_widgets'
const MAX_FAVORITES = 20

export function useFavorites() {
	const [favorites, setFavorites] = useState<string[]>([])
	const [isLoading, setIsLoading] = useState(true)

	// Load favorites from localStorage
	useEffect(() => {
		if (typeof window === 'undefined') {
			setIsLoading(false)
			return
		}

		try {
			const stored = localStorage.getItem(FAVORITES_KEY)
			if (stored) {
				const parsed = JSON.parse(stored)
				setFavorites(parsed)
			}
		} catch (e) {
			console.error('Failed to load favorites', e)
		} finally {
			setIsLoading(false)
		}
	}, [])

	// Save favorites to localStorage
	const saveFavorites = useCallback((newFavorites: string[]) => {
		if (typeof window === 'undefined') {
			return
		}

		try {
			localStorage.setItem(FAVORITES_KEY, JSON.stringify(newFavorites))
			setFavorites(newFavorites)
		} catch (e) {
			console.error('Failed to save favorites', e)
			toast.error('Ошибка при сохранении избранного')
		}
	}, [])

	// Toggle favorite
	const toggleFavorite = useCallback(
		(widgetId: string) => {
			if (favorites.includes(widgetId)) {
				// Remove from favorites
				const newFavorites = favorites.filter(id => id !== widgetId)
				saveFavorites(newFavorites)
				toast.success('Удалено из избранного')
			} else {
				// Add to favorites
				if (favorites.length >= MAX_FAVORITES) {
					toast.error(`Максимум ${MAX_FAVORITES} инструментов в избранном`)
					return
				}
				const newFavorites = [...favorites, widgetId]
				saveFavorites(newFavorites)
				toast.success('Добавлено в избранное')
			}
		},
		[favorites, saveFavorites]
	)

	// Check if widget is favorite
	const isFavorite = useCallback(
		(widgetId: string) => {
			return favorites.includes(widgetId)
		},
		[favorites]
	)

	// Clear all favorites
	const clearFavorites = useCallback(() => {
		saveFavorites([])
		toast.success('Избранное очищено')
	}, [saveFavorites])

	// Remove single favorite
	const removeFavorite = useCallback(
		(widgetId: string) => {
			const newFavorites = favorites.filter(id => id !== widgetId)
			saveFavorites(newFavorites)
			toast.success('Удалено из избранного')
		},
		[favorites, saveFavorites]
	)

	// Add single favorite
	const addFavorite = useCallback(
		(widgetId: string) => {
			if (favorites.includes(widgetId)) {
				toast.info('Уже в избранном')
				return
			}

			if (favorites.length >= MAX_FAVORITES) {
				toast.error(`Максимум ${MAX_FAVORITES} инструментов в избранном`)
				return
			}

			const newFavorites = [...favorites, widgetId]
			saveFavorites(newFavorites)
			toast.success('Добавлено в избранное')
		},
		[favorites, saveFavorites]
	)

	// Reorder favorites
	const reorderFavorites = useCallback(
		(newOrder: string[]) => {
			saveFavorites(newOrder)
		},
		[saveFavorites]
	)

	return {
		favorites,
		isLoading,
		addFavorite,
		removeFavorite,
		toggleFavorite,
		isFavorite,
		clearFavorites,
		reorderFavorites,
		favoriteCount: favorites.length
	}
}
