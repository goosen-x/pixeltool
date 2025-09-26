'use client'

import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Slider } from '@/components/ui/slider'
import { Copy, Palette, Settings2, Layers } from 'lucide-react'
import { toast } from 'sonner'
import { WidgetLayout } from '@/components/widgets/WidgetLayout'
import { useWidgetKeyboard } from '@/lib/hooks/useWidgetKeyboard'
import { WidgetSection } from '@/components/widgets/WidgetSection'
import { WidgetInput } from '@/components/widgets/WidgetInput'
import { WidgetOutput } from '@/components/widgets/WidgetOutput'
import { Button } from '@/components/ui/button'
import {
	hexToRgb,
	rgbToHex,
	rgbToHsl,
	hslToRgb,
	rgbToHsb,
	rgbToCmyk,
	cmykToRgb,
	rgbToLab,
	labToRgb,
	rgbaToRgb,
	getWebsafeColor,
	formatRgb,
	formatRgba,
	formatRgbPercent,
	formatRgbaPercent,
	formatHsl,
	formatHsla,
	formatCmyk,
	formatHsb,
	formatXyz,
	formatLab,
	rgbToXyz,
	type RGB,
	type RGBA,
	type HSL,
	type CMYK,
	type LAB
} from '@/lib/utils/color-converter'

