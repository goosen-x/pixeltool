import { useTranslations } from 'next-intl'
import type { Translations, WidgetName } from '@/types/translations'

// Type-safe wrapper around useTranslations for widgets
export function useWidgetTranslations(widgetName: WidgetName) {
  const t = useTranslations(`widgets.${widgetName}`)
  
  // Return typed translation function
  return {
    t,
    // Helper methods for common widget fields
    title: () => t('title'),
    description: () => t('description'),
    useCase: () => t('useCase'),
    // Generic method for other fields
    get: (key: string) => t(key),
    // Check if a key exists
    has: (key: string) => {
      try {
        t(key)
        return true
      } catch {
        return false
      }
    }
  }
}

// Type-safe hook for common widget sections
export function useWidgetCommonTranslations() {
  return {
    search: useTranslations('widgets.search'),
    favorites: useTranslations('widgets.favorites'),
    rightSidebar: useTranslations('widgets.rightSidebar'),
    categories: useTranslations('widgets.categories'),
  }
}

// Development-only runtime validation hook
export function useValidateWidgetTranslation(widgetName: string) {
  const t = useTranslations(`widgets.${widgetName}`)
  
  if (process.env.NODE_ENV === 'development') {
    const requiredKeys = ['title', 'description', 'useCase']
    
    for (const key of requiredKeys) {
      try {
        const value = t(key)
        if (!value) {
          console.warn(`Missing translation: widgets.${widgetName}.${key}`)
        }
      } catch (error) {
        console.error(`Translation error: widgets.${widgetName}.${key}`, error)
      }
    }
  }
  
  return t
}