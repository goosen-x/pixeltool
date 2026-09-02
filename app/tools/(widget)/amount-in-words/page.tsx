'use client'

import { useMemo, useState } from 'react'
import { Check, Copy } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
	toolBar,
	toolFooterBar,
	toolIconButton,
	toolPill
} from '@/lib/ui/tool-pill'
import { WidgetSEOWrapper } from '@/components/seo/WidgetSEOWrapper'
import { getWidgetById } from '@/lib/constants/widgets'
import { useCopyToClipboard } from '@/lib/hooks/useCopyToClipboard'
import { integerToWords, moneyToWords } from '@/lib/utils/number-to-words'
import { AmountInWordsSeo } from './AmountInWordsSeo'

const CURRENCIES = [
	{
		id: 'rub',
		label: 'Рубли',
		major: ['рубль', 'рубля', 'рублей'] as [string, string, string],
		minor: ['копейка', 'копейки', 'копеек'] as [string, string, string]
	},
	{
		id: 'usd',
		label: 'Доллары',
		major: ['доллар', 'доллара', 'долларов'] as [string, string, string],
		minor: ['цент', 'цента', 'центов'] as [string, string, string]
	},
	{
		id: 'eur',
		label: 'Евро',
		major: ['евро', 'евро', 'евро'] as [string, string, string],
		minor: ['цент', 'цента', 'центов'] as [string, string, string]
	},
	{
		id: 'plain',
		label: 'Просто число',
		major: ['', '', ''] as [string, string, string],
		minor: ['', '', ''] as [string, string, string]
	}
]

export default function AmountInWordsPage() {
	const widget = getWidgetById('amount-in-words')!

	const [value, setValue] = useState('125430.50')
	const [currencyId, setCurrencyId] = useState('rub')
	const [kopecksAsDigits, setKopecksAsDigits] = useState(true)
	const [capitalize, setCapitalize] = useState(true)

	const { copyToClipboard, copiedItem } = useCopyToClipboard()
	const currency = CURRENCIES.find(item => item.id === currencyId)!

	const result = useMemo(() => {
		const parsed = parseFloat(value.replace(/\s/g, '').replace(',', '.'))
		if (!Number.isFinite(parsed)) return ''

		if (currency.id === 'plain') {
			const words = integerToWords(Math.trunc(parsed))
			return capitalize ? words.charAt(0).toUpperCase() + words.slice(1) : words
		}

		return moneyToWords(parsed, {
			kopecksAsDigits,
			capitalize,
			rubleForms: currency.major,
			kopeckForms: currency.minor
		})
	}, [value, currency, kopecksAsDigits, capitalize])

	return (
		<WidgetSEOWrapper widget={widget}>
			<Card className='overflow-hidden p-0'>
				<div className={toolBar}>
					<div className='flex flex-wrap items-center gap-1.5'>
						{CURRENCIES.map(item => (
							<button
								key={item.id}
								type='button'
								onClick={() => setCurrencyId(item.id)}
								aria-pressed={currencyId === item.id}
								className={toolPill(currencyId === item.id)}
							>
								{item.label}
							</button>
						))}
					</div>

					<div className='flex items-center gap-0.5 sm:ml-auto'>
						<Button
							size='icon'
							variant='ghost'
							onClick={() => copyToClipboard(result, 'words')}
							disabled={!result}
							title='Скопировать'
							className={toolIconButton}
						>
							{copiedItem === 'words' ? (
								<Check className='h-4 w-4 text-green-600 dark:text-green-400' />
							) : (
								<Copy className='h-4 w-4' />
							)}
						</Button>
					</div>
				</div>

				<div className='px-5 py-6 sm:px-6'>
					<input
						type='text'
						inputMode='decimal'
						value={value}
						onChange={event => setValue(event.target.value)}
						aria-label='Сумма цифрами'
						placeholder='Например: 125430.50'
						className='w-full rounded-md border bg-background px-3 py-3 text-center font-mono text-2xl text-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-ring'
					/>
				</div>

				<div className='border-t px-5 py-8 sm:px-6'>
					{result ? (
						<p className='text-center text-lg leading-relaxed font-medium text-balance'>
							{result}
						</p>
					) : (
						<p className='text-center text-sm text-muted-foreground'>
							Введите сумму цифрами
						</p>
					)}
				</div>

				<div className={toolFooterBar}>
					<button
						type='button'
						onClick={() => setCapitalize(!capitalize)}
						aria-pressed={capitalize}
						className={toolPill(capitalize)}
					>
						с заглавной буквы
					</button>
					{currency.id !== 'plain' && (
						<button
							type='button'
							onClick={() => setKopecksAsDigits(!kopecksAsDigits)}
							aria-pressed={kopecksAsDigits}
							className={toolPill(kopecksAsDigits)}
						>
							копейки цифрами
						</button>
					)}
					<span className='text-sm text-muted-foreground sm:ml-auto'>
						В документах копейки принято писать цифрами
					</span>
				</div>
			</Card>

			<AmountInWordsSeo />
		</WidgetSEOWrapper>
	)
}
