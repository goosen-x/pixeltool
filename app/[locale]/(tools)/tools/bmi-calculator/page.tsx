'use client'

import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue
} from '@/components/ui/select'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { WidgetKeyboardShortcuts, ShortcutHint } from '@/components/widgets'
import {
	useWidgetKeyboard,
	commonWidgetShortcuts,
	type KeyboardShortcut
} from '@/lib/hooks/useWidgetKeyboard'
import {
	useBMICalculator,
	type ActivityLevel,
	type Gender,
	type UnitSystem
} from '@/lib/hooks/widgets'
import {
	Weight,
	Ruler,
	Copy,
	RefreshCw,
	Activity,
	Info,
	User,
	Users,
	TrendingUp,
	AlertCircle,
	CheckCircle,
	Calculator,
	Heart,
	Zap,
	Target,
	Scale,
	BarChart3,
	Flame,
	Dumbbell,
	Calendar,
	Sparkles,
	ChevronRight
} from 'lucide-react'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'
import { useTranslations } from 'next-intl'

// Activity levels will be handled by translations

export default function BMICalculatorPage() {
	const t = useTranslations('widgets.bmiCalculator')
	const [showAdvanced, setShowAdvanced] = useState(false)
	const [activeTab, setActiveTab] = useState('basic')

	// BMI categories with translations
	const getBMICategories = () => [
		{
			min: 0,
			max: 16,
			label: t('categories.severeUnderweight'),
			color: 'from-red-600 to-red-500'
		},
		{
			min: 16,
			max: 18.5,
			label: t('categories.underweight'),
			color: 'from-orange-600 to-orange-500'
		},
		{
			min: 18.5,
			max: 25,
			label: t('categories.normal'),
			color: 'from-green-600 to-green-500'
		},
		{
			min: 25,
			max: 30,
			label: t('categories.overweight'),
			color: 'from-yellow-600 to-yellow-500'
		},
		{
			min: 30,
			max: 35,
			label: t('categories.obesityClass1'),
			color: 'from-orange-600 to-orange-500'
		},
		{
			min: 35,
			max: 40,
			label: t('categories.obesityClass2'),
			color: 'from-red-600 to-red-500'
		},
		{
			min: 40,
			max: 100,
			label: t('categories.obesityClass3'),
			color: 'from-red-700 to-red-600'
		}
	]

	// Use the BMI calculator hook
	const {
		input,
		result,
		healthMetrics,
		updateField,
		calculate,
		reset: resetCalculator,
		copyResults,
		loadExample: loadExampleData,
		getBMIVisualization
	} = useBMICalculator()

	// Handle reset with additional UI state
	const handleReset = () => {
		resetCalculator()
		setShowAdvanced(false)
	}

	// Handle load example with UI state
	const handleLoadExample = () => {
		loadExampleData()
		setShowAdvanced(true)
		setActiveTab('advanced')
	}

	// Keyboard shortcuts
	const shortcuts: KeyboardShortcut[] = [
		{
			...commonWidgetShortcuts.submit,
			action: calculate
		},
		{
			...commonWidgetShortcuts.reset,
			action: handleReset
		},
		{
			key: 'c',
			alt: true,
			description: 'Copy results',
			action: copyResults,
			enabled: !!result
		},
		{
			key: 'e',
			primary: true,
			description: 'Load example',
			action: handleLoadExample
		},
		{
			key: 'u',
			primary: true,
			description: 'Switch units',
			action: () =>
				updateField(
					'unitSystem',
					input.unitSystem === 'metric' ? 'imperial' : 'metric'
				)
		}
	]

	useWidgetKeyboard({
		shortcuts,
		widgetId: 'bmi-calculator',
		enabled: true
	})

	const getCurrentBMICategory = (bmi: number) => {
		const categories = getBMICategories()
		return (
			categories.find(cat => bmi >= cat.min && bmi < cat.max) || categories[0]
		)
	}

	return (
		<div className='max-w-7xl mx-auto space-y-8'>
			{/* Main Calculator Card */}
			<Card className='relative overflow-hidden'>
				<div className='absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5' />

				<div className='relative p-8'>
					{/* Tabs for Basic/Advanced */}
					<Tabs
						value={activeTab}
						onValueChange={setActiveTab}
						className='space-y-6'
					>
						<TabsList className='grid w-full max-w-md mx-auto grid-cols-2'>
							<TabsTrigger value='basic' className='gap-2'>
								<Calculator className='w-4 h-4' />
								{t('tabs.basic')}
							</TabsTrigger>
							<TabsTrigger value='advanced' className='gap-2'>
								<BarChart3 className='w-4 h-4' />
								{t('tabs.advanced')}
							</TabsTrigger>
						</TabsList>

						<TabsContent value='basic' className='space-y-6'>
							<div className='grid lg:grid-cols-2 gap-8'>
								{/* Input Section */}
								<div className='space-y-6'>
									<div className='flex items-center justify-between'>
										<h3 className='text-lg font-semibold flex items-center gap-2'>
											<User className='w-5 h-5' />
											{t('input.yourParameters')}
										</h3>
										<Button
											onClick={handleLoadExample}
											variant='ghost'
											size='sm'
											className='gap-2'
										>
											<Sparkles className='w-4 h-4' />
											{t('input.example')}
										</Button>
									</div>

									{/* Unit System Toggle */}
									<div className='p-4 rounded-xl bg-muted/50'>
										<RadioGroup
											value={input.unitSystem}
											onValueChange={(value: UnitSystem) =>
												updateField('unitSystem', value)
											}
											className='grid grid-cols-2 gap-4'
										>
											<div
												className={cn(
													'flex items-center justify-center gap-2 p-3 rounded-lg border-2 cursor-pointer transition-all',
													input.unitSystem === 'metric'
														? 'border-primary bg-primary/10'
														: 'border-transparent bg-background hover:bg-muted'
												)}
											>
												<RadioGroupItem
													value='metric'
													id='metric'
													className='sr-only'
												/>
												<Label
													htmlFor='metric'
													className='cursor-pointer text-center'
												>
													<div className='font-medium'>
														{t('unitSystem.metric')}
													</div>
													<div className='text-xs text-muted-foreground'>
														{t('unitSystem.metricUnits')}
													</div>
												</Label>
											</div>
											<div
												className={cn(
													'flex items-center justify-center gap-2 p-3 rounded-lg border-2 cursor-pointer transition-all',
													input.unitSystem === 'imperial'
														? 'border-primary bg-primary/10'
														: 'border-transparent bg-background hover:bg-muted'
												)}
											>
												<RadioGroupItem
													value='imperial'
													id='imperial'
													className='sr-only'
												/>
												<Label
													htmlFor='imperial'
													className='cursor-pointer text-center'
												>
													<div className='font-medium'>
														{t('unitSystem.imperial')}
													</div>
													<div className='text-xs text-muted-foreground'>
														{t('unitSystem.imperialUnits')}
													</div>
												</Label>
											</div>
										</RadioGroup>
									</div>

									{/* Basic Inputs */}
									<div className='grid gap-4'>
										{/* Weight and Height Row */}
										<div className='grid grid-cols-2 gap-4'>
											<div className='space-y-2'>
												<Label
													htmlFor='weight'
													className='flex items-center gap-2'
												>
													<Scale className='w-4 h-4' />
													{t('input.weight')}
												</Label>
												<div className='relative'>
													<Input
														id='weight'
														type='number'
														value={input.weight}
														onChange={e =>
															updateField('weight', e.target.value)
														}
														placeholder={
															input.unitSystem === 'metric' ? '70' : '154'
														}
														min='1'
														step='0.1'
														className='pr-12'
													/>
													<span className='absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground'>
														{input.unitSystem === 'metric'
															? t('units.kg')
															: t('units.lbs')}
													</span>
												</div>
											</div>

											{input.unitSystem === 'metric' ? (
												<div className='space-y-2'>
													<Label
														htmlFor='height'
														className='flex items-center gap-2'
													>
														<Ruler className='w-4 h-4' />
														{t('input.height')}
													</Label>
													<div className='relative'>
														<Input
															id='height'
															type='number'
															value={input.height}
															onChange={e =>
																updateField('height', e.target.value)
															}
															placeholder='175'
															min='50'
															max='250'
															className='pr-12'
														/>
														<span className='absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground'>
															{t('units.cm')}
														</span>
													</div>
												</div>
											) : (
												<div className='space-y-2'>
													<Label className='flex items-center gap-2'>
														<Ruler className='w-4 h-4' />
														{t('input.height')}
													</Label>
													<div className='grid grid-cols-2 gap-2'>
														<div className='relative'>
															<Input
																type='number'
																value={input.feet}
																onChange={e =>
																	updateField('feet', e.target.value)
																}
																placeholder='5'
																min='3'
																max='8'
																className='pr-8'
															/>
															<span className='absolute right-2 top-1/2 -translate-y-1/2 text-xs text-muted-foreground'>
																ft
															</span>
														</div>
														<div className='relative'>
															<Input
																type='number'
																value={input.inches}
																onChange={e =>
																	updateField('inches', e.target.value)
																}
																placeholder='9'
																min='0'
																max='11'
																className='pr-8'
															/>
															<span className='absolute right-2 top-1/2 -translate-y-1/2 text-xs text-muted-foreground'>
																in
															</span>
														</div>
													</div>
												</div>
											)}
										</div>

										{/* Age and Gender Row */}
										<div className='grid grid-cols-2 gap-4'>
											<div className='space-y-2'>
												<Label
													htmlFor='age'
													className='flex items-center gap-2'
												>
													<Calendar className='w-4 h-4' />
													{t('input.age')}
												</Label>
												<Input
													id='age'
													type='number'
													value={input.age}
													onChange={e => updateField('age', e.target.value)}
													placeholder='30'
													min='15'
													max='100'
												/>
											</div>

											<div className='space-y-2'>
												<Label className='flex items-center gap-2'>
													<Users className='w-4 h-4' />
													{t('input.gender')}
												</Label>
												<Select
													value={input.gender}
													onValueChange={(value: Gender) =>
														updateField('gender', value)
													}
												>
													<SelectTrigger>
														<SelectValue />
													</SelectTrigger>
													<SelectContent>
														<SelectItem value='male'>
															{t('input.male')}
														</SelectItem>
														<SelectItem value='female'>
															{t('input.female')}
														</SelectItem>
													</SelectContent>
												</Select>
											</div>
										</div>

										{/* Activity Level */}
										<div className='space-y-2'>
											<Label className='flex items-center gap-2'>
												<Activity className='w-4 h-4' />
												{t('input.activityLevel')}
											</Label>
											<Select
												value={input.activityLevel}
												onValueChange={(value: ActivityLevel) =>
													updateField('activityLevel', value)
												}
											>
												<SelectTrigger>
													<SelectValue />
												</SelectTrigger>
												<SelectContent>
													<SelectItem value='sedentary'>
														{t('input.activityLevels.sedentary')}
													</SelectItem>
													<SelectItem value='light'>
														{t('input.activityLevels.light')}
													</SelectItem>
													<SelectItem value='moderate'>
														{t('input.activityLevels.moderate')}
													</SelectItem>
													<SelectItem value='active'>
														{t('input.activityLevels.active')}
													</SelectItem>
													<SelectItem value='very-active'>
														{t('input.activityLevels.veryActive')}
													</SelectItem>
												</SelectContent>
											</Select>
										</div>

										{/* Calculate Button */}
										<Button
											onClick={calculate}
											size='lg'
											className='w-full gap-2'
										>
											<Calculator className='w-5 h-5' />
											{t('actions.calculate')}
											<ShortcutHint
												shortcut={{
													key: 'Enter',
													description: '',
													action: calculate
												}}
												className='ml-auto'
											/>
										</Button>
									</div>
								</div>

								{/* Results Section */}
								<div className='space-y-6'>
									{result ? (
										<>
											{/* BMI Result Card */}
											<div className='text-center space-y-6'>
												<div className='p-8 rounded-2xl bg-gradient-to-br from-primary/10 to-accent/10 border border-primary/20'>
													<div className='text-6xl font-bold mb-2'>
														{result.bmi.toFixed(1)}
													</div>
													<Badge
														className={cn(
															'text-lg px-4 py-1 bg-gradient-to-r',
															getCurrentBMICategory(result.bmi).color
														)}
													>
														{result.category}
													</Badge>
												</div>

												{/* BMI Visual Scale */}
												<div className='space-y-2'>
													<div className='relative h-12 rounded-full overflow-hidden bg-gradient-to-r from-red-500 via-yellow-500 via-green-500 via-yellow-500 to-red-500'>
														<div
															className='absolute top-0 bottom-0 w-1 bg-background shadow-lg'
															style={{
																left: `${getBMIVisualization(result.bmi)}%`
															}}
														>
															<div className='absolute -top-8 left-1/2 -translate-x-1/2 bg-background border rounded-full px-2 py-1 text-xs font-medium whitespace-nowrap'>
																{result.bmi.toFixed(1)}
															</div>
														</div>
													</div>
													<div className='flex justify-between text-xs text-muted-foreground px-2'>
														<span>15</span>
														<span>18.5</span>
														<span>25</span>
														<span>30</span>
														<span>40</span>
													</div>
												</div>

												{/* Quick Stats */}
												<div className='grid grid-cols-2 gap-4'>
													<Card className='p-4'>
														<div className='flex items-center gap-3'>
															<div className='p-2 rounded-lg bg-primary/10'>
																<Target className='w-5 h-5 text-primary' />
															</div>
															<div>
																<p className='text-sm text-muted-foreground'>
																	{t('results.idealWeight')}
																</p>
																<p className='font-semibold'>
																	{result.idealWeight.min.toFixed(0)}-
																	{result.idealWeight.max.toFixed(0)}{' '}
																	{input.unitSystem === 'metric'
																		? t('units.kg')
																		: t('units.lbs')}
																</p>
															</div>
														</div>
													</Card>

													<Card className='p-4'>
														<div className='flex items-center gap-3'>
															<div className='p-2 rounded-lg bg-accent/10'>
																<Heart className='w-5 h-5 text-accent' />
															</div>
															<div>
																<p className='text-sm text-muted-foreground'>
																	{t('results.healthRisk')}
																</p>
																<p className='font-semibold'>
																	{result.healthRisk}
																</p>
															</div>
														</div>
													</Card>
												</div>

												{/* Weight Recommendation */}
												{(result.weightToLose > 0 ||
													result.weightToGain > 0) && (
													<Card className='p-6 bg-muted/50'>
														<h4 className='font-medium mb-3 flex items-center gap-2'>
															<TrendingUp className='w-5 h-5' />
															{t('results.weightRecommendation')}
														</h4>
														{result.weightToLose > 0 && (
															<div className='flex items-center justify-between'>
																<span className='text-muted-foreground'>
																	{t('results.recommendedToLose')}
																</span>
																<Badge
																	variant='destructive'
																	className='text-lg'
																>
																	-{result.weightToLose.toFixed(1)}{' '}
																	{input.unitSystem === 'metric'
																		? t('units.kg')
																		: t('units.lbs')}
																</Badge>
															</div>
														)}
														{result.weightToGain > 0 && (
															<div className='flex items-center justify-between'>
																<span className='text-muted-foreground'>
																	{t('results.recommendedToGain')}
																</span>
																<Badge variant='secondary' className='text-lg'>
																	+{result.weightToGain.toFixed(1)}{' '}
																	{input.unitSystem === 'metric'
																		? t('units.kg')
																		: t('units.lbs')}
																</Badge>
															</div>
														)}
														{result.weightToLose === 0 &&
															result.weightToGain === 0 && (
																<div className='flex items-center justify-center gap-2 text-green-600'>
																	<CheckCircle className='w-5 h-5' />
																	<span className='font-medium'>
																		{t('results.weightNormal')}
																	</span>
																</div>
															)}
													</Card>
												)}
											</div>
										</>
									) : (
										<div className='flex flex-col items-center justify-center h-full p-8 text-center'>
											<div className='w-24 h-24 rounded-full bg-muted/50 flex items-center justify-center mb-4'>
												<Calculator className='w-12 h-12 text-muted-foreground' />
											</div>
											<h3 className='text-lg font-medium mb-2'>
												{t('results.enterData')}
											</h3>
											<p className='text-muted-foreground'>
												{t('results.fillForm')}
											</p>
										</div>
									)}
								</div>
							</div>
						</TabsContent>

						<TabsContent value='advanced' className='space-y-6'>
							<div className='grid lg:grid-cols-2 gap-8'>
								{/* Advanced Input Section */}
								<div className='space-y-6'>
									<h3 className='text-lg font-semibold flex items-center gap-2'>
										<BarChart3 className='w-5 h-5' />
										{t('input.additionalParameters')}
									</h3>

									<div className='space-y-4'>
										{/* Body Measurements */}
										<Card className='p-4 space-y-4'>
											<h4 className='font-medium flex items-center gap-2'>
												<Ruler className='w-4 h-4' />
												{t('input.bodyMeasurements')}
											</h4>

											<div className='grid gap-4'>
												<div className='space-y-2'>
													<Label htmlFor='waist'>{t('input.waist')}</Label>
													<div className='relative'>
														<Input
															id='waist'
															type='number'
															value={input.waist}
															onChange={e =>
																updateField('waist', e.target.value)
															}
															placeholder={
																input.unitSystem === 'metric' ? '80' : '31.5'
															}
															className='pr-12'
														/>
														<span className='absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground'>
															{input.unitSystem === 'metric'
																? t('units.cm')
																: t('units.in')}
														</span>
													</div>
												</div>

												<div className='space-y-2'>
													<Label htmlFor='neck'>{t('input.neck')}</Label>
													<div className='relative'>
														<Input
															id='neck'
															type='number'
															value={input.neck}
															onChange={e =>
																updateField('neck', e.target.value)
															}
															placeholder={
																input.unitSystem === 'metric' ? '37' : '14.5'
															}
															className='pr-12'
														/>
														<span className='absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground'>
															{input.unitSystem === 'metric'
																? t('units.cm')
																: t('units.in')}
														</span>
													</div>
												</div>

												{input.gender === 'female' && (
													<div className='space-y-2'>
														<Label htmlFor='hip'>{t('input.hip')}</Label>
														<div className='relative'>
															<Input
																id='hip'
																type='number'
																value={input.hip}
																onChange={e =>
																	updateField('hip', e.target.value)
																}
																placeholder={
																	input.unitSystem === 'metric' ? '95' : '37.5'
																}
																className='pr-12'
															/>
															<span className='absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground'>
																{input.unitSystem === 'metric'
																	? t('units.cm')
																	: t('units.in')}
															</span>
														</div>
													</div>
												)}
											</div>
										</Card>

										<Button
											onClick={calculate}
											size='lg'
											className='w-full gap-2'
										>
											<BarChart3 className='w-5 h-5' />
											{t('actions.calculateFull')}
										</Button>
									</div>
								</div>

								{/* Advanced Results */}
								<div className='space-y-6'>
									{healthMetrics ? (
										<>
											{/* Body Composition */}
											<Card className='p-6 space-y-6'>
												<h3 className='font-semibold flex items-center gap-2'>
													<Dumbbell className='w-5 h-5' />
													{t('results.bodyComposition')}
												</h3>

												<div className='grid gap-4'>
													{/* Body Fat Percentage */}
													<div className='space-y-3'>
														<div className='flex justify-between items-center'>
															<span className='text-sm text-muted-foreground'>
																{t('results.bodyFat')}
															</span>
															<Badge
																variant={
																	healthMetrics.bodyFat > 25
																		? 'destructive'
																		: 'default'
																}
															>
																{healthMetrics.bodyFat.toFixed(1)}%
															</Badge>
														</div>
														<Progress
															value={healthMetrics.bodyFat}
															className='h-3'
														/>
														<p className='text-xs text-muted-foreground'>
															{t('results.normal')}:{' '}
															{input.gender === 'male' ? '10-20%' : '20-30%'}
														</p>
													</div>

													{/* Lean Mass */}
													<div className='p-4 rounded-lg bg-muted/50'>
														<div className='flex justify-between items-center mb-2'>
															<span className='text-sm font-medium'>
																{t('results.leanMass')}
															</span>
															<span className='text-2xl font-bold'>
																{healthMetrics.leanMass.toFixed(1)}{' '}
																{input.unitSystem === 'metric'
																	? t('units.kg')
																	: t('units.lbs')}
															</span>
														</div>
														<div className='flex items-center gap-2 text-xs text-muted-foreground'>
															<Dumbbell className='w-3 h-3' />
															<span>
																{(
																	(healthMetrics.leanMass /
																		parseFloat(input.weight)) *
																	100
																).toFixed(0)}
																% {t('results.ofTotalMass')}
															</span>
														</div>
													</div>

													{/* Waist to Height Ratio */}
													<div className='p-4 rounded-lg bg-muted/50'>
														<div className='flex justify-between items-center mb-2'>
															<span className='text-sm font-medium'>
																{t('results.waistToHeight')}
															</span>
															<Badge
																variant={
																	healthMetrics.waistToHeight > 0.5
																		? 'destructive'
																		: 'default'
																}
															>
																{healthMetrics.waistToHeight.toFixed(2)}
															</Badge>
														</div>
														<p className='text-xs text-muted-foreground'>
															{t('results.healthyRange')}: &lt; 0.5
														</p>
													</div>
												</div>
											</Card>

											{/* Calorie Recommendations */}
											<Card className='p-6 space-y-4'>
												<h3 className='font-semibold flex items-center gap-2'>
													<Flame className='w-5 h-5' />
													{t('results.calorieIntake')}
												</h3>

												<div className='space-y-3'>
													{/* Maintenance */}
													<div className='p-4 rounded-lg border-2 border-primary/20 bg-primary/5'>
														<div className='flex justify-between items-center mb-1'>
															<span className='font-medium'>
																{t('results.maintenance')}
															</span>
															<span className='text-2xl font-bold text-primary'>
																{result?.calories.maintenance}
															</span>
														</div>
														<p className='text-xs text-muted-foreground'>
															{t('results.perDay')}
														</p>
													</div>

													{/* Other calorie goals */}
													<div className='grid grid-cols-2 gap-3'>
														{result && result.weightToLose > 0 && (
															<>
																<div className='p-3 rounded-lg bg-yellow-50 dark:bg-yellow-950/20'>
																	<div className='text-sm font-medium mb-1'>
																		{t('results.slowWeightLoss')}
																	</div>
																	<div className='text-xl font-bold text-yellow-700 dark:text-yellow-400'>
																		{result.calories.mildLoss}
																	</div>
																	<p className='text-xs text-muted-foreground'>
																		-0.25{' '}
																		{input.unitSystem === 'metric'
																			? t('units.kg')
																			: t('units.lbs')}
																		/{t('results.perWeek')}
																	</p>
																</div>
																<div className='p-3 rounded-lg bg-orange-50 dark:bg-orange-950/20'>
																	<div className='text-sm font-medium mb-1'>
																		{t('results.weightLoss')}
																	</div>
																	<div className='text-xl font-bold text-orange-700 dark:text-orange-400'>
																		{result.calories.loss}
																	</div>
																	<p className='text-xs text-muted-foreground'>
																		-0.5{' '}
																		{input.unitSystem === 'metric'
																			? t('units.kg')
																			: t('units.lbs')}
																		/{t('results.perWeek')}
																	</p>
																</div>
															</>
														)}
														{result && result.weightToGain > 0 && (
															<>
																<div className='p-3 rounded-lg bg-green-50 dark:bg-green-950/20'>
																	<div className='text-sm font-medium mb-1'>
																		{t('results.slowWeightGain')}
																	</div>
																	<div className='text-xl font-bold text-green-700 dark:text-green-400'>
																		{result.calories.mildGain}
																	</div>
																	<p className='text-xs text-muted-foreground'>
																		+0.25{' '}
																		{input.unitSystem === 'metric'
																			? t('units.kg')
																			: t('units.lbs')}
																		/{t('results.perWeek')}
																	</p>
																</div>
																<div className='p-3 rounded-lg bg-emerald-50 dark:bg-emerald-950/20'>
																	<div className='text-sm font-medium mb-1'>
																		{t('results.weightGain')}
																	</div>
																	<div className='text-xl font-bold text-emerald-700 dark:text-emerald-400'>
																		{result.calories.gain}
																	</div>
																	<p className='text-xs text-muted-foreground'>
																		+0.5{' '}
																		{input.unitSystem === 'metric'
																			? t('units.kg')
																			: t('units.lbs')}
																		/{t('results.perWeek')}
																	</p>
																</div>
															</>
														)}
													</div>
												</div>
											</Card>
										</>
									) : (
										<div className='flex flex-col items-center justify-center h-full p-8 text-center'>
											<div className='w-24 h-24 rounded-full bg-muted/50 flex items-center justify-center mb-4'>
												<BarChart3 className='w-12 h-12 text-muted-foreground' />
											</div>
											<h3 className='text-lg font-medium mb-2'>
												{t('results.extendedAnalysis')}
											</h3>
											<p className='text-muted-foreground'>
												{t('results.enterMeasurements')}
											</p>
										</div>
									)}
								</div>
							</div>
						</TabsContent>
					</Tabs>

					{/* Action Buttons */}
					<div className='flex justify-center gap-3 mt-8'>
						<Button
							onClick={copyResults}
							variant='outline'
							disabled={!result}
							className='gap-2'
						>
							<Copy className='w-4 h-4' />
							{t('actions.copy')}
						</Button>
						<Button onClick={handleReset} variant='outline' className='gap-2'>
							<RefreshCw className='w-4 h-4' />
							{t('actions.reset')}
						</Button>
					</div>
				</div>
			</Card>

			{/* Info Cards */}
			<div className='grid md:grid-cols-3 gap-6'>
				<Card className='p-6'>
					<div className='flex items-start gap-4'>
						<div className='p-3 rounded-lg bg-primary/10'>
							<Info className='w-6 h-6 text-primary' />
						</div>
						<div>
							<h4 className='font-semibold mb-2'>{t('info.whatIsBMI')}</h4>
							<ul className='text-sm text-muted-foreground space-y-1'>
								<li>{t('info.bmiDescription.0')}</li>
								<li>{t('info.bmiDescription.1')}</li>
								<li>{t('info.bmiDescription.2')}</li>
							</ul>
						</div>
					</div>
				</Card>

				<Card className='p-6'>
					<div className='flex items-start gap-4'>
						<div className='p-3 rounded-lg bg-accent/10'>
							<AlertCircle className='w-6 h-6 text-accent' />
						</div>
						<div>
							<h4 className='font-semibold mb-2'>{t('info.limitations')}</h4>
							<ul className='text-sm text-muted-foreground space-y-1'>
								<li>{t('info.limitationsDescription.0')}</li>
								<li>{t('info.limitationsDescription.2')}</li>
								<li>{t('info.limitationsDescription.3')}</li>
							</ul>
						</div>
					</div>
				</Card>

				<Card className='p-6'>
					<div className='flex items-start gap-4'>
						<div className='p-3 rounded-lg bg-green-600/10'>
							<Zap className='w-6 h-6 text-green-600' />
						</div>
						<div>
							<h4 className='font-semibold mb-2'>
								{t('info.additionalMetrics')}
							</h4>
							<ul className='text-sm text-muted-foreground space-y-1'>
								<li>{t('info.additionalMetricsDescription.0')}</li>
								<li>{t('info.additionalMetricsDescription.1')}</li>
								<li>{t('info.additionalMetricsDescription.3')}</li>
							</ul>
						</div>
					</div>
				</Card>
			</div>

			{/* Keyboard shortcuts */}
			<WidgetKeyboardShortcuts
				shortcuts={shortcuts}
				variant='floating'
				position='bottom-right'
			/>
		</div>
	)
}
