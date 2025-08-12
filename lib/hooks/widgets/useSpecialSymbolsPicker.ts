import { useState, useEffect, useCallback, useMemo } from 'react'
import { toast } from 'sonner'
import { 
  symbolCategories, 
  searchSymbols, 
  STORAGE_KEY, 
  MAX_RECENT,
  type SymbolCategories 
} from '@/lib/data/special-symbols-data'

interface UseSpecialSymbolsPickerOptions {
  translations?: {
    copied: string
    copyError: string
  }
}

export function useSpecialSymbolsPicker(options: UseSpecialSymbolsPickerOptions = {}) {
  const { translations } = options
  
  const [searchQuery, setSearchQuery] = useState('')
  const [copiedSymbol, setCopiedSymbol] = useState<string | null>(null)
  const [recentSymbols, setRecentSymbols] = useState<string[]>(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem(STORAGE_KEY)
      return stored ? JSON.parse(stored) : []
    }
    return []
  })

  // Get filtered symbols based on search
  const filteredSymbols = useMemo(() => {
    if (!searchQuery.trim()) {
      return null // Show categories when no search
    }
    return searchSymbols(searchQuery.trim())
  }, [searchQuery])

  // Get filtered categories based on search
  const filteredCategories = useMemo(() => {
    if (searchQuery.trim()) {
      return null // Show search results when searching
    }
    return symbolCategories
  }, [searchQuery])

  // Copy symbol to clipboard
  const copySymbol = useCallback(async (symbol: string) => {
    try {
      await navigator.clipboard.writeText(symbol)
      setCopiedSymbol(symbol)
      
      // Add to recent symbols
      setRecentSymbols(prev => {
        const newRecent = [symbol, ...prev.filter(s => s !== symbol)].slice(0, MAX_RECENT)
        localStorage.setItem(STORAGE_KEY, JSON.stringify(newRecent))
        return newRecent
      })
      
      // Clear copied state after 2 seconds
      setTimeout(() => setCopiedSymbol(null), 2000)
      
      toast.success(translations?.copied || 'Symbol copied!')
    } catch (err) {
      toast.error(translations?.copyError || 'Failed to copy symbol')
    }
  }, [translations])

  // Clear recent symbols
  const clearRecentSymbols = useCallback(() => {
    setRecentSymbols([])
    localStorage.removeItem(STORAGE_KEY)
    toast.success('Recent symbols cleared')
  }, [])

  // Get symbol category name by symbol
  const getCategoryBySymbol = useCallback((symbol: string): string | null => {
    for (const [key, category] of Object.entries(symbolCategories)) {
      if (category.symbols.includes(symbol)) {
        return category.name
      }
    }
    return null
  }, [])

  // Get total symbols count
  const totalSymbolsCount = useMemo(() => {
    return Object.values(symbolCategories).reduce((total, category) => {
      return total + category.symbols.length
    }, 0)
  }, [])

  return {
    // State
    searchQuery,
    copiedSymbol,
    recentSymbols,
    filteredSymbols,
    filteredCategories,
    symbolCategories,
    totalSymbolsCount,

    // Actions
    setSearchQuery,
    copySymbol,
    clearRecentSymbols,
    getCategoryBySymbol
  }
}