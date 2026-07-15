'use client'

import { useState, useCallback, useEffect } from 'react'
import { OpenGraphSeo } from './OpenGraphSeo'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { useWidgetCreation } from '@/lib/hooks/widgets/useWidgetCreation'
import { Globe, CheckCircle, AlertCircle, Copy, Loader2 } from 'lucide-react'
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

// Разбирает набор тегов в результат валидации и данные для превью.
// Используется и для реальной проверки по API, и для готовых примеров.
function buildValidation(
	url: string,
	ogTags: Record<string, string>,
	twitterTags: Record<string, string>
): { result: ValidationResult; ogData: OpenGraphData } {
	const ogData: OpenGraphData = {
		title: ogTags['og:title'],
		description: ogTags['og:description'],
		image: ogTags['og:image'],
		// Нет og:url — берём введённый адрес, чтобы в превью был реальный домен
		url: ogTags['og:url'] || url,
		type: ogTags['og:type'],
		siteName: ogTags['og:site_name'],
		locale: ogTags['og:locale']
	}

	const foundTags: Record<string, string> = { ...ogTags, ...twitterTags }
	const missingTags = REQUIRED_OG_TAGS.filter(tag => !foundTags[tag])
	const missingRecommended = RECOMMENDED_OG_TAGS.filter(tag => !foundTags[tag])

	const errors: string[] = []
	const warnings: string[] = []
	const recommendations: string[] = []

	if (missingTags.length > 0) {
		errors.push(`Отсутствуют обязательные теги: ${missingTags.join(', ')}`)
	}

	if (foundTags['og:image']) {
		try {
			new URL(foundTags['og:image'], url || undefined)
		} catch {
			errors.push('og:image содержит некорректный URL')
		}
	}

	if (!foundTags['og:image:width'] || !foundTags['og:image:height']) {
		warnings.push(
			'Добавьте og:image:width и og:image:height для корректного превью'
		)
	}

	if (foundTags['og:title'] && foundTags['og:title'].length > 60) {
		warnings.push('og:title длиннее рекомендуемых 60 символов')
	}

	if (foundTags['og:description'] && foundTags['og:description'].length > 160) {
		warnings.push('og:description длиннее рекомендуемых 160 символов')
	}

	if (missingRecommended.length > 0) {
		recommendations.push(`Стоит добавить: ${missingRecommended.join(', ')}`)
	}

	const result: ValidationResult = {
		isValid: errors.length === 0,
		foundTags,
		missingTags,
		recommendations,
		errors,
		warnings
	}

	return { result, ogData }
}

// Домен для превью: из og:url (или введённого адреса), без www.
function getHost(data: OpenGraphData): string {
	if (data.url) {
		try {
			return new URL(data.url).hostname.replace(/^www\./, '')
		} catch {
			// невалидный URL — падать на fallback ниже
		}
	}
	return data.siteName || ''
}

// Force dynamic rendering to avoid build-time errors
export const dynamic = 'force-dynamic'

