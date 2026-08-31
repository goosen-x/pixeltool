'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import {
	FULL_POINT_LABELS,
	getArcana,
	type FullDestinyMatrixResult
} from '@/lib/utils/destiny-matrix'
import {
	buildAgePeriodText,
	getAgeSectorInfo,
	type DestinyMatrixSelection
} from '@/lib/utils/destiny-matrix-current-period'
import { fetchPositionalMeaning } from './actions'

interface DestinyMatrixPointDetailProps {
	result: FullDestinyMatrixResult
	selection: DestinyMatrixSelection
	currentAgeSectorIndex: number
}

export function DestinyMatrixPointDetail({
	result,
	selection,
	currentAgeSectorIndex
}: DestinyMatrixPointDetailProps) {
	const isAge = selection.kind === 'age'
	const pointKey = selection.kind === 'point' ? selection.key : null
	const ageInfo =
		selection.kind === 'age'
			? getAgeSectorInfo(result, selection.sectorIndex)
			: null
	const arcana = ageInfo ? ageInfo.arcana : getArcana(result[pointKey!])

	// Карточный текст (fetchPositionalMeaning) — только для точек схемы.
	// Для возрастного периода текст собирается локально
	// (buildAgePeriodText), без похода на сервер.
	const [positionalMeaning, setPositionalMeaning] = useState<string | null>(
		null
	)

	useEffect(() => {
		if (isAge || !pointKey) {
			setPositionalMeaning(null)
			return
		}
		let cancelled = false
		setPositionalMeaning(null)
		fetchPositionalMeaning(pointKey, arcana.number).then(text => {
			if (!cancelled) setPositionalMeaning(text)
		})
		return () => {
			cancelled = true
		}
	}, [isAge, pointKey, arcana.number])

	const heading = ageInfo
		? `Возраст ${ageInfo.sectorStart}–${ageInfo.sectorEnd} лет`
		: FULL_POINT_LABELS[pointKey!]

	const bodyText = ageInfo
		? buildAgePeriodText(
				ageInfo.arcana,
				ageInfo.sectorStart,
				ageInfo.sectorEnd,
				selection.kind === 'age' &&
					selection.sectorIndex === currentAgeSectorIndex
			)
		: positionalMeaning

	return (
		<div className='rounded-xl border p-6'>
			<div className='flex items-start gap-5'>
				{arcana.image ? (
					<Image
						src={arcana.image}
						alt={`Карта Таро: ${arcana.name}`}
						width={136}
						height={204}
						className='shrink-0 rounded-md border'
					/>
				) : (
					<span className='flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-primary/10 font-mono text-xl font-bold text-primary'>
						{arcana.number}
					</span>
				)}
				<div>
					<span className='block text-lg font-semibold text-foreground'>
						{arcana.number} ({arcana.name})
					</span>
					<p className='mt-2 text-base text-muted-foreground'>
						{arcana.meaning}
					</p>
				</div>
			</div>
			<div className='mt-4 border-t pt-4'>
				<span className='block text-lg font-bold text-foreground'>
					{heading}
				</span>
				{bodyText && (
					<p className='mt-2 text-base text-muted-foreground'>{bodyText}</p>
				)}
			</div>
		</div>
	)
}
