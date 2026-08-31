'use client'

import { useEffect, useState } from 'react'
import type { ComponentType, ReactNode } from 'react'
import Image from 'next/image'
import {
	Coins,
	Compass,
	Download,
	Heart,
	Hourglass,
	Mars,
	Sparkles,
	Venus
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
	ageFromBirthDate,
	getArcana,
	getYearsMatrixSector,
	YEARS_MATRIX_SECTOR_KEYS,
	type Arcana,
	type FullDestinyMatrixResult,
	type FullPointKey
} from '@/lib/utils/destiny-matrix'
import { NARRATIVE_SECTIONS } from '@/lib/utils/destiny-matrix-narrative-sections'
import { fetchNarrativeBlock } from './actions'
import { downloadDestinyMatrixPdf } from './DestinyMatrixPdf'

type IconComponent = ComponentType<{ className?: string }>

const SECTION_ICONS: Record<string, IconComponent> = {
	'Личность и предназначение': Compass,
	'Родовая линия по мужской стороне': Mars,
	'Родовая линия по женской стороне': Venus,
	'Любовь и отношения': Heart,
	Деньги: Coins,
	Талант: Sparkles
}

interface DestinyMatrixNarrativeProps {
	result: FullDestinyMatrixResult
	birthDate: string
}

interface SectionHeadingProps {
	icon?: IconComponent
	children: ReactNode
}

/** Пустой спейсер той же ширины, что и колонка карт, чтобы заголовок
 * начинался на одной вертикали с абзацем, а не с карт. */
function SectionHeading({ icon: Icon, children }: SectionHeadingProps) {
	return (
		<div className='mb-3 flex gap-6'>
			<div aria-hidden className='w-44 shrink-0 sm:w-52' />
			<h3 className='flex flex-1 items-center gap-2 text-2xl font-semibold text-foreground'>
				{Icon && <Icon aria-hidden className='h-6 w-6 shrink-0 text-primary' />}
				{children}
			</h3>
		</div>
	)
}

/**
 * Точка текущего десятилетия (day/f/month/g/year/h/fourth/i) всегда
 * входит ещё в какой-нибудь другой раздел ниже (личность, родовые
 * линии), поэтому карточный текст для неё там уже есть — брать его же
 * для «Текущего периода» значило бы дублировать абзац дважды. Вместо
 * этого собираем отдельный текст из общего значения аркана (короче и
 * не пересекается ни с одним из 528 текстов датасета) плюс возрастная
 * рамка.
 */
function buildCurrentPeriodText(
	arcana: Arcana,
	sectorStart: number,
	sectorEnd: number
): string {
	return `Ближайшие годы, с ${sectorStart} до ${sectorEnd} лет, проходят под влиянием аркана ${arcana.number} (${arcana.name}). ${arcana.meaning} Эта тема сейчас звучит громче остальных и задаёт тон происходящему.`
}

interface PointsRowProps {
	keys: FullPointKey[]
	result: FullDestinyMatrixResult
	paragraphs: string[]
}

function PointsRow({ keys, result, paragraphs }: PointsRowProps) {
	return (
		<div className='flex gap-6'>
			<div className='flex w-44 shrink-0 flex-wrap content-start gap-3 sm:w-52'>
				{keys.map(key => {
					const arcana = getArcana(result[key])
					return (
						<div key={key} className='w-20 text-center sm:w-24'>
							{arcana.image ? (
								<Image
									src={arcana.image}
									alt=''
									width={96}
									height={144}
									className='w-full rounded-md border'
								/>
							) : (
								<span className='flex h-24 w-full items-center justify-center rounded-md border bg-primary/10 font-mono text-lg font-bold text-primary'>
									{arcana.number}
								</span>
							)}
							<span className='mt-1 block text-xs text-muted-foreground'>
								{arcana.name}
							</span>
						</div>
					)
				})}
			</div>
			<div className='flex-1 space-y-4'>
				{paragraphs.map((text, index) => (
					<p
						key={index}
						className='indent-8 text-lg leading-relaxed text-foreground/90'
					>
						{text}
					</p>
				))}
			</div>
		</div>
	)
}

export function DestinyMatrixNarrative({
	result,
	birthDate
}: DestinyMatrixNarrativeProps) {
	const [texts, setTexts] = useState<Partial<
		Record<FullPointKey, string>
	> | null>(null)

	useEffect(() => {
		let cancelled = false
		setTexts(null)
		fetchNarrativeBlock(result).then(data => {
			if (!cancelled) setTexts(data)
		})
		return () => {
			cancelled = true
		}
	}, [result])

	if (!texts) return null

	const age = ageFromBirthDate(birthDate)
	const yearsPoints = YEARS_MATRIX_SECTOR_KEYS.map(key => result[key]) as [
		number,
		number,
		number,
		number,
		number,
		number,
		number,
		number
	]
	const currentSector = getYearsMatrixSector(age, yearsPoints)
	const currentKey = YEARS_MATRIX_SECTOR_KEYS[currentSector.sectorIndex]
	const currentArcana = getArcana(currentSector.arcanaNumber)
	const currentPeriodText = buildCurrentPeriodText(
		currentArcana,
		currentSector.sectorStart,
		currentSector.sectorEnd - 1
	)

	return (
		<div className='space-y-8'>
			<div className='flex flex-wrap items-center justify-between gap-4'>
				<h2 className='text-2xl font-bold text-foreground sm:text-3xl'>
					Полное толкование матрицы судьбы
				</h2>
				<Button
					onClick={() => downloadDestinyMatrixPdf(texts)}
					className='cursor-pointer'
				>
					<Download className='mr-2 h-4 w-4' />
					Скачать PDF
				</Button>
			</div>

			<div>
				<SectionHeading icon={Hourglass}>Текущий период</SectionHeading>
				<PointsRow
					keys={[currentKey]}
					result={result}
					paragraphs={[currentPeriodText]}
				/>
			</div>

			{NARRATIVE_SECTIONS.map(section => {
				const paragraphs = section.keys
					.map(key => texts[key])
					.filter((text): text is string => Boolean(text))
				if (paragraphs.length === 0) return null
				return (
					<div key={section.title}>
						<SectionHeading icon={SECTION_ICONS[section.title]}>
							{section.title}
						</SectionHeading>
						<PointsRow
							keys={section.keys}
							result={result}
							paragraphs={paragraphs}
						/>
					</div>
				)
			})}
		</div>
	)
}
