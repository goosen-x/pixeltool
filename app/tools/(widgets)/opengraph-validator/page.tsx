'use client'

import { useState, useCallback, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { useWidgetCreation } from '@/lib/hooks/widgets/useWidgetCreation'
import {
	Globe,
	CheckCircle,
	AlertCircle,
	Copy,
	ExternalLink,
	Share2,
	Code2
} from 'lucide-react'
import { toast } from 'sonner'
import Image from 'next/image'

interface OpenGraphData {
	title?: string
	description?: string
	image?: string
	url?: string
	type?: string
	siteName?: string
	locale?: string
	video?: string
	audio?: string
	article?: {
		publishedTime?: string
		modifiedTime?: string
		author?: string
		section?: string
		tag?: string[]
	}
}

interface ValidationResult {
	isValid: boolean
	foundTags: Record<string, string>
	missingTags: string[]
	recommendations: string[]
	errors: string[]
	warnings: string[]
}

const WIDGET_CONFIG = {
	id: 'opengraph-validator',
	icon: Globe,
	gradient: 'from-blue-500 to-purple-600'
}

const REQUIRED_OG_TAGS = [
	'og:title',
	'og:description',
	'og:image',
	'og:url',
	'og:type'
]

const RECOMMENDED_OG_TAGS = [
	'og:site_name',
	'og:locale',
	'twitter:card',
	'twitter:title',
	'twitter:description',
	'twitter:image'
]

// Force dynamic rendering to avoid build-time errors
export const dynamic = 'force-dynamic'

export default function OpenGraphValidatorPage() {
	const widget = useWidgetCreation({
		widgetId: WIDGET_CONFIG.id,
		enableKeyboard: true,
		enableAnalytics: true,
		enableFavorites: true,
		defaultState: {
			inputs: {
				url: ''
			}
		},
		validationRules: {
			url: value => {
				if (!value || value.trim().length === 0) {
					return 'URL обязателен для заполнения'
				}
				try {
					new URL(value)
					return true
				} catch {
					return 'Введите корректный URL'
				}
			}
		}
	})

	const [isValidating, setIsValidating] = useState(false)
	const [validationResult, setValidationResult] =
		useState<ValidationResult | null>(null)
	const [ogData, setOgData] = useState<OpenGraphData | null>(null)

	// Validate URL and fetch Open Graph data
	const validateUrl = useCallback(async () => {
		if (!widget.validateAllInputs()) return

		setIsValidating(true)
		widget.setLoading(true)

		try {
			// In a real implementation, you would make an API call to fetch and parse the HTML
			// For this demo, we'll simulate the validation process

			const url = widget.inputs.url
			const response = await fetch(
				`/api/opengraph-validator?url=${encodeURIComponent(url)}`
			)

			if (!response.ok) {
				throw new Error('Failed to fetch page data')
			}

			const data = await response.json()
			const { ogTags = {}, twitterTags = {}, htmlData, imageData } = data

			// Parse Open Graph data
			const parsedOgData: OpenGraphData = {
				title: ogTags['og:title'],
				description: ogTags['og:description'],
				image: ogTags['og:image'],
				url: ogTags['og:url'],
				type: ogTags['og:type'],
				siteName: ogTags['og:site_name'],
				locale: ogTags['og:locale']
			}

			// Validate tags
			const foundTags: Record<string, string> = { ...ogTags, ...twitterTags }
			const missingTags = REQUIRED_OG_TAGS.filter(tag => !foundTags[tag])
			const missingRecommended = RECOMMENDED_OG_TAGS.filter(
				tag => !foundTags[tag]
			)

			const errors: string[] = []
			const warnings: string[] = []
			const recommendations: string[] = []

			// Check for errors
			if (missingTags.length > 0) {
				errors.push(`Missing required tags: ${missingTags.join(', ')}`)
			}

			// Check image
			if (foundTags['og:image']) {
				try {
					const imageUrl = new URL(foundTags['og:image'], url)
					// In real implementation, check if image is accessible and get dimensions
					if (foundTags['og:image'].startsWith('http')) {
						// Image validation would go here
					}
				} catch {
					errors.push('og:image contains invalid URL')
				}
			}

			// Check for warnings
			if (!foundTags['og:image:width'] || !foundTags['og:image:height']) {
				warnings.push(
					'Consider adding og:image:width and og:image:height for better optimization'
				)
			}

			if (foundTags['og:title'] && foundTags['og:title'].length > 60) {
				warnings.push('og:title is longer than recommended 60 characters')
			}

			if (
				foundTags['og:description'] &&
				foundTags['og:description'].length > 160
			) {
				warnings.push(
					'og:description is longer than recommended 160 characters'
				)
			}

			// Recommendations
			if (missingRecommended.length > 0) {
				recommendations.push(
					`Consider adding: ${missingRecommended.join(', ')}`
				)
			}

			const result: ValidationResult = {
				isValid: errors.length === 0,
				foundTags,
				missingTags,
				recommendations,
				errors,
				warnings
			}

			setValidationResult(result)
			setOgData(parsedOgData)
			widget.setResult(result)

			toast.success('Валидация завершена')
		} catch (error) {
			const errorMessage =
				error instanceof Error ? error.message : 'Validation failed'
			widget.setError(errorMessage)
			toast.error('Ошибка валидации')
		} finally {
			setIsValidating(false)
			widget.setLoading(false)
		}
	}, [widget])

	// Copy tag to clipboard
	const copyTag = useCallback(
		(property: string, content: string) => {
			const tag = `<meta property="${property}" content="${content}" />`
			widget.copyToClipboard(tag, 'Тег скопирован в буфер обмена')
		},
		[widget]
	)

	// Generate missing tags
	const generateMissingTags = useCallback(() => {
		if (!validationResult) return ''

		const missingTags = validationResult.missingTags
			.map(tag => {
				const placeholder = `your ${tag.replace('og:', '').replace(':', ' ')}`
				return `<meta property="${tag}" content="${placeholder}" />`
			})
			.join('\n')

		return missingTags
	}, [validationResult])

	// Social media preview components
	const FacebookPreview = ({ data }: { data: OpenGraphData }) => (
		<Card className='p-3'>
			<div className='space-y-2'>
				<div className='flex items-center gap-2'>
					<div className='w-4 h-4 rounded-sm bg-blue-600 flex items-center justify-center'>
						<span className='text-white text-[10px] font-bold'>f</span>
					</div>
					<span className='text-xs font-medium'>Facebook</span>
				</div>
				{data.image && (
					<div className='aspect-video bg-muted rounded overflow-hidden'>
						<Image
							src={data.image}
							alt={data.title || 'Preview'}
							width={300}
							height={150}
							className='w-full h-full object-cover'
							unoptimized
						/>
					</div>
				)}
				<div className='space-y-1'>
					<p className='text-[10px] text-muted-foreground truncate'>
						{data.url}
					</p>
					<h3 className='font-semibold text-xs line-clamp-2'>{data.title}</h3>
					<p className='text-[10px] text-muted-foreground line-clamp-2'>
						{data.description}
					</p>
				</div>
			</div>
		</Card>
	)

	const TwitterPreview = ({ data }: { data: OpenGraphData }) => (
		<Card className='p-3'>
			<div className='space-y-2'>
				<div className='flex items-center gap-2'>
					<div className='w-4 h-4 rounded-full bg-black flex items-center justify-center'>
						<span className='text-white text-[10px] font-bold'>𝕏</span>
					</div>
					<span className='text-xs font-medium'>Twitter</span>
				</div>
				<div className='border rounded-lg overflow-hidden'>
					{data.image && (
						<div className='aspect-video bg-muted'>
							<Image
								src={data.image}
								alt={data.title || 'Preview'}
								width={300}
								height={150}
								className='w-full h-full object-cover'
								unoptimized
							/>
						</div>
					)}
					<div className='p-2 space-y-1'>
						<h3 className='font-semibold text-xs line-clamp-2'>{data.title}</h3>
						<p className='text-[10px] text-gray-600 dark:text-gray-400 line-clamp-2'>
							{data.description}
						</p>
						<p className='text-[10px] text-gray-400 truncate'>{data.url}</p>
					</div>
				</div>
			</div>
		</Card>
	)

	const LinkedInPreview = ({ data }: { data: OpenGraphData }) => (
		<Card className='p-3'>
			<div className='space-y-2'>
				<div className='flex items-center gap-2'>
					<div className='w-4 h-4 rounded-sm bg-blue-700 flex items-center justify-center'>
						<span className='text-white text-[10px] font-bold'>in</span>
					</div>
					<span className='text-xs font-medium'>LinkedIn</span>
				</div>
				<div className='border rounded overflow-hidden'>
					{data.image && (
						<div className='aspect-video bg-muted'>
							<Image
								src={data.image}
								alt={data.title || 'Preview'}
								width={300}
								height={150}
								className='w-full h-full object-cover'
								unoptimized
							/>
						</div>
					)}
					<div className='p-2 space-y-1 bg-white dark:bg-gray-900'>
						<h3 className='font-semibold text-xs line-clamp-2'>{data.title}</h3>
						<p className='text-[10px] text-gray-600 dark:text-gray-400 line-clamp-2'>
							{data.description}
						</p>
						<p className='text-[10px] text-gray-400 truncate'>{data.url}</p>
					</div>
				</div>
			</div>
		</Card>
	)

	const TelegramPreview = ({ data }: { data: OpenGraphData }) => (
		<Card className='p-3'>
			<div className='space-y-2'>
				<div className='flex items-center gap-2'>
					<svg className='w-4 h-4' viewBox='0 0 24 24' fill='none'>
						<path
							d='M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z'
							fill='#2AABEE'
						/>
					</svg>
					<span className='text-xs font-medium'>Telegram</span>
				</div>
				<div className='rounded-lg overflow-hidden bg-[#f5f5f5] dark:bg-gray-800'>
					<div className='flex'>
						{data.image && (
							<div className='w-20 h-20 bg-muted flex-shrink-0'>
								<Image
									src={data.image}
									alt={data.title || 'Preview'}
									width={80}
									height={80}
									className='w-full h-full object-cover'
									unoptimized
								/>
							</div>
						)}
						<div className='flex-1 p-2 space-y-0.5'>
							<h3 className='font-semibold text-xs line-clamp-1'>
								{data.title}
							</h3>
							<p className='text-[10px] text-gray-600 dark:text-gray-400 line-clamp-2'>
								{data.description}
							</p>
							<p className='text-[10px] text-blue-500'>
								{data.siteName ||
									(data.url ? new URL(data.url).hostname : 'example.com')}
							</p>
						</div>
					</div>
				</div>
			</div>
		</Card>
	)

	const WhatsAppPreview = ({ data }: { data: OpenGraphData }) => (
		<Card className='p-3'>
			<div className='space-y-2'>
				<div className='flex items-center gap-2'>
					<div className='w-4 h-4 rounded-sm bg-[#25D366] flex items-center justify-center'>
						<svg className='w-3 h-3' viewBox='0 0 24 24' fill='white'>
							<path d='M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z' />
						</svg>
					</div>
					<span className='text-xs font-medium'>WhatsApp</span>
				</div>
				<div className='border rounded-lg overflow-hidden'>
					{data.image && (
						<div className='aspect-video bg-muted'>
							<Image
								src={data.image}
								alt={data.title || 'Preview'}
								width={300}
								height={150}
								className='w-full h-full object-cover'
								unoptimized
							/>
						</div>
					)}
					<div className='p-2 space-y-0.5'>
						<p className='text-[10px] text-gray-500 dark:text-gray-400 uppercase'>
							{data.siteName ||
								(data.url ? new URL(data.url).hostname : 'example.com')}
						</p>
						<h3 className='font-semibold text-xs line-clamp-2'>{data.title}</h3>
						<p className='text-[10px] text-gray-600 dark:text-gray-400 line-clamp-2'>
							{data.description}
						</p>
					</div>
				</div>
			</div>
		</Card>
	)

	// Keyboard shortcuts
	useEffect(() => {
		const handleKeyPress = (e: KeyboardEvent) => {
			if ((e.ctrlKey || e.metaKey) && e.key === 'Enter' && !widget.isLoading) {
				e.preventDefault()
				validateUrl()
			}
		}

		window.addEventListener('keydown', handleKeyPress)
		return () => window.removeEventListener('keydown', handleKeyPress)
	}, [validateUrl, widget])

	return (
		<div className='space-y-4'>
			{/* URL Input Section */}
			<Card className='p-4'>
				<div className='flex flex-col lg:flex-row gap-6'>
					<div className='flex-1'>
						<Label htmlFor='url' className='text-sm font-medium'>
							{'URL для проверки'}
						</Label>
						<div className='flex flex-col sm:flex-row gap-2 mt-2'>
							<Input
								id='url'
								type='url'
								value={widget.inputs.url}
								onChange={e => widget.updateInput('url', e.target.value)}
								placeholder={'https://example.com'}
								disabled={widget.isLoading}
								className='flex-1 max-w-md'
							/>
							<Button
								onClick={validateUrl}
								disabled={widget.isLoading || !widget.inputs.url}
								className='w-full sm:w-auto'
							>
								{isValidating ? (
									<>
										<Globe className='w-4 h-4 mr-2 animate-spin' />
										{'Проверка...'}
									</>
								) : (
									<>
										<Globe className='w-4 h-4 mr-2' />
										{'Проверить'}
									</>
								)}
							</Button>
						</div>
					</div>

					{/* Quick URL buttons */}
					<div>
						<Label className='text-sm font-medium'>Примеры</Label>
						<div className='flex flex-wrap gap-2 mt-2'>
							<Button
								onClick={() =>
									widget.updateInput('url', 'https://pixeltool.pro')
								}
								variant='outline'
							>
								<svg className='w-4 h-4 mr-2' viewBox='0 0 300 300' fill='none'>
									<rect x='0' y='0' width='100' height='100' fill='#E84330' />
									<rect x='100' y='0' width='100' height='100' fill='#FD850F' />
									<rect x='200' y='0' width='100' height='100' fill='#FFCD00' />
									<rect x='0' y='100' width='100' height='100' fill='#FD850F' />
									<rect
										x='100'
										y='100'
										width='100'
										height='100'
										fill='#FFCD00'
									/>
									<rect
										x='200'
										y='100'
										width='100'
										height='100'
										fill='#70C727'
									/>
									<rect x='0' y='200' width='100' height='100' fill='#FFCD00' />
									<rect
										x='100'
										y='200'
										width='100'
										height='100'
										fill='#70C727'
									/>
									<rect
										x='200'
										y='200'
										width='100'
										height='100'
										fill='#2D96D7'
									/>
								</svg>
								PixelTool
							</Button>
							<Button
								onClick={() => widget.updateInput('url', 'https://github.com')}
								variant='outline'
							>
								<svg
									className='w-4 h-4 mr-2'
									viewBox='0 0 24 24'
									fill='currentColor'
								>
									<path d='M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12' />
								</svg>
								GitHub
							</Button>
							<Button
								onClick={() => widget.updateInput('url', 'https://nextjs.org')}
								variant='outline'
							>
								<svg
									className='w-4 h-4 mr-2'
									viewBox='0 0 24 24'
									fill='currentColor'
								>
									<path d='M11.5725 0c-.1763 0-.3098.0013-.3584.0067-.0516.0053-.2159.021-.3636.0328-3.4088.3073-6.6017 2.1463-8.624 4.9728C1.1004 6.584.3802 8.3666.1082 10.255c-.0962.659-.108.8537-.108 1.7474s.012 1.0884.108 1.7476c.652 4.506 3.8591 8.2919 8.2087 9.6945.7789.2511 1.6.4223 2.5337.5255.3636.04 1.9354.04 2.299 0 1.6117-.1783 2.9772-.577 4.3237-1.2643.2065-.1056.2464-.1337.2183-.1573-.0188-.0139-.8987-1.1938-1.9543-2.62l-1.919-2.592-2.4047-3.5583c-1.3231-1.9564-2.4117-3.556-2.4211-3.556-.0094-.0026-.0187 1.5787-.0235 3.509-.0067 3.3802-.0093 3.5162-.0516 3.596-.061.115-.108.1618-.2064.2134-.075.0374-.1408.0445-.495.0445h-.406l-.1078-.068a.4383.4383 0 01-.1572-.1712l-.0493-.1056.0053-4.703.0067-4.7054.0726-.0915c.0376-.0493.1174-.1125.1736-.143.0962-.047.1338-.0517.5396-.0517.4787 0 .5584.0187.6827.1547.0353.0377 1.3373 1.9987 2.895 4.3608a10760.433 10760.433 0 004.7344 7.1706l1.9002 2.8782.096-.0633c.8518-.5536 1.7525-1.3418 2.4657-2.1627 1.5179-1.7429 2.4963-3.868 2.8247-6.134.0961-.6591.1078-.854.1078-1.7475 0-.8937-.012-1.0884-.1078-1.7476-.6522-4.506-3.8592-8.2919-8.2087-9.6945-.7672-.2487-1.5836-.42-2.4985-.5232-.169-.0176-1.0835-.0366-1.6123-.037zm4.0685 7.217c.3473 0 .4082.0053.4857.047.1127.0562.204.1642.237.2767.0186.061.0234 1.3653.0186 4.3044l-.0067 4.2175-.7436-1.14-.7461-1.14v-3.066c0-1.982.0093-3.0963.0234-3.1502.0375-.1313.1196-.2346.2323-.2955.0961-.0494.1313-.054.4997-.054z' />
								</svg>
								Next.js
							</Button>
						</div>
					</div>
				</div>
			</Card>

			{/* Social Media Previews */}
			{ogData && (
				<div className='space-y-3'>
					<h3 className='font-semibold text-sm'>
						{'Превью в социальных сетях'}
					</h3>
					<div className='w-full'>
						<TelegramPreview data={ogData} />
					</div>
					<div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3'>
						<FacebookPreview data={ogData} />
						<TwitterPreview data={ogData} />
						<LinkedInPreview data={ogData} />
						<WhatsAppPreview data={ogData} />
					</div>
				</div>
			)}

			{/* Missing Tags Generator */}
			{validationResult && validationResult.missingTags.length > 0 && (
				<Card className='p-4'>
					<div className='space-y-3'>
						<h3 className='font-semibold text-sm'>
							{'Генератор недостающих тегов'}
						</h3>
						<p className='text-xs text-muted-foreground'>
							{'Добавьте эти теги в <head> вашей страницы'}
						</p>
						<div className='bg-muted p-3 rounded-lg font-mono text-xs overflow-x-auto'>
							<pre>{generateMissingTags()}</pre>
						</div>
						<Button
							onClick={() =>
								widget.copyToClipboard(
									generateMissingTags(),
									'Теги скопированы в буфер обмена'
								)
							}
							variant='outline'
							size='sm'
							className='w-full sm:w-auto'
						>
							<Copy className='w-4 h-4 mr-2' />
							{'Копировать теги'}
						</Button>
					</div>
				</Card>
			)}

			{/* Validation Results */}
			{validationResult && (
				<div className='space-y-4'>
					{/* Status with inline errors/warnings */}
					<Alert
						className={
							validationResult.isValid
								? 'border-green-200 bg-green-50'
								: 'border-red-200 bg-red-50'
						}
					>
						{validationResult.isValid ? (
							<CheckCircle className='h-4 w-4 text-green-600' />
						) : (
							<AlertCircle className='h-4 w-4 text-red-600' />
						)}
						<AlertDescription>
							<div
								className={
									validationResult.isValid ? 'text-green-800' : 'text-red-800'
								}
							>
								{validationResult.isValid
									? 'Все Open Graph теги корректны!'
									: 'Обнаружены проблемы с Open Graph тегами'}
							</div>
							{validationResult.errors.length > 0 && (
								<div className='mt-2 text-sm'>
									{validationResult.errors.map((error, index) => (
										<div key={index}>{error}</div>
									))}
								</div>
							)}
							{validationResult.warnings.length > 0 && (
								<div className='mt-2 text-sm text-yellow-700'>
									{validationResult.warnings.map((warning, index) => (
										<div key={index}>{warning}</div>
									))}
								</div>
							)}
							{validationResult.recommendations.length > 0 && (
								<div className='mt-2 text-sm text-blue-700'>
									{validationResult.recommendations.map((rec, index) => (
										<div key={index}>{rec}</div>
									))}
								</div>
							)}
						</AlertDescription>
					</Alert>

					{/* Found Tags - Compact Version */}
					{Object.keys(validationResult.foundTags).length > 0 && (
						<Card className='p-3'>
							<h3 className='font-semibold text-sm mb-2'>{'Найденные теги'}</h3>
							<div className='grid grid-cols-1 md:grid-cols-2 gap-1.5'>
								{Object.entries(validationResult.foundTags).map(
									([property, content]) => (
										<div
											key={property}
											className='flex items-center gap-2 p-1.5 bg-muted/50 rounded text-xs'
										>
											<code className='bg-background px-1.5 py-0.5 rounded text-[10px] flex-shrink-0'>
												{property}
											</code>
											<span className='truncate flex-1' title={content}>
												{content}
											</span>
											<Button
												onClick={() => copyTag(property, content)}
												variant='ghost'
												size='sm'
												className='h-6 w-6 p-0'
											>
												<Copy className='w-3 h-3' />
											</Button>
										</div>
									)
								)}
							</div>
						</Card>
					)}
				</div>
			)}

			{/* Error Display */}
			{widget.error && (
				<Alert className='border-red-200 bg-red-50'>
					<AlertCircle className='h-4 w-4 text-red-600' />
					<AlertDescription className='text-red-800'>
						{widget.error}
					</AlertDescription>
				</Alert>
			)}

			{/* Info */}
			<Card className='p-4 bg-muted/50'>
				<div className='flex gap-3'>
					<Globe className='w-5 h-5 text-muted-foreground shrink-0 mt-0.5' />
					<div className='space-y-2 text-sm text-muted-foreground'>
						<div className='font-semibold text-foreground'>
							{'Что такое Open Graph?'}
						</div>
						<ul className='space-y-1'>
							<li>
								•{' '}
								{
									'Open Graph - это протокол для создания превью ссылок в социальных сетях'
								}
							</li>
							<li>
								•{' '}
								{
									'Помогает контролировать, как ваша страница выглядит при репосте'
								}
							</li>
							<li>
								•{' '}
								{
									'Используется Facebook, Twitter, LinkedIn, Telegram и другими платформами'
								}
							</li>
						</ul>

						<div className='mt-3 p-3 bg-background rounded-lg border'>
							<div className='font-semibold text-foreground mb-1'>
								{'Совет'}
							</div>
							<p>
								{
									'Используйте изображения размером 1200x630 пикселей для оптимального отображения в социальных сетях. Убедитесь, что все изображения доступны по HTTPS.'
								}
							</p>
						</div>
					</div>
				</div>
			</Card>
		</div>
	)
}
