import { useEffect, useCallback, useRef } from 'react'
import { toast } from 'sonner'

export interface KeyboardShortcut {
  key: string
  ctrl?: boolean
  shift?: boolean
  alt?: boolean
  meta?: boolean
  description: string
  action: () => void
  enabled?: boolean
}

interface UseWidgetKeyboardProps {
  shortcuts: KeyboardShortcut[]
  widgetId: string
  enabled?: boolean
  onShortcutExecuted?: (shortcut: KeyboardShortcut) => void
}

export function useWidgetKeyboard({
  shortcuts,
  widgetId,
  enabled = true,
  onShortcutExecuted
}: UseWidgetKeyboardProps) {
  const activeElement = useRef<Element | null>(null)

  const formatShortcutDisplay = useCallback((shortcut: KeyboardShortcut): string => {
    const parts: string[] = []
    
    if (shortcut.ctrl) parts.push('Ctrl')
    if (shortcut.meta) parts.push('Cmd')
    if (shortcut.alt) parts.push('Alt')
    if (shortcut.shift) parts.push('Shift')
    
    // Format the key
    const key = shortcut.key.length === 1 
      ? shortcut.key.toUpperCase() 
      : shortcut.key.charAt(0).toUpperCase() + shortcut.key.slice(1)
    
    parts.push(key)
    
    return parts.join(' + ')
  }, [])

  const showShortcutsList = useCallback(() => {
    const enabledShortcuts = shortcuts.filter(s => s.enabled !== false)
    if (enabledShortcuts.length === 0) {
      toast.info('No keyboard shortcuts available')
      return
    }

    const shortcutsList = enabledShortcuts
      .map(s => `${formatShortcutDisplay(s)}: ${s.description}`)
      .join('\n')
    
    toast.info(`Keyboard Shortcuts:\n${shortcutsList}`, { duration: 5000 })
  }, [shortcuts, formatShortcutDisplay])

  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    if (!enabled) return

    // Store active element before processing
    activeElement.current = document.activeElement

    // Check if user is typing in an input field
    const isTyping = activeElement.current?.tagName === 'INPUT' || 
                    activeElement.current?.tagName === 'TEXTAREA' ||
                    (activeElement.current as HTMLElement)?.contentEditable === 'true'

    // Special handling for help shortcut (always works)
    if (event.key === '?' && event.shiftKey && !isTyping) {
      event.preventDefault()
      showShortcutsList()
      return
    }

    // Find matching shortcut
    const matchingShortcut = shortcuts.find(shortcut => {
      if (shortcut.enabled === false) return false
      
      const keyMatch = event.key.toLowerCase() === shortcut.key.toLowerCase()
      const ctrlMatch = !!event.ctrlKey === !!shortcut.ctrl
      const shiftMatch = !!event.shiftKey === !!shortcut.shift
      const altMatch = !!event.altKey === !!shortcut.alt
      const metaMatch = !!event.metaKey === !!shortcut.meta
      
      return keyMatch && ctrlMatch && shiftMatch && altMatch && metaMatch
    })

    if (matchingShortcut) {
      // Don't trigger shortcuts when typing (unless it's a global shortcut)
      if (isTyping && !matchingShortcut.ctrl && !matchingShortcut.meta) {
        return
      }

      event.preventDefault()
      event.stopPropagation()
      
      try {
        matchingShortcut.action()
        onShortcutExecuted?.(matchingShortcut)
        
        // Show subtle feedback
        const display = formatShortcutDisplay(matchingShortcut)
        toast.success(`${display} executed`, { duration: 1000 })
      } catch (error) {
        toast.error('Shortcut action failed')
        console.error('Keyboard shortcut error:', error)
      }
    }
  }, [enabled, shortcuts, onShortcutExecuted, formatShortcutDisplay, showShortcutsList])

  useEffect(() => {
    if (!enabled) return

    // Add keyboard event listener
    window.addEventListener('keydown', handleKeyDown)

    // Store shortcuts in window for debugging
    if (process.env.NODE_ENV === 'development') {
      (window as any).__widgetShortcuts = shortcuts
    }

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      
      if (process.env.NODE_ENV === 'development') {
        delete (window as any).__widgetShortcuts
      }
    }
  }, [handleKeyDown, enabled, shortcuts])

  // Focus management utilities
  const focusElement = useCallback((selector: string) => {
    const element = document.querySelector(selector) as HTMLElement
    if (element) {
      element.focus()
      return true
    }
    return false
  }, [])

  const focusNext = useCallback(() => {
    const focusableElements = Array.from(
      document.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      )
    ).filter(el => {
      const htmlEl = el as HTMLElement
      return !('disabled' in htmlEl && (htmlEl as any).disabled) && htmlEl.offsetParent !== null
    })

    const currentIndex = focusableElements.indexOf(document.activeElement!)
    if (currentIndex >= 0 && currentIndex < focusableElements.length - 1) {
      (focusableElements[currentIndex + 1] as HTMLElement).focus()
    } else if (focusableElements.length > 0) {
      (focusableElements[0] as HTMLElement).focus()
    }
  }, [])

  const focusPrevious = useCallback(() => {
    const focusableElements = Array.from(
      document.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      )
    ).filter(el => {
      const htmlEl = el as HTMLElement
      return !('disabled' in htmlEl && (htmlEl as any).disabled) && htmlEl.offsetParent !== null
    })

    const currentIndex = focusableElements.indexOf(document.activeElement!)
    if (currentIndex > 0) {
      (focusableElements[currentIndex - 1] as HTMLElement).focus()
    } else if (focusableElements.length > 0) {
      (focusableElements[focusableElements.length - 1] as HTMLElement).focus()
    }
  }, [])

  return {
    formatShortcutDisplay,
    showShortcutsList,
    focusElement,
    focusNext,
    focusPrevious,
    activeElement: activeElement.current
  }
}

