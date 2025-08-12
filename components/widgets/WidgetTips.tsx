'use client'

import { useState, useEffect } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import {
  Lightbulb,
  ChevronRight,
  ChevronLeft,
  X,
  Info,
  Zap,
  Target,
  Sparkles,
  PlayCircle,
  PauseCircle,
  RotateCw
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'

interface WidgetTip {
  id: string
  title: string
  description: string
  icon?: React.ReactNode
  category?: 'basic' | 'advanced' | 'pro' | 'shortcut'
  action?: {
    label: string
    onClick: () => void
  }
}

interface WidgetTipsProps {
  tips: WidgetTip[]
  widgetId: string
  variant?: 'inline' | 'modal' | 'tour'
  showOnFirstVisit?: boolean
  className?: string
}

export function WidgetTips({
  tips,
  widgetId,
  variant = 'inline',
  showOnFirstVisit = true,
  className
}: WidgetTipsProps) {
  const [currentTipIndex, setCurrentTipIndex] = useState(0)
  const [isVisible, setIsVisible] = useState(false)
  const [hasSeenTips, setHasSeenTips] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  
  const storageKey = `widget-tips-${widgetId}`

  useEffect(() => {
    // Check if user has seen tips before
    const seen = localStorage.getItem(storageKey)
    if (!seen && showOnFirstVisit) {
      setIsVisible(true)
      setIsPlaying(true)
    }
    setHasSeenTips(!!seen)
  }, [storageKey, showOnFirstVisit])

  useEffect(() => {
    // Auto-advance tips when playing
    if (isPlaying && isVisible) {
      const timer = setTimeout(() => {
        handleNext()
      }, 5000) // 5 seconds per tip
      
      return () => clearTimeout(timer)
    }
  }, [currentTipIndex, isPlaying, isVisible])

  const handleNext = () => {
    if (currentTipIndex < tips.length - 1) {
      setCurrentTipIndex(currentTipIndex + 1)
    } else {
      // Loop back to first tip
      setCurrentTipIndex(0)
    }
  }

  const handlePrevious = () => {
    if (currentTipIndex > 0) {
      setCurrentTipIndex(currentTipIndex - 1)
    } else {
      // Go to last tip
      setCurrentTipIndex(tips.length - 1)
    }
  }

  const handleClose = () => {
    setIsVisible(false)
    setIsPlaying(false)
    localStorage.setItem(storageKey, 'true')
    setHasSeenTips(true)
  }

  const handleTogglePlay = () => {
    setIsPlaying(!isPlaying)
  }

  const handleReset = () => {
    setCurrentTipIndex(0)
    setIsPlaying(true)
  }

  const currentTip = tips[currentTipIndex]
  const progress = ((currentTipIndex + 1) / tips.length) * 100

  const getCategoryIcon = (category?: string) => {
    switch (category) {
      case 'basic':
        return <Info className="w-4 h-4" />
      case 'advanced':
        return <Zap className="w-4 h-4" />
      case 'pro':
        return <Target className="w-4 h-4" />
      case 'shortcut':
        return <Sparkles className="w-4 h-4" />
      default:
        return <Lightbulb className="w-4 h-4" />
    }
  }

  const getCategoryColor = (category?: string) => {
    switch (category) {
      case 'basic':
        return 'bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300'
      case 'advanced':
        return 'bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300'
      case 'pro':
        return 'bg-orange-100 text-orange-700 dark:bg-orange-950 dark:text-orange-300'
      case 'shortcut':
        return 'bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-300'
      default:
        return 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300'
    }
  }

  if (!isVisible && hasSeenTips) {
    // Show minimal "View Tips" button
    return (
      <Button
        onClick={() => setIsVisible(true)}
        variant="outline"
        size="sm"
        className={cn("gap-2", className)}
      >
        <Lightbulb className="w-4 h-4" />
        View Tips
      </Button>
    )
  }

  if (!isVisible) return null

  if (variant === 'modal') {
    return (
      <>
        {/* Backdrop */}
        <div 
          className="fixed inset-0 bg-black/50 z-40"
          onClick={handleClose}
        />
        
        {/* Modal */}
        <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-lg p-6 space-y-4 animate-in fade-in slide-in-from-bottom-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Lightbulb className="w-5 h-5 text-primary" />
                <h3 className="font-semibold">Widget Tips</h3>
              </div>
              <Button
                onClick={handleClose}
                variant="ghost"
                size="icon"
                className="h-8 w-8"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>

            <Progress value={progress} className="h-1" />

            <div className="space-y-3">
              <div className="flex items-start gap-3">
                {currentTip.icon || getCategoryIcon(currentTip.category)}
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-medium">{currentTip.title}</h4>
                    {currentTip.category && (
                      <Badge 
                        variant="secondary" 
                        className={cn("text-xs", getCategoryColor(currentTip.category))}
                      >
                        {currentTip.category}
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {currentTip.description}
                  </p>
                  {currentTip.action && (
                    <Button
                      onClick={currentTip.action.onClick}
                      variant="link"
                      size="sm"
                      className="mt-2 p-0 h-auto"
                    >
                      {currentTip.action.label} →
                    </Button>
                  )}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2">
              <div className="flex items-center gap-1">
                <Button
                  onClick={handlePrevious}
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  disabled={tips.length <= 1}
                >
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                
                <span className="text-sm text-muted-foreground px-2">
                  {currentTipIndex + 1} of {tips.length}
                </span>
                
                <Button
                  onClick={handleNext}
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  disabled={tips.length <= 1}
                >
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  onClick={handleTogglePlay}
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                >
                  {isPlaying ? (
                    <PauseCircle className="w-4 h-4" />
                  ) : (
                    <PlayCircle className="w-4 h-4" />
                  )}
                </Button>
                
                <Button
                  onClick={handleReset}
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                >
                  <RotateCw className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </>
    )
  }

  // Inline variant
  return (
    <Card className={cn("p-4", className)}>
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Lightbulb className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium">Quick Tips</span>
          </div>
          <Button
            onClick={handleClose}
            variant="ghost"
            size="icon"
            className="h-6 w-6"
          >
            <X className="w-3 h-3" />
          </Button>
        </div>

        <div className="flex items-start gap-3">
          {currentTip.icon || getCategoryIcon(currentTip.category)}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <h4 className="text-sm font-medium">{currentTip.title}</h4>
              {currentTip.category && (
                <Badge 
                  variant="secondary" 
                  className={cn("text-xs", getCategoryColor(currentTip.category))}
                >
                  {currentTip.category}
                </Badge>
              )}
            </div>
            <p className="text-xs text-muted-foreground">
              {currentTip.description}
            </p>
            {currentTip.action && (
              <Button
                onClick={currentTip.action.onClick}
                variant="link"
                size="sm"
                className="mt-1 p-0 h-auto text-xs"
              >
                {currentTip.action.label} →
              </Button>
            )}
          </div>
        </div>

        {tips.length > 1 && (
          <div className="flex items-center justify-between">
            <Progress value={progress} className="flex-1 h-1 mr-3" />
            <div className="flex items-center gap-1">
              <Button
                onClick={handlePrevious}
                variant="ghost"
                size="icon"
                className="h-6 w-6"
              >
                <ChevronLeft className="w-3 h-3" />
              </Button>
              <span className="text-xs text-muted-foreground px-1">
                {currentTipIndex + 1}/{tips.length}
              </span>
              <Button
                onClick={handleNext}
                variant="ghost"
                size="icon"
                className="h-6 w-6"
              >
                <ChevronRight className="w-3 h-3" />
              </Button>
            </div>
          </div>
        )}
      </div>
    </Card>
  )
}

// Example tips for common widget patterns
export const commonWidgetTips: WidgetTip[] = [
  {
    id: 'keyboard-shortcuts',
    title: 'Keyboard Shortcuts',
    description: 'Press Ctrl/Cmd + Enter to quickly submit forms',
    category: 'shortcut',
    icon: <Sparkles className="w-4 h-4" />
  },
  {
    id: 'copy-results',
    title: 'Copy Results',
    description: 'Click the copy button to save results to clipboard',
    category: 'basic'
  },
  {
    id: 'bookmark',
    title: 'Bookmark This Tool',
    description: 'Press Ctrl/Cmd + D to bookmark for quick access',
    category: 'basic'
  },
  {
    id: 'share',
    title: 'Share With Others',
    description: 'Use the share buttons to send this tool to colleagues',
    category: 'basic'
  }
]