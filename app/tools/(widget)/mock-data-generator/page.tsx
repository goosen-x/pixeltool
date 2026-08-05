'use client'

import { useState, useEffect } from 'react'
import { Copy, Check, RefreshCw, Download } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import {
	toolBar,
	toolFooterBar,
	toolIconButton,
	toolPill
} from '@/lib/ui/tool-pill'

interface APIEndpoint {
	id: string
	name: string
	description: string
	endpoint: string
	category: string
	method: 'GET' | 'POST'
	requiresAuth: boolean
	rateLimit?: string
	exampleResponse?: any
	documentation?: string
}

const publicAPIs: APIEndpoint[] = [
	// Users & Profiles
	{
		id: 'jsonplaceholder-users',
		name: 'Список пользователей',
		description: 'Список тестовых пользователей с полными профилями',
		endpoint: 'https://jsonplaceholder.typicode.com/users',
		category: 'users',
		method: 'GET',
		requiresAuth: false,
		rateLimit: 'Unlimited',
		documentation: 'https://jsonplaceholder.typicode.com/'
	},
	{
		id: 'randomuser',
		name: 'Случайный пользователь',
		description: 'Случайные данные пользователей с фотографиями',
		endpoint: 'https://randomuser.me/api/?results=5',
		category: 'users',
		method: 'GET',
		requiresAuth: false,
		rateLimit: 'Unlimited',
		documentation: 'https://randomuser.me/'
	},
	{
		id: 'reqres-users',
		name: 'Пользователи ReqRes',
		description: 'Пользователи с аватарами для тестирования',
		endpoint: 'https://reqres.in/api/users?page=1',
		category: 'users',
		method: 'GET',
		requiresAuth: false,
		rateLimit: 'Unlimited',
		documentation: 'https://reqres.in/'
	},

	// Posts & Content
	{
		id: 'jsonplaceholder-posts',
		name: 'Записи блога',
		description: 'Примеры записей блога с комментариями',
		endpoint: 'https://jsonplaceholder.typicode.com/posts',
		category: 'content',
		method: 'GET',
		requiresAuth: false,
		rateLimit: 'Unlimited',
		documentation: 'https://jsonplaceholder.typicode.com/'
	},
	{
		id: 'quotable',
		name: 'Случайные цитаты',
		description: 'Вдохновляющие цитаты с авторами',
		endpoint: 'https://api.quotable.io/quotes/random?limit=5',
		category: 'content',
		method: 'GET',
		requiresAuth: false,
		rateLimit: '180 запросов в минуту',
		documentation: 'https://github.com/lukePeavey/quotable'
	},
	{
		id: 'lorem-picsum',
		name: 'Изображения Lorem Picsum',
		description: 'Случайные изображения-заглушки',
		endpoint: 'https://picsum.photos/v2/list?page=1&limit=10',
		category: 'content',
		method: 'GET',
		requiresAuth: false,
		rateLimit: 'Unlimited',
		documentation: 'https://picsum.photos/'
	},

	// Products & E-commerce
	{
		id: 'fakestoreapi',
		name: 'Товары Fake Store',
		description: 'Товары интернет-магазина с ценами и изображениями',
		endpoint: 'https://fakestoreapi.com/products?limit=5',
		category: 'products',
		method: 'GET',
		requiresAuth: false,
		rateLimit: 'Unlimited',
		documentation: 'https://fakestoreapi.com/docs'
	},
	{
		id: 'dummyjson-products',
		name: 'Товары DummyJSON',
		description: 'Подробные данные о товарах с категориями',
		endpoint: 'https://dummyjson.com/products?limit=5',
		category: 'products',
		method: 'GET',
		requiresAuth: false,
		rateLimit: 'Unlimited',
		documentation: 'https://dummyjson.com/docs/products'
	},

	// Geographic Data
	{
		id: 'restcountries',
		name: 'Данные о странах',
		description: 'Подробная информация о странах',
		endpoint: 'https://restcountries.com/v3.1/all',
		category: 'geographic',
		method: 'GET',
		requiresAuth: false,
		rateLimit: 'Unlimited',
		documentation: 'https://restcountries.com/'
	},
	{
		id: 'openweather',
		name: 'Данные о погоде',
		description: 'Текущая погода в Лондоне (демо)',
		endpoint:
			'https://api.openweathermap.org/data/2.5/weather?q=London&appid=demo',
		category: 'geographic',
		method: 'GET',
		requiresAuth: false,
		rateLimit: 'Ограниченный демо-ключ',
		documentation: 'https://openweathermap.org/api'
	},

	// Entertainment
	{
		id: 'pokemon',
		name: 'Список покемонов',
		description: 'Список покемонов с подробностями',
		endpoint: 'https://pokeapi.co/api/v2/pokemon?limit=10',
		category: 'entertainment',
		method: 'GET',
		requiresAuth: false,
		rateLimit: '100 запросов с IP в минуту',
		documentation: 'https://pokeapi.co/'
	},
	{
		id: 'rickandmorty',
		name: 'Персонажи «Рика и Морти»',
		description: 'Персонажи из сериала «Рик и Морти»',
		endpoint: 'https://rickandmortyapi.com/api/character',
		category: 'entertainment',
		method: 'GET',
		requiresAuth: false,
		rateLimit: 'Unlimited',
		documentation: 'https://rickandmortyapi.com/documentation'
	},
	{
		id: 'chucknorris',
		name: 'Шутки о Чаке Норрисе',
		description: 'Случайные шутки о Чаке Норрисе',
		endpoint: 'https://api.chucknorris.io/jokes/random',
		category: 'entertainment',
		method: 'GET',
		requiresAuth: false,
		rateLimit: 'Unlimited',
		documentation: 'https://api.chucknorris.io/'
	},

	// Utilities
	{
		id: 'jsonplaceholder-todos',
		name: 'Задачи',
		description: 'Примеры пунктов списка задач',
		endpoint: 'https://jsonplaceholder.typicode.com/todos?_limit=10',
		category: 'utilities',
		method: 'GET',
		requiresAuth: false,
		rateLimit: 'Unlimited',
		documentation: 'https://jsonplaceholder.typicode.com/'
	},
	{
		id: 'httpbin',
		name: 'Тестирование HTTP',
		description: 'Проверка HTTP-запросов и ответов',
		endpoint: 'https://httpbin.org/get',
		category: 'utilities',
		method: 'GET',
		requiresAuth: false,
		rateLimit: 'Unlimited',
		documentation: 'https://httpbin.org/'
	},
	{
		id: 'dog-facts',
		name: 'Факты о собаках',
		description: 'Случайные факты о собаках',
		endpoint: 'https://dog-api.kinduff.com/api/facts?number=5',
		category: 'entertainment',
		method: 'GET',
		requiresAuth: false,
		rateLimit: 'Unlimited',
		documentation: 'https://kinduff.github.io/dog-api/'
	},
	{
		id: 'cat-facts',
		name: 'Факты о кошках',
		description: 'Случайные факты о кошках',
		endpoint: 'https://catfact.ninja/facts?limit=5',
		category: 'entertainment',
		method: 'GET',
		requiresAuth: false,
		rateLimit: 'Unlimited',
		documentation: 'https://catfact.ninja/'
	},
	{
		id: 'advice-slip',
		name: 'Совет дня',
		description: 'Генератор случайных советов',
		endpoint: 'https://api.adviceslip.com/advice',
		category: 'content',
		method: 'GET',
		requiresAuth: false,
		rateLimit: 'Unlimited',
		documentation: 'https://api.adviceslip.com/'
	},
	{
		id: 'bored-api',
		name: 'Чем заняться',
		description: 'Идея, чем заняться от скуки',
		endpoint: 'https://www.boredapi.com/api/activity',
		category: 'entertainment',
		method: 'GET',
		requiresAuth: false,
		rateLimit: 'Unlimited',
		documentation: 'https://www.boredapi.com/documentation'
	}
]

