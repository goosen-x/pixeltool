// Auto-generated translation types based on en.json structure
// This file ensures type safety for all translation keys

export interface WidgetTranslation {
  title: string
  description: string
  useCase: string
  // Additional fields that specific widgets might have
  [key: string]: any
}

export interface WidgetBriefTranslation {
  title: string
  description: string
  useCase: string
}

export interface Translations {
  Locale: {
    title: string
    description: string
  }
  MetaData: {
    title: string
    description: string
  }
  HomePage: {
    hero: {
      title: string
      subtitle: string
      subtitle2: string
      exploreTools: string
      viewOnGitHub: string
      browseCategories: string
      liveAndFree: string
      features: {
        professionalTools: string
        noInstallation: string
        freeForever: string
        lightningFast: string
      }
      stats: {
        toolsAvailable: string
        happyUsers: string
        uptime: string
        alwaysFree: string
      }
    }
    // Add other HomePage sections as needed
  }
  widgets: {
    // Brief widget definitions (for search/listing)
    colorConverter?: WidgetBriefTranslation
    jsonFormatter?: WidgetBriefTranslation
    base64Encoder?: WidgetBriefTranslation
    regexTester?: WidgetBriefTranslation
    gradientGenerator?: WidgetBriefTranslation
    shadowGenerator?: WidgetBriefTranslation
    paletteCreator?: WidgetBriefTranslation
    faviconGenerator?: WidgetBriefTranslation
    passwordGenerator?: WidgetBriefTranslation
    loremIpsum?: WidgetBriefTranslation
    qrCodeGenerator?: WidgetBriefTranslation
    urlShortener?: WidgetBriefTranslation
    markdownEditor?: WidgetBriefTranslation
    cssMinifier?: WidgetBriefTranslation
    jsBeautifier?: WidgetBriefTranslation
    imageCompressor?: WidgetBriefTranslation
    svgOptimizer?: WidgetBriefTranslation
    colorPicker?: WidgetBriefTranslation
    codeFormatter?: WidgetBriefTranslation
    jsonYamlFormatter?: WidgetBriefTranslation
    hashGenerator?: WidgetBriefTranslation
    uuidGenerator?: WidgetBriefTranslation
    timestampConverter?: WidgetBriefTranslation
    numberBaseConverter?: WidgetBriefTranslation
    unitConverter?: WidgetBriefTranslation
    currencyConverter?: WidgetBriefTranslation
    bmiCalculator?: WidgetBriefTranslation
    loanCalculator?: WidgetBriefTranslation
    percentageCalculator?: WidgetBriefTranslation
    timerStopwatch?: WidgetBriefTranslation
    todoList?: WidgetBriefTranslation
    characterCounter?: WidgetBriefTranslation
    pomodoro?: WidgetBriefTranslation
    weatherWidget?: WidgetBriefTranslation
    notepad?: WidgetBriefTranslation
    bingoGenerator?: WidgetBriefTranslation
    textToSpeech?: WidgetBriefTranslation
    htmlEntityEncoder?: WidgetBriefTranslation
    diffChecker?: WidgetBriefTranslation
    javascriptSyntaxChecker?: WidgetBriefTranslation
    apiTester?: WidgetBriefTranslation
    temperatureConverter?: WidgetBriefTranslation
    textCaseConverter?: WidgetBriefTranslation
    imageSizeChecker?: WidgetBriefTranslation
    asciiArtGenerator?: WidgetBriefTranslation
    htmlXmlParser?: WidgetBriefTranslation
    analyticsDashboard?: WidgetBriefTranslation
    
    // Full widget definitions (with all fields)
    [key: string]: WidgetTranslation | any
    
    // Common widget sections
    search?: {
      placeholder: string
      categories: string
      allCategories: string
      results: string
      clearFilters: string
      noResults: string
      noResultsDescription: string
      title: string
      navigate: string
      select: string
      close: string
      suggested: string
      suggestedAndFavorites: string
    }
    favorites?: {
      title: string
      clearAll: string
      empty: string
      emptyDescription: string
    }
    rightSidebar?: {
      widgetInfo: {
        title: string
        difficulty: string
        category: string
        tags: string
        difficultyLevels: {
          beginner: string
          intermediate: string
          advanced: string
        }
      }
      quickActions: {
        title: string
        share: string
      }
      useCase: {
        title: string
      }
      usageStats: {
        title: string
        onlineNow: string
        viewsToday: string
        totalUses: string
        avgSession: string
        noData: string
      }
      feedback: {
        title: string
        helpText: string
      }
      relatedTools: {
        title: string
      }
      donation: {
        buyMeCoffee: string
      }
    }
    categories?: {
      webdev: string
      business: string
      content: string
      security: string
      multimedia: string
      analytics: string
      lifestyle: string
    }
    tools?: {
      [key: string]: string
    }
    newsletter?: {
      badge: string
      title: string
      description: string
      placeholder: string
      subscribe: string
    }
    legal?: {
      copyright: string
      privacyPolicy: string
      termsOfService: string
      apiDocs: string
      craftedWith: string
      by: string
      author: string
    }
    shortcuts?: {
      title: string
      copy: string
      clear: string
      save: string
    }
  }
  // Add other top-level sections as needed
  [key: string]: any
}

// Type for the widget constants to ensure they match translation keys
export interface WidgetConstant {
  id: string
  icon: any
  category: string
  translationKey: keyof Translations['widgets']
  path: string
  gradient: string
  tags?: string[]
  difficulty?: 'beginner' | 'intermediate' | 'advanced'
  recommendedTools?: string[]
}

// Helper type to extract widget names from translations
export type WidgetName = keyof Omit<
  Translations['widgets'],
  'search' | 'favorites' | 'rightSidebar' | 'categories' | 'tools' | 'newsletter' | 'legal' | 'shortcuts'
>

// Type guard to check if a widget has full translation
export function hasFullTranslation(
  translations: Translations['widgets'],
  widgetName: string
): boolean {
  const widget = translations[widgetName as keyof typeof translations]
  return (
    widget !== undefined &&
    typeof widget === 'object' &&
    'title' in widget &&
    'description' in widget &&
    'useCase' in widget
  )
}