#!/usr/bin/env node

/**
 * Claude Widget Creator Hook
 *
 * Этот скрипт предназначен для использования Claude Code для автоматического
 * создания виджетов без ручного ввода. Claude может вызывать этот скрипт
 * с параметрами командной строки.
 *
 * Использование:
 * node scripts/claude-create-widget.js --name "Widget Name" --description "Description" --category webdev --icon Globe --tags "tag1,tag2"
 */

const fs = require('fs')
const path = require('path')
const { execSync } = require('child_process')

// Доступные опции
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

// Утилиты для преобразования строк
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

// Функция для безопасного добавления переводов в JSON
function addTranslationToJson(filePath, translationKey, translations) {
	try {
		const content = fs.readFileSync(filePath, 'utf8')
		const json = JSON.parse(content)

		// Убеждаемся, что секция widgets существует
		if (!json.widgets) {
			json.widgets = {}
		}

		// Проверяем, что ключ не существует
		if (json.widgets[translationKey]) {
			console.log(
				`⚠️  Translation key "${translationKey}" already exists in ${filePath}`
			)
			return false
		}

		// Добавляем перевод в секцию widgets
		json.widgets[translationKey] = translations

		// Записываем обратно с правильным форматированием (табы как в оригинале)
		fs.writeFileSync(filePath, JSON.stringify(json, null, '\t') + '\n')
		return true
	} catch (error) {
		console.error(`❌ Error adding translation to ${filePath}:`, error.message)
		return false
	}
}

// Функция для добавления виджета в widgets.ts
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
		const insertion = needsComma
			? ',' + widgetEntry + '\\n'
			: widgetEntry + '\\n'
		content =
			content.slice(0, arrayEndIndex) + insertion + content.slice(arrayEndIndex)

		fs.writeFileSync(widgetsPath, content)
		return true
	} catch (error) {
		console.error('❌ Error adding widget to widgets.ts:', error.message)
		return false
	}
}

// Функция для создания файла виджета
function createWidgetFile(
	widgetId,
	translationKey,
	pascalName,
	iconName,
	gradient
) {
	try {
		const widgetDir = path.join(
			process.cwd(),
			'app',
			'[locale]',
			'(tools)',
			'tools',
			widgetId
		)
		const widgetPath = path.join(widgetDir, 'page.tsx')

		// Проверяем, что виджет не существует
		if (fs.existsSync(widgetPath)) {
			console.log(`⚠️  Widget file already exists: ${widgetPath}`)
			return false
		}

		// Создаём директорию
		if (!fs.existsSync(widgetDir)) {
			fs.mkdirSync(widgetDir, { recursive: true })
		}

		// Читаем шаблон
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

		fs.writeFileSync(widgetPath, template)
		return widgetPath
	} catch (error) {
		console.error('❌ Error creating widget file:', error.message)
		return false
	}
}

