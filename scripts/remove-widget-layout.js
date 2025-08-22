#!/usr/bin/env node

const fs = require('fs')
const path = require('path')

// List of files to update
const files = [
	'/Users/dmitryborisenko/Documents/frontend/free/portfolio/app/[locale]/(tools)/tools/age-calculator/page.tsx',
	'/Users/dmitryborisenko/Documents/frontend/free/portfolio/app/[locale]/(tools)/tools/base64-encoder/page.tsx',
	'/Users/dmitryborisenko/Documents/frontend/free/portfolio/app/[locale]/(tools)/tools/bingo-generator/page.tsx',
	'/Users/dmitryborisenko/Documents/frontend/free/portfolio/app/[locale]/(tools)/tools/color-converter/page.tsx',
	'/Users/dmitryborisenko/Documents/frontend/free/portfolio/app/[locale]/(tools)/tools/css-box-shadow-generator/page.tsx',
	'/Users/dmitryborisenko/Documents/frontend/free/portfolio/app/[locale]/(tools)/tools/css-gradient-generator/page.tsx',
	'/Users/dmitryborisenko/Documents/frontend/free/portfolio/app/[locale]/(tools)/tools/email-validator/page.tsx',
	'/Users/dmitryborisenko/Documents/frontend/free/portfolio/app/[locale]/(tools)/tools/json-tools/page.tsx',
	'/Users/dmitryborisenko/Documents/frontend/free/portfolio/app/[locale]/(tools)/tools/jwt-decoder/page.tsx',
	'/Users/dmitryborisenko/Documents/frontend/free/portfolio/app/[locale]/(tools)/tools/password-generator/page.tsx',
	'/Users/dmitryborisenko/Documents/frontend/free/portfolio/app/[locale]/(tools)/tools/qr-generator/page.tsx',
	'/Users/dmitryborisenko/Documents/frontend/free/portfolio/app/[locale]/(tools)/tools/random-number-generator/page.tsx',
	'/Users/dmitryborisenko/Documents/frontend/free/portfolio/app/[locale]/(tools)/tools/regex-tester/page.tsx',
	'/Users/dmitryborisenko/Documents/frontend/free/portfolio/app/[locale]/(tools)/tools/temperature-converter/page.tsx',
	'/Users/dmitryborisenko/Documents/frontend/free/portfolio/app/[locale]/(tools)/tools/text-counter/page.tsx',
	'/Users/dmitryborisenko/Documents/frontend/free/portfolio/app/[locale]/(tools)/tools/uuid-generator/page.tsx'
]

function removeWidgetLayout(filePath) {
	try {
		let content = fs.readFileSync(filePath, 'utf8')

		// Remove WidgetLayout import
		content = content.replace(
			/import\s*{\s*WidgetLayout\s*}\s*from\s*['"]@\/components\/widgets\/WidgetLayout['"]\s*\n?/g,
			''
		)
		content = content.replace(
			/import\s*{\s*WidgetLayout\s*}\s*from\s*['"]@\/components\/widgets['"]\s*\n?/g,
			''
		)

		// Remove WidgetSection import if it's the only import
		content = content.replace(
			/import\s*{\s*WidgetSection\s*}\s*from\s*['"]@\/components\/widgets\/WidgetSection['"]\s*\n?/g,
			''
		)
		content = content.replace(
			/import\s*{\s*WidgetSection\s*}\s*from\s*['"]@\/components\/widgets['"]\s*\n?/g,
			''
		)

		// Replace <WidgetLayout> with <div className="space-y-6">
		content = content.replace(
			/<WidgetLayout>\s*\n?\s*<WidgetSection>/g,
			'<div className="space-y-6">'
		)
		content = content.replace(/<WidgetLayout>/g, '<div className="space-y-6">')

		// Replace </WidgetSection>\s*\n?\s*</WidgetLayout> with </div>
		content = content.replace(
			/<\/WidgetSection>\s*\n?\s*<\/WidgetLayout>/g,
			'</div>'
		)
		content = content.replace(/<\/WidgetLayout>/g, '</div>')

		// Also handle WidgetSection separately
		content = content.replace(/<WidgetSection>/g, '<div>')
		content = content.replace(/<\/WidgetSection>/g, '</div>')

		// Save the updated file
		fs.writeFileSync(filePath, content, 'utf8')
		console.log(`✅ Updated: ${path.basename(path.dirname(filePath))}`)
	} catch (error) {
		console.error(`❌ Error updating ${filePath}:`, error.message)
	}
}

// Process all files
console.log('🔄 Removing WidgetLayout from widgets...\n')
files.forEach(removeWidgetLayout)
console.log('\n✨ Done!')
