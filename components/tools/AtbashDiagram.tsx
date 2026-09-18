import { cn } from '@/lib/utils'

/**
 * Диаграмма шифра Атбаш: две строки одного алфавита, нижняя записана в
 * обратном порядке, поэтому колонка сама и есть зеркальная пара — не нужно
 * тянуть диагональные линии, как у сдвига Цезаря. Двусторонняя стрелка между
 * буквами колонки подчёркивает, что операция самообратна: применить её к
 * результату — и буква вернётся на место, шифрование и расшифровка это одно
 * и то же действие.
 */

interface AtbashDiagramProps {
	/** Буквы алфавита по порядку — компонент сам зеркалит нижнюю строку. */
	letters: string[]
	/** Буква, которую только что набрали, — подсвечивается вместе со своей парой. */
	highlight?: string | null
	className?: string
}

const CELL = 34
const GAP = 6
const ARROW_HEIGHT = 34
const PADDING = 8

export function AtbashDiagram({
	letters,
	highlight,
	className
}: AtbashDiagramProps) {
	const size = letters.length
	const highlightIndex = highlight
		? letters.findIndex(
				letter => letter.toLowerCase() === highlight.toLowerCase()
			)
		: -1

	// Каждая пара показана один раз: столбцов ровно половина алфавита
	// (с округлением вверх), а не весь алфавит целиком. Полный проход
	// повторял бы одну и ту же пару дважды — «А↔Я» отдельной колонкой и
	// «Я↔А» ещё одной, зеркальной уже показанной, — что и оказалось лишним
	// на диаграмме. У нечётного алфавита (33 буквы кириллицы) последний
	// столбец — средняя буква, всегда пара сама себе (П↔П).
	const visibleColumns = Math.ceil(size / 2)

	const columnWidth = CELL + GAP
	const width = visibleColumns * columnWidth - GAP + PADDING * 2
	const topY = PADDING
	const arrowTop = topY + CELL
	const arrowBottom = arrowTop + ARROW_HEIGHT
	const bottomY = arrowBottom
	const height = bottomY + CELL + PADDING

	return (
		<svg
			viewBox={`0 0 ${width} ${height}`}
			className={cn('h-auto w-full', className)}
			role='img'
			aria-label='Диаграмма шифра Атбаш: каждая буква меняется местами с зеркальной по счёту от конца алфавита'
		>
			<defs>
				<marker
					id='atbash-arrow'
					viewBox='0 0 8 8'
					refX={4}
					refY={4}
					markerWidth={5}
					markerHeight={5}
					orient='auto-start-reverse'
				>
					<path d='M0 0 L8 4 L0 8 Z' className='fill-current' />
				</marker>
			</defs>

			{letters.slice(0, visibleColumns).map((letter, index) => {
				const mirrorLetter = letters[size - 1 - index]
				// Буква могла оказаться во второй, не нарисованной половине
				// алфавита (например, ввели «Я») — тогда подсвечиваем её пару,
				// показанную в первой половине, а не саму себя.
				const active =
					index === highlightIndex || size - 1 - index === highlightIndex
				const x = PADDING + index * columnWidth
				const centerX = x + CELL / 2

				return (
					<g key={`col-${letter}`}>
						<rect
							x={x}
							y={topY}
							width={CELL}
							height={CELL}
							rx={4}
							className={cn(
								'stroke-border',
								active ? 'fill-primary/10' : 'fill-background'
							)}
							strokeWidth={1}
						/>
						<text
							x={centerX}
							y={topY + CELL / 2}
							textAnchor='middle'
							dominantBaseline='central'
							fontSize={14}
							className={cn(
								'font-mono select-none',
								active ? 'fill-primary font-bold' : 'fill-foreground'
							)}
						>
							{letter}
						</text>

						<rect
							x={x}
							y={bottomY}
							width={CELL}
							height={CELL}
							rx={4}
							className={cn(
								'stroke-border',
								active ? 'fill-primary/10' : 'fill-background'
							)}
							strokeWidth={1}
						/>
						<text
							x={centerX}
							y={bottomY + CELL / 2}
							textAnchor='middle'
							dominantBaseline='central'
							fontSize={14}
							className={cn(
								'font-mono select-none',
								active ? 'fill-primary font-bold' : 'fill-foreground'
							)}
						>
							{mirrorLetter}
						</text>

						{/* Линия рисуется последней, поверх обеих ячеек: раньше нижний
						    rect шёл в разметке ПОСЛЕ линии и своей непрозрачной заливкой
						    перекрывал нижний наконечник стрелки — виден был только
						    верхний. Геометрия и цвет были верны с самого начала, дело
						    было в порядке отрисовки SVG (кто рисуется позже, тот сверху). */}
						<line
							x1={centerX}
							y1={arrowTop}
							x2={centerX}
							y2={arrowBottom}
							className={cn(
								active ? 'stroke-primary' : 'stroke-muted-foreground/50'
							)}
							strokeWidth={1.5}
							markerStart='url(#atbash-arrow)'
							markerEnd='url(#atbash-arrow)'
						/>
					</g>
				)
			})}
		</svg>
	)
}
