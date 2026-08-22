'use client'

import { useMemo, useState } from 'react'
import { Check, Copy, RotateCcw } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { toolBar, toolFooterBar, toolIconButton } from '@/lib/ui/tool-pill'
import { WidgetSEOWrapper } from '@/components/seo/WidgetSEOWrapper'
import { getWidgetById } from '@/lib/constants/widgets'
import {
	solveProportion,
	type ProportionField
} from '@/lib/utils/proportion-calculator'
import { ProportionCalculatorSeo } from './ProportionCalculatorSeo'

const DEFAULTS = { a: '2', b: '5', c: '8', d: '' }
const FIELDS: ProportionField[] = ['a', 'b', 'c', 'd']

function toNumber(value: string): number | null {
	const trimmed = value.trim().replace(',', '.')
	if (trimmed === '' || trimmed === '-') return null
	const parsed = Number(trimmed)
	return Number.isFinite(parsed) ? parsed : null
}

function formatResult(value: number): string {
	return value.toLocaleString('ru-RU', { maximumFractionDigits: 4 })
}

function NumberField({
	value,
	onChange,
	isResult,
	label
}: {
	value: string
	onChange: (value: string) => void
	isResult: boolean
	label: string
}) {
	return (
		<input
			type='text'
			inputMode='decimal'
			value={value}
			onChange={event => onChange(event.target.value)}
			placeholder='?'
			aria-label={label}
			className={cn(
				'w-20 rounded-md border bg-background px-2 py-1.5 text-center font-mono text-2xl focus:outline-none focus-visible:ring-2 focus-visible:ring-ring',
				isResult ? 'border-primary text-primary' : 'text-foreground'
			)}
		/>
	)
}

export default function ProportionCalculatorPage() {
	const widget = getWidgetById('proportion-calculator')!

	const [values, setValues] = useState(DEFAULTS)
	const [copied, setCopied] = useState(false)

	const setField = (field: ProportionField, value: string) =>
		setValues(prev => ({ ...prev, [field]: value }))

	const numbers = useMemo(
		() => ({
			a: toNumber(values.a),
			b: toNumber(values.b),
			c: toNumber(values.c),
			d: toNumber(values.d)
		}),
		[values]
	)

	const emptyFields = FIELDS.filter(field => values[field].trim() === '')
	const unknown = emptyFields.length === 1 ? emptyFields[0] : null

	const result = useMemo(() => {
		if (!unknown) return null
		return solveProportion(numbers, unknown)
	}, [numbers, unknown])

	const zeroDivision =
		unknown !== null && result === null && emptyFields.length === 1

	const statusMessage = (() => {
		if (emptyFields.length === 0) return 'Очистите одно поле — оно станет искомым'
		if (emptyFields.length > 1) return 'Заполните три поля, четвёртое оставьте пустым'
		if (zeroDivision) return 'Известное число рядом с искомым не может быть 0'
		return null
	})()

	const copyResult = () => {
		if (result === null) return
		navigator.clipboard.writeText(formatResult(result))
		setCopied(true)
		setTimeout(() => setCopied(false), 2000)
	}

	const reset = () => setValues(DEFAULTS)

	return (
		<WidgetSEOWrapper widget={widget}>
			<Card className='overflow-hidden p-0'>
				<div className={toolBar}>
					<span className='text-sm text-muted-foreground'>
						Пропорция a / b = c / d — оставьте одно поле пустым
					</span>

					<div className='flex items-center gap-0.5 sm:ml-auto'>
						<Button
							size='icon'
							variant='ghost'
							onClick={copyResult}
							disabled={result === null}
							title='Скопировать результат'
							className={toolIconButton}
						>
							{copied ? (
								<Check className='h-4 w-4 text-green-600 dark:text-green-400' />
							) : (
								<Copy className='h-4 w-4' />
							)}
						</Button>
						<Button
							size='icon'
							variant='ghost'
							onClick={reset}
							title='Сбросить'
							className={toolIconButton}
						>
							<RotateCcw className='h-4 w-4' />
						</Button>
					</div>
				</div>

				<div className='flex flex-wrap items-center justify-center gap-3 px-5 py-10 sm:gap-4 sm:px-6'>
					<div className='flex flex-col items-center gap-2'>
						<NumberField
							value={values.a}
							onChange={value => setField('a', value)}
							isResult={unknown === 'a'}
							label='Числитель первой дроби (a)'
						/>
						<div className='h-0.5 w-16 bg-foreground/60' />
						<NumberField
							value={values.b}
							onChange={value => setField('b', value)}
							isResult={unknown === 'b'}
							label='Знаменатель первой дроби (b)'
						/>
					</div>

					<span className='font-mono text-3xl text-muted-foreground'>=</span>

					<div className='flex flex-col items-center gap-2'>
						<NumberField
							value={values.c}
							onChange={value => setField('c', value)}
							isResult={unknown === 'c'}
							label='Числитель второй дроби (c)'
						/>
						<div className='h-0.5 w-16 bg-foreground/60' />
						<NumberField
							value={values.d}
							onChange={value => setField('d', value)}
							isResult={unknown === 'd'}
							label='Знаменатель второй дроби (d)'
						/>
					</div>
				</div>

				<div className={toolFooterBar}>
					<span
						className={cn(
							'text-sm text-muted-foreground',
							!statusMessage && 'invisible'
						)}
					>
						{statusMessage || 'заполнено'}
					</span>
					<span
						className={cn(
							'ml-auto font-mono text-sm text-foreground',
							(result === null || statusMessage) && 'invisible'
						)}
					>
						Результат: {result !== null ? formatResult(result) : '0'}
					</span>
				</div>
			</Card>

			<ProportionCalculatorSeo />
		</WidgetSEOWrapper>
	)
}
