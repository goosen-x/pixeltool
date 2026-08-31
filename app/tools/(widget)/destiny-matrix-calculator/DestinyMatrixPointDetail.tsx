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
		<div className='sm:rounded-xl sm:border sm:p-6'>
			<div className='flex items-start gap-3 sm:gap-5'>
				{arcana.image ? (
					<Image
						src={arcana.image}
						alt={`Карта Таро: ${arcana.name}`}
						width={136}
						height={204}
						className='h-auto w-20 shrink-0 rounded-md border sm:w-[136px]'
					/>
				) : (
					<span className='flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 font-mono text-base font-bold text-primary sm:h-14 sm:w-14 sm:text-xl'>
						{arcana.number}
					</span>
				)}
				<div>
					<span className='block text-base font-semibold text-foreground sm:text-lg'>
						{arcana.number} ({arcana.name})
					</span>
					<p className='mt-2 text-sm text-muted-foreground sm:text-base'>
						{arcana.meaning}
					</p>
				</div>
			</div>
			<div className='mt-4 border-t pt-4'>
				<span className='block text-base font-bold text-foreground sm:text-lg'>
					{heading}
				</span>
				{bodyText && (
					<p className='mt-2 text-sm text-muted-foreground sm:text-base'>
						{bodyText}
					</p>
				)}
			</div>
		</div>
	)
}
