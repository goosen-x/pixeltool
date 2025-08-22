#!/usr/bin/env node

const fs = require('fs')
const path = require('path')

// List of files that need fixing
const files = [
	'qr-generator',
	'base64-encoder',
	'password-generator',
	'text-counter',
	'uuid-generator',
	'css-gradient-generator',
	'json-tools'
].map(
	name =>
		`/Users/dmitryborisenko/Documents/frontend/free/portfolio/app/[locale]/(tools)/tools/${name}/page.tsx`
)

function fixBrokenCards(filePath) {
	try {
		let content = fs.readFileSync(filePath, 'utf8')

		// Fix broken Card tags like: <Card className="p-6 w-5 h-5">}
		// The regex should match the broken pattern and fix it
		content = content.replace(
			/<Card className="p-6[^"]*">}[\s\S]*?>/g,
			'<Card className="p-6">'
		)

		// Remove orphaned lines like: title={t('...')}
		// Remove lines that start with whitespace followed by title=, description=, etc.
		content = content.replace(
			/^\s*(title|description|icon)=\{[^}]+\}\s*$/gm,
			''
		)

		// Remove extra closing braces
		content = content.replace(/^\s*>\s*$/gm, '')

		// Save the updated file
		fs.writeFileSync(filePath, content, 'utf8')
		console.log(`✅ Fixed: ${path.basename(path.dirname(filePath))}`)
	} catch (error) {
		console.error(`❌ Error fixing ${filePath}:`, error.message)
	}
}

// Process all files
console.log('🔧 Fixing broken Card components...\n')
files.forEach(fixBrokenCards)
console.log('\n✨ Done!')
