'use client'

import { useState, useEffect } from 'react'
import {
	Database,
	Copy,
	Check,
	RefreshCw,
	Download,
	Loader2,
	ExternalLink
} from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue
} from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'

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
		name: 'Users List',
		description: 'Get a list of fake users with complete profiles',
		endpoint: 'https://jsonplaceholder.typicode.com/users',
		category: 'users',
		method: 'GET',
		requiresAuth: false,
		rateLimit: 'Unlimited',
		documentation: 'https://jsonplaceholder.typicode.com/'
	},
	{
		id: 'randomuser',
		name: 'Random User',
		description: 'Generate random user data with photos',
		endpoint: 'https://randomuser.me/api/?results=5',
		category: 'users',
		method: 'GET',
		requiresAuth: false,
		rateLimit: 'Unlimited',
		documentation: 'https://randomuser.me/'
	},
	{
		id: 'reqres-users',
		name: 'ReqRes Users',
		description: 'Users with avatars for testing',
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
		name: 'Blog Posts',
		description: 'Sample blog posts with comments',
		endpoint: 'https://jsonplaceholder.typicode.com/posts',
		category: 'content',
		method: 'GET',
		requiresAuth: false,
		rateLimit: 'Unlimited',
		documentation: 'https://jsonplaceholder.typicode.com/'
	},
	{
		id: 'quotable',
		name: 'Random Quotes',
		description: 'Inspirational quotes with authors',
		endpoint: 'https://api.quotable.io/quotes/random?limit=5',
		category: 'content',
		method: 'GET',
		requiresAuth: false,
		rateLimit: '180 requests per minute',
		documentation: 'https://github.com/lukePeavey/quotable'
	},
	{
		id: 'lorem-picsum',
		name: 'Lorem Picsum Images',
		description: 'Random placeholder images',
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
		name: 'Fake Store Products',
		description: 'E-commerce products with prices and images',
		endpoint: 'https://fakestoreapi.com/products?limit=5',
		category: 'products',
		method: 'GET',
		requiresAuth: false,
		rateLimit: 'Unlimited',
		documentation: 'https://fakestoreapi.com/docs'
	},
	{
		id: 'dummyjson-products',
		name: 'DummyJSON Products',
		description: 'Detailed product data with categories',
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
		name: 'Countries Data',
		description: 'Detailed information about countries',
		endpoint: 'https://restcountries.com/v3.1/all',
		category: 'geographic',
		method: 'GET',
		requiresAuth: false,
		rateLimit: 'Unlimited',
		documentation: 'https://restcountries.com/'
	},
	{
		id: 'openweather',
		name: 'Weather Data',
		description: 'Current weather for London (demo)',
		endpoint:
			'https://api.openweathermap.org/data/2.5/weather?q=London&appid=demo',
		category: 'geographic',
		method: 'GET',
		requiresAuth: false,
		rateLimit: 'Limited demo key',
		documentation: 'https://openweathermap.org/api'
	},

	// Entertainment
	{
		id: 'pokemon',
		name: 'Pokemon List',
		description: 'List of Pokemon with details',
		endpoint: 'https://pokeapi.co/api/v2/pokemon?limit=10',
		category: 'entertainment',
		method: 'GET',
		requiresAuth: false,
		rateLimit: '100 requests per IP per minute',
		documentation: 'https://pokeapi.co/'
	},
	{
		id: 'rickandmorty',
		name: 'Rick and Morty Characters',
		description: 'Characters from Rick and Morty series',
		endpoint: 'https://rickandmortyapi.com/api/character',
		category: 'entertainment',
		method: 'GET',
		requiresAuth: false,
		rateLimit: 'Unlimited',
		documentation: 'https://rickandmortyapi.com/documentation'
	},
	{
		id: 'chucknorris',
		name: 'Chuck Norris Jokes',
		description: 'Random Chuck Norris jokes',
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
		name: 'Todo Items',
		description: 'Sample todo list items',
		endpoint: 'https://jsonplaceholder.typicode.com/todos?_limit=10',
		category: 'utilities',
		method: 'GET',
		requiresAuth: false,
		rateLimit: 'Unlimited',
		documentation: 'https://jsonplaceholder.typicode.com/'
	},
	{
		id: 'httpbin',
		name: 'HTTP Testing',
		description: 'Test HTTP requests and responses',
		endpoint: 'https://httpbin.org/get',
		category: 'utilities',
		method: 'GET',
		requiresAuth: false,
		rateLimit: 'Unlimited',
		documentation: 'https://httpbin.org/'
	}
]

