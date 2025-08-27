'use client'

import { useState, useEffect, useCallback } from 'react'
import {
	Calculator,
	Percent,
	TrendingUp,
	TrendingDown,
	Plus,
	Minus,
	Copy,
	RefreshCw,
	ArrowUpDown,
	History,
	Sparkles,
	Target,
	Zap,
	X,
	Check
} from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger
} from '@/components/ui/tooltip'
import { WidgetKeyboardShortcuts, ShortcutHint } from '@/components/widgets'
import {
	useWidgetKeyboard,
	commonWidgetShortcuts,
	type KeyboardShortcut
} from '@/lib/hooks/useWidgetKeyboard'
import {
	usePercentageCalculator,
	type CalculationType
} from '@/lib/hooks/widgets'
import { cn } from '@/lib/utils'
import { useTranslations } from 'next-intl'
import { toast } from 'sonner'
import { motion, AnimatePresence } from 'framer-motion'

// Quick preset percentages
const QUICK_PRESETS = [5, 10, 15, 20, 25, 50]

// Card configurations for each calculator type
const CALCULATOR_CARDS = [
	{
		id: 'percentOfNumber' as CalculationType,
		icon: Calculator,
		gradient: 'from-blue-500 to-blue-600',
		bgGradient: 'from-blue-500/10 to-blue-600/10',
		iconColor: 'text-blue-600'
	},
	{
		id: 'whatPercent' as CalculationType,
		icon: Percent,
		gradient: 'from-purple-500 to-purple-600',
		bgGradient: 'from-purple-500/10 to-purple-600/10',
		iconColor: 'text-purple-600'
	},
	{
		id: 'findTotal' as CalculationType,
		icon: Target,
		gradient: 'from-green-500 to-green-600',
		bgGradient: 'from-green-500/10 to-green-600/10',
		iconColor: 'text-green-600'
	},
	{
		id: 'percentChange' as CalculationType,
		icon: Percent,
		gradient: 'from-orange-500 to-orange-600',
		bgGradient: 'from-orange-500/10 to-orange-600/10',
		iconColor: 'text-orange-600'
	},
	{
		id: 'addPercent' as CalculationType,
		icon: Plus,
		gradient: 'from-pink-500 to-pink-600',
		bgGradient: 'from-pink-500/10 to-pink-600/10',
		iconColor: 'text-pink-600'
	},
	{
		id: 'subtractPercent' as CalculationType,
		icon: Minus,
		gradient: 'from-red-500 to-red-600',
		bgGradient: 'from-red-500/10 to-red-600/10',
		iconColor: 'text-red-600'
	}
]

export default function PercentageCalculatorPage() {
	const t = useTranslations('widgets.percentageCalculator')
	const [mounted, setMounted] = useState(false)
	const [recentCalculations, setRecentCalculations] = useState<
		Array<{
			id: string
			type: CalculationType
			result: string
			timestamp: Date
		}>
	>([])
	const [selectedPreset, setSelectedPreset] = useState<number | null>(null)
	const [copiedId, setCopiedId] = useState<string | null>(null)

	// Use the percentage calculator hook
	const { values, results, updateValue, copyResult, reset, loadExample } =
		usePercentageCalculator()

	// Load recent calculations from localStorage
	useEffect(() => {
		setMounted(true)
		const saved = localStorage.getItem('percentage-recent')
		if (saved) {
			try {
				const parsed = JSON.parse(saved)
				setRecentCalculations(
					parsed.map((item: any) => ({
						...item,
						timestamp: new Date(item.timestamp)
					}))
				)
			} catch {}
		}
	}, [])

	// Save calculation to recent
	const saveToRecent = useCallback(
		(type: CalculationType, result: string) => {
			const newCalc = {
				id: Date.now().toString(),
				type,
				result,
				timestamp: new Date()
			}
			const updated = [newCalc, ...recentCalculations].slice(0, 5)
			setRecentCalculations(updated)
			localStorage.setItem('percentage-recent', JSON.stringify(updated))
		},
		[recentCalculations]
	)

	// Apply preset percentage
	const applyPreset = useCallback(
		(preset: number) => {
			setSelectedPreset(preset)
			// Apply preset to all relevant percentage fields
			updateValue('percentOfPercentage', preset.toString())
			updateValue('findTotalPercentage', preset.toString())
			updateValue('addSubtractPercentage', preset.toString())
			toast.success(t('toast.presetApplied', { preset }))
		},
		[updateValue]
	)

	// Enhanced copy with animation
	const copyWithAnimation = useCallback((id: string, text: string) => {
		navigator.clipboard.writeText(text)
		setCopiedId(id)
		setTimeout(() => setCopiedId(null), 2000)
		toast.success(t('toast.copied'))
	}, [])

	// Clear all calculations
	const clearAll = useCallback(() => {
		reset()
		setSelectedPreset(null)
		toast.success(t('toast.allCleared'))
	}, [reset])

	// Clear recent history
	const clearRecent = useCallback(() => {
		setRecentCalculations([])
		localStorage.removeItem('percentage-recent')
		toast.success(t('toast.historyCleared'))
	}, [])

	// Keyboard shortcuts
	const shortcuts: KeyboardShortcut[] = [
		{
			...commonWidgetShortcuts.reset,
			action: clearAll
		},
		{
			key: 'h',
			ctrl: true,
			description: 'Clear history',
			action: clearRecent
		},
		// Preset shortcuts
		...QUICK_PRESETS.map((preset, index) => ({
			key: (index + 1).toString(),
			alt: true,
			description: `Apply ${preset}%`,
			action: () => applyPreset(preset)
		}))
	]

	useWidgetKeyboard({
		shortcuts,
		widgetId: 'percentage-calculator',
		enabled: true
	})

	if (!mounted) {
		return null
	}

	return (
		<TooltipProvider>
			<div className='max-w-7xl mx-auto space-y-6'>
				{/* Quick Presets Bar */}
				<Card className='p-4 bg-gradient-to-r from-primary/5 to-primary/10 border-primary/20'>
					<div className='flex flex-wrap items-center gap-4'>
						<div className='flex items-center gap-2'>
							<Sparkles className='w-5 h-5 text-primary' />
							<span className='font-semibold text-sm'>{t('quickPresets')}</span>
						</div>
						<div className='flex flex-wrap gap-2'>
							{QUICK_PRESETS.map(preset => (
								<motion.div
									key={preset}
									whileHover={{ scale: 1.05 }}
									whileTap={{ scale: 0.95 }}
								>
									<Button
										size='sm'
										variant={selectedPreset === preset ? 'default' : 'outline'}
										onClick={() => applyPreset(preset)}
										className={cn(
											'font-bold transition-all',
											selectedPreset === preset && 'shadow-lg'
										)}
									>
										{preset}%
									</Button>
								</motion.div>
							))}
						</div>
						<div className='ml-auto'>
							<Button
								size='sm'
								variant='ghost'
								onClick={clearAll}
								className='text-muted-foreground hover:text-foreground'
							>
								<RefreshCw className='w-4 h-4 mr-2' />
								{t('buttons.reset')}
							</Button>
						</div>
					</div>
				</Card>

				{/* Calculator Grid */}
				<div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
					{CALCULATOR_CARDS.map(card => (
						<CalculatorCard
							key={card.id}
							type={card.id}
							icon={card.icon}
							gradient={card.gradient}
							bgGradient={card.bgGradient}
							iconColor={card.iconColor}
							values={values}
							result={results[card.id]}
							updateValue={updateValue}
							saveToRecent={saveToRecent}
							copyWithAnimation={copyWithAnimation}
							copiedId={copiedId}
							t={t}
							loadExample={loadExample}
						/>
					))}
				</div>

				{/* Recent Calculations */}
				{recentCalculations.length > 0 && (
					<Card className='p-4 bg-muted/50'>
						<div className='flex items-center justify-between mb-3'>
							<div className='flex items-center gap-2'>
								<History className='w-5 h-5 text-muted-foreground' />
								<h3 className='font-semibold text-sm'>{t('recent.title')}</h3>
							</div>
							<Button
								size='sm'
								variant='ghost'
								onClick={clearRecent}
								className='text-muted-foreground hover:text-foreground'
							>
								<X className='w-4 h-4' />
							</Button>
						</div>
						<div className='space-y-2'>
							{recentCalculations.map(calc => (
								<motion.div
									key={calc.id}
									initial={{ opacity: 0, x: -20 }}
									animate={{ opacity: 1, x: 0 }}
									exit={{ opacity: 0, x: 20 }}
									className='flex items-center justify-between group'
								>
									<div className='flex items-center gap-3'>
										<Badge variant='secondary' className='font-mono'>
											{calc.result}
										</Badge>
										<span className='text-xs text-muted-foreground'>
											{new Date(calc.timestamp).toLocaleTimeString()}
										</span>
									</div>
									<Button
										size='icon'
										variant='ghost'
										onClick={() => copyWithAnimation(calc.id, calc.result)}
										className='opacity-0 group-hover:opacity-100 transition-opacity'
									>
										{copiedId === calc.id ? (
											<Check className='w-3 h-3 text-green-600' />
										) : (
											<Copy className='w-3 h-3' />
										)}
									</Button>
								</motion.div>
							))}
						</div>
					</Card>
				)}

				{/* Keyboard shortcuts */}
				<WidgetKeyboardShortcuts
					shortcuts={shortcuts}
					variant='floating'
					position='bottom-right'
				/>
			</div>
		</TooltipProvider>
	)
}

// Calculator Card Component
interface CalculatorCardProps {
	type: CalculationType
	icon: any
	gradient: string
	bgGradient: string
	iconColor: string
	values: any
	result: any
	updateValue: (field: string, value: string) => void
	saveToRecent: (type: CalculationType, result: string) => void
	copyWithAnimation: (id: string, text: string) => void
	copiedId: string | null
	t: any
	loadExample: (type: CalculationType) => void
}

function CalculatorCard({
	type,
	icon: Icon,
	gradient,
	bgGradient,
	iconColor,
	values,
	result,
	updateValue,
	saveToRecent,
	copyWithAnimation,
	copiedId,
	t,
	loadExample
}: CalculatorCardProps) {
	const [isFocused, setIsFocused] = useState(false)

	// Check if calculator is ready (all required fields filled)
	const isReady = useCallback(() => {
		switch (type) {
			case 'percentOfNumber':
				return values.percentOfPercentage && values.percentOfValue
			case 'whatPercent':
				return values.whatPercentValue1 && values.whatPercentValue2
			case 'findTotal':
				return values.findTotalValue && values.findTotalPercentage
			case 'percentChange':
				return values.changeOldValue && values.changeNewValue
			case 'addPercent':
			case 'subtractPercent':
				return values.addSubtractValue && values.addSubtractPercentage
			default:
				return false
		}
	}, [type, values])

	// Get translated explanation
	const getTranslatedExplanation = useCallback(() => {
		if (!result || result.result === null) return ''

		const formattedResult = parseFloat(result.result.toFixed(2))

		switch (type) {
			case 'percentOfNumber':
				return t('explanations.percentOf', {
					percentage: parseFloat(values.percentOfPercentage),
					value: parseFloat(values.percentOfValue),
					result: formattedResult
				})
			case 'whatPercent':
				return t('explanations.whatPercent', {
					value1: parseFloat(values.whatPercentValue1),
					value2: parseFloat(values.whatPercentValue2),
					result: formattedResult
				})
			case 'findTotal':
				return t('explanations.findTotal', {
					value: parseFloat(values.findTotalValue),
					percentage: parseFloat(values.findTotalPercentage),
					result: formattedResult
				})
			case 'percentChange':
				const change =
					result.result >= 0 ? t('labels.increase') : t('labels.decrease')
				return t('explanations.percentChange', {
					change: change,
					result: formattedResult
				})
			case 'addPercent':
				return t('explanations.addPercent', {
					value: parseFloat(values.addSubtractValue),
					percentage: parseFloat(values.addSubtractPercentage),
					result: formattedResult
				})
			case 'subtractPercent':
				return t('explanations.subtractPercent', {
					value: parseFloat(values.addSubtractValue),
					percentage: parseFloat(values.addSubtractPercentage),
					result: formattedResult
				})
			default:
				return result.explanation
		}
	}, [result, type, values, t])

	// Save to recent when copying result
	const handleCopyResult = useCallback(() => {
		if (result && result.result !== null) {
			const formattedResult = parseFloat(result.result.toFixed(2))
			const resultText = `${formattedResult}${type === 'whatPercent' || type === 'percentChange' ? '%' : ''}`
			copyWithAnimation(type, resultText)
			saveToRecent(type, resultText)
		}
	}, [result, type, copyWithAnimation, saveToRecent])

	// Render inputs based on calculation type
	const renderInputs = () => {
		switch (type) {
			case 'percentOfNumber':
				return (
					<div className='space-y-3'>
						<div className='flex items-center gap-2'>
							<span className='text-muted-foreground text-sm'>
								{t('labels.whatIs')}
							</span>
							<Input
								type='number'
								value={values.percentOfPercentage}
								onChange={e =>
									updateValue('percentOfPercentage', e.target.value)
								}
								onFocus={() => setIsFocused(true)}
								onBlur={() => setIsFocused(false)}
								placeholder='20'
								className='text-lg font-semibold text-center w-20'
							/>
							<span className='text-muted-foreground'>
								{t('labels.percentOf')}
							</span>
							<Input
								type='number'
								value={values.percentOfValue}
								onChange={e => updateValue('percentOfValue', e.target.value)}
								onFocus={() => setIsFocused(true)}
								onBlur={() => setIsFocused(false)}
								placeholder='100'
								className='text-lg font-semibold text-center w-24'
							/>
						</div>
					</div>
				)

			case 'whatPercent':
				return (
					<div className='space-y-3'>
						<div className='flex items-center gap-2 flex-wrap'>
							<Input
								type='number'
								value={values.whatPercentValue1}
								onChange={e => updateValue('whatPercentValue1', e.target.value)}
								onFocus={() => setIsFocused(true)}
								onBlur={() => setIsFocused(false)}
								placeholder='25'
								className='text-lg font-semibold text-center w-20'
							/>
							<span className='text-muted-foreground text-sm'>
								{t('labels.isWhatPercentOf')}
							</span>
							<Input
								type='number'
								value={values.whatPercentValue2}
								onChange={e => updateValue('whatPercentValue2', e.target.value)}
								onFocus={() => setIsFocused(true)}
								onBlur={() => setIsFocused(false)}
								placeholder='200'
								className='text-lg font-semibold text-center w-24'
							/>
						</div>
					</div>
				)

			case 'findTotal':
				return (
					<div className='space-y-3'>
						<div className='flex items-center gap-2'>
							<Input
								type='number'
								value={values.findTotalValue}
								onChange={e => updateValue('findTotalValue', e.target.value)}
								onFocus={() => setIsFocused(true)}
								onBlur={() => setIsFocused(false)}
								placeholder='30'
								className='text-lg font-semibold text-center w-28'
							/>
							<span className='text-muted-foreground'>{t('labels.is')}</span>
							<Input
								type='number'
								value={values.findTotalPercentage}
								onChange={e =>
									updateValue('findTotalPercentage', e.target.value)
								}
								onFocus={() => setIsFocused(true)}
								onBlur={() => setIsFocused(false)}
								placeholder='15'
								className='text-lg font-semibold text-center w-28'
							/>
							<span className='text-muted-foreground'>
								{t('labels.percentOfQuestion')}
							</span>
						</div>
					</div>
				)

			case 'percentChange':
				return (
					<div className='space-y-3'>
						<div className='flex items-center gap-2'>
							<span className='text-muted-foreground'>{t('labels.from')}</span>
							<Input
								type='number'
								value={values.changeOldValue}
								onChange={e => updateValue('changeOldValue', e.target.value)}
								onFocus={() => setIsFocused(true)}
								onBlur={() => setIsFocused(false)}
								placeholder='100'
								className='text-lg font-semibold text-center w-28'
							/>
							<ArrowUpDown className='w-4 h-4 text-muted-foreground' />
							<Input
								type='number'
								value={values.changeNewValue}
								onChange={e => updateValue('changeNewValue', e.target.value)}
								onFocus={() => setIsFocused(true)}
								onBlur={() => setIsFocused(false)}
								placeholder='125'
								className='text-lg font-semibold text-center w-28'
							/>
						</div>
					</div>
				)

			case 'addPercent':
				return (
					<div className='space-y-3'>
						<div className='flex items-center gap-2'>
							<Input
								type='number'
								value={values.addSubtractValue}
								onChange={e => updateValue('addSubtractValue', e.target.value)}
								onFocus={() => setIsFocused(true)}
								onBlur={() => setIsFocused(false)}
								placeholder='100'
								className='text-lg font-semibold text-center w-28'
							/>
							<Plus className='w-4 h-4 text-green-600' />
							<Input
								type='number'
								value={values.addSubtractPercentage}
								onChange={e =>
									updateValue('addSubtractPercentage', e.target.value)
								}
								onFocus={() => setIsFocused(true)}
								onBlur={() => setIsFocused(false)}
								placeholder='20'
								className='text-lg font-semibold text-center w-28'
							/>
							<span className='text-muted-foreground'>%</span>
						</div>
					</div>
				)

			case 'subtractPercent':
				return (
					<div className='space-y-3'>
						<div className='flex items-center gap-2'>
							<Input
								type='number'
								value={values.addSubtractValue}
								onChange={e => updateValue('addSubtractValue', e.target.value)}
								onFocus={() => setIsFocused(true)}
								onBlur={() => setIsFocused(false)}
								placeholder='100'
								className='text-lg font-semibold text-center w-28'
							/>
							<Minus className='w-4 h-4 text-red-600' />
							<Input
								type='number'
								value={values.addSubtractPercentage}
								onChange={e =>
									updateValue('addSubtractPercentage', e.target.value)
								}
								onFocus={() => setIsFocused(true)}
								onBlur={() => setIsFocused(false)}
								placeholder='20'
								className='text-lg font-semibold text-center w-28'
							/>
							<span className='text-muted-foreground'>%</span>
						</div>
					</div>
				)

			default:
				return null
		}
	}

	return (
		<motion.div
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			whileHover={{ y: -2 }}
			className='h-full'
		>
			<Card
				className={cn(
					'h-full transition-all duration-300 overflow-hidden relative',
					isFocused && 'ring-2 ring-primary shadow-lg',
					bgGradient && `bg-gradient-to-br ${bgGradient}`,
					!isReady() && 'opacity-95'
				)}
			>
				<CardContent className='p-6 h-full flex flex-col'>
					{/* Header */}
					<div className='flex items-center justify-between mb-4'>
						<div className='flex items-center gap-2'>
							<div
								className={cn(
									'p-2 rounded-lg bg-gradient-to-br',
									gradient,
									'text-white'
								)}
							>
								<Icon className='w-5 h-5' />
							</div>
							<h3 className='font-semibold text-sm flex items-center gap-2'>
								{t(`tabs.${type}`)}
								{!isReady() && (
									<Badge variant='secondary' className='text-xs px-2 py-0'>
										{t('labels.empty')}
									</Badge>
								)}
							</h3>
						</div>
						<div className='flex items-center gap-1'>
							{/* Load Example Button */}
							<Tooltip>
								<TooltipTrigger asChild>
									<Button
										size='icon'
										variant='ghost'
										onClick={() => loadExample(type)}
										className='h-8 w-8'
									>
										<Sparkles className='w-4 h-4' />
									</Button>
								</TooltipTrigger>
								<TooltipContent>
									<p>{t('buttons.loadExample')}</p>
								</TooltipContent>
							</Tooltip>
							{/* Copy Result Button */}
							{result && (
								<Tooltip>
									<TooltipTrigger asChild>
										<Button
											size='icon'
											variant='ghost'
											onClick={handleCopyResult}
											className='h-8 w-8'
										>
											{copiedId === type ? (
												<Check className='w-4 h-4 text-green-600' />
											) : (
												<Copy className='w-4 h-4' />
											)}
										</Button>
									</TooltipTrigger>
									<TooltipContent>
										<p>{t('buttons.copy')}</p>
									</TooltipContent>
								</Tooltip>
							)}
						</div>
					</div>

					{/* Inputs */}
					<div className='flex-1'>{renderInputs()}</div>

					{/* Result */}
					<AnimatePresence mode='wait'>
						{result && result.result !== null && (
							<motion.div
								initial={{ opacity: 0, y: 10 }}
								animate={{ opacity: 1, y: 0 }}
								exit={{ opacity: 0, y: -10 }}
								className='mt-4 pt-4 border-t'
							>
								<div className='space-y-1'>
									<div className='flex items-baseline gap-2'>
										<span className='text-2xl font-bold'>
											{parseFloat(result.result.toFixed(2))}
											{(type === 'whatPercent' || type === 'percentChange') &&
												'%'}
										</span>
										{type === 'percentChange' && (
											<Badge
												variant={result.result >= 0 ? 'default' : 'destructive'}
											>
												{result.result >= 0
													? t('labels.increase') || 'Increase'
													: t('labels.decrease') || 'Decrease'}
											</Badge>
										)}
									</div>
									<p className='text-xs text-muted-foreground'>
										{getTranslatedExplanation()}
									</p>
								</div>
							</motion.div>
						)}
					</AnimatePresence>
				</CardContent>
			</Card>
		</motion.div>
	)
}
