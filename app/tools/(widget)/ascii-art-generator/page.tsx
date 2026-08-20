'use client'

import { useState, useRef, useEffect } from 'react'
import { Copy, Check, Download, FileText, Upload, Trash2 } from 'lucide-react'
import Image from 'next/image'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Slider } from '@/components/ui/slider'
import { ToolSelect } from '@/components/ui/tool-select'
import { cn } from '@/lib/utils'
import {
	toolBar,
	toolFooterBar,
	toolIconButton,
	toolPill
} from '@/lib/ui/tool-pill'
import {
	asciiPatterns,
	asciiCategories,
	asciiCharsets,
	type AsciiCharset
} from '@/lib/data/ascii-art-data'
import {
	textToAscii,
	imageToAscii,
	downloadAsciiAsImage,
	downloadAsciiAsText,
	type AsciiFont
} from '@/lib/utils/ascii-converter'
import {
	figletTextToAscii,
	isFigletFont,
	FIGLET_FONTS,
	type FigletFontName
} from '@/lib/utils/figlet-ascii'
import { WidgetSEOWrapper } from '@/components/seo/WidgetSEOWrapper'
import { getWidgetById } from '@/lib/constants/widgets'
import { AsciiArtGeneratorSeo } from './AsciiArtGeneratorSeo'

type Mode = 'text' | 'image' | 'patterns'
type TextFont = AsciiFont | FigletFontName

/**
 * Раньше здесь было только два шрифта: третий, «Крупный», был заглушкой из
 * двух букв (A и B) и на любом другом символе конвертер падал — обещать в
 * интерфейсе то, чего нет, хуже, чем не обещать, поэтому его убрали.
 * Новый «Крупный» — не ручной набор глифов той же болезни, а «Стандартный»,
 * перерисованный сплошным блоком (см. ascii-converter.ts) — работает для
 * всех тех же символов, что и «Стандартный», без исключений.
 *
 * Шесть шрифтов ниже — настоящие FIGlet-шрифты (та же библиотека, что стоит
 * за patorjk.com/software/taag) через пакет `figlet`, подключены только эти
 * шесть (см. figlet-ascii.ts). Ни один из них не знает кириллицы, а «Alpha»
 * ещё и цифр с пунктуацией — рендер сам подставляет непонятые символы
 * обычным текстом вместо стилизованного глифа.
 */
const FONTS: [TextFont, string][] = [
	['standard', 'Стандартный'],
	['small', 'Мелкий'],
	['block', 'Крупный'],
	...FIGLET_FONTS
]

