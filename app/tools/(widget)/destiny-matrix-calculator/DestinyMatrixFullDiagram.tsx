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

type Category = 'core' | 'family' | 'diagonal' | 'familyDiagonal' | 'loveMoney'

interface NodeConfig {
	key: FullPointKey
	x: number
	y: number
	radius: number
	category: Category
	staticLabel?: string
}

/**
 * Цвет по категории точки, не по конкретной линии: подсветка выбранной
 * линии (родовые линии, любовь, деньги) уже красит нужные узлы в primary
 * поверх этого, категория здесь только помогает разглядеть структуру
 * схемы, когда ничего не выбрано. Палитра та же, что и в fortune-wheel:
 * категориальный набор из dataviz-скилла, уже проверенный на сочетаемость.
 * Подписи те же, что и в легенде под схемой, ключи совпадают.
 */
const CATEGORY_COLOR: Record<Exclude<Category, 'core'>, string> = {
	family: '#2a78d6',
	diagonal: '#1baf7a',
	familyDiagonal: '#4a3aa7',
	loveMoney: '#eb6834'
}

const CATEGORY_LABEL: Record<Exclude<Category, 'core'>, string> = {
	family: 'Родовой квадрат',
	diagonal: 'Личные диагонали',
	familyDiagonal: 'Диагонали рода',
	loveMoney: 'Любовь и деньги'
}

/**
 * Координаты подобраны вручную, не выведены по формуле. Схема строится как
 * два самостоятельных четырёхугольника, наложенных друг на друга со
 * смещением на 45°, а не как один восьмиугольник: прямой квадрат
 * (родовой, F-G-H-I) и повёрнутый на 45° ромб (личный, A-B-C-D). Так их
 * описывает источник методики, и так выглядит на референсных схемах
 * конкурентов. Остальные точки лежат на диагоналях от каждого угла к
 * центру, ближе к центру тем сильнее узел вложен в формулу (например, F2
 * использует центр рода, поэтому он ближе к центру, чем F1).
 */
const NODES: NodeConfig[] = [
	{
		key: 'day',
		x: 70,
		y: 240,
		radius: 26,
		category: 'core',
		staticLabel: FULL_POINT_LABELS.day
	},
	{
		key: 'month',
		x: 240,
		y: 70,
		radius: 26,
		category: 'core',
		staticLabel: FULL_POINT_LABELS.month
	},
	{
		key: 'year',
		x: 410,
		y: 240,
		radius: 26,
		category: 'core',
		staticLabel: FULL_POINT_LABELS.year
	},
	{
		key: 'fourth',
		x: 240,
		y: 410,
		radius: 26,
		category: 'core',
		staticLabel: FULL_POINT_LABELS.fourth
	},
	{ key: 'center', x: 240, y: 240, radius: 34, category: 'core' },

	{ key: 'f', x: 120, y: 120, radius: 20, category: 'family' },
	{ key: 'g', x: 360, y: 120, radius: 20, category: 'family' },
	{ key: 'h', x: 360, y: 360, radius: 20, category: 'family' },
	{ key: 'i', x: 120, y: 360, radius: 20, category: 'family' },

	{ key: 'j', x: 155, y: 240, radius: 16, category: 'diagonal' },
	{ key: 'k', x: 240, y: 155, radius: 16, category: 'diagonal' },
	{ key: 'l', x: 325, y: 240, radius: 16, category: 'diagonal' },
	{ key: 'm', x: 240, y: 325, radius: 16, category: 'diagonal' },
	{ key: 'q', x: 370, y: 240, radius: 13, category: 'diagonal' },

	{ key: 'f1', x: 162, y: 162, radius: 12, category: 'familyDiagonal' },
	{ key: 'f2', x: 201, y: 201, radius: 12, category: 'familyDiagonal' },
	{ key: 'g1', x: 318, y: 162, radius: 12, category: 'familyDiagonal' },
	{ key: 'g2', x: 279, y: 201, radius: 12, category: 'familyDiagonal' },
	{ key: 'h1', x: 318, y: 318, radius: 12, category: 'familyDiagonal' },
	{ key: 'h2', x: 279, y: 279, radius: 12, category: 'familyDiagonal' },
	{ key: 'i1', x: 162, y: 318, radius: 12, category: 'familyDiagonal' },
	{ key: 'i2', x: 201, y: 279, radius: 12, category: 'familyDiagonal' },

	{ key: 'r', x: 312, y: 364, radius: 11, category: 'loveMoney' },
	{ key: 'r1', x: 269, y: 341, radius: 11, category: 'loveMoney' },
	{ key: 'r2', x: 320, y: 290, radius: 11, category: 'loveMoney' }
]

const NODE_BY_KEY = new Map(NODES.map(node => [node.key, node]))

/**
 * Базовые линии диаграммы: два четырёхугольника (ромб A-B-C-D и квадрат
 * F-G-H-I) плюс спицы к центру, видны всегда в полной схеме.
 */
const BASE_EDGES: [FullPointKey, FullPointKey][] = [
	['day', 'month'],
	['month', 'year'],
	['year', 'fourth'],
	['fourth', 'day'],
	['f', 'g'],
	['g', 'h'],
	['h', 'i'],
	['i', 'f'],
	['day', 'j'],
	['j', 'center'],
	['month', 'k'],
	['k', 'center'],
	['year', 'q'],
	['q', 'l'],
	['l', 'center'],
	['fourth', 'm'],
	['m', 'center'],
	['f', 'f1'],
	['f1', 'f2'],
	['f2', 'center'],
	['g', 'g1'],
	['g1', 'g2'],
	['g2', 'center'],
	['h', 'h1'],
	['h1', 'h2'],
	['h2', 'center'],
	['i', 'i1'],
	['i1', 'i2'],
	['i2', 'center'],
	['m', 'r1'],
	['r1', 'r'],
	['l', 'r2'],
	['r2', 'r']
]

/** В свёрнутом виде: только ромб A-B-C-D, без родового квадрата и диагоналей. */
const CORE_EDGES: [FullPointKey, FullPointKey][] = [
	['day', 'month'],
	['month', 'year'],
	['year', 'fourth'],
	['fourth', 'day'],
	['day', 'center'],
	['month', 'center'],
	['year', 'center'],
	['fourth', 'center']
]

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
