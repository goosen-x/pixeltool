'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import {
	NAMED_LINES,
	TALENT_POINTS,
	getArcana,
	type FullDestinyMatrixResult,
	type FullPointKey,
	type NamedLine
} from '@/lib/utils/destiny-matrix'
import { fetchPositionalMeaning } from './actions'

interface DestinyMatrixLinesPanelProps {
	result: FullDestinyMatrixResult
	highlightedLine: string | null
	onToggle: (key: string) => void
}

/** Точки линии подряд, без повторов узла, где сегменты сходятся. */
function flattenLine(line: NamedLine): FullPointKey[] {
	const seen = new Set<FullPointKey>()
	const flat: FullPointKey[] = []
	for (const segment of line.segments) {
		for (const key of segment) {
			if (!seen.has(key)) {
				seen.add(key)
				flat.push(key)
			}
		}
	}
	return flat
}

function tabClassName(isActive: boolean): string {
	return isActive
		? 'cursor-pointer rounded-full border border-primary bg-primary/5 px-3 py-1.5 text-sm text-primary'
		: 'cursor-pointer rounded-full border px-3 py-1.5 text-sm text-muted-foreground hover:border-primary/50'
}

interface PointRowProps {
	arcanaKey: FullPointKey
	result: FullDestinyMatrixResult
	prefix?: string
}

function PointRow({ arcanaKey, result, prefix }: PointRowProps) {
	const arcana = getArcana(result[arcanaKey])
	// Общий arcana.meaning остаётся фоллбэком, пока позиционный текст грузится
	// или для этой пары (точка, аркан) ещё не написан.
	const [positionalMeaning, setPositionalMeaning] = useState<string | null>(
		null
	)

	useEffect(() => {
		let cancelled = false
		setPositionalMeaning(null)
		fetchPositionalMeaning(arcanaKey, arcana.number).then(text => {
			if (!cancelled) setPositionalMeaning(text)
		})
		return () => {
			cancelled = true
		}
	}, [arcanaKey, arcana.number])

	return (
		<div className='flex items-start gap-3'>
			{arcana.image ? (
				<Image
					src={arcana.image}
					alt=''
					width={28}
					height={42}
					className='shrink-0 rounded border'
				/>
			) : (
				<span className='flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary/10 font-mono text-sm font-bold text-primary'>
					{arcana.number}
				</span>
			)}
			<div>
				<span className='block text-sm font-medium text-foreground'>
					{prefix ? `${prefix}: ` : ''}
					{arcana.number} ({arcana.name})
				</span>
				<p className='mt-1 text-sm text-muted-foreground'>
					{positionalMeaning ?? arcana.meaning}
				</p>
			</div>
		</div>
	)
}

export function DestinyMatrixLinesPanel({
	result,
	highlightedLine,
	onToggle
}: DestinyMatrixLinesPanelProps) {
	const activeLine = NAMED_LINES.find(line => line.key === highlightedLine)
	const isTalentActive = highlightedLine === 'talent'

	return (
		<div className='space-y-3'>
			<span className='block text-xs font-medium uppercase tracking-wide text-muted-foreground'>
				Родовые линии, любовь, деньги, талант
			</span>

			<div className='flex flex-wrap gap-2'>
				{NAMED_LINES.map(line => (
					<button
						key={line.key}
						type='button'
						onClick={() => onToggle(line.key)}
						className={tabClassName(highlightedLine === line.key)}
					>
						{line.label}
					</button>
				))}
				<button
					type='button'
					onClick={() => onToggle('talent')}
					className={tabClassName(isTalentActive)}
				>
					Талант
				</button>
			</div>

			{activeLine && (
				<div className='space-y-4'>
					{flattenLine(activeLine).map(key => (
						<PointRow key={key} arcanaKey={key} result={result} />
					))}
				</div>
			)}

			{isTalentActive && (
				<div className='space-y-4'>
					{TALENT_POINTS.map(point => (
						<PointRow
							key={point.key}
							arcanaKey={point.key}
							result={result}
							prefix={point.label}
						/>
					))}
				</div>
			)}
		</div>
	)
}
