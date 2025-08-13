'use client'

import { useTranslations } from 'next-intl'
import Link from 'next/link'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { FavoriteButton } from './FavoriteButton'
import { highlightText } from '@/lib/utils/highlightText'
import { cn } from '@/lib/utils'
import type { Widget } from '@/lib/constants/widgets'

interface ToolCardProps {
  widget: Widget
  locale: string
  searchQuery?: string
  showFavoriteButton?: boolean
  className?: string
}

export function ToolCard({ 
  widget, 
  locale, 
  searchQuery = '', 
  showFavoriteButton = true,
  className 
}: ToolCardProps) {
  const t = useTranslations('widgets')
  const Icon = widget.icon
  
  const title = t(`${widget.translationKey}.title`)
  const description = t(`${widget.translationKey}.description`)
  
  return (
    <Link 
      href={`/${locale}/tools/${widget.path}`}
      className="block group"
    >
      <Card className={cn(
        "h-full transition-all duration-300 hover:shadow-lg hover:-translate-y-1 border-border/50 bg-background/60 backdrop-blur-sm relative group overflow-hidden",
        className
      )}>
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        
        {showFavoriteButton && (
          <FavoriteButton 
            widgetId={widget.id} 
            className="absolute top-2 right-2 z-10"
          />
        )}
        
        <CardHeader className="relative z-10">
          <div className={cn(
            "w-16 h-16 rounded-xl bg-gradient-to-br flex items-center justify-center text-white mb-4 group-hover:scale-110 transition-all duration-300 shadow-lg",
            widget.gradient
          )}>
            <Icon className="w-8 h-8" />
          </div>
          <CardTitle className="text-lg font-heading transition-all duration-300 group-hover:text-primary pr-8">
            {searchQuery ? highlightText(title, searchQuery) : title}
          </CardTitle>
        </CardHeader>
        
        <CardContent className="relative z-10">
          <p className="text-sm text-muted-foreground mb-3">
            {searchQuery ? highlightText(description, searchQuery) : description}
          </p>
          
          {widget.tags && widget.tags.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {widget.tags.slice(0, 3).map(tag => (
                <Badge key={tag} variant="secondary" className="text-xs">
                  {searchQuery ? highlightText(tag, searchQuery) : tag}
                </Badge>
              ))}
              {widget.tags.length > 3 && (
                <Badge variant="outline" className="text-xs">
                  +{widget.tags.length - 3}
                </Badge>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </Link>
  )
}