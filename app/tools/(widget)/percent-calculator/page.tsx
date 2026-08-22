'use client'

import { useMemo, useState } from 'react'
import { Check, Copy } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import {
	toolBar,
	toolFooterBar,
	toolIconButton,
	toolPill
} from '@/lib/ui/tool-pill'
import { WidgetSEOWrapper } from '@/components/seo/WidgetSEOWrapper'
import { getWidgetById } from '@/lib/constants/widgets'
import { PercentCalculatorSeo } from './PercentCalculatorSeo'

type Mode = 'from' | 'to' | 'diff' | 'discount'

type Result =
	| { kind: 'value'; value: number }
	| { kind: 'diff'; diff: number }
	| { kind: 'discount'; discounted: number; markedUp: number }

const MODES: [Mode, string][] = [
	['from', 'Процент от числа'],
	['to', 'Число по проценту'],
	['diff', 'Разница в процентах'],
	['discount', 'Скидка и наценка']
]

function toNumber(value: string): number | null {
	const parsed = parseFloat(value.replace(',', '.'))
	return Number.isFinite(parsed) ? parsed : null
}

function formatNumber(value: number): string {
	return value.toLocaleString('ru-RU', { maximumFractionDigits: 2 })
}

export default function PercentCalculatorPage() {
	const widget = getWidgetById('percent-calculator')!
	const [mode, setMode] = useState<Mode>('from')

	const [percent, setPercent] = useState('15')
	const [number, setNumber] = useState('2000')
	const [value, setValue] = useState('300')
	const [percentTo, setPercentTo] = useState('15')
	const [numberA, setNumberA] = useState('120')
	const [numberB, setNumberB] = useState('100')
	const [amount, setAmount] = useState('1000')
	const [percentDiscount, setPercentDiscount] = useState('10')

	const [copied, setCopied] = useState(false)

	const result = useMemo((): Result | null => {
		if (mode === 'from') {
			const p = toNumber(percent)
			const n = toNumber(number)
			if (p === null || n === null) return null
			return { kind: 'value', value: (n * p) / 100 }
		}

		if (mode === 'to') {
			const v = toNumber(value)
			const p = toNumber(percentTo)
			if (v === null || p === null || p === 0) return null
			return { kind: 'value', value: (v / p) * 100 }
		}

		if (mode === 'diff') {
			const a = toNumber(numberA)
			const b = toNumber(numberB)
			if (a === null || b === null || b === 0) return null
			const diff = ((a - b) / b) * 100
			return { kind: 'diff', diff }
		}

		// discount
		const amt = toNumber(amount)
		const p = toNumber(percentDiscount)
		if (amt === null || p === null) return null
		return {
			kind: 'discount',
			discounted: amt * (1 - p / 100),
			markedUp: amt * (1 + p / 100)
		}
	}, [
		mode,
		percent,
		number,
		value,
		percentTo,
		numberA,
		numberB,
		amount,
		percentDiscount
	])

	const summaryText = useMemo(() => {
		if (!result) return ''
		if (mode === 'from' && result.kind === 'value') {
			return `${percent}% от ${number} = ${formatNumber(result.value)}`
		}
		if (mode === 'to' && result.kind === 'value') {
			return `${value} — это ${percentTo}% от ${formatNumber(result.value)}`
		}
		if (result.kind === 'diff') {
			const abs = Math.abs(result.diff)
			const direction = result.diff >= 0 ? 'больше' : 'меньше'
			return `${numberA} ${direction} ${numberB} на ${formatNumber(abs)}%`
		}
		if (result.kind === 'discount') {
			return `Со скидкой ${percentDiscount}%: ${formatNumber(result.discounted)}, с наценкой: ${formatNumber(result.markedUp)}`
		}
		return ''
	}, [
		result,
		mode,
		percent,
		number,
		value,
		percentTo,
		numberA,
		numberB,
		percentDiscount
	])

	const copyResult = async () => {
		if (!summaryText) return
		await navigator.clipboard.writeText(summaryText)
		setCopied(true)
		setTimeout(() => setCopied(false), 2000)
	}

	const numberInputClass =
		'w-full rounded-md border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-ring'

	return (
		<WidgetSEOWrapper widget={widget}>
			<Card className='overflow-hidden p-0'>
				<div className={toolBar}>
					<div className='flex flex-wrap items-center gap-1.5'>
						{MODES.map(([value, label]) => (
							<button
								key={value}
								type='button'
								onClick={() => setMode(value)}
								aria-pressed={mode === value}
								className={toolPill(mode === value)}
							>
								{label}
							</button>
						))}
					</div>

					<div className='flex w-full items-center justify-end gap-0.5 sm:w-auto sm:ml-auto'>
						<Button
							size='icon'
							variant='ghost'
							onClick={copyResult}
							disabled={!summaryText}
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

				{mode === 'from' && (
					<div className='grid gap-4 border-b px-5 py-6 sm:grid-cols-2 sm:px-6'>
						<label className='block'>
							<span className='mb-1.5 block text-sm text-muted-foreground'>
								Процент, %
							</span>
							<input
								type='text'
								inputMode='decimal'
								value={percent}
								onChange={event => setPercent(event.target.value)}
								aria-label='Процент'
								className={numberInputClass}
							/>
						</label>
						<label className='block'>
							<span className='mb-1.5 block text-sm text-muted-foreground'>
								Число
							</span>
							<input
								type='text'
								inputMode='decimal'
								value={number}
								onChange={event => setNumber(event.target.value)}
								aria-label='Число'
								className={numberInputClass}
							/>
						</label>
					</div>
				)}

				{mode === 'to' && (
					<div className='grid gap-4 border-b px-5 py-6 sm:grid-cols-2 sm:px-6'>
						<label className='block'>
							<span className='mb-1.5 block text-sm text-muted-foreground'>
								Известное значение
							</span>
							<input
								type='text'
								inputMode='decimal'
								value={value}
								onChange={event => setValue(event.target.value)}
								aria-label='Известное значение'
								className={numberInputClass}
							/>
						</label>
						<label className='block'>
							<span className='mb-1.5 block text-sm text-muted-foreground'>
								Это сколько процентов, %
							</span>
							<input
								type='text'
								inputMode='decimal'
								value={percentTo}
								onChange={event => setPercentTo(event.target.value)}
								aria-label='Процент'
								className={numberInputClass}
							/>
						</label>
					</div>
				)}

				{mode === 'diff' && (
					<div className='grid gap-4 border-b px-5 py-6 sm:grid-cols-2 sm:px-6'>
						<label className='block'>
							<span className='mb-1.5 block text-sm text-muted-foreground'>
								Число A
							</span>
							<input
								type='text'
								inputMode='decimal'
								value={numberA}
								onChange={event => setNumberA(event.target.value)}
								aria-label='Число A'
								className={numberInputClass}
							/>
						</label>
						<label className='block'>
							<span className='mb-1.5 block text-sm text-muted-foreground'>
								Число B (базовое, с ним сравниваем)
							</span>
							<input
								type='text'
								inputMode='decimal'
								value={numberB}
								onChange={event => setNumberB(event.target.value)}
								aria-label='Число B, базовое'
								className={numberInputClass}
							/>
						</label>
					</div>
				)}

				{mode === 'discount' && (
					<div className='grid gap-4 border-b px-5 py-6 sm:grid-cols-2 sm:px-6'>
						<label className='block'>
							<span className='mb-1.5 block text-sm text-muted-foreground'>
								Сумма
							</span>
							<input
								type='text'
								inputMode='decimal'
								value={amount}
								onChange={event => setAmount(event.target.value)}
								aria-label='Сумма'
								className={numberInputClass}
							/>
						</label>
						<label className='block'>
							<span className='mb-1.5 block text-sm text-muted-foreground'>
								Процент, %
							</span>
							<input
								type='text'
								inputMode='decimal'
								value={percentDiscount}
								onChange={event => setPercentDiscount(event.target.value)}
								aria-label='Процент скидки или наценки'
								className={numberInputClass}
							/>
						</label>
					</div>
				)}

				{result ? (
					result.kind === 'discount' ? (
						<div className='mx-auto grid max-w-md grid-cols-2 gap-3 px-5 py-8 text-center sm:px-6'>
							<div className='rounded-xl border p-4'>
								<span className='block font-mono text-3xl font-bold tracking-tight text-foreground sm:text-4xl'>
									{formatNumber(result.discounted)}
								</span>
								<span className='mt-1 block text-sm text-muted-foreground'>
									Со скидкой
								</span>
							</div>
							<div className='rounded-xl border p-4'>
								<span className='block font-mono text-3xl font-bold tracking-tight text-foreground sm:text-4xl'>
									{formatNumber(result.markedUp)}
								</span>
								<span className='mt-1 block text-sm text-muted-foreground'>
									С наценкой
								</span>
							</div>
						</div>
					) : result.kind === 'diff' ? (
						<div className='px-5 py-8 text-center sm:px-6'>
							<span
								className={cn(
									'block font-mono text-5xl font-bold tracking-tight sm:text-6xl',
									result.diff >= 0
										? 'text-green-600 dark:text-green-400'
										: 'text-red-600 dark:text-red-400'
								)}
							>
								{result.diff >= 0 ? '+' : '−'}
								{formatNumber(Math.abs(result.diff))}%
							</span>
							<span className='mt-1 block text-sm text-muted-foreground'>
								{numberA} {result.diff >= 0 ? 'больше' : 'меньше'} {numberB}
							</span>
						</div>
					) : result.kind === 'value' ? (
						<div className='px-5 py-8 text-center sm:px-6'>
							<span className='block font-mono text-5xl font-bold tracking-tight text-foreground sm:text-6xl'>
								{formatNumber(result.value)}
							</span>
						</div>
					) : null
				) : (
					<p className='px-5 py-16 text-center text-sm text-muted-foreground sm:px-6'>
						Заполните оба поля
					</p>
				)}

				<div className={toolFooterBar}>
					<span className='text-sm text-muted-foreground'>
						«Разница в процентах» считает от числа B — при сравнении в обратную
						сторону результат будет другим
					</span>
				</div>
			</Card>

			<PercentCalculatorSeo />
		</WidgetSEOWrapper>
	)
}