export default function ColorConverterPage() {
	// State
	const [hexValue, setHexValue] = useState('#FF9999')
	const [rgbValue, setRgbValue] = useState<RGB>({ r: 255, g: 153, b: 153 })
	const [hslValue, setHslValue] = useState<HSL>({ h: 0, s: 100, l: 80 })
	const [cmykValue, setCmykValue] = useState<CMYK>({ c: 0, m: 40, y: 40, k: 0 })
	const [labValue, setLabValue] = useState<LAB>({ l: 73, a: 35, b: 14 })
	const [alpha, setAlpha] = useState(1)
	const [backgroundColor, setBackgroundColor] = useState<RGB>({
		r: 255,
		g: 255,
		b: 255
	})
	const [precision, setPrecision] = useState(2)

	// Update all color values when one changes
	const updateFromHex = (hex: string) => {
		const rgb = hexToRgb(hex)
		if (rgb) {
			setRgbValue(rgb)
			setHslValue(rgbToHsl(rgb))
			setCmykValue(rgbToCmyk(rgb))
			setLabValue(rgbToLab(rgb))
		}
	}

	const updateFromRgb = (rgb: RGB) => {
		setHexValue(rgbToHex(rgb))
		setHslValue(rgbToHsl(rgb))
		setCmykValue(rgbToCmyk(rgb))
		setLabValue(rgbToLab(rgb))
	}

	const updateFromHsl = (hsl: HSL) => {
		const rgb = hslToRgb(hsl)
		setRgbValue(rgb)
		setHexValue(rgbToHex(rgb))
		setCmykValue(rgbToCmyk(rgb))
		setLabValue(rgbToLab(rgb))
	}

	const updateFromCmyk = (cmyk: CMYK) => {
		const rgb = cmykToRgb(cmyk)
		setRgbValue(rgb)
		setHexValue(rgbToHex(rgb))
		setHslValue(rgbToHsl(rgb))
		setLabValue(rgbToLab(rgb))
	}

	const updateFromLab = (lab: LAB) => {
		const rgb = labToRgb(lab)
		setRgbValue(rgb)
		setHexValue(rgbToHex(rgb))
		setHslValue(rgbToHsl(rgb))
		setCmykValue(rgbToCmyk(rgb))
	}

	// Copy to clipboard
	const copyToClipboard = (text: string, label: string) => {
		navigator.clipboard.writeText(text)
		toast.success(`${label} скопировано в буфер обмена`)
	}

	// Get all conversions
	const rgba: RGBA = { ...rgbValue, a: alpha }
	const hsb = rgbToHsb(rgbValue)
	const xyz = rgbToXyz(rgbValue)
	const websafe = getWebsafeColor(hexValue)
	const rgbWithBg = rgbaToRgb(rgba, backgroundColor)

	// Keyboard shortcuts
	const shortcuts = [
		{
			key: 'c',
			primary: true,
			action: () => copyToClipboard(hexValue, 'HEX'),
			description: 'Копировать HEX'
		},
		{
			key: 'c',
			alt: true,
			shift: true,
			action: () => copyToClipboard(formatRgb(rgbValue), 'RGB'),
			description: 'Копировать RGB'
		},
		{
			key: 'a',
			primary: true,
			action: () => copyToClipboard(formatRgba(rgba), 'RGBA'),
			description: 'Копировать RGBA'
		},
		{
			key: 'k',
			alt: true,
			action: () => {
				setHexValue('#FF9999')
				updateFromHex('#FF9999')
				setAlpha(1)
				toast.success('Сброшено')
			},
			description: 'Сбросить'
		}
	]

	useWidgetKeyboard({
		shortcuts,
		widgetId: 'color-converter'
	})

	return (
		<WidgetLayout>
			<div className='grid gap-6 lg:grid-cols-2'>
				{/* Input Section */}
				<WidgetSection
					icon={<Palette className='w-5 h-5' />}
					title='Ввод цвета'
				>
					<div className='space-y-4'>
						{/* Color Preview */}
						<div className='grid grid-cols-2 gap-4'>
							<div>
								<Label className='text-sm font-medium mb-2 block'>Превью</Label>
								<div
									className='h-24 rounded-xl border-2 border-border/50 transition-colors'
									style={{ backgroundColor: hexValue }}
								/>
							</div>
							<div>
								<Label className='text-sm font-medium mb-2 block'>
									Превью с альфа
								</Label>
								<div className='h-24 rounded-xl border-2 border-border/50 bg-checkered relative overflow-hidden'>
									<div
										className='absolute inset-0'
										style={{
											backgroundColor: `rgba(${rgbValue.r}, ${rgbValue.g}, ${rgbValue.b}, ${alpha})`
										}}
									/>
								</div>
							</div>
						</div>

						{/* HEX Input */}
						<WidgetInput label='HEX'>
							<div className='flex items-center gap-2'>
								<span className='text-xl font-mono text-muted-foreground'>
									#
								</span>
								<Input
									value={hexValue.replace('#', '')}
									onChange={e => {
										const hex = '#' + e.target.value
										setHexValue(hex)
										updateFromHex(hex)
									}}
									placeholder='000000'
									maxLength={6}
									className='font-mono'
								/>
								<Button
									size='icon'
									variant='ghost'
									onClick={() => copyToClipboard(hexValue.toUpperCase(), 'HEX')}
									className='opacity-0 group-hover:opacity-100 transition-opacity'
								>
									<Copy className='h-4 w-4' />
								</Button>
							</div>
						</WidgetInput>

						{/* RGB Inputs */}
						<WidgetInput label='RGB' className='group'>
							<div className='flex items-center gap-2'>
								<div className='flex items-center gap-1 flex-1'>
									<Input
										type='number'
										min='0'
										max='255'
										value={rgbValue.r}
										onChange={e => {
											const newRgb = {
												...rgbValue,
												r: parseInt(e.target.value) || 0
											}
											setRgbValue(newRgb)
											updateFromRgb(newRgb)
										}}
										className='w-16'
										title='Red'
									/>
									<Input
										type='number'
										min='0'
										max='255'
										value={rgbValue.g}
										onChange={e => {
											const newRgb = {
												...rgbValue,
												g: parseInt(e.target.value) || 0
											}
											setRgbValue(newRgb)
											updateFromRgb(newRgb)
										}}
										className='w-16'
										title='Green'
									/>
									<Input
										type='number'
										min='0'
										max='255'
										value={rgbValue.b}
										onChange={e => {
											const newRgb = {
												...rgbValue,
												b: parseInt(e.target.value) || 0
											}
											setRgbValue(newRgb)
											updateFromRgb(newRgb)
										}}
										className='w-16'
										title='Blue'
									/>
								</div>
								<Button
									size='icon'
									variant='ghost'
									onClick={() => copyToClipboard(formatRgb(rgbValue), 'RGB')}
									className='opacity-0 group-hover:opacity-100 transition-opacity'
								>
									<Copy className='h-4 w-4' />
								</Button>
							</div>
						</WidgetInput>

						{/* HSL Inputs */}
						<WidgetInput label='HSL' className='group'>
							<div className='flex items-center gap-2'>
								<div className='flex items-center gap-1 flex-1'>
									<Input
										type='number'
										min='0'
										max='360'
										value={hslValue.h}
										onChange={e => {
											const newHsl = {
												...hslValue,
												h: parseInt(e.target.value) || 0
											}
											setHslValue(newHsl)
											updateFromHsl(newHsl)
										}}
										className='w-16'
										title='Hue'
									/>
									<Input
										type='number'
										min='0'
										max='100'
										value={hslValue.s}
										onChange={e => {
											const newHsl = {
												...hslValue,
												s: parseInt(e.target.value) || 0
											}
											setHslValue(newHsl)
											updateFromHsl(newHsl)
										}}
										className='w-16'
										title='Saturation %'
									/>
									<Input
										type='number'
										min='0'
										max='100'
										value={hslValue.l}
										onChange={e => {
											const newHsl = {
												...hslValue,
												l: parseInt(e.target.value) || 0
											}
											setHslValue(newHsl)
											updateFromHsl(newHsl)
										}}
										className='w-16'
										title='Lightness %'
									/>
								</div>
								<Button
									size='icon'
									variant='ghost'
									onClick={() => copyToClipboard(formatHsl(hslValue), 'HSL')}
									className='opacity-0 group-hover:opacity-100 transition-opacity'
								>
									<Copy className='h-4 w-4' />
								</Button>
							</div>
						</WidgetInput>

						{/* Alpha Channel */}
						<WidgetInput label={`Альфа-канал (${alpha.toFixed(2)})`}>
							<Slider
								value={[alpha]}
								onValueChange={([v]) => setAlpha(v)}
								min={0}
								max={1}
								step={0.01}
								className='w-full'
							/>
						</WidgetInput>
					</div>
				</WidgetSection>

				{/* Output Section */}
				<WidgetSection
					icon={<Layers className='w-5 h-5' />}
					title='Конвертация цветов'
				>
					<WidgetOutput>
						<div className='space-y-4'>
							{/* HEX Values */}
							<div className='space-y-2 p-4 rounded-xl bg-gradient-to-br from-primary/5 to-accent/5 border border-border/50'>
								<h4 className='font-medium text-sm text-muted-foreground'>
									HEX
								</h4>
								<div className='space-y-1'>
									<div className='flex items-center justify-between group'>
										<code className='font-mono text-sm'>
											{hexValue.toUpperCase()}
										</code>
										<Button
											size='icon'
											variant='ghost'
											onClick={() =>
												copyToClipboard(hexValue.toUpperCase(), 'HEX')
											}
											className='h-8 w-8'
										>
											<Copy className='h-3 w-3' />
										</Button>
									</div>
									<div className='flex items-center justify-between group'>
										<code className='font-mono text-sm text-muted-foreground'>
											Websafe: {websafe.toUpperCase()}
										</code>
										<Button
											size='icon'
											variant='ghost'
											onClick={() =>
												copyToClipboard(websafe.toUpperCase(), 'Websafe')
											}
											className='h-8 w-8'
										>
											<Copy className='h-3 w-3' />
										</Button>
									</div>
								</div>
							</div>

							{/* RGB Values */}
							<div className='space-y-2 p-4 rounded-xl bg-gradient-to-br from-primary/5 to-accent/5 border border-border/50'>
								<h4 className='font-medium text-sm text-muted-foreground'>
									RGB
								</h4>
								<div className='space-y-1'>
									<div className='flex items-center justify-between group'>
										<code className='font-mono text-sm'>
											{formatRgb(rgbValue)}
										</code>
										<Button
											size='icon'
											variant='ghost'
											onClick={() =>
												copyToClipboard(formatRgb(rgbValue), 'RGB')
											}
											className='h-8 w-8'
										>
											<Copy className='h-3 w-3' />
										</Button>
									</div>
									<div className='flex items-center justify-between group'>
										<code className='font-mono text-sm text-muted-foreground'>
											{formatRgba(rgba, precision)}
										</code>
										<Button
											size='icon'
											variant='ghost'
											onClick={() =>
												copyToClipboard(formatRgba(rgba, precision), 'RGBA')
											}
											className='h-8 w-8'
										>
											<Copy className='h-3 w-3' />
										</Button>
									</div>
									<div className='flex items-center justify-between group'>
										<code className='font-mono text-sm text-muted-foreground'>
											{formatRgbPercent(rgbValue, precision)}
										</code>
										<Button
											size='icon'
											variant='ghost'
											onClick={() =>
												copyToClipboard(
													formatRgbPercent(rgbValue, precision),
													'RGB %'
												)
											}
											className='h-8 w-8'
										>
											<Copy className='h-3 w-3' />
										</Button>
									</div>
								</div>
							</div>

							{/* HSL Values */}
							<div className='space-y-2 p-4 rounded-xl bg-gradient-to-br from-primary/5 to-accent/5 border border-border/50'>
								<h4 className='font-medium text-sm text-muted-foreground'>
									HSL / HSB
								</h4>
								<div className='space-y-1'>
									<div className='flex items-center justify-between group'>
										<code className='font-mono text-sm'>
											{formatHsl(hslValue)}
										</code>
										<Button
											size='icon'
											variant='ghost'
											onClick={() =>
												copyToClipboard(formatHsl(hslValue), 'HSL')
											}
											className='h-8 w-8'
										>
											<Copy className='h-3 w-3' />
										</Button>
									</div>
									<div className='flex items-center justify-between group'>
										<code className='font-mono text-sm text-muted-foreground'>
											{formatHsla({ ...hslValue, a: alpha }, precision)}
										</code>
										<Button
											size='icon'
											variant='ghost'
											onClick={() =>
												copyToClipboard(
													formatHsla({ ...hslValue, a: alpha }, precision),
													'HSLA'
												)
											}
											className='h-8 w-8'
										>
											<Copy className='h-3 w-3' />
										</Button>
									</div>
									<div className='flex items-center justify-between group'>
										<code className='font-mono text-sm text-muted-foreground'>
											HSB: {formatHsb(hsb)}
										</code>
										<Button
											size='icon'
											variant='ghost'
											onClick={() => copyToClipboard(formatHsb(hsb), 'HSB')}
											className='h-8 w-8'
										>
											<Copy className='h-3 w-3' />
										</Button>
									</div>
								</div>
							</div>

							{/* Other formats */}
							<div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
								{/* CMYK */}
								<div className='space-y-2 p-4 rounded-xl bg-gradient-to-br from-primary/5 to-accent/5 border border-border/50'>
									<h4 className='font-medium text-sm text-muted-foreground'>
										CMYK
									</h4>
									<div className='flex items-center justify-between group'>
										<code className='font-mono text-sm'>
											{formatCmyk(cmykValue)}
										</code>
										<Button
											size='icon'
											variant='ghost'
											onClick={() =>
												copyToClipboard(formatCmyk(cmykValue), 'CMYK')
											}
											className='h-8 w-8'
										>
											<Copy className='h-3 w-3' />
										</Button>
									</div>
								</div>

								{/* LAB */}
								<div className='space-y-2 p-4 rounded-xl bg-gradient-to-br from-primary/5 to-accent/5 border border-border/50'>
									<h4 className='font-medium text-sm text-muted-foreground'>
										LAB
									</h4>
									<div className='flex items-center justify-between group'>
										<code className='font-mono text-sm'>
											{formatLab(labValue, precision)}
										</code>
										<Button
											size='icon'
											variant='ghost'
											onClick={() =>
												copyToClipboard(formatLab(labValue, precision), 'LAB')
											}
											className='h-8 w-8'
										>
											<Copy className='h-3 w-3' />
										</Button>
									</div>
								</div>

								{/* XYZ */}
								<div className='space-y-2 p-4 rounded-xl bg-gradient-to-br from-primary/5 to-accent/5 border border-border/50'>
									<h4 className='font-medium text-sm text-muted-foreground'>
										XYZ
									</h4>
									<div className='flex items-center justify-between group'>
										<code className='font-mono text-sm'>
											{formatXyz(xyz, precision)}
										</code>
										<Button
											size='icon'
											variant='ghost'
											onClick={() =>
												copyToClipboard(formatXyz(xyz, precision), 'XYZ')
											}
											className='h-8 w-8'
										>
											<Copy className='h-3 w-3' />
										</Button>
									</div>
								</div>

								{/* RGBA with BG */}
								<div className='space-y-2 p-4 rounded-xl bg-gradient-to-br from-primary/5 to-accent/5 border border-border/50'>
									<h4 className='font-medium text-sm text-muted-foreground'>
										RGB with BG
									</h4>
									<div className='flex items-center justify-between group'>
										<code className='font-mono text-sm'>
											{formatRgb(rgbWithBg)}
										</code>
										<Button
											size='icon'
											variant='ghost'
											onClick={() =>
												copyToClipboard(formatRgb(rgbWithBg), 'RGB with BG')
											}
											className='h-8 w-8'
										>
											<Copy className='h-3 w-3' />
										</Button>
									</div>
								</div>
							</div>
						</div>
					</WidgetOutput>
				</WidgetSection>
			</div>

			{/* Settings Section */}
			<WidgetSection
				icon={<Settings2 className='w-5 h-5' />}
				title='Настройки'
				className='mt-6'
			>
				<div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
					{/* Precision */}
					<WidgetInput label='Точность десятичных'>
						<Input
							type='number'
							min='0'
							max='6'
							value={precision}
							onChange={e => setPrecision(parseInt(e.target.value) || 0)}
							className='w-full'
						/>
					</WidgetInput>

					{/* Background Color for RGBA to RGB */}
					<WidgetInput label='Цвет фона (для RGBA → RGB)'>
						<div className='flex items-center gap-2'>
							<div
								className='w-10 h-10 rounded border cursor-pointer flex-shrink-0'
								style={{ backgroundColor: rgbToHex(backgroundColor) }}
								onClick={() => {
									const input = document.createElement('input')
									input.type = 'color'
									input.value = rgbToHex(backgroundColor)
									input.onchange = e => {
										const rgb = hexToRgb((e.target as HTMLInputElement).value)
										if (rgb) setBackgroundColor(rgb)
									}
									input.click()
								}}
							/>
							<Input
								value={rgbToHex(backgroundColor)}
								onChange={e => {
									const rgb = hexToRgb(e.target.value)
									if (rgb) setBackgroundColor(rgb)
								}}
								className='font-mono'
							/>
						</div>
					</WidgetInput>

					{/* Advanced Color Input Fields */}
					<div className='md:col-span-3 space-y-4 pt-4 border-t'>
						<h4 className='font-medium text-sm text-muted-foreground'>
							Advanced Input
						</h4>
						<div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
							{/* CMYK Inputs */}
							<WidgetInput label='CMYK' className='group'>
								<div className='flex items-center gap-2'>
									<div className='flex items-center gap-1 flex-1'>
										<Input
											type='number'
											min='0'
											max='100'
											value={cmykValue.c}
											onChange={e => {
												const newCmyk = {
													...cmykValue,
													c: parseInt(e.target.value) || 0
												}
												setCmykValue(newCmyk)
												updateFromCmyk(newCmyk)
											}}
											className='w-14'
											title='Cyan %'
										/>
										<Input
											type='number'
											min='0'
											max='100'
											value={cmykValue.m}
											onChange={e => {
												const newCmyk = {
													...cmykValue,
													m: parseInt(e.target.value) || 0
												}
												setCmykValue(newCmyk)
												updateFromCmyk(newCmyk)
											}}
											className='w-14'
											title='Magenta %'
										/>
										<Input
											type='number'
											min='0'
											max='100'
											value={cmykValue.y}
											onChange={e => {
												const newCmyk = {
													...cmykValue,
													y: parseInt(e.target.value) || 0
												}
												setCmykValue(newCmyk)
												updateFromCmyk(newCmyk)
											}}
											className='w-14'
											title='Yellow %'
										/>
										<Input
											type='number'
											min='0'
											max='100'
											value={cmykValue.k}
											onChange={e => {
												const newCmyk = {
													...cmykValue,
													k: parseInt(e.target.value) || 0
												}
												setCmykValue(newCmyk)
												updateFromCmyk(newCmyk)
											}}
											className='w-14'
											title='Key/Black %'
										/>
									</div>
									<Button
										size='icon'
										variant='ghost'
										onClick={() =>
											copyToClipboard(formatCmyk(cmykValue), 'CMYK')
										}
										className='opacity-0 group-hover:opacity-100 transition-opacity'
									>
										<Copy className='h-4 w-4' />
									</Button>
								</div>
							</WidgetInput>

							{/* LAB Inputs */}
							<WidgetInput label='LAB' className='group'>
								<div className='flex items-center gap-2'>
									<div className='flex items-center gap-1 flex-1'>
										<Input
											type='number'
											min='0'
											max='100'
											value={labValue.l}
											onChange={e => {
												const newLab = {
													...labValue,
													l: parseInt(e.target.value) || 0
												}
												setLabValue(newLab)
												updateFromLab(newLab)
											}}
											className='w-16'
											title='Lightness'
										/>
										<Input
											type='number'
											min='-128'
											max='127'
											value={labValue.a}
											onChange={e => {
												const newLab = {
													...labValue,
													a: parseInt(e.target.value) || 0
												}
												setLabValue(newLab)
												updateFromLab(newLab)
											}}
											className='w-16'
											title='A (green-red)'
										/>
										<Input
											type='number'
											min='-128'
											max='127'
											value={labValue.b}
											onChange={e => {
												const newLab = {
													...labValue,
													b: parseInt(e.target.value) || 0
												}
												setLabValue(newLab)
												updateFromLab(newLab)
											}}
											className='w-16'
											title='B (blue-yellow)'
										/>
									</div>
									<Button
										size='icon'
										variant='ghost'
										onClick={() =>
											copyToClipboard(formatLab(labValue, precision), 'LAB')
										}
										className='opacity-0 group-hover:opacity-100 transition-opacity'
									>
										<Copy className='h-4 w-4' />
									</Button>
								</div>
							</WidgetInput>
						</div>
					</div>
				</div>
			</WidgetSection>
		</WidgetLayout>
	)
}
