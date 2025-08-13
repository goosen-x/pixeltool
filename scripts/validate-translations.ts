#!/usr/bin/env node

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

interface ValidationError {
  file: string
  path: string
  message: string
}

interface WidgetDefinition {
  title: string
  description: string
  useCase: string
  [key: string]: any
}

class TranslationValidator {
  private errors: ValidationError[] = []
  private warnings: ValidationError[] = []
  
  private enTranslations: any
  private ruTranslations: any
  
  constructor() {
    this.loadTranslations()
  }
  
  private loadTranslations() {
    const enPath = path.join(__dirname, '../messages/en.json')
    const ruPath = path.join(__dirname, '../messages/ru.json')
    
    try {
      this.enTranslations = JSON.parse(fs.readFileSync(enPath, 'utf-8'))
      this.ruTranslations = JSON.parse(fs.readFileSync(ruPath, 'utf-8'))
    } catch (error) {
      console.error('Failed to load translation files:', error)
      process.exit(1)
    }
  }
  
  private addError(file: string, path: string, message: string) {
    this.errors.push({ file, path, message })
  }
  
  private addWarning(file: string, path: string, message: string) {
    this.warnings.push({ file, path, message })
  }
  
  private validateWidgetStructure(widget: any, widgetName: string, file: string): boolean {
    const requiredFields = ['title', 'description', 'useCase']
    let isValid = true
    
    // Check if widget is an object
    if (typeof widget !== 'object' || widget === null) {
      this.addError(file, `widgets.${widgetName}`, `Widget is not an object`)
      return false
    }
    
    for (const field of requiredFields) {
      if (!(field in widget)) {
        this.addError(file, `widgets.${widgetName}.${field}`, `Missing required field: ${field}`)
        isValid = false
      }
    }
    
    return isValid
  }
  
  private findDuplicateKeys(obj: any, path: string = '', seen: Set<string> = new Set()): void {
    // Note: JSON.parse automatically handles duplicates by keeping the last value
    // This is more for detecting potential issues in the source
  }
  
  private compareWidgetKeys(enWidget: any, ruWidget: any, widgetName: string) {
    const enKeys = new Set(Object.keys(enWidget))
    const ruKeys = new Set(Object.keys(ruWidget))
    
    // Check for missing keys in Russian
    for (const key of enKeys) {
      if (!ruKeys.has(key)) {
        this.addError('ru.json', `widgets.${widgetName}.${key}`, `Missing translation for key: ${key}`)
      }
    }
    
    // Check for extra keys in Russian
    for (const key of ruKeys) {
      if (!enKeys.has(key)) {
        this.addWarning('ru.json', `widgets.${widgetName}.${key}`, `Extra translation key not in English: ${key}`)
      }
    }
  }
  
  public validate() {
    console.log('🔍 Validating translation files...\n')
    
    // 1. Check if widgets section exists
    if (!this.enTranslations.widgets) {
      this.addError('en.json', 'widgets', 'Missing widgets section')
      return
    }
    
    if (!this.ruTranslations.widgets) {
      this.addError('ru.json', 'widgets', 'Missing widgets section')
      return
    }
    
    const enWidgets = this.enTranslations.widgets
    const ruWidgets = this.ruTranslations.widgets
    
    // 2. Get all widget names (excluding common sections and non-widget keys)
    const commonSections = [
      'search', 'favorites', 'rightSidebar', 'categories', 'tools', 
      'newsletter', 'legal', 'shortcuts', 'title', 'description', 
      'mainPage', 'about', 'features', 'stats', 'portfolio',
      'experience', 'contact', 'footer', 'cta', 'technologies',
      'projects', 'testimonials', 'social', 'navigation', 'blog'
    ]
    
    const enWidgetNames = Object.keys(enWidgets).filter(key => {
      // Skip common sections
      if (commonSections.includes(key)) return false
      
      // Skip if it's not an object
      const value = enWidgets[key]
      if (typeof value !== 'object' || value === null) return false
      
      // A widget should have at least title/description/useCase
      return 'title' in value || 'description' in value || 'useCase' in value
    })
    
    const ruWidgetNames = Object.keys(ruWidgets).filter(key => {
      if (commonSections.includes(key)) return false
      const value = ruWidgets[key]
      if (typeof value !== 'object' || value === null) return false
      return 'title' in value || 'description' in value || 'useCase' in value
    })
    
    // 3. Check for missing widgets in Russian
    for (const widgetName of enWidgetNames) {
      if (!ruWidgetNames.includes(widgetName)) {
        this.addError('ru.json', `widgets.${widgetName}`, 'Missing widget translation')
        continue
      }
      
      // 4. Validate widget structure
      const enWidget = enWidgets[widgetName]
      const ruWidget = ruWidgets[widgetName]
      
      // Always validate basic structure
      const enValid = this.validateWidgetStructure(enWidget, widgetName, 'en.json')
      const ruValid = this.validateWidgetStructure(ruWidget, widgetName, 'ru.json')
      
      // Only compare all keys if both widgets are valid and have more than basic fields
      if (enValid && ruValid) {
        const hasExtraFields = Object.keys(enWidget).length > 3 || Object.keys(ruWidget).length > 3
        if (hasExtraFields) {
          // For full definitions, compare all keys but be less strict
          this.compareWidgetKeys(enWidget, ruWidget, widgetName)
        }
      }
    }
    
    // 5. Check for extra widgets in Russian
    for (const widgetName of ruWidgetNames) {
      if (!enWidgetNames.includes(widgetName)) {
        this.addWarning('ru.json', `widgets.${widgetName}`, 'Extra widget not in English version')
      }
    }
    
    // 6. Check for duplicate widget definitions
    const widgetOccurrences = new Map<string, number>()
    
    // Count occurrences in the full JSON structure
    const countWidgetOccurrences = (obj: any, currentPath: string = '') => {
      for (const [key, value] of Object.entries(obj)) {
        if (enWidgetNames.includes(key) && typeof value === 'object' && 'title' in (value as any)) {
          const count = widgetOccurrences.get(key) || 0
          widgetOccurrences.set(key, count + 1)
        }
        
        if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
          countWidgetOccurrences(value, currentPath ? `${currentPath}.${key}` : key)
        }
      }
    }
    
    countWidgetOccurrences(this.enTranslations)
    
    // Report duplicates only if more than 2 (brief + full is normal)
    for (const [widgetName, count] of widgetOccurrences) {
      if (count > 2) {
        this.addError('en.json', widgetName, `Widget defined ${count} times (should be at most 2: brief + full)`)
      }
    }
    
    // 7. Print results
    this.printResults()
  }
  
  private printResults() {
    if (this.errors.length === 0 && this.warnings.length === 0) {
      console.log('✅ All translation validations passed!')
      return
    }
    
    if (this.errors.length > 0) {
      console.log(`❌ Found ${this.errors.length} error(s):\n`)
      for (const error of this.errors) {
        console.log(`  ${error.file} -> ${error.path}`)
        console.log(`    ${error.message}\n`)
      }
    }
    
    if (this.warnings.length > 0) {
      console.log(`⚠️  Found ${this.warnings.length} warning(s):\n`)
      for (const warning of this.warnings) {
        console.log(`  ${warning.file} -> ${warning.path}`)
        console.log(`    ${warning.message}\n`)
      }
    }
    
    if (this.errors.length > 0) {
      process.exit(1)
    }
  }
}

// Run validation
const validator = new TranslationValidator()
validator.validate()