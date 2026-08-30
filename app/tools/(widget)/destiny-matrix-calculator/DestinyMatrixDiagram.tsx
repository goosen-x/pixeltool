'use client'

import { useState } from 'react'
import {
	getArcana,
	POSITIONS,
	type DestinyMatrixResult,
	type PositionKey
} from '@/lib/utils/destiny-matrix'

type NodeKey = PositionKey | 'center'

const NODE_COORDS: Record<NodeKey, { x: number; y: number }> = {
	day: { x: 50, y: 150 },
	month: { x: 150, y: 50 },
	year: { x: 250, y: 150 },
	fourth: { x: 150, y: 250 },
	center: { x: 150, y: 150 }
}

const EDGES: [NodeKey, NodeKey][] = [
	['day', 'month'],
	['month', 'year'],
	['year', 'fourth'],
	['fourth', 'day'],
	['day', 'year'],
	['month', 'fourth']
]

const NODE_ORDER: NodeKey[] = ['day', 'month', 'year', 'fourth', 'center']

function labelFor(key: NodeKey): string {
	if (key === 'center') return 'Главное предназначение'
	return POSITIONS.find(position => position.key === key)!.label
}

interface DestinyMatrixDiagramProps {
	result: DestinyMatrixResult
}

export function DestinyMatrixDiagram({ result }: DestinyMatrixDiagramProps) {
	const [active, setActive] = useState<NodeKey>('center')

	const arcanaFor = (key: NodeKey) =>
		getArcana(key === 'center' ? result.center : result[key])

	const activeArcana = arcanaFor(active)

	return (
		<div className='mx-auto max-w-lg'>
			<svg
				viewBox='0 0 300 300'
				className='mx-auto h-64 w-64'
				role='img'
				aria-label='Схема матрицы судьбы: четыре точки и центр'
			>
				{EDGES.map(([from, to]) => (
					<line
						key={`${from}-${to}`}
						x1={NODE_COORDS[from].x}
						y1={NODE_COORDS[from].y}
						x2={NODE_COORDS[to].x}
						y2={NODE_COORDS[to].y}
						className='stroke-border'
						strokeWidth={1}
					/>
				))}

				{NODE_ORDER.map(key => {
					const arcana = arcanaFor(key)
					const isActive = key === active
					const isCenter = key === 'center'
					const { x, y } = NODE_COORDS[key]
					return (
						<g
							key={key}
							role='button'
							tabIndex={0}
							aria-label={`${labelFor(key)}: аркан ${arcana.number}, ${arcana.name}`}
							className='cursor-pointer focus:outline-none'
							onClick={() => setActive(key)}
							onKeyDown={event => {
								if (event.key === 'Enter' || event.key === ' ') {
									event.preventDefault()
									setActive(key)
								}
							}}
						>
							<circle
								cx={x}
								cy={y}
								r={isCenter ? 34 : 26}
								className={
									isActive
										? 'fill-primary/10 stroke-primary'
										: 'fill-background stroke-border'
								}
								strokeWidth={isActive ? 2 : 1}
							/>
							<text
								x={x}
								y={y}
								textAnchor='middle'
								dominantBaseline='central'
								className={
									isActive
										? 'fill-primary text-lg font-bold'
										: 'fill-foreground text-lg font-bold'
								}
							>
								{arcana.number}
							</text>
						</g>
					)
				})}
			</svg>

			<div className='mt-4 rounded-xl border p-4 text-center'>
				<span className='block text-sm text-muted-foreground'>
					{labelFor(active)}
				</span>
				<span className='mt-1 block font-medium text-foreground'>
					{activeArcana.number} ({activeArcana.name})
				</span>
				<p className='mt-2 text-sm text-muted-foreground'>
					{activeArcana.meaning}
				</p>
			</div>
		</div>
	)
}
