import { useState, useEffect, useCallback } from 'react'
import { symbolCategories, type SymbolCategories } from '@/lib/data/special-symbols-data'

interface UseSpecialSymbolsProps {
  maxRecentSymbols?: number
}

export function useSpecialSymbols({ maxRecentSymbols = 30 }: UseSpecialSymbolsProps = {}) {
  const [mounted, setMounted] = useState(false)
  const [recentSymbols, setRecentSymbols] = useState<string[]>([])
  const [copiedSymbol, setCopiedSymbol] = useState<string | null>(null)

  // Load recent symbols from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('recentSpecialSymbols')
    if (saved) {
      setRecentSymbols(JSON.parse(saved))
    }
    setMounted(true)
  }, [])

  // Save recent symbols to localStorage
  const saveRecentSymbols = useCallback((symbols: string[]) => {
    localStorage.setItem('recentSpecialSymbols', JSON.stringify(symbols))
    setRecentSymbols(symbols)
  }, [])

  // Copy symbol to clipboard
  const copySymbol = useCallback(
    async (symbol: string) => {
      try {
        await navigator.clipboard.writeText(symbol)
        setCopiedSymbol(symbol)

        // Add to recent symbols
        const newRecent = [
          symbol,
          ...recentSymbols.filter(s => s !== symbol)
        ].slice(0, maxRecentSymbols)
        saveRecentSymbols(newRecent)

        // Reset copied state after 2 seconds
        setTimeout(() => setCopiedSymbol(null), 2000)

        return true
      } catch (error) {
        console.error('Failed to copy symbol:', error)
        return false
      }
    },
    [recentSymbols, maxRecentSymbols, saveRecentSymbols]
  )

  // Filter symbols by search term and category
  const getFilteredSymbols = useCallback(
    (searchTerm: string, selectedCategory: string | 'all' | 'recent') => {
      if (selectedCategory === 'recent') {
        return searchTerm
          ? recentSymbols.filter(symbol =>
              symbol.includes(searchTerm.toLowerCase())
            )
          : recentSymbols
      }

      const allSymbols = selectedCategory === 'all' 
        ? Object.values(symbolCategories).flatMap(cat => cat.symbols)
        : symbolCategories[selectedCategory]?.symbols || []

      return searchTerm
        ? allSymbols.filter(symbol => symbol.includes(searchTerm.toLowerCase()))
        : allSymbols
    },
    [recentSymbols]
  )

  // Clear recent symbols
  const clearRecentSymbols = useCallback(() => {
    localStorage.removeItem('recentSpecialSymbols')
    setRecentSymbols([])
  }, [])

  // Get category icons (simple mapping)
  const getCategoryIcon = useCallback((categoryId: string) => {
    const iconMap: Record<string, string> = {
      popular: '⭐',
      chess: '♛',
      music: '♪',
      weather: '☀',
      business: '©',
      objects: '✂',
      technical: '⌘',
      zodiac: '☉',
      checkmarks: '✓',
      cards: '♠',
      dice: '⚀',
      units: '°',
      numbers: '①',
      punctuation: '•',
      brackets: '〈',
      hearts: '♥',
      hands: '☞',
      religious: '☪',
      crosses: '✝',
      stars: '★',
      flowers: '❀',
      arrows: '→',
      squares: '■',
      triangles: '▲',
      circles: '●',
      math: '∞',
      fractions: '½',
      superscript: '²',
      greek: 'Ω',
      currency: '$'
    }
    return iconMap[categoryId] || '◦'
  }, [])

  return {
    // State
    mounted,
    recentSymbols,
    copiedSymbol,

    // Actions
    copySymbol,
    getFilteredSymbols,
    clearRecentSymbols,
    getCategoryIcon,

    // Data
    symbolCategories: Object.entries(symbolCategories).map(([id, category]) => ({
      id,
      name: category.name,
      symbols: category.symbols
    }))
  }
}