import { readdir, readFile, writeFile } from 'fs/promises'
import { join } from 'path'

const TOOLS_DIR = join(process.cwd(), 'app/[locale]/(tools)/tools')

// Widgets that already have keyboard shortcuts
const WIDGETS_WITH_SHORTCUTS = [
	'ascii-art-generator',
	'json-tools',
	'email-validator',
	'css-gradient-generator',
	'css-box-shadow-generator',
	'text-case-converter',
	'compound-interest-calculator',
	'percentage-calculator',
	'bmi-calculator',
	'coin-flip',
	'dice-roller',
	'age-calculator',
	'random-number-generator',
	'team-randomizer',
	'password-generator',
	'qr-generator',
	'uuid-generator',
	'base64-encoder',
	'color-converter',
	'text-counter',
	'regex-tester'
]

// Template for adding keyboard shortcuts
const KEYBOARD_IMPORT = `import { useWidgetKeyboard } from '@/lib/hooks/useWidgetKeyboard'`

const KEYBOARD_SHORTCUTS_TEMPLATE = `
  // Keyboard shortcuts
  const shortcuts = [
    {
      key: 'Enter',
      action: () => {
        // Main action - customize per widget
      },
      description: t('shortcuts.execute')
    },
    {
      key: 'c',
      ctrl: true,
      action: () => {
        // Copy action - customize per widget
      },
      description: t('shortcuts.copy')
    },
    {
      key: 'k',
      ctrl: true,
      action: () => {
        // Clear/reset action - customize per widget
      },
      description: t('shortcuts.clear')
    }
  ]

  useWidgetKeyboard({
    shortcuts,
    widgetId: 'WIDGET_ID'
  })
`

async function addKeyboardShortcuts() {
	const widgets = await readdir(TOOLS_DIR)

	for (const widget of widgets) {
		if (WIDGETS_WITH_SHORTCUTS.includes(widget)) {
			console.log(`✓ ${widget} - already has keyboard shortcuts`)
			continue
		}

		const pagePath = join(TOOLS_DIR, widget, 'page.tsx')

		try {
			let content = await readFile(pagePath, 'utf-8')

			// Check if it's a client component
			if (!content.includes("'use client'")) {
				console.log(`⚠️  ${widget} - not a client component, skipping`)
				continue
			}

			// Add import if not present
			if (!content.includes('useWidgetKeyboard')) {
				// Find the last import line
				const importMatch = content.match(/(import[\s\S]*?)\n\n/m)
				if (importMatch) {
					const imports = importMatch[1]
					content = content.replace(imports, imports + '\n' + KEYBOARD_IMPORT)
				}
			}

			// Find the function component
			const functionMatch = content.match(/export default function \w+\(\) {/)
			if (!functionMatch) {
				console.log(`⚠️  ${widget} - couldn't find function component`)
				continue
			}

			// Check if shortcuts already exist
			if (content.includes('useWidgetKeyboard')) {
				console.log(`✓ ${widget} - already has useWidgetKeyboard`)
				continue
			}

			// Find where to insert shortcuts (after hooks, before return)
			const returnMatch = content.match(/(\n\s*)return \(/)
			if (!returnMatch) {
				console.log(`⚠️  ${widget} - couldn't find return statement`)
				continue
			}

			// Insert keyboard shortcuts
			const shortcutsCode = KEYBOARD_SHORTCUTS_TEMPLATE.replace(
				'WIDGET_ID',
				widget
			)
			const insertPosition = returnMatch.index!
			content =
				content.slice(0, insertPosition) +
				shortcutsCode +
				content.slice(insertPosition)

			await writeFile(pagePath, content)
			console.log(`✅ ${widget} - added keyboard shortcuts`)
		} catch (error) {
			console.log(`❌ ${widget} - error: ${error}`)
		}
	}
}

addKeyboardShortcuts().catch(console.error)
