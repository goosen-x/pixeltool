'use client'

import { useMemo, useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Check, Copy, MapPin, Trash2, X } from 'lucide-react'
import { WidgetSEOWrapper } from '@/components/seo/WidgetSEOWrapper'
import { getWidgetById } from '@/lib/constants/widgets'
import { checkInn } from '@/lib/utils/inn'
import { toolBar, toolFooterBar, toolIconButton } from '@/lib/ui/tool-pill'
import { cn } from '@/lib/utils'
import { ToolScreenshot } from '@/components/tools/ToolScreenshot'
import { InnCheckerSeo } from './InnCheckerSeo'

// Номера, на которых видно обе ветки проверки. Оба публичные: первый — из
// реквизитов Сбербанка, второй — учебный пример двенадцатизначного ИНН,
// который ходит по документации.
const EXAMPLES = ['7707083893', '500100732259']

export default function InnCheckerPage() {
	const widget = getWidgetById('inn-checker')!

	const [value, setValue] = useState('')
	const [copied, setCopied] = useState(false)

	const result = useMemo(() => checkInn(value), [value])
	const touched = result.digits.length > 0

	const copyDigits = () => {
		if (!result.digits) return
		navigator.clipboard.writeText(result.digits)
		setCopied(true)
		setTimeout(() => setCopied(false), 2000)
	}

	return (
		<WidgetSEOWrapper widget={widget}>
			<Card className='overflow-hidden p-0'>
				<div className={toolBar}>
					<span className='text-sm text-muted-foreground'>
						Введите ИНН — 10 цифр у организации, 12 у человека
					</span>

					<div className='flex items-center gap-0.5 sm:ml-auto'>
						<Button
							size='icon'
							variant='ghost'
							onClick={copyDigits}
							disabled={!result.digits}
							title='Скопировать цифры без пробелов'
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

				<div className='px-5 py-6 sm:px-6'>
					<Input
						value={value}
						onChange={event => setValue(event.target.value)}
						placeholder='7707083893'
						inputMode='numeric'
						autoComplete='off'
						spellCheck={false}
						aria-label='ИНН'
						className='h-16 border-0 px-0 font-mono !text-3xl tracking-[0.12em] shadow-none focus-visible:ring-0'
					/>

					{/* Результат появляется сразу при наборе: отдельная кнопка
					    «Проверить» здесь лишний шаг — счёт мгновенный. */}
					{touched && (
						<div className='mt-6 flex flex-col gap-3'>
							<div
								className={cn(
									'flex items-center gap-3 rounded-xl border px-4 py-3',
									result.valid
										? 'border-transparent bg-green-500/10 text-green-700 dark:text-green-400'
										: 'border-transparent bg-red-500/10 text-red-700 dark:text-red-400'
								)}
							>
								{result.valid ? (
									<Check className='h-5 w-5 shrink-0' />
								) : (
									<X className='h-5 w-5 shrink-0' />
								)}
								<span className='text-sm font-medium'>
									{result.valid
										? 'Контрольная сумма сходится — номер набран верно'
										: result.problem}
								</span>
							</div>

							{result.valid && (
								<div className='flex flex-wrap gap-x-6 gap-y-2 text-sm'>
									<span>
										<span className='text-muted-foreground'>кому выдан: </span>
										{result.kind === 'legal'
											? 'организации'
											: 'человеку или ИП'}
									</span>
									{result.region && (
										<span className='flex items-center gap-1.5'>
											<MapPin className='h-3.5 w-3.5 text-muted-foreground' />
											{result.region}
										</span>
									)}
								</div>
							)}
						</div>
					)}
				</div>

				<div className={toolFooterBar}>
					<span className='text-sm text-muted-foreground'>примеры</span>
					{EXAMPLES.map(example => (
						<button
							key={example}
							type='button'
							onClick={() => setValue(example)}
							className='cursor-pointer rounded-full border px-3 py-1 font-mono text-sm text-muted-foreground transition-colors hover:border-primary/50 hover:text-foreground'
						>
							{example}
						</button>
					))}
					<span className='text-sm text-muted-foreground sm:ml-auto'>
						проверка идёт в браузере, номер никуда не отправляется
					</span>
				</div>
			</Card>

			<ToolScreenshot slug='inn-checker' />
			<InnCheckerSeo />
		</WidgetSEOWrapper>
	)
}
