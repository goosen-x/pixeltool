'use client'

import { useState, useEffect, useCallback, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { useTranslations } from 'next-intl'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { 
  Search, 
  Command,
  ArrowRight,
  Hash,
  Star,
  Clock,
  Sparkles
} from 'lucide-react'
import { widgets, widgetCategories, type Widget } from '@/lib/constants/widgets'
import { useSearchHistory } from '@/lib/hooks/useSearchHistory'
import { useFavorites } from '@/lib/hooks/useFavorites'
import { highlightText } from '@/lib/utils/highlightText'
import { cn } from '@/lib/utils'
import { safeTranslate } from '@/lib/utils/safe-translations'
import { YandexGoals } from '@/lib/analytics/yandex-goals'

interface GlobalWidgetSearchProps {
  locale: string
  open?: boolean
  onOpenChange?: (open: boolean) => void
}

export function GlobalWidgetSearch({ locale, open: controlledOpen, onOpenChange }: GlobalWidgetSearchProps) {
  const router = useRouter()
  const [internalOpen, setInternalOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedIndex, setSelectedIndex] = useState(0)
  
  // Use controlled state if provided, otherwise use internal state
  const open = controlledOpen !== undefined ? controlledOpen : internalOpen
  const setOpen = onOpenChange || setInternalOpen
  
  const t = useTranslations('widgets')
  const searchT = useTranslations('widgets.search')
  const { history, addToHistory } = useSearchHistory()
  const { favorites } = useFavorites()

  // Convert widgets to searchable items
  const searchableWidgets = useMemo(() => {
    return widgets.map(widget => {
      const title = safeTranslate(t, `${widget.translationKey}.title`, widget.translationKey)
      const description = safeTranslate(t, `${widget.translationKey}.description`, `Widget: ${widget.translationKey}`)
      
      return {
        widget,
        title,
        description,
        category: widgetCategories[widget.category as keyof typeof widgetCategories],
        isFavorite: favorites.includes(widget.id),
        path: `/${locale}/tools/${widget.path}`
      }
    })
  }, [t, favorites, locale])

  // Filter widgets based on search
  const filteredWidgets = useMemo(() => {
    if (!searchQuery.trim()) {
      // Show favorites and recent when no search
      const favoriteWidgets = searchableWidgets
        .filter(item => item.isFavorite)
        .slice(0, 3)
      
      const recentWidgets = history
        .slice(0, 3)
        .map(query => {
          const widget = searchableWidgets.find(w => 
            w.title.toLowerCase().includes(query.toLowerCase()) ||
            w.description.toLowerCase().includes(query.toLowerCase())
          )
          return widget
        })
        .filter(Boolean) as typeof searchableWidgets

      return [...new Set([...favoriteWidgets, ...recentWidgets])].slice(0, 6)
    }

    return searchableWidgets.filter(item => {
      const query = searchQuery.toLowerCase()
      return (
        item.title.toLowerCase().includes(query) ||
        item.description.toLowerCase().includes(query) ||
        item.widget.tags?.some(tag => tag.toLowerCase().includes(query)) ||
        item.category.toLowerCase().includes(query)
      )
    }).slice(0, 8)
  }, [searchQuery, searchableWidgets, history])

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Open search with Cmd/Ctrl + K
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        setOpen(true)
      }

      // Navigation when open
      if (open) {
        switch (e.key) {
          case 'ArrowDown':
            e.preventDefault()
            setSelectedIndex(prev => 
              prev < filteredWidgets.length - 1 ? prev + 1 : 0
            )
            break
          case 'ArrowUp':
            e.preventDefault()
            setSelectedIndex(prev => 
              prev > 0 ? prev - 1 : filteredWidgets.length - 1
            )
            break
          case 'Enter':
            e.preventDefault()
            if (filteredWidgets[selectedIndex]) {
              handleSelect(filteredWidgets[selectedIndex])
            }
            break
          case 'Escape':
            e.preventDefault()
            setOpen(false)
            break
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [open, filteredWidgets, selectedIndex])

  // Reset state when closing
  useEffect(() => {
    if (!open) {
      setSearchQuery('')
      setSelectedIndex(0)
    }
  }, [open])

  const handleSelect = useCallback((item: typeof searchableWidgets[0]) => {
    if (searchQuery.trim()) {
      addToHistory(searchQuery)
      // Track search goal
      YandexGoals.toolSearched(searchQuery)
    }
    router.push(item.path)
    setOpen(false)
  }, [searchQuery, addToHistory, router])

  return (
    <>
      {/* Show floating search button only if not controlled */}
      {controlledOpen === undefined && (
        <Button
          onClick={() => setOpen(true)}
          className="fixed bottom-8 left-8 rounded-full shadow-lg z-40 h-14 w-14 p-0"
          size="icon"
          variant="default"
        >
          <Search className="w-6 h-6" />
        </Button>
      )}

      {/* Search dialog */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-2xl p-0 overflow-hidden">
          <DialogHeader className="sr-only">
            <DialogTitle>{searchT('title')}</DialogTitle>
          </DialogHeader>
          
          {/* Search input */}
          <div className="flex items-center border-b px-4 pr-12 h-14">
            <Search className="w-5 h-5 text-muted-foreground" />
            <Input
              placeholder={searchT('placeholder')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 border-0 focus-visible:ring-0 text-base px-3 h-full"
              autoFocus
            />
            <Badge variant="secondary" className="ml-2 shrink-0">
              <Command className="w-3 h-3 mr-1" />K
            </Badge>
          </div>

          {/* Results */}
          <ScrollArea className="max-h-[400px]">
            {filteredWidgets.length === 0 ? (
              <div className="p-8 text-center text-muted-foreground">
                <Search className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p className="text-sm">{searchT('noResults')}</p>
              </div>
            ) : (
              <div className="p-2">
                {/* Category label for empty search */}
                {!searchQuery.trim() && (
                  <div className="px-3 py-2 text-xs font-medium text-muted-foreground">
                    {favorites.length > 0 ? searchT('suggestedAndFavorites') : searchT('suggested')}
                  </div>
                )}

                {/* Widget results */}
                {filteredWidgets.map((item, index) => {
                  const Icon = item.widget.icon
                  return (
                    <button
                      key={item.widget.id}
                      onClick={() => handleSelect(item)}
                      className={cn(
                        "w-full flex items-center gap-3 px-3 py-3 rounded-lg text-left transition-colors",
                        "hover:bg-muted",
                        selectedIndex === index && "bg-muted"
                      )}
                    >
                      {/* Widget icon */}
                      <div className={cn(
                        "w-10 h-10 rounded-lg flex items-center justify-center text-white shrink-0",
                        `bg-gradient-to-br ${item.widget.gradient}`
                      )}>
                        <Icon className="w-5 h-5" />
                      </div>

                      {/* Widget info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="font-medium text-sm truncate">
                            {searchQuery ? highlightText(item.title, searchQuery) : item.title}
                          </p>
                          {item.isFavorite && (
                            <Star className="w-3 h-3 text-yellow-500 fill-current" />
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground truncate">
                          {searchQuery ? highlightText(item.description, searchQuery) : item.description}
                        </p>
                      </div>

                      {/* Category badge */}
                      <Badge variant="outline" className="shrink-0">
                        {item.category}
                      </Badge>

                      {/* Arrow */}
                      <ArrowRight className="w-4 h-4 text-muted-foreground shrink-0" />
                    </button>
                  )
                })}
              </div>
            )}
          </ScrollArea>

          {/* Footer */}
          <div className="border-t px-4 py-3 flex items-center justify-between text-xs text-muted-foreground">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1">
                <kbd className="px-1.5 py-0.5 rounded border bg-muted font-mono">↑</kbd>
                <kbd className="px-1.5 py-0.5 rounded border bg-muted font-mono">↓</kbd>
                {searchT('navigate')}
              </span>
              <span className="flex items-center gap-1">
                <kbd className="px-1.5 py-0.5 rounded border bg-muted font-mono">↵</kbd>
                {searchT('select')}
              </span>
              <span className="flex items-center gap-1">
                <kbd className="px-1.5 py-0.5 rounded border bg-muted font-mono">esc</kbd>
                {searchT('close')}
              </span>
            </div>
            <span className="flex items-center gap-1">
              <Sparkles className="w-3 h-3" />
              {widgets.length} {t('tools')}
            </span>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}