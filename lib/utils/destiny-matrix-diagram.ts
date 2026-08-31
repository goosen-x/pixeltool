import { FULL_POINT_LABELS, type FullPointKey } from './destiny-matrix'

export type DiagramCategory =
	| 'core'
	| 'family'
	| 'diagonal'
	| 'familyDiagonal'
	| 'loveMoney'

export interface DiagramNode {
	key: FullPointKey
	x: number
	y: number
	radius: number
	category: DiagramCategory
	staticLabel?: string
}

/**
 * Цвет по категории точки. Палитра та же, что и в fortune-wheel:
 * категориальный набор из dataviz-скилла, уже проверенный на сочетаемость.
 * Общий источник для DestinyMatrixFullDiagram.tsx (интерактивная схема) и
 * DestinyMatrixPdf.ts (та же схема в PDF), чтобы координаты и цвета не
 * разошлись между ними.
 */
export const DIAGRAM_CATEGORY_COLOR: Record<
	Exclude<DiagramCategory, 'core'>,
	string
> = {
	family: '#2a78d6',
	diagonal: '#1baf7a',
	familyDiagonal: '#4a3aa7',
	loveMoney: '#eb6834'
}

export const DIAGRAM_CATEGORY_LABEL: Record<
	Exclude<DiagramCategory, 'core'>,
	string
> = {
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
 * использует центр рода, поэтому он ближе к центру, чем F1). ViewBox 480×480.
 */
export const DIAGRAM_NODES: DiagramNode[] = [
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

export const DIAGRAM_NODE_BY_KEY = new Map(
	DIAGRAM_NODES.map(node => [node.key, node])
)

/** Центр схемы (точка E, viewBox 480×480). */
export const DIAGRAM_CENTER = { x: 240, y: 240 }

/**
 * Угол узла относительно центра, в градусах, 0° = вправо, по часовой
 * стрелке (SVG-конвенция, ось Y вниз). Восемь внешних точек родового
 * квадрата и личного ромба стоят ровно через 45°, поэтому кольцо матрицы
 * лет (DestinyYearsRing в DestinyMatrixFullDiagram.tsx) опирается прямо
 * на эти углы, без отдельной геометрии.
 */
export function diagramNodeAngle(key: FullPointKey): number {
	const node = DIAGRAM_NODE_BY_KEY.get(key)!
	return (
		(Math.atan2(node.y - DIAGRAM_CENTER.y, node.x - DIAGRAM_CENTER.x) * 180) /
		Math.PI
	)
}

export function polarToCartesian(radius: number, angleDeg: number) {
	const rad = (angleDeg * Math.PI) / 180
	return {
		x: DIAGRAM_CENTER.x + radius * Math.cos(rad),
		y: DIAGRAM_CENTER.y + radius * Math.sin(rad)
	}
}

/**
 * Базовые линии полной схемы: два четырёхугольника (ромб A-B-C-D и квадрат
 * F-G-H-I) плюс спицы к центру.
 */
export const DIAGRAM_BASE_EDGES: [FullPointKey, FullPointKey][] = [
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
export const DIAGRAM_CORE_EDGES: [FullPointKey, FullPointKey][] = [
	['day', 'month'],
	['month', 'year'],
	['year', 'fourth'],
	['fourth', 'day'],
	['day', 'center'],
	['month', 'center'],
	['year', 'center'],
	['fourth', 'center']
]