export default function AsciiArtGeneratorPage() {
	const widget = getWidgetById('ascii-art-generator')!
	const [mode, setMode] = useState<Mode>('text')
	const [asciiOutput, setAsciiOutput] = useState('')
	const [copied, setCopied] = useState(false)

	// Текст
	const [text, setText] = useState('')
	const [font, setFont] = useState<TextFont>('standard')

	// Изображение
	const [imagePreview, setImagePreview] = useState<string | null>(null)
	const [width, setWidth] = useState(80)
	const [charset, setCharset] = useState<AsciiCharset>('basic')
	const [invert, setInvert] = useState(false)
	const fileInputRef = useRef<HTMLInputElement>(null)

	const [selectedPattern, setSelectedPattern] = useState('')

	// Текст пересчитывается на лету: кнопка «Создать ASCII-арт» ничего не
	// решала — результат зависит только от текста и шрифта. FIGlet-шрифты
	// грузятся асинхронно (см. figlet-ascii.ts) — при быстром наборе успеет
	// прийти ответ на устаревший текст, поэтому старые результаты гасим
	// флагом cancelled, как в загрузке картинки ниже.
	useEffect(() => {
		if (mode !== 'text') return
		if (!text.trim()) {
			setAsciiOutput('')
			return
		}

		if (isFigletFont(font)) {
			let cancelled = false
			figletTextToAscii(text, font).then(result => {
				if (!cancelled) setAsciiOutput(result)
			})
			return () => {
				cancelled = true
			}
		}

		setAsciiOutput(textToAscii(text, font))
	}, [mode, text, font])

	/** Пересборка ASCII из уже загруженной картинки при смене настроек. */
	useEffect(() => {
		if (mode !== 'image' || !imagePreview) return

		const img = new window.Image()
		img.onload = () => {
			const canvas = document.createElement('canvas')
			const ctx = canvas.getContext('2d')!
			canvas.width = img.width
			canvas.height = img.height
			ctx.drawImage(img, 0, 0)

			const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
			setAsciiOutput(imageToAscii(imageData, { width, charset, invert }))
		}
		img.src = imagePreview
	}, [mode, imagePreview, width, charset, invert])

	const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
		const file = event.target.files?.[0]
		if (!file) return

		const reader = new FileReader()
		reader.onload = e => setImagePreview(e.target?.result as string)
		reader.readAsDataURL(file)
	}

	const handlePatternSelect = (patternId: string) => {
		const pattern = asciiPatterns.find(p => p.id === patternId)
		if (!pattern) return

		setAsciiOutput(pattern.pattern.trim())
		setSelectedPattern(patternId)
	}

	const handleCopyAscii = async () => {
		if (!asciiOutput) return
		await navigator.clipboard.writeText(asciiOutput)
		setCopied(true)
		setTimeout(() => setCopied(false), 2000)
	}

	const clearAll = () => {
		setText('')
		setImagePreview(null)
		setSelectedPattern('')
		setAsciiOutput('')
	}

	return (
		<WidgetSEOWrapper widget={widget}>
			<Card className='overflow-hidden p-0'>
				{/* Верхняя полоса: из чего делаем арт. Раньше это были вкладки во
				    всю ширину, а над ними ещё две плашки — «советы» и «обучение». */}
				<div className={toolBar}>
					<div className='flex flex-wrap items-center gap-1.5'>
						{(
							[
								['text', 'Из текста'],
								['image', 'Из картинки'],
								['patterns', 'Готовые']
							] as [Mode, string][]
						).map(([value, label]) => (
							<button
								key={value}
								type='button'
								onClick={() => setMode(value)}
								aria-pressed={mode === value}
								className={toolPill(mode === value)}
							>
								{label}
							</button>
						))}
					</div>

					<div className='flex items-center gap-0.5 sm:ml-auto'>
						<Button
							size='icon'
							variant='ghost'
							onClick={handleCopyAscii}
							disabled={!asciiOutput}
							title='Скопировать'
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
							onClick={() => downloadAsciiAsText(asciiOutput, 'ascii-art.txt')}
							disabled={!asciiOutput}
							title='Скачать текстом'
							className={toolIconButton}
						>
							<FileText className='h-4 w-4' />
						</Button>
						<Button
							size='icon'
							variant='ghost'
							onClick={() =>
								downloadAsciiAsImage(asciiOutput, 'ascii-art.png', {
									fontSize: 12,
									color: '#000000',
									background: '#FFFFFF'
								})
							}
							disabled={!asciiOutput}
							title='Скачать картинкой'
							className={toolIconButton}
						>
							<Download className='h-4 w-4' />
						</Button>
						<Button
							size='icon'
							variant='ghost'
							onClick={clearAll}
							disabled={!asciiOutput}
							title='Очистить'
							className={toolIconButton}
						>
							<Trash2 className='h-4 w-4' />
						</Button>
					</div>
				</div>

				{mode === 'text' && (
					<div className='px-5 py-6 sm:px-6'>
						<input
							value={text}
							onChange={event => setText(event.target.value)}
							placeholder='Введите текст'
							aria-label='Текст для преобразования'
							className='w-full bg-transparent text-center text-2xl placeholder:text-xl placeholder:text-muted-foreground/60 focus:outline-none sm:text-3xl'
						/>
					</div>
				)}

				{mode === 'image' && (
					<div className='flex flex-col items-center gap-4 px-5 py-6 sm:px-6'>
						<input
							ref={fileInputRef}
							type='file'
							accept='image/*'
							onChange={handleImageUpload}
							aria-label='Загрузить изображение'
							className='hidden'
						/>

						{imagePreview ? (
							<button
								type='button'
								onClick={() => fileInputRef.current?.click()}
								title='Выбрать другое изображение'
								className='cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-ring'
							>
								<Image
									src={imagePreview}
									alt='Исходное изображение'
									width={240}
									height={160}
									className='h-40 w-auto rounded-xl border object-contain'
								/>
							</button>
						) : (
							<button
								type='button'
								onClick={() => fileInputRef.current?.click()}
								className='flex w-full cursor-pointer flex-col items-center gap-2 rounded-xl border border-dashed py-12 transition-colors hover:border-primary/50 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring'
							>
								<Upload className='h-6 w-6 text-muted-foreground' />
								<span className='text-sm'>Выберите изображение</span>
								<span className='text-xs text-muted-foreground'>
									Лучше всего выходят контрастные картинки без мелких деталей
								</span>
							</button>
						)}
					</div>
				)}

				{mode === 'patterns' && (
					<div className='space-y-6 px-5 py-6 sm:px-6'>
						{Object.entries(asciiCategories).map(([category, label]) => (
							<div key={category}>
								<p className='text-sm text-muted-foreground'>{label}</p>
								<div className='mt-2 grid grid-cols-2 gap-2 md:grid-cols-3 lg:grid-cols-4'>
									{asciiPatterns
										.filter(pattern => pattern.category === category)
										.map(pattern => (
											<button
												key={pattern.id}
												type='button'
												onClick={() => handlePatternSelect(pattern.id)}
												className={cn(
													'cursor-pointer rounded-xl border p-3 text-left transition-colors hover:border-primary/50 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring',
													selectedPattern === pattern.id &&
														'border-primary bg-primary/5'
												)}
											>
												<span className='block text-xs text-muted-foreground'>
													{pattern.name}
												</span>
												{/* Рисунок показывается целиком: в шаблонах по 8–9
												    строк, и обрезка до трёх превращала кота в набор
												    палочек — выбрать по такой картинке нельзя.
												    leading-none обязателен: при межстрочном
												    интервале больше единицы ASCII-арт растягивается
												    по вертикали и перестаёт читаться. */}
												<pre className='mt-1 overflow-x-auto font-mono text-[0.625rem] leading-none whitespace-pre'>
													{pattern.pattern.trim()}
												</pre>
											</button>
										))}
								</div>
							</div>
						))}
					</div>
				)}

				{/* Полоса параметров — своя у каждого режима. Шрифтов девять —
				    таблетки в ряд расползлись бы по ширине, поэтому здесь
				    единственный на всей странице выпадающий список вместо
				    привычных toolPill (как «Символы» в режиме «Из картинки»). */}
				{mode === 'text' && (
					<div className={toolFooterBar}>
						<label className='flex items-center gap-2 text-sm text-muted-foreground'>
							<span>Шрифт</span>
							<ToolSelect
								value={font}
								onChange={event => setFont(event.target.value as TextFont)}
							>
								{FONTS.map(([value, label]) => (
									<option key={value} value={value}>
										{label}
									</option>
								))}
							</ToolSelect>
						</label>
					</div>
				)}

				{mode === 'image' && imagePreview && (
					<div className={toolFooterBar}>
						<label className='flex items-center gap-2 text-sm text-muted-foreground'>
							<span>Ширина</span>
							<Slider
								value={[width]}
								onValueChange={([value]) => setWidth(value)}
								min={40}
								max={200}
								step={10}
								className='w-28 cursor-pointer'
								aria-label='Ширина в символах'
							/>
							<span className='w-16 font-mono text-sm text-foreground tabular-nums'>
								{width} симв.
							</span>
						</label>

						<label className='flex items-center gap-2 text-sm text-muted-foreground'>
							<span>Символы</span>
							<ToolSelect
								value={charset}
								onChange={event =>
									setCharset(event.target.value as AsciiCharset)
								}
								className='font-mono'
							>
								{Object.entries(asciiCharsets).map(([key, value]) => (
									<option key={key} value={key}>
										{key} — {value.slice(0, 10)}
									</option>
								))}
							</ToolSelect>
						</label>

						<button
							type='button'
							onClick={() => setInvert(!invert)}
							aria-pressed={invert}
							title='Для тёмных картинок на светлом фоне'
							className={toolPill(invert)}
						>
							инвертировать
						</button>
					</div>
				)}

				{asciiOutput && (
					<div className='border-t'>
						<div className='flex items-center justify-between gap-2 px-5 pt-4 sm:px-6'>
							<span className='text-sm font-medium'>Результат</span>
							<span className='text-xs text-muted-foreground'>
								{asciiOutput.split('\n').length} строк
							</span>
						</div>
						<pre className='max-h-[28rem] overflow-auto px-5 pt-2 pb-5 font-mono text-[0.625rem] leading-none whitespace-pre sm:px-6'>
							{asciiOutput}
						</pre>
					</div>
				)}
			</Card>

			<div className='mt-6 space-y-3 text-sm text-muted-foreground'>
				<p>
					ASCII-арт — картинка, собранная из обычных символов. Она вставляется
					куда угодно: в README, в комментарий, в письмо, в чат — и не зависит
					от того, поддерживает ли площадка картинки.
				</p>
				<p>
					Для конвертации фотографии берите контрастное изображение без мелких
					деталей: при переводе в символы часть из них неизбежно теряется.
					Ширину подбирайте под место, где арт будет жить, а показывать его
					нужно моноширинным шрифтом — иначе строки разъедутся.
				</p>
			</div>

			<AsciiArtGeneratorSeo />
		</WidgetSEOWrapper>
	)
}
