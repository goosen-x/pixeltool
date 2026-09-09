'use client'

import { useMemo, useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ArrowRightLeft, Check, Copy, Trash2 } from 'lucide-react'
import { WidgetSEOWrapper } from '@/components/seo/WidgetSEOWrapper'
import { getWidgetById } from '@/lib/constants/widgets'
import { convertBase, explainDigits } from '@/lib/utils/number-base'
import {
	toolBar,
	toolFooterBar,
	toolIconButton,
	toolPill
} from '@/lib/ui/tool-pill'
import { ToolScreenshot } from '@/components/tools/ToolScreenshot'
import { NumberBaseConverterSeo } from './NumberBaseConverterSeo'

// Четыре системы, ради которых сюда приходят. Произвольное основание тоже
// поддержано (2–36), но выносить его в интерфейс отдельным полем незачем:
// спрос — про двоичную, восьмеричную, десятичную и шестнадцатеричную.
const BASES = [
	{ value: 2, label: '2 · двоичная' },
	{ value: 8, label: '8 · восьмеричная' },
	{ value: 10, label: '10 · десятичная' },
	{ value: 16, label: '16 · шестнадцатеричная' }
]

export default function NumberBaseConverterPage() {
	const widget = getWidgetById('number-base-converter')!

	const [value, setValue] = useState('')
	const [from, setFrom] = useState(10)
	const [to, setTo] = useState(2)
	const [copied, setCopied] = useState(false)

	const result = useMemo(() => convertBase(value, from, to), [value, from, to])
	const digits = useMemo(() => explainDigits(value, from), [value, from])

	const swap = () => {
		setFrom(to)
		setTo(from)
		if (result.value) setValue(result.value)
	}

	const copyResult = () => {
		if (!result.value) return
		navigator.clipboard.writeText(result.value)
		setCopied(true)
		setTimeout(() => setCopied(false), 2000)
	}

	return (
		<WidgetSEOWrapper widget={widget}>
			<Card className='overflow-hidden p-0'>
				<div className={toolBar}>
					<span className='text-sm text-muted-foreground'>из</span>
					{BASES.map(base => (
						<button
							key={`from-${base.value}`}
							type='button'
							onClick={() => setFrom(base.value)}
							aria-pressed={from === base.value}
							className={toolPill(from === base.value)}
						>
							{base.value}
						</button>
					))}

					<div className='flex items-center gap-0.5 sm:ml-auto'>
						<Button
							size='icon'
							variant='ghost'
							onClick={swap}
							title='Поменять системы местами'
							className={toolIconButton}
						>
							<ArrowRightLeft className='h-4 w-4' />
						</Button>
						<Button
							size='icon'
							variant='ghost'
							onClick={copyResult}
							disabled={!result.value}
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
							onClick={() => setValue('')}
							disabled={!value}
							title='Очистить'
							className={toolIconButton}
						>
							<Trash2 className='h-4 w-4' />
						</Button>
					</div>
				</div>

				<div className='grid md:grid-cols-2'>
					<div className='px-5 py-6 sm:px-6 md:border-r'>
						<Input
							value={value}
							onChange={event => setValue(event.target.value)}
							placeholder={from === 16 ? 'ff' : '10'}
							autoComplete='off'
							spellCheck={false}
							aria-label='Исходное число'
							className='h-14 border-0 px-0 font-mono !text-2xl shadow-none focus-visible:ring-0'
						/>
						<p className='mt-1 text-xs text-muted-foreground'>
							основание {from}
						</p>
					</div>

					<div className='px-5 py-6 sm:px-6'>
						<p className='font-mono text-2xl break-all'>
							{result.problem ? (
								<span className='text-base text-destructive'>
									{result.problem}
								</span>
							) : (
								(result.value ?? (
									<span className='text-base text-muted-foreground'>
										Результат появится здесь
									</span>
								))
							)}
						</p>
						<p className='mt-1 text-xs text-muted-foreground'>основание {to}</p>
					</div>
				</div>

				<div className={toolFooterBar}>
					<span className='text-sm text-muted-foreground'>в</span>
					{BASES.map(base => (
						<button
							key={`to-${base.value}`}
							type='button'
							onClick={() => setTo(base.value)}
							aria-pressed={to === base.value}
							className={toolPill(to === base.value)}
						>
							{base.label}
						</button>
					))}
				</div>

				{/* Разбор по разрядам — то, ради чего сюда приходят из домашнего
				    задания: ответ без него списать можно, а решение нет. */}
				{digits.length > 0 && (
					<div className='border-t px-5 py-4 sm:px-6'>
						<p className='mb-3 text-sm text-muted-foreground'>
							Разбор по разрядам
						</p>
						<div className='overflow-x-auto'>
							<div className='flex min-w-max items-end gap-2 font-mono text-sm'>
								{digits.map((item, index) => (
									<span key={index} className='flex items-center gap-2'>
										{index > 0 && (
											<span className='text-muted-foreground'>+</span>
										)}
										<span className='flex flex-col items-center'>
											<span>
												{item.digit}·{from}
												<sup>{item.power}</sup>
											</span>
											<span className='text-xs text-muted-foreground'>
												{item.value}
											</span>
										</span>
									</span>
								))}
								<span className='text-muted-foreground'>=</span>
								<span className='font-medium'>
									{convertBase(value, from, 10).value}
								</span>
							</div>
						</div>
					</div>
				)}
			</Card>

			<ToolScreenshot slug='number-base-converter' />
			<NumberBaseConverterSeo />
		</WidgetSEOWrapper>
	)
}
