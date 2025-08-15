'use client'

import { useEffect } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'
import { YandexGoals } from '@/lib/analytics/yandex-goals'

export function GlobalGoalsTracker() {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  useEffect(() => {
    // Track page views for tools
    if (pathname.includes('/tools/')) {
      const toolName = pathname.split('/tools/')[1]?.split('/')[0]
      if (toolName) {
        // Small delay to ensure Yandex Metrika is loaded
        setTimeout(() => {
          YandexGoals.toolUsed(toolName, 'page_view')
        }, 100)
      }
    }
  }, [pathname])

  useEffect(() => {
    // Global click tracking for common actions
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      const button = target.closest('button')
      
      if (!button) return

      const buttonText = button.textContent?.toLowerCase() || ''
      const toolMatch = pathname.match(/\/tools\/([^/]+)/)
      const toolName = toolMatch ? toolMatch[1] : 'unknown'

      // Track copy actions
      if (buttonText.includes('copy') || button.querySelector('[data-lucide="copy"]')) {
        YandexGoals.resultCopied(toolName)
      }

      // Track download actions
      if (buttonText.includes('download') || button.querySelector('[data-lucide="download"]')) {
        YandexGoals.resultDownloaded(toolName)
      }

      // Track main actions (generate, calculate, convert, etc.)
      const mainActions = ['generate', 'calculate', 'convert', 'format', 'validate', 'compress', 'analyze', 'roll', 'flip', 'start']
      const matchedAction = mainActions.find(action => buttonText.includes(action))
      if (matchedAction) {
        YandexGoals.toolUsed(toolName, matchedAction)
      }

      // Track reset/clear actions
      if (buttonText.includes('reset') || buttonText.includes('clear')) {
        YandexGoals.toolUsed(toolName, 'reset')
      }
    }

    // Track theme changes
    const handleThemeChange = () => {
      const theme = document.documentElement.classList.contains('dark') ? 'dark' : 'light'
      YandexGoals.themeChanged(theme)
    }

    // Track keyboard shortcuts
    const handleKeydown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key) {
        const toolMatch = pathname.match(/\/tools\/([^/]+)/)
        const toolName = toolMatch ? toolMatch[1] : 'unknown'
        const shortcut = `${e.metaKey ? 'Cmd' : 'Ctrl'}+${e.shiftKey ? 'Shift+' : ''}${e.key.toUpperCase()}`
        
        // Only track if it's a known shortcut pattern
        if (['G', 'R', 'C', 'D', 'K', 'S', 'Enter'].includes(e.key.toUpperCase())) {
          YandexGoals.shortcutUsed(toolName, shortcut)
        }
      }
    }

    // Track search usage
    const trackSearch = () => {
      const searchInput = document.querySelector('[data-search-input]') as HTMLInputElement
      if (searchInput?.value) {
        YandexGoals.toolSearched(searchInput.value)
      }
    }

    // Add listeners
    document.addEventListener('click', handleClick)
    document.addEventListener('keydown', handleKeydown)
    
    // Watch for theme changes
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === 'class') {
          handleThemeChange()
        }
      })
    })
    observer.observe(document.documentElement, { attributes: true })

    // Track search on input blur
    const searchInputs = document.querySelectorAll('[data-search-input]')
    searchInputs.forEach(input => {
      input.addEventListener('blur', trackSearch)
    })

    return () => {
      document.removeEventListener('click', handleClick)
      document.removeEventListener('keydown', handleKeydown)
      observer.disconnect()
      searchInputs.forEach(input => {
        input.removeEventListener('blur', trackSearch)
      })
    }
  }, [pathname])

  // Track PWA installation
  useEffect(() => {
    const handleBeforeInstallPrompt = () => {
      // User saw the install prompt
      YandexGoals.toolUsed('pwa', 'prompt_shown')
    }

    const handleAppInstalled = () => {
      YandexGoals.pwaInstalled()
    }

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
    window.addEventListener('appinstalled', handleAppInstalled)

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
      window.removeEventListener('appinstalled', handleAppInstalled)
    }
  }, [])

  // Track repeated usage
  useEffect(() => {
    const toolMatch = pathname.match(/\/tools\/([^/]+)/)
    if (!toolMatch) return

    const toolName = toolMatch[1]
    const sessionKey = `tool_usage_${toolName}`
    const currentCount = parseInt(sessionStorage.getItem(sessionKey) || '0') + 1
    
    sessionStorage.setItem(sessionKey, currentCount.toString())
    
    if (currentCount >= 3) {
      YandexGoals.toolRepeatedUse(toolName, currentCount)
    }
  }, [pathname])

  return null
}