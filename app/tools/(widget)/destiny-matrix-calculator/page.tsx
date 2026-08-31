'use client'

import { useEffect, useMemo, useState } from 'react'
import Image from 'next/image'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { DatePicker } from '@/components/ui/date-picker'
import {
	calculateFullDestinyMatrix,
	FULL_POINT_LABELS,
	getArcana,
	type FullPointKey
} from '@/lib/utils/destiny-matrix'
import {
	getCurrentAgeSectorIndex,
	type DestinyMatrixSelection
} from '@/lib/utils/destiny-matrix-current-period'
import { WidgetSEOWrapper } from '@/components/seo/WidgetSEOWrapper'
import { getWidgetById } from '@/lib/constants/widgets'
import { DestinyMatrixCalculatorSeo } from './DestinyMatrixCalculatorSeo'
import { DestinyMatrixFullDiagram } from './DestinyMatrixFullDiagram'
import { DestinyMatrixLinesPanel } from './DestinyMatrixLinesPanel'
import { DestinyMatrixNarrative } from './DestinyMatrixNarrative'
import { DestinyMatrixPointDetail } from './DestinyMatrixPointDetail'

const BASE_POINT_KEYS: FullPointKey[] = [
	'day',
	'month',
	'year',
	'fourth',
	'center'
]

function parseIso(
	value: string
): { day: number; month: number; year: number } | null {
	if (!value) return null
	const [year, month, day] = value.split('-').map(Number)
	if (!year || !month || !day) return null
	return { day, month, year }
}