// Главная функция создания виджета
async function createWidget(options) {
	const { name, description, category, icon, tags } = options

	console.log('🤖 Claude Widget Creator')
	console.log('========================\n')

	// Валидация входных данных
	if (!name || !description || !category || !icon) {
		console.error(
			'❌ Обязательные параметры: --name, --description, --category, --icon'
		)
		process.exit(1)
	}

	if (!CATEGORIES.includes(category)) {
		console.error(`❌ Недопустимая категория: ${category}`)
		console.error(`Доступные: ${CATEGORIES.join(', ')}`)
		process.exit(1)
	}

	if (!AVAILABLE_ICONS.includes(icon)) {
		console.error(`❌ Недопустимая иконка: ${icon}`)
		console.error(
			`Доступные иконки: ${AVAILABLE_ICONS.slice(0, 10).join(', ')}...`
		)
		process.exit(1)
	}

	// Генерируем параметры
	const widgetId = toKebabCase(name)
	const translationKey = toCamelCase(name)
	const pascalName = toPascalCase(name)
	const gradient = GRADIENTS[Math.floor(Math.random() * GRADIENTS.length)]
	const tagsArray = tags
		? tags
				.split(',')
				.map(tag => tag.trim())
				.filter(Boolean)
		: []

	console.log(`📋 Создаём виджет:`)
	console.log(`   Название: ${name}`)
	console.log(`   ID: ${widgetId}`)
	console.log(`   Translation Key: ${translationKey}`)
	console.log(`   Категория: ${category}`)
	console.log(`   Иконка: ${icon}`)
	console.log(`   Теги: ${tagsArray.join(', ') || 'нет'}`)
	console.log()

	let success = true

	// 1. Создаём файл виджета
	console.log('🔨 Создаём файл виджета...')
	const widgetPath = createWidgetFile(
		widgetId,
		translationKey,
		pascalName,
		icon,
		gradient
	)
	if (widgetPath) {
		console.log(`✅ Создан: ${widgetPath}`)
	} else {
		success = false
	}

	// 2. Добавляем в widgets.ts
	console.log('🔨 Добавляем в widgets.ts...')
	if (
		addToWidgetsConfig(
			widgetId,
			translationKey,
			icon,
			category,
			tagsArray,
			gradient
		)
	) {
		console.log('✅ Добавлен в widgets.ts')
	} else {
		success = false
	}

	// 3. Создаём переводы
	console.log('🔨 Создаём переводы...')
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

	const enPath = path.join(process.cwd(), 'messages', 'en.json')
	const ruPath = path.join(process.cwd(), 'messages', 'ru.json')

	if (addTranslationToJson(enPath, translationKey, enTranslations)) {
		console.log('✅ EN переводы добавлены в widgets секцию')
	} else {
		success = false
	}

	if (addTranslationToJson(ruPath, translationKey, ruTranslations)) {
		console.log('✅ RU переводы добавлены в widgets секцию')
	} else {
		success = false
	}

	// 4. Генерируем типы
	console.log('🔨 Генерируем TypeScript типы...')
	try {
		execSync('npm run generate:types', { stdio: 'pipe' })
		console.log('✅ Типы сгенерированы')
	} catch (error) {
		console.log(
			'⚠️  Ошибка генерации типов. Выполните вручную: npm run generate:types'
		)
		success = false
	}

	// 5. Проверяем TypeScript
	console.log('🔨 Проверяем TypeScript...')
	try {
		execSync('npm run typecheck', { stdio: 'pipe' })
		console.log('✅ TypeScript проверка пройдена')
	} catch (error) {
		console.log('⚠️  TypeScript ошибки. Проверьте: npm run typecheck')
		success = false
	}

	// Итоги
	console.log()
	if (success) {
		console.log('🎉 Виджет успешно создан!')
		console.log(
			`📝 Файл виджета: app/[locale]/(tools)/tools/${widgetId}/page.tsx`
		)
		console.log(`🌐 URL: http://localhost:3000/en/tools/${widgetId}`)
		console.log(`📚 Не забудьте перевести строки в messages/ru.json`)
	} else {
		console.log('⚠️  Виджет создан с предупреждениями. Проверьте логи выше.')
	}
}

// Парсинг аргументов командной строки
function parseArgs() {
	const args = {}

	for (let i = 2; i < process.argv.length; i += 2) {
		const key = process.argv[i]?.replace('--', '')
		const value = process.argv[i + 1]

		if (key && value) {
			args[key] = value
		}
	}

	return args
}

// Запуск
if (require.main === module) {
	const args = parseArgs()

	if (!args.name) {
		console.log('🤖 Claude Widget Creator')
		console.log('========================\n')
		console.log('Использование:')
		console.log('  node scripts/claude-create-widget.js \\\\')
		console.log('    --name "Widget Name" \\\\')
		console.log('    --description "Widget description" \\\\')
		console.log('    --category webdev \\\\')
		console.log('    --icon Globe \\\\')
		console.log('    --tags "tag1,tag2,tag3"\n')
		console.log(`Доступные категории: ${CATEGORIES.join(', ')}`)
		console.log(
			`Доступные иконки: ${AVAILABLE_ICONS.slice(0, 10).join(', ')}...`
		)
		process.exit(1)
	}

	createWidget(args).catch(console.error)
}

module.exports = { createWidget, AVAILABLE_ICONS, CATEGORIES }
