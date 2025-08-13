#!/usr/bin/env node

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

interface TranslationStructure {
  [key: string]: any
}

class TranslationTypeGenerator {
  private enTranslations: TranslationStructure
  private output: string[] = []
  
  constructor() {
    const enPath = path.join(__dirname, '../messages/en.json')
    this.enTranslations = JSON.parse(fs.readFileSync(enPath, 'utf-8'))
  }
  
  private indent(level: number): string {
    return '  '.repeat(level)
  }
  
  private generateTypeForValue(value: any, key: string, level: number = 0): string {
    if (value === null) return 'null'
    if (value === undefined) return 'undefined'
    
    const type = typeof value
    
    switch (type) {
      case 'string':
        return 'string'
      case 'number':
        return 'number'
      case 'boolean':
        return 'boolean'
      case 'object':
        if (Array.isArray(value)) {
          if (value.length === 0) return 'any[]'
          // Analyze array items
          const itemTypes = new Set(value.map(item => this.generateTypeForValue(item, key, level)))
          if (itemTypes.size === 1) {
            return `${itemTypes.values().next().value}[]`
          }
          return 'any[]'
        }
        
        // Object type
        const lines: string[] = ['{']
        
        for (const [objKey, objValue] of Object.entries(value)) {
          const valueType = this.generateTypeForValue(objValue, objKey, level + 1)
          
          // Make widget definitions optional if they're brief
          const isOptional = key === 'widgets' && 
            typeof objValue === 'object' && 
            objValue !== null &&
            !Array.isArray(objValue) &&
            Object.keys(objValue).length === 3 &&
            'title' in objValue && 
            'description' in objValue && 
            'useCase' in objValue
          
          lines.push(`${this.indent(level + 1)}${objKey}${isOptional ? '?' : ''}: ${valueType}`)
        }
        
        lines.push(`${this.indent(level)}}`)
        return lines.join('\n')
      default:
        return 'any'
    }
  }
  
  public generate() {
    console.log('🔨 Generating translation types...\n')
    
    // Header
    this.output.push('// Auto-generated translation types from en.json')
    this.output.push('// Generated on: ' + new Date().toISOString())
    this.output.push('// DO NOT EDIT MANUALLY - Run npm run generate:types instead')
    this.output.push('')
    
    // Generate main interface
    this.output.push('export interface GeneratedTranslations {')
    
    for (const [key, value] of Object.entries(this.enTranslations)) {
      const valueType = this.generateTypeForValue(value, key, 1)
      this.output.push(`  ${key}: ${valueType}`)
    }
    
    this.output.push('}')
    this.output.push('')
    
    // Generate widget name type
    const widgetNames = Object.keys(this.enTranslations.widgets || {})
      .filter(key => !['search', 'favorites', 'rightSidebar', 'categories', 'tools', 'newsletter', 'legal', 'shortcuts'].includes(key))
    
    this.output.push('// All widget names from translation file')
    this.output.push(`export type GeneratedWidgetName = ${widgetNames.map(name => `'${name}'`).join(' | ') || 'never'}`)
    this.output.push('')
    
    // Generate validation helper
    this.output.push('// Runtime validation helper')
    this.output.push('export const WIDGET_NAMES = [')
    widgetNames.forEach(name => {
      this.output.push(`  '${name}',`)
    })
    this.output.push('] as const')
    
    // Write to file
    const outputPath = path.join(__dirname, '../types/generated-translations.ts')
    fs.writeFileSync(outputPath, this.output.join('\n'))
    
    console.log(`✅ Generated types written to: ${outputPath}`)
    console.log(`📊 Found ${widgetNames.length} widgets`)
  }
}

// Run generator
const generator = new TranslationTypeGenerator()
generator.generate()