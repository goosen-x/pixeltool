'use client'

import { useMemo, useState } from 'react'
import Image from 'next/image'
import { Download } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { DatePicker } from '@/components/ui/date-picker'
import {
	calculateFullDestinyMatrix,
	FULL_POINT_LABELS,
	getArcana,
	type FullPointKey
} from '@/lib/utils/destiny-matrix'
import { WidgetSEOWrapper } from '@/components/seo/WidgetSEOWrapper'
import { getWidgetById } from '@/lib/constants/widgets'
import { DestinyMatrixCalculatorSeo } from './DestinyMatrixCalculatorSeo'
import { DestinyMatrixFullDiagram } from './DestinyMatrixFullDiagram'
import { DestinyMatrixLinesPanel } from './DestinyMatrixLinesPanel'
import { downloadDestinyMatrixPdf } from './DestinyMatrixPdf'
import { DestinyMatrixPointDetail } from './DestinyMatrixPointDetail'
import { DestinyYearsMatrix } from './DestinyYearsMatrix'

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
	const [active, setActive] = useState<FullPointKey>('center')
	const [highlightedLine, setHighlightedLine] = useState<string | null>(null)

	const result = useMemo(() => {
		const parsed = parseIso(birthDate)
		if (!parsed) return null
		return calculateFullDestinyMatrix(parsed.day, parsed.month, parsed.year)
	}, [birthDate])

	const toggleLine = (key: string) => {
		setHighlightedLine(current => (current === key ? null : key))
	}

	// Общий обработчик выбора точки: клик по диаграмме и клик по карточке в
	// «5 основных точек» должны обновлять одну и ту же активную точку.
	const selectPoint = (key: FullPointKey) => {
		setActive(key)
	}

	const downloadPdf = () => {
		if (!result) return
		downloadDestinyMatrixPdf(result)
	}

	return (
		<WidgetSEOWrapper widget={widget}>
			<Card className='overflow-hidden p-0'>
				<div
					className={
						result
							? 'border-b px-5 py-6 sm:px-6'
							: 'px-5 py-20 sm:px-6'
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
							className={
								result ? 'block' : 'flex flex-wrap items-center gap-4'
							}
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
						</label>

						{result && (
							<div className='min-w-[280px] flex-1'>
								<DestinyYearsMatrix result={result} birthDate={birthDate} />
							</div>
						)}
					</div>
				</div>

				{result ? (
					<div className='px-5 py-8 sm:px-6'>
						<div className='grid gap-6 lg:grid-cols-[1fr_440px]'>
							<div>
								<DestinyMatrixFullDiagram
									result={result}
									active={active}
									onSelect={selectPoint}
									highlightedLine={highlightedLine}
								/>
							</div>

							<DestinyMatrixPointDetail result={result} active={active} />
						</div>

						<div className='mt-6'>
							<span className='mb-3 block text-xs font-medium uppercase tracking-wide text-muted-foreground'>
								5 основных точек
							</span>
							<div className='grid grid-cols-2 gap-3 sm:grid-cols-5'>
								{BASE_POINT_KEYS.map(key => {
									const label = FULL_POINT_LABELS[key]
									const arcana = getArcana(result[key])
									return (
										<button
											key={key}
											type='button'
											onClick={() => selectPoint(key)}
											className={
												active === key
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

						<div className='mt-6 flex justify-end'>
							<Button onClick={downloadPdf} className='cursor-pointer'>
								<Download className='mr-2 h-4 w-4' />
								Скачать PDF
							</Button>
						</div>
					</div>
				) : null}
			</Card>

			<DestinyMatrixCalculatorSeo />
		</WidgetSEOWrapper>
	)
}
