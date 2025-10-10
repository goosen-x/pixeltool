'use client'

import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { Copy, Check, RefreshCw } from 'lucide-react'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'
import {
	hexToRgb,
	rgbToHex,
	rgbToHsl,
	hslToRgb,
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
		toast.success(`${format} скопировано`)
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

	const FormatCard = ({
		title,
		value,
		formatKey,
		description
	}: {
		title: string
		value: string
		formatKey: string
		description?: string
	}) => {
		const isCopied = copiedFormat === formatKey
		return (
			<div className='group relative p-4 rounded-xl border-2 border-border/50 bg-gradient-to-br from-background to-muted/20 hover:border-primary/50 transition-all hover:shadow-md'>
				<div className='flex items-start justify-between gap-3'>
					<div className='flex-1 min-w-0'>
						<div className='flex items-center gap-2 mb-1'>
							<h4 className='text-xs font-semibold text-muted-foreground uppercase tracking-wide'>
								{title}
							</h4>
							{description && (
								<span className='text-[10px] text-muted-foreground/60'>
									{description}
								</span>
							)}
						</div>
						<code className='block font-mono text-sm font-medium break-all'>
							{value}
						</code>
					</div>
					<Button
						size='sm'
						variant='ghost'
						onClick={() => copyToClipboard(value, title)}
						className={cn(
							'h-8 w-8 p-0 flex-shrink-0 transition-all',
							isCopied && 'bg-green-500/10 text-green-600'
						)}
					>
						{isCopied ? (
							<Check className='h-3.5 w-3.5' />
						) : (
							<Copy className='h-3.5 w-3.5' />
						)}
					</Button>
				</div>
			</div>
		)
	}

	return (
		<div className='space-y-6'>
			<Card className='overflow-hidden'>
				<div className='grid md:grid-cols-[300px_1fr] gap-0'>
					<div className='relative h-[300px] md:h-auto'>
						<div
							className='absolute inset-0 transition-all duration-300'
							style={{ backgroundColor: hexValue }}
						/>
						{alpha < 1 && (
							<div className='absolute inset-0 bg-checkered'>
								<div
									className='absolute inset-0'
									style={{
										backgroundColor: `rgba(${rgbValue.r}, ${rgbValue.g}, ${rgbValue.b}, ${alpha})`
									}}
								/>
							</div>
						)}
						<div className='absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 to-transparent'>
							<div className='text-white'>
								<div className='text-3xl font-bold font-mono mb-1'>
									{hexValue.toUpperCase()}
								</div>
								<div className='text-sm opacity-80'>
									RGB({rgbValue.r}, {rgbValue.g}, {rgbValue.b})
								</div>
							</div>
						</div>
					</div>

					<CardContent className='p-6 space-y-6'>
						<div className='flex items-center gap-2'>
							<Button
								onClick={generateRandomColor}
								variant='outline'
								size='sm'
								className='gap-2'
							>
								<RefreshCw className='h-4 w-4' />
								Случайный цвет
							</Button>
							<Button
								onClick={() => copyToClipboard(hexValue.toUpperCase(), 'HEX')}
								variant='outline'
								size='sm'
								className='gap-2'
							>
								<Copy className='h-4 w-4' />
								Копировать HEX
							</Button>
						</div>

						<div className='grid gap-4'>
							<div className='space-y-2'>
								<Label className='text-sm font-semibold'>HEX</Label>
								<div className='flex items-center gap-2'>
									<div className='relative flex-1'>
										<span className='absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground font-mono text-lg'>
											#
										</span>
										<Input
											value={hexValue.replace('#', '')}
											onChange={e => {
												const hex = '#' + e.target.value
												setHexValue(hex)
												updateFromHex(hex)
											}}
											placeholder='FF6B9D'
											maxLength={6}
											className='pl-8 font-mono text-lg h-12'
										/>
									</div>
									<div
										className='w-12 h-12 rounded-lg border-2 border-border cursor-pointer flex-shrink-0 transition-transform hover:scale-105'
										style={{ backgroundColor: hexValue }}
										title='Color preview'
									/>
								</div>
							</div>

							<div className='space-y-4'>
								<Label className='text-sm font-semibold'>RGB</Label>

								<div className='space-y-2'>
									<div className='flex items-center justify-between'>
										<span className='text-xs font-semibold text-red-500'>
											R
										</span>
										<span className='text-sm font-mono font-bold px-2 py-0.5 rounded bg-red-500/10 text-red-600 dark:text-red-400'>
											{rgbValue.r}
										</span>
									</div>
									<div className='relative h-8 rounded-lg overflow-hidden border-2 border-border/50 shadow-inner'>
										<div className='absolute inset-0 bg-gradient-to-r from-black via-red-500/50 to-red-500' />
										<input
											type='range'
											min='0'
											max='255'
											value={rgbValue.r}
											onChange={e => {
												const newRgb = {
													...rgbValue,
													r: parseInt(e.target.value)
												}
												setRgbValue(newRgb)
												updateFromRgb(newRgb)
											}}
											className='absolute inset-0 w-full opacity-0 cursor-pointer z-10'
										/>
										<div
											className='absolute top-1/2 -translate-y-1/2 w-4 h-10 bg-white dark:bg-gray-100 border-3 border-gray-900 dark:border-gray-800 rounded-md shadow-xl pointer-events-none transition-all'
											style={{
												left: `calc(${(rgbValue.r / 255) * 100}% - 8px)`,
												boxShadow:
													'0 4px 12px rgba(0,0,0,0.4), 0 0 0 2px rgba(255,255,255,0.3)'
											}}
										/>
									</div>
								</div>

								<div className='space-y-2'>
									<div className='flex items-center justify-between'>
										<span className='text-xs font-semibold text-green-500'>
											G
										</span>
										<span className='text-sm font-mono font-bold px-2 py-0.5 rounded bg-green-500/10 text-green-600 dark:text-green-400'>
											{rgbValue.g}
										</span>
									</div>
									<div className='relative h-8 rounded-lg overflow-hidden border-2 border-border/50 shadow-inner'>
										<div className='absolute inset-0 bg-gradient-to-r from-black via-green-500/50 to-green-500' />
										<input
											type='range'
											min='0'
											max='255'
											value={rgbValue.g}
											onChange={e => {
												const newRgb = {
													...rgbValue,
													g: parseInt(e.target.value)
												}
												setRgbValue(newRgb)
												updateFromRgb(newRgb)
											}}
											className='absolute inset-0 w-full opacity-0 cursor-pointer z-10'
										/>
										<div
											className='absolute top-1/2 -translate-y-1/2 w-4 h-10 bg-white dark:bg-gray-100 border-3 border-gray-900 dark:border-gray-800 rounded-md shadow-xl pointer-events-none transition-all'
											style={{
												left: `calc(${(rgbValue.g / 255) * 100}% - 8px)`,
												boxShadow:
													'0 4px 12px rgba(0,0,0,0.4), 0 0 0 2px rgba(255,255,255,0.3)'
											}}
										/>
									</div>
								</div>

								<div className='space-y-2'>
									<div className='flex items-center justify-between'>
										<span className='text-xs font-semibold text-blue-500'>
											B
										</span>
										<span className='text-sm font-mono font-bold px-2 py-0.5 rounded bg-blue-500/10 text-blue-600 dark:text-blue-400'>
											{rgbValue.b}
										</span>
									</div>
									<div className='relative h-8 rounded-lg overflow-hidden border-2 border-border/50 shadow-inner'>
										<div className='absolute inset-0 bg-gradient-to-r from-black via-blue-500/50 to-blue-500' />
										<input
											type='range'
											min='0'
											max='255'
											value={rgbValue.b}
											onChange={e => {
												const newRgb = {
													...rgbValue,
													b: parseInt(e.target.value)
												}
												setRgbValue(newRgb)
												updateFromRgb(newRgb)
											}}
											className='absolute inset-0 w-full opacity-0 cursor-pointer z-10'
										/>
										<div
											className='absolute top-1/2 -translate-y-1/2 w-4 h-10 bg-white dark:bg-gray-100 border-3 border-gray-900 dark:border-gray-800 rounded-md shadow-xl pointer-events-none transition-all'
											style={{
												left: `calc(${(rgbValue.b / 255) * 100}% - 8px)`,
												boxShadow:
													'0 4px 12px rgba(0,0,0,0.4), 0 0 0 2px rgba(255,255,255,0.3)'
											}}
										/>
									</div>
								</div>
							</div>

							<div className='space-y-2'>
								<div className='flex items-center justify-between'>
									<Label className='text-sm font-semibold'>Прозрачность</Label>
									<span className='text-sm font-mono font-semibold'>
										{Math.round(alpha * 100)}%
									</span>
								</div>
								<div className='relative h-8 rounded-lg overflow-hidden border-2 border-border/50 shadow-inner bg-checkered'>
									<input
										type='range'
										min='0'
										max='100'
										value={alpha * 100}
										onChange={e => setAlpha(parseInt(e.target.value) / 100)}
										className='absolute inset-0 w-full opacity-0 cursor-pointer z-10'
									/>
									<div
										className='absolute top-1/2 -translate-y-1/2 w-4 h-10 bg-white dark:bg-gray-100 border-3 border-gray-900 dark:border-gray-800 rounded-md shadow-xl pointer-events-none transition-all'
										style={{
											left: `calc(${alpha * 100}% - 8px)`,
											boxShadow:
												'0 4px 12px rgba(0,0,0,0.4), 0 0 0 2px rgba(255,255,255,0.3)'
										}}
									/>
								</div>
							</div>
						</div>
					</CardContent>
				</div>
			</Card>

			<Card>
				<CardContent className='p-6'>
					<Tabs defaultValue='basic' className='w-full'>
						<TabsList className='grid w-full grid-cols-3 mb-6'>
							<TabsTrigger value='basic'>Основные</TabsTrigger>
							<TabsTrigger value='advanced'>Продвинутые</TabsTrigger>
							<TabsTrigger value='web'>Web</TabsTrigger>
						</TabsList>

						<TabsContent value='basic' className='space-y-4'>
							<div className='grid gap-3 sm:grid-cols-2'>
								<FormatCard
									title='HEX'
									value={hexValue.toUpperCase()}
									formatKey='hex'
								/>
								<FormatCard
									title='RGB'
									value={formatRgb(rgbValue)}
									formatKey='rgb'
								/>
								<FormatCard
									title='RGBA'
									value={formatRgba(rgba, 2)}
									formatKey='rgba'
									description='с альфа'
								/>
								<FormatCard
									title='HSL'
									value={formatHsl(hslValue)}
									formatKey='hsl'
								/>
								<FormatCard
									title='HSLA'
									value={formatHsla({ ...hslValue, a: alpha }, 2)}
									formatKey='hsla'
									description='с альфа'
								/>
								<FormatCard
									title='HSB/HSV'
									value={formatHsb(hsbValue)}
									formatKey='hsb'
								/>
							</div>
						</TabsContent>

						<TabsContent value='advanced' className='space-y-4'>
							<div className='grid gap-3 sm:grid-cols-2'>
								<FormatCard
									title='CMYK'
									value={formatCmyk(cmykValue)}
									formatKey='cmyk'
									description='печать'
								/>
								<FormatCard
									title='LAB'
									value={formatLab(labValue, 2)}
									formatKey='lab'
									description='перцептуальная'
								/>
							</div>
						</TabsContent>

						<TabsContent value='web' className='space-y-4'>
							<div className='grid gap-3 sm:grid-cols-2'>
								<FormatCard
									title='CSS HEX'
									value={`color: ${hexValue.toUpperCase()};`}
									formatKey='css-hex'
								/>
								<FormatCard
									title='CSS RGB'
									value={`color: ${formatRgb(rgbValue)};`}
									formatKey='css-rgb'
								/>
								<FormatCard
									title='CSS RGBA'
									value={`color: ${formatRgba(rgba, 2)};`}
									formatKey='css-rgba'
								/>
								<FormatCard
									title='CSS HSL'
									value={`color: ${formatHsl(hslValue)};`}
									formatKey='css-hsl'
								/>
								<FormatCard
									title='Websafe'
									value={websafe.toUpperCase()}
									formatKey='websafe'
									description='безопасный'
								/>
								<FormatCard
									title='Tailwind'
									value={`[${hexValue}]`}
									formatKey='tailwind'
									description='arbitrary value'
								/>
							</div>
						</TabsContent>
					</Tabs>
				</CardContent>
			</Card>
		</div>
	)
}
