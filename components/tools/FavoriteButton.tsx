'use client'

import { Heart } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { useFavorites } from '@/lib/hooks/useFavorites'
import { useAnalytics } from '@/lib/hooks/useAnalytics'

interface FavoriteButtonProps {
  widgetId: string
  className?: string
  variant?: 'default' | 'ghost' | 'outline'
  size?: 'default' | 'sm' | 'lg' | 'icon'
}

export function FavoriteButton({ 
  widgetId, 
  className,
  variant = 'ghost',
  size = 'icon'
}: FavoriteButtonProps) {
  const { isFavorite, toggleFavorite } = useFavorites()
  const { trackFavorite } = useAnalytics(widgetId)
  const isFav = isFavorite(widgetId)

  return (
    <Button
      variant={variant}
      size={size}
      onClick={(e) => {
        e.preventDefault()
        e.stopPropagation()
        const newFavoriteState = !isFav
        toggleFavorite(widgetId)
        trackFavorite(newFavoriteState)
      }}
      className={cn(
        'transition-all',
        isFav && 'text-red-500 hover:text-red-600',
        className
      )}
      aria-label={isFav ? 'Remove from favorites' : 'Add to favorites'}
    >
      <Heart 
        className={cn(
          'w-4 h-4',
          isFav && 'fill-current'
        )} 
      />
    </Button>
  )
}