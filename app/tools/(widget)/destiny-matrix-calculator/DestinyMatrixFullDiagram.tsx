'use client'

import { useState } from 'react'
import {
	FULL_POINT_LABELS,
	NAMED_LINES,
	TALENT_POINTS,
	getArcana,
	type FullDestinyMatrixResult,
	type FullPointKey
} from '@/lib/utils/destiny-matrix'
import {
	DIAGRAM_BASE_EDGES,
	DIAGRAM_CATEGORY_COLOR,
	DIAGRAM_CATEGORY_LABEL,
	DIAGRAM_CORE_EDGES,
	DIAGRAM_NODES,
	DIAGRAM_NODE_BY_KEY,
	type DiagramCategory
} from '@/lib/utils/destiny-matrix-diagram'

const NODES = DIAGRAM_NODES
const NODE_BY_KEY = DIAGRAM_NODE_BY_KEY
const BASE_EDGES = DIAGRAM_BASE_EDGES
const CORE_EDGES = DIAGRAM_CORE_EDGES
const CATEGORY_COLOR = DIAGRAM_CATEGORY_COLOR
const CATEGORY_LABEL = DIAGRAM_CATEGORY_LABEL
type Category = DiagramCategory

function segmentEdges(segment: FullPointKey[]): [FullPointKey, FullPointKey][] {
	const edges: [FullPointKey, FullPointKey][] = []
	for (let index = 0; index < segment.length - 1; index++) {
		edges.push([segment[index], segment[index + 1]])
	}
	return edges
}

interface DestinyMatrixFullDiagramProps {
	result: FullDestinyMatrixResult
	active: FullPointKey
	onSelect: (key: FullPointKey) => void
	highlightedLine: string | null
	onClearLine: () => void
}

