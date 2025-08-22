#!/usr/bin/env node

const fs = require('fs')
const path = require('path')
const readline = require('readline')

const rl = readline.createInterface({
	input: process.stdin,
	output: process.stdout
})

// Список всех доступных иконок из Lucide React
const AVAILABLE_ICONS = [
	'Globe',
	'Key',
	'Lock',
	'Shield',
	'Search',
	'Calculator',
	'Code',
	'Palette',
	'FileText',
	'Image',
	'Camera',
	'Music',
	'Video',
	'Mail',
	'Phone',
	'Clock',
	'Calendar',
	'Map',
	'Settings',
	'User',
	'Users',
	'Heart',
	'Star',
	'Share',
	'Download',
	'Upload',
	'Save',
	'Edit',
	'Copy',
	'Trash',
	'Archive',
	'Filter',
	'Sort',
	'Zap',
	'Wifi',
	'Bluetooth',
	'Battery',
	'Volume',
	'Play',
	'Pause',
	'Sparkles',
	'Wand',
	'Target',
	'Award',
	'Gift',
	'Briefcase',
	'ShoppingCart',
	'CreditCard',
	'DollarSign',
	'TrendingUp',
	'BarChart',
	'PieChart',
	'Activity',
	'Monitor',
	'Smartphone',
	'Tablet',
	'Laptop',
	'Server',
	'Database',
	'Cloud',
	'Cpu',
	'HardDrive',
	'MemoryStick',
	'Router',
	'Terminal',
	'Code2',
	'FileCode',
	'GitBranch',
	'Package',
	'Layers',
	'Component',
	'Puzzle',
	'Wrench',
	'Hammer'
]

const CATEGORIES = [
	'webdev',
	'business',
	'content',
	'security',
	'multimedia',
	'analytics',
	'lifestyle'
]

