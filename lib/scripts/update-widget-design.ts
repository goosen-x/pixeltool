#!/usr/bin/env node

/**
 * Script to update all widget components with the new design system
 * This script will:
 * 1. Add necessary imports for new design components
 * 2. Update the component structure to use new layout components
 * 3. Replace old buttons with new styled buttons
 * 4. Update input/textarea components
 */

import { readFileSync, writeFileSync, readdirSync, statSync } from 'fs'
import { join } from 'path'

const TOOLS_DIR = join(process.cwd(), 'app/[locale]/(tools)/tools')

// Import statements to add
const NEW_IMPORTS = `import {
  WidgetLayout,
  WidgetHero,
  WidgetCard,
  WidgetSection,
  WidgetGrid,
  WidgetGridCard
} from '@/components/tools/WidgetLayout'
import {
  WidgetPrimaryButton,
  WidgetSecondaryButton,
  WidgetIconButton,
  WidgetButtonGroup
} from '@/components/tools/WidgetButtons'
import {
  WidgetInput,
  WidgetTextarea,
  WidgetCodeTextarea,
  WidgetCodeInput
} from '@/components/tools/WidgetInputs'`

// Patterns to replace
const REPLACEMENTS = [
	// Replace max-w-* mx-auto with WidgetLayout
	{
		pattern: /<div className="max-w-\w+ mx-auto[\s\S]*?">/,
		replacement: '<WidgetLayout>'
	},
	// Replace Card with WidgetCard
	{
		pattern: /<Card className=".*?">/,
		replacement: '<WidgetCard>'
	},
	// Replace regular buttons with widget buttons
	{
		pattern: /<Button\s+onClick={([^}]+)}\s*>/,
		replacement: '<WidgetPrimaryButton onClick={$1}>'
	},
	{
		pattern: /<Button\s+variant="outline"/,
		replacement: '<WidgetSecondaryButton'
	},
	// Update Textarea with WidgetTextarea
	{
		pattern: /<Textarea/,
		replacement: '<WidgetTextarea'
	},
	// Update Input with WidgetInput
	{
		pattern: /<Input/,
		replacement: '<WidgetInput'
	}
]

function processFile(filePath: string) {
	try {
		let content = readFileSync(filePath, 'utf8')

		// Skip if already updated
		if (content.includes('WidgetLayout')) {
			console.log(`✓ Already updated: ${filePath}`)
			return
		}

		// Add imports after 'use client'
		if (!content.includes('@/components/tools/WidgetLayout')) {
			content = content.replace(
				"'use client'",
				`'use client'\n\n${NEW_IMPORTS}`
			)
		}

		// Apply replacements
		REPLACEMENTS.forEach(({ pattern, replacement }) => {
			content = content.replace(pattern, replacement)
		})

		// Write back
		writeFileSync(filePath, content)
		console.log(`✅ Updated: ${filePath}`)
	} catch (error) {
		console.error(`❌ Error processing ${filePath}:`, error)
	}
}

function processDirectory(dir: string) {
	const entries = readdirSync(dir)

	entries.forEach(entry => {
		const fullPath = join(dir, entry)
		const stat = statSync(fullPath)

		if (stat.isDirectory() && !entry.startsWith('.')) {
			// Look for page.tsx in subdirectory
			const pagePath = join(fullPath, 'page.tsx')
			try {
				if (statSync(pagePath).isFile()) {
					processFile(pagePath)
				}
			} catch (e) {
				// No page.tsx in this directory
			}
		}
	})
}

// Run the script
console.log('🚀 Starting widget design update...')
processDirectory(TOOLS_DIR)
console.log('✨ Widget design update complete!')
