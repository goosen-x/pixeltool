import {
	FULL_POINT_LABELS,
	getArcana,
	getPersonalizedMeaning,
	type FullDestinyMatrixResult,
	type FullPointKey,
	type Gender
} from '@/lib/utils/destiny-matrix'

interface DestinyMatrixPointDetailProps {
	result: FullDestinyMatrixResult
	active: FullPointKey
	gender?: Gender
}

export function DestinyMatrixPointDetail({
	result,
	active,
	gender
}: DestinyMatrixPointDetailProps) {
	const arcana = getArcana(result[active])

	return (
		<div className='rounded-xl border p-4'>
			<div className='flex items-center gap-3'>
				<span className='flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 font-mono text-lg font-bold text-primary'>
					{arcana.number}
				</span>
				<div>
					<span className='block text-xs text-muted-foreground'>
						{FULL_POINT_LABELS[active]}
					</span>
					<span className='block font-medium text-foreground'>
						{arcana.name}
					</span>
				</div>
			</div>
			<p className='mt-3 text-sm text-muted-foreground'>
				{getPersonalizedMeaning(arcana, gender)}
			</p>
		</div>
	)
}
