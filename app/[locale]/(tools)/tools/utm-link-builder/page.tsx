'use client'

import { useState, useEffect } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue
} from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import {
	Link as LinkIcon,
	Copy,
	QrCode,
	Info,
	History,
	Download,
	Trash2,
	ExternalLink
} from 'lucide-react'
import { toast } from 'sonner'
import { useTranslations } from 'next-intl'
import QRCode from 'qrcode'

interface UTMParams {
	url: string
	source: string
	medium: string
	campaign: string
	content?: string
	term?: string
}

interface Preset {
	name: string
	source: string
	medium: string
	params?: Record<string, string>
}

interface SavedLink {
	url: string
	params: UTMParams
	timestamp: Date
	name?: string
}

const PRESETS: Preset[] = [
	{ name: 'Google Ads', source: 'google', medium: 'cpc' },
	{ name: 'Yandex.Direct', source: 'yandex', medium: 'cpc' },
	{ name: 'VKontakte', source: 'vk', medium: 'social' },
	{ name: 'Facebook', source: 'facebook', medium: 'social' },
	{ name: 'Instagram', source: 'instagram', medium: 'social' },
	{ name: 'Email Newsletter', source: 'newsletter', medium: 'email' },
	{ name: 'QR Code', source: 'qr', medium: 'offline' }
]

// Dynamic parameters for different platforms
const DYNAMIC_PARAMS = {
	google: [
		{ param: '{keyword}', desc: 'Keyword that triggered the ad' },
		{ param: '{placement}', desc: 'Website domain (Display Network only)' },
		{ param: '{creative}', desc: 'Ad ID' },
		{
			param: '{network}',
			desc: 'Network type (g=Search, s=Search Partner, d=Display)'
		},
		{ param: '{matchtype}', desc: 'Match type (e=exact, p=phrase, b=broad)' },
		{
			param: '{adposition}',
			desc: 'Ad position (e.g., 1t2 = page 1, top, position 2)'
		},
		{ param: '{device}', desc: 'Device type (m=mobile, t=tablet, c=computer)' },
		{ param: '{devicemodel}', desc: 'Device model (Display Network only)' },
		{ param: '{target}', desc: 'Placement category (Display Network)' }
	],
	yandex: [
		{ param: '{keyword}', desc: 'Keyword phrase' },
		{ param: '{source_type}', desc: 'Platform type (search/context)' },
		{ param: '{source}', desc: 'Domain for context ads' },
		{ param: '{position_type}', desc: 'Block type (premium/other/none)' },
		{ param: '{position}', desc: 'Exact position in block' },
		{ param: '{campaign_id}', desc: 'Campaign ID' },
		{ param: '{ad_id}', desc: 'Ad ID' },
		{ param: '{phrase_id}', desc: 'Keyword phrase ID' }
	],
	vk: [
		{ param: '{campaign_id}', desc: 'Campaign ID' },
		{ param: '{ad_id}', desc: 'Ad ID' },
		{ param: '{client_id}', desc: 'Client ID' }
	]
}