const categories = {
	users: { name: 'Пользователи и профили', icon: '👤' },
	content: { name: 'Записи и контент', icon: '📝' },
	products: { name: 'Товары и e-commerce', icon: '🛍️' },
	geographic: { name: 'Географические данные', icon: '🌍' },
	entertainment: { name: 'Развлечения', icon: '🎮' },
	utilities: { name: 'Утилиты', icon: '🔧' }
}

export default function MockDataGeneratorPage() {
	const [mounted, setMounted] = useState(false)
	const [selectedAPI, setSelectedAPI] = useState<string>('')
	const [loading, setLoading] = useState(false)
	const [data, setData] = useState<any>(null)
	const [error, setError] = useState<string | null>(null)
	const [copiedData, setCopiedData] = useState(false)
	const [activeCategory, setActiveCategory] = useState('users')
	const [viewMode, setViewMode] = useState<'json' | 'formatted'>('json')
	const [searchQuery, setSearchQuery] = useState('')
	const [responseTime, setResponseTime] = useState<number | null>(null)
	const [dataSize, setDataSize] = useState<string | null>(null)

	useEffect(() => {
		setMounted(true)
	}, [])

	const fetchData = async (apiId?: string) => {
		const targetApiId = apiId || selectedAPI
		if (!targetApiId) {
			setError('Выберите эндпоинт API')
			return
		}

		const api = publicAPIs.find(a => a.id === targetApiId)
		if (!api) return

		setLoading(true)
		setError(null)
		setResponseTime(null)
		setDataSize(null)

		try {
			const startTime = performance.now()
			const response = await fetch(api.endpoint)
			const endTime = performance.now()

			if (!response.ok) {
				throw new Error(`HTTP error! status: ${response.status}`)
			}

			const jsonData = await response.json()
			const responseTimeMs = Math.round(endTime - startTime)
			const dataSizeBytes = new Blob([JSON.stringify(jsonData)]).size

			setData(jsonData)
			setResponseTime(responseTimeMs)
			setDataSize(formatBytes(dataSizeBytes))
		} catch (err) {
			setError(
				err instanceof Error ? err.message : 'Не удалось загрузить данные'
			)
			setData(null)
		} finally {
			setLoading(false)
		}
	}

	const copyToClipboard = async () => {
		if (!data) return

		try {
			await navigator.clipboard.writeText(JSON.stringify(data, null, 2))
			setCopiedData(true)
			setTimeout(() => setCopiedData(false), 2000)
		} catch (err) {
			console.error('Не удалось скопировать данные:', err)
		}
	}

	const downloadJSON = () => {
		if (!data) return

		const blob = new Blob([JSON.stringify(data, null, 2)], {
			type: 'application/json'
		})
		const url = URL.createObjectURL(blob)
		const a = document.createElement('a')
		a.href = url
		a.download = `mock-data-${new Date().toISOString().split('T')[0]}.json`
		a.click()
		URL.revokeObjectURL(url)
	}

	const formatBytes = (bytes: number) => {
		if (bytes === 0) return '0 Bytes'
		const k = 1024
		const sizes = ['Bytes', 'KB', 'MB', 'GB']
		const i = Math.floor(Math.log(bytes) / Math.log(k))
		return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
	}

	const getAPIsByCategory = (category: string) => {
		return publicAPIs.filter(api => {
			const matchesCategory = api.category === category
			const matchesSearch =
				searchQuery.trim() === '' ||
				api.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
				api.description.toLowerCase().includes(searchQuery.toLowerCase())
			return matchesCategory && matchesSearch
		})
	}

	const renderFormattedData = (obj: any, depth = 0): React.ReactNode => {
		if (obj === null) return <span className='text-muted-foreground'>null</span>
		if (typeof obj !== 'object')
			return <span className='text-foreground'>{String(obj)}</span>

		if (Array.isArray(obj)) {
			return (
				<div className='space-y-2'>
					{obj.map((item, index) => (
						<div key={index} className='rounded-lg border p-3'>
							<div className='mb-1 font-mono text-xs text-muted-foreground'>
								[{index}]
							</div>
							{renderFormattedData(item, depth + 1)}
						</div>
					))}
				</div>
			)
		}

		return (
			<div className='space-y-2'>
				{Object.entries(obj).map(([key, value]) => (
					<div key={key} className='flex items-start gap-2'>
						<span className='text-sm font-medium text-muted-foreground min-w-[120px]'>
							{key}:
						</span>
						<div className='flex-1'>
							{typeof value === 'object' && value !== null ? (
								<div className='rounded-lg border p-2'>
									{renderFormattedData(value, depth + 1)}
								</div>
							) : (
								renderFormattedData(value, depth + 1)
							)}
						</div>
					</div>
				))}
			</div>
		)
	}

	if (!mounted) {
		return (
			<Card className='overflow-hidden p-0'>
				<div className='h-14 border-b bg-muted/30' />
				<div className='h-96 animate-pulse bg-muted/20' />
			</Card>
		)
	}

	const selectedApiInfo = publicAPIs.find(api => api.id === selectedAPI)

	return (
		<Card className='overflow-hidden p-0'>
			{/* Верхняя полоса: категории источников. Раньше это были два ряда
			    вкладок по четыре штуки внутри левой колонки — на телефоне от них
			    оставались одни иконки без подписей. */}
			<div className={toolBar}>
				<div className='flex flex-wrap items-center gap-1.5'>
					{Object.entries(categories).map(([key, category]) => (
						<button
							key={key}
							type='button'
							onClick={() => setActiveCategory(key)}
							aria-pressed={activeCategory === key}
							className={toolPill(
								activeCategory === key,
								'flex items-center gap-1.5'
							)}
						>
							<span aria-hidden>{category.icon}</span>
							{category.name.split(' ')[0]}
						</button>
					))}
				</div>

				<div className='flex items-center gap-0.5 sm:ml-auto'>
					<Button
						size='icon'
						variant='ghost'
						onClick={() => fetchData()}
						disabled={!selectedAPI || loading}
						title='Загрузить заново'
						className={toolIconButton}
					>
						<RefreshCw className={cn('h-4 w-4', loading && 'animate-spin')} />
					</Button>
					<Button
						size='icon'
						variant='ghost'
						onClick={copyToClipboard}
						disabled={!data}
						title='Скопировать JSON'
						className={toolIconButton}
					>
						{copiedData ? (
							<Check className='h-4 w-4 text-green-600 dark:text-green-400' />
						) : (
							<Copy className='h-4 w-4' />
						)}
					</Button>
					<Button
						size='icon'
						variant='ghost'
						onClick={downloadJSON}
						disabled={!data}
						title='Скачать JSON'
						className={toolIconButton}
					>
						<Download className='h-4 w-4' />
					</Button>
				</div>
			</div>

			<div className='grid lg:grid-cols-[minmax(0,20rem)_minmax(0,1fr)]'>
				{/* Слева — список эндпоинтов выбранной категории. */}
				<div className='border-b lg:border-r lg:border-b-0'>
					<div className='px-5 pt-4 sm:px-6'>
						<input
							value={searchQuery}
							onChange={event => setSearchQuery(event.target.value)}
							placeholder='Поиск по названию'
							spellCheck={false}
							aria-label='Поиск по API'
							className='w-full rounded-md border bg-background px-2 py-1 text-sm text-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-ring'
						/>
					</div>

					<div className='max-h-[28rem] overflow-y-auto py-2'>
						{getAPIsByCategory(activeCategory).length === 0 ? (
							<p className='px-5 py-8 text-center text-sm text-muted-foreground sm:px-6'>
								Ничего не найдено
							</p>
						) : (
							getAPIsByCategory(activeCategory).map(api => (
								<button
									key={api.id}
									type='button'
									onClick={() => {
										setSelectedAPI(api.id)
										fetchData(api.id)
									}}
									aria-pressed={selectedAPI === api.id}
									className={cn(
										'block w-full cursor-pointer px-5 py-2 text-left transition-colors hover:bg-muted/40 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset sm:px-6',
										selectedAPI === api.id && 'bg-primary/5'
									)}
								>
									<span
										className={cn(
											'block text-sm',
											selectedAPI === api.id && 'text-primary'
										)}
									>
										{api.name}
									</span>
									<span className='mt-0.5 block truncate text-xs text-muted-foreground'>
										{api.description}
									</span>
								</button>
							))
						)}
					</div>
				</div>

				{/* Справа — ответ выбранного эндпоинта. */}
				<div className='min-w-0'>
					{error ? (
						<p className='px-5 py-16 text-center text-sm text-destructive sm:px-6'>
							{error}
						</p>
					) : loading ? (
						<p className='px-5 py-16 text-center text-sm text-muted-foreground sm:px-6'>
							Загружаем…
						</p>
					) : data ? (
						<div className='max-h-[30rem] overflow-auto px-5 py-4 sm:px-6'>
							{viewMode === 'json' ? (
								<pre className='font-mono text-xs leading-relaxed whitespace-pre-wrap'>
									{JSON.stringify(data, null, 2)}
								</pre>
							) : (
								renderFormattedData(data)
							)}
						</div>
					) : (
						<p className='px-5 py-16 text-center text-sm text-muted-foreground sm:px-6'>
							Выберите эндпоинт слева — ответ появится здесь
						</p>
					)}
				</div>
			</div>

			{/* Полоса ответа: вид, адрес и что получилось по времени и весу. */}
			<div className={toolFooterBar}>
				<div className='flex flex-wrap items-center gap-1.5'>
					{(
						[
							['json', 'JSON'],
							['formatted', 'Списком']
						] as ['json' | 'formatted', string][]
					).map(([value, label]) => (
						<button
							key={value}
							type='button'
							onClick={() => setViewMode(value)}
							aria-pressed={viewMode === value}
							className={toolPill(viewMode === value)}
						>
							{label}
						</button>
					))}
				</div>

				{selectedApiInfo && (
					<span className='min-w-0 truncate font-mono text-xs text-muted-foreground'>
						{selectedApiInfo.endpoint}
					</span>
				)}

				{(responseTime !== null || dataSize) && (
					<span className='flex items-center gap-4 text-sm text-muted-foreground sm:ml-auto'>
						{responseTime !== null && (
							<span className='font-mono'>{responseTime} мс</span>
						)}
						{dataSize && <span className='font-mono'>{dataSize}</span>}
					</span>
				)}
			</div>
		</Card>
	)
}
