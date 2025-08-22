'use client'

import { useTranslations } from 'next-intl'
import { useState, useCallback, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { useWidgetCreation } from '@/lib/hooks/widgets/useWidgetCreation'
import {
	Globe,
	CheckCircle,
	AlertCircle,
	Copy,
	ExternalLink,
	MessageSquare,
	Share2
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

export default function OpenGraphValidatorPage() {
	const t = useTranslations('widgets.openGraphValidator')

	const widget = useWidgetCreation({
		widgetId: WIDGET_CONFIG.id,
		enableKeyboard: true,
		enableAnalytics: true,
		enableFavorites: true,
		defaultState: {
			inputs: {
				url: ''
			},
			custom: {
				activeTab: 'validator'
			}
		},
		validationRules: {
			url: value => {
				if (!value || value.trim().length === 0) {
					return t('validation.urlRequired')
				}
				try {
					new URL(value)
					return true
				} catch {
					return t('validation.invalidUrl')
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
			const { ogTags, twitterTags, htmlData } = data

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

			toast.success(t('toast.validated'))
		} catch (error) {
			const errorMessage =
				error instanceof Error ? error.message : 'Validation failed'
			widget.setError(errorMessage)
			toast.error(t('toast.error'))
		} finally {
			setIsValidating(false)
			widget.setLoading(false)
		}
	}, [widget, t])

	// Copy tag to clipboard
	const copyTag = useCallback(
		(property: string, content: string) => {
			const tag = `<meta property="${property}" content="${content}" />`
			widget.copyToClipboard(tag, t('toast.tagCopied'))
		},
		[widget, t]
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
		<Card className='p-4 max-w-md'>
			<div className='space-y-3'>
				<div className='flex items-center gap-2'>
					<div className='w-5 h-5 rounded-sm bg-blue-600 flex items-center justify-center'>
						<span className='text-white text-xs font-bold'>f</span>
					</div>
					<span className='text-sm font-medium'>Facebook</span>
				</div>
				{data.image && (
					<div className='aspect-video bg-muted rounded overflow-hidden'>
						<Image
							src={data.image}
							alt={data.title || 'Preview'}
							width={400}
							height={200}
							className='w-full h-full object-cover'
							unoptimized
						/>
					</div>
				)}
				<div className='space-y-1'>
					<p className='text-xs text-muted-foreground'>{data.url}</p>
					<h3 className='font-semibold text-sm line-clamp-2'>{data.title}</h3>
					<p className='text-xs text-muted-foreground line-clamp-2'>
						{data.description}
					</p>
				</div>
			</div>
		</Card>
	)

	const TwitterPreview = ({ data }: { data: OpenGraphData }) => (
		<Card className='p-4 max-w-md border-gray-200'>
			<div className='space-y-3'>
				<div className='flex items-center gap-2'>
					<div className='w-5 h-5 rounded-full bg-blue-400 flex items-center justify-center'>
						<span className='text-white text-xs font-bold'>𝕏</span>
					</div>
					<span className='text-sm font-medium'>Twitter</span>
				</div>
				<div className='border rounded-lg overflow-hidden'>
					{data.image && (
						<div className='aspect-video bg-muted'>
							<Image
								src={data.image}
								alt={data.title || 'Preview'}
								width={400}
								height={200}
								className='w-full h-full object-cover'
								unoptimized
							/>
						</div>
					)}
					<div className='p-3 space-y-1'>
						<h3 className='font-semibold text-sm line-clamp-2'>{data.title}</h3>
						<p className='text-xs text-gray-600 line-clamp-2'>
							{data.description}
						</p>
						<p className='text-xs text-gray-400'>{data.url}</p>
					</div>
				</div>
			</div>
		</Card>
	)

	const LinkedInPreview = ({ data }: { data: OpenGraphData }) => (
		<Card className='p-4 max-w-md'>
			<div className='space-y-3'>
				<div className='flex items-center gap-2'>
					<div className='w-5 h-5 rounded-sm bg-blue-700 flex items-center justify-center'>
						<span className='text-white text-xs font-bold'>in</span>
					</div>
					<span className='text-sm font-medium'>LinkedIn</span>
				</div>
				<div className='border rounded overflow-hidden'>
					{data.image && (
						<div className='aspect-video bg-muted'>
							<Image
								src={data.image}
								alt={data.title || 'Preview'}
								width={400}
								height={200}
								className='w-full h-full object-cover'
								unoptimized
							/>
						</div>
					)}
					<div className='p-3 space-y-1 bg-white'>
						<h3 className='font-semibold text-sm line-clamp-2'>{data.title}</h3>
						<p className='text-xs text-gray-600 line-clamp-2'>
							{data.description}
						</p>
						<p className='text-xs text-gray-400'>{data.url}</p>
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
		<div className='space-y-6'>
			<Tabs
				value={widget.customState.activeTab}
				onValueChange={value => widget.updateCustomState('activeTab', value)}
				className='w-full'
			>
				<TabsList className='grid w-full grid-cols-3'>
					<TabsTrigger value='validator'>{t('tabs.validator')}</TabsTrigger>
					<TabsTrigger value='preview'>{t('tabs.preview')}</TabsTrigger>
					<TabsTrigger value='generator'>{t('tabs.generator')}</TabsTrigger>
				</TabsList>

				<TabsContent value='validator' className='space-y-4'>
					<Card className='p-4'>
						<div className='space-y-4'>
							{/* URL Input */}
							<div>
								<Label htmlFor='url'>{t('inputs.url')}</Label>
								<div className='flex gap-2'>
									<Input
										id='url'
										type='url'
										value={widget.inputs.url}
										onChange={e => widget.updateInput('url', e.target.value)}
										placeholder={t('inputs.urlPlaceholder')}
										disabled={widget.isLoading}
										className='flex-1'
									/>
									<Button
										onClick={validateUrl}
										disabled={widget.isLoading || !widget.inputs.url}
									>
										{isValidating ? (
											<>
												<Globe className='w-4 h-4 mr-2 animate-spin' />
												{t('actions.validating')}
											</>
										) : (
											<>
												<Globe className='w-4 h-4 mr-2' />
												{t('actions.validate')}
											</>
										)}
									</Button>
								</div>
							</div>

							{/* Quick URL buttons */}
							<div className='flex flex-wrap gap-2'>
								<Button
									onClick={() =>
										widget.updateInput('url', 'https://pixeltool.pro')
									}
									variant='outline'
									size='sm'
								>
									PixelTool
								</Button>
								<Button
									onClick={() =>
										widget.updateInput('url', 'https://github.com')
									}
									variant='outline'
									size='sm'
								>
									GitHub
								</Button>
								<Button
									onClick={() =>
										widget.updateInput('url', 'https://nextjs.org')
									}
									variant='outline'
									size='sm'
								>
									Next.js
								</Button>
							</div>
						</div>
					</Card>
				</TabsContent>

				<TabsContent value='preview' className='space-y-4'>
					{ogData ? (
						<div className='space-y-4'>
							<div className='grid gap-4 md:grid-cols-2 lg:grid-cols-3'>
								<FacebookPreview data={ogData} />
								<TwitterPreview data={ogData} />
								<LinkedInPreview data={ogData} />
							</div>
						</div>
					) : (
						<Card className='p-8 text-center'>
							<Globe className='w-12 h-12 mx-auto mb-4 text-muted-foreground' />
							<p className='text-muted-foreground'>{t('preview.noData')}</p>
						</Card>
					)}
				</TabsContent>

				<TabsContent value='generator' className='space-y-4'>
					<Card className='p-4'>
						<div className='space-y-4'>
							{validationResult && validationResult.missingTags.length > 0 ? (
								<div className='space-y-2'>
									<p className='text-sm text-muted-foreground'>
										{t('generator.missingDescription')}
									</p>
									<div className='bg-muted p-3 rounded-lg font-mono text-sm overflow-x-auto'>
										<pre>{generateMissingTags()}</pre>
									</div>
									<Button
										onClick={() =>
											widget.copyToClipboard(
												generateMissingTags(),
												t('toast.tagsCopied')
											)
										}
										variant='outline'
										size='sm'
									>
										<Copy className='w-4 h-4 mr-2' />
										{t('actions.copyTags')}
									</Button>
								</div>
							) : (
								<p className='text-muted-foreground'>
									{t('generator.noMissing')}
								</p>
							)}
						</div>
					</Card>
				</TabsContent>
			</Tabs>

			{/* Validation Results */}
			{validationResult && (
				<div className='space-y-4'>
					{/* Status */}
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
						<AlertDescription
							className={
								validationResult.isValid ? 'text-green-800' : 'text-red-800'
							}
						>
							{validationResult.isValid
								? t('results.valid')
								: t('results.invalid')}
						</AlertDescription>
					</Alert>

					{/* Found Tags */}
					{Object.keys(validationResult.foundTags).length > 0 && (
						<Card className='p-4'>
							<h3 className='font-semibold mb-3'>{t('results.foundTags')}</h3>
							<div className='space-y-2'>
								{Object.entries(validationResult.foundTags).map(
									([property, content]) => (
										<div
											key={property}
											className='flex items-start justify-between gap-2 p-2 bg-muted/50 rounded'
										>
											<div className='flex-1 min-w-0'>
												<code className='text-xs bg-background px-2 py-1 rounded'>
													{property}
												</code>
												<p className='text-sm mt-1 break-words'>{content}</p>
											</div>
											<Button
												onClick={() => copyTag(property, content)}
												variant='ghost'
												size='sm'
											>
												<Copy className='w-3 h-3' />
											</Button>
										</div>
									)
								)}
							</div>
						</Card>
					)}

					{/* Errors */}
					{validationResult.errors.length > 0 && (
						<Card className='p-4 border-red-200'>
							<h3 className='font-semibold text-red-800 mb-3'>
								{t('results.errors')}
							</h3>
							<ul className='space-y-1'>
								{validationResult.errors.map((error, index) => (
									<li
										key={index}
										className='text-sm text-red-700 flex items-start gap-2'
									>
										<AlertCircle className='w-4 h-4 mt-0.5 flex-shrink-0' />
										{error}
									</li>
								))}
							</ul>
						</Card>
					)}

					{/* Warnings */}
					{validationResult.warnings.length > 0 && (
						<Card className='p-4 border-yellow-200'>
							<h3 className='font-semibold text-yellow-800 mb-3'>
								{t('results.warnings')}
							</h3>
							<ul className='space-y-1'>
								{validationResult.warnings.map((warning, index) => (
									<li
										key={index}
										className='text-sm text-yellow-700 flex items-start gap-2'
									>
										<AlertCircle className='w-4 h-4 mt-0.5 flex-shrink-0' />
										{warning}
									</li>
								))}
							</ul>
						</Card>
					)}

					{/* Recommendations */}
					{validationResult.recommendations.length > 0 && (
						<Card className='p-4 border-blue-200'>
							<h3 className='font-semibold text-blue-800 mb-3'>
								{t('results.recommendations')}
							</h3>
							<ul className='space-y-1'>
								{validationResult.recommendations.map((rec, index) => (
									<li
										key={index}
										className='text-sm text-blue-700 flex items-start gap-2'
									>
										<CheckCircle className='w-4 h-4 mt-0.5 flex-shrink-0' />
										{rec}
									</li>
								))}
							</ul>
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
							{t('info.title')}
						</div>
						<ul className='space-y-1'>
							<li>• {t('info.point1')}</li>
							<li>• {t('info.point2')}</li>
							<li>• {t('info.point3')}</li>
						</ul>

						<div className='mt-3 p-3 bg-background rounded-lg border'>
							<div className='font-semibold text-foreground mb-1'>
								{t('info.proTip')}
							</div>
							<p>{t('info.proTipDescription')}</p>
						</div>
					</div>
				</div>
			</Card>
		</div>
	)
}
