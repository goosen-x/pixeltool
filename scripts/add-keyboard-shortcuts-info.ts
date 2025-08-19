import fs from 'fs'
import path from 'path'
import { widgetShortcuts } from '../lib/constants/widgetShortcuts'

const TOOLS_DIR = path.join(process.cwd(), 'app/[locale]/(tools)/tools')

// Get all widget directories
const widgetDirs = Object.keys(widgetShortcuts)

async function addKeyboardShortcutInfo() {
	console.log(`Found ${widgetDirs.length} widgets with keyboard shortcuts`)

	for (const widgetDir of widgetDirs) {
		const pagePath = path.join(TOOLS_DIR, widgetDir, 'page.tsx')

		if (!fs.existsSync(pagePath)) {
			console.log(`⚠️  Skipping ${widgetDir} - page.tsx not found`)
			continue
		}

		let content = fs.readFileSync(pagePath, 'utf-8')

		// Skip if already has KeyboardShortcutInfo
		if (content.includes('KeyboardShortcutInfo')) {
			console.log(`✓ ${widgetDir} - already has KeyboardShortcutInfo`)
			continue
		}

		// Add import if not exists
		if (
			!content.includes(
				"import { KeyboardShortcutInfo } from '@/components/widgets'"
			)
		) {
			// Find the last import statement
			const importRegex = /^import .* from .*/gm
			const imports = content.match(importRegex) || []
			const lastImport = imports[imports.length - 1]

			if (lastImport) {
				const lastImportIndex = content.lastIndexOf(lastImport)
				const insertPosition = lastImportIndex + lastImport.length
				content =
					content.slice(0, insertPosition) +
					"\nimport { KeyboardShortcutInfo } from '@/components/widgets'" +
					content.slice(insertPosition)
			}
		}

		// Find where to insert KeyboardShortcutInfo
		// Look for common patterns in the sidebar or after main content
		const patterns = [
			// Pattern 1: After Statistics card
			/(<\/Card>\s*{\s*\/\*\s*History\s*\*\/})/,
			// Pattern 2: In sidebar space-y-6
			/(<div className=['"]space-y-6['"]>[\s\S]*?)(<\/div>\s*<\/div>\s*<\/div>\s*$)/,
			// Pattern 3: Before closing of main container
			/(<\/div>\s*<\/div>\s*<\/div>\s*\)[\s\S]*?})/,
			// Pattern 4: After last Card in the component
			/([\s\S]*<\/Card>)([\s\S]*?<\/div>\s*<\/div>\s*\))/
		]

		let inserted = false
		for (const pattern of patterns) {
			if (pattern.test(content)) {
				content = content.replace(pattern, (match, p1, p2) => {
					if (p2) {
						return (
							p1 +
							'\n\n\t\t\t\t\t{/* Keyboard Shortcuts */}\n\t\t\t\t\t<KeyboardShortcutInfo />' +
							p2
						)
					} else {
						return (
							'\n\n\t\t\t\t\t{/* Keyboard Shortcuts */}\n\t\t\t\t\t<KeyboardShortcutInfo />\n' +
							match
						)
					}
				})
				inserted = true
				break
			}
		}

		if (!inserted) {
			console.log(
				`⚠️  ${widgetDir} - couldn't find suitable location for KeyboardShortcutInfo`
			)
			continue
		}

		// Write the updated content
		fs.writeFileSync(pagePath, content)
		console.log(`✅ ${widgetDir} - added KeyboardShortcutInfo`)
	}
}

addKeyboardShortcutInfo().catch(console.error)
