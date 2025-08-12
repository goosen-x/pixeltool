'use client'

import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import { Copy, Download, Share2, Check } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'

interface ResultItem {
  label: string
  value: string | number
  unit?: string
  highlighted?: boolean
  description?: string
}

interface WidgetResultProps {
  results: ResultItem[]
  title?: string
  className?: string
  layout?: 'grid' | 'list' | 'inline'
  showCopy?: boolean
  showDownload?: boolean
  showShare?: boolean
  onCopy?: (value: string) => void
  onDownload?: () => void
  onShare?: () => void
}

export function WidgetResult({
  results,
  title,
  className,
  layout = 'grid',
  showCopy = true,
  showDownload = false,
  showShare = false,
  onCopy,
  onDownload,
  onShare
}: WidgetResultProps) {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null)

  const handleCopy = async (value: string, index: number) => {
    try {
      await navigator.clipboard.writeText(value)
      setCopiedIndex(index)
      setTimeout(() => setCopiedIndex(null), 2000)
      onCopy?.(value)
      toast.success('Copied to clipboard!')
    } catch (error) {
      toast.error('Failed to copy')
    }
  }

  const formatValue = (item: ResultItem): string => {
    const value = typeof item.value === 'number' 
      ? item.value.toLocaleString() 
      : item.value
    return item.unit ? `${value} ${item.unit}` : value
  }

  const layoutClasses = {
    grid: 'grid md:grid-cols-2 lg:grid-cols-3 gap-4',
    list: 'space-y-3',
    inline: 'flex flex-wrap gap-4'
  }

  return (
    <Card className={cn("p-6", className)}>
      {title && (
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-lg">{title}</h3>
          <div className="flex items-center gap-2">
            {showShare && (
              <Button
                onClick={onShare}
                variant="ghost"
                size="sm"
                className="h-8"
              >
                <Share2 className="h-4 w-4" />
              </Button>
            )}
            {showDownload && (
              <Button
                onClick={onDownload}
                variant="ghost"
                size="sm"
                className="h-8"
              >
                <Download className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      )}

      <div className={layoutClasses[layout]}>
        {results.map((item, index) => (
          <div
            key={index}
            className={cn(
              "relative",
              layout === 'list' && "border rounded-lg p-4",
              layout === 'inline' && "flex items-center gap-2"
            )}
          >
            {layout === 'grid' && (
              <div className={cn(
                "p-4 rounded-lg border",
                item.highlighted && "border-primary bg-primary/5"
              )}>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <p className="text-sm text-muted-foreground mb-1">
                      {item.label}
                    </p>
                    <p className="text-xl font-semibold">
                      {formatValue(item)}
                    </p>
                    {item.description && (
                      <p className="text-xs text-muted-foreground mt-1">
                        {item.description}
                      </p>
                    )}
                  </div>
                  {showCopy && (
                    <Button
                      onClick={() => handleCopy(formatValue(item), index)}
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 ml-2"
                    >
                      {copiedIndex === index ? (
                        <Check className="h-4 w-4 text-green-500" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                    </Button>
                  )}
                </div>
              </div>
            )}

            {layout === 'list' && (
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <span className="text-sm text-muted-foreground">
                      {item.label}:
                    </span>
                    <span className="font-medium">
                      {formatValue(item)}
                    </span>
                    {item.highlighted && (
                      <Badge variant="default" className="text-xs">
                        Primary
                      </Badge>
                    )}
                  </div>
                  {item.description && (
                    <p className="text-xs text-muted-foreground mt-1 ml-[100px]">
                      {item.description}
                    </p>
                  )}
                </div>
                {showCopy && (
                  <Button
                    onClick={() => handleCopy(formatValue(item), index)}
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                  >
                    {copiedIndex === index ? (
                      <Check className="h-4 w-4 text-green-500" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </Button>
                )}
              </div>
            )}

            {layout === 'inline' && (
              <>
                <span className="text-sm text-muted-foreground">
                  {item.label}:
                </span>
                <Badge 
                  variant={item.highlighted ? "default" : "secondary"}
                  className="font-medium"
                >
                  {formatValue(item)}
                </Badge>
                {showCopy && (
                  <Button
                    onClick={() => handleCopy(formatValue(item), index)}
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6"
                  >
                    {copiedIndex === index ? (
                      <Check className="h-3 w-3 text-green-500" />
                    ) : (
                      <Copy className="h-3 w-3" />
                    )}
                  </Button>
                )}
              </>
            )}
          </div>
        ))}
      </div>
    </Card>
  )
}