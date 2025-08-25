#!/usr/bin/env tsx

import fs from 'fs'
import path from 'path'
import { execSync } from 'child_process'

const messagesDir = path.join(process.cwd(), 'messages')
const files = ['en.json', 'ru.json']

console.log('🔍 Watching translation files for changes...')

// Функция для перезагенерации типов
function regenerateTypes() {
	try {
		console.log('🔨 Regenerating translation types...')
		execSync('yarn generate:types', { stdio: 'inherit' })
		console.log('✅ Types regenerated successfully')
	} catch (error) {
		console.error('❌ Error regenerating types:', error)
	}
}

// Функция для очистки кеша Next.js
function clearNextCache() {
	try {
		console.log('🧹 Clearing Next.js cache...')
		execSync('rm -rf .next', { stdio: 'inherit' })
		console.log('✅ Cache cleared successfully')
	} catch (error) {
		console.error('❌ Error clearing cache:', error)
	}
}

// Отслеживаем изменения в файлах переводов
files.forEach(file => {
	const filePath = path.join(messagesDir, file)

	if (fs.existsSync(filePath)) {
		console.log(`👀 Watching ${file}...`)

		fs.watchFile(filePath, (curr, prev) => {
			if (curr.mtime !== prev.mtime) {
				console.log(`📝 ${file} changed, updating...`)

				// Проверяем валидность JSON
				try {
					const content = fs.readFileSync(filePath, 'utf-8')
					JSON.parse(content)
					console.log(`✅ ${file} is valid JSON`)

					// Регенерируем типы и очищаем кеш
					regenerateTypes()
					clearNextCache()
				} catch (error) {
					console.error(`❌ Invalid JSON in ${file}:`, error)
				}
			}
		})
	}
})

// Обрабатываем сигнал завершения
process.on('SIGINT', () => {
	console.log('\n👋 Stopping translation watcher...')
	process.exit()
})
