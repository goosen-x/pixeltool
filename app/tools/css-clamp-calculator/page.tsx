'use client'

import { useState, useEffect, useCallback } from 'react'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Copy, Check, AlertCircle, HelpCircle } from 'lucide-react'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { toast } from 'sonner'
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger
} from '@/components/ui/tooltip'
import { useWidgetKeyboard } from '@/lib/hooks/useWidgetKeyboard'

export default function ClampCalculatorPage() {

	const [unit, setUnit] = useState<'px' | 'rem'>('rem')
	const [property, setProperty] = useState<'font-size' | 'margin' | 'padding'>(
		'font-size'
	)
	const [minValue, setMinValue] = useState<number | ''>('')
	const [maxValue, setMaxValue] = useState<number | ''>('')
	const [minViewport, setMinViewport] = useState<number | ''>('')
	const [maxViewport, setMaxViewport] = useState<number | ''>('')
	const [copied, setCopied] = useState(false)
	const [copiedTailwind, setCopiedTailwind] = useState(false)
	const [errors, setErrors] = useState<string[]>([])

	const toRem = (value: number) => +(value / 16).toFixed(3)
	const toPx = (value: number) => +(value * 16).toFixed(3)

	const numMinValue = typeof minValue === 'number' ? minValue : 16
	const numMaxValue = typeof maxValue === 'number' ? maxValue : 24
	const numMinViewport = typeof minViewport === 'number' ? minViewport : 375
	const numMaxViewport = typeof maxViewport === 'number' ? maxViewport : 1440

	const variablePart =
		(numMaxValue - numMinValue) / (numMaxViewport - numMinViewport)
	const constant = parseFloat(
		((numMaxValue - numMaxViewport * variablePart) / 16).toFixed(3)
	)

	const clampValue = `clamp(${toRem(numMinValue)}rem,${constant ? ` ${constant}rem +` : ''} ${parseFloat((100 * variablePart).toFixed(2))}vw, ${toRem(numMaxValue)}rem)`

	const result = `${property}: ${clampValue};`

	// Convert to Tailwind CSS format
	const minRemValue = toRem(numMinValue)
	const maxRemValue = toRem(numMaxValue)
	const constantRem = constant
	const vwValue = parseFloat((100 * variablePart).toFixed(2))

	// Map properties to Tailwind classes
	const tailwindPrefixMap = {
		'font-size': 'text',
		margin: 'm',
		padding: 'p'
	}

	const tailwindPrefix = tailwindPrefixMap[property]
	const tailwindResult = `${tailwindPrefix}-[clamp(${minRemValue}rem,_${constantRem ? `${constantRem}rem_+_` : ''}${vwValue}vw,_${maxRemValue}rem)]`

	const validate = useCallback(() => {
		const newErrors: string[] = []

		if (
			typeof minViewport === 'number' &&
			typeof maxViewport === 'number' &&
			(minViewport < 0 || maxViewport < 1)
		) {
			newErrors.push('Значения viewport должны быть положительными')
		}
		if (
			typeof minValue === 'number' &&
			typeof maxValue === 'number' &&
			minValue >= maxValue
		) {
			newErrors.push('Минимальное значение должно быть меньше максимального')
		}
		if (
			typeof minViewport === 'number' &&
			typeof maxViewport === 'number' &&
			minViewport >= maxViewport
		) {
			newErrors.push(
				'Минимальная ширина viewport должна быть меньше максимальной'
			)
		}
		if ([minValue, maxValue, minViewport, maxViewport].some(v => v === '')) {
			newErrors.push('Все поля должны быть заполнены')
		}

		setErrors(newErrors)
	}, [minValue, maxValue, minViewport, maxViewport])

	const copyToClipboard = async () => {
		try {
			await navigator.clipboard.writeText(result)
			setCopied(true)
			setTimeout(() => setCopied(false), 2000)
			toast.success('CSS значение скопировано в буфер обмена')
		} catch (err) {
			toast.error('Ошибка копирования')
		}
	}

	const copyTailwindToClipboard = async () => {
		try {
			await navigator.clipboard.writeText(tailwindResult)
			setCopiedTailwind(true)
			setTimeout(() => setCopiedTailwind(false), 2000)
			toast.success('Tailwind класс скопирован в буфер обмена')
		} catch (err) {
			toast.error('Ошибка копирования')
		}
	}

	// Functions for keyboard shortcuts
	const resetForm = useCallback(() => {
		setMinValue(16)
		setMaxValue(24)
		setMinViewport(375)
		setMaxViewport(1440)
		setUnit('rem')
		setProperty('font-size')
		toast.success('Форма сброшена')
	}, [])

	const switchUnit = useCallback(() => {
		setUnit(prev => (prev === 'px' ? 'rem' : 'px'))
		toast.info(`Переключено на ${unit === 'px' ? 'rem' : 'px'}`)
	}, [unit])

	const switchProperty = useCallback(() => {
		const properties: Array<'font-size' | 'margin' | 'padding'> = [
			'font-size',
			'margin',
			'padding'
		]
		const currentIndex = properties.indexOf(property)
		const nextIndex = (currentIndex + 1) % properties.length
		setProperty(properties[nextIndex])
		toast.info(`Переключено на ${properties[nextIndex]}`)
	}, [property])

	const handleValueChange = (
		value: string,
		setter: (v: number | '') => void
	) => {
		if (value === '') {
			setter('')
			return
		}
		const numValue = parseFloat(value)
		if (isNaN(numValue)) return

		if (unit === 'rem') {
			setter(toPx(numValue))
		} else {
			setter(numValue)
		}
	}

	useEffect(() => {
		validate()
	}, [validate])

	// Save to URL
	useEffect(() => {
		if ([minValue, maxValue, minViewport, maxViewport].some(v => v === ''))
			return

		const params = new URLSearchParams()
		params.set(
			'values',
			`${minValue},${maxValue},${minViewport},${maxViewport}`
		)
		window.history.replaceState({}, '', `?${params.toString()}`)
	}, [minValue, maxValue, minViewport, maxViewport])

	// Load from URL
	useEffect(() => {
		const params = new URLSearchParams(window.location.search)
		const values = params.get('values')?.split(',').map(Number)

		if (values && values.length === 4 && values.every(v => !isNaN(v))) {
			setMinValue(values[0])
			setMaxValue(values[1])
			setMinViewport(values[2])
			setMaxViewport(values[3])
		} else {
			// Set default values when no URL params
			setMinValue(16)
			setMaxValue(24)
			setMinViewport(375)
			setMaxViewport(1440)
		}
	}, [])

	// Keyboard shortcuts
	useWidgetKeyboard({
		widgetId: 'css-clamp-calculator',
		shortcuts: [
			{
				key: '1',
				primary: true,
				description: 'Copy CSS',
				action: copyToClipboard
			},
			{
				key: '2',
				primary: true,
				description: 'Copy Tailwind',
				action: copyTailwindToClipboard
			},
			{
				key: '0',
				primary: true,
				description: 'Reset',
				action: resetForm
			},
			{
				key: 'u',
				primary: true,
				shift: true,
				description: 'Switch Units',
				action: switchUnit
			},
			{
				key: 'p',
				primary: true,
				shift: true,
				description: 'Switch Property',
				action: switchProperty
			}
		]
	})

	return (
		<>
			<div className='grid gap-6 md:grid-cols-2'>
				<Card className='p-6'>
					<div className='flex items-center justify-between mb-4'>
						<h3 className='font-semibold'>Значения</h3>
						<RadioGroup
							value={unit}
							onValueChange={v => setUnit(v as 'px' | 'rem')}
						>
							<div className='flex items-center space-x-4'>
								<div className='flex items-center space-x-2'>
									<RadioGroupItem value='px' id='px' />
									<Label htmlFor='px'>px</Label>
								</div>
								<div className='flex items-center space-x-2'>
									<RadioGroupItem value='rem' id='rem' />
									<Label htmlFor='rem'>rem</Label>
								</div>
							</div>
						</RadioGroup>
					</div>

					<div className='grid grid-cols-2 gap-4'>
						<div>
							<div className='flex items-center gap-1 mb-2'>
								<Label htmlFor='min-value'>Минимум</Label>
								<TooltipProvider>
									<Tooltip>
										<TooltipTrigger asChild>
											<HelpCircle className='h-3.5 w-3.5 text-muted-foreground' />
										</TooltipTrigger>
										<TooltipContent className='max-w-[200px]'>
											<p className='text-xs'>Может быть отрицательным</p>
										</TooltipContent>
									</Tooltip>
								</TooltipProvider>
							</div>
							<div className='relative'>
								<Input
									id='min-value'
									type='number'
									step='any'
									value={
										minValue === ''
											? ''
											: unit === 'px'
												? minValue
												: toRem(minValue as number)
									}
									onChange={e => handleValueChange(e.target.value, setMinValue)}
									className='pr-12 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none'
								/>
								<span className='absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground'>
									{unit}
								</span>
							</div>
						</div>

						<div>
							<Label htmlFor='max-value'>Максимум</Label>
							<div className='relative'>
								<Input
									id='max-value'
									type='number'
									step='any'
									value={
										maxValue === ''
											? ''
											: unit === 'px'
												? maxValue
												: toRem(maxValue as number)
									}
									onChange={e => handleValueChange(e.target.value, setMaxValue)}
									className='pr-12 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none'
								/>
								<span className='absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground'>
									{unit}
								</span>
							</div>
						</div>
					</div>
				</Card>

				<Card className='p-6'>
					<h3 className='font-semibold mb-4'>Viewport</h3>
					<div className='grid grid-cols-2 gap-4'>
						<div>
							<Label htmlFor='min-viewport'>Минимум</Label>
							<div className='relative'>
								<Input
									id='min-viewport'
									type='number'
									step='any'
									min='0'
									value={minViewport}
									onChange={e =>
										setMinViewport(
											e.target.value === '' ? '' : parseFloat(e.target.value)
										)
									}
									className='pr-12 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none'
								/>
								<span className='absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground'>
									px
								</span>
							</div>
						</div>

						<div>
							<Label htmlFor='max-viewport'>Максимум</Label>
							<div className='relative'>
								<Input
									id='max-viewport'
									type='number'
									step='any'
									min='0'
									value={maxViewport}
									onChange={e =>
										setMaxViewport(
											e.target.value === '' ? '' : parseFloat(e.target.value)
										)
									}
									className='pr-12 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none'
								/>
								<span className='absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground'>
									px
								</span>
							</div>
						</div>
					</div>
				</Card>
			</div>

			{errors.length > 0 && (
				<Alert variant='destructive' className='mt-6'>
					<AlertCircle className='h-4 w-4' />
					<AlertDescription>
						<strong>Ошибки</strong>
						<ul className='list-disc list-inside mt-2'>
							{errors.map((error, index) => (
								<li key={index}>{error}</li>
							))}
						</ul>
					</AlertDescription>
				</Alert>
			)}

			<Card className='mt-6 p-6'>
				<div className='flex items-start justify-between mb-4'>
					<h3 className='font-semibold'>Результат</h3>
					<div>
						<RadioGroup
							value={property}
							onValueChange={v =>
								setProperty(v as 'font-size' | 'margin' | 'padding')
							}
							className='flex items-center space-x-3'
						>
							<div className='flex items-center space-x-2'>
								<RadioGroupItem value='font-size' id='font-size' />
								<Label htmlFor='font-size' className='text-sm cursor-pointer'>
									font-size
								</Label>
							</div>
							<div className='flex items-center space-x-2'>
								<RadioGroupItem value='margin' id='margin' />
								<Label htmlFor='margin' className='text-sm cursor-pointer'>
									margin
								</Label>
							</div>
							<div className='flex items-center space-x-2'>
								<RadioGroupItem value='padding' id='padding' />
								<Label htmlFor='padding' className='text-sm cursor-pointer'>
									padding
								</Label>
							</div>
						</RadioGroup>
					</div>
				</div>

				<div className='grid md:grid-cols-2 gap-4'>
					{/* CSS Result */}
					<div>
						<div className='flex items-center justify-between mb-2'>
							<Label className='text-sm text-muted-foreground'>CSS</Label>
							<Button
								size='sm'
								variant='ghost'
								onClick={copyToClipboard}
								className='h-8 px-2 hover:bg-accent hover:text-white'
							>
								{copied ? (
									<Check className='h-3 w-3 text-green-500' />
								) : (
									<Copy className='h-3 w-3' />
								)}
							</Button>
						</div>
						<div className='bg-secondary rounded-lg p-4'>
							<span className='text-secondary-foreground break-all font-mono text-xs'>
								{result}
							</span>
						</div>
					</div>

					{/* Tailwind Result */}
					<div>
						<div className='flex items-center justify-between mb-2'>
							<Label className='text-sm text-muted-foreground'>
								Tailwind CSS
							</Label>
							<Button
								size='sm'
								variant='ghost'
								onClick={copyTailwindToClipboard}
								className='h-8 px-2 hover:bg-accent hover:text-white'
							>
								{copiedTailwind ? (
									<Check className='h-3 w-3 text-green-500' />
								) : (
									<Copy className='h-3 w-3' />
								)}
							</Button>
						</div>
						<div className='bg-secondary rounded-lg p-4'>
							<span className='text-secondary-foreground break-all font-mono text-xs'>
								{tailwindResult}
							</span>
						</div>
					</div>
				</div>
			</Card>

			<Card className='mt-6 p-6'>
				<h3 className='font-semibold mb-4'>Пример в действии</h3>
				<p
					className='text-lg leading-relaxed'
					style={{ [property]: clampValue }}
					contentEditable
					suppressContentEditableWarning
				>
					Этот текст демонстрирует динамическое изменение размера
				</p>
			</Card>
		</>
	)
}
