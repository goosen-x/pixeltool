'use client'

import { useState } from 'react'
import { DollarSign, Users, Percent, Calculator } from 'lucide-react'
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Slider } from '@/components/ui/slider'
import { useTranslations } from 'next-intl'

export default function TipCalculatorPage() {
	const t = useTranslations('widgets.tipCalculator')
	const [billAmount, setBillAmount] = useState<string>('100')
	const [tipPercent, setTipPercent] = useState<number>(15)
	const [numberOfPeople, setNumberOfPeople] = useState<string>('1')
	const [customTipPercent, setCustomTipPercent] = useState<string>('')

	const tipPresets = [10, 15, 18, 20, 25]

	const calculateTip = () => {
		const bill = parseFloat(billAmount) || 0
		const tip = customTipPercent ? parseFloat(customTipPercent) : tipPercent
		const people = parseInt(numberOfPeople) || 1

		const tipAmount = (bill * tip) / 100
		const totalAmount = bill + tipAmount
		const tipPerPerson = tipAmount / people
		const totalPerPerson = totalAmount / people

		return {
			tipAmount: tipAmount.toFixed(2),
			totalAmount: totalAmount.toFixed(2),
			tipPerPerson: tipPerPerson.toFixed(2),
			totalPerPerson: totalPerPerson.toFixed(2)
		}
	}

	const result = calculateTip()

	return (
		<div className='min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-900 py-12'>
			<div className='container max-w-4xl mx-auto px-4'>
				<div className='text-center mb-8'>
					<h1 className='text-4xl font-bold mb-4'>{t('title')}</h1>
					<p className='text-lg text-muted-foreground'>{t('description')}</p>
				</div>

				<div className='grid md:grid-cols-2 gap-6'>
					{/* Input Section */}
					<Card>
						<CardHeader>
							<CardTitle className='flex items-center gap-2'>
								<Calculator className='h-5 w-5' />
								{t('inputSection')}
							</CardTitle>
						</CardHeader>
						<CardContent className='space-y-6'>
							{/* Bill Amount */}
							<div className='space-y-2'>
								<Label htmlFor='bill' className='flex items-center gap-2'>
									<DollarSign className='h-4 w-4' />
									{t('billAmount')}
								</Label>
								<Input
									id='bill'
									type='number'
									value={billAmount}
									onChange={e => setBillAmount(e.target.value)}
									placeholder='0.00'
									min='0'
									step='0.01'
									className='text-lg'
								/>
							</div>

							{/* Tip Percentage */}
							<div className='space-y-3'>
								<Label className='flex items-center gap-2'>
									<Percent className='h-4 w-4' />
									{t('tipPercentage')}
								</Label>

								{/* Preset Buttons */}
								<div className='grid grid-cols-5 gap-2'>
									{tipPresets.map(preset => (
										<Button
											key={preset}
											variant={
												tipPercent === preset && !customTipPercent
													? 'default'
													: 'outline'
											}
											size='sm'
											onClick={() => {
												setTipPercent(preset)
												setCustomTipPercent('')
											}}
										>
											{preset}%
										</Button>
									))}
								</div>

								{/* Custom Tip */}
								<Input
									type='number'
									value={customTipPercent}
									onChange={e => setCustomTipPercent(e.target.value)}
									placeholder={t('customTip')}
									min='0'
									max='100'
									className='text-sm'
								/>

								{/* Tip Slider */}
								<div className='space-y-2'>
									<Slider
										value={[
											customTipPercent
												? parseFloat(customTipPercent)
												: tipPercent
										]}
										onValueChange={value => {
											setTipPercent(value[0])
											setCustomTipPercent('')
										}}
										max={50}
										step={1}
										className='w-full'
									/>
									<div className='text-center text-2xl font-semibold text-primary'>
										{customTipPercent || tipPercent}%
									</div>
								</div>
							</div>

							{/* Number of People */}
							<div className='space-y-2'>
								<Label htmlFor='people' className='flex items-center gap-2'>
									<Users className='h-4 w-4' />
									{t('numberOfPeople')}
								</Label>
								<Input
									id='people'
									type='number'
									value={numberOfPeople}
									onChange={e => setNumberOfPeople(e.target.value)}
									placeholder='1'
									min='1'
									className='text-lg'
								/>
							</div>
						</CardContent>
					</Card>

					{/* Results Section */}
					<Card>
						<CardHeader>
							<CardTitle>{t('results')}</CardTitle>
							<CardDescription>{t('resultsDescription')}</CardDescription>
						</CardHeader>
						<CardContent className='space-y-4'>
							{/* Tip Amount */}
							<div className='p-4 bg-emerald-50 dark:bg-emerald-950/20 rounded-lg'>
								<div className='text-sm text-muted-foreground'>
									{t('tipAmount')}
								</div>
								<div className='text-3xl font-bold text-emerald-600 dark:text-emerald-400'>
									${result.tipAmount}
								</div>
							</div>

							{/* Total with Tip */}
							<div className='p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg'>
								<div className='text-sm text-muted-foreground'>
									{t('totalWithTip')}
								</div>
								<div className='text-3xl font-bold text-blue-600 dark:text-blue-400'>
									${result.totalAmount}
								</div>
							</div>

							{parseInt(numberOfPeople) > 1 && (
								<>
									<div className='border-t pt-4'>
										<h3 className='font-semibold mb-3'>{t('perPerson')}</h3>

										{/* Tip per Person */}
										<div className='flex justify-between items-center p-3 bg-muted/30 rounded-lg mb-2'>
											<span className='text-sm'>{t('tipPerPerson')}</span>
											<span className='font-semibold text-lg'>
												${result.tipPerPerson}
											</span>
										</div>

										{/* Total per Person */}
										<div className='flex justify-between items-center p-3 bg-muted/30 rounded-lg'>
											<span className='text-sm'>{t('totalPerPerson')}</span>
											<span className='font-semibold text-lg'>
												${result.totalPerPerson}
											</span>
										</div>
									</div>
								</>
							)}

							{/* Bill Breakdown */}
							<div className='border-t pt-4 space-y-2 text-sm'>
								<div className='flex justify-between'>
									<span className='text-muted-foreground'>
										{t('originalBill')}
									</span>
									<span>${parseFloat(billAmount || '0').toFixed(2)}</span>
								</div>
								<div className='flex justify-between'>
									<span className='text-muted-foreground'>
										{t('tip')} ({customTipPercent || tipPercent}%)
									</span>
									<span className='text-emerald-600 dark:text-emerald-400'>
										+${result.tipAmount}
									</span>
								</div>
								<div className='flex justify-between font-semibold text-base border-t pt-2'>
									<span>{t('total')}</span>
									<span>${result.totalAmount}</span>
								</div>
							</div>
						</CardContent>
					</Card>
				</div>

				{/* Tip Guide */}
				<Card className='mt-6'>
					<CardHeader>
						<CardTitle>{t('tipGuide.title')}</CardTitle>
					</CardHeader>
					<CardContent>
						<div className='grid sm:grid-cols-2 md:grid-cols-3 gap-4'>
							<div className='p-3 bg-muted/30 rounded-lg'>
								<div className='font-semibold'>10-15%</div>
								<div className='text-sm text-muted-foreground'>
									{t('tipGuide.basic')}
								</div>
							</div>
							<div className='p-3 bg-muted/30 rounded-lg'>
								<div className='font-semibold'>15-20%</div>
								<div className='text-sm text-muted-foreground'>
									{t('tipGuide.good')}
								</div>
							</div>
							<div className='p-3 bg-muted/30 rounded-lg'>
								<div className='font-semibold'>20%+</div>
								<div className='text-sm text-muted-foreground'>
									{t('tipGuide.excellent')}
								</div>
							</div>
						</div>
					</CardContent>
				</Card>
			</div>
		</div>
	)
}