// Common widget shortcuts
export const commonWidgetShortcuts = {
  submit: {
    key: 'Enter',
    ctrl: true,
    description: 'Submit/Calculate',
  },
  copy: {
    key: 'c',
    ctrl: true,
    shift: true,
    description: 'Copy result',
  },
  reset: {
    key: 'r',
    ctrl: true,
    shift: true,
    description: 'Reset form',
  },
  help: {
    key: '?',
    shift: true,
    description: 'Show shortcuts',
  },
  focusInput: {
    key: '/',
    description: 'Focus main input',
  },
  escape: {
    key: 'Escape',
    description: 'Close/Cancel',
  }
}

// Shortcut presets for different widget types
export const calculatorShortcuts: KeyboardShortcut[] = [
  {
    ...commonWidgetShortcuts.submit,
    action: () => {} // Override in widget
  },
  {
    ...commonWidgetShortcuts.reset,
    action: () => {}
  },
  {
    key: '1',
    description: 'Example calculation',
    action: () => {}
  }
]

export const converterShortcuts: KeyboardShortcut[] = [
  {
    ...commonWidgetShortcuts.submit,
    action: () => {}
  },
  {
    key: 's',
    ctrl: true,
    description: 'Swap units',
    action: () => {}
  },
  {
    ...commonWidgetShortcuts.copy,
    action: () => {}
  }
]

export const generatorShortcuts: KeyboardShortcut[] = [
  {
    key: 'g',
    ctrl: true,
    description: 'Generate new',
    action: () => {}
  },
  {
    key: 'r',
    ctrl: true,
    description: 'Regenerate',
    action: () => {}
  },
  {
    ...commonWidgetShortcuts.copy,
    action: () => {}
  }
]

export const editorShortcuts: KeyboardShortcut[] = [
  {
    key: 'f',
    ctrl: true,
    shift: true,
    description: 'Format code',
    action: () => {}
  },
  {
    key: 's',
    ctrl: true,
    description: 'Save',
    action: () => {}
  },
  {
    key: 'z',
    ctrl: true,
    description: 'Undo',
    action: () => {}
  },
  {
    key: 'z',
    ctrl: true,
    shift: true,
    description: 'Redo',
    action: () => {}
  }
]