export default function OpenGraphValidatorPage() {
	const widget = useWidgetCreation({
		widgetId: WIDGET_CONFIG.id,
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

	// Дёргает прод-API, парсит теги и показывает результат для конкретного URL.
	const runValidation = useCallback(
		async (url: string) => {
			setIsValidating(true)
			widget.setLoading(true)
			widget.setError(null)

			try {
				const response = await fetch(
					`/api/opengraph-validator?url=${encodeURIComponent(url)}`
				)

				if (!response.ok) {
					throw new Error('Не удалось загрузить данные страницы')
				}

				const data = await response.json()
				const { ogTags = {}, twitterTags = {} } = data

				const { result, ogData: parsedOgData } = buildValidation(
					url,
					ogTags,
					twitterTags
				)

				setValidationResult(result)
				setOgData(parsedOgData)
				widget.setResult(result)

				toast.success('Валидация завершена')
			} catch (error) {
				const errorMessage =
					error instanceof Error
						? error.message
						: 'Не удалось выполнить проверку'
				widget.setError(errorMessage)
				toast.error('Ошибка валидации')
			} finally {
				setIsValidating(false)
				widget.setLoading(false)
			}
		},
		[widget]
	)

	// Кнопка «Проверить»: валидирует поле и запускает проверку введённого URL.
	const validateUrl = useCallback(() => {
		if (!widget.validateAllInputs()) return
		runValidation(widget.inputs.url)
	}, [widget, runValidation])

	// Кнопка-пример: подставляет URL и сразу гонит его через реальный фетч.
	const loadExample = useCallback(
		(url: string) => {
			widget.updateInput('url', url)
			runValidation(url)
		},
		[widget, runValidation]
	)

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
				const placeholder = `значение ${tag}`
				return `<meta property="${tag}" content="${placeholder}" />`
			})
			.join('\n')

		return missingTags
	}, [validationResult])

	// Мокапы превью повторяют реальную вёрстку карточек в каждой соцсети:
	// расположение картинки, домена и текста берётся с настоящих превью.

	// Facebook: крупная картинка, под ней серая плашка — домен КАПСОМ, заголовок,
	// одна строка описания.
	const FacebookPreview = ({ data }: { data: OpenGraphData }) => (
		<Card className='p-3'>
			<div className='space-y-2'>
				<div className='flex items-center gap-2'>
					<div className='flex h-4 w-4 items-center justify-center rounded-sm bg-blue-600'>
						<span className='text-[10px] font-bold text-white'>f</span>
					</div>
					<span className='text-xs font-medium'>Facebook</span>
				</div>
				<div className='overflow-hidden rounded-lg border'>
					{data.image && (
						<div className='aspect-video bg-muted'>
							<Image
								src={data.image}
								alt={data.title || 'Превью'}
								width={300}
								height={157}
								className='h-full w-full object-cover'
								unoptimized
							/>
						</div>
					)}
					<div className='bg-muted/60 px-3 py-2'>
						<p className='truncate text-[10px] uppercase tracking-wide text-muted-foreground'>
							{getHost(data)}
						</p>
						<h3 className='mt-0.5 line-clamp-2 text-xs font-semibold'>
							{data.title}
						</h3>
						<p className='mt-0.5 line-clamp-1 text-[10px] text-muted-foreground'>
							{data.description}
						</p>
					</div>
				</div>
			</div>
		</Card>
	)

	// X (Twitter): большая картинка, под ней домен серым и заголовок жирным.
	const TwitterPreview = ({ data }: { data: OpenGraphData }) => (
		<Card className='p-3'>
			<div className='space-y-2'>
				<div className='flex items-center gap-2'>
					<div className='flex h-4 w-4 items-center justify-center rounded-full bg-black'>
						<span className='text-[10px] font-bold text-white'>𝕏</span>
					</div>
					<span className='text-xs font-medium'>Twitter</span>
				</div>
				<div className='overflow-hidden rounded-2xl border'>
					{data.image && (
						<div className='aspect-video bg-muted'>
							<Image
								src={data.image}
								alt={data.title || 'Превью'}
								width={300}
								height={157}
								className='h-full w-full object-cover'
								unoptimized
							/>
						</div>
					)}
					<div className='px-3 py-2'>
						<p className='truncate text-[10px] text-muted-foreground'>
							{getHost(data)}
						</p>
						<h3 className='mt-0.5 line-clamp-2 text-xs font-semibold'>
							{data.title}
						</h3>
					</div>
				</div>
			</div>
		</Card>
	)

	// Telegram: слева синяя акцентная полоса, сверху имя сайта синим, заголовок,
	// описание и крупная картинка снизу.
	const TelegramPreview = ({ data }: { data: OpenGraphData }) => (
		<Card className='p-3'>
			<div className='space-y-2'>
				<div className='flex items-center gap-2'>
					<svg className='h-4 w-4' viewBox='0 0 24 24' fill='none'>
						<path
							d='M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z'
							fill='#2AABEE'
						/>
					</svg>
					<span className='text-xs font-medium'>Telegram</span>
				</div>
				<div className='border-l-[3px] border-[#3390ec] pl-3'>
					<p className='line-clamp-1 text-xs font-semibold text-[#3390ec]'>
						{data.siteName || getHost(data)}
					</p>
					<h3 className='mt-0.5 line-clamp-2 text-xs font-semibold'>
						{data.title}
					</h3>
					<p className='mt-0.5 line-clamp-3 text-[11px] text-muted-foreground'>
						{data.description}
					</p>
					{data.image && (
						<div className='mt-2 aspect-video overflow-hidden rounded-lg bg-muted'>
							<Image
								src={data.image}
								alt={data.title || 'Превью'}
								width={300}
								height={157}
								className='h-full w-full object-cover'
								unoptimized
							/>
						</div>
					)}
				</div>
			</div>
		</Card>
	)

	// WhatsApp: картинка сверху, под ней заголовок жирным, описание и домен
	// снизу серым мелким.
	const WhatsAppPreview = ({ data }: { data: OpenGraphData }) => (
		<Card className='p-3'>
			<div className='space-y-2'>
				<div className='flex items-center gap-2'>
					<div className='flex h-4 w-4 items-center justify-center rounded-sm bg-[#25D366]'>
						<svg className='h-3 w-3' viewBox='0 0 24 24' fill='white'>
							<path d='M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z' />
						</svg>
					</div>
					<span className='text-xs font-medium'>WhatsApp</span>
				</div>
				<div className='overflow-hidden rounded-lg border'>
					{data.image && (
						<div className='aspect-video bg-muted'>
							<Image
								src={data.image}
								alt={data.title || 'Превью'}
								width={300}
								height={157}
								className='h-full w-full object-cover'
								unoptimized
							/>
						</div>
					)}
					<div className='px-3 py-2'>
						<h3 className='line-clamp-2 text-xs font-semibold'>{data.title}</h3>
						<p className='mt-0.5 line-clamp-2 text-[10px] text-muted-foreground'>
							{data.description}
						</p>
						<p className='mt-1 truncate text-[10px] text-muted-foreground'>
							{getHost(data)}
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
		<>
			<Card className='space-y-6 p-4 sm:p-6'>
				{/* Ввод URL и примеры */}
				<div>
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
									className='h-10 flex-1 max-w-md'
								/>
								<Button
									onClick={validateUrl}
									disabled={widget.isLoading || !widget.inputs.url}
									className='w-full sm:w-auto'
								>
									{isValidating ? (
										<>
											<Loader2 className='w-4 h-4 mr-2 animate-spin' />
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
									onClick={() => loadExample('https://pixeltool.pro')}
									variant='outline'
								>
									<svg
										className='w-4 h-4 mr-2'
										viewBox='0 0 300 300'
										fill='none'
									>
										<rect x='0' y='0' width='100' height='100' fill='#E84330' />
										<rect
											x='100'
											y='0'
											width='100'
											height='100'
											fill='#FD850F'
										/>
										<rect
											x='200'
											y='0'
											width='100'
											height='100'
											fill='#FFCD00'
										/>
										<rect
											x='0'
											y='100'
											width='100'
											height='100'
											fill='#FD850F'
										/>
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
										<rect
											x='0'
											y='200'
											width='100'
											height='100'
											fill='#FFCD00'
										/>
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
									onClick={() => loadExample('https://tailwindcss.com')}
									variant='outline'
								>
									<svg
										className='w-4 h-4 mr-2'
										viewBox='0 0 24 24'
										fill='#38BDF8'
									>
										<path d='M12.001 4.8c-3.2 0-5.2 1.6-6 4.8 1.2-1.6 2.6-2.2 4.2-1.8.913.228 1.565.89 2.288 1.624C13.666 10.618 15.027 12 18.001 12c3.2 0 5.2-1.6 6-4.8-1.2 1.6-2.6 2.2-4.2 1.8-.913-.228-1.565-.89-2.288-1.624C16.337 6.182 14.976 4.8 12.001 4.8zm-6 7.2c-3.2 0-5.2 1.6-6 4.8 1.2-1.6 2.6-2.2 4.2-1.8.913.228 1.565.89 2.288 1.624 1.177 1.194 2.538 2.576 5.512 2.576 3.2 0 5.2-1.6 6-4.8-1.2 1.6-2.6 2.2-4.2 1.8-.913-.228-1.565-.89-2.288-1.624C10.337 13.382 8.976 12 6.001 12z' />
									</svg>
									Tailwind CSS
								</Button>
								<Button
									onClick={() => loadExample('https://nodejs.org')}
									variant='outline'
								>
									<svg
										className='w-4 h-4 mr-2'
										viewBox='0 0 24 24'
										fill='#339933'
									>
										<path d='M11.998,24c-0.321,0-0.641-0.084-0.922-0.247l-2.936-1.737c-0.438-0.245-0.224-0.332-0.08-0.383c0.585-0.203,0.703-0.25,1.328-0.604c0.065-0.037,0.151-0.023,0.218,0.017l2.256,1.339c0.082,0.045,0.197,0.045,0.272,0l8.795-5.076c0.082-0.047,0.134-0.141,0.134-0.238V6.921c0-0.099-0.053-0.192-0.137-0.242l-8.791-5.072c-0.081-0.047-0.189-0.047-0.271,0L3.075,6.68C2.99,6.729,2.936,6.825,2.936,6.921v10.15c0,0.097,0.054,0.189,0.139,0.235l2.409,1.392c1.307,0.654,2.108-0.116,2.108-0.89V7.787c0-0.142,0.114-0.253,0.256-0.253h1.115c0.139,0,0.255,0.112,0.255,0.253v10.021c0,1.745-0.95,2.745-2.604,2.745c-0.508,0-0.909,0-2.026-0.551L2.28,18.675c-0.57-0.329-0.922-0.945-0.922-1.604V6.921c0-0.659,0.353-1.275,0.922-1.603l8.795-5.082c0.557-0.315,1.296-0.315,1.848,0l8.794,5.082c0.57,0.329,0.924,0.944,0.924,1.603v10.15c0,0.659-0.354,1.273-0.924,1.604l-8.794,5.078C12.643,23.916,12.324,24,11.998,24z M19.099,13.993c0-1.9-1.284-2.406-3.987-2.763c-2.731-0.361-3.009-0.548-3.009-1.187c0-0.528,0.235-1.233,2.258-1.233c1.807,0,2.473,0.389,2.747,1.607c0.024,0.115,0.129,0.199,0.247,0.199h1.141c0.071,0,0.138-0.031,0.186-0.081c0.048-0.054,0.074-0.123,0.067-0.196c-0.177-2.098-1.571-3.076-4.388-3.076c-2.508,0-4.004,1.058-4.004,2.833c0,1.925,1.488,2.457,3.895,2.695c2.88,0.282,3.103,0.703,3.103,1.269c0,0.983-0.789,1.402-2.642,1.402c-2.328,0-2.84-0.584-3.012-1.742c-0.02-0.124-0.126-0.215-0.253-0.215h-1.137c-0.141,0-0.254,0.112-0.254,0.253c0,1.482,0.806,3.248,4.657,3.248C17.766,17.007,19.099,15.91,19.099,13.993z' />
									</svg>
									Node.js
								</Button>
							</div>
						</div>
					</div>
				</div>

				{/* Превью в социальных сетях */}
				{ogData && (
					<div className='space-y-3'>
						<h3 className='font-semibold text-sm'>
							{'Превью в социальных сетях'}
						</h3>
						<div className='grid grid-cols-1 items-start gap-3 sm:grid-cols-2'>
							<TelegramPreview data={ogData} />
							<FacebookPreview data={ogData} />
							<TwitterPreview data={ogData} />
							<WhatsAppPreview data={ogData} />
						</div>
					</div>
				)}

				{/* Генератор недостающих тегов */}
				{validationResult && validationResult.missingTags.length > 0 && (
					<div className='rounded-lg border p-4'>
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
					</div>
				)}

				{/* Результаты проверки */}
				{validationResult && (
					<div className='space-y-4'>
						{/* Status with inline errors/warnings */}
						<Alert
							className={
								validationResult.isValid
									? 'border-green-200 bg-green-50 dark:border-green-900/50 dark:bg-green-950/40'
									: 'border-red-200 bg-red-50 dark:border-red-900/50 dark:bg-red-950/40'
							}
						>
							{validationResult.isValid ? (
								<CheckCircle className='h-4 w-4 text-green-600 dark:text-green-400' />
							) : (
								<AlertCircle className='h-4 w-4 text-red-600 dark:text-red-400' />
							)}
							<AlertDescription>
								<div
									className={
										validationResult.isValid
											? 'text-green-800 dark:text-green-300'
											: 'text-red-800 dark:text-red-300'
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
									<div className='mt-2 text-sm text-yellow-700 dark:text-yellow-400'>
										{validationResult.warnings.map((warning, index) => (
											<div key={index}>{warning}</div>
										))}
									</div>
								)}
								{validationResult.recommendations.length > 0 && (
									<div className='mt-2 text-sm text-blue-700 dark:text-blue-400'>
										{validationResult.recommendations.map((rec, index) => (
											<div key={index}>{rec}</div>
										))}
									</div>
								)}
							</AlertDescription>
						</Alert>

						{/* Found Tags - Compact Version */}
						{Object.keys(validationResult.foundTags).length > 0 && (
							<div className='rounded-lg border p-3'>
								<h3 className='font-semibold text-sm mb-2'>
									{'Найденные теги'}
								</h3>
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
							</div>
						)}
					</div>
				)}

				{/* Ошибка */}
				{widget.error && (
					<Alert className='border-red-200 bg-red-50 dark:border-red-900/50 dark:bg-red-950/40'>
						<AlertCircle className='h-4 w-4 text-red-600 dark:text-red-400' />
						<AlertDescription className='text-red-800 dark:text-red-300'>
							{widget.error}
						</AlertDescription>
					</Alert>
				)}

				{/* Что такое Open Graph */}
				<div className='rounded-lg border bg-muted/50 p-4'>
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
				</div>
			</Card>
			<OpenGraphSeo />
		</>
	)
}
