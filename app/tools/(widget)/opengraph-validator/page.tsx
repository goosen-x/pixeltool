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
import { reportClientError } from '@/lib/utils/report-client-error'
import {
	Globe,
	CheckCircle,
	AlertCircle,
	AlertTriangle,
	Copy,
	ImageOff,
	Loader2
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

// Без протокола `new URL()` бросает исключение, а не молча его добавляет —
// без этой нормализации ввод вида "example.com" валился с «Введите
// корректный URL» вместо того, чтобы просто подставить https.
function normalizeUrl(value: string): string {
	const trimmed = value.trim()
	if (/^https?:\/\//i.test(trimmed)) return trimmed
	return `https://${trimmed}`
}

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

// Мокапы превью повторяют реальную вёрстку карточек в каждой соцсети:
// расположение картинки, домена и текста берётся с настоящих превью.
// Объявлены на уровне модуля (а не внутри страницы), иначе React считает
// их новым компонентом на каждый рендер и полностью перемонтирует карточки.

// Facebook: крупная картинка, под ней серая плашка — домен КАПСОМ, заголовок,
// одна строка описания.
function FacebookPreview({ data }: { data: OpenGraphData }) {
	return (
		<Card className='p-3'>
			<div className='space-y-2'>
				<div className='flex items-center gap-2'>
					<div className='flex h-4 w-4 items-center justify-center rounded-sm bg-blue-600'>
						<span className='text-[10px] font-bold text-white'>f</span>
					</div>
					<span className='text-xs font-medium'>Facebook</span>
				</div>
				<div className='overflow-hidden rounded-lg border'>
					{data.image ? (
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
					) : (
						<div className='flex aspect-video flex-col items-center justify-center gap-1 bg-muted text-muted-foreground'>
							<ImageOff className='h-5 w-5' />
							<span className='text-[10px]'>Нет изображения</span>
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
}

// X (Twitter): большая картинка, под ней домен серым и заголовок жирным.
function TwitterPreview({ data }: { data: OpenGraphData }) {
	return (
		<Card className='p-3'>
			<div className='space-y-2'>
				<div className='flex items-center gap-2'>
					<div className='flex h-4 w-4 items-center justify-center rounded-full bg-black'>
						<span className='text-[10px] font-bold text-white'>𝕏</span>
					</div>
					<span className='text-xs font-medium'>Twitter</span>
				</div>
				<div className='overflow-hidden rounded-2xl border'>
					{data.image ? (
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
					) : (
						<div className='flex aspect-video flex-col items-center justify-center gap-1 bg-muted text-muted-foreground'>
							<ImageOff className='h-5 w-5' />
							<span className='text-[10px]'>Нет изображения</span>
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
}

// Telegram: слева синяя акцентная полоса, сверху имя сайта синим, заголовок,
// описание и крупная картинка снизу.
function TelegramPreview({ data }: { data: OpenGraphData }) {
	return (
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
					{data.image ? (
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
					) : (
						<div className='mt-2 flex aspect-video flex-col items-center justify-center gap-1 rounded-lg bg-muted text-muted-foreground'>
							<ImageOff className='h-5 w-5' />
							<span className='text-[10px]'>Нет изображения</span>
						</div>
					)}
				</div>
			</div>
		</Card>
	)
}

// WhatsApp: картинка сверху, под ней заголовок жирным, описание и домен
// снизу серым мелким.
function WhatsAppPreview({ data }: { data: OpenGraphData }) {
	return (
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
					{data.image ? (
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
					) : (
						<div className='flex aspect-video flex-col items-center justify-center gap-1 bg-muted text-muted-foreground'>
							<ImageOff className='h-5 w-5' />
							<span className='text-[10px]'>Нет изображения</span>
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
					new URL(normalizeUrl(value))
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
					// Раньше причина сбоя терялась — сервер уже возвращает
					// содержательное сообщение (таймаут, статус, текст ошибки
					// fetch), а клиент показывал один и тот же общий текст.
					const errorBody = await response.json().catch(() => null)
					throw new Error(
						errorBody?.error ||
							`Не удалось загрузить данные страницы (${response.status})`
					)
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
				void reportClientError({
					title: 'opengraph-validator: ошибка проверки URL',
					description: `Проверяемый URL: ${url}\nОшибка: ${errorMessage}`,
					widget: 'opengraph-validator'
				})
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
		const normalized = normalizeUrl(widget.inputs.url)
		if (normalized !== widget.inputs.url) widget.updateInput('url', normalized)
		runValidation(normalized)
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

	// Три состояния, а не isValid-бинарность: isValid проверяет только
	// обязательные теги (errors), но alert с warnings/recommendations рядом
	// с зелёным «всё корректно!» читался как противоречие — «title длиннее
	// 60 символов» под «всё хорошо» сбивало с толку.
	const statusLevel = !validationResult
		? null
		: validationResult.errors.length > 0
			? 'error'
			: validationResult.warnings.length > 0 ||
				  validationResult.recommendations.length > 0
				? 'warning'
				: 'clean'

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
										'Проверить'
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
									onClick={() => loadExample('https://lifehacker.ru')}
									variant='outline'
								>
									<span className='mr-2 flex h-4 w-4 items-center justify-center rounded-sm bg-[#ED5E42] text-[10px] font-bold text-white'>
										Л
									</span>
									Лайфхакер
								</Button>
								<Button
									onClick={() => loadExample('https://habr.com')}
									variant='outline'
								>
									<span className='mr-2 flex h-4 w-4 items-center justify-center rounded-sm bg-[#65A3BE] text-[10px] font-bold text-white'>
										Х
									</span>
									Хабр
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

				{/* Результаты проверки — один блок: генератор недостающих тегов,
				    статус и найденные теги логически об одном и том же, поэтому
				    делят одну карточку с внутренними разделителями, а не три
				    отдельные рамки подряд */}
				{validationResult && (
					<div className='space-y-5 rounded-lg border p-4 sm:p-5'>
						{validationResult.missingTags.length > 0 && (
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
						)}

						{/* Status with inline errors/warnings */}
						<div
							className={
								validationResult.missingTags.length > 0 ? 'border-t pt-5' : ''
							}
						>
							<Alert
								className={
									statusLevel === 'clean'
										? 'border-l-4 border-l-green-500 bg-muted/40'
										: statusLevel === 'warning'
											? 'border-l-4 border-l-amber-500 bg-muted/40'
											: 'border-l-4 border-l-red-500 bg-muted/40'
								}
							>
								{statusLevel === 'clean' ? (
									<CheckCircle className='h-4 w-4 text-green-600 dark:text-green-500' />
								) : statusLevel === 'warning' ? (
									<AlertTriangle className='h-4 w-4 text-amber-600 dark:text-amber-500' />
								) : (
									<AlertCircle className='h-4 w-4 text-red-600 dark:text-red-500' />
								)}
								<AlertDescription>
									<div className='font-medium text-foreground'>
										{statusLevel === 'clean'
											? 'Все Open Graph теги корректны!'
											: statusLevel === 'warning'
												? 'Обязательные теги на месте, но есть на что обратить внимание'
												: 'Обнаружены проблемы с Open Graph тегами'}
									</div>
									{validationResult.errors.length > 0 && (
										<div className='mt-2 text-sm text-red-600 dark:text-red-400'>
											{validationResult.errors.map((error, index) => (
												<div key={index}>{error}</div>
											))}
										</div>
									)}
									{validationResult.warnings.length > 0 && (
										<div className='mt-2 text-sm text-amber-600 dark:text-amber-400'>
											{validationResult.warnings.map((warning, index) => (
												<div key={index}>{warning}</div>
											))}
										</div>
									)}
									{validationResult.recommendations.length > 0 && (
										<div className='mt-2 text-sm text-muted-foreground'>
											{validationResult.recommendations.map((rec, index) => (
												<div key={index}>{rec}</div>
											))}
										</div>
									)}
								</AlertDescription>
							</Alert>
						</div>

						{/* Found Tags - Compact Version */}
						{Object.keys(validationResult.foundTags).length > 0 && (
							<div className='border-t pt-5'>
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
					<Alert className='border-l-4 border-l-red-500 bg-muted/40'>
						<AlertCircle className='h-4 w-4 text-red-600 dark:text-red-500' />
						<AlertDescription className='text-foreground'>
							{widget.error}
						</AlertDescription>
					</Alert>
				)}
			</Card>
			<OpenGraphSeo />
		</>
	)
}
