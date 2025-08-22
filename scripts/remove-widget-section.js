#!/usr/bin/env node

const fs = require('fs')
const path = require('path')

// List of files that use WidgetSection
const files = [
	'uuid-generator',
	'text-counter',
	'temperature-converter',
	'regex-tester',
	'random-number-generator',
	'qr-generator',
	'password-generator',
	'jwt-decoder',
	'json-tools',
	'email-validator',
	'css-gradient-generator',
	'css-box-shadow-generator',
	'color-converter',
	'bingo-generator',
	'base64-encoder',
	'ascii-art-generator'
].map(
	name =>
		`/Users/dmitryborisenko/Documents/frontend/free/portfolio/app/[locale]/(tools)/tools/${name}/page.tsx`
)

function removeWidgetSection(filePath) {
	try {
		let content = fs.readFileSync(filePath, 'utf8')

		// Check if file uses WidgetSection
		if (!content.includes('WidgetSection')) {
			return
		}

		// Remove WidgetSection import
		content = content.replace(
			/import\s*{\s*WidgetSection\s*}\s*from\s*['"]@\/components\/widgets\/WidgetSection['"]\s*\n?/g,
			''
		)
		content = content.replace(
			/import\s*{\s*WidgetSection\s*}\s*from\s*['"]@\/components\/widgets['"]\s*\n?/g,
			''
		)

		// Replace WidgetSection with Card
		// First, ensure Card is imported
		if (!content.includes('import { Card }') && !content.includes('Card,')) {
			// Check if there's already a Card import in another ui import
			const hasCardInImport =
				/import\s*{[^}]*Card[^}]*}\s*from\s*['"]@\/components\/ui\/card['"]/.test(
					content
				)

			if (!hasCardInImport) {
				// Add Card import after other ui imports
				const uiImportMatch = content.match(
					/import\s*{[^}]+}\s*from\s*['"]@\/components\/ui\/[^'"]+['"]/g
				)
				if (uiImportMatch && uiImportMatch.length > 0) {
					const lastUiImport = uiImportMatch[uiImportMatch.length - 1]
					content = content.replace(
						lastUiImport,
						lastUiImport + "\nimport { Card } from '@/components/ui/card'"
					)
				} else {
					// Add at the beginning after 'use client'
					content = content.replace(
						"'use client'\n",
						"'use client'\n\nimport { Card } from '@/components/ui/card'\n"
					)
				}
			}
		}

		// Replace <WidgetSection icon={...} title="..." description="..."> with <Card className="p-6">
		// This regex handles multi-line WidgetSection tags
		content = content.replace(/<WidgetSection[\s\S]*?>/g, match => {
			// Check if it has a className
			const classNameMatch = match.match(/className=['"](.*?)['"]/)
			const className = classNameMatch ? classNameMatch[1] : ''

			// Combine p-6 with existing className
			const combinedClassName = className ? `p-6 ${className}` : 'p-6'

			return `<Card className="${combinedClassName}">`
		})

		// Replace </WidgetSection> with </Card>
		content = content.replace(/<\/WidgetSection>/g, '</Card>')

		// Save the updated file
		fs.writeFileSync(filePath, content, 'utf8')
		console.log(`✅ Updated: ${path.basename(path.dirname(filePath))}`)
	} catch (error) {
		console.error(`❌ Error updating ${filePath}:`, error.message)
	}
}

// Process all files
console.log('🔄 Removing WidgetSection from widgets...\n')
files.forEach(removeWidgetSection)
console.log('\n✨ Done!')
