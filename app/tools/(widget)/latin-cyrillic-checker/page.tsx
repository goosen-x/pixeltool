'use client'

import { useMemo, useState } from 'react'
import { Check, Copy, Trash2, Wand2 } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { toolBar, toolFooterBar, toolIconButton } from '@/lib/ui/tool-pill'
import { pluralizeRu } from '@/lib/utils/pluralize'
import { analyzeText, fixText } from '@/lib/utils/mixed-script'
import { WidgetSEOWrapper } from '@/components/seo/WidgetSEOWrapper'
import { getWidgetById } from '@/lib/constants/widgets'
import { LatinCyrillicCheckerSeo } from './LatinCyrillicCheckerSeo'
import { ToolScreenshot } from '@/components/tools/ToolScreenshot'

const SAMPLE = 'Мой пaроль от сaйта, лoгин и купить iPhone'

export default function LatinCyrillicCheckerPage() {
	const widget = getWidgetById('latin-cyrillic-checker')!

	const [text, setText] = useState(SAMPLE)
	const [copied, setCopied] = useState(false)

	const result = useMemo(() => analyzeText(text), [text])

	/** Текст, разрезанный на куски: чужие буквы подсвечиваем на месте. */
	const highlighted = useMemo(() => {
		if (result.issues.length === 0) return null

		const parts: Array<{ text: string; bad: boolean }> = []
		let cursor = 0
		for (const issue of result.issues) {
			if (issue.index > cursor) {
				parts.push({ text: text.slice(cursor, issue.index), bad: false })
			}
			parts.push({ text: issue.char, bad: true })
			cursor = issue.index + issue.char.length
		}
		if (cursor < text.length) {
			parts.push({ text: text.slice(cursor), bad: false })
		}
		return parts
	}, [text, result.issues])

	const applyFix = () => setText(fixText(text, result.issues))

	const copyResult = () => {
		navigator.clipboard.writeText(text)
		setCopied(true)
		setTimeout(() => setCopied(false), 2000)
	}

	const unfixable = result.issues.length - result.fixable

	return (
		<WidgetSEOWrapper widget={widget}>
			<Card className='overflow-hidden p-0'>
				<div className={toolBar}>
					<span className='text-sm text-muted-foreground'>
						Вставьте текст — найдём буквы, набранные не тем алфавитом
					</span>

					<div className='flex items-center gap-0.5 sm:ml-auto'>
						<Button
							size='icon'
							variant='ghost'
							onClick={applyFix}
							disabled={result.fixable === 0}
							title='Заменить на буквы нужного алфавита'
							className={toolIconButton}
						>
							<Wand2 className='h-4 w-4' />
						</Button>
						<Button
							size='icon'
							variant='ghost'
							onClick={copyResult}
							disabled={!text}
							title='Скопировать текст'
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
							onClick={() => setText('')}
							disabled={!text}
							title='Очистить'
							className={toolIconButton}
						>
							<Trash2 className='h-4 w-4' />
						</Button>
					</div>
				</div>

				<Textarea
					value={text}
					onChange={event => setText(event.target.value)}
					placeholder='Вставьте текст для проверки'
					spellCheck={false}
					aria-label='Текст для проверки'
					className='min-h-[10rem] resize-none rounded-none border-0 border-b px-5 py-6 font-mono text-base focus-visible:ring-0 sm:px-6 md:text-sm'
				/>

				{text.trim() === '' ? (
					<p className='px-5 py-16 text-center text-sm text-muted-foreground sm:px-6'>
						Вставьте текст, чтобы проверить его
					</p>
				) : result.issues.length === 0 ? (
					<div className='px-5 py-12 text-center sm:px-6'>
						<span className='block text-2xl font-semibold text-green-600 dark:text-green-400'>
							Чисто
						</span>
						<span className='mt-2 block text-sm text-muted-foreground'>
							Слов, где смешаны кириллица и латиница, нет
						</span>
					</div>
				) : (
					<>
						<div className='px-5 py-8 text-center sm:px-6'>
							<span className='block font-mono text-5xl font-bold tracking-tight text-foreground sm:text-6xl'>
								{result.issues.length}
							</span>
							<span className='mt-2 block text-base font-medium text-muted-foreground'>
								{pluralizeRu(result.issues.length, [
									'чужая буква',
									'чужие буквы',
									'чужих букв'
								])}{' '}
								в {result.words.length}{' '}
								{pluralizeRu(result.words.length, [
									'слове',
									'словах',
									'словах'
								])}
							</span>
						</div>

						{/* Текст с подсветкой: показываем, где именно подмена. */}
						<div className='border-t px-5 py-6 font-mono text-sm break-words whitespace-pre-wrap sm:px-6'>
							{highlighted?.map((part, index) =>
								part.bad ? (
									<mark
										key={index}
										className='rounded-sm bg-destructive/20 px-0.5 text-destructive'
									>
										{part.text}
									</mark>
								) : (
									<span key={index}>{part.text}</span>
								)
							)}
						</div>

						<div className='border-t px-5 py-6 sm:px-6'>
							<ul className='space-y-2'>
								{result.words.map(word => (
									<li
										key={`${word.start}-${word.word}`}
										className='flex flex-wrap items-center gap-x-3 gap-y-1 text-sm'
									>
										<span className='font-mono font-medium text-foreground'>
											{word.word}
										</span>
										<span className='text-muted-foreground'>
											{word.ambiguous
												? 'слово из двух алфавитов сразу — похоже, так и задумано, автозамену не предлагаем'
												: `${word.dominant === 'cyrillic' ? 'русское' : 'латинское'} слово, ${word.issues
														.map(issue =>
															issue.suggestion
																? `«${issue.char}» → «${issue.suggestion}»`
																: `«${issue.char}» — замены нет`
														)
														.join(', ')}`}
										</span>
									</li>
								))}
							</ul>
						</div>
					</>
				)}

				<div className={toolFooterBar}>
					<span className='text-sm text-muted-foreground'>
						{unfixable > 0
							? `${unfixable} ${pluralizeRu(unfixable, ['букву', 'буквы', 'букв'])} автоматически заменить нельзя: пары в другом алфавите не существует`
							: 'Слово считается подозрительным, только если в нём смешаны оба алфавита — «купить iPhone» инструмент не тронет'}
					</span>
				</div>
			</Card>

			<ToolScreenshot slug='latin-cyrillic-checker' />
			<LatinCyrillicCheckerSeo />
		</WidgetSEOWrapper>
	)
}