const GRADIENTS = [
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

function validateIcon(iconName) {
	if (!AVAILABLE_ICONS.includes(iconName)) {
		console.log(`⚠️  Icon "${iconName}" not found in Lucide React.`)
		console.log(
			`Available icons: ${AVAILABLE_ICONS.slice(0, 20).join(', ')}...`
		)
		return false
	}
	return true
}

function validateCategory(category) {
	if (!CATEGORIES.includes(category)) {
		console.log(`⚠️  Category "${category}" not valid.`)
		console.log(`Available categories: ${CATEGORIES.join(', ')}`)
		return false
	}
	return true
}

// Функция для правильного добавления переводов в JSON
function addTranslationToJson(filePath, translationKey, translations) {
	const content = fs.readFileSync(filePath, 'utf8')
	const json = JSON.parse(content)

	// Убеждаемся, что секция widgets существует
	if (!json.widgets) {
		json.widgets = {}
	}

	// Добавляем перевод в секцию widgets
	json.widgets[translationKey] = translations

	// Записываем обратно с правильным форматированием
	fs.writeFileSync(filePath, JSON.stringify(json, null, '\t') + '\n')
}

// Функция для добавления виджета в widgets.ts в правильное место
function addToWidgetsConfig(
	widgetId,
	translationKey,
	iconName,
	category,
	tags,
	gradient
) {
	try {
		const widgetsPath = path.join(
			process.cwd(),
			'lib',
			'constants',
			'widgets.ts'
		)
		let content = fs.readFileSync(widgetsPath, 'utf8')

		// Проверяем, что виджет не существует
		if (content.includes(`id: '${widgetId}'`)) {
			console.log(`⚠️  Widget "${widgetId}" already exists in widgets.ts`)
			return false
		}

		// Добавляем импорт иконки, если её нет
		const iconImportRegex =
			/import\s*{\s*([^}]+)\s*}\s*from\s*['"]lucide-react['"]/
		const iconImportMatch = content.match(iconImportRegex)

		if (iconImportMatch) {
			const existingIcons = iconImportMatch[1].split(',').map(i => i.trim())
			if (!existingIcons.includes(iconName)) {
				const newImports = [...existingIcons, iconName].sort().join(', ')
				content = content.replace(
					iconImportMatch[0],
					`import { ${newImports} } from 'lucide-react'`
				)
			}
		}

		// Создаём новую запись виджета
		const widgetEntry = `\t{
\t\tid: '${widgetId}',
\t\tpath: '${widgetId}',
\t\ttranslationKey: '${translationKey}',
\t\ticon: ${iconName},
\t\tgradient: '${gradient}',
\t\tcategory: '${category}',
\t\ttags: [${tags.map(tag => `'${tag}'`).join(', ')}],
\t},`

		// Ищем конец массива widgets - место перед ']' после 'export const widgets: Widget[] = ['
		const widgetsArrayStart = content.indexOf(
			'export const widgets: Widget[] = ['
		)
		if (widgetsArrayStart === -1) {
			throw new Error('Could not find widgets array declaration in widgets.ts')
		}

		// Ищем первую ']' после объявления массива widgets, исключая другие массивы
		let arrayEndIndex = -1
		let braceCount = 0
		let insideString = false
		let stringChar = ''

		for (
			let i = widgetsArrayStart + 'export const widgets: Widget[] = ['.length;
			i < content.length;
			i++
		) {
			const char = content[i]

			if (insideString) {
				if (char === stringChar && content[i - 1] !== '\\\\') {
					insideString = false
				}
				continue
			}

			if (char === '"' || char === "'" || char === '`') {
				insideString = true
				stringChar = char
				continue
			}

			if (char === '[' || char === '{') {
				braceCount++
			} else if (char === ']' || char === '}') {
				braceCount--
				if (char === ']' && braceCount === -1) {
					arrayEndIndex = i
					break
				}
			}
		}

		if (arrayEndIndex === -1) {
			throw new Error(
				'Could not find widgets array closing bracket in widgets.ts'
			)
		}

		// Проверяем, нужна ли запятая перед вставкой
		const beforeClosing = content.slice(0, arrayEndIndex).trim()
		const needsComma =
			beforeClosing.endsWith('}') && !beforeClosing.endsWith(',')

		// Вставляем новый виджет перед закрывающей скобкой
		const insertion = needsComma ? ',' + widgetEntry + '\n' : widgetEntry + '\n'
		content =
			content.slice(0, arrayEndIndex) + insertion + content.slice(arrayEndIndex)

		fs.writeFileSync(widgetsPath, content)
		return true
	} catch (error) {
		console.error('❌ Error adding widget to widgets.ts:', error.message)
		return false
	}
}

async function createWidget() {
	console.log('🚀 Улучшенный Widget Creator для PixelTool')
	console.log('==========================================\n')

	try {
		// Получаем данные виджета с валидацией
		const name = await prompt(
			'Название виджета (например, "Password Generator"): '
		)
		const description = await prompt('Краткое описание: ')

		let category
		do {
			category = await prompt(`Категория (${CATEGORIES.join('/')}): `)
		} while (!validateCategory(category))

		const tags = await prompt(
			'Теги (через запятую, например, "password,security,generator"): '
		)

		let iconName
		do {
			iconName = await prompt(
				`Иконка из lucide-react (например, "Globe", "Key", "Lock"): `
			)
		} while (!validateIcon(iconName))

		if (!name || !description) {
			console.error('❌ Название и описание виджета обязательны!')
			rl.close()
			return
		}

		const widgetId = toKebabCase(name)
		const translationKey = toCamelCase(name)
		const pascalName = toPascalCase(name)
		const gradient = GRADIENTS[Math.floor(Math.random() * GRADIENTS.length)]
		const tagsArray = tags
			.split(',')
			.map(tag => tag.trim())
			.filter(Boolean)

		console.log(`\\n📋 Создаём виджет:`)
		console.log(`   ID: ${widgetId}`)
		console.log(`   Translation Key: ${translationKey}`)
		console.log(`   Component: ${pascalName}`)
		console.log(`   Category: ${category}`)
		console.log(`   Icon: ${iconName}`)
		console.log(`   Gradient: ${gradient}`)

		const confirm = await prompt('\\nПродолжить? (y/n): ')
		if (confirm.toLowerCase() !== 'y') {
			console.log('❌ Отменено')
			rl.close()
			return
		}

		// 1. Создаём директорию виджета
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
			console.log('✅ Создана директория виджета')
		}

		// 2. Создаём файл виджета из шаблона
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

		// Заменяем все плейсхолдеры
		template = template
			.replace(/template-widget/g, widgetId)
			.replace(/templateWidget/g, translationKey)
			.replace(/TemplateWidget/g, pascalName)
			.replace(/Sparkles/g, iconName)
			.replace(/from-purple-500 to-pink-600/g, gradient)
			.replace(
				/<Sparkles className="w-6 h-6 text-primary" \/>/g,
				`<${iconName} className="w-6 h-6 text-primary" />`
			)
			.replace(
				/<Sparkles className="w-4 h-4 mr-2" \/>/g,
				`<${iconName} className="w-4 h-4 mr-2" />`
			)

		const widgetPath = path.join(widgetDir, 'page.tsx')
		fs.writeFileSync(widgetPath, template)
		console.log('✅ Создан файл виджета')

		// 3. Добавляем виджет в widgets.ts
		addToWidgetsConfig(
			widgetId,
			translationKey,
			iconName,
			category,
			tagsArray,
			gradient
		)
		console.log('✅ Добавлен в widgets.ts')

		// 4. Добавляем переводы в правильное место
		const enTranslations = {
			title: name,
			description: description,
			useCase: `Use this tool for ${description.toLowerCase()}`,

			inputs: {
				placeholder: 'Enter value...'
			},

			actions: {
				calculate: 'Calculate',
				generate: 'Generate',
				validate: 'Validate',
				convert: 'Convert',
				clear: 'Clear',
				copy: 'Copy Result'
			},

			results: {
				result: 'Result',
				copied: 'Copied to clipboard!'
			},

			validation: {
				required: 'This field is required',
				invalid: 'Invalid input'
			}
		}

		const ruTranslations = {
			title: `${name} (нужен перевод)`,
			description: `${description} (нужен перевод)`,
			useCase: `Используйте этот инструмент для ${description.toLowerCase()} (нужен перевод)`,

			inputs: {
				placeholder: 'Введите значение...'
			},

			actions: {
				calculate: 'Вычислить',
				generate: 'Сгенерировать',
				validate: 'Проверить',
				convert: 'Конвертировать',
				clear: 'Очистить',
				copy: 'Копировать результат'
			},

			results: {
				result: 'Результат',
				copied: 'Скопировано в буфер обмена!'
			},

			validation: {
				required: 'Это поле обязательно',
				invalid: 'Неверный ввод'
			}
		}

		// Добавляем переводы в правильное место в JSON
		const enPath = path.join(process.cwd(), 'messages', 'en.json')
		const ruPath = path.join(process.cwd(), 'messages', 'ru.json')

		addTranslationToJson(enPath, translationKey, enTranslations)
		addTranslationToJson(ruPath, translationKey, ruTranslations)
		console.log('✅ Добавлены переводы в widgets секцию')

		// 5. Генерируем типы
		console.log('\\n🔄 Генерируем TypeScript типы...')
		const { execSync } = require('child_process')
		try {
			execSync('npm run generate:types', { stdio: 'inherit' })
			console.log('✅ Типы сгенерированы')
		} catch (error) {
			console.log(
				'⚠️  Не удалось автоматически сгенерировать типы. Выполните: npm run generate:types'
			)
		}

		console.log('\\n🎉 Виджет успешно создан!')
		console.log('\\n📝 Что дальше:')
		console.log(`   1. Откройте файл: ${widgetPath}`)
		console.log(`   2. Реализуйте логику виджета`)
		console.log(`   3. Переведите строки в messages/ru.json`)
		console.log(
			`   4. Проверьте виджет: http://localhost:3000/en/tools/${widgetId}`
		)
		console.log(`   5. Запустите тесты: npm run typecheck`)
	} catch (error) {
		console.error('❌ Ошибка при создании виджета:', error.message)
	} finally {
		rl.close()
	}
}

// Запускаем создание виджета
createWidget().catch(console.error)
