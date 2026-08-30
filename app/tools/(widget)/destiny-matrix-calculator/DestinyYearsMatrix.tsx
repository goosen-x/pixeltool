import {
	ageFromBirthDate,
	getArcana,
	getYearsMatrixSector,
	POSITIONS,
	type DestinyMatrixResult
} from '@/lib/utils/destiny-matrix'
import { pluralizeRu } from '@/lib/utils/pluralize'

const SECTOR_KEYS = ['day', 'month', 'year', 'fourth'] as const

interface DestinyYearsMatrixProps {
	result: DestinyMatrixResult
	birthDate: string
}

export function DestinyYearsMatrix({
	result,
	birthDate
}: DestinyYearsMatrixProps) {
	const age = ageFromBirthDate(birthDate)
	const points: [number, number, number, number] = [
		result.day,
		result.month,
		result.year,
		result.fourth
	]
	const current = getYearsMatrixSector(age, points)
	const currentLabel = POSITIONS.find(
		position => position.key === SECTOR_KEYS[current.sectorIndex]
	)!.label
	const currentArcana = getArcana(current.arcanaNumber)

	return (
		<div className='mx-auto mt-6 max-w-lg'>
			<span className='mb-2 block text-sm text-muted-foreground'>
				Матрица лет: упрощённая шкала по 20-летним секторам
			</span>
			<div className='flex overflow-hidden rounded-lg border text-center text-sm'>
				{SECTOR_KEYS.map((key, index) => {
					const isCurrent = index === current.sectorIndex
					const arcana = getArcana(points[index])
					return (
						<div
							key={key}
							className={
								isCurrent
									? 'flex-1 border-r bg-primary/10 p-3 text-primary last:border-r-0'
									: 'flex-1 border-r p-3 text-muted-foreground last:border-r-0'
							}
						>
							<span className='block font-mono text-lg font-bold'>
								{arcana.number}
							</span>
							<span className='mt-1 block text-xs'>
								{index * 20}–{index * 20 + 19} лет
							</span>
						</div>
					)
				})}
			</div>
			<p className='mt-2 text-center text-xs text-muted-foreground'>
				Сейчас {age} {pluralizeRu(age, ['год', 'года', 'лет'])}, действует точка
				«{currentLabel.toLowerCase()}»: аркан {currentArcana.number} (
				{currentArcana.name})
			</p>
		</div>
	)
}
