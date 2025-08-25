#!/usr/bin/env tsx

import { execSync, spawn } from 'child_process'
import fs from 'fs'

console.log('🚀 Starting development server without cache...')

// 1. Очистка всех кешей
console.log('🧹 Clearing all caches...')
try {
	execSync('rm -rf .next', { stdio: 'inherit' })
	execSync('rm -rf node_modules/.cache', { stdio: 'inherit' })
	console.log('✅ Caches cleared')
} catch (error) {
	console.log('⚠️  Some caches could not be cleared (this is usually fine)')
}

// 2. Регенерация типов
console.log('🔨 Regenerating translation types...')
try {
	execSync('yarn generate:types', { stdio: 'inherit' })
	console.log('✅ Types regenerated')
} catch (error) {
	console.error('❌ Error regenerating types:', error)
}

// 3. Запуск dev сервера
console.log('🔥 Starting Next.js dev server...')

const env = {
	...process.env,
	NODE_ENV: 'development' as const,
	NEXT_DISABLE_SWC_CACHE: '1',
	// Отключаем все возможные виды кеширования
	NEXT_PRIVATE_DEBUG_CACHE: 'false'
}

const child = spawn('next', ['dev'], {
	stdio: 'inherit',
	env
})

// Обработка сигналов завершения
process.on('SIGINT', () => {
	console.log('\n👋 Shutting down development server...')
	child.kill('SIGINT')
	process.exit()
})

process.on('SIGTERM', () => {
	child.kill('SIGTERM')
	process.exit()
})

child.on('exit', code => {
	process.exit(code || 0)
})
