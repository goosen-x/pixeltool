'use client'

import {
	FULL_POINT_LABELS,
	NAMED_LINES,
	TALENT_POINTS,
	getArcana,
	type FullDestinyMatrixResult,
	type FullPointKey
} from '@/lib/utils/destiny-matrix'

interface NodeConfig {
	key: FullPointKey
	x: number
	y: number
	radius: number
	staticLabel?: string
}

/**
 * Координаты подобраны вручную, не выведены по формуле: внешний квадрат
 * (A,B,C,D) и повёрнутый на 45° родовой квадрат (F,G,H,I) образуют
 * октаграмму, как её описывает источник методики. Остальные точки лежат
 * на диагоналях от каждого угла к центру, ближе к центру тем сильнее
 * узел вложен в формулу (например, F2 использует центр рода, поэтому
 * он ближе к центру, чем F1).
 */
const NODES: NodeConfig[] = [
	{ key: 'day', x: 70, y: 200, radius: 22, staticLabel: FULL_POINT_LABELS.day },
	{
		key: 'month',
		x: 200,
		y: 70,
		radius: 22,
		staticLabel: FULL_POINT_LABELS.month
	},
	{
		key: 'year',
		x: 330,
		y: 200,
		radius: 22,
		staticLabel: FULL_POINT_LABELS.year
	},
	{
		key: 'fourth',
		x: 200,
		y: 330,
		radius: 22,
		staticLabel: FULL_POINT_LABELS.fourth
	},
	{ key: 'center', x: 200, y: 200, radius: 28 },

	{ key: 'f', x: 108, y: 108, radius: 16 },
	{ key: 'g', x: 292, y: 108, radius: 16 },
	{ key: 'h', x: 292, y: 292, radius: 16 },
	{ key: 'i', x: 108, y: 292, radius: 16 },

	{ key: 'j', x: 135, y: 200, radius: 13 },
	{ key: 'k', x: 200, y: 135, radius: 13 },
	{ key: 'l', x: 265, y: 200, radius: 13 },
	{ key: 'm', x: 200, y: 265, radius: 13 },
	{ key: 'q', x: 295, y: 200, radius: 11 },

	{ key: 'f1', x: 138, y: 138, radius: 10 },
	{ key: 'f2', x: 168, y: 168, radius: 10 },
	{ key: 'g1', x: 262, y: 138, radius: 10 },
	{ key: 'g2', x: 232, y: 168, radius: 10 },
	{ key: 'h1', x: 262, y: 262, radius: 10 },
	{ key: 'h2', x: 232, y: 232, radius: 10 },
	{ key: 'i1', x: 138, y: 262, radius: 10 },
	{ key: 'i2', x: 168, y: 232, radius: 10 },

	{ key: 'r', x: 255, y: 295, radius: 9 },
	{ key: 'r1', x: 222, y: 277, radius: 9 },
	{ key: 'r2', x: 261, y: 238, radius: 9 }
]

const NODE_BY_KEY = new Map(NODES.map(node => [node.key, node]))

/** Базовые линии диаграммы (октаграмма + спицы к центру), видны всегда. */
const BASE_EDGES: [FullPointKey, FullPointKey][] = [
	['day', 'f'],
	['f', 'month'],
	['month', 'g'],
	['g', 'year'],
	['year', 'h'],
	['h', 'fourth'],
	['fourth', 'i'],
	['i', 'day'],
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
}

export function DestinyMatrixFullDiagram({
	result,
	active,
	onSelect,
	highlightedLine
}: DestinyMatrixFullDiagramProps) {
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

	return (
		<svg
			viewBox='0 0 400 400'
			className='mx-auto h-80 w-80 sm:h-96 sm:w-96'
			role='img'
			aria-label='Расширенная схема матрицы судьбы'
		>
			{BASE_EDGES.map(([from, to]) => {
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
						className={
							isHighlighted ? 'stroke-primary' : 'stroke-border'
						}
						strokeWidth={isHighlighted ? 2.5 : 1}
					/>
				)
			})}

			{NODES.map(node => {
				const arcana = getArcana(result[node.key])
				const isActive = node.key === active
				const isLineHighlighted = highlightedNodes?.has(node.key) ?? false
				const isCenter = node.key === 'center'

				const circleClass = isActive
					? 'fill-primary/10 stroke-primary'
					: isLineHighlighted
						? 'fill-primary/5 stroke-primary'
						: 'fill-background stroke-border'

				return (
					<g
						key={node.key}
						role='button'
						tabIndex={0}
						aria-label={`${FULL_POINT_LABELS[node.key]}: аркан ${arcana.number}, ${arcana.name}`}
						className='cursor-pointer outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary'
						onClick={() => onSelect(node.key)}
						onKeyDown={event => {
							if (event.key === 'Enter' || event.key === ' ') {
								event.preventDefault()
								onSelect(node.key)
							}
						}}
					>
						<circle
							cx={node.x}
							cy={node.y}
							r={node.radius}
							className={circleClass}
							strokeWidth={isActive || isLineHighlighted ? 2 : 1}
						/>
						<text
							x={node.x}
							y={node.y}
							textAnchor='middle'
							dominantBaseline='central'
							className={
								isCenter
									? 'fill-foreground text-base font-bold'
									: 'fill-foreground text-xs font-semibold'
							}
						>
							{arcana.number}
						</text>
						{node.staticLabel && (
							<text
								x={node.x}
								y={node.y + node.radius + 14}
								textAnchor='middle'
								className='fill-muted-foreground text-[10px]'
							>
								{node.staticLabel}
							</text>
						)}
					</g>
				)
			})}
		</svg>
	)
}
