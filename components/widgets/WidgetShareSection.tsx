'use client'

import { Card } from '@/components/ui/card'
import { SocialShareButtons } from './SocialShareButtons'
import { Share2 } from 'lucide-react'

interface WidgetShareSectionProps {
  widgetTitle: string
  widgetDescription?: string
  url?: string
  hashtags?: string[]
  showTitle?: boolean
  variant?: 'card' | 'inline'
}

export function WidgetShareSection({
  widgetTitle,
  widgetDescription,
  url,
  hashtags = ['pixeltool', 'developertools', 'webdev'],
  showTitle = true,
  variant = 'card'
}: WidgetShareSectionProps) {
  const shareData = {
    title: `Check out ${widgetTitle} on PixelTool`,
    description: widgetDescription || `${widgetTitle} - Free online tool for developers`,
    url,
    hashtags
  }

  if (variant === 'inline') {
    return (
      <div className="flex items-center justify-between py-4 border-y">
        <div className="flex items-center gap-2">
          <Share2 className="h-5 w-5 text-muted-foreground" />
          <span className="text-sm font-medium">Share this tool</span>
        </div>
        <SocialShareButtons 
          data={shareData} 
          variant="compact"
        />
      </div>
    )
  }

  return (
    <Card className="p-6">
      {showTitle && (
        <div className="flex items-center gap-2 mb-4">
          <Share2 className="h-5 w-5" />
          <h3 className="font-semibold">Share This Tool</h3>
        </div>
      )}
      
      <p className="text-sm text-muted-foreground mb-4">
        Found this tool helpful? Share it with your friends and colleagues!
      </p>
      
      <SocialShareButtons 
        data={shareData} 
        variant="default"
      />
      
      <div className="mt-4 pt-4 border-t">
        <p className="text-xs text-muted-foreground">
          Pro tip: You can also use the keyboard shortcut <kbd className="px-1.5 py-0.5 text-xs font-mono bg-muted rounded">Ctrl+Shift+S</kbd> to quickly share
        </p>
      </div>
    </Card>
  )
}