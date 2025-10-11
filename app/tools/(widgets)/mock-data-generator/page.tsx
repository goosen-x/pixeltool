'use client'

import { useState, useEffect } from 'react'
import {
	Database,
	Copy,
	Check,
	RefreshCw,
	Download,
	Loader2,
	ExternalLink,
	Code2,
	FileJson,
	Sparkles,
	Zap
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
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Slider } from '@/components/ui/slider'

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
	},
	{
		id: 'dog-facts',
		name: 'Dog Facts',
		description: 'Random facts about dogs',
		endpoint: 'https://dog-api.kinduff.com/api/facts?number=5',
		category: 'entertainment',
		method: 'GET',
		requiresAuth: false,
		rateLimit: 'Unlimited',
		documentation: 'https://kinduff.github.io/dog-api/'
	},
	{
		id: 'cat-facts',
		name: 'Cat Facts',
		description: 'Random facts about cats',
		endpoint: 'https://catfact.ninja/facts?limit=5',
		category: 'entertainment',
		method: 'GET',
		requiresAuth: false,
		rateLimit: 'Unlimited',
		documentation: 'https://catfact.ninja/'
	},
	{
		id: 'advice-slip',
		name: 'Advice Slip',
		description: 'Random advice generator',
		endpoint: 'https://api.adviceslip.com/advice',
		category: 'content',
		method: 'GET',
		requiresAuth: false,
		rateLimit: 'Unlimited',
		documentation: 'https://api.adviceslip.com/'
	},
	{
		id: 'bored-api',
		name: 'Bored API',
		description: 'Find something to do when bored',
		endpoint: 'https://www.boredapi.com/api/activity',
		category: 'entertainment',
		method: 'GET',
		requiresAuth: false,
		rateLimit: 'Unlimited',
		documentation: 'https://www.boredapi.com/documentation'
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
			setError('Please select an API endpoint')
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
						<Card key={index} className='p-3 bg-muted/50'>
							<div className='text-xs text-muted-foreground mb-1'>
								[{index}]
							</div>
							{renderFormattedData(item, depth + 1)}
						</Card>
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
								<Card className='p-2 bg-muted/30'>
									{renderFormattedData(value, depth + 1)}
								</Card>
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
						<div className='flex items-center justify-between mb-4'>
							<h3 className='font-semibold'>API Explorer</h3>
							<Badge variant='secondary' className='text-xs'>
								<Sparkles className='w-3 h-3 mr-1' />
								{publicAPIs.length} APIs
							</Badge>
						</div>

						{/* Search */}
						<div className='relative mb-4'>
							<Input
								placeholder='Search APIs...'
								value={searchQuery}
								onChange={e => setSearchQuery(e.target.value)}
								className='pl-8'
							/>
							<Database className='absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground' />
						</div>

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
									<ScrollArea className='h-[450px] pr-3'>
										<div className='space-y-2'>
											{getAPIsByCategory(category).length === 0 ? (
												<div className='text-center py-8 text-muted-foreground'>
													<Database className='w-8 h-8 mx-auto mb-2 opacity-50' />
													<p className='text-sm'>No APIs found</p>
												</div>
											) : (
												getAPIsByCategory(category).map(api => (
													<button
														key={api.id}
														onClick={() => {
															setSelectedAPI(api.id)
															fetchData(api.id)
														}}
														className={cn(
															'w-full text-left p-3 rounded-lg border transition-all group',
															'hover:bg-accent hover:border-accent-foreground/20',
															selectedAPI === api.id
																? 'bg-accent border-accent-foreground/20 ring-2 ring-primary/20'
																: 'bg-card border-border'
														)}
													>
														<div className='flex items-start justify-between'>
															<div className='flex-1'>
																<div className='font-medium text-sm'>
																	{api.name}
																</div>
																<div className='text-xs text-muted-foreground mt-1'>
																	{api.description}
																</div>
															</div>
															{selectedAPI === api.id && (
																<Zap className='w-4 h-4 text-primary animate-pulse' />
															)}
														</div>
														<div className='flex items-center gap-2 mt-2'>
															<Badge variant='secondary' className='text-xs'>
																{api.method}
															</Badge>
															{api.rateLimit &&
																api.rateLimit !== 'Unlimited' && (
																	<Badge variant='outline' className='text-xs'>
																		{api.rateLimit}
																	</Badge>
																)}
														</div>
													</button>
												))
											)}
										</div>
									</ScrollArea>
								</TabsContent>
							))}
						</Tabs>
					</Card>
				</div>

				{/* Data Display */}
				<div className='lg:col-span-2'>
					<Card className='p-6'>
						<div className='flex items-center justify-between mb-4'>
							<div>
								<h3 className='font-semibold'>Response Data</h3>
								{responseTime !== null && dataSize && (
									<div className='flex items-center gap-4 mt-1'>
										<Badge variant='outline' className='text-xs'>
											<Zap className='w-3 h-3 mr-1' />
											{responseTime}ms
										</Badge>
										<Badge variant='outline' className='text-xs'>
											<FileJson className='w-3 h-3 mr-1' />
											{dataSize}
										</Badge>
									</div>
								)}
							</div>
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
							<div className='space-y-4'>
								{/* View Mode Tabs */}
								<Tabs
									value={viewMode}
									onValueChange={v => setViewMode(v as 'json' | 'formatted')}
								>
									<TabsList>
										<TabsTrigger value='json'>
											<Code2 className='w-4 h-4 mr-2' />
											JSON
										</TabsTrigger>
										<TabsTrigger value='formatted'>
											<FileJson className='w-4 h-4 mr-2' />
											Formatted
										</TabsTrigger>
									</TabsList>

									<TabsContent value='json' className='mt-4'>
										<div className='relative'>
											<pre className='bg-muted rounded-lg p-4 overflow-x-auto max-h-[600px] overflow-y-auto text-sm'>
												<code>{JSON.stringify(data, null, 2)}</code>
											</pre>
										</div>
									</TabsContent>

									<TabsContent value='formatted' className='mt-4'>
										<ScrollArea className='h-[600px] rounded-lg border p-4'>
											<div className='space-y-4'>
												{renderFormattedData(data)}
											</div>
										</ScrollArea>
									</TabsContent>
								</Tabs>
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
										<code className='inline-code'>
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
			<div className='grid md:grid-cols-2 gap-6'>
				<Card className='p-6 bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20'>
					<div className='flex items-start gap-3'>
						<div className='p-2 bg-primary/10 rounded-lg'>
							<Sparkles className='w-5 h-5 text-primary' />
						</div>
						<div>
							<h3 className='font-semibold mb-2'>Quick Start Guide</h3>
							<ol className='space-y-2 text-sm text-muted-foreground'>
								<li className='flex items-start gap-2'>
									<span className='font-medium text-primary'>1.</span>
									<span>Select a category from the tabs</span>
								</li>
								<li className='flex items-start gap-2'>
									<span className='font-medium text-primary'>2.</span>
									<span>Choose an API endpoint</span>
								</li>
								<li className='flex items-start gap-2'>
									<span className='font-medium text-primary'>3.</span>
									<span>View response in JSON or formatted mode</span>
								</li>
								<li className='flex items-start gap-2'>
									<span className='font-medium text-primary'>4.</span>
									<span>Copy or download the data</span>
								</li>
							</ol>
						</div>
					</div>
				</Card>

				<Card className='p-6 bg-muted/50'>
					<h3 className='font-semibold mb-3 flex items-center gap-2'>
						<Zap className='w-5 h-5 text-yellow-500' />
						Pro Tips
					</h3>
					<div className='space-y-3 text-sm'>
						<div className='flex items-start gap-2'>
							<Badge variant='outline' className='mt-0.5'>
								CORS
							</Badge>
							<p className='text-muted-foreground'>
								All APIs support CORS for browser-based requests
							</p>
						</div>
						<div className='flex items-start gap-2'>
							<Badge variant='outline' className='mt-0.5'>
								FREE
							</Badge>
							<p className='text-muted-foreground'>
								No API keys required for basic usage
							</p>
						</div>
						<div className='flex items-start gap-2'>
							<Badge variant='outline' className='mt-0.5'>
								FAST
							</Badge>
							<p className='text-muted-foreground'>
								Response times shown for each request
							</p>
						</div>
					</div>
				</Card>
			</div>
		</div>
	)
}
