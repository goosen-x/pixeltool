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
	getArcana,
	type FullDestinyMatrixResult,
	type FullPointKey
} from '@/lib/utils/destiny-matrix'
import { getCurrentPeriod } from '@/lib/utils/destiny-matrix-current-period'
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

/** Пустой спейсер той же ширины, что и колонка карт на sm+, чтобы
 * заголовок начинался на одной вертикали с абзацем, а не с карт. */
function SectionHeading({ icon: Icon, children }: SectionHeadingProps) {
	return (
		<div className='mb-3 flex gap-6'>
			<div aria-hidden className='hidden shrink-0 sm:block sm:w-52' />
			<h3 className='flex flex-1 items-center gap-2 text-balance text-lg font-semibold text-foreground sm:text-2xl'>
				{Icon && <Icon aria-hidden className='h-6 w-6 shrink-0 text-primary' />}
				{children}
			</h3>
		</div>
	)
}

interface PointCardProps {
	arcanaKey: FullPointKey
	result: FullDestinyMatrixResult
	className: string
}

function PointCard({ arcanaKey, result, className }: PointCardProps) {
	const arcana = getArcana(result[arcanaKey])
	return (
		<div className={className}>
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
}

interface PointsRowProps {
	keys: FullPointKey[]
	result: FullDestinyMatrixResult
	textByKey: Partial<Record<FullPointKey, string>>
}

function PointsRow({ keys, result, textByKey }: PointsRowProps) {
	// Карта и абзац ищутся по одному и тому же ключу, а не по совпадающему
	// индексу в двух параллельных массивах — так они физически не могут
	// разъехаться, даже если текст для какой-то точки когда-нибудь пропадёт
	// из датасета.
	const pairs = keys
		.map(key => ({ key, text: textByKey[key] }))
		.filter(
			(pair): pair is { key: FullPointKey; text: string } =>
				pair.text !== undefined
		)

	if (pairs.length === 0) return null

	return (
		<div className='sm:flex sm:gap-6'>
			{/* Мобильный: каждая карта обтекается своим же абзацем — карта
			    слева, текст читается вокруг неё, следующая пара начинается
			    ниже (clear-both), а не рядом. */}
			<div className='sm:hidden'>
				{pairs.map(({ key, text }) => (
					<div key={key} className='clear-both mb-4'>
						<PointCard
							arcanaKey={key}
							result={result}
							className='float-left mr-4 mb-2 w-20 text-center'
						/>
						<p className='indent-8 text-sm leading-relaxed text-foreground/90'>
							{text}
						</p>
					</div>
				))}
			</div>

			{/* sm+: прежняя раскладка — липкая колонка карт слева, весь текст
			    раздела одним потоком справа. */}
			<div className='hidden flex-wrap gap-3 sm:sticky sm:top-20 sm:flex sm:h-fit sm:w-52 sm:shrink-0 sm:content-start'>
				{pairs.map(({ key }) => (
					<PointCard
						key={key}
						arcanaKey={key}
						result={result}
						className='w-24 text-center'
					/>
				))}
			</div>
			<div className='hidden space-y-4 sm:block sm:w-full sm:flex-1'>
				{pairs.map(({ key, text }) => (
					<p
						key={key}
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

	const currentPeriod = getCurrentPeriod(result, birthDate)

	return (
		<div className='space-y-8'>
			<div className='flex flex-wrap items-center justify-between gap-4'>
				<h2 className='text-balance text-xl font-bold text-foreground sm:text-3xl'>
					Полное толкование матрицы судьбы
				</h2>
				<Button
					onClick={() => downloadDestinyMatrixPdf(result, birthDate, texts)}
					className='cursor-pointer'
				>
					<Download className='mr-2 h-4 w-4' />
					Скачать PDF
				</Button>
			</div>

			<div>
				<SectionHeading icon={Hourglass}>Текущий период</SectionHeading>
				<PointsRow
					keys={[currentPeriod.key]}
					result={result}
					textByKey={{ [currentPeriod.key]: currentPeriod.text }}
				/>
			</div>

			{NARRATIVE_SECTIONS.map(section => {
				const hasText = section.keys.some(key => texts[key])
				if (!hasText) return null
				return (
					<div key={section.title}>
						<SectionHeading icon={SECTION_ICONS[section.title]}>
							{section.title}
						</SectionHeading>
						<PointsRow keys={section.keys} result={result} textByKey={texts} />
					</div>
				)
			})}
		</div>
	)
}
