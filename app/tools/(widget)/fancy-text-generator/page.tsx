'use client'

import { useState } from 'react'
import { Copy, Check, Lightbulb, Trash2 } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Slider } from '@/components/ui/slider'
import { cn } from '@/lib/utils'
import {
	toolBar,
	toolFooterBar,
	toolIconButton,
	toolPill
} from '@/lib/ui/tool-pill'
import { useFancyTextGenerator } from '@/lib/hooks/widgets'

type Mode = 'styles' | 'zalgo'

export default function FancyTextGeneratorPage() {
	const [mode, setMode] = useState<Mode>('styles')

	const {
		inputText,
		copiedStyle,
		zalgoIntensity,
		zalgoText,
		generatedTexts,
		setInputText,
		setZalgoIntensity,
		copyToClipboard,
		copyZalgoText,
		loadExampleText,
		clearText,
		resetZalgoIntensity
	} = useFancyTextGenerator({
		translations: {
			copied: 'Текст скопирован',
			copyError: 'Не удалось скопировать'
		}
	})

	return (
		<>
			<Card className='overflow-hidden p-0'>
				{/* Верхняя полоса: шрифты и zalgo — два разных результата из одного
				    текста, раньше они были вкладками во всю ширину. */}
				<div className={toolBar}>
					<div className='flex flex-wrap items-center gap-1.5'>
						{(
							[
								['styles', 'Шрифты'],
								['zalgo', 'Zalgo']
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
							onClick={loadExampleText}
							title='Подставить пример'
							className={toolIconButton}
						>
							<Lightbulb className='h-4 w-4' />
						</Button>
						<Button
							size='icon'
							variant='ghost'
							onClick={clearText}
							disabled={!inputText}
							title='Очистить'
							className={toolIconButton}
						>
							<Trash2 className='h-4 w-4' />
						</Button>
					</div>
				</div>

				<div className='px-5 py-6 sm:px-6'>
					<input
						value={inputText}
						onChange={event => setInputText(event.target.value)}
						placeholder='Введите текст'
						aria-label='Текст для преобразования'
						className='w-full bg-transparent text-center text-2xl placeholder:text-xl placeholder:text-muted-foreground/60 focus:outline-none sm:text-3xl'
					/>
				</div>

				{mode === 'styles' ? (
					inputText.trim() ? (
						<div className='grid gap-px border-t bg-border'>
							{generatedTexts.map(({ styleKey, styleName, text }) => (
								<button
									key={styleKey}
									type='button'
									onClick={() => copyToClipboard(text, styleKey)}
									title='Скопировать'
									className='group flex cursor-pointer items-center justify-between gap-3 bg-background px-5 py-3 text-left transition-colors hover:bg-muted/40 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset sm:px-6'
								>
									<span className='min-w-0'>
										<span className='block text-xs text-muted-foreground'>
											{styleName}
										</span>
										<span className='mt-0.5 block text-lg break-all'>
											{text}
										</span>
									</span>
									{copiedStyle === styleKey ? (
										<Check className='h-4 w-4 shrink-0 text-green-600 dark:text-green-400' />
									) : (
										<Copy className='h-4 w-4 shrink-0 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100' />
									)}
								</button>
							))}
						</div>
					) : (
						<p className='border-t px-5 py-12 text-center text-sm text-muted-foreground'>
							Введите текст — он появится здесь во всех начертаниях
						</p>
					)
				) : (
					<>
						<div className='flex min-h-[7.5rem] items-center justify-center border-t px-5 py-8 sm:px-6'>
							{inputText.trim() ? (
								<button
									type='button'
									onClick={copyZalgoText}
									title='Скопировать'
									className='group flex cursor-pointer items-center gap-3 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-ring'
								>
									<span className='text-xl break-all'>{zalgoText}</span>
									{copiedStyle === 'zalgo' ? (
										<Check className='h-4 w-4 shrink-0 text-green-600 dark:text-green-400' />
									) : (
										<Copy className='h-4 w-4 shrink-0 text-muted-foreground transition-colors group-hover:text-foreground' />
									)}
								</button>
							) : (
								<p className='text-center text-sm text-muted-foreground'>
									Введите текст — он станет «глючным»
								</p>
							)}
						</div>

						<div className={toolFooterBar}>
							<label className='flex items-center gap-2 text-sm text-muted-foreground'>
								<span>Хаос</span>
								<Slider
									value={[zalgoIntensity]}
									onValueChange={value => setZalgoIntensity(value[0])}
									max={100}
									min={0}
									step={10}
									className='w-32 cursor-pointer'
									aria-label='Интенсивность zalgo'
								/>
								<span className='w-10 font-mono text-sm text-foreground tabular-nums'>
									{zalgoIntensity}%
								</span>
							</label>

							<button
								type='button'
								onClick={resetZalgoIntensity}
								className={cn(toolPill(false), 'sm:ml-auto')}
							>
								Сбросить
							</button>
						</div>
					</>
				)}
			</Card>

			<div className='mt-6 space-y-3 text-sm text-muted-foreground'>
				<p>
					Начертания собраны из символов Unicode — это не шрифт, а отдельные
					знаки, поэтому текст вставляется куда угодно: в ник, в шапку профиля,
					в сообщение. Оформление сохраняется даже там, где своих шрифтов нет.
				</p>
				<p>
					Zalgo — «сломанный» текст из комбинирующихся диакритических знаков.
					Чем выше хаос, тем больше знаков накладывается на каждую букву.
					Учтите: часть площадок такой текст режет или показывает как обычный.
				</p>
			</div>
		</>
	)
}