export default function UTMBuilderPage() {
	const t = useTranslations('widgets.utmBuilder')
	const [params, setParams] = useState<UTMParams>({
		url: '',
		source: '',
		medium: '',
		campaign: '',
		content: '',
		term: ''
	})
	const [preset, setPreset] = useState('')
	const [generatedUrl, setGeneratedUrl] = useState('')
	const [showQR, setShowQR] = useState(false)
	const [history, setHistory] = useState<SavedLink[]>([])
	const [activeTab, setActiveTab] = useState('builder')

	// Load history from localStorage
	useEffect(() => {
		const savedHistory = localStorage.getItem('utm-history')
		if (savedHistory) {
			const parsed = JSON.parse(savedHistory)
			setHistory(
				parsed.map((item: any) => ({
					...item,
					timestamp: new Date(item.timestamp)
				}))
			)
		}
	}, [])

	// Generate URL when params change
	useEffect(() => {
		generateURL()
	}, [params])

	const generateURL = () => {
		if (!params.url || !params.source || !params.medium || !params.campaign) {
			setGeneratedUrl('')
			return
		}

		try {
			// Ensure URL has protocol
			let baseUrl = params.url
			if (!baseUrl.match(/^https?:\/\//)) {
				baseUrl = 'https://' + baseUrl
			}

			const url = new URL(baseUrl)

			// Add UTM parameters
			url.searchParams.set('utm_source', params.source)
			url.searchParams.set('utm_medium', params.medium)
			url.searchParams.set('utm_campaign', params.campaign)

			if (params.content) url.searchParams.set('utm_content', params.content)
			if (params.term) url.searchParams.set('utm_term', params.term)

			setGeneratedUrl(url.toString())
		} catch (error) {
			setGeneratedUrl('')
		}
	}

	const handlePresetChange = (presetName: string) => {
		setPreset(presetName)
		const selectedPreset = PRESETS.find(p => p.name === presetName)
		if (selectedPreset) {
			setParams(prev => ({
				...prev,
				source: selectedPreset.source,
				medium: selectedPreset.medium
			}))
		}
	}

	const copyToClipboard = async () => {
		if (!generatedUrl) return

		try {
			await navigator.clipboard.writeText(generatedUrl)
			toast.success(t('toast.copied'))
		} catch (err) {
			toast.error(t('toast.copyError'))
		}
	}

	const saveToHistory = () => {
		if (!generatedUrl) return

		const newLink: SavedLink = {
			url: generatedUrl,
			params: { ...params },
			timestamp: new Date(),
			name: `${params.source} - ${params.campaign}`
		}

		const newHistory = [newLink, ...history].slice(0, 50)
		setHistory(newHistory)
		localStorage.setItem('utm-history', JSON.stringify(newHistory))
		toast.success(t('toast.saved'))
	}

	const clearHistory = () => {
		setHistory([])
		localStorage.removeItem('utm-history')
		toast.success(t('toast.historyCleared'))
	}

	const downloadHistory = () => {
		const content = history
			.map(
				item => `${item.timestamp.toLocaleString()}\t${item.name}\t${item.url}`
			)
			.join('\n')

		const blob = new Blob([content], { type: 'text/plain' })
		const url = URL.createObjectURL(blob)
		const a = document.createElement('a')
		a.href = url
		a.download = `utm-links-${Date.now()}.txt`
		a.click()
		URL.revokeObjectURL(url)

		toast.success(t('toast.downloaded'))
	}

	const generateQR = async () => {
		if (!generatedUrl) return

		try {
			const canvas = document.getElementById('qr-canvas') as HTMLCanvasElement
			if (canvas) {
				await QRCode.toCanvas(canvas, generatedUrl, {
					width: 256,
					margin: 2
				})
				setShowQR(true)
			}
		} catch (err) {
			toast.error(t('toast.qrError'))
		}
	}

	const isValidUrl = () => {
		return params.url && params.source && params.medium && params.campaign
	}

	return (
		<Tabs value={activeTab} onValueChange={setActiveTab}>
			<TabsList className='grid w-full grid-cols-3'>
				<TabsTrigger value='builder'>
					<LinkIcon className='w-4 h-4 mr-2' />
					{t('tabs.builder')}
				</TabsTrigger>
				<TabsTrigger value='parameters'>
					<Info className='w-4 h-4 mr-2' />
					{t('tabs.parameters')}
				</TabsTrigger>
				<TabsTrigger value='history'>
					<History className='w-4 h-4 mr-2' />
					{t('tabs.history')}
				</TabsTrigger>
			</TabsList>

			<TabsContent value='builder' className='space-y-6'>
				<div className='grid gap-6 lg:grid-cols-2'>
					{/* Input Form */}
					<Card>
						<CardHeader>
							<CardTitle>{t('form.title')}</CardTitle>
						</CardHeader>
						<CardContent className='space-y-4'>
							{/* Target URL */}
							<div className='space-y-2'>
								<Label htmlFor='url'>
									{t('form.url')} <span className='text-red-500'>*</span>
								</Label>
								<div className='flex gap-2'>
									<span className='flex items-center px-3 text-sm text-muted-foreground bg-muted rounded-l-md border border-r-0'>
										https://
									</span>
									<Input
										id='url'
										placeholder='example.com/page'
										value={params.url.replace(/^https?:\/\//, '')}
										onChange={e =>
											setParams({ ...params, url: e.target.value })
										}
										className='rounded-l-none'
									/>
								</div>
							</div>

							{/* Preset */}
							<div className='space-y-2'>
								<Label>{t('form.preset')}</Label>
								<Select value={preset} onValueChange={handlePresetChange}>
									<SelectTrigger>
										<SelectValue placeholder={t('form.presetPlaceholder')} />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value='custom'>{t('form.custom')}</SelectItem>
										{PRESETS.map(p => (
											<SelectItem key={p.name} value={p.name}>
												{p.name}
											</SelectItem>
										))}
									</SelectContent>
								</Select>
							</div>

							{/* Source */}
							<div className='space-y-2'>
								<Label htmlFor='source'>
									{t('form.source')} <span className='text-red-500'>*</span>
								</Label>
								<Input
									id='source'
									placeholder='google, yandex, vk...'
									value={params.source}
									onChange={e =>
										setParams({ ...params, source: e.target.value })
									}
								/>
								<p className='text-xs text-muted-foreground'>
									{t('form.sourceHint')}
								</p>
							</div>

							{/* Medium */}
							<div className='space-y-2'>
								<Label htmlFor='medium'>
									{t('form.medium')} <span className='text-red-500'>*</span>
								</Label>
								<Input
									id='medium'
									placeholder='cpc, email, social...'
									value={params.medium}
									onChange={e =>
										setParams({ ...params, medium: e.target.value })
									}
								/>
								<p className='text-xs text-muted-foreground'>
									{t('form.mediumHint')}
								</p>
							</div>

							{/* Campaign */}
							<div className='space-y-2'>
								<Label htmlFor='campaign'>
									{t('form.campaign')} <span className='text-red-500'>*</span>
								</Label>
								<Input
									id='campaign'
									placeholder='summer-sale-2024'
									value={params.campaign}
									onChange={e =>
										setParams({ ...params, campaign: e.target.value })
									}
								/>
								<p className='text-xs text-muted-foreground'>
									{t('form.campaignHint')}
								</p>
							</div>

							{/* Content (optional) */}
							<div className='space-y-2'>
								<Label htmlFor='content'>{t('form.content')}</Label>
								<Input
									id='content'
									placeholder='banner-header'
									value={params.content}
									onChange={e =>
										setParams({ ...params, content: e.target.value })
									}
								/>
								<p className='text-xs text-muted-foreground'>
									{t('form.contentHint')}
								</p>
							</div>

							{/* Term (optional) */}
							<div className='space-y-2'>
								<Label htmlFor='term'>{t('form.term')}</Label>
								<Input
									id='term'
									placeholder='buy iphone'
									value={params.term}
									onChange={e => setParams({ ...params, term: e.target.value })}
								/>
								<p className='text-xs text-muted-foreground'>
									{t('form.termHint')}
								</p>
							</div>
						</CardContent>
					</Card>

					{/* Result */}
					<Card>
						<CardHeader>
							<CardTitle>{t('result.title')}</CardTitle>
						</CardHeader>
						<CardContent className='space-y-4'>
							{generatedUrl ? (
								<>
									<div className='p-4 bg-muted rounded-lg'>
										<p className='text-sm font-mono break-all'>
											{generatedUrl}
										</p>
									</div>

									<div className='grid grid-cols-2 gap-2'>
										<Button
											onClick={copyToClipboard}
											variant='outline'
											className='hover:bg-accent hover:text-white'
										>
											<Copy className='w-4 h-4 mr-2' />
											{t('result.copy')}
										</Button>
										<Button onClick={saveToHistory} variant='outline'>
											<History className='w-4 h-4 mr-2' />
											{t('result.save')}
										</Button>
										<Button onClick={generateQR} variant='outline'>
											<QrCode className='w-4 h-4 mr-2' />
											{t('result.qr')}
										</Button>
										<Button
											onClick={() => window.open(generatedUrl, '_blank')}
											variant='outline'
										>
											<ExternalLink className='w-4 h-4 mr-2' />
											{t('result.test')}
										</Button>
									</div>

									{showQR && (
										<div className='flex justify-center mt-4'>
											<canvas id='qr-canvas' />
										</div>
									)}

									{/* UTM Parameters Preview */}
									<div className='space-y-2'>
										<h4 className='font-medium text-sm'>
											{t('result.parameters')}
										</h4>
										<div className='space-y-1'>
											<div className='flex gap-2'>
												<Badge variant='secondary'>utm_source</Badge>
												<span className='text-sm'>{params.source}</span>
											</div>
											<div className='flex gap-2'>
												<Badge variant='secondary'>utm_medium</Badge>
												<span className='text-sm'>{params.medium}</span>
											</div>
											<div className='flex gap-2'>
												<Badge variant='secondary'>utm_campaign</Badge>
												<span className='text-sm'>{params.campaign}</span>
											</div>
											{params.content && (
												<div className='flex gap-2'>
													<Badge variant='secondary'>utm_content</Badge>
													<span className='text-sm'>{params.content}</span>
												</div>
											)}
											{params.term && (
												<div className='flex gap-2'>
													<Badge variant='secondary'>utm_term</Badge>
													<span className='text-sm'>{params.term}</span>
												</div>
											)}
										</div>
									</div>
								</>
							) : (
								<div className='text-center py-8 text-muted-foreground'>
									<LinkIcon className='w-12 h-12 mx-auto mb-4 opacity-50' />
									<p>{t('result.empty')}</p>
								</div>
							)}
						</CardContent>
					</Card>
				</div>
			</TabsContent>

			<TabsContent value='parameters' className='space-y-6'>
				<div className='grid gap-6 lg:grid-cols-3'>
					{/* Google Ads */}
					<Card>
						<CardHeader>
							<CardTitle className='text-lg'>Google Ads</CardTitle>
						</CardHeader>
						<CardContent>
							<div className='space-y-2'>
								{DYNAMIC_PARAMS.google.map((param, index) => (
									<div key={index} className='text-sm'>
										<code className='inline-code'>{param.param}</code>
										<p className='text-xs text-muted-foreground mt-1'>
											{param.desc}
										</p>
									</div>
								))}
							</div>
						</CardContent>
					</Card>

					{/* Yandex.Direct */}
					<Card>
						<CardHeader>
							<CardTitle className='text-lg'>Yandex.Direct</CardTitle>
						</CardHeader>
						<CardContent>
							<div className='space-y-2'>
								{DYNAMIC_PARAMS.yandex.map((param, index) => (
									<div key={index} className='text-sm'>
										<code className='inline-code'>{param.param}</code>
										<p className='text-xs text-muted-foreground mt-1'>
											{param.desc}
										</p>
									</div>
								))}
							</div>
						</CardContent>
					</Card>

					{/* VKontakte */}
					<Card>
						<CardHeader>
							<CardTitle className='text-lg'>VKontakte</CardTitle>
						</CardHeader>
						<CardContent>
							<div className='space-y-2'>
								{DYNAMIC_PARAMS.vk.map((param, index) => (
									<div key={index} className='text-sm'>
										<code className='inline-code'>{param.param}</code>
										<p className='text-xs text-muted-foreground mt-1'>
											{param.desc}
										</p>
									</div>
								))}
							</div>
							<div className='mt-4 p-3 bg-muted rounded-lg'>
								<p className='text-xs text-muted-foreground'>
									{t('parameters.hint')}
								</p>
							</div>
						</CardContent>
					</Card>
				</div>
			</TabsContent>

			<TabsContent value='history' className='space-y-6'>
				<Card>
					<CardHeader>
						<CardTitle className='flex items-center justify-between'>
							<span>{t('history.title')}</span>
							<div className='flex gap-2'>
								{history.length > 0 && (
									<>
										<Button
											variant='outline'
											size='sm'
											onClick={downloadHistory}
										>
											<Download className='w-4 h-4 mr-1' />
											{t('history.download')}
										</Button>
										<Button variant='outline' size='sm' onClick={clearHistory}>
											<Trash2 className='w-4 h-4 mr-1' />
											{t('history.clear')}
										</Button>
									</>
								)}
							</div>
						</CardTitle>
					</CardHeader>
					<CardContent>
						{history.length > 0 ? (
							<div className='space-y-2'>
								{history.map((item, index) => (
									<div key={index} className='p-3 border rounded-lg space-y-2'>
										<div className='flex items-start justify-between'>
											<div className='flex-1'>
												<div className='font-medium text-sm'>{item.name}</div>
												<div className='text-xs text-muted-foreground'>
													{item.timestamp.toLocaleString()}
												</div>
											</div>
											<Button
												size='icon'
												variant='ghost'
												className='hover:bg-accent hover:text-white'
												onClick={async () => {
													await navigator.clipboard.writeText(item.url)
													toast.success(t('toast.copied'))
												}}
											>
												<Copy className='w-4 h-4' />
											</Button>
										</div>
										<div className='text-sm font-mono text-muted-foreground break-all'>
											{item.url}
										</div>
									</div>
								))}
							</div>
						) : (
							<p className='text-center text-muted-foreground py-8'>
								{t('history.empty')}
							</p>
						)}
					</CardContent>
				</Card>
			</TabsContent>
		</Tabs>
	)
}
