'use client'

import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue
} from '@/components/ui/select'
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
	useCompoundInterestCalculator,
	type CompoundingFrequency
} from '@/lib/hooks/widgets'
import { formatCurrency } from '@/lib/utils/currency'
import {
	Calculator,
	TrendingUp,
	Calendar,
	DollarSign,
	Percent,
	PiggyBank,
	BarChart3,
	Info,
	Copy,
	RefreshCw
} from 'lucide-react'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'

const COMPOUNDING_FREQUENCIES = {
	daily: { value: 365, label: 'Ежедневно' },
	monthly: { value: 12, label: 'Ежемесячно' },
	quarterly: { value: 4, label: 'Ежеквартально' },
	annually: { value: 1, label: 'Ежегодно' }
}

export default function CompoundInterestCalculatorPage() {
	const [showAdvanced, setShowAdvanced] = useState(false)

	// Use compound interest calculator hook
	const {
		input,
		result,
		isCalculating,
		updateField,
		calculate,
		copyResults,
		reset,
		loadExample
	} = useCompoundInterestCalculator()

	// Keyboard shortcuts
	const shortcuts: KeyboardShortcut[] = [
		{
			...commonWidgetShortcuts.submit,
			action: calculate
		},
		{
			...commonWidgetShortcuts.reset,
			action: reset
		},
		{
			key: 'c',
			ctrl: true,
			shift: true,
			description: 'Copy results',
			action: copyResults,
			enabled: !!result
		},
		{
			key: 'e',
			ctrl: true,
			description: 'Load example',
			action: loadExample
		},
		{
			key: 'a',
			ctrl: true,
			description: 'Toggle advanced',
			action: () => setShowAdvanced(!showAdvanced)
		}
	]

	useWidgetKeyboard({
		shortcuts,
		widgetId: 'compound-interest-calculator',
		enabled: true
	})

	// Widget tips
	const compoundInterestTips = [
		{
			id: 'power-of-compounding',
			title: 'Power of Compounding',
			description:
				'The earlier you start, the more powerful compound interest becomes due to time',
			category: 'basic' as const
		},
		{
			id: 'regular-contributions',
			title: 'Regular Contributions',
			description:
				'Adding money regularly can dramatically increase your final amount',
			category: 'basic' as const
		},
		{
			id: 'compounding-frequency',
			title: 'Compounding Frequency',
			description:
				'More frequent compounding (daily vs annually) increases returns, but the difference is often small',
			category: 'advanced' as const,
			action: {
				label: 'Show Advanced',
				onClick: () => setShowAdvanced(true)
			}
		},
		{
			id: 'example',
			title: 'Try Example',
			description:
				'Load a sample calculation to see how $10,000 grows with $500 monthly contributions',
			category: 'basic' as const,
			action: {
				label: 'Load Example',
				onClick: loadExample
			}
		},
		{
			id: 'rule-72',
			title: 'Rule of 72',
			description:
				'Divide 72 by your interest rate to estimate how long it takes to double your money',
			category: 'pro' as const
		}
	]

	return (
		<div className='max-w-6xl mx-auto space-y-6'>
			{/* Tips Section */}
			<WidgetTips
				tips={compoundInterestTips}
				widgetId='compound-interest-calculator'
				variant='inline'
				className='mb-6'
			/>

			<div className='grid lg:grid-cols-2 gap-6'>
				{/* Input Form */}
				<Card className='p-6'>
					<h3 className='font-semibold mb-4 flex items-center gap-2'>
						<Calculator className='w-5 h-5' />
						Параметры расчета
					</h3>

					<div className='space-y-4'>
						{/* Principal */}
						<div>
							<Label htmlFor='principal' className='flex items-center gap-2'>
								<DollarSign className='w-4 h-4' />
								Начальная сумма ($)
							</Label>
							<Input
								id='principal'
								type='number'
								value={input.principal}
								onChange={e => updateField('principal', e.target.value)}
								placeholder='10000'
								min='0'
								step='100'
								className='mt-1'
							/>
						</div>

						{/* Interest Rate */}
						<div>
							<Label htmlFor='rate' className='flex items-center gap-2'>
								<Percent className='w-4 h-4' />
								Процентная ставка (% в год)
							</Label>
							<Input
								id='rate'
								type='number'
								value={input.rate}
								onChange={e => updateField('rate', e.target.value)}
								placeholder='7'
								min='0'
								max='50'
								step='0.1'
								className='mt-1'
							/>
						</div>

						{/* Time Period */}
						<div>
							<Label htmlFor='time' className='flex items-center gap-2'>
								<Calendar className='w-4 h-4' />
								Период (лет)
							</Label>
							<Input
								id='time'
								type='number'
								value={input.time}
								onChange={e => updateField('time', e.target.value)}
								placeholder='10'
								min='1'
								max='50'
								className='mt-1'
							/>
						</div>

						{/* Monthly Contribution */}
						<div>
							<Label htmlFor='contribution' className='flex items-center gap-2'>
								<PiggyBank className='w-4 h-4' />
								Регулярный взнос ($)
							</Label>
							<Input
								id='contribution'
								type='number'
								value={input.contribution}
								onChange={e => updateField('contribution', e.target.value)}
								placeholder='500'
								min='0'
								step='50'
								className='mt-1'
							/>
						</div>

						{/* Advanced Options */}
						<Button
							onClick={() => setShowAdvanced(!showAdvanced)}
							variant='outline'
							className='w-full'
						>
							{showAdvanced ? 'Скрыть' : 'Показать'} расширенные настройки
						</Button>

						{showAdvanced && (
							<div className='space-y-4 pt-2'>
								{/* Contribution Frequency */}
								<div>
									<Label>Частота взносов</Label>
									<Select
										value={input.contributionFrequency}
										onValueChange={(value: CompoundingFrequency) =>
											updateField('contributionFrequency', value)
										}
									>
										<SelectTrigger className='mt-1'>
											<SelectValue />
										</SelectTrigger>
										<SelectContent>
											{Object.entries(COMPOUNDING_FREQUENCIES).map(
												([key, freq]) => (
													<SelectItem key={key} value={key}>
														{freq.label}
													</SelectItem>
												)
											)}
										</SelectContent>
									</Select>
								</div>

								{/* Compounding Frequency */}
								<div>
									<Label>Частота капитализации</Label>
									<Select
										value={input.compoundingFrequency}
										onValueChange={(value: CompoundingFrequency) =>
											updateField('compoundingFrequency', value)
										}
									>
										<SelectTrigger className='mt-1'>
											<SelectValue />
										</SelectTrigger>
										<SelectContent>
											{Object.entries(COMPOUNDING_FREQUENCIES).map(
												([key, freq]) => (
													<SelectItem key={key} value={key}>
														{freq.label}
													</SelectItem>
												)
											)}
										</SelectContent>
									</Select>
								</div>
							</div>
						)}

						<div className='flex gap-2 pt-2'>
							<Button
								onClick={loadExample}
								variant='outline'
								className='flex-1'
							>
								Загрузить пример
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
								onClick={copyResults}
								variant='outline'
								disabled={!result}
							>
								<Copy className='w-4 h-4 mr-2' />
								Копировать
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
					<div className='space-y-6'>
						{/* Summary Card */}
						<Card className='p-6'>
							<h3 className='font-semibold mb-4 flex items-center gap-2'>
								<TrendingUp className='w-5 h-5' />
								Результаты расчета
							</h3>

							<div className='space-y-4'>
								{/* Final Amount */}
								<div className='text-center p-4 bg-primary/5 rounded-lg'>
									<div className='text-3xl font-bold text-primary mb-1'>
										{formatCurrency(result.finalAmount)}
									</div>
									<p className='text-sm text-muted-foreground'>
										Итоговая сумма
									</p>
								</div>

								{/* Key Metrics */}
								<div className='grid grid-cols-2 gap-4'>
									<div className='p-3 bg-green-50 dark:bg-green-950/20 rounded-lg'>
										<div className='font-semibold text-green-700 dark:text-green-300'>
											{formatCurrency(result.totalInterest)}
										</div>
										<p className='text-xs text-muted-foreground'>
											Заработано процентов
										</p>
									</div>

									<div className='p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg'>
										<div className='font-semibold text-blue-700 dark:text-blue-300'>
											{formatCurrency(result.totalContributions)}
										</div>
										<p className='text-xs text-muted-foreground'>Общий вклад</p>
									</div>
								</div>

								<div className='p-3 bg-purple-50 dark:bg-purple-950/20 rounded-lg'>
									<div className='flex justify-between items-center'>
										<span className='text-sm text-muted-foreground'>
											Эффективная ставка:
										</span>
										<Badge variant='secondary'>
											{result.effectiveRate.toFixed(2)}%
										</Badge>
									</div>
								</div>
							</div>
						</Card>

						{/* Yearly Breakdown */}
						{result.yearlyBreakdown.length > 0 && (
							<Card className='p-6'>
								<h3 className='font-semibold mb-4 flex items-center gap-2'>
									<BarChart3 className='w-5 h-5' />
									Годовая разбивка
								</h3>

								<div className='space-y-2 max-h-64 overflow-y-auto'>
									{result.yearlyBreakdown.map(year => (
										<div
											key={year.year}
											className='flex items-center justify-between p-3 bg-muted/50 rounded-lg'
										>
											<div className='flex items-center gap-3'>
												<Badge variant='outline'>{year.year} год</Badge>
												<div className='text-sm text-muted-foreground'>
													+{formatCurrency(year.contribution)} взнос
												</div>
											</div>
											<div className='text-right'>
												<div className='font-semibold'>
													{formatCurrency(year.endBalance)}
												</div>
												<div className='text-xs text-green-600 dark:text-green-400'>
													+{formatCurrency(year.interest)} процентов
												</div>
											</div>
										</div>
									))}
								</div>
							</Card>
						)}
					</div>
				)}
			</div>

			{/* Info Section */}
			<Card className='p-6 bg-muted/50'>
				<h3 className='font-semibold mb-4 flex items-center gap-2'>
					<Info className='w-4 h-4' />О сложных процентах
				</h3>
				<div className='grid md:grid-cols-3 gap-6 text-sm'>
					<div>
						<h4 className='font-medium mb-2'>Принцип работы</h4>
						<ul className='text-muted-foreground space-y-1'>
							<li>• Проценты начисляются на основную сумму</li>
							<li>• Затем проценты начисляются на проценты</li>
							<li>• Эффект усиливается со временем</li>
							<li>• Регулярные взносы ускоряют рост</li>
						</ul>
					</div>
					<div>
						<h4 className='font-medium mb-2'>Ключевые факторы</h4>
						<ul className='text-muted-foreground space-y-1'>
							<li>• Время - самый важный фактор</li>
							<li>• Процентная ставка влияет экспоненциально</li>
							<li>• Частота капитализации имеет значение</li>
							<li>• Регулярные взносы удваивают эффект</li>
						</ul>
					</div>
					<div>
						<h4 className='font-medium mb-2'>Практические советы</h4>
						<ul className='text-muted-foreground space-y-1'>
							<li>• Начинайте инвестировать как можно раньше</li>
							<li>• Регулярно пополняйте счет</li>
							<li>• Не трогайте накопления без крайней нужды</li>
							<li>• Реинвестируйте полученную прибыль</li>
						</ul>
					</div>
				</div>
			</Card>

			{/* Social Share Section */}
			<WidgetShareSection
				widgetTitle='Compound Interest Calculator'
				widgetDescription='Calculate the power of compound interest with regular contributions and detailed yearly breakdown.'
				hashtags={[
					'compoundinterest',
					'investment',
					'finance',
					'calculator',
					'savings'
				]}
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
