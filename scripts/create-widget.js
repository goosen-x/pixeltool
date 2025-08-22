#!/usr/bin/env node

const fs = require('fs')
const path = require('path')
const readline = require('readline')

const rl = readline.createInterface({
	input: process.stdin,
	output: process.stdout
})

function prompt(question) {
	return new Promise(resolve => {
		rl.question(question, answer => {
			resolve(answer.trim())
		})
	})
}

function toPascalCase(str) {
	return str
		.split(/[-_\s]+/)
		.map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
		.join('')
}

function toCamelCase(str) {
	const pascal = toPascalCase(str)
	return pascal.charAt(0).toLowerCase() + pascal.slice(1)
}

function toKebabCase(str) {
	return str
		.replace(/([a-z])([A-Z])/g, '$1-$2')
		.replace(/[\s_]+/g, '-')
		.toLowerCase()
}

async function createWidget() {
	console.log('🚀 Widget Creator for PixelTool')
	console.log('================================\n')

	// Get widget details
	const name = await prompt('Widget name (e.g., "Password Generator"): ')
	const description = await prompt('Brief description: ')
	const category = await prompt(
		'Category (css/converter/generator/calculator/formatter/validator/tool): '
	)
	const tags = await prompt(
		'Tags (comma-separated, e.g., "password,security,generator"): '
	)
	const iconName = await prompt(
		'Icon name from lucide-react (e.g., "Key", "Lock", "Shield"): '
	)

	if (!name || !description) {
		console.error('❌ Widget name and description are required!')
		rl.close()
		return
	}

	const widgetId = toKebabCase(name)
	const translationKey = toCamelCase(name)
	const pascalName = toPascalCase(name)

	console.log(`\n📋 Creating widget:`)
	console.log(`   ID: ${widgetId}`)
	console.log(`   Translation Key: ${translationKey}`)
	console.log(`   Component: ${pascalName}`)

	const confirm = await prompt('\nProceed? (y/n): ')
	if (confirm.toLowerCase() !== 'y') {
		console.log('❌ Cancelled')
		rl.close()
		return
	}

	try {
		// Create widget directory
		const widgetDir = path.join(
			process.cwd(),
			'app',
			'[locale]',
			'(tools)',
			'tools',
			widgetId
		)
		if (!fs.existsSync(widgetDir)) {
			fs.mkdirSync(widgetDir, { recursive: true })
		}

		// Read template
		const templatePath = path.join(
			process.cwd(),
			'app',
			'[locale]',
			'(tools)',
			'tools',
			'_template',
			'page.tsx'
		)
		let template = fs.readFileSync(templatePath, 'utf8')

		// Replace template placeholders
		template = template
			.replace(/template-widget/g, widgetId)
			.replace(/templateWidget/g, translationKey)
			.replace(/TemplateWidget/g, pascalName)
			.replace(/Sparkles/g, iconName)
			.replace(/from-purple-500 to-pink-600/g, getRandomGradient())

		// Write widget file
		const widgetPath = path.join(widgetDir, 'page.tsx')
		fs.writeFileSync(widgetPath, template)

		// Add to widgets.ts
		await addToWidgetsConfig(
			widgetId,
			translationKey,
			iconName,
			category || 'tool',
			tags
		)

		// Create translation templates
		await createTranslationTemplates(translationKey, name, description)

		console.log('\n✅ Widget created successfully!')
		console.log('\n📝 Next steps:')
		console.log(
			`   1. Update translations in messages/en.json and messages/ru.json`
		)
		console.log(`   2. Implement widget logic in ${widgetPath}`)
		console.log(`   3. Run 'npm run generate:types' to update TypeScript types`)
		console.log(
			`   4. Test your widget at http://localhost:3000/en/tools/${widgetId}`
		)
	} catch (error) {
		console.error('❌ Error creating widget:', error.message)
	}

	rl.close()
}

async function addToWidgetsConfig(
	widgetId,
	translationKey,
	iconName,
	category,
	tagsStr
) {
	const widgetsPath = path.join(process.cwd(), 'lib', 'constants', 'widgets.ts')
	let content = fs.readFileSync(widgetsPath, 'utf8')

	const tags = tagsStr
		.split(',')
		.map(tag => tag.trim())
		.filter(Boolean)

	const widgetEntry = `
	{
		id: '${widgetId}',
		path: '${widgetId}',
		translationKey: '${translationKey}',
		icon: ${iconName},
		gradient: '${getRandomGradient()}',
		category: '${category}',
		tags: [${tags.map(tag => `'${tag}'`).join(', ')}],
		isNew: true
	},`

	// Find the end of the widgets array and insert before the closing bracket
	const insertIndex = content.lastIndexOf(']')
	if (insertIndex === -1) {
		throw new Error('Could not find widgets array in widgets.ts')
	}

	content =
		content.slice(0, insertIndex) +
		widgetEntry +
		'\n' +
		content.slice(insertIndex)

	// Add import for icon if not already present
	if (!content.includes(`${iconName},`)) {
		const importMatch = content.match(/import {([^}]+)} from 'lucide-react'/)
		if (importMatch) {
			const imports = importMatch[1].trim()
			const newImports = imports + `, ${iconName}`
			content = content.replace(
				importMatch[0],
				`import { ${newImports} } from 'lucide-react'`
			)
		}
	}

	fs.writeFileSync(widgetsPath, content)
}

async function createTranslationTemplates(translationKey, name, description) {
	// Read template translations
	const templatePath = path.join(
		process.cwd(),
		'templates',
		'widget-translations-template.json'
	)
	const template = JSON.parse(fs.readFileSync(templatePath, 'utf8'))

	// Create English translations
	const enPath = path.join(process.cwd(), 'messages', 'en.json')
	const enTranslations = JSON.parse(fs.readFileSync(enPath, 'utf8'))

	const enWidgetTranslations = { ...template.templateWidget }
	enWidgetTranslations.title = name
	enWidgetTranslations.description = description

	if (!enTranslations.widgets) {
		enTranslations.widgets = {}
	}
	enTranslations.widgets[translationKey] = enWidgetTranslations

	fs.writeFileSync(enPath, JSON.stringify(enTranslations, null, 2) + '\n')

	// Create Russian translations (placeholder)
	const ruPath = path.join(process.cwd(), 'messages', 'ru.json')
	const ruTranslations = JSON.parse(fs.readFileSync(ruPath, 'utf8'))

	const ruWidgetTranslations = { ...template.templateWidget }
	ruWidgetTranslations.title = `${name} (RU)` // Placeholder
	ruWidgetTranslations.description = `${description} (RU)` // Placeholder

	if (!ruTranslations.widgets) {
		ruTranslations.widgets = {}
	}
	ruTranslations.widgets[translationKey] = ruWidgetTranslations

	fs.writeFileSync(ruPath, JSON.stringify(ruTranslations, null, 2) + '\n')
}

function getRandomGradient() {
	const gradients = [
		'from-blue-500 to-purple-600',
		'from-green-500 to-teal-600',
		'from-orange-500 to-red-600',
		'from-indigo-500 to-blue-600',
		'from-pink-500 to-rose-600',
		'from-purple-500 to-indigo-600',
		'from-cyan-500 to-blue-600',
		'from-emerald-500 to-green-600',
		'from-amber-500 to-orange-600',
		'from-violet-500 to-purple-600'
	]
	return gradients[Math.floor(Math.random() * gradients.length)]
}

createWidget().catch(console.error)
