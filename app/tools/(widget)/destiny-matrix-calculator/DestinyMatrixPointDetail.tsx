'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import {
	FULL_POINT_LABELS,
	getArcana,
	type FullDestinyMatrixResult,
	type FullPointKey
} from '@/lib/utils/destiny-matrix'
import { fetchPositionalMeaning } from './actions'

interface DestinyMatrixPointDetailProps {
	result: FullDestinyMatrixResult
	active: FullPointKey
}

export function DestinyMatrixPointDetail({
	result,
	active
}: DestinyMatrixPointDetailProps) {
	const arcana = getArcana(result[active])
	// Общее значение карты (arcana.meaning) остаётся всегда — позиционный
	// текст дополняет его, а не подменяет собой.
	const [positionalMeaning, setPositionalMeaning] = useState<string | null>(
		null
	)

	useEffect(() => {
		let cancelled = false
		setPositionalMeaning(null)
		fetchPositionalMeaning(active, arcana.number).then(text => {
			if (!cancelled) setPositionalMeaning(text)
		})
		return () => {
			cancelled = true
		}
	}, [active, arcana.number])

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
					{FULL_POINT_LABELS[active]}
				</span>
				{positionalMeaning && (
					<p className='mt-2 text-base text-muted-foreground'>
						{positionalMeaning}
					</p>
				)}
			</div>
		</div>
	)
}