export function DestinyMatrixFullDiagram({
	result,
	active,
	onSelect,
	highlightedLine,
	onClearLine
}: DestinyMatrixFullDiagramProps) {
	const [showFull, setShowFull] = useState(false)
	const [hoveredKey, setHoveredKey] = useState<FullPointKey | null>(null)
	// Подсветка линии/таланта относится только к точкам за пределами ядра,
	// поэтому пока она включена, схема разворачивается сама, даже если
	// пользователь её не разворачивал явно.
	const isFull = showFull || highlightedLine !== null

	const highlightedLineEdges = new Set<string>()
	let highlightedNodes: Set<FullPointKey> | null = null

	const line = NAMED_LINES.find(candidate => candidate.key === highlightedLine)
	if (line) {
		highlightedNodes = new Set()
		for (const segment of line.segments) {
			for (const [from, to] of segmentEdges(segment)) {
				highlightedLineEdges.add(`${from}-${to}`)
				highlightedLineEdges.add(`${to}-${from}`)
			}
			for (const key of segment) highlightedNodes.add(key)
		}
	} else if (highlightedLine === 'talent') {
		highlightedNodes = new Set(TALENT_POINTS.map(point => point.key))
	}

	const visibleNodes = isFull
		? NODES
		: NODES.filter(node => node.category === 'core')
	const visibleEdges = isFull ? BASE_EDGES : CORE_EDGES

	return (
		<div>
			<svg
				viewBox='0 0 480 480'
				className='mx-auto aspect-square h-auto w-full max-w-[22rem] sm:max-w-[28rem]'
				role='img'
				aria-label='Схема матрицы судьбы'
			>
				{visibleEdges.map(([from, to]) => {
					const isHighlighted = highlightedLineEdges.has(`${from}-${to}`)
					const a = NODE_BY_KEY.get(from)!
					const b = NODE_BY_KEY.get(to)!
					return (
						<line
							key={`${from}-${to}`}
							x1={a.x}
							y1={a.y}
							x2={b.x}
							y2={b.y}
							className={isHighlighted ? 'stroke-primary' : 'stroke-border'}
							strokeWidth={isHighlighted ? 2.5 : 1.25}
						/>
					)
				})}

				{visibleNodes.map(node => {
					const arcana = getArcana(result[node.key])
					const isActive = node.key === active
					const isLineHighlighted = highlightedNodes?.has(node.key) ?? false
					const isCenter = node.key === 'center'
					const isHovered =
						node.key === hoveredKey && !isActive && !isLineHighlighted
					const isNeutral =
						isActive || isLineHighlighted || node.category === 'core'

					const circleClass =
						isActive || isLineHighlighted
							? 'fill-background stroke-primary'
							: isNeutral
								? isHovered
									? 'fill-muted stroke-primary/60'
									: 'fill-background stroke-border'
								: ''

					// Наведение делает заливку заметно плотнее, а обводку сплошной:
					// в состоянии по умолчанию узел почти прозрачный (только тон
					// категории), и без явной реакции на hover непонятно, что по
					// нему вообще можно кликнуть.
					const circleStyle =
						!isNeutral && node.category !== 'core'
							? isHovered
								? {
										fill: `${CATEGORY_COLOR[node.category]}40`,
										stroke: CATEGORY_COLOR[node.category]
									}
								: {
										fill: `${CATEGORY_COLOR[node.category]}1a`,
										stroke: `${CATEGORY_COLOR[node.category]}99`
									}
							: undefined

					const nodeLabel = `${FULL_POINT_LABELS[node.key]}: аркан ${arcana.number}, ${arcana.name}`

					return (
						<g
							key={node.key}
							role='button'
							tabIndex={0}
							aria-label={nodeLabel}
							className='cursor-pointer outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary'
							onClick={() => onSelect(node.key)}
							onKeyDown={event => {
								if (event.key === 'Enter' || event.key === ' ') {
									event.preventDefault()
									onSelect(node.key)
								}
							}}
							onMouseEnter={() => setHoveredKey(node.key)}
							onMouseLeave={() => setHoveredKey(null)}
							onFocus={() => setHoveredKey(node.key)}
							onBlur={() => setHoveredKey(null)}
						>
							{/* Нативная подсказка по наведению/фокусу, без единой строки JS. */}
							<title>{nodeLabel}</title>
							{/* Прозрачная зона побольше самого кружка: у мелких узлов
							    видимый радиус даёт тач-таргет заметно меньше 44×44px. */}
							<circle
								cx={node.x}
								cy={node.y}
								r={node.radius + 6}
								fill='transparent'
							/>
							{/* Непрозрачная подложка под узлом: цветные заливки категорий
							    ниже полупрозрачные (для мягкого тона), без неё сквозь них
							    просвечивали бы линии схемы. */}
							<circle
								cx={node.x}
								cy={node.y}
								r={node.radius}
								className='fill-background'
							/>
							<circle
								cx={node.x}
								cy={node.y}
								r={node.radius}
								className={`transition-colors duration-150 ${circleClass}`}
								style={circleStyle}
								strokeWidth={isActive || isLineHighlighted ? 2.5 : 1.5}
							/>
							<text
								x={node.x}
								y={node.y}
								textAnchor='middle'
								dominantBaseline='central'
								className={
									isCenter
										? 'fill-foreground text-lg font-bold'
										: node.category === 'core'
											? 'fill-foreground text-sm font-semibold'
											: 'fill-foreground text-xs font-semibold'
								}
							>
								{arcana.number}
							</text>
							{node.staticLabel && (
								<text
									x={node.x}
									y={node.y + node.radius + 16}
									textAnchor='middle'
									className='fill-muted-foreground text-[11px]'
								>
									{node.staticLabel}
								</text>
							)}
						</g>
					)
				})}
			</svg>

			<div className='mt-3 flex flex-wrap items-center justify-center gap-x-4 gap-y-2'>
				{isFull &&
					(Object.keys(CATEGORY_COLOR) as Exclude<Category, 'core'>[]).map(
						category => (
							<span
								key={category}
								className='flex items-center gap-1.5 text-xs text-muted-foreground'
							>
								<span
									className='h-2.5 w-2.5 rounded-full'
									style={{ backgroundColor: CATEGORY_COLOR[category] }}
								/>
								{CATEGORY_LABEL[category]}
							</span>
						)
					)}
			</div>

			<div className='mt-2 text-center'>
				<button
					type='button'
					onClick={() => {
						if (isFull) {
							// Подсветка линии сама по себе удерживает схему
							// развёрнутой (см. isFull выше), поэтому одного
							// showFull=false недостаточно: без сброса
							// highlightedLine кнопка выглядит залипшей.
							setShowFull(false)
							onClearLine()
						} else {
							setShowFull(true)
						}
					}}
					className='cursor-pointer text-sm text-primary hover:underline'
				>
					{isFull ? 'Свернуть до пяти точек' : 'Показать полную схему'}
				</button>
			</div>
		</div>
	)
}
