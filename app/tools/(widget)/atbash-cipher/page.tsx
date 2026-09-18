'use client'

import { useMemo, useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { ArrowUpDown, Check, Copy, Trash2 } from 'lucide-react'
import {
	toolBar,
	toolFooterBar,
	toolIconButton,
	toolToggleOption,
	toolToggleTrack
} from '@/lib/ui/tool-pill'
import { WidgetSEOWrapper } from '@/components/seo/WidgetSEOWrapper'
import { getWidgetById } from '@/lib/constants/widgets'
import { AtbashDiagram } from '@/components/tools/AtbashDiagram'
import {
	ATBASH_ALPHABETS,
	type AtbashAlphabet,
	atbashTransform,
	detectAlphabet,
	hasForeignLetters
} from '@/lib/utils/atbash-cipher'
import { AtbashCipherSeo } from './AtbashCipherSeo'

const ALPHABETS: [AtbashAlphabet, string][] = [
	['cyrillic', 'Кириллица'],
	['latin', 'Латиница']
]

export default function AtbashCipherPage() {
	const widget = getWidgetById('atbash-cipher')!

	const [alphabet, setAlphabet] = useState<AtbashAlphabet>('cyrillic')
	const [input, setInput] = useState('')
	const [copied, setCopied] = useState(false)

	const letters = useMemo(() => [...ATBASH_ALPHABETS[alphabet]], [alphabet])
	const result = useMemo(
		() => atbashTransform(input, alphabet),
		[input, alphabet]
	)

	// Последняя набранная буква подсвечивается в диаграмме вместе со своей
	// зеркальной парой — так связь между текстом и заменой видна во время набора
	const highlight = useMemo(() => {
		for (let index = input.length - 1; index >= 0; index--) {
			if (letters.includes(input[index].toUpperCase())) {
				return input[index]
			}
		}
		return null
	}, [input, letters])

	const foreign = input ? hasForeignLetters(input, alphabet) : false
	const otherAlphabet: AtbashAlphabet =
		alphabet === 'latin' ? 'cyrillic' : 'latin'

	const handleInput = (value: string) => {
		setInput(value)
		const detected = detectAlphabet(value, alphabet)
		if (detected !== alphabet) setAlphabet(detected)
	}

	const copyResult = () => {
		navigator.clipboard.writeText(result)
		setCopied(true)
		setTimeout(() => setCopied(false), 2000)
	}

	return (
		<WidgetSEOWrapper widget={widget}>
			<Card className='overflow-hidden p-0'>
				{/* Шапка: без режима «зашифровать/расшифровать» — у Атбаша это одна
				    и та же операция, ключа и выбора направления нет */}
				<div className={toolBar}>
					<p className='text-sm text-muted-foreground'>
						Зеркальная замена без ключа
					</p>

					<div className='flex items-center gap-0.5 sm:ml-auto'>
						<Button
							size='icon'
							variant='ghost'
							onClick={() => setInput(result)}
							disabled={!result}
							title='Перенести результат в поле ввода'
							className={toolIconButton}
						>
							<ArrowUpDown className='h-4 w-4' />
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
						onChange={event => handleInput(event.target.value)}
						placeholder='Введите текст'
						spellCheck={false}
						aria-label='Исходный текст'
						className='min-h-[9rem] resize-none rounded-none border-0 border-b px-5 py-6 font-mono text-base focus-visible:ring-0 sm:px-6 md:border-r md:border-b-0 md:text-sm'
					/>

					{result ? (
						<pre className='min-h-[9rem] overflow-auto px-5 py-6 font-mono text-sm break-all whitespace-pre-wrap sm:px-6'>
							{result}
						</pre>
					) : (
						<p className='flex min-h-[9rem] items-center justify-center px-5 text-center text-sm text-muted-foreground'>
							Результат появится здесь
						</p>
					)}
				</div>

				{/* Диаграмма на всю ширину карточки, а не сбоку узкой колонкой: у
				    кириллицы 33 колонки, в боковую панель они бы не поместились
				    читаемо. Горизонтальный скролл на телефоне, никакого зума */}
				<div className='overflow-x-auto border-t px-5 py-6 sm:px-6'>
					<AtbashDiagram
						letters={letters}
						highlight={highlight}
						className='mx-auto min-w-[600px] max-w-3xl'
					/>
				</div>

				<div className={toolFooterBar}>
					<div className={toolToggleTrack}>
						{ALPHABETS.map(([value, label]) => (
							<button
								key={value}
								type='button'
								onClick={() => setAlphabet(value)}
								aria-pressed={alphabet === value}
								className={toolToggleOption(alphabet === value)}
							>
								{label}
							</button>
						))}
					</div>

					{foreign && (
						<button
							type='button'
							onClick={() => setAlphabet(otherAlphabet)}
							className='cursor-pointer text-sm text-muted-foreground underline-offset-4 transition-colors hover:text-foreground hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-ring'
						>
							{alphabet === 'latin'
								? 'в тексте есть кириллица, она осталась как есть'
								: 'в тексте есть латиница, она осталась как есть'}
						</button>
					)}

					<span className='text-sm text-muted-foreground sm:ml-auto'>
						символов{' '}
						<span className='font-mono text-foreground'>{input.length}</span>
					</span>
				</div>
			</Card>

			<AtbashCipherSeo />
		</WidgetSEOWrapper>
	)
}