const categories = {
	users: { name: 'Users & Profiles', icon: '👤' },
	content: { name: 'Posts & Content', icon: '📝' },
	products: { name: 'Products & E-commerce', icon: '🛍️' },
	geographic: { name: 'Geographic Data', icon: '🌍' },
	entertainment: { name: 'Entertainment', icon: '🎮' },
	utilities: { name: 'Utilities', icon: '🔧' }
}

export default function MockDataGeneratorPage() {
	const [mounted, setMounted] = useState(false)
	const [selectedAPI, setSelectedAPI] = useState<string>('')
	const [loading, setLoading] = useState(false)
	const [data, setData] = useState<any>(null)
	const [error, setError] = useState<string | null>(null)
	const [copiedData, setCopiedData] = useState(false)
	const [activeCategory, setActiveCategory] = useState('users')

	useEffect(() => {
		setMounted(true)
	}, [])

	const fetchData = async (apiId?: string) => {
		const targetApiId = apiId || selectedAPI
		if (!targetApiId) {
			setError('Please select an API endpoint')
			return
		}

		const api = publicAPIs.find(a => a.id === targetApiId)
		if (!api) return

		setLoading(true)
		setError(null)

		try {
			const response = await fetch(api.endpoint)
			if (!response.ok) {
				throw new Error(`HTTP error! status: ${response.status}`)
			}
			const jsonData = await response.json()
			setData(jsonData)
		} catch (err) {
			setError(err instanceof Error ? err.message : 'Failed to fetch data')
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
			toast.success('Data copied to clipboard')
			setTimeout(() => setCopiedData(false), 2000)
		} catch (err) {
			toast.error('Failed to copy data')
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
		toast.success('Data downloaded')
	}

	const getAPIsByCategory = (category: string) => {
		return publicAPIs.filter(api => api.category === category)
	}

	if (!mounted) {
		return (
			<div className='max-w-6xl mx-auto space-y-8'>
				<div>
					<h1 className='text-3xl font-bold tracking-tight mb-2'>
						Mock Data Generator
					</h1>
					<p className='text-muted-foreground'>
						Fetch sample data from popular free public APIs
					</p>
				</div>
				<div className='animate-pulse space-y-8'>
					<div className='h-96 bg-muted rounded-lg'></div>
				</div>
			</div>
		)
	}

	return (
		<div className='max-w-6xl mx-auto space-y-8'>
			{/* API Selection */}
			<div className='grid lg:grid-cols-3 gap-6'>
				<div className='lg:col-span-1'>
					<Card className='p-4 sticky top-4'>
						<h3 className='font-semibold mb-4'>Select API Endpoint</h3>

						<Tabs value={activeCategory} onValueChange={setActiveCategory}>
							<TabsList className='grid grid-cols-2 gap-1 h-auto mb-4'>
								{Object.entries(categories)
									.slice(0, 4)
									.map(([key, cat]) => (
										<TabsTrigger key={key} value={key} className='text-xs'>
											<span className='mr-1'>{cat.icon}</span>
											<span className='hidden sm:inline'>
												{cat.name.split(' ')[0]}
											</span>
										</TabsTrigger>
									))}
							</TabsList>

							<TabsList className='grid grid-cols-2 gap-1 h-auto mb-4'>
								{Object.entries(categories)
									.slice(4)
									.map(([key, cat]) => (
										<TabsTrigger key={key} value={key} className='text-xs'>
											<span className='mr-1'>{cat.icon}</span>
											{cat.name.split(' ')[0]}
										</TabsTrigger>
									))}
							</TabsList>

							{Object.keys(categories).map(category => (
								<TabsContent key={category} value={category} className='mt-0'>
									<div className='space-y-2'>
										{getAPIsByCategory(category).map(api => (
											<button
												key={api.id}
												onClick={() => {
													setSelectedAPI(api.id)
													fetchData(api.id)
												}}
												className={cn(
													'w-full text-left p-3 rounded-lg border transition-all',
													'hover:bg-accent hover:border-accent-foreground/20',
													selectedAPI === api.id
														? 'bg-accent border-accent-foreground/20'
														: 'bg-card border-border'
												)}
											>
												<div className='font-medium text-sm'>{api.name}</div>
												<div className='text-xs text-muted-foreground mt-1'>
													{api.description}
												</div>
												<div className='flex items-center gap-2 mt-2'>
													<Badge variant='secondary' className='text-xs'>
														{api.method}
													</Badge>
													{api.rateLimit && (
														<Badge variant='outline' className='text-xs'>
															{api.rateLimit}
														</Badge>
													)}
												</div>
											</button>
										))}
									</div>
								</TabsContent>
							))}
						</Tabs>
					</Card>
				</div>

				{/* Data Display */}
				<div className='lg:col-span-2'>
					<Card className='p-6'>
						<div className='flex items-center justify-between mb-4'>
							<h3 className='font-semibold'>Response Data</h3>
							{data && (
								<div className='flex items-center gap-2'>
									<Button
										variant='outline'
										size='sm'
										onClick={() => fetchData()}
										disabled={loading || !selectedAPI}
									>
										<RefreshCw
											className={cn('w-4 h-4 mr-1', loading && 'animate-spin')}
										/>
										Refresh
									</Button>
									<Button variant='outline' size='sm' onClick={copyToClipboard}>
										{copiedData ? (
											<>
												<Check className='w-4 h-4 mr-1' />
												Copied
											</>
										) : (
											<>
												<Copy className='w-4 h-4 mr-1' />
												Copy
											</>
										)}
									</Button>
									<Button variant='outline' size='sm' onClick={downloadJSON}>
										<Download className='w-4 h-4 mr-1' />
										Download
									</Button>
								</div>
							)}
						</div>

						{loading && (
							<div className='flex items-center justify-center py-12'>
								<Loader2 className='w-8 h-8 animate-spin text-muted-foreground' />
							</div>
						)}

						{error && (
							<Alert variant='destructive'>
								<AlertDescription>{error}</AlertDescription>
							</Alert>
						)}

						{data && !loading && (
							<div className='relative'>
								<pre className='bg-muted rounded-lg p-4 overflow-x-auto max-h-[600px] overflow-y-auto text-sm'>
									<code>{JSON.stringify(data, null, 2)}</code>
								</pre>
							</div>
						)}

						{!data && !loading && !error && (
							<div className='text-center py-12 text-muted-foreground'>
								<Database className='w-12 h-12 mx-auto mb-4 opacity-50' />
								<p>Select an API endpoint to fetch data</p>
							</div>
						)}

						{selectedAPI && (
							<div className='mt-4 pt-4 border-t'>
								<div className='flex items-center justify-between text-sm'>
									<div className='text-muted-foreground'>
										Endpoint:{' '}
										<code className='bg-muted px-2 py-0.5 rounded'>
											{publicAPIs.find(a => a.id === selectedAPI)?.endpoint}
										</code>
									</div>
									{publicAPIs.find(a => a.id === selectedAPI)
										?.documentation && (
										<a
											href={
												publicAPIs.find(a => a.id === selectedAPI)
													?.documentation
											}
											target='_blank'
											rel='noopener noreferrer'
											className='flex items-center gap-1 text-primary hover:underline'
										>
											<ExternalLink className='w-3 h-3' />
											Docs
										</a>
									)}
								</div>
							</div>
						)}
					</Card>
				</div>
			</div>

			{/* Info Section */}
			<Card className='p-6 bg-muted/50'>
				<h3 className='font-semibold mb-3'>About These APIs</h3>
				<div className='grid md:grid-cols-2 gap-4 text-sm text-muted-foreground'>
					<div>
						<h4 className='font-medium text-foreground mb-2'>Free & Open</h4>
						<p>
							All APIs listed here are free to use and don&apos;t require
							authentication keys for basic requests.
						</p>
					</div>
					<div>
						<h4 className='font-medium text-foreground mb-2'>CORS Enabled</h4>
						<p>
							These APIs support CORS, allowing you to fetch data directly from
							browser applications.
						</p>
					</div>
					<div>
						<h4 className='font-medium text-foreground mb-2'>Rate Limits</h4>
						<p>
							Some APIs have rate limits. Check the documentation for specific
							limitations.
						</p>
					</div>
					<div>
						<h4 className='font-medium text-foreground mb-2'>
							Perfect for Testing
						</h4>
						<p>
							Use this data for prototyping, testing, or learning without
							setting up your own backend.
						</p>
					</div>
				</div>
			</Card>
		</div>
	)
}
