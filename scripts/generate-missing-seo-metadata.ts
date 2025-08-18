#!/usr/bin/env tsx

import { readFileSync, writeFileSync } from 'fs'
import { join } from 'path'

// Read current widget metadata
const metadataPath = join(process.cwd(), 'lib/seo/widget-metadata.ts')
const widgetsPath = join(process.cwd(), 'lib/constants/widgets.ts')

// Extract widget paths from widgets.ts
const widgetsContent = readFileSync(widgetsPath, 'utf-8')
const pathMatches = widgetsContent.matchAll(/path:\s*'([^']+)'/g)
const allWidgetPaths = Array.from(pathMatches).map(match => match[1])

// Extract existing metadata keys
const metadataContent = readFileSync(metadataPath, 'utf-8')
const existingPathMatches = metadataContent.matchAll(/\s+'([^']+)':\s*{/g)
const existingPaths = Array.from(existingPathMatches).map(match => match[1])

// Find missing widgets
const missingWidgets = allWidgetPaths.filter(
	path => !metadataContent.includes(`'${path}':`)
)

console.log('📊 Widget SEO Metadata Status:')
console.log(
	`✅ Widgets with metadata: ${allWidgetPaths.length - missingWidgets.length}`
)
console.log(`❌ Missing metadata: ${missingWidgets.length}`)

if (missingWidgets.length > 0) {
	console.log('\n🔍 Widgets missing SEO metadata:')
	missingWidgets.forEach(widget => {
		console.log(`   - ${widget}`)
	})
}

// Generate template for missing widgets
const generateMetadataTemplate = (widgetPath: string) => {
	const widgetName = widgetPath
		.split('-')
		.map(word => word.charAt(0).toUpperCase() + word.slice(1))
		.join(' ')

	return `  '${widgetPath}': {
    en: {
      title: '${widgetName} - Free Online Tool | PixelTool',
      description: 'Free online ${widgetName.toLowerCase()} tool. [Add specific description]. Perfect for [use cases].',
      keywords: ['${widgetPath.replace(/-/g, ' ')}', '${widgetName.toLowerCase()}', 'online tool', 'free tool']
    },
    ru: {
      title: '${widgetName} - Бесплатный Онлайн Инструмент | PixelTool',
      description: 'Бесплатный онлайн ${widgetName.toLowerCase()} инструмент. [Добавить описание]. Идеально для [случаи использования].',
      keywords: ['${widgetPath.replace(/-/g, ' ')}', '${widgetName.toLowerCase()}', 'онлайн инструмент', 'бесплатный инструмент']
    },
  },`
}

if (missingWidgets.length > 0) {
	console.log('\n📝 Generated metadata templates:')
	console.log('\nAdd these to lib/seo/widget-metadata.ts:\n')
	missingWidgets.forEach(widget => {
		console.log(generateMetadataTemplate(widget))
	})
}

export {}