export default function DestinyMatrixCalculatorPage() {
	const widget = getWidgetById('destiny-matrix-calculator')!

	const [birthDate, setBirthDate] = useState('')
	const [selection, setSelection] = useState<DestinyMatrixSelection>({
		kind: 'point',
		key: 'center'
	})
	const [highlightedLine, setHighlightedLine] = useState<string | null>(null)

	const result = useMemo(() => {
		const parsed = parseIso(birthDate)
		if (!parsed) return null
		return calculateFullDestinyMatrix(parsed.day, parsed.month, parsed.year)
	}, [birthDate])

	// Дата из ссылки (?date=1992-04-08) подставляется один раз при заходе,
	// чтобы шеринг ссылки с уже посчитанным результатом работал.
	useEffect(() => {
		const dateParam = new URLSearchParams(window.location.search).get('date')
		if (dateParam && parseIso(dateParam)) setBirthDate(dateParam)
	}, [])

	// Query-параметр держится в синхроне с посчитанным результатом, а не
	// только с кликом по «Рассчитать»: так скопированная в любой момент
	// ссылка из адресной строки всегда рабочая, даже если пользователь
	// подтвердил дату клавишей Enter или календарём, а не кнопкой.
	useEffect(() => {
		if (!result) return
		const params = new URLSearchParams(window.location.search)
		if (params.get('date') === birthDate) return
		params.set('date', birthDate)
		window.history.replaceState(
			null,
			'',
			`${window.location.pathname}?${params.toString()}`
		)
	}, [result, birthDate])

	const toggleLine = (key: string) => {
		setHighlightedLine(current => (current === key ? null : key))
	}

	// Общий обработчик выбора точки: клик по диаграмме и клик по карточке в
	// «5 основных точек» должны обновлять одну и ту же активную точку.
	const selectPoint = (key: FullPointKey) => {
		setSelection({ kind: 'point', key })
	}

	// Клик по кольцу матрицы лет — отдельный выбор, не точка схемы: тот же
	// узел значит разное («что это за черта» против «что в этом возрасте»),
	// поэтому не переиспользует selectPoint и не подсвечивает узел схемы.
	const selectAgeSector = (sectorIndex: number) => {
		setSelection({ kind: 'age', sectorIndex })
	}

	const currentAgeSectorIndex = birthDate
		? getCurrentAgeSectorIndex(birthDate)
		: 0

	return (
		<WidgetSEOWrapper widget={widget}>
			<Card className='overflow-hidden p-0'>
				<div
					className={
						result ? 'border-b px-5 py-6 sm:px-6' : 'px-5 py-20 sm:px-6'
					}
				>
					<div
						className={
							result
								? 'flex flex-wrap items-start gap-4'
								: 'flex flex-wrap items-center justify-center gap-4'
						}
					>
						<label
							className={result ? 'block' : 'flex flex-wrap items-center gap-4'}
						>
							<span
								className={
									result
										? 'mb-1.5 block text-base font-medium text-muted-foreground'
										: 'text-2xl font-bold text-foreground'
								}
							>
								Введите дату рождения
							</span>
							<div className='flex gap-2'>
								<DatePicker
									value={birthDate}
									onChange={setBirthDate}
									ariaLabel='Дата рождения'
									className={
										result
											? 'w-full cursor-pointer rounded-md border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-ring'
											: 'w-full max-w-[220px] cursor-pointer rounded-md border bg-background px-4 py-3 text-base text-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-ring'
									}
								/>
								<Button
									type='button'
									onClick={() =>
										(document.activeElement as HTMLElement | null)?.blur()
									}
									className='shrink-0 cursor-pointer'
								>
									Рассчитать
								</Button>
							</div>
						</label>
					</div>
				</div>

				{result ? (
					<div className='px-5 py-8 sm:px-6'>
						<div className='grid gap-6 lg:grid-cols-[1fr_440px]'>
							<div>
								<DestinyMatrixFullDiagram
									result={result}
									birthDate={birthDate}
									selection={selection}
									onSelectPoint={selectPoint}
									onSelectAgeSector={selectAgeSector}
									highlightedLine={highlightedLine}
									onClearLine={() => setHighlightedLine(null)}
								/>
							</div>

							<DestinyMatrixPointDetail
								result={result}
								selection={selection}
								currentAgeSectorIndex={currentAgeSectorIndex}
							/>
						</div>

						<div className='mt-6'>
							<span className='mb-3 block text-xs font-medium uppercase tracking-wide text-muted-foreground'>
								5 основных точек
							</span>
							<div className='grid grid-cols-2 gap-3 sm:grid-cols-5'>
								{BASE_POINT_KEYS.map(key => {
									const label = FULL_POINT_LABELS[key]
									const arcana = getArcana(result[key])
									const isActive =
										selection.kind === 'point' && selection.key === key
									return (
										<button
											key={key}
											type='button'
											onClick={() => selectPoint(key)}
											className={
												isActive
													? 'flex cursor-pointer flex-col items-center gap-2 rounded-lg border border-primary bg-primary/5 p-3 text-center'
													: 'flex cursor-pointer flex-col items-center gap-2 rounded-lg border p-3 text-center hover:border-primary/50'
											}
										>
											{arcana.image ? (
												<Image
													src={arcana.image}
													alt=''
													width={40}
													height={60}
													className='shrink-0 rounded border'
												/>
											) : (
												<span className='font-mono text-sm font-bold text-foreground'>
													{arcana.number}
												</span>
											)}
											<span className='block text-sm font-medium text-foreground'>
												{arcana.name}
											</span>
											<span className='block text-xs text-muted-foreground'>
												{label}
											</span>
										</button>
									)
								})}
							</div>
						</div>

						<div className='mt-6'>
							<DestinyMatrixLinesPanel
								result={result}
								highlightedLine={highlightedLine}
								onToggle={toggleLine}
							/>
						</div>
					</div>
				) : null}
			</Card>

			{result && (
				// Отдельная карточка, не внутри той, что выше: overflow-hidden
				// там нужен, чтобы обрезать скруглённые углы шапки, но он же
				// отключает position: sticky у карт в тексте ниже — любой
				// overflow, отличный от visible, на предке ломает sticky, даже
				// если сам этот элемент не скроллится.
				<Card className='mt-6 p-5 sm:p-6'>
					<DestinyMatrixNarrative result={result} birthDate={birthDate} />
				</Card>
			)}

			<DestinyMatrixCalculatorSeo />
		</WidgetSEOWrapper>
	)
}
