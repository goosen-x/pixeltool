#!/usr/bin/env node

/**
 * Тестовый файл для проверки работы приложения
 * Запуск: node test-app.js
 */

const http = require('http')
const https = require('https')

const colors = {
	reset: '\x1b[0m',
	green: '\x1b[32m',
	red: '\x1b[31m',
	yellow: '\x1b[33m',
	blue: '\x1b[34m',
	gray: '\x1b[90m'
}

const log = {
	success: msg => console.log(`${colors.green}✓${colors.reset} ${msg}`),
	error: msg => console.log(`${colors.red}✗${colors.reset} ${msg}`),
	info: msg => console.log(`${colors.blue}ℹ${colors.reset} ${msg}`),
	warning: msg => console.log(`${colors.yellow}⚠${colors.reset} ${msg}`)
}

// Конфигурация
const APP_URL = process.env.APP_URL || 'http://localhost:3000'
const API_BASE = `${APP_URL}/api`

// Тестовые маршруты
const routes = [
	{ path: '/en', name: 'English Homepage' },
	{ path: '/ru', name: 'Russian Homepage' },
	{ path: '/en/blog', name: 'English Blog' },
	{ path: '/ru/blog', name: 'Russian Blog' },
	{ path: '/api/blog?locale=en', name: 'Blog API (EN)' },
	{ path: '/api/blog?locale=ru', name: 'Blog API (RU)' },
	{ path: '/api/authors', name: 'Authors API' },
	{ path: '/api/test-env', name: 'Environment Test API' }
]

// Функция для проверки маршрута
async function checkRoute(route) {
	return new Promise(resolve => {
		const url = route.path.startsWith('/api')
			? `${API_BASE}${route.path.replace('/api', '')}`
			: `${APP_URL}${route.path}`

		const protocol = url.startsWith('https') ? https : http

		const startTime = Date.now()

		protocol
			.get(url, res => {
				const responseTime = Date.now() - startTime

				if (res.statusCode === 200) {
					log.success(
						`${route.name} - ${colors.gray}${responseTime}ms${colors.reset}`
					)

					// Для API маршрутов проверяем JSON
					if (route.path.includes('/api')) {
						let data = ''
						res.on('data', chunk => (data += chunk))
						res.on('end', () => {
							try {
								const json = JSON.parse(data)
								if (route.path.includes('/blog')) {
									log.info(`  └─ Posts found: ${json.data?.length || 0}`)
								}
							} catch (e) {
								log.error(`  └─ Invalid JSON response`)
							}
						})
					}
				} else {
					log.error(`${route.name} - Status: ${res.statusCode}`)
				}
				resolve()
			})
			.on('error', err => {
				log.error(`${route.name} - ${err.message}`)
				resolve()
			})
	})
}

// Основная функция
async function runTests() {
	console.log(`\n🧪 Testing Portfolio Application`)
	console.log(`${colors.gray}─────────────────────────────────${colors.reset}`)
	log.info(`App URL: ${APP_URL}`)
	console.log('')

	// Проверяем, запущен ли сервер
	await new Promise(resolve => {
		const protocol = APP_URL.startsWith('https') ? https : http
		protocol
			.get(APP_URL, res => {
				log.success('Server is running')
				resolve()
			})
			.on('error', () => {
				log.error('Server is not running!')
				log.warning('Please start the server with: npm run dev')
				process.exit(1)
			})
	})

	console.log(`\n📍 Checking Routes:`)
	console.log(`${colors.gray}─────────────────────────────────${colors.reset}`)

	// Проверяем все маршруты
	for (const route of routes) {
		await checkRoute(route)
	}

	// Дополнительные проверки
	console.log(`\n🔍 Additional Checks:`)
	console.log(`${colors.gray}─────────────────────────────────${colors.reset}`)

	// Проверка переменных окружения через API
	await new Promise(resolve => {
		http.get(`${API_BASE}/test-env`, res => {
			let data = ''
			res.on('data', chunk => (data += chunk))
			res.on('end', () => {
				try {
					const json = JSON.parse(data)
					const env = json.env

					if (env.DATABASE_URL === 'Set') {
						log.success('Database environment configured')
					} else {
						log.warning('Database environment not configured')
					}

					if (env.NEXT_PUBLIC_APP_URL) {
						log.success(`App URL: ${env.NEXT_PUBLIC_APP_URL}`)
					}
				} catch (e) {
					log.error('Failed to check environment')
				}
				resolve()
			})
		})
	})

	console.log(`\n✨ Test completed!`)
}

// Запуск тестов
runTests().catch(err => {
	log.error(`Test failed: ${err.message}`)
	process.exit(1)
})
