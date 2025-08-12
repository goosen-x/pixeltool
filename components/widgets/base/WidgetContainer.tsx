'use client'

import { ReactNode } from 'react'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { 
  RefreshCw, 
  Download, 
  Share2, 
  Save, 
  RotateCcw,
  Maximize2,
  History
} from 'lucide-react'
import type { BaseWidgetConfig, WidgetFeatures, WidgetActions } from '@/lib/types/widget-base'

interface WidgetContainerProps {
  children: ReactNode
  config: BaseWidgetConfig
  features?: WidgetFeatures
  actions?: WidgetActions
  className?: string
  headerActions?: ReactNode
  footerContent?: ReactNode
  loading?: boolean
}

export function WidgetContainer({
  children,
  config,
  features = {},
  actions = {},
  className,
  headerActions,
  footerContent,
  loading = false
}: WidgetContainerProps) {
  const { title, description, icon, category, keywords } = config

  return (
    <div className={cn("min-h-screen bg-background", className)}>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto space-y-6">
          {/* Header */}
          <div className="text-center">
            <div className="flex items-center justify-center gap-3 mb-4">
              {icon && (
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center">
                  {icon}
                </div>
              )}
              <div className="text-left">
                <h1 className="text-3xl font-bold">{title}</h1>
                <Badge variant="outline" className="mt-1">{category}</Badge>
              </div>
            </div>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              {description}
            </p>
            {keywords && keywords.length > 0 && (
              <div className="flex flex-wrap gap-2 justify-center mt-3">
                {keywords.map((keyword) => (
                  <Badge key={keyword} variant="secondary" className="text-xs">
                    {keyword}
                  </Badge>
                ))}
              </div>
            )}
          </div>

          {/* Main Content Card */}
          <Card className="overflow-hidden">
            {/* Toolbar */}
            {(Object.keys(features).length > 0 || headerActions) && (
              <div className="border-b bg-muted/50 px-4 py-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {features.history && actions.onHistorySelect && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8"
                        disabled={loading}
                      >
                        <History className="h-4 w-4 mr-1" />
                        History
                      </Button>
                    )}
                    {features.fullscreen && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8"
                        disabled={loading}
                      >
                        <Maximize2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    {features.reset && actions.onReset && (
                      <Button
                        onClick={actions.onReset}
                        variant="ghost"
                        size="sm"
                        className="h-8"
                        disabled={loading}
                      >
                        <RotateCcw className="h-4 w-4 mr-1" />
                        Reset
                      </Button>
                    )}
                    {features.save && actions.onSave && (
                      <Button
                        onClick={() => actions.onSave?.({})}
                        variant="ghost"
                        size="sm"
                        className="h-8"
                        disabled={loading}
                      >
                        <Save className="h-4 w-4 mr-1" />
                        Save
                      </Button>
                    )}
                    {features.share && actions.onShare && (
                      <Button
                        onClick={() => actions.onShare?.({})}
                        variant="ghost"
                        size="sm"
                        className="h-8"
                        disabled={loading}
                      >
                        <Share2 className="h-4 w-4 mr-1" />
                        Share
                      </Button>
                    )}
                    {features.download && actions.onDownload && (
                      <Button
                        onClick={() => actions.onDownload?.('download.txt', '')}
                        variant="ghost"
                        size="sm"
                        className="h-8"
                        disabled={loading}
                      >
                        <Download className="h-4 w-4 mr-1" />
                        Download
                      </Button>
                    )}
                    {headerActions}
                  </div>
                </div>
              </div>
            )}

            {/* Main Content */}
            <div className={cn(
              "p-6",
              loading && "opacity-50 pointer-events-none"
            )}>
              {loading && (
                <div className="absolute inset-0 flex items-center justify-center bg-background/50">
                  <RefreshCw className="h-8 w-8 animate-spin text-primary" />
                </div>
              )}
              {children}
            </div>

            {/* Footer */}
            {footerContent && (
              <div className="border-t bg-muted/50 p-4">
                {footerContent}
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  )
}