'use client'

import { useEffect, useMemo, useState } from 'react'
import { ArrowLeftRight, Loader2 } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ToolSelect } from '@/components/ui/tool-select'
import {
	toolBar,
	toolFooterBar,
	toolIconButton,
	toolPill
} from '@/lib/ui/tool-pill'
import { WidgetSEOWrapper } from '@/components/seo/WidgetSEOWrapper'
import { getWidgetById } from '@/lib/constants/widgets'
import {
	convert,
	pairRate,
	POPULAR_CODES,
	RUB,
	sortRates,
	type Rate
} from '@/lib/utils/cbr-rates'
import { CurrencyConverterSeo } from './CurrencyConverterSeo'

function format(value: number): string {
	return value.toLocaleString('ru-RU', {
		minimumFractionDigits: 2,
		maximumFractionDigits: value < 1 ? 4 : 2
	})
}

export default function CurrencyConverterPage() {
	const widget = getWidgetById('currency-converter')!

	const [rates, setRates] = useState<Rate[] | null>(null)
	const [date, setDate] = useState<string | null>(null)
	const [error, setError] = useState<string | null>(null)

	const [amount, setAmount] = useState('100')
	const [fromCode, setFromCode] = useState('USD')
	const [toCode, setToCode] = useState('RUB')

	useEffect(() => {
		let cancelled = false
		fetch('/api/cbr-rates')
			.then(response => (response.ok ? response.json() : Promise.reject()))
			.then((data: { date: string | null; rates: Rate[] }) => {
				if (cancelled) return
				setRates(sortRates([RUB, ...data.rates]))
				setDate(data.date)
			})
			.catch(() => {
				if (!cancelled) setError('Не удалось получить курсы Центробанка')
			})
		return () => {
			cancelled = true
		}
	}, [])

	const from = rates?.find(r => r.code === fromCode) ?? null
	const to = rates?.find(r => r.code === toCode) ?? null

	const result = useMemo(() => {
		const value = parseFloat(amount.replace(/\s/g, '').replace(',', '.'))
		if (!from || !to || !Number.isFinite(value)) return null
		return { value: convert(value, from, to), rate: pairRate(from, to) }
	}, [amount, from, to])

	const swap = () => {
		setFromCode(toCode)
		setToCode(fromCode)
	}

	return (
		<WidgetSEOWrapper widget={widget}>
			<Card className='overflow-hidden p-0'>
				<div className={toolBar}>
					<span className='text-sm text-muted-foreground'>
						{date
							? `Официальный курс Центробанка на ${date}`
							: error
								? 'Курсы недоступны'
								: 'Загружаем курсы Центробанка…'}
					</span>
				</div>

				{error ? (
					<p className='px-5 py-16 text-center text-sm text-destructive sm:px-6'>
						{error}. Попробуйте обновить страницу — возможно, сайт Центробанка
						временно недоступен.
					</p>
				) : !rates ? (
					<div className='flex items-center justify-center gap-2 px-5 py-16 text-sm text-muted-foreground sm:px-6'>
						<Loader2 className='h-4 w-4 animate-spin' />
						Загружаем курсы…
					</div>
				) : (
					<>
						<div className='grid items-end gap-4 px-5 py-8 sm:grid-cols-[1fr_auto_1fr] sm:px-6'>
							<div>
								<span className='mb-1.5 block text-sm text-muted-foreground'>
									Сколько меняем
								</span>
								<input
									type='text'
									inputMode='decimal'
									value={amount}
									onChange={event => setAmount(event.target.value)}
									aria-label='Сумма'
									className='mb-2 w-full rounded-md border bg-background px-3 py-2 font-mono text-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-ring'
								/>
								<ToolSelect
									value={fromCode}
									onChange={event => setFromCode(event.target.value)}
									aria-label='Исходная валюта'
									className='w-full py-2'
								>
									{rates.map(rate => (
										<option key={rate.code} value={rate.code}>
											{rate.code} — {rate.name}
										</option>
									))}
								</ToolSelect>
							</div>

							<Button
								size='icon'
								variant='ghost'
								onClick={swap}
								title='Поменять валюты местами'
								className={`${toolIconButton} mb-2 sm:mb-9`}
							>
								<ArrowLeftRight className='h-4 w-4' />
							</Button>

							<div>
								<span className='mb-1.5 block text-sm text-muted-foreground'>
									Получится
								</span>
								<div className='mb-2 w-full rounded-md border bg-muted/40 px-3 py-2 font-mono text-lg'>
									{result ? format(result.value) : '—'}
								</div>
								<ToolSelect
									value={toCode}
									onChange={event => setToCode(event.target.value)}
									aria-label='Целевая валюта'
									className='w-full py-2'
								>
									{rates.map(rate => (
										<option key={rate.code} value={rate.code}>
											{rate.code} — {rate.name}
										</option>
									))}
								</ToolSelect>
							</div>
						</div>

						{result && from && to && (
							<p className='border-t px-5 py-4 text-center text-sm text-muted-foreground sm:px-6'>
								1 {from.code} = {format(result.rate)} {to.code}
							</p>
						)}

						<div className={toolFooterBar}>
							<span className='flex flex-wrap items-center gap-1.5'>
								{POPULAR_CODES.filter(code =>
									rates.some(r => r.code === code)
								).map(code => (
									<button
										key={code}
										type='button'
										onClick={() => setFromCode(code)}
										aria-pressed={fromCode === code}
										className={toolPill(fromCode === code)}
									>
										{code}
									</button>
								))}
							</span>
						</div>
					</>
				)}

				<div className={toolFooterBar}>
					<span className='text-sm text-muted-foreground'>
						Курс Центробанка устанавливается раз в рабочий день и не совпадает с
						курсом обмена в банке или на бирже
					</span>
				</div>
			</Card>

			<CurrencyConverterSeo />
		</WidgetSEOWrapper>
	)
}
