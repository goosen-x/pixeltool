'use client'

import { useState, useEffect } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
	Copy,
	Check,
	History,
	Download,
	Trash2,
	ExternalLink,
	Plus
} from 'lucide-react'
import {
	FaGoogle,
	FaYandex,
	FaVk,
	FaFacebookF,
	FaInstagram,
	FaEnvelope
} from 'react-icons/fa'
import { cn } from '@/lib/utils'
import {
	toolBar,
	toolFooterBar,
	toolIconButton,
	toolPill
} from '@/lib/ui/tool-pill'
import { WidgetSEOWrapper } from '@/components/seo/WidgetSEOWrapper'
import { getWidgetById } from '@/lib/constants/widgets'
import { UtmLinkBuilderSeo } from './UtmLinkBuilderSeo'

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
	// Пример кампании: без него ссылка не соберётся сразу после клика на
	// пресет — utm_campaign обязателен наравне с source и medium, а его
	// пресеты раньше не трогали.
	campaign: string
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
		campaign: 'summer-sale',
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
		campaign: 'summer-sale',
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
		campaign: 'launch',
		icon: <FaVk className='w-5 h-5' />,
		color: 'text-blue-500',
		gradient: 'from-blue-400 to-blue-500'
	},
	{
		id: 'facebook',
		name: 'Facebook',
		source: 'facebook',
		medium: 'social',
		campaign: 'launch',
		icon: <FaFacebookF className='w-5 h-5' />,
		color: 'text-indigo-600',
		gradient: 'from-indigo-500 to-indigo-600'
	},
	{
		id: 'instagram',
		name: 'Instagram',
		source: 'instagram',
		medium: 'social',
		campaign: 'launch',
		icon: <FaInstagram className='w-5 h-5' />,
		color: 'text-pink-600',
		gradient: 'from-pink-500 to-purple-600'
	},
	{
		id: 'email',
		name: 'Email',
		source: 'newsletter',
		medium: 'email',
		campaign: 'newsletter',
		icon: <FaEnvelope className='w-5 h-5' />,
		color: 'text-green-600',
		gradient: 'from-green-500 to-green-600',
		popular: true
	}
]

