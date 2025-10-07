const fs = require('fs')
const path = require('path')

const widgetsPath = path.join(__dirname, '../lib/constants/widgets.ts')
let content = fs.readFileSync(widgetsPath, 'utf8')

// Regex to match faqs blocks with en/ru/he structure and replace with only ru
const faqsRegex = /faqs:\s*\{[^}]*en:\s*\[[^\]]*\],[^}]*ru:\s*(\[[^\]]*\])(?:,\s*he:\s*\[[^\]]*\])?\s*\}/gs

content = content.replace(faqsRegex, (match) => {
	// Extract only the Russian FAQ array
	const ruMatch = match.match(/ru:\s*(\[[^\]]*\])/s)
	if (ruMatch) {
		return `faqs: ${ruMatch[1]}`
	}
	return match
})

fs.writeFileSync(widgetsPath, content, 'utf8')
console.log('✅ Removed all translations, kept only Russian FAQs')
