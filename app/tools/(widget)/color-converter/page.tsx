'use client'

import { useState } from 'react'
import { ColorGuide } from './ColorGuide'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Slider } from '@/components/ui/slider'
import { Copy, Check, Shuffle } from 'lucide-react'
import { cn } from '@/lib/utils'
import { toolBar, toolFooterBar, toolIconButton } from '@/lib/ui/tool-pill'
import {
	hexToRgb,
	rgbToHex,
	rgbToHsl,
	rgbToHsb,
	rgbToCmyk,
	formatRgb,
	formatRgba,
	formatHsl,
	formatHsla,
	formatCmyk,
	formatHsb,
	formatLab,
	getWebsafeColor,
	rgbToLab,
	type RGB,
	type RGBA,
	type HSL
} from '@/lib/utils/color-converter'
import { ToolScreenshot } from '@/components/tools/ToolScreenshot'

export default function ColorConverterPage() {
	const [hexValue, setHexValue] = useState('#FF6B9D')
	const [rgbValue, setRgbValue] = useState<RGB>({ r: 255, g: 107, b: 157 })
	const [hslValue, setHslValue] = useState<HSL>({ h: 340, s: 100, l: 71 })
	const [alpha, setAlpha] = useState(1)
	const [copiedFormat, setCopiedFormat] = useState<string | null>(null)

	const rgba: RGBA = { ...rgbValue, a: alpha }
	const cmykValue = rgbToCmyk(rgbValue)
	const hsbValue = rgbToHsb(rgbValue)
	const labValue = rgbToLab(rgbValue)
	const websafe = getWebsafeColor(hexValue)

	const updateFromHex = (hex: string) => {
		const rgb = hexToRgb(hex)
		if (rgb) {
			setRgbValue(rgb)
			setHslValue(rgbToHsl(rgb))
		}
	}

	const updateFromRgb = (rgb: RGB) => {
		setHexValue(rgbToHex(rgb))
		setHslValue(rgbToHsl(rgb))
	}

	const copyToClipboard = (text: string, format: string) => {
		navigator.clipboard.writeText(text)
		setCopiedFormat(format)
		setTimeout(() => setCopiedFormat(null), 2000)
	}

	const generateRandomColor = () => {
		const randomRgb: RGB = {
			r: Math.floor(Math.random() * 256),
			g: Math.floor(Math.random() * 256),
			b: Math.floor(Math.random() * 256)
		}
		setRgbValue(randomRgb)
		updateFromRgb(randomRgb)
	}

	// Все форматы сразу: раньше они были разложены по трём вкладкам
	// («Основные», «Продвинутые», «Web»), и человек, пришедший за CMYK, сначала
	// видел экран без CMYK. Форматов всего десяток — они помещаются целиком.
	const FORMATS: { title: string; value: string; hint?: string }[] = [
		{ title: 'HEX', value: hexValue.toUpperCase() },
		{ title: 'RGB', value: formatRgb(rgbValue) },
		{ title: 'RGBA', value: formatRgba(rgba, 2), hint: 'с прозрачностью' },
		{ title: 'HSL', value: formatHsl(hslValue) },
		{ title: 'HSLA', value: formatHsla({ ...hslValue, a: alpha }, 2) },
		{ title: 'HSB / HSV', value: formatHsb(hsbValue) },
		{ title: 'CMYK', value: formatCmyk(cmykValue), hint: 'печать' },
		{ title: 'LAB', value: formatLab(labValue, 2), hint: 'перцептуальная' },
		{ title: 'Websafe', value: websafe.toUpperCase() },
		{ title: 'Tailwind', value: `[${hexValue.toLowerCase()}]` }
	]

	const CHANNELS: { key: keyof RGB; label: string; color: string }[] = [
		{ key: 'r', label: 'R', color: 'text-red-600 dark:text-red-400' },
		{ key: 'g', label: 'G', color: 'text-green-600 dark:text-green-400' },
		{ key: 'b', label: 'B', color: 'text-blue-600 dark:text-blue-400' }
	]

	return (
		<>
			<Card className='overflow-hidden p-0'>
				{/* Верхняя полоса: сам цвет. Ввести его можно как угодно — вписать
				    hex или выбрать пипеткой. */}
				<div className={toolBar}>
					<label className='flex items-center gap-2 text-sm text-muted-foreground'>
						<span>HEX</span>
						<span className='flex items-center rounded-md border bg-background pl-2'>
							<span className='font-mono text-sm text-muted-foreground'>#</span>
							<input
								value={hexValue.replace('#', '')}
								onChange={event => {
									const hex = '#' + event.target.value
									setHexValue(hex)
									updateFromHex(hex)
								}}
								maxLength={6}
								spellCheck={false}
								placeholder='FF6B9D'
								aria-label='Цвет в HEX'
								className='w-24 bg-transparent px-1 py-1 font-mono text-sm text-foreground focus:outline-none'
							/>
						</span>
						<input
							type='color'
							value={/^#[0-9a-f]{6}$/i.test(hexValue) ? hexValue : '#000000'}
							onChange={event => {
								setHexValue(event.target.value)
								updateFromHex(event.target.value)
							}}
							aria-label='Выбрать цвет'
							className='h-7 w-9 cursor-pointer rounded-md border bg-background p-0.5'
						/>
					</label>

					<div className='flex items-center gap-0.5 sm:ml-auto'>
						<Button
							size='icon'
							variant='ghost'
							onClick={generateRandomColor}
							title='Случайный цвет'
							className={toolIconButton}
						>
							<Shuffle className='h-4 w-4' />
						</Button>
					</div>
				</div>

				{/* Сам цвет во всю ширину — это и есть результат. Клетчатая
				    подложка появляется только при прозрачности, иначе она врёт. */}
				<div
					className={cn('relative h-40 w-full', alpha < 1 && 'bg-checkered')}
				>
					<div
						className='absolute inset-0'
						style={{
							backgroundColor: `rgba(${rgbValue.r}, ${rgbValue.g}, ${rgbValue.b}, ${alpha})`
						}}
					/>
				</div>

				{/* Полоса каналов: те же значения, что и в списке форматов, но
				    здесь их крутят, а не читают. */}
				<div className={toolFooterBar}>
					{CHANNELS.map(channel => (
						<label
							key={channel.key}
							className='flex items-center gap-2 text-sm text-muted-foreground'
						>
							<span
								className={cn('font-mono text-xs font-bold', channel.color)}
							>
								{channel.label}
							</span>
							<Slider
								value={[rgbValue[channel.key]]}
								onValueChange={([value]) => {
									const newRgb = { ...rgbValue, [channel.key]: value }
									setRgbValue(newRgb)
									updateFromRgb(newRgb)
								}}
								min={0}
								max={255}
								step={1}
								className='w-28 cursor-pointer'
								aria-label={`Канал ${channel.label}`}
							/>
							<span className='w-8 font-mono text-sm text-foreground tabular-nums'>
								{rgbValue[channel.key]}
							</span>
						</label>
					))}

					<label className='flex items-center gap-2 text-sm text-muted-foreground'>
						<span className='font-mono text-xs'>alpha</span>
						<Slider
							value={[Math.round(alpha * 100)]}
							onValueChange={([value]) => setAlpha(value / 100)}
							min={0}
							max={100}
							step={1}
							className='w-24 cursor-pointer'
							aria-label='Прозрачность'
						/>
						<span className='w-10 font-mono text-sm text-foreground tabular-nums'>
							{Math.round(alpha * 100)}%
						</span>
					</label>
				</div>

				<div className='grid gap-px border-t bg-border sm:grid-cols-2'>
					{FORMATS.map(format => (
						<button
							key={format.title}
							type='button'
							onClick={() => copyToClipboard(format.value, format.title)}
							title='Скопировать'
							className='group flex cursor-pointer items-center justify-between gap-3 bg-background px-5 py-3 text-left transition-colors hover:bg-muted/40 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset sm:px-6'
						>
							<span className='min-w-0'>
								<span className='block font-mono text-xs tracking-wide text-muted-foreground uppercase'>
									{format.title}
									{format.hint && (
										<span className='ml-2 normal-case'>{format.hint}</span>
									)}
								</span>
								<span className='mt-0.5 block font-mono text-sm break-all'>
									{format.value}
								</span>
							</span>
							{copiedFormat === format.title ? (
								<Check className='h-4 w-4 shrink-0 text-green-600 dark:text-green-400' />
							) : (
								<Copy className='h-4 w-4 shrink-0 text-muted-foreground opacity-60 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100' />
							)}
						</button>
					))}
				</div>
			</Card>

			<ToolScreenshot slug='color-converter' />
			<ColorGuide />
		</>
	)
}
