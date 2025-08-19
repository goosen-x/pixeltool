'use client'

import { useState, useEffect } from 'react'
import { useTranslations } from 'next-intl'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Slider } from '@/components/ui/slider'
import {
	ArrowRightLeft,
	Copy,
	RefreshCw,
	Ruler,
	Type,
	Info,
	Settings,
	Monitor,
	Smartphone,
	Tablet
} from 'lucide-react'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'

interface ConversionResult {
	px: number
	rem: number
	em: number
	percent: number
	pt: number
	vw: number
	vh: number
}

interface PresetSize {
	name: string
	px: number
	category: string
}

const PRESET_SIZES: PresetSize[] = [
	// Typography
	{ name: 'Caption', px: 12, category: 'typography' },
	{ name: 'Body Small', px: 14, category: 'typography' },
	{ name: 'Body', px: 16, category: 'typography' },
	{ name: 'H6', px: 18, category: 'typography' },
	{ name: 'H5', px: 20, category: 'typography' },
	{ name: 'H4', px: 24, category: 'typography' },
	{ name: 'H3', px: 28, category: 'typography' },
	{ name: 'H2', px: 32, category: 'typography' },
	{ name: 'H1', px: 36, category: 'typography' },
	{ name: 'Display', px: 48, category: 'typography' },

	// Spacing
	{ name: 'XXS', px: 4, category: 'spacing' },
	{ name: 'XS', px: 8, category: 'spacing' },
	{ name: 'S', px: 12, category: 'spacing' },
	{ name: 'M', px: 16, category: 'spacing' },
	{ name: 'L', px: 24, category: 'spacing' },
	{ name: 'XL', px: 32, category: 'spacing' },
	{ name: 'XXL', px: 48, category: 'spacing' },
	{ name: 'XXXL', px: 64, category: 'spacing' },

	// Common sizes
	{ name: 'Icon Small', px: 16, category: 'common' },
	{ name: 'Icon', px: 24, category: 'common' },
	{ name: 'Icon Large', px: 32, category: 'common' },
	{ name: 'Button Height', px: 40, category: 'common' },
	{ name: 'Input Height', px: 48, category: 'common' },
	{ name: 'Header Height', px: 64, category: 'common' }
]

const SCREEN_SIZES = {
	mobile: { width: 375, label: 'Mobile', icon: Smartphone },
	tablet: { width: 768, label: 'Tablet', icon: Tablet },
	desktop: { width: 1440, label: 'Desktop', icon: Monitor }
}

