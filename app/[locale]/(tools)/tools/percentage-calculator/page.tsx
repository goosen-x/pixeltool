'use client'

import { useState, useEffect } from 'react'
import {
	Calculator,
	Percent,
	TrendingUp,
	TrendingDown,
	Plus,
	Minus
} from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { cn } from '@/lib/utils'
import { useTranslations } from 'next-intl'

interface CalculationResult {
	value: number
	formula: string
	description: string
}

export default function PercentageCalculatorPage() {
	const t = useTranslations('widgets.percentageCalculator')
	const [mounted, setMounted] = useState(false)

	// Tab 1: X% of Y
	const [percentOfNumber, setPercentOfNumber] = useState({
		percent: 20,
		number: 100
	})
	const [percentOfResult, setPercentOfResult] =
		useState<CalculationResult | null>(null)

	// Tab 2: X is Y% of what?
	const [whatPercent, setWhatPercent] = useState({ value: 20, percent: 10 })
	const [whatPercentResult, setWhatPercentResult] =
		useState<CalculationResult | null>(null)

	// Tab 3: X is Y, what is 100%?
	const [findTotal, setFindTotal] = useState({ percent: 25, value: 50 })
	const [findTotalResult, setFindTotalResult] =
		useState<CalculationResult | null>(null)

	// Tab 4: Percentage change
	const [percentChange, setPercentChange] = useState({ from: 100, to: 150 })
	const [percentChangeResult, setPercentChangeResult] =
		useState<CalculationResult | null>(null)

	// Tab 5: Add percentage
	const [addPercent, setAddPercent] = useState({ percent: 10, number: 100 })
	const [addPercentResult, setAddPercentResult] =
		useState<CalculationResult | null>(null)

	// Tab 6: Subtract percentage
	const [subtractPercent, setSubtractPercent] = useState({
		percent: 10,
		number: 100
	})
	const [subtractPercentResult, setSubtractPercentResult] =
		useState<CalculationResult | null>(null)

	useEffect(() => {
		setMounted(true)
	}, [])

	// Calculate functions
	const calculatePercentOfNumber = () => {
		const result = (percentOfNumber.percent / 100) * percentOfNumber.number
		setPercentOfResult({
			value: result,
			formula: `${percentOfNumber.percent}% × ${percentOfNumber.number} = ${result}`,
			description: t('formulas.percentOf', {
				percent: percentOfNumber.percent,
				number: percentOfNumber.number,
				result: result
			})
		})
	}

	const calculateWhatPercent = () => {
		const result = (whatPercent.value / whatPercent.percent) * 100
		setWhatPercentResult({
			value: result,
			formula: `${whatPercent.value} ÷ ${whatPercent.percent}% = ${result}`,
			description: t('formulas.whatPercent', {
				value: whatPercent.value,
				percent: whatPercent.percent,
				result: result
			})
		})
	}

	const calculateFindTotal = () => {
		const result = (findTotal.value / findTotal.percent) * 100
		setFindTotalResult({
			value: result,
			formula: `${findTotal.value} ÷ ${findTotal.percent}% × 100 = ${result}`,
			description: t('formulas.findTotal', {
				percent: findTotal.percent,
				value: findTotal.value,
				result: result
			})
		})
	}

	const calculatePercentChange = () => {
		const change = percentChange.to - percentChange.from
		const percentageChange = (change / percentChange.from) * 100
		setPercentChangeResult({
			value: percentageChange,
			formula: `((${percentChange.to} - ${percentChange.from}) ÷ ${percentChange.from}) × 100 = ${percentageChange.toFixed(2)}%`,
			description: t('formulas.percentChange', {
				from: percentChange.from,
				to: percentChange.to,
				result: percentageChange.toFixed(2)
			}) + ' (' + t(`formulas.${percentageChange > 0 ? 'increase' : 'decrease'}`) + ')'
		})
	}

	const calculateAddPercent = () => {
		const addition = (addPercent.percent / 100) * addPercent.number
		const result = addPercent.number + addition
		setAddPercentResult({
			value: result,
			formula: `${addPercent.number} + (${addPercent.percent}% × ${addPercent.number}) = ${result}`,
			description: t('formulas.addPercent', {
				number: addPercent.number,
				percent: addPercent.percent,
				result: result
			})
		})
	}

	const calculateSubtractPercent = () => {
		const subtraction = (subtractPercent.percent / 100) * subtractPercent.number
		const result = subtractPercent.number - subtraction
		setSubtractPercentResult({
			value: result,
			formula: `${subtractPercent.number} - (${subtractPercent.percent}% × ${subtractPercent.number}) = ${result}`,
			description: t('formulas.subtractPercent', {
				number: subtractPercent.number,
				percent: subtractPercent.percent,
				result: result
			})
		})
	}

	// Auto-calculate on input change
	useEffect(() => {
		if (
			mounted &&
			percentOfNumber.percent !== null &&
			percentOfNumber.number !== null
		) {
			calculatePercentOfNumber()
		}
	}, [percentOfNumber, mounted])

	useEffect(() => {
		if (
			mounted &&
			whatPercent.value !== null &&
			whatPercent.percent !== null &&
			whatPercent.percent !== 0
		) {
			calculateWhatPercent()
		}
	}, [whatPercent, mounted])

	useEffect(() => {
		if (
			mounted &&
			findTotal.percent !== null &&
			findTotal.value !== null &&
			findTotal.percent !== 0
		) {
			calculateFindTotal()
		}
	}, [findTotal, mounted])

	useEffect(() => {
		if (
			mounted &&
			percentChange.from !== null &&
			percentChange.to !== null &&
			percentChange.from !== 0
		) {
			calculatePercentChange()
		}
	}, [percentChange, mounted])

	useEffect(() => {
		if (mounted && addPercent.percent !== null && addPercent.number !== null) {
			calculateAddPercent()
		}
	}, [addPercent, mounted])

	useEffect(() => {
		if (
			mounted &&
			subtractPercent.percent !== null &&
			subtractPercent.number !== null
		) {
			calculateSubtractPercent()
		}
	}, [subtractPercent, mounted])

	if (!mounted) {
		return (
			<div className='max-w-6xl mx-auto space-y-8'>
				<div>
					<h1 className='text-3xl font-bold tracking-tight mb-2'>
						{t('title')}
					</h1>
					<p className='text-muted-foreground'>
						{t('description')}
					</p>
				</div>
				<div className='animate-pulse space-y-8'>
					<div className='h-96 bg-muted rounded-lg'></div>
				</div>
			</div>
		)
	}

	return (
		<div className='max-w-6xl mx-auto space-y-8'>
			{/* Calculator Tabs */}
			<Tabs defaultValue='percent-of' className='w-full'>
				<TabsList className='grid w-full grid-cols-2 md:grid-cols-3 gap-2 h-auto'>
					<TabsTrigger value='percent-of' className='flex items-center gap-2'>
						<Percent className='w-4 h-4' />
						<span className='hidden sm:inline'>{t('tabs.percentOf')}</span>
						<span className='sm:hidden'>% of</span>
					</TabsTrigger>
					<TabsTrigger value='what-percent' className='flex items-center gap-2'>
						<Calculator className='w-4 h-4' />
						<span className='hidden sm:inline'>{t('tabs.whatPercent')}</span>
						<span className='sm:hidden'>100%</span>
					</TabsTrigger>
					<TabsTrigger value='find-total' className='flex items-center gap-2'>
						<Calculator className='w-4 h-4' />
						<span className='hidden sm:inline'>{t('tabs.findTotal')}</span>
						<span className='sm:hidden'>X=Y%</span>
					</TabsTrigger>
					<TabsTrigger
						value='percent-change'
						className='flex items-center gap-2'
					>
						<TrendingUp className='w-4 h-4' />
						<span className='hidden sm:inline'>{t('tabs.percentChange')}</span>
						<span className='sm:hidden'>Δ%</span>
					</TabsTrigger>
					<TabsTrigger value='add-percent' className='flex items-center gap-2'>
						<Plus className='w-4 h-4' />
						<span className='hidden sm:inline'>{t('tabs.addPercent')}</span>
						<span className='sm:hidden'>+%</span>
					</TabsTrigger>
					<TabsTrigger
						value='subtract-percent'
						className='flex items-center gap-2'
					>
						<Minus className='w-4 h-4' />
						<span className='hidden sm:inline'>{t('tabs.subtractPercent')}</span>
						<span className='sm:hidden'>-%</span>
					</TabsTrigger>
				</TabsList>

				{/* Tab 1: X% of Y */}
				<TabsContent value='percent-of' className='mt-6'>
					<Card className='p-6'>
						<h3 className='text-lg font-semibold mb-4'>{t('tabs.percentOf')}</h3>
						<div className='flex flex-col sm:flex-row items-center gap-4'>
							<div className='w-full sm:w-auto'>
								<Label htmlFor='percent1'>{t('labels.percent')}</Label>
								<div className='relative'>
									<Input
										id='percent1'
										type='number'
										value={percentOfNumber.percent}
										onChange={e =>
											setPercentOfNumber({
												...percentOfNumber,
												percent: parseFloat(e.target.value) || 0
											})
										}
										className='pr-8'
									/>
									<span className='absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground'>
										%
									</span>
								</div>
							</div>
							<span className='text-muted-foreground'>×</span>
							<div className='w-full sm:w-auto'>
								<Label htmlFor='number1'>{t('labels.number')}</Label>
								<Input
									id='number1'
									type='number'
									value={percentOfNumber.number}
									onChange={e =>
										setPercentOfNumber({
											...percentOfNumber,
											number: parseFloat(e.target.value) || 0
										})
									}
								/>
							</div>
						</div>
						{percentOfResult && (
							<div className='mt-6 p-4 bg-muted rounded-lg'>
								<p className='text-2xl font-bold'>{percentOfResult.value}</p>
								<p className='text-sm text-muted-foreground mt-1'>
									{t('formula')}: {percentOfResult.formula}
								</p>
								<p className='text-sm text-foreground mt-2'>
									{percentOfResult.description}
								</p>
							</div>
						)}
					</Card>
				</TabsContent>

				{/* Tab 2: X is Y% of what? */}
				<TabsContent value='what-percent' className='mt-6'>
					<Card className='p-6'>
						<h3 className='text-lg font-semibold mb-4'>
							{t('tabs.whatPercent')}
						</h3>
						<div className='flex flex-col sm:flex-row items-center gap-4'>
							<div className='w-full sm:w-auto'>
								<Label htmlFor='value2'>{t('labels.value')}</Label>
								<Input
									id='value2'
									type='number'
									value={whatPercent.value}
									onChange={e =>
										setWhatPercent({
											...whatPercent,
											value: parseFloat(e.target.value) || 0
										})
									}
								/>
							</div>
							<span className='text-muted-foreground'>{t('labels.is')}</span>
							<div className='w-full sm:w-auto'>
								<Label htmlFor='percent2'>{t('labels.percent')}</Label>
								<div className='relative'>
									<Input
										id='percent2'
										type='number'
										value={whatPercent.percent}
										onChange={e =>
											setWhatPercent({
												...whatPercent,
												percent: parseFloat(e.target.value) || 0
											})
										}
										className='pr-8'
									/>
									<span className='absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground'>
										%
									</span>
								</div>
							</div>
							<span className='text-muted-foreground'>{t('labels.ofWhat')}</span>
						</div>
						{whatPercentResult && whatPercent.percent !== 0 && (
							<div className='mt-6 p-4 bg-muted rounded-lg'>
								<p className='text-2xl font-bold'>
									{whatPercentResult.value.toFixed(2)}
								</p>
								<p className='text-sm text-muted-foreground mt-1'>
									{whatPercentResult.description}
								</p>
							</div>
						)}
					</Card>
				</TabsContent>

				{/* Tab 3: If X% = Y, what is 100%? */}
				<TabsContent value='find-total' className='mt-6'>
					<Card className='p-6'>
						<h3 className='text-lg font-semibold mb-4'>
							{t('tabs.findTotal')}
						</h3>
						<div className='flex flex-col sm:flex-row items-center gap-4'>
							<div className='w-full sm:w-auto'>
								<Label htmlFor='percent3'>{t('labels.percent')}</Label>
								<div className='relative'>
									<Input
										id='percent3'
										type='number'
										value={findTotal.percent}
										onChange={e =>
											setFindTotal({
												...findTotal,
												percent: parseFloat(e.target.value) || 0
											})
										}
										className='pr-8'
									/>
									<span className='absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground'>
										%
									</span>
								</div>
							</div>
							<span className='text-muted-foreground'>{t('labels.equals')}</span>
							<div className='w-full sm:w-auto'>
								<Label htmlFor='value3'>{t('labels.value')}</Label>
								<Input
									id='value3'
									type='number'
									value={findTotal.value}
									onChange={e =>
										setFindTotal({
											...findTotal,
											value: parseFloat(e.target.value) || 0
										})
									}
								/>
							</div>
						</div>
						{findTotalResult && findTotal.percent !== 0 && (
							<div className='mt-6 p-4 bg-muted rounded-lg'>
								<p className='text-2xl font-bold'>
									{findTotalResult.value.toFixed(2)}
								</p>
								<p className='text-sm text-muted-foreground mt-1'>
									{findTotalResult.description}
								</p>
							</div>
						)}
					</Card>
				</TabsContent>

				{/* Tab 4: Percentage Change */}
				<TabsContent value='percent-change' className='mt-6'>
					<Card className='p-6'>
						<h3 className='text-lg font-semibold mb-4'>
							{t('tabs.percentChange')}
						</h3>
						<div className='flex flex-col sm:flex-row items-center gap-4'>
							<div className='w-full sm:w-auto'>
								<Label htmlFor='from4'>{t('labels.from')}</Label>
								<Input
									id='from4'
									type='number'
									value={percentChange.from}
									onChange={e =>
										setPercentChange({
											...percentChange,
											from: parseFloat(e.target.value) || 0
										})
									}
								/>
							</div>
							<span className='text-muted-foreground'>{t('labels.to')}</span>
							<div className='w-full sm:w-auto'>
								<Label htmlFor='to4'>{t('labels.toValue')}</Label>
								<Input
									id='to4'
									type='number'
									value={percentChange.to}
									onChange={e =>
										setPercentChange({
											...percentChange,
											to: parseFloat(e.target.value) || 0
										})
									}
								/>
							</div>
						</div>
						{percentChangeResult && percentChange.from !== 0 && (
							<div className='mt-6 p-4 bg-muted rounded-lg'>
								<div className='flex items-center gap-2'>
									{percentChangeResult.value > 0 ? (
										<TrendingUp className='w-6 h-6 text-green-500' />
									) : (
										<TrendingDown className='w-6 h-6 text-red-500' />
									)}
									<p
										className={cn(
											'text-2xl font-bold',
											percentChangeResult.value > 0
												? 'text-green-500'
												: 'text-red-500'
										)}
									>
										{percentChangeResult.value > 0 ? '+' : ''}
										{percentChangeResult.value.toFixed(2)}%
									</p>
								</div>
								<p className='text-sm text-muted-foreground mt-1'>
									{percentChangeResult.description}
								</p>
							</div>
						)}
					</Card>
				</TabsContent>

				{/* Tab 5: Add Percentage */}
				<TabsContent value='add-percent' className='mt-6'>
					<Card className='p-6'>
						<h3 className='text-lg font-semibold mb-4'>{t('tabs.addPercent')}</h3>
						<div className='flex flex-col sm:flex-row items-center gap-4'>
							<div className='w-full sm:w-auto'>
								<Label htmlFor='number5'>{t('labels.number')}</Label>
								<Input
									id='number5'
									type='number'
									value={addPercent.number}
									onChange={e =>
										setAddPercent({
											...addPercent,
											number: parseFloat(e.target.value) || 0
										})
									}
								/>
							</div>
							<Plus className='w-5 h-5 text-muted-foreground' />
							<div className='w-full sm:w-auto'>
								<Label htmlFor='percent5'>{t('labels.percent')}</Label>
								<div className='relative'>
									<Input
										id='percent5'
										type='number'
										value={addPercent.percent}
										onChange={e =>
											setAddPercent({
												...addPercent,
												percent: parseFloat(e.target.value) || 0
											})
										}
										className='pr-8'
									/>
									<span className='absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground'>
										%
									</span>
								</div>
							</div>
						</div>
						{addPercentResult && (
							<div className='mt-6 p-4 bg-muted rounded-lg'>
								<p className='text-2xl font-bold'>
									{addPercentResult.value.toFixed(2)}
								</p>
								<p className='text-sm text-muted-foreground mt-1'>
									{addPercentResult.formula}
								</p>
							</div>
						)}
					</Card>
				</TabsContent>

				{/* Tab 6: Subtract Percentage */}
				<TabsContent value='subtract-percent' className='mt-6'>
					<Card className='p-6'>
						<h3 className='text-lg font-semibold mb-4'>
							{t('tabs.subtractPercent')}
						</h3>
						<div className='flex flex-col sm:flex-row items-center gap-4'>
							<div className='w-full sm:w-auto'>
								<Label htmlFor='number6'>{t('labels.number')}</Label>
								<Input
									id='number6'
									type='number'
									value={subtractPercent.number}
									onChange={e =>
										setSubtractPercent({
											...subtractPercent,
											number: parseFloat(e.target.value) || 0
										})
									}
								/>
							</div>
							<Minus className='w-5 h-5 text-muted-foreground' />
							<div className='w-full sm:w-auto'>
								<Label htmlFor='percent6'>{t('labels.percent')}</Label>
								<div className='relative'>
									<Input
										id='percent6'
										type='number'
										value={subtractPercent.percent}
										onChange={e =>
											setSubtractPercent({
												...subtractPercent,
												percent: parseFloat(e.target.value) || 0
											})
										}
										className='pr-8'
									/>
									<span className='absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground'>
										%
									</span>
								</div>
							</div>
						</div>
						{subtractPercentResult && (
							<div className='mt-6 p-4 bg-muted rounded-lg'>
								<p className='text-2xl font-bold'>
									{subtractPercentResult.value.toFixed(2)}
								</p>
								<p className='text-sm text-muted-foreground mt-1'>
									{subtractPercentResult.formula}
								</p>
							</div>
						)}
					</Card>
				</TabsContent>
			</Tabs>

			{/* Usage Examples */}
			<Card className='p-6 bg-muted/50'>
				<h3 className='font-semibold mb-4'>{t('commonUses.title')}</h3>
				<div className='grid md:grid-cols-2 gap-4 text-sm text-muted-foreground'>
					<div>
						<h4 className='font-medium text-foreground mb-2'>
							{t('commonUses.businessFinance.title')}
						</h4>
						<ul className='space-y-1 list-disc list-inside'>
							<li>{t('commonUses.businessFinance.discounts')}</li>
							<li>{t('commonUses.businessFinance.tax')}</li>
							<li>{t('commonUses.businessFinance.profit')}</li>
							<li>{t('commonUses.businessFinance.commission')}</li>
						</ul>
					</div>
					<div>
						<h4 className='font-medium text-foreground mb-2'>{t('commonUses.personalUse.title')}</h4>
						<ul className='space-y-1 list-disc list-inside'>
							<li>{t('commonUses.personalUse.tips')}</li>
							<li>{t('commonUses.personalUse.weight')}</li>
							<li>{t('commonUses.personalUse.prices')}</li>
							<li>{t('commonUses.personalUse.scores')}</li>
						</ul>
					</div>
				</div>
			</Card>
		</div>
	)
}
