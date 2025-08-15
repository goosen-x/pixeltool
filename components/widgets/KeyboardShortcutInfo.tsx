'use client'

import { useEffect, useState } from 'react'
import { Keyboard } from 'lucide-react'
import { getWidgetShortcuts } from '@/lib/constants/widgetShortcuts'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'

export function KeyboardShortcutInfo() {
  const [isMac, setIsMac] = useState(false)
  const pathname = usePathname()
  
  useEffect(() => {
    setIsMac(navigator.platform.toUpperCase().indexOf('MAC') >= 0)
  }, [])

  const shortcutConfig = getWidgetShortcuts(pathname, isMac)
  
  if (!shortcutConfig) return null

  return (
    <div className="rounded-lg border bg-muted/50 p-4 space-y-2">
      <div className="flex items-center gap-2 text-sm font-medium">
        <Keyboard className="h-4 w-4" />
        <span>Keyboard Shortcuts</span>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {shortcutConfig.shortcuts.map((shortcut, index) => {
          // Parse shortcuts like "Space Roll Dice" or "⌘+G Generate"
          const parts = shortcut.split(' ')
          let keys = ''
          let description = ''
          
          // Check if first part contains special keys or modifiers
          if (parts[0].includes('+') || parts[0] === 'Space' || parts[0] === 'Enter' || parts[0] === 'Tab' || /^[1-9](-[1-9])?$/.test(parts[0])) {
            keys = parts[0]
            description = parts.slice(1).join(' ')
          } else {
            // Fallback for other formats
            keys = parts[0]
            description = parts.slice(1).join(' ')
          }
          
          return (
            <div key={index} className="flex items-center gap-2 text-sm">
              <kbd className={cn(
                "px-2 py-1 text-xs font-mono rounded",
                "bg-background border shadow-sm"
              )}>
                {keys}
              </kbd>
              <span className="text-muted-foreground">
                {description}
              </span>
            </div>
          )
        })}
      </div>
      {shortcutConfig.description && (
        <p className="text-xs text-muted-foreground mt-2">
          {shortcutConfig.description}
        </p>
      )}
    </div>
  )
}