export default function PxRemConverterPage() {
	const t = useTranslations('widgets.pxRemConverter')
	const [inputValue, setInputValue] = useState<string>('16')
	const [inputUnit, setInputUnit] = useState<'px' | 'rem' | 'em'>('px')
	const [baseFontSize, setBaseFontSize] = useState<number>(16)
	const [parentFontSize, setParentFontSize] = useState<number>(16)
	const [viewportWidth, setViewportWidth] = useState<number>(1440)
	const [result, setResult] = useState<ConversionResult | null>(null)
	const [showAdvanced, setShowAdvanced] = useState(false)

	// Auto-calculate when inputs change
	useEffect(() => {
		if (inputValue) {
			calculateConversion()
		}
	}, [inputValue, inputUnit, baseFontSize, parentFontSize, viewportWidth])

	const calculateConversion = () => {
		const value = parseFloat(inputValue)
		if (isNaN(value)) {
			setResult(null)
			return
		}

		let pxValue: number

		// Convert to px first
		switch (inputUnit) {
			case 'px':
				pxValue = value
				break
			case 'rem':
				pxValue = value * baseFontSize
				break
			case 'em':
				pxValue = value * parentFontSize
				break
			default:
				pxValue = value
		}

		// Calculate all conversions
		const conversion: ConversionResult = {
			px: pxValue,
			rem: pxValue / baseFontSize,
			em: pxValue / parentFontSize,
			percent: (pxValue / parentFontSize) * 100,
			pt: pxValue * 0.75, // 1px = 0.75pt
			vw: (pxValue / viewportWidth) * 100,
			vh: (pxValue / (viewportWidth * 0.5625)) * 100 // Assuming 16:9 aspect ratio
		}

		setResult(conversion)
	}

	const copyValue = (value: number, unit: string) => {
		const formattedValue = formatValue(value) + unit
		navigator.clipboard.writeText(formattedValue)
		toast.success(`Скопировано: ${formattedValue}`)
	}

	const copyAllValues = () => {
		if (!result) return

		const text = `
Конвертация единиц измерения CSS:
Исходное значение: ${inputValue}${inputUnit}

Результаты:
• ${formatValue(result.px)}px
• ${formatValue(result.rem)}rem
• ${formatValue(result.em)}em
• ${formatValue(result.percent)}%
• ${formatValue(result.pt)}pt
• ${formatValue(result.vw)}vw
• ${formatValue(result.vh)}vh

Параметры:
• Базовый размер шрифта: ${baseFontSize}px
• Родительский размер шрифта: ${parentFontSize}px
• Ширина viewport: ${viewportWidth}px
    `.trim()

		navigator.clipboard.writeText(text)
		toast.success('Все значения скопированы!')
	}

	const formatValue = (value: number): string => {
		// Round to 3 decimal places and remove trailing zeros
		const rounded = Math.round(value * 1000) / 1000
		return parseFloat(rounded.toFixed(3)).toString()
	}

	const loadPreset = (preset: PresetSize) => {
		setInputValue(preset.px.toString())
		setInputUnit('px')
		toast.success(`Загружен размер: ${preset.name}`)
	}

	const reset = () => {
		setInputValue('16')
		setInputUnit('px')
		setBaseFontSize(16)
		setParentFontSize(16)
		setViewportWidth(1440)
		setResult(null)
		setShowAdvanced(false)
		toast.success('Параметры сброшены')
	}

	const setScreenSize = (size: keyof typeof SCREEN_SIZES) => {
		setViewportWidth(SCREEN_SIZES[size].width)
		toast.success(`Размер экрана: ${SCREEN_SIZES[size].label}`)
	}

	const generateCSSVariables = () => {
		if (!result) return ''

		return `
/* CSS Variables */
:root {
  --size-value: ${formatValue(result.rem)}rem;
  --size-px: ${formatValue(result.px)}px;
  --size-em: ${formatValue(result.em)}em;
  --size-percent: ${formatValue(result.percent)}%;
  --size-vw: ${formatValue(result.vw)}vw;
  --size-vh: ${formatValue(result.vh)}vh;
}

/* Usage */
.element {
  font-size: var(--size-value);
  padding: calc(var(--size-value) * 0.5);
  margin: var(--size-value);
}
    `.trim()
	}

	const copyCSSVariables = () => {
		const css = generateCSSVariables()
		navigator.clipboard.writeText(css)
		toast.success('CSS переменные скопированы!')
	}

	return (
		<div className='max-w-6xl mx-auto space-y-6'>
			<div className='grid lg:grid-cols-2 gap-6'>
				{/* Input Section */}
				<Card className='p-6'>
					<div className='space-y-4'>
						<div>
							<Label htmlFor='value'>Значение</Label>
							<div className='flex gap-2 mt-1'>
								<Input
									id='value'
									type='number'
									value={inputValue}
									onChange={e => setInputValue(e.target.value)}
									placeholder='16'
									step='0.1'
									className='flex-1'
								/>
								<select
									value={inputUnit}
									onChange={e =>
										setInputUnit(e.target.value as 'px' | 'rem' | 'em')
									}
									aria-label={t('selectUnit')}
									className='px-3 py-2 rounded-md border bg-background'
								>
									<option value='px'>px</option>
									<option value='rem'>rem</option>
									<option value='em'>em</option>
								</select>
							</div>
						</div>

						<div>
							<div className='flex items-center justify-between mb-2'>
								<Label htmlFor='base-font'>Базовый размер шрифта (HTML)</Label>
								<span className='text-sm text-muted-foreground'>
									{baseFontSize}px
								</span>
							</div>
							<Slider
								id='base-font'
								value={[baseFontSize]}
								onValueChange={value => setBaseFontSize(value[0])}
								min={10}
								max={24}
								step={1}
							/>
						</div>

						<Button
							onClick={() => setShowAdvanced(!showAdvanced)}
							variant='outline'
							className='w-full'
						>
							<Settings className='w-4 h-4 mr-2' />
							{showAdvanced ? 'Скрыть' : 'Показать'} дополнительные настройки
						</Button>

						{showAdvanced && (
							<>
								<div>
									<div className='flex items-center justify-between mb-2'>
										<Label htmlFor='parent-font'>
											Родительский размер шрифта (для em)
										</Label>
										<span className='text-sm text-muted-foreground'>
											{parentFontSize}px
										</span>
									</div>
									<Slider
										id='parent-font'
										value={[parentFontSize]}
										onValueChange={value => setParentFontSize(value[0])}
										min={10}
										max={32}
										step={1}
									/>
								</div>

								<div>
									<Label htmlFor='viewport'>Ширина viewport (для vw)</Label>
									<div className='flex gap-2 mt-1'>
										<Input
											id='viewport'
											type='number'
											value={viewportWidth}
											onChange={e =>
												setViewportWidth(parseInt(e.target.value) || 1440)
											}
											className='flex-1'
										/>
										<div className='flex gap-1'>
											{Object.entries(SCREEN_SIZES).map(([key, size]) => (
												<Button
													key={key}
													onClick={() =>
														setScreenSize(key as keyof typeof SCREEN_SIZES)
													}
													variant='outline'
													size='icon'
													title={size.label}
												>
													<size.icon className='w-4 h-4' />
												</Button>
											))}
										</div>
									</div>
								</div>
							</>
						)}

						<div className='flex gap-2'>
							<Button
								onClick={copyAllValues}
								variant='outline'
								disabled={!result}
							>
								<Copy className='w-4 h-4 mr-2' />
								Копировать все
							</Button>
							<Button onClick={reset} variant='outline'>
								<RefreshCw className='w-4 h-4 mr-2' />
								Сбросить
							</Button>
						</div>
					</div>
				</Card>

				{/* Results */}
				{result && (
					<Card className='p-6'>
						<h3 className='font-semibold mb-4 flex items-center gap-2'>
							<ArrowRightLeft className='w-5 h-5' />
							Результаты конвертации
						</h3>

						<div className='space-y-3'>
							{Object.entries(result).map(([unit, value]) => (
								<div
									key={unit}
									className={cn(
										'flex items-center justify-between p-3 rounded-lg border',
										inputUnit === unit && 'bg-primary/10 border-primary/20'
									)}
								>
									<div className='flex items-center gap-3'>
										<Badge variant='outline'>{unit.toUpperCase()}</Badge>
										<span className='font-mono text-lg'>
											{formatValue(value)}
											{unit}
										</span>
									</div>
									<Button
										onClick={() => copyValue(value, unit)}
										variant='ghost'
										size='icon'
									>
										<Copy className='w-4 h-4' />
									</Button>
								</div>
							))}
						</div>

						{showAdvanced && (
							<div className='mt-4 pt-4 border-t'>
								<Button
									onClick={copyCSSVariables}
									variant='outline'
									className='w-full'
								>
									<Copy className='w-4 h-4 mr-2' />
									Копировать как CSS переменные
								</Button>
							</div>
						)}
					</Card>
				)}
			</div>

			{/* Preset Sizes */}
			<Card className='p-6'>
				<h3 className='font-semibold mb-4 flex items-center gap-2'>
					<Type className='w-5 h-5' />
					Часто используемые размеры
				</h3>

				<div className='space-y-4'>
					{/* Typography Presets */}
					<div>
						<h4 className='text-sm font-medium text-muted-foreground mb-2'>
							Типографика
						</h4>
						<div className='flex flex-wrap gap-2'>
							{PRESET_SIZES.filter(p => p.category === 'typography').map(
								preset => (
									<Button
										key={preset.name}
										onClick={() => loadPreset(preset)}
										variant='outline'
										size='sm'
									>
										{preset.name} ({preset.px}px)
									</Button>
								)
							)}
						</div>
					</div>

					{/* Spacing Presets */}
					<div>
						<h4 className='text-sm font-medium text-muted-foreground mb-2'>
							Отступы
						</h4>
						<div className='flex flex-wrap gap-2'>
							{PRESET_SIZES.filter(p => p.category === 'spacing').map(
								preset => (
									<Button
										key={preset.name}
										onClick={() => loadPreset(preset)}
										variant='outline'
										size='sm'
									>
										{preset.name} ({preset.px}px)
									</Button>
								)
							)}
						</div>
					</div>

					{/* Common Sizes */}
					<div>
						<h4 className='text-sm font-medium text-muted-foreground mb-2'>
							Общие размеры
						</h4>
						<div className='flex flex-wrap gap-2'>
							{PRESET_SIZES.filter(p => p.category === 'common').map(preset => (
								<Button
									key={preset.name}
									onClick={() => loadPreset(preset)}
									variant='outline'
									size='sm'
								>
									{preset.name} ({preset.px}px)
								</Button>
							))}
						</div>
					</div>
				</div>
			</Card>

			{/* Conversion Table */}
			<Card className='p-6'>
				<h3 className='font-semibold mb-4'>Таблица популярных значений</h3>

				<div className='overflow-x-auto'>
					<table className='w-full text-sm'>
						<thead>
							<tr className='border-b'>
								<th className='text-left p-2'>PX</th>
								<th className='text-left p-2'>REM</th>
								<th className='text-left p-2'>EM</th>
								<th className='text-left p-2'>%</th>
								<th className='text-left p-2'>PT</th>
							</tr>
						</thead>
						<tbody>
							{[8, 10, 12, 14, 16, 18, 20, 24, 28, 32, 36, 40, 48, 64].map(
								px => (
									<tr key={px} className='border-b hover:bg-muted/30'>
										<td className='p-2 font-mono'>{px}px</td>
										<td className='p-2 font-mono'>
											{formatValue(px / baseFontSize)}rem
										</td>
										<td className='p-2 font-mono'>
											{formatValue(px / parentFontSize)}em
										</td>
										<td className='p-2 font-mono'>
											{formatValue((px / parentFontSize) * 100)}%
										</td>
										<td className='p-2 font-mono'>
											{formatValue(px * 0.75)}pt
										</td>
									</tr>
								)
							)}
						</tbody>
					</table>
				</div>
			</Card>

			{/* CSS Variables Example */}
			{result && showAdvanced && (
				<Card className='p-6 bg-muted/50'>
					<h3 className='font-semibold mb-4'>Пример CSS переменных</h3>
					<pre className='bg-background p-4 rounded-lg overflow-x-auto'>
						<code className='text-sm'>{generateCSSVariables()}</code>
					</pre>
				</Card>
			)}

			{/* Info */}
			<Card className='p-6 bg-muted/50'>
				<h3 className='font-semibold mb-4 flex items-center gap-2'>
					<Info className='w-4 h-4' />О единицах измерения CSS
				</h3>
				<div className='grid md:grid-cols-3 gap-6 text-sm'>
					<div>
						<h4 className='font-medium mb-2'>Абсолютные единицы</h4>
						<ul className='text-muted-foreground space-y-1'>
							<li>
								• <strong>px</strong> - пиксели, фиксированный размер
							</li>
							<li>
								• <strong>pt</strong> - пункты (1pt = 1/72 дюйма)
							</li>
							<li>
								• <strong>cm, mm, in</strong> - физические единицы
							</li>
						</ul>
					</div>
					<div>
						<h4 className='font-medium mb-2'>Относительные единицы</h4>
						<ul className='text-muted-foreground space-y-1'>
							<li>
								• <strong>rem</strong> - относительно корневого элемента
							</li>
							<li>
								• <strong>em</strong> - относительно родительского элемента
							</li>
							<li>
								• <strong>%</strong> - процент от родителя
							</li>
							<li>
								• <strong>vw/vh</strong> - процент от viewport
							</li>
						</ul>
					</div>
					<div>
						<h4 className='font-medium mb-2'>Рекомендации</h4>
						<ul className='text-muted-foreground space-y-1'>
							<li>• Используйте rem для типографики</li>
							<li>• Применяйте em для отступов компонентов</li>
							<li>• Избегайте px для адаптивного дизайна</li>
							<li>• Комбинируйте единицы для гибкости</li>
						</ul>
					</div>
				</div>
			</Card>
		</div>
	)
}
