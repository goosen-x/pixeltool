'use client'

import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useTranslations, useLocale } from 'next-intl'
import { ArrowRight } from 'lucide-react'
import { widgets, getWidgetById, getRecommendedWidgets } from '@/lib/constants/widgets'

interface RelatedToolsProps {
  currentTool: string
  category?: string
}

export function RelatedTools({ currentTool, category = 'css' }: RelatedToolsProps) {
  const t = useTranslations('widgets')
  const locale = useLocale()
  
  // First try to get recommended tools from widget data
  let relatedTools = getRecommendedWidgets(currentTool)
  
  // If no recommended tools or less than 3, fall back to category-based selection
  if (relatedTools.length < 3) {
    const additionalTools = widgets
      .filter(widget => 
        widget.id !== currentTool && 
        !relatedTools.some(rt => rt.id === widget.id) &&
        (category ? widget.category === category : true)
      )
      .slice(0, 3 - relatedTools.length)
    
    relatedTools = [...relatedTools, ...additionalTools]
  }

  if (relatedTools.length === 0) {
    return null
  }

  return (
    <Card className="mt-8">
      <CardHeader>
        <CardTitle className="text-lg">
          {locale === 'ru' ? 'Похожие инструменты' : 'Related Tools'}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-3 sm:grid-cols-3">
          {relatedTools.map((widget) => {
            const Icon = widget.icon
            const title = t(`${widget.translationKey}.title` as any)
            
            return (
              <Link
                key={widget.id}
                href={`/${locale}/tools/${widget.path}`}
                className="group flex items-center gap-3 rounded-lg border p-3 transition-colors hover:bg-accent/50"
              >
                <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${widget.gradient} flex items-center justify-center text-white flex-shrink-0 group-hover:scale-110 transition-transform`}>
                  <Icon className="h-5 w-5" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium leading-tight">{title}</p>
                </div>
                <ArrowRight className="h-4 w-4 text-muted-foreground opacity-0 transition-all group-hover:opacity-100 group-hover:translate-x-1" />
              </Link>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}