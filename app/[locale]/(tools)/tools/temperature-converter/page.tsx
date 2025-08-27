'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Slider } from '@/components/ui/slider'
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger
} from '@/components/ui/tooltip'
import {
	Thermometer,
	Snowflake,
	Flame,
	Sun,
	CloudSnow,
	Wind,
	Droplets,
	Coffee,
	Home,
	Zap,
	Copy,
	RefreshCw,
	History,
	Sparkles,
	Info
} from 'lucide-react'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'
import { useTranslations } from 'next-intl'

type TemperatureUnit = 'celsius' | 'fahrenheit' | 'kelvin' | 'rankine' | 'reaumur'

interface ConversionResult {
	celsius: number
	fahrenheit: number
	kelvin: number
	rankine: number
	reaumur: number
}

interface TemperaturePreset {
	id: string
	celsius: number
	icon: any
	color: string
}

interface HistoryItem {
	id: string
	celsius: number
	timestamp: Date
	fromUnit: TemperatureUnit
}

// Temperature presets with icons and colors
const TEMPERATURE_PRESETS: TemperaturePreset[] = [
	{ id: 'absoluteZero', celsius: -273.15, icon: CloudSnow, color: 'from-blue-900 to-indigo-900' },
	{ id: 'waterFreeze', celsius: 0, icon: Snowflake, color: 'from-blue-500 to-cyan-500' },
	{ id: 'roomTemp', celsius: 20, icon: Home, color: 'from-green-500 to-emerald-500' },
	{ id: 'bodyTemp', celsius: 36.6, icon: Sun, color: 'from-yellow-500 to-orange-500' },
	{ id: 'waterBoil', celsius: 100, icon: Droplets, color: 'from-orange-500 to-red-500' },
	{ id: 'oven', celsius: 180, icon: Flame, color: 'from-red-500 to-pink-500' }
]

// Temperature unit configurations
const UNIT_CONFIGS: Record<TemperatureUnit, { symbol: string; gradient: string }> = {
	celsius: { symbol: '°C', gradient: 'from-blue-500 to-blue-600' },
	fahrenheit: { symbol: '°F', gradient: 'from-purple-500 to-purple-600' },
	kelvin: { symbol: 'K', gradient: 'from-green-500 to-green-600' },
	rankine: { symbol: '°R', gradient: 'from-orange-500 to-orange-600' },
	reaumur: { symbol: '°Ré', gradient: 'from-pink-500 to-pink-600' }
}

export default function TemperatureConverterPage() {
	const t = useTranslations('widgets.temperatureConverter')
	const [mounted, setMounted] = useState(false)
	const [activeUnit, setActiveUnit] = useState<TemperatureUnit>('celsius')
	const [values, setValues] = useState<ConversionResult>({
		celsius: 20,
		fahrenheit: 68,
		kelvin: 293.15,
		rankine: 527.67,
		reaumur: 16
	})
	const [history, setHistory] = useState<HistoryItem[]>([])
	const [showHistory, setShowHistory] = useState(false)

	useEffect(() => {
		setMounted(true)
		// Load history from localStorage
		const saved = localStorage.getItem('temperature-history')
		if (saved) {
			try {
				const parsed = JSON.parse(saved)
				setHistory(parsed.map((item: any) => ({
					...item,
					timestamp: new Date(item.timestamp)
				})))
			} catch {}
		}
	}, [])

	// Convert from any unit to all others
	const convertTemperature = useCallback((value: number, fromUnit: TemperatureUnit): ConversionResult => {
		// First convert to Celsius
		let celsius: number
		
		switch (fromUnit) {
			case 'celsius':
				celsius = value
				break
			case 'fahrenheit':
				celsius = (value - 32) * 5 / 9
				break
			case 'kelvin':
				celsius = value - 273.15
				break
			case 'rankine':
				celsius = (value - 491.67) * 5 / 9
				break
			case 'reaumur':
				celsius = value * 5 / 4
				break
			default:
				celsius = value
		}

		// Then convert from Celsius to all units
		return {
			celsius,
			fahrenheit: celsius * 9 / 5 + 32,
			kelvin: celsius + 273.15,
			rankine: (celsius + 273.15) * 9 / 5,
			reaumur: celsius * 4 / 5
		}
	}, [])

	// Handle unit card input
	const handleUnitChange = useCallback((unit: TemperatureUnit, value: string) => {
		const numValue = parseFloat(value)
		if (!isNaN(numValue)) {
			const newValues = convertTemperature(numValue, unit)
			setValues(newValues)
			setActiveUnit(unit)

			// Add to history
			const historyItem: HistoryItem = {
				id: Date.now().toString(),
				celsius: newValues.celsius,
				timestamp: new Date(),
				fromUnit: unit
			}
			const newHistory = [historyItem, ...history].slice(0, 10)
			setHistory(newHistory)
			localStorage.setItem('temperature-history', JSON.stringify(newHistory))
		}
	}, [history, convertTemperature])


	// Load preset
	const loadPreset = useCallback((preset: TemperaturePreset) => {
		const newValues = convertTemperature(preset.celsius, 'celsius')
		setValues(newValues)
		setActiveUnit('celsius')
		
		toast.success(t('toast.presetLoaded'))
	}, [convertTemperature, t])

	// Copy value
	const copyValue = useCallback((unit: TemperatureUnit) => {
		const value = values[unit]
		const symbol = UNIT_CONFIGS[unit].symbol
		const text = `${formatNumber(value)}${symbol}`
		navigator.clipboard.writeText(text)
		toast.success(t('toast.copied'))
	}, [values, t])

	// Format number
	const formatNumber = (value: number): string => {
		return parseFloat(value.toFixed(2)).toString()
	}

	// Get temperature color
	const getTemperatureColor = (celsius: number): string => {
		if (celsius < -50) return 'from-blue-900 to-blue-800'
		if (celsius < -20) return 'from-blue-700 to-blue-600'
		if (celsius < 0) return 'from-blue-500 to-cyan-500'
		if (celsius < 15) return 'from-cyan-500 to-green-500'
		if (celsius < 25) return 'from-green-500 to-yellow-500'
		if (celsius < 35) return 'from-yellow-500 to-orange-500'
		if (celsius < 50) return 'from-orange-500 to-red-500'
		if (celsius < 100) return 'from-red-500 to-red-600'
		return 'from-red-600 to-red-900'
	}

	// Get temperature icon
	const getTemperatureIcon = (celsius: number) => {
		if (celsius < -50) return CloudSnow
		if (celsius < 0) return Snowflake
		if (celsius < 15) return Wind
		if (celsius < 25) return Home
		if (celsius < 35) return Sun
		if (celsius < 100) return Coffee
		return Flame
	}

	// Reset all
	const resetAll = () => {
		const newValues = convertTemperature(20, 'celsius')
		setValues(newValues)
		setActiveUnit('celsius')
		toast.success(t('toast.reset'))
	}

	if (!mounted) return null

	const TemperatureIcon = getTemperatureIcon(values.celsius)
	const temperatureColor = getTemperatureColor(values.celsius)

	return (
		<TooltipProvider>
			<div className='max-w-6xl mx-auto space-y-6'>
				{/* Main Temperature Display */}
						{/* Main Temperature Display */}
						<Card className='relative overflow-hidden'>
							<div className={cn(
								'absolute inset-0 bg-gradient-to-br opacity-10',
								temperatureColor
							)} />
							<CardContent className='relative p-8'>
								<div className='flex items-center justify-between'>
									<div className='flex items-center gap-3'>
										<motion.div
											animate={{ rotate: [0, 10, -10, 0] }}
											transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
										>
											<TemperatureIcon className='w-8 h-8' />
										</motion.div>
										<div>
											<h2 className='text-3xl font-bold'>
												{formatNumber(values[activeUnit])}{UNIT_CONFIGS[activeUnit].symbol}
											</h2>
											<p className='text-sm text-muted-foreground'>
												{t(`units.${activeUnit}`)}
											</p>
											<div className='mt-2 space-y-1'>
												{values.celsius < 0 && (
													<Badge variant='outline' className='gap-1'>
														<Snowflake className='w-3 h-3' />
														{t('descriptions.belowFreezing')}
													</Badge>
												)}
												{values.celsius >= 0 && values.celsius < 100 && (
													<Badge variant='outline' className='gap-1'>
														<Droplets className='w-3 h-3' />
														{t('descriptions.liquidWater')}
													</Badge>
												)}
												{values.celsius >= 100 && (
													<Badge variant='outline' className='gap-1'>
														<Flame className='w-3 h-3' />
														{t('descriptions.aboveBoiling')}
													</Badge>
												)}
												<p className='text-xs text-muted-foreground'>
													{t('context.fromAbsoluteZero', {
														value: formatNumber(values.celsius + 273.15)
													})}
												</p>
											</div>
										</div>
									</div>
									<div className='flex items-center gap-2'>
										<Button
											size='sm'
											variant='outline'
											onClick={() => setShowHistory(!showHistory)}
										>
											<History className='w-4 h-4' />
										</Button>
										<Button
											size='sm'
											variant='outline'
											onClick={resetAll}
										>
											<RefreshCw className='w-4 h-4' />
										</Button>
									</div>
								</div>
							</CardContent>
						</Card>

						{/* Unit Cards */}
						<div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4'>
					{(Object.keys(UNIT_CONFIGS) as TemperatureUnit[]).map(unit => {
						const config = UNIT_CONFIGS[unit]
						const value = values[unit]
						const isActive = activeUnit === unit

						return (
							<motion.div
								key={unit}
								whileHover={{ scale: 1.02 }}
								whileTap={{ scale: 0.98 }}
							>
								<Card 
									onClick={() => setActiveUnit(unit)}
									className={cn(
										'relative overflow-hidden cursor-pointer transition-all',
										isActive && 'ring-2 ring-primary shadow-lg'
									)}
								>
									<div className={cn(
										'absolute inset-0 bg-gradient-to-br opacity-10',
										config.gradient
									)} />
									<CardContent className='relative p-4'>
										<div className='flex items-center justify-between mb-2'>
											<span className='text-sm font-medium'>
												{t(`units.${unit}`)}
											</span>
											<Tooltip>
												<TooltipTrigger asChild>
													<Button
														size='icon'
														variant='ghost'
														className='h-6 w-6'
														onClick={(e) => {
															e.stopPropagation()
															copyValue(unit)
														}}
													>
														<Copy className='w-3 h-3' />
													</Button>
												</TooltipTrigger>
												<TooltipContent>
													<p>{t('actions.copy')}</p>
												</TooltipContent>
											</Tooltip>
										</div>
										<Input
											type='number'
											value={formatNumber(value)}
											onChange={(e) => handleUnitChange(unit, e.target.value)}
											onClick={(e) => e.stopPropagation()}
											className='text-lg font-bold border-0 p-0 h-auto bg-transparent'
											step='any'
										/>
										<span className='text-sm text-muted-foreground'>
											{config.symbol}
										</span>
									</CardContent>
								</Card>
							</motion.div>
						)
					})}
						</div>

						{/* Quick Presets */}
						<Card>
					<CardContent className='p-6'>
						<div className='flex items-center gap-2 mb-4'>
							<Sparkles className='w-5 h-5 text-primary' />
							<h3 className='font-semibold'>{t('sections.presets')}</h3>
						</div>
						<div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3'>
							{TEMPERATURE_PRESETS.map(preset => {
								const Icon = preset.icon
								return (
									<motion.button
										key={preset.id}
										onClick={() => loadPreset(preset)}
										className={cn(
											'relative overflow-hidden rounded-lg p-4',
											'border-2 border-transparent hover:border-primary/50',
											'transition-all duration-200'
										)}
										whileHover={{ scale: 1.05 }}
										whileTap={{ scale: 0.95 }}
									>
										<div className={cn(
											'absolute inset-0 bg-gradient-to-br opacity-10',
											preset.color
										)} />
										<div className='relative flex flex-col items-center gap-2'>
											<Icon className='w-6 h-6' />
											<span className='text-xs font-medium'>
												{t(`presets.${preset.id}`)}
											</span>
											<span className='text-xs text-muted-foreground'>
												{preset.celsius}°C
											</span>
										</div>
									</motion.button>
								)
							})}
						</div>
					</CardContent>
						</Card>

						{/* History */}
						<AnimatePresence>
					{showHistory && history.length > 0 && (
						<motion.div
							initial={{ opacity: 0, height: 0 }}
							animate={{ opacity: 1, height: 'auto' }}
							exit={{ opacity: 0, height: 0 }}
						>
							<Card>
								<CardContent className='p-4'>
									<h3 className='font-semibold mb-3'>{t('sections.history')}</h3>
									<div className='space-y-2'>
										{history.map((item, index) => (
											<motion.div
												key={item.id}
												initial={{ opacity: 0, x: -20 }}
												animate={{ opacity: 1, x: 0 }}
												transition={{ delay: index * 0.05 }}
												className='flex items-center justify-between p-2 rounded-lg hover:bg-muted/50 cursor-pointer'
												onClick={() => loadPreset({
													id: item.id,
													celsius: item.celsius,
													icon: Thermometer,
													color: ''
												})}
											>
												<div className='flex items-center gap-3'>
													<Badge variant='secondary'>
														{formatNumber(item.celsius)}°C
													</Badge>
													<span className='text-sm text-muted-foreground'>
														{t(`units.${item.fromUnit}`)}
													</span>
												</div>
												<span className='text-xs text-muted-foreground'>
													{new Date(item.timestamp).toLocaleTimeString()}
												</span>
											</motion.div>
										))}
									</div>
								</CardContent>
							</Card>
						</motion.div>
					)}
						</AnimatePresence>

						{/* Temperature Context */}
						<Card>
							<CardContent className='p-6'>
								<div className='flex items-center gap-2 mb-4'>
									<Info className='w-5 h-5 text-primary' />
									<h3 className='font-semibold'>{t('info.formulas')}</h3>
								</div>
								<div className='grid grid-cols-2 md:grid-cols-4 gap-4'>
									<div className='space-y-1'>
										<p className='text-sm font-medium'>Fahrenheit</p>
										<p className='text-xs font-mono text-muted-foreground'>°F = (°C × 9/5) + 32</p>
									</div>
									<div className='space-y-1'>
										<p className='text-sm font-medium'>Kelvin</p>
										<p className='text-xs font-mono text-muted-foreground'>K = °C + 273.15</p>
									</div>
									<div className='space-y-1'>
										<p className='text-sm font-medium'>Rankine</p>
										<p className='text-xs font-mono text-muted-foreground'>°R = (°C + 273.15) × 9/5</p>
									</div>
									<div className='space-y-1'>
										<p className='text-sm font-medium'>Réaumur</p>
										<p className='text-xs font-mono text-muted-foreground'>°Ré = °C × 4/5</p>
									</div>
								</div>
							</CardContent>
						</Card>
			</div>
		</TooltipProvider>
	)
}