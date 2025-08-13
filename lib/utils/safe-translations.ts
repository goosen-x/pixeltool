// Safe wrapper for translations
export function safeTranslate(translator: any, key: string, fallback: string): string {
  try {
    const result = translator.raw ? translator.raw(key) : translator(key)
    
    // Check if translation was found (not returning the key)
    if (result && typeof result === 'string' && !result.includes(key)) {
      return result
    }
    
    return fallback
  } catch (error) {
    return fallback
  }
}