'use client'

import { memo, useCallback, useRef, useState } from 'react'
import { Download } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { toolIconButton } from '@/lib/ui/tool-pill'

type Props = {
	emojis: string[]
	copiedEmoji: string | null
	downloadingEmoji: string | null
	onCopy: (emoji: string) => void
	onDownload: (emoji: string) => void
}

type Active = { emoji: string; index: number; top: number; left: number }

const CELL_CLASS =
	'glyph-cell flex h-12 w-full cursor-pointer items-center justify-center rounded-lg text-2xl transition-colors hover:bg-muted focus:outline-none focus-visible:ring-2 focus-visible:ring-ring'

/**
 * Ячейки вынесены в memo и ничего не знают ни про наведение, ни про
 * обработчики: клик ловится делегированием на сетке. Иначе каждое движение
 * мыши перерисовывало бы почти две тысячи узлов, а на каждую ячейку висело бы
 * по замыканию.
 */
const Cells = memo(function Cells({
	emojis,
	copiedEmoji
}: {
	emojis: string[]
	copiedEmoji: string | null
}) {
	return (
		<>
			{emojis.map((emoji, index) => (
				<button
					key={`${emoji}-${index}`}
					type='button'
					data-emoji={emoji}
					data-index={index}
					title='Скопировать'
					className={cn(
						CELL_CLASS,
						copiedEmoji === emoji && 'bg-primary/10 ring-1 ring-primary'
					)}
				>
					{emoji}
				</button>
			))}
		</>
	)
})

/**
 * Сетка эмодзи. Раньше у каждой из ~1900 ячеек была своя кнопка «скачать
 * картинкой» с SVG-иконкой, скрытая до наведения: около семи узлов на эмодзи,
 * тринадцать тысяч на страницу, HTML на 2,5 МБ и 4,5 с блокировки главного
 * потока в PageSpeed.
 *
 * Теперь кнопка одна на всю сетку и переезжает к активной ячейке — той, на
 * которую навели мышью или перешли табом. Порядок обхода с клавиатуры прежний
 * (ячейка → её кнопка скачивания → следующая ячейка), он восстановлен вручную
 * в handleKeyDown: в разметке кнопка лежит после всех ячеек и сама по себе
 * попадала бы в конец обхода.
 */
export function EmojiGrid({
	emojis,
	copiedEmoji,
	downloadingEmoji,
	onCopy,
	onDownload
}: Props) {
	const gridRef = useRef<HTMLDivElement>(null)
	const downloadRef = useRef<HTMLButtonElement>(null)
	const [active, setActive] = useState<Active | null>(null)

	const focusCell = (index: number) => {
		const next = gridRef.current?.querySelector<HTMLElement>(
			`[data-index="${index}"]`
		)
		next?.focus()
		return Boolean(next)
	}

	const trackCell = useCallback((target: EventTarget | null) => {
		if (!(target instanceof Element)) return
		// Переход курсора или фокуса на саму кнопку скачивания не считается
		// сменой ячейки, иначе кнопка исчезала бы ровно в момент попытки по ней
		// кликнуть.
		if (downloadRef.current?.contains(target)) return

		const cell = target.closest<HTMLElement>('[data-emoji]')
		if (!cell) return

		setActive({
			emoji: cell.dataset.emoji ?? '',
			index: Number(cell.dataset.index),
			top: cell.offsetTop,
			left: cell.offsetLeft + cell.offsetWidth
		})
	}, [])

	const handleClick = useCallback(
		(event: React.MouseEvent) => {
			if (!(event.target instanceof Element)) return
			const cell = event.target.closest<HTMLElement>('[data-emoji]')
			if (cell?.dataset.emoji) onCopy(cell.dataset.emoji)
		},
		[onCopy]
	)

	const handleKeyDown = (event: React.KeyboardEvent) => {
		if (event.key !== 'Tab' || !active) return
		if (!(event.target instanceof Element)) return

		// С ячейки таб ведёт на её кнопку скачивания.
		const cell = event.target.closest<HTMLElement>('[data-emoji]')
		if (
			cell &&
			!event.shiftKey &&
			Number(cell.dataset.index) === active.index
		) {
			event.preventDefault()
			downloadRef.current?.focus()
			return
		}

		// С кнопки — назад к своей ячейке или вперёд к следующей.
		if (downloadRef.current?.contains(event.target)) {
			const target = event.shiftKey ? active.index : active.index + 1
			if (focusCell(target)) event.preventDefault()
		}
	}

	return (
		<div
			ref={gridRef}
			className='relative grid grid-cols-6 gap-1 px-5 py-6 sm:grid-cols-8 sm:px-6 md:grid-cols-10 lg:grid-cols-12'
			onClick={handleClick}
			onMouseOver={event => trackCell(event.target)}
			onFocus={event => trackCell(event.target)}
			onKeyDown={handleKeyDown}
			onMouseLeave={() => setActive(null)}
		>
			<Cells emojis={emojis} copiedEmoji={copiedEmoji} />

			{/* Скачать картинкой — редкое действие, поэтому кнопка показывается
			    только у активной ячейки. */}
			{active && (
				<Button
					ref={downloadRef}
					size='icon'
					variant='ghost'
					onClick={() => onDownload(active.emoji)}
					disabled={downloadingEmoji === active.emoji}
					title='Скачать картинкой'
					style={{ top: active.top - 4, left: active.left - 20 }}
					className={cn(toolIconButton, 'absolute h-6 w-6 bg-background')}
				>
					<Download className='h-3 w-3' />
				</Button>
			)}
		</div>
	)
}
