const fs = require('fs')
const path = require('path')

// Widget files that need container size updates
const widgetsToUpdate = [
	'password-generator/page.tsx',
	'bingo-generator/page.tsx',
	'timer-countdown/page.tsx',
	'analytics-dashboard/page.tsx',
	'tip-calculator/page.tsx',
	'qr-generator/test-redirect/page.tsx',
	'percentage-calculator/page.tsx',
	'fancy-text-generator/page.tsx',
	'emoji-list/page.tsx',
	'page.tsx', // tools index page
	'css-gradient-generator/page.tsx'
]

// Function to update container sizes
function updateContainerSizes(filePath) {
	let content = fs.readFileSync(filePath, 'utf8')
	const originalContent = content

	// Replace various max-width classes with max-w-6xl
	content = content.replace(/max-w-2xl/g, 'max-w-6xl')
	content = content.replace(/max-w-3xl/g, 'max-w-6xl')
	content = content.replace(/max-w-4xl/g, 'max-w-6xl')
	content = content.replace(/max-w-5xl/g, 'max-w-6xl')

	if (content !== originalContent) {
		fs.writeFileSync(filePath, content)
		console.log(
			`✅ Updated container sizes in ${path.basename(path.dirname(filePath)) || 'tools'}/page.tsx`
		)
		return true
	}

	return false
}

// Process all widgets
const toolsDir = path.join(
	__dirname,
	'..',
	'app',
	'[locale]',
	'(tools)',
	'tools'
)
let updatedCount = 0

widgetsToUpdate.forEach(widgetPath => {
	const fullPath = path.join(toolsDir, widgetPath)

	if (fs.existsSync(fullPath)) {
		if (updateContainerSizes(fullPath)) {
			updatedCount++
		}
	} else {
		console.log(`❌ File not found: ${widgetPath}`)
	}
})

console.log(`\n✨ Container size unification complete!`)
console.log(`📊 Updated ${updatedCount} files`)
console.log(`\nAll containers now use max-w-6xl for consistency.`)
