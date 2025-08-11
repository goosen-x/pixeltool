'use client'

import { useState, useEffect } from 'react'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Copy, Check, AlertCircle, HelpCircle } from 'lucide-react'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { toast } from 'sonner'
import { useTranslations } from 'next-intl'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { useLocale } from 'next-intl'

export default function ClampCalculatorPage() {
	const locale = useLocale() as 'en' | 'ru'
	const t = useTranslations('widgets.clampCalculator')
	const [unit, setUnit] = useState<'px' | 'rem'>('rem')
	const [minValue, setMinValue] = useState<number | ''>('')
	const [maxValue, setMaxValue] = useState<number | ''>('')
	const [minViewport, setMinViewport] = useState<number | ''>('')
	const [maxViewport, setMaxViewport] = useState<number | ''>('')
	const [copied, setCopied] = useState(false)
	const [errors, setErrors] = useState<string[]>([])

	const toRem = (value: number) => +(value / 16).toFixed(3)
	const toPx = (value: number) => +(value * 16).toFixed(3)

	const numMinValue = typeof minValue === 'number' ? minValue : 16
	const numMaxValue = typeof maxValue === 'number' ? maxValue : 24
	const numMinViewport = typeof minViewport === 'number' ? minViewport : 375
	const numMaxViewport = typeof maxViewport === 'number' ? maxViewport : 1440
	
	const variablePart = (numMaxValue - numMinValue) / (numMaxViewport - numMinViewport)
	const constant = parseFloat(((numMaxValue - numMaxViewport * variablePart) / 16).toFixed(3))
	
	const result = `clamp(${toRem(numMinValue)}rem,${constant ? ` ${constant}rem +` : ''} ${parseFloat((100 * variablePart).toFixed(2))}vw, ${toRem(numMaxValue)}rem)`

	const validate = () => {
		const newErrors: string[] = []
		
		if (typeof minViewport === 'number' && typeof maxViewport === 'number' && (minViewport < 0 || maxViewport < 1)) {
			newErrors.push(t('errors.viewportValues'))
		}
		if (typeof minValue === 'number' && typeof maxValue === 'number' && minValue >= maxValue) {
			newErrors.push(t('errors.minMax'))
		}
		if (typeof minViewport === 'number' && typeof maxViewport === 'number' && minViewport >= maxViewport) {
			newErrors.push(t('errors.minMaxViewport'))
		}
		if ([minValue, maxValue, minViewport, maxViewport].some(v => v === '')) {
			newErrors.push(t('errors.allFields'))
		}
		
		setErrors(newErrors)
	}

	const copyToClipboard = async () => {
		try {
			await navigator.clipboard.writeText(result)
			setCopied(true)
			setTimeout(() => setCopied(false), 2000)
			toast.success(t('toast.copied'))
		} catch (err) {
			toast.error(t('toast.copyError'))
		}
	}

	const handleValueChange = (value: string, setter: (v: number | '') => void) => {
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
	}, [minValue, maxValue, minViewport, maxViewport])

	// Save to URL
	useEffect(() => {
		if ([minValue, maxValue, minViewport, maxViewport].some(v => v === '')) return
		
		const params = new URLSearchParams()
		params.set('values', `${minValue},${maxValue},${minViewport},${maxViewport}`)
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

	return (
		<>
			<div className="grid gap-6 md:grid-cols-2">
				<Card className="p-6">
					<div className="flex items-center justify-between mb-4">
						<h3 className="font-semibold">{t('values')}</h3>
						<RadioGroup value={unit} onValueChange={(v) => setUnit(v as 'px' | 'rem')}>
							<div className="flex items-center space-x-4">
								<div className="flex items-center space-x-2">
									<RadioGroupItem value="px" id="px" />
									<Label htmlFor="px">px</Label>
								</div>
								<div className="flex items-center space-x-2">
									<RadioGroupItem value="rem" id="rem" />
									<Label htmlFor="rem">rem</Label>
								</div>
							</div>
						</RadioGroup>
					</div>

					<div className="grid grid-cols-2 gap-4">
						<div>
							<div className="flex items-center gap-1 mb-2">
								<Label htmlFor="min-value">{t('min')}</Label>
								<TooltipProvider>
									<Tooltip>
										<TooltipTrigger asChild>
											<HelpCircle className="h-3.5 w-3.5 text-muted-foreground" />
										</TooltipTrigger>
										<TooltipContent className="max-w-[200px]">
											<p className="text-xs">{t('tooltips.negative')}</p>
										</TooltipContent>
									</Tooltip>
								</TooltipProvider>
							</div>
							<div className="relative">
								<Input
									id="min-value"
									type="number"
									step="any"
									value={minValue === '' ? '' : (unit === 'px' ? minValue : toRem(minValue as number))}
									onChange={(e) => handleValueChange(e.target.value, setMinValue)}
									className="pr-12 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
								/>
								<span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
									{unit}
								</span>
							</div>
						</div>

						<div>
							<Label htmlFor="max-value">{t('max')}</Label>
							<div className="relative">
								<Input
									id="max-value"
									type="number"
									step="any"
									value={maxValue === '' ? '' : (unit === 'px' ? maxValue : toRem(maxValue as number))}
									onChange={(e) => handleValueChange(e.target.value, setMaxValue)}
									className="pr-12 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
								/>
								<span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
									{unit}
								</span>
							</div>
						</div>
					</div>
				</Card>

				<Card className="p-6">
					<h3 className="font-semibold mb-4">{t('viewport')}</h3>
					<div className="grid grid-cols-2 gap-4">
						<div>
							<Label htmlFor="min-viewport">{t('min')}</Label>
							<div className="relative">
								<Input
									id="min-viewport"
									type="number"
									step="any"
									min="0"
									value={minViewport}
									onChange={(e) => setMinViewport(e.target.value === '' ? '' : parseFloat(e.target.value))}
									className="pr-12 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
								/>
								<span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
									px
								</span>
							</div>
						</div>

						<div>
							<Label htmlFor="max-viewport">{t('max')}</Label>
							<div className="relative">
								<Input
									id="max-viewport"
									type="number"
									step="any"
									min="0"
									value={maxViewport}
									onChange={(e) => setMaxViewport(e.target.value === '' ? '' : parseFloat(e.target.value))}
									className="pr-12 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
								/>
								<span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
									px
								</span>
							</div>
						</div>
					</div>
				</Card>
			</div>

			{errors.length > 0 && (
				<Alert variant="destructive" className="mt-6">
					<AlertCircle className="h-4 w-4" />
					<AlertDescription>
						<strong>{t('errors.title')}</strong>
						<ul className="list-disc list-inside mt-2">
							{errors.map((error, index) => (
								<li key={index}>{error}</li>
							))}
						</ul>
					</AlertDescription>
				</Alert>
			)}

			<Card className="mt-6 p-6">
				<h3 className="font-semibold mb-4">{t('result')}</h3>
				<div className="bg-secondary rounded-lg p-4 font-mono text-sm flex items-center justify-between">
					<span className="text-secondary-foreground">{result}</span>
					<Button
						size="sm"
						variant="outline"
						onClick={copyToClipboard}
						className="ml-4 hover:bg-accent hover:text-white"
					>
						{copied ? (
							<Check className="h-4 w-4 text-green-500" />
						) : (
							<Copy className="h-4 w-4" />
						)}
					</Button>
				</div>
			</Card>

			<Card className="mt-6 p-6">
				<h3 className="font-semibold mb-4">{t('liveExample')}</h3>
				<p 
					className="text-lg leading-relaxed"
					style={{ fontSize: result }}
					contentEditable
					suppressContentEditableWarning
				>
					{t('liveExampleText')}
				</p>
			</Card>
		</>
	)
}