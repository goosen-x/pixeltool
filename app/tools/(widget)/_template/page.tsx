'use client'

/**
 * Шаблон нового инструмента.
 *
 * Здесь показан единый язык страниц инструментов — тот же, что во всех
 * работающих тулах. Правила и хелперы: `lib/ui/tool-pill.ts`, подробный
 * разбор — в `docs/seo/backlog.md`, раздел «Привести все 48 инструментов к
 * одной дизайн-системе». Коротко:
 *
 * 1. Одна `<Card className='overflow-hidden p-0'>` на инструмент. Никаких
 *    карточек внутри карточек, градиентных подложек и теней.
 * 2. Полосы: шапка (режимы слева, иконки-действия справа) → рабочая область
 *    на чистом фоне → одна или несколько нижних полос с параметрами.
 * 3. Переключатели — «таблетки» (`toolPill`), а не вкладки во всю ширину,
 *    тумблеры с подписями и выпадающие списки на три значения.
 * 4. Ничего не прятать за шестерёнкой и раскрывашкой: если настройка влияет
 *    на результат, она видна.
 * 5. Результат — герой: крупный моноширинный текст, кнопка спокойная.
 * 6. Тосты — только там, где результат не виден на экране (например, таймер
 *    досчитал). Подтверждать тостом видимое действие — шум; для копирования
 *    хватает галочки на кнопке.
 */

import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Copy, Check, Trash2 } from 'lucide-react'
import {
	toolBar,
	toolFooterBar,
	toolIconButton,
	toolPill
} from '@/lib/ui/tool-pill'

type Mode = 'first' | 'second'

export default function TemplateWidgetPage() {
	const [mode, setMode] = useState<Mode>('first')
	const [input, setInput] = useState('')
	const [uppercase, setUppercase] = useState(false)
	const [copied, setCopied] = useState(false)

	// Результат считается прямо при рендере: отдельная кнопка «Применить»
	// нужна только там, где вычисление дорогое или требует сети.
	const result =
		mode === 'first'
			? uppercase
				? input.toUpperCase()
				: input
			: [...input].reverse().join('')

	const copyResult = () => {
		navigator.clipboard.writeText(result)
		setCopied(true)
		setTimeout(() => setCopied(false), 2000)
	}

	return (
		<Card className='overflow-hidden p-0'>
			{/* Шапка: режимы слева, действия справа. */}
			<div className={toolBar}>
				<div className='flex flex-wrap items-center gap-1.5'>
					{(
						[
							['first', 'Первый режим'],
							['second', 'Второй режим']
						] as [Mode, string][]
					).map(([value, label]) => (
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

			{/* Рабочая область: ввод и результат на чистом фоне. */}
			<div className='grid md:grid-cols-2'>
				<Textarea
					value={input}
					onChange={event => setInput(event.target.value)}
					placeholder='Введите текст'
					spellCheck={false}
					aria-label='Исходные данные'
					className='min-h-[14rem] resize-none rounded-none border-0 px-5 py-6 font-mono text-base focus-visible:ring-0 sm:px-6 md:border-r md:text-sm'
				/>

				{result ? (
					<pre className='min-h-[14rem] overflow-auto px-5 py-6 font-mono text-sm break-all whitespace-pre-wrap sm:px-6'>
						{result}
					</pre>
				) : (
					<p className='flex min-h-[14rem] items-center justify-center px-5 text-center text-sm text-muted-foreground'>
						Результат появится здесь
					</p>
				)}
			</div>

			{/* Нижняя полоса: параметры, влияющие на результат. */}
			<div className={toolFooterBar}>
				<button
					type='button'
					onClick={() => setUppercase(!uppercase)}
					aria-pressed={uppercase}
					className={toolPill(uppercase)}
				>
					верхний регистр
				</button>

				<span className='text-sm text-muted-foreground sm:ml-auto'>
					символов{' '}
					<span className='font-mono text-foreground'>{input.length}</span>
				</span>
			</div>
		</Card>
	)
}
