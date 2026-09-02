'use client'

import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import {
	NAMED_LINES,
	TALENT_POINTS,
	getArcana,
	type FullDestinyMatrixResult,
	type FullPointKey,
	type NamedLine
} from '@/lib/utils/destiny-matrix'
import { Skeleton } from '@/components/ui/skeleton'
import { fetchPositionalMeanings } from './actions'

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
	meaning: string | undefined
	prefix?: string
}

function PointRow({ arcanaKey, result, meaning, prefix }: PointRowProps) {
	const arcana = getArcana(result[arcanaKey])

	return (
		<div>
			<div className='flex items-center gap-3'>
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
				<span className='text-sm font-medium text-foreground'>
					{prefix ? `${prefix}: ` : ''}
					{arcana.number} ({arcana.name})
				</span>
			</div>
			<p className='mt-2 text-sm text-muted-foreground'>
				{meaning ?? arcana.meaning}
			</p>
		</div>
	)
}

function PointRowSkeleton() {
	return (
		<div>
			<div className='flex items-center gap-3'>
				<Skeleton className='h-[42px] w-7 shrink-0' />
				<Skeleton className='h-4 w-40' />
			</div>
			<div className='mt-2 space-y-2'>
				<Skeleton className='h-3 w-full' />
				<Skeleton className='h-3 w-5/6' />
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

	const activeKeys = activeLine
		? flattenLine(activeLine)
		: isTalentActive
			? TALENT_POINTS.map(point => point.key)
			: null

	// Один запрос на всю вкладку разом, а не по одному на карточку — при
	// переключении вкладок раньше уходило до 6 round trip'ов одновременно.
	// Кеш по ключу вкладки: повторное переключение на уже открытую вкладку
	// берёт текст из cacheRef, а не бьёт в сеть заново. Сбрасывается при
	// смене result (другая дата — другие арканы, старый текст не подходит).
	const cacheRef = useRef<
		Record<string, Partial<Record<FullPointKey, string>>>
	>({})
	const [meanings, setMeanings] = useState<Partial<
		Record<FullPointKey, string>
	> | null>(null)
	const [isLoading, setIsLoading] = useState(false)

	useEffect(() => {
		cacheRef.current = {}
	}, [result])

	useEffect(() => {
		if (!highlightedLine || !activeKeys) {
			setMeanings(null)
			setIsLoading(false)
			return
		}
		const cached = cacheRef.current[highlightedLine]
		if (cached) {
			setMeanings(cached)
			setIsLoading(false)
			return
		}
		let cancelled = false
		setIsLoading(true)
		fetchPositionalMeanings(activeKeys, result).then(data => {
			if (!cancelled) {
				cacheRef.current[highlightedLine] = data
				setMeanings(data)
				setIsLoading(false)
			}
		})
		return () => {
			cancelled = true
		}
		// activeKeys — новый массив на каждый рендер, сравниваем по ключу вкладки.
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [highlightedLine, result])

	return (
		<div className='space-y-3'>
			<span className='block text-xs font-medium uppercase tracking-wide text-muted-foreground'>
				Родовые линии, любовь, деньги, талант, кармический хвост
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

			{activeLine &&
				(isLoading ? (
					<div className='space-y-4'>
						{activeKeys!.map(key => (
							<PointRowSkeleton key={key} />
						))}
					</div>
				) : (
					<div className='space-y-4'>
						{flattenLine(activeLine).map(key => (
							<PointRow
								key={key}
								arcanaKey={key}
								result={result}
								meaning={meanings?.[key]}
							/>
						))}
					</div>
				))}

			{isTalentActive &&
				(isLoading ? (
					<div className='space-y-4'>
						{TALENT_POINTS.map(point => (
							<PointRowSkeleton key={point.key} />
						))}
					</div>
				) : (
					<div className='space-y-4'>
						{TALENT_POINTS.map(point => (
							<PointRow
								key={point.key}
								arcanaKey={point.key}
								result={result}
								meaning={meanings?.[point.key]}
								prefix={point.label}
							/>
						))}
					</div>
				))}
		</div>
	)
}
