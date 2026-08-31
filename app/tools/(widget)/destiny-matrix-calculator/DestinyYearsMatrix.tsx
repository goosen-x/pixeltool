import { Baby } from 'lucide-react'
import Image from 'next/image'
import {
	ageFromBirthDate,
	FULL_POINT_LABELS,
	getArcana,
	getYearsMatrixSector,
	YEARS_MATRIX_SECTOR_KEYS,
	type FullDestinyMatrixResult
} from '@/lib/utils/destiny-matrix'

const CYCLE_YEARS = 80
const SEGMENT_WIDTH = 100 / YEARS_MATRIX_SECTOR_KEYS.length

interface DestinyYearsMatrixProps {
	result: FullDestinyMatrixResult
	birthDate: string
}

export function DestinyYearsMatrix({
	result,
	birthDate
}: DestinyYearsMatrixProps) {
	const age = ageFromBirthDate(birthDate)
	const points: [
		number,
		number,
		number,
		number,
		number,
		number,
		number,
		number
	] = YEARS_MATRIX_SECTOR_KEYS.map(key => result[key]) as [
		number,
		number,
		number,
		number,
		number,
		number,
		number,
		number
	]
	const current = getYearsMatrixSector(age, points)
	const currentLabel =
		FULL_POINT_LABELS[YEARS_MATRIX_SECTOR_KEYS[current.sectorIndex]]
	const currentArcana = getArcana(current.arcanaNumber)
	const markerPercent = ((age % CYCLE_YEARS) / CYCLE_YEARS) * 100

	return (
		<div>
			<span className='mb-2 block text-sm text-muted-foreground'>
				Матрица возраста
			</span>
			<div className='flex flex-wrap items-center gap-3'>
				<Baby aria-hidden className='h-6 w-6 shrink-0 text-muted-foreground' />

				<div className='min-w-[160px] flex-1'>
					{/* Номера арканов над линией */}
					<div className='relative h-4'>
						{YEARS_MATRIX_SECTOR_KEYS.map((key, index) => (
							<span
								key={key}
								className={
									index === current.sectorIndex
										? 'absolute -translate-x-1/2 font-mono text-sm font-bold text-primary'
										: 'absolute -translate-x-1/2 font-mono text-sm font-bold text-muted-foreground'
								}
								style={{ left: `${(index + 0.5) * SEGMENT_WIDTH}%` }}
							>
								{getArcana(points[index]).number}
							</span>
						))}
					</div>

					{/* Сама шкала */}
					<div className='relative mt-1 h-1.5 rounded-full bg-muted'>
						<div
							className='absolute inset-y-0 left-0 rounded-full bg-primary/30'
							style={{ width: `${markerPercent}%` }}
						/>
						{Array.from(
							{ length: YEARS_MATRIX_SECTOR_KEYS.length - 1 },
							(_, i) => i + 1
						).map(i => (
							<div
								key={i}
								aria-hidden
								className='absolute top-1/2 h-2.5 w-px -translate-x-1/2 -translate-y-1/2 bg-background'
								style={{ left: `${i * SEGMENT_WIDTH}%` }}
							/>
						))}
						<div
							aria-hidden
							className='absolute top-1/2 h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-primary bg-background'
							style={{ left: `${markerPercent}%` }}
						/>
					</div>

					{/* Возрастные диапазоны под линией */}
					<div className='relative mt-1 h-3'>
						{YEARS_MATRIX_SECTOR_KEYS.map((key, index) => (
							<span
								key={key}
								className={
									index === current.sectorIndex
										? 'absolute -translate-x-1/2 whitespace-nowrap text-[10px] text-primary'
										: 'absolute -translate-x-1/2 whitespace-nowrap text-[10px] text-muted-foreground'
								}
								style={{ left: `${(index + 0.5) * SEGMENT_WIDTH}%` }}
							>
								{index * 10}–{index * 10 + 9}
							</span>
						))}
					</div>
				</div>

				<Image
					src='/icons/old-man.png'
					alt=''
					aria-hidden
					width={36}
					height={36}
					className='h-9 w-9 shrink-0 opacity-70 dark:invert'
				/>

				<p className='max-w-[220px] text-xs text-muted-foreground'>
					Действует точка «{currentLabel.toLowerCase()}»: аркан{' '}
					{currentArcana.number} ({currentArcana.name})
				</p>
			</div>
		</div>
	)
}
