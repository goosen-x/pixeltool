'use client'

import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Check, Copy, Lightbulb, Trash2 } from 'lucide-react'
import {
	toolBar,
	toolFooterBar,
	toolIconButton,
	toolPill
} from '@/lib/ui/tool-pill'
import { WidgetSEOWrapper } from '@/components/seo/WidgetSEOWrapper'
import { getWidgetById } from '@/lib/constants/widgets'
import {
	RUSSIAN_ALPHABET,
	TABLES,
	convert,
	type TranslitStandard
} from '@/lib/translit'
import { TranslitSeo } from './TranslitSeo'

const STANDARDS: {
	value: TranslitStandard
	label: string
	hint: string
	example: string
}[] = [
	{
		value: 'passport',
		label: 'Загранпаспорт',
		hint: 'Таблица МВД (приказ № 996) по стандарту ICAO: Й → I, Ю → IU, Я → IA, Ь не пишется',
		example: 'Юлия Андреевна Щукина'
	},
	{
		value: 'gost',
		label: 'ГОСТ 7.79-2000',
		hint: 'Система Б, без диакритики: Ц → cz или c, Щ → shh, Ы → y`, Ъ → ``',
		example: 'Съешь же ещё этих мягких французских булок, да выпей чаю'
	},
	{
		value: 'url',
		label: 'Для URL',
		hint: 'Адрес страницы: строчная латиница, цифры и дефисы, каждая строка отдельно',
		example: 'Как выбрать ламинат в квартиру: 5 советов'
	}
]

export default function TranslitPage() {
	const widget = getWidgetById('translit')!
	const [standard, setStandard] = useState<TranslitStandard>('passport')
	const [input, setInput] = useState('')
	const [uppercase, setUppercase] = useState(true)
	const [copied, setCopied] = useState(false)

	const current = STANDARDS.find(s => s.value === standard)!
	const result = convert(input, standard, {
		uppercase: standard === 'passport' && uppercase
	})
	const table = TABLES[standard]

	const copyResult = () => {
		navigator.clipboard.writeText(result)
		setCopied(true)
		setTimeout(() => setCopied(false), 2000)
	}

	return (
		<WidgetSEOWrapper widget={widget}>
			<Card className='overflow-hidden p-0'>
				<div className={toolBar}>
					<div className='flex flex-wrap items-center gap-1.5'>
						{STANDARDS.map(s => (
							<button
								key={s.value}
								type='button'
								onClick={() => setStandard(s.value)}
								aria-pressed={standard === s.value}
								className={toolPill(standard === s.value)}
							>
								{s.label}
							</button>
						))}
					</div>

					<div className='flex items-center gap-0.5 sm:ml-auto'>
						<Button
							size='sm'
							variant='ghost'
							onClick={() => setInput(current.example)}
							title='Подставить пример'
							className='cursor-pointer gap-1.5 text-muted-foreground hover:bg-muted hover:text-foreground'
						>
							<Lightbulb className='h-4 w-4' />
							Пример
						</Button>
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
						<Button
							size='icon'
							variant='ghost'
							onClick={() => setInput('')}
							disabled={!input}
							title='Очистить'
							className={toolIconButton}
						>
							<Trash2 className='h-4 w-4' />
						</Button>
					</div>
				</div>

				<div className='grid md:grid-cols-2'>
					<Textarea
						value={input}
						onChange={event => setInput(event.target.value)}
						placeholder='Введите русский текст, имя или заголовок'
						autoFocus
						spellCheck={false}
						aria-label='Русский текст'
						className='min-h-[12rem] resize-none rounded-none border-0 border-b px-5 py-6 text-base focus-visible:ring-0 sm:px-6 md:border-r md:border-b-0 md:text-sm'
					/>

					{result ? (
						<button
							type='button'
							onClick={copyResult}
							title='Нажмите, чтобы скопировать'
							className='min-h-[12rem] cursor-pointer px-5 py-6 text-left font-mono text-lg break-all whitespace-pre-wrap focus:outline-none focus-visible:ring-2 focus-visible:ring-ring sm:px-6'
						>
							{result}
						</button>
					) : (
						<p className='flex min-h-[12rem] items-center justify-center px-5 text-center text-sm text-muted-foreground'>
							{input
								? 'В тексте нет букв и цифр для адреса'
								: 'Латиница появится здесь'}
						</p>
					)}
				</div>

				<div className={toolFooterBar}>
					<span className='text-sm text-muted-foreground'>{current.hint}</span>
					{standard === 'passport' && (
						<button
							type='button'
							onClick={() => setUppercase(!uppercase)}
							aria-pressed={uppercase}
							className={toolPill(uppercase, 'sm:ml-auto')}
						>
							ЗАГЛАВНЫМИ, как в паспорте
						</button>
					)}
				</div>

				<div className='border-t px-5 py-4 sm:px-6'>
					<p className='mb-3 text-xs text-muted-foreground'>
						Таблица букв: {current.label}
					</p>
					<dl className='grid grid-cols-4 gap-x-4 gap-y-1.5 font-mono text-sm sm:grid-cols-6 lg:grid-cols-8'>
						{RUSSIAN_ALPHABET.map(letter => (
							<div key={letter} className='flex gap-1.5'>
								<dt className='text-muted-foreground'>
									{letter.toUpperCase()}
								</dt>
								<dd>{table[letter] || '—'}</dd>
							</div>
						))}
					</dl>
					{standard === 'gost' && (
						<p className='mt-3 text-xs text-muted-foreground'>
							Ц пишется как c перед i, e, y, j (цирк → cirk) и как cz в
							остальных случаях (лицо → liczo).
						</p>
					)}
				</div>
			</Card>

			<TranslitSeo />
		</WidgetSEOWrapper>
	)
}
