'use client'

import { useState, useEffect } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import {
	Link as LinkIcon,
	Copy,
	Info,
	History,
	Download,
	Trash2,
	ExternalLink,
	Check,
	Sparkles,
	Mail,
	Share2,
	Search,
	MessageSquare,
	Globe,
	X,
	ChevronRight,
	Clock,
	Plus,
	ArrowRight,
	Eye,
	EyeOff,
	Facebook,
	Instagram
} from 'lucide-react'
import {
	FaGoogle,
	FaYandex,
	FaVk,
	FaFacebookF,
	FaInstagram,
	FaEnvelope
} from 'react-icons/fa'
import { toast } from 'sonner'
import { useTranslations } from 'next-intl'
import { cn } from '@/lib/utils'

interface UTMParams {
	url: string
	source: string
	medium: string
	campaign: string
	content?: string
	term?: string
}

interface Preset {
	id: string
	name: string
	source: string
	medium: string
	icon: React.ReactNode
	color: string
	gradient: string
	popular?: boolean
}

interface SavedLink {
	url: string
	params: UTMParams
	timestamp: Date
	name?: string
}

const PRESETS: Preset[] = [
	{
		id: 'google-ads',
		name: 'Google Ads',
		source: 'google',
		medium: 'cpc',
		icon: <FaGoogle className='w-5 h-5' />,
		color: 'text-blue-600',
		gradient: 'from-blue-500 to-blue-600',
		popular: true
	},
	{
		id: 'yandex',
		name: 'Yandex.Direct',
		source: 'yandex',
		medium: 'cpc',
		icon: <FaYandex className='w-5 h-5' />,
		color: 'text-red-600',
		gradient: 'from-red-500 to-red-600',
		popular: true
	},
	{
		id: 'vk',
		name: 'VKontakte',
		source: 'vk',
		medium: 'social',
		icon: <FaVk className='w-5 h-5' />,
		color: 'text-blue-500',
		gradient: 'from-blue-400 to-blue-500'
	},
	{
		id: 'facebook',
		name: 'Facebook',
		source: 'facebook',
		medium: 'social',
		icon: <FaFacebookF className='w-5 h-5' />,
		color: 'text-indigo-600',
		gradient: 'from-indigo-500 to-indigo-600'
	},
	{
		id: 'instagram',
		name: 'Instagram',
		source: 'instagram',
		medium: 'social',
		icon: <FaInstagram className='w-5 h-5' />,
		color: 'text-pink-600',
		gradient: 'from-pink-500 to-purple-600'
	},
	{
		id: 'email',
		name: 'Email',
		source: 'newsletter',
		medium: 'email',
		icon: <FaEnvelope className='w-5 h-5' />,
		color: 'text-green-600',
		gradient: 'from-green-500 to-green-600',
		popular: true
	}
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
		url: 'example.com/landing-page',
		source: '',
		medium: '',
		campaign: '',
		content: '',
		term: ''
	})
	const [selectedPreset, setSelectedPreset] = useState<string | null>(null)
	const [generatedUrl, setGeneratedUrl] = useState('')
	const [history, setHistory] = useState<SavedLink[]>([])
	const [showHistory, setShowHistory] = useState(false)
	const [showAdvanced, setShowAdvanced] = useState(false)
	const [copied, setCopied] = useState(false)
	const [showAllParams, setShowAllParams] = useState(false)
	const [touchedFields, setTouchedFields] = useState<Set<string>>(new Set())

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

	const handlePresetSelect = (presetId: string) => {
		setSelectedPreset(presetId)
		const preset = PRESETS.find(p => p.id === presetId)
		if (preset) {
			setParams(prev => ({
				...prev,
				source: preset.source,
				medium: preset.medium
			}))
		}
	}

	const copyToClipboard = async () => {
		if (!generatedUrl) return

		try {
			await navigator.clipboard.writeText(generatedUrl)
			setCopied(true)
			toast.success(t('toast.copied'))
			setTimeout(() => setCopied(false), 2000)
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

	const isValidUrl = () => {
		return params.url && params.source && params.medium && params.campaign
	}

	const loadFromHistory = (link: SavedLink) => {
		setParams(link.params)
		setShowHistory(false)
		toast.success(t('toast.loaded'))
	}

	const handleFieldBlur = (fieldName: string) => {
		setTouchedFields(prev => new Set(prev).add(fieldName))
	}

	const isFieldInvalid = (fieldName: string, value: string) => {
		return touchedFields.has(fieldName) && !value
	}

	return (
		<div className='space-y-6'>
			{/* Visual URL Constructor */}
			<Card className='border-2'>
				<CardHeader className='pb-3'>
					<div className='flex items-center justify-between'>
						<CardTitle className='text-xl flex items-center gap-2'>
							<LinkIcon className='w-5 h-5' />
							{t('urlConstructor.title')}
						</CardTitle>
						<div className='flex gap-2'>
							<Button
								variant='ghost'
								size='sm'
								onClick={() => setShowHistory(!showHistory)}
								className='relative'
							>
								<History className='w-4 h-4' />
								{history.length > 0 && (
									<Badge
										variant='secondary'
										className='absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center text-[10px]'
									>
										{history.length}
									</Badge>
								)}
							</Button>
						</div>
					</div>
				</CardHeader>
				<CardContent>
					{/* URL Input */}
					<div className='space-y-2 mb-4'>
						<Label htmlFor='url'>
							{t('form.url')} <span className='text-red-500'>*</span>
						</Label>
						<div className='flex'>
							<span className='flex items-center px-3 text-sm text-muted-foreground bg-muted rounded-l-md border border-r-0'>
								https://
							</span>
							<Input
								id='url'
								placeholder='example.com/page'
								value={params.url.replace(/^https?:\/\//, '')}
								onChange={e => setParams({ ...params, url: e.target.value })}
								onBlur={() => handleFieldBlur('url')}
								className={cn(
									'rounded-l-none flex-1',
									isFieldInvalid('url', params.url) &&
										'border-red-500 focus:ring-red-500'
								)}
							/>
						</div>
					</div>

					{/* Live URL Preview */}
					{generatedUrl && (
						<div className='space-y-4'>
							<Separator />
							<div className='space-y-2'>
								<div className='flex items-center justify-between'>
									<Label className='text-sm text-muted-foreground'>
										{t('result.preview')}
									</Label>
									<div className='flex gap-2'>
										<Button
											size='sm'
											variant={copied ? 'default' : 'outline'}
											onClick={copyToClipboard}
											className='h-8'
										>
											{copied ? (
												<Check className='w-3 h-3 mr-2' />
											) : (
												<Copy className='w-3 h-3 mr-2' />
											)}
											{t('result.copy')}
										</Button>
										<Button
											size='sm'
											variant='outline'
											onClick={saveToHistory}
											className='h-8'
										>
											<Plus className='w-3 h-3 mr-2' />
											{t('result.save')}
										</Button>
										<Button
											size='sm'
											variant='ghost'
											onClick={() => window.open(generatedUrl, '_blank')}
											className='h-8'
										>
											<ExternalLink className='w-3 h-3' />
										</Button>
									</div>
								</div>
								<div className='p-3 bg-muted rounded-lg'>
									<p className='text-sm font-mono break-all text-foreground'>
										{generatedUrl}
									</p>
								</div>
							</div>
						</div>
					)}
				</CardContent>
			</Card>

			{/* Traffic Source Cards */}
			<div className='space-y-4'>
				<h3 className='text-lg font-semibold flex items-center gap-2'>
					<Sparkles className='w-5 h-5 text-primary' />
					{t('sources.title')}
				</h3>
				<div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3'>
					{PRESETS.map(preset => (
						<Card
							key={preset.id}
							className={cn(
								'cursor-pointer transition-all hover:shadow-lg hover:scale-105',
								selectedPreset === preset.id && 'ring-2 ring-primary'
							)}
							onClick={() => handlePresetSelect(preset.id)}
						>
							<CardContent className='p-4 text-center space-y-2'>
								<div
									className={cn(
										'w-12 h-12 rounded-lg flex items-center justify-center mx-auto bg-gradient-to-br',
										preset.gradient,
										'text-white'
									)}
								>
									{preset.icon}
								</div>
								<h4 className='font-medium text-sm'>{preset.name}</h4>
								<p className='text-xs text-muted-foreground'>
									{preset.source} / {preset.medium}
								</p>
							</CardContent>
						</Card>
					))}
				</div>
			</div>

			{/* UTM Parameters Form */}
			<Card>
				<CardHeader>
					<CardTitle className='text-lg'>{t('form.title')}</CardTitle>
				</CardHeader>
				<CardContent className='space-y-4'>
					<div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
						{/* Source */}
						<div className='space-y-2'>
							<Label htmlFor='source'>
								{t('form.source')} <span className='text-red-500'>*</span>
							</Label>
							<Input
								id='source'
								placeholder='google, yandex, vk...'
								value={params.source}
								onChange={e => setParams({ ...params, source: e.target.value })}
								onBlur={() => handleFieldBlur('source')}
								className={cn(
									isFieldInvalid('source', params.source) &&
										'border-red-500 focus:ring-red-500'
								)}
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
								onChange={e => setParams({ ...params, medium: e.target.value })}
								onBlur={() => handleFieldBlur('medium')}
								className={cn(
									isFieldInvalid('medium', params.medium) &&
										'border-red-500 focus:ring-red-500'
								)}
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
								onBlur={() => handleFieldBlur('campaign')}
								className={cn(
									isFieldInvalid('campaign', params.campaign) &&
										'border-red-500 focus:ring-red-500'
								)}
							/>
							<p className='text-xs text-muted-foreground'>
								{t('form.campaignHint')}
							</p>
						</div>
					</div>

					{/* Advanced Parameters */}
					<div>
						<Button
							variant='ghost'
							size='sm'
							onClick={() => setShowAdvanced(!showAdvanced)}
							className='mb-3'
						>
							{showAdvanced ? (
								<EyeOff className='w-4 h-4 mr-2' />
							) : (
								<Eye className='w-4 h-4 mr-2' />
							)}
							{t('form.advanced')}
						</Button>

						{showAdvanced && (
							<div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
								{/* Content */}
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

								{/* Term */}
								<div className='space-y-2'>
									<Label htmlFor='term'>{t('form.term')}</Label>
									<Input
										id='term'
										placeholder='buy iphone'
										value={params.term}
										onChange={e =>
											setParams({ ...params, term: e.target.value })
										}
									/>
									<p className='text-xs text-muted-foreground'>
										{t('form.termHint')}
									</p>
								</div>
							</div>
						)}
					</div>

					{/* Dynamic Parameters Info */}
					{params.source &&
						(params.source === 'google' ||
							params.source === 'yandex' ||
							params.source === 'vk') &&
						DYNAMIC_PARAMS[params.source] && (
							<div className='mt-4 p-3 bg-muted rounded-lg'>
								<div className='flex items-center gap-2 mb-2'>
									<Info className='w-4 h-4' />
									<span className='text-sm font-medium'>
										{t('parameters.title')}
									</span>
								</div>
								<div className='space-y-1'>
									{DYNAMIC_PARAMS[params.source]
										.slice(0, showAllParams ? undefined : 3)
										.map((param, index) => (
											<div key={index} className='text-xs'>
												<code className='bg-background px-1 py-0.5 rounded'>
													{param.param}
												</code>
												<span className='text-muted-foreground ml-2'>
													{param.desc}
												</span>
											</div>
										))}
									{DYNAMIC_PARAMS[params.source].length > 3 && (
										<Button
											variant='link'
											size='sm'
											className='p-0 h-auto text-xs'
											onClick={() => setShowAllParams(!showAllParams)}
										>
											{showAllParams ? (
												<>
													{t('parameters.showLess')}{' '}
													<ChevronRight className='w-3 h-3 ml-1 rotate-90' />
												</>
											) : (
												<>
													{t('parameters.viewAll')}{' '}
													<ChevronRight className='w-3 h-3 ml-1' />
												</>
											)}
										</Button>
									)}
								</div>
							</div>
						)}
				</CardContent>
			</Card>

			{/* Compact History */}
			{showHistory && history.length > 0 && (
				<Card>
					<CardHeader>
						<CardTitle className='text-lg flex items-center justify-between'>
							<span className='flex items-center gap-2'>
								<Clock className='w-5 h-5' />
								{t('history.title')}
							</span>
							<div className='flex gap-2'>
								<Button variant='ghost' size='sm' onClick={downloadHistory}>
									<Download className='w-4 h-4' />
								</Button>
								<Button variant='ghost' size='sm' onClick={clearHistory}>
									<Trash2 className='w-4 h-4' />
								</Button>
							</div>
						</CardTitle>
					</CardHeader>
					<CardContent>
						<div className='space-y-2 max-h-64 overflow-y-auto'>
							{history.slice(0, 10).map((item, index) => (
								<div
									key={index}
									className='group p-2 rounded-lg hover:bg-muted cursor-pointer transition-colors'
									onClick={() => loadFromHistory(item)}
								>
									<div className='flex items-center justify-between'>
										<div className='flex-1 min-w-0'>
											<div className='flex items-center gap-2'>
												<span className='font-medium text-sm truncate'>
													{item.name}
												</span>
												<Badge variant='secondary' className='text-[10px]'>
													{new Date(item.timestamp).toLocaleDateString()}
												</Badge>
											</div>
											<p className='text-xs text-muted-foreground truncate'>
												{item.url}
											</p>
										</div>
										<div className='flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity'>
											<Button
												size='icon'
												variant='ghost'
												className='h-7 w-7'
												onClick={async e => {
													e.stopPropagation()
													await navigator.clipboard.writeText(item.url)
													toast.success(t('toast.copied'))
												}}
											>
												<Copy className='w-3 h-3' />
											</Button>
										</div>
									</div>
								</div>
							))}
						</div>
					</CardContent>
				</Card>
			)}
		</div>
	)
}
