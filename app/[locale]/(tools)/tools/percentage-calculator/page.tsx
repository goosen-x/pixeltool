'use client'

import { useState, useEffect } from 'react'
import {
	Calculator,
	Percent,
	TrendingUp,
	TrendingDown,
	Plus,
	Minus,
	Copy,
	RefreshCw
} from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
	WidgetShareSection,
	WidgetTips,
	WidgetKeyboardShortcuts,
	ShortcutHint
} from '@/components/widgets'
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

export default function PercentageCalculatorPage() {
	const t = useTranslations('widgets.percentageCalculator')
	const [mounted, setMounted] = useState(false)

	// Use the percentage calculator hook
	const {
		activeType,
		values,
		results,
		setActiveType,
		updateValue,
		copyResult,
		reset,
		loadExample
	} = usePercentageCalculator()

	// Mounted effect
	useEffect(() => {
		setMounted(true)
	}, [])

	// Keyboard shortcuts
	const shortcuts: KeyboardShortcut[] = [
		{
			...commonWidgetShortcuts.reset,
			action: reset
		},
		{
			key: 'c',
			ctrl: true,
			shift: true,
			description: 'Copy result',
			action: () => copyResult(activeType),
			enabled: !!results[activeType]
		},
		{
			key: 'e',
			ctrl: true,
			description: 'Load example',
			action: loadExample
		},
		{
			key: '1',
			ctrl: true,
			description: 'Percent of number',
			action: () => setActiveType('percentOfNumber')
		},
		{
			key: '2',
			ctrl: true,
			description: 'What percent',
			action: () => setActiveType('whatPercent')
		},
		{
			key: '3',
			ctrl: true,
			description: 'Find total',
			action: () => setActiveType('findTotal')
		},
		{
			key: '4',
			ctrl: true,
			description: 'Percent change',
			action: () => setActiveType('percentChange')
		},
		{
			key: '5',
			ctrl: true,
			description: 'Add percent',
			action: () => setActiveType('addPercent')
		},
		{
			key: '6',
			ctrl: true,
			description: 'Subtract percent',
			action: () => setActiveType('subtractPercent')
		}
	]

	useWidgetKeyboard({
		shortcuts,
		widgetId: 'percentage-calculator',
		enabled: true
	})

	// Widget tips
	const percentageTips = [
		{
			id: 'quick-switch',
			title: 'Quick Tab Switch',
			description:
				'Use Ctrl+1 through Ctrl+6 to quickly switch between calculation types',
			category: 'basic' as const
		},
		{
			id: 'auto-calc',
			title: 'Automatic Calculation',
			description:
				'Results update automatically as you type - no need to press calculate',
			category: 'basic' as const
		},
		{
			id: 'example',
			title: 'Load Examples',
			description:
				'Press Ctrl+E to load example values for the current calculation',
			category: 'basic' as const,
			action: {
				label: 'Load Example',
				onClick: loadExample
			}
		},
		{
			id: 'copy',
			title: 'Copy Results',
			description: 'Use Ctrl+Shift+C to copy the current result with formula',
			category: 'basic' as const
		},
		{
			id: 'formulas',
			title: 'All Formulas Shown',
			description: 'Each result shows the exact formula used for transparency',
			category: 'pro' as const
		}
	]

	if (!mounted) {
		return null
	}

	const tabConfig = [
		{
			id: 'percentOfNumber' as CalculationType,
			label: t('tabs.percentOfNumber'),
			icon: Calculator
		},
		{
			id: 'whatPercent' as CalculationType,
			label: t('tabs.whatPercent'),
			icon: Percent
		},
		{
			id: 'findTotal' as CalculationType,
			label: t('tabs.findTotal'),
			icon: TrendingUp
		},
		{
			id: 'percentChange' as CalculationType,
			label: t('tabs.percentageChange'),
			icon: TrendingDown
		},
		{
			id: 'addPercent' as CalculationType,
			label: t('tabs.addPercentage'),
			icon: Plus
		},
		{
			id: 'subtractPercent' as CalculationType,
			label: t('tabs.subtractPercentage'),
			icon: Minus
		}
	]

	return (
		<div className='max-w-6xl mx-auto space-y-6'>
			{/* Tips Section */}
			<WidgetTips
				tips={percentageTips}
				widgetId='percentage-calculator'
				variant='inline'
				className='mb-6'
			/>

			<Card className='p-8'>
				<Tabs
					value={activeType}
					onValueChange={value => setActiveType(value as CalculationType)}
				>
					<TabsList className='grid grid-cols-2 lg:grid-cols-3 gap-2 h-auto'>
						{tabConfig.map(tab => (
							<TabsTrigger
								key={tab.id}
								value={tab.id}
								className='data-[state=active]:bg-primary data-[state=active]:text-primary-foreground flex items-center gap-2 px-3 py-2 text-sm'
							>
								<tab.icon className='w-4 h-4' />
								<span className='hidden sm:inline'>{tab.label}</span>
							</TabsTrigger>
						))}
					</TabsList>

					{/* Percent of Number */}
					<TabsContent value='percentOfNumber' className='space-y-4 mt-6'>
						<div className='grid gap-4 sm:grid-cols-2'>
							<div>
								<Label htmlFor='percentOfPercentage'>
									{t('inputs.percentage')}
								</Label>
								<Input
									id='percentOfPercentage'
									type='number'
									value={values.percentOfPercentage}
									onChange={e =>
										updateValue('percentOfPercentage', e.target.value)
									}
									placeholder='20'
								/>
							</div>
							<div>
								<Label htmlFor='percentOfValue'>{t('inputs.number')}</Label>
								<Input
									id='percentOfValue'
									type='number'
									value={values.percentOfValue}
									onChange={e => updateValue('percentOfValue', e.target.value)}
									placeholder='100'
								/>
							</div>
						</div>
						{results.percentOfNumber && (
							<ResultCard result={results.percentOfNumber} />
						)}
					</TabsContent>

					{/* What Percent */}
					<TabsContent value='whatPercent' className='space-y-4 mt-6'>
						<div className='grid gap-4 sm:grid-cols-2'>
							<div>
								<Label htmlFor='whatPercentValue1'>{t('inputs.value')}</Label>
								<Input
									id='whatPercentValue1'
									type='number'
									value={values.whatPercentValue1}
									onChange={e =>
										updateValue('whatPercentValue1', e.target.value)
									}
									placeholder='25'
								/>
							</div>
							<div>
								<Label htmlFor='whatPercentValue2'>{t('inputs.of')}</Label>
								<Input
									id='whatPercentValue2'
									type='number'
									value={values.whatPercentValue2}
									onChange={e =>
										updateValue('whatPercentValue2', e.target.value)
									}
									placeholder='200'
								/>
							</div>
						</div>
						{results.whatPercent && <ResultCard result={results.whatPercent} />}
					</TabsContent>

					{/* Find Total */}
					<TabsContent value='findTotal' className='space-y-4 mt-6'>
						<div className='grid gap-4 sm:grid-cols-2'>
							<div>
								<Label htmlFor='findTotalValue'>{t('inputs.value')}</Label>
								<Input
									id='findTotalValue'
									type='number'
									value={values.findTotalValue}
									onChange={e => updateValue('findTotalValue', e.target.value)}
									placeholder='30'
								/>
							</div>
							<div>
								<Label htmlFor='findTotalPercentage'>
									{t('inputs.isPercentOf')}
								</Label>
								<Input
									id='findTotalPercentage'
									type='number'
									value={values.findTotalPercentage}
									onChange={e =>
										updateValue('findTotalPercentage', e.target.value)
									}
									placeholder='15'
								/>
							</div>
						</div>
						{results.findTotal && <ResultCard result={results.findTotal} />}
					</TabsContent>

					{/* Percent Change */}
					<TabsContent value='percentChange' className='space-y-4 mt-6'>
						<div className='grid gap-4 sm:grid-cols-2'>
							<div>
								<Label htmlFor='changeOldValue'>{t('inputs.from')}</Label>
								<Input
									id='changeOldValue'
									type='number'
									value={values.changeOldValue}
									onChange={e => updateValue('changeOldValue', e.target.value)}
									placeholder='100'
								/>
							</div>
							<div>
								<Label htmlFor='changeNewValue'>{t('inputs.to')}</Label>
								<Input
									id='changeNewValue'
									type='number'
									value={values.changeNewValue}
									onChange={e => updateValue('changeNewValue', e.target.value)}
									placeholder='125'
								/>
							</div>
						</div>
						{results.percentChange && (
							<ResultCard result={results.percentChange} />
						)}
					</TabsContent>

					{/* Add Percent */}
					<TabsContent value='addPercent' className='space-y-4 mt-6'>
						<div className='grid gap-4 sm:grid-cols-2'>
							<div>
								<Label htmlFor='addSubtractValue'>{t('inputs.value')}</Label>
								<Input
									id='addSubtractValue'
									type='number'
									value={values.addSubtractValue}
									onChange={e =>
										updateValue('addSubtractValue', e.target.value)
									}
									placeholder='100'
								/>
							</div>
							<div>
								<Label htmlFor='addSubtractPercentage'>
									{t('inputs.addPercentage')}
								</Label>
								<Input
									id='addSubtractPercentage'
									type='number'
									value={values.addSubtractPercentage}
									onChange={e =>
										updateValue('addSubtractPercentage', e.target.value)
									}
									placeholder='20'
								/>
							</div>
						</div>
						{results.addPercent && <ResultCard result={results.addPercent} />}
					</TabsContent>

					{/* Subtract Percent */}
					<TabsContent value='subtractPercent' className='space-y-4 mt-6'>
						<div className='grid gap-4 sm:grid-cols-2'>
							<div>
								<Label htmlFor='subtractValue'>{t('inputs.value')}</Label>
								<Input
									id='subtractValue'
									type='number'
									value={values.addSubtractValue}
									onChange={e =>
										updateValue('addSubtractValue', e.target.value)
									}
									placeholder='100'
								/>
							</div>
							<div>
								<Label htmlFor='subtractPercentage'>
									{t('inputs.subtractPercentage')}
								</Label>
								<Input
									id='subtractPercentage'
									type='number'
									value={values.addSubtractPercentage}
									onChange={e =>
										updateValue('addSubtractPercentage', e.target.value)
									}
									placeholder='20'
								/>
							</div>
						</div>
						{results.subtractPercent && (
							<ResultCard result={results.subtractPercent} />
						)}
					</TabsContent>
				</Tabs>

				{/* Action Buttons */}
				<div className='flex gap-2 mt-6'>
					<Button onClick={loadExample} variant='outline' className='flex-1'>
						{t('buttons.loadExample')}
						<ShortcutHint
							shortcut={{
								key: 'e',
								ctrl: true,
								description: '',
								action: loadExample
							}}
							className='ml-2'
						/>
					</Button>
					<Button
						onClick={() => copyResult(activeType)}
						variant='outline'
						disabled={!results[activeType]}
					>
						<Copy className='w-4 h-4 mr-2' />
						{t('buttons.copy')}
					</Button>
					<Button onClick={reset} variant='outline'>
						<RefreshCw className='w-4 h-4 mr-2' />
						{t('buttons.reset')}
					</Button>
				</div>
			</Card>

			{/* Info Section */}
			<Card className='p-6 bg-muted/50'>
				<h3 className='font-semibold mb-4'>{t('info.title')}</h3>
				<div className='grid md:grid-cols-2 gap-6 text-sm'>
					<div>
						<h4 className='font-medium mb-2'>{t('info.commonUses.title')}</h4>
						<ul className='text-muted-foreground space-y-1'>
							<li>• {t('info.commonUses.item1')}</li>
							<li>• {t('info.commonUses.item2')}</li>
							<li>• {t('info.commonUses.item3')}</li>
							<li>• {t('info.commonUses.item4')}</li>
						</ul>
					</div>
					<div>
						<h4 className='font-medium mb-2'>{t('info.formulas.title')}</h4>
						<ul className='text-muted-foreground space-y-1'>
							<li>• {t('info.formulas.item1')}</li>
							<li>• {t('info.formulas.item2')}</li>
							<li>• {t('info.formulas.item3')}</li>
							<li>• {t('info.formulas.item4')}</li>
						</ul>
					</div>
				</div>
			</Card>

			{/* Social Share Section */}
			<WidgetShareSection
				widgetTitle='Percentage Calculator'
				widgetDescription='Calculate percentages, percentage changes, and more with formulas and examples.'
				hashtags={['percentage', 'calculator', 'math', 'finance']}
				variant='inline'
			/>

			{/* Keyboard shortcuts */}
			<WidgetKeyboardShortcuts
				shortcuts={shortcuts}
				variant='floating'
				position='bottom-right'
			/>
		</div>
	)
}

function ResultCard({
	result
}: {
	result: { result: number; formula: string; explanation: string }
}) {
	return (
		<Card className='p-4 bg-primary/5 border-primary/20'>
			<div className='space-y-2'>
				<div className='text-3xl font-bold text-primary'>
					{result.result.toFixed(2)}
					{result.formula.includes('%') && '%'}
				</div>
				<div className='text-sm text-muted-foreground font-mono'>
					{result.formula}
				</div>
				<div className='text-sm'>{result.explanation}</div>
			</div>
		</Card>
	)
}
