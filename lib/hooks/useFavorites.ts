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
    try {
      const stored = localStorage.getItem(FAVORITES_KEY)
      if (stored) {
        setFavorites(JSON.parse(stored))
      }
    } catch (e) {
      console.error('Failed to load favorites', e)
    } finally {
      setIsLoading(false)
    }
  }, [])

  // Save favorites to localStorage
  const saveFavorites = useCallback((newFavorites: string[]) => {
    try {
      localStorage.setItem(FAVORITES_KEY, JSON.stringify(newFavorites))
      setFavorites(newFavorites)
    } catch (e) {
      console.error('Failed to save favorites', e)
      toast.error('Failed to save favorites')
    }
  }, [])

  // Add to favorites
  const addFavorite = useCallback((widgetId: string) => {
    if (favorites.includes(widgetId)) {
      toast.info('Already in favorites')
      return
    }

    if (favorites.length >= MAX_FAVORITES) {
      toast.error(`Maximum ${MAX_FAVORITES} favorites allowed`)
      return
    }

    const newFavorites = [...favorites, widgetId]
    saveFavorites(newFavorites)
    toast.success('Added to favorites')
  }, [favorites, saveFavorites])

  // Remove from favorites
  const removeFavorite = useCallback((widgetId: string) => {
    const newFavorites = favorites.filter(id => id !== widgetId)
    saveFavorites(newFavorites)
    toast.success('Removed from favorites')
  }, [favorites, saveFavorites])

  // Toggle favorite
  const toggleFavorite = useCallback((widgetId: string) => {
    if (favorites.includes(widgetId)) {
      removeFavorite(widgetId)
    } else {
      addFavorite(widgetId)
    }
  }, [favorites, addFavorite, removeFavorite])

  // Check if widget is favorite
  const isFavorite = useCallback((widgetId: string) => {
    return favorites.includes(widgetId)
  }, [favorites])

  // Clear all favorites
  const clearFavorites = useCallback(() => {
    saveFavorites([])
    toast.success('Cleared all favorites')
  }, [saveFavorites])

  // Reorder favorites
  const reorderFavorites = useCallback((newOrder: string[]) => {
    saveFavorites(newOrder)
  }, [saveFavorites])

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