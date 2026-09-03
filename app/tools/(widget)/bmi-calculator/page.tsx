'use client'

import { useMemo, useState } from 'react'
import { Check, Copy } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { toolBar, toolFooterBar, toolIconButton } from '@/lib/ui/tool-pill'
import { WidgetSEOWrapper } from '@/components/seo/WidgetSEOWrapper'
import { getWidgetById } from '@/lib/constants/widgets'
import { BmiCalculatorSeo } from './BmiCalculatorSeo'
import { ToolScreenshot } from '@/components/tools/ToolScreenshot'

interface BmiCategory {
	label: string
	colorClass: string
}

// Пороги — стандарт ВОЗ, единые для мужчин и женщин (сам показатель пол не
// учитывает). Детский/подростковый ИМТ считается иначе (перцентильные
// таблицы по возрасту) — этот калькулятор только для взрослых, см. FAQ.
function bmiCategory(bmi: number): BmiCategory {
	if (bmi < 18.5) {
		return {
			label: 'Недостаток массы тела',
			colorClass: 'text-blue-600 dark:text-blue-400'
		}
	}
	if (bmi < 25) {
		return {
			label: 'Норма',
			colorClass: 'text-green-600 dark:text-green-400'
		}
	}
	if (bmi < 30) {
		return {
			label: 'Избыточная масса тела',
			colorClass: 'text-orange-600 dark:text-orange-400'
		}
	}
	return {
		label: 'Ожирение',
		colorClass: 'text-red-600 dark:text-red-400'
	}
}

export default function BmiCalculatorPage() {
	const widget = getWidgetById('bmi-calculator')!

	const [weight, setWeight] = useState('70')
	const [height, setHeight] = useState('170')
	const [copied, setCopied] = useState(false)

	const result = useMemo(() => {
		const w = parseFloat(weight.replace(',', '.'))
		const hCm = parseFloat(height.replace(',', '.'))
		if (!w || !hCm || w <= 0 || hCm <= 0) return null

		const hM = hCm / 100
		const bmi = w / (hM * hM)
		return { bmi, category: bmiCategory(bmi) }
	}, [weight, height])

	const copyResult = async () => {
		if (!result) return
		await navigator.clipboard.writeText(
			`ИМТ: ${result.bmi.toFixed(1)} (${result.category.label})`
		)
		setCopied(true)
		setTimeout(() => setCopied(false), 2000)
	}

	return (
		<WidgetSEOWrapper widget={widget}>
			<Card className='overflow-hidden p-0'>
				<div className={toolBar}>
					<span className='text-sm text-muted-foreground'>Вес и рост</span>

					<div className='flex items-center gap-0.5 sm:ml-auto'>
						<Button
							size='icon'
							variant='ghost'
							onClick={copyResult}
							disabled={!result}
							title='Скопировать результат'
							className={toolIconButton}
						>
							{copied ? (
								<Check className='h-4 w-4 text-green-600 dark:text-green-400' />
							) : (
								<Copy className='h-4 w-4' />
							)}
						</Button>
					</div>
				</div>

				<div className='grid gap-4 border-b px-5 py-6 sm:grid-cols-2 sm:px-6'>
					<label className='block'>
						<span className='mb-1.5 block text-sm text-muted-foreground'>
							Вес, кг
						</span>
						<input
							type='text'
							inputMode='decimal'
							value={weight}
							onChange={event => setWeight(event.target.value)}
							aria-label='Вес в килограммах'
							className='w-full rounded-md border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-ring'
						/>
					</label>

					<label className='block'>
						<span className='mb-1.5 block text-sm text-muted-foreground'>
							Рост, см
						</span>
						<input
							type='text'
							inputMode='decimal'
							value={height}
							onChange={event => setHeight(event.target.value)}
							aria-label='Рост в сантиметрах'
							className='w-full rounded-md border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-ring'
						/>
					</label>
				</div>

				{result ? (
					<div className='px-5 py-8 text-center sm:px-6'>
						<span className='block font-mono text-5xl font-bold tracking-tight text-foreground sm:text-6xl'>
							{result.bmi.toFixed(1)}
						</span>
						<span
							className={cn(
								'mt-2 block text-base font-medium',
								result.category.colorClass
							)}
						>
							{result.category.label}
						</span>
					</div>
				) : (
					<p className='px-5 py-16 text-center text-sm text-muted-foreground sm:px-6'>
						Укажите вес и рост
					</p>
				)}

				<div className={toolFooterBar}>
					<span className='text-sm text-muted-foreground'>
						Пороги категорий — стандарт ВОЗ для взрослых, для детей не применимы
					</span>
				</div>
			</Card>

			<ToolScreenshot slug='bmi-calculator' />
			<BmiCalculatorSeo />
		</WidgetSEOWrapper>
	)
}