// Dynamic parameters for different platforms
const DYNAMIC_PARAMS: Record<string, { param: string; desc: string }[]> = {
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
	const widget = getWidgetById('utm-builder')!
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
	const [copied, setCopied] = useState(false)
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
				medium: preset.medium,
				// Кампания — тоже обязательное поле: без неё ссылка после клика
				// на пресет не соберётся. Не трогаем, если человек уже вписал своё.
				campaign: prev.campaign || preset.campaign
			}))
		}
	}

	const copyToClipboard = async () => {
		if (!generatedUrl) return

		try {
			await navigator.clipboard.writeText(generatedUrl)
			setCopied(true)
			setTimeout(() => setCopied(false), 2000)
		} catch (err) {
			console.error('Не удалось скопировать ссылку')
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
	}

	const clearHistory = () => {
		setHistory([])
		localStorage.removeItem('utm-history')
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
	}

	const isValidUrl = () => {
		return params.url && params.source && params.medium && params.campaign
	}

	const loadFromHistory = (link: SavedLink) => {
		setParams(link.params)
		setShowHistory(false)
	}

	const handleFieldBlur = (fieldName: string) => {
		setTouchedFields(prev => new Set(prev).add(fieldName))
	}

	const isFieldInvalid = (fieldName: string, value: string) => {
		return touchedFields.has(fieldName) && !value
	}

	/** Поле параметра в нижней полосе: подпись, ввод и подсказка в title. */
	const paramField = (
		name: keyof typeof params,
		label: string,
		placeholder: string,
		hint: string,
		required = false
	) => (
		<label
			className='flex items-center gap-2 text-sm text-muted-foreground'
			title={hint}
		>
			<span className='font-mono text-xs'>
				{label}
				{required && <span className='ml-0.5 text-destructive'>*</span>}
			</span>
			<input
				value={params[name] ?? ''}
				onChange={event => setParams({ ...params, [name]: event.target.value })}
				onBlur={() => handleFieldBlur(name)}
				placeholder={placeholder}
				spellCheck={false}
				aria-label={hint}
				className={cn(
					'w-40 rounded-md border bg-background px-2 py-1 font-mono text-sm text-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-ring',
					isFieldInvalid(name, params[name] ?? '') && 'border-destructive'
				)}
			/>
		</label>
	)

	return (
		<WidgetSEOWrapper widget={widget}>
			<Card className='overflow-hidden p-0'>
				{/* Верхняя полоса: готовые источники. Раньше это были шесть карточек
				    с градиентными плитками 48×48 — они весили больше, чем сама
				    ссылка, ради которой сюда приходят. */}
				<div className={toolBar}>
					<div className='flex flex-wrap items-center gap-1.5'>
						{PRESETS.map(preset => (
							<button
								key={preset.id}
								type='button'
								onClick={() => handlePresetSelect(preset.id)}
								aria-pressed={selectedPreset === preset.id}
								title={`${preset.source} / ${preset.medium}`}
								className={toolPill(
									selectedPreset === preset.id,
									'flex items-center gap-1.5'
								)}
							>
								{preset.icon}
								{preset.name}
							</button>
						))}
					</div>

					<div className='flex items-center gap-0.5 sm:ml-auto'>
						<Button
							size='icon'
							variant='ghost'
							onClick={copyToClipboard}
							disabled={!generatedUrl}
							title='Скопировать ссылку'
							className={toolIconButton}
						>
							{copied ? (
								<Check className='h-4 w-4 text-green-600 dark:text-green-400' />
							) : (
								<Copy className='h-4 w-4' />
							)}
						</Button>
						<Button
							size='icon'
							variant='ghost'
							onClick={saveToHistory}
							disabled={!generatedUrl}
							title='Сохранить ссылку в историю'
							className={toolIconButton}
						>
							<Plus className='h-4 w-4' />
						</Button>
						<Button
							size='icon'
							variant='ghost'
							onClick={() => window.open(generatedUrl, '_blank')}
							disabled={!generatedUrl}
							title='Открыть в новой вкладке'
							className={toolIconButton}
						>
							<ExternalLink className='h-4 w-4' />
						</Button>
						<Button
							size='icon'
							variant='ghost'
							onClick={() => setShowHistory(!showHistory)}
							title={
								history.length > 0
									? `История (${history.length})`
									: 'История пуста'
							}
							className={cn(toolIconButton, showHistory && 'text-foreground')}
						>
							<History className='h-4 w-4' />
						</Button>
					</div>
				</div>

				{/* Рабочая область: адрес страницы и то, что из него получилось. */}
				<div className='px-5 py-6 sm:px-6'>
					<label className='flex items-center rounded-md border bg-background focus-within:ring-2 focus-within:ring-ring'>
						<span className='px-2 py-1.5 font-mono text-sm text-muted-foreground'>
							https://
						</span>
						<input
							value={params.url.replace(/^https?:\/\//, '')}
							onChange={event =>
								setParams({ ...params, url: event.target.value })
							}
							onBlur={() => handleFieldBlur('url')}
							placeholder='example.com/page'
							spellCheck={false}
							aria-label='Адрес целевой страницы'
							className={cn(
								'min-w-0 flex-1 bg-transparent py-1.5 pr-2 font-mono text-sm text-foreground focus:outline-none',
								isFieldInvalid('url', params.url) && 'text-destructive'
							)}
						/>
					</label>

					{generatedUrl ? (
						<button
							type='button'
							onClick={copyToClipboard}
							title='Скопировать'
							className='group mt-6 flex w-full cursor-pointer items-center justify-between gap-3 rounded-xl border px-4 py-4 text-left transition-colors hover:border-primary/50 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring'
						>
							<span className='font-mono text-sm break-all'>
								{generatedUrl}
							</span>
							{copied ? (
								<Check className='h-4 w-4 shrink-0 text-green-600 dark:text-green-400' />
							) : (
								<Copy className='h-4 w-4 shrink-0 text-muted-foreground transition-colors group-hover:text-foreground' />
							)}
						</button>
					) : (
						<p className='mt-6 text-center text-sm text-muted-foreground'>
							Заполните адрес, источник, канал и кампанию — ссылка соберётся
							сама
						</p>
					)}
				</div>

				{/* Полоса обязательных меток. */}
				<div className={toolFooterBar}>
					{paramField(
						'source',
						'utm_source',
						'yandex',
						'Откуда пришёл трафик',
						true
					)}
					{paramField('medium', 'utm_medium', 'cpc', 'Тип трафика', true)}
					{paramField(
						'campaign',
						'utm_campaign',
						'summer-sale',
						'Название рекламной кампании',
						true
					)}
				</div>

				{/* Полоса необязательных: раньше пряталась за кнопкой
				    «Дополнительные параметры» с глазом, хотя это два поля. */}
				<div className={toolFooterBar}>
					{paramField(
						'content',
						'utm_content',
						'banner-header',
						'Что именно нажали — для A/B-тестов'
					)}
					{paramField(
						'term',
						'utm_term',
						'купить айфон',
						'Ключевое слово для контекстной рекламы'
					)}
				</div>

				{/* Динамические параметры площадки — показываются целиком, без
				    «показать все»: их всего несколько строк. */}
				{params.source && DYNAMIC_PARAMS[params.source] && (
					<div className={toolFooterBar}>
						<span className='text-sm text-muted-foreground'>
							Динамические параметры {params.source}
						</span>
						<span className='flex flex-wrap items-center gap-x-4 gap-y-1'>
							{DYNAMIC_PARAMS[params.source].map((param, index) => (
								<span
									key={index}
									title={param.desc}
									className='font-mono text-xs text-muted-foreground'
								>
									{param.param}
								</span>
							))}
						</span>
					</div>
				)}
			</Card>

			{/* История — тихая полка под инструментом. */}
			{showHistory && history.length > 0 && (
				<div className='mt-6'>
					<div className='flex items-center justify-between gap-3 px-1'>
						<p className='text-sm text-muted-foreground'>Сохранённые ссылки</p>
						<span className='flex items-center gap-0.5'>
							<Button
								size='icon'
								variant='ghost'
								onClick={downloadHistory}
								title='Скачать список'
								className={toolIconButton}
							>
								<Download className='h-4 w-4' />
							</Button>
							<Button
								size='icon'
								variant='ghost'
								onClick={clearHistory}
								title='Очистить историю'
								className={toolIconButton}
							>
								<Trash2 className='h-4 w-4' />
							</Button>
						</span>
					</div>

					<div className='mt-2 divide-y rounded-xl border'>
						{history.slice(0, 10).map((item, index) => (
							<div
								key={index}
								className='group flex items-center justify-between gap-3 px-4 py-3'
							>
								<button
									type='button'
									onClick={() => loadFromHistory(item)}
									title='Вернуть в конструктор'
									className='min-w-0 flex-1 cursor-pointer text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-ring'
								>
									<span className='block truncate text-sm'>{item.name}</span>
									<span className='mt-0.5 block truncate font-mono text-xs text-muted-foreground'>
										{item.url}
									</span>
								</button>
								<Button
									size='icon'
									variant='ghost'
									onClick={() => navigator.clipboard.writeText(item.url)}
									title='Скопировать ссылку'
									className={cn(
										toolIconButton,
										'h-7 w-7 opacity-0 group-hover:opacity-100 focus-visible:opacity-100'
									)}
								>
									<Copy className='h-3.5 w-3.5' />
								</Button>
							</div>
						))}
					</div>
				</div>
			)}

			<UtmLinkBuilderSeo />
		</WidgetSEOWrapper>
	)
}
