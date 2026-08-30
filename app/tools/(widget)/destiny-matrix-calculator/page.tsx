'use client'

import { useMemo, useState } from 'react'
import { Check, ChevronRight, Copy, Download } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { DatePicker } from '@/components/ui/date-picker'
import {
	toolFooterBar,
	toolToggleOption,
	toolToggleTrack
} from '@/lib/ui/tool-pill'
import { pluralizeRu } from '@/lib/utils/pluralize'
import {
	ageFromBirthDate,
	calculateFullDestinyMatrix,
	getArcana,
	getYearsMatrixSector,
	POSITIONS,
	type FullPointKey,
	type Gender
} from '@/lib/utils/destiny-matrix'
import { WidgetSEOWrapper } from '@/components/seo/WidgetSEOWrapper'
import { getWidgetById } from '@/lib/constants/widgets'
import { DestinyMatrixCalculatorSeo } from './DestinyMatrixCalculatorSeo'
import { DestinyMatrixFullDiagram } from './DestinyMatrixFullDiagram'
import { DestinyMatrixLinesPanel } from './DestinyMatrixLinesPanel'
import { downloadDestinyMatrixPdf } from './DestinyMatrixPdf'
import { DestinyMatrixPointDetail } from './DestinyMatrixPointDetail'
import { DestinyYearsMatrix } from './DestinyYearsMatrix'

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
	const [name, setName] = useState('')
	const [gender, setGender] = useState<Gender | undefined>(undefined)
	const [copied, setCopied] = useState(false)
	const [active, setActive] = useState<FullPointKey>('center')
	const [highlightedLine, setHighlightedLine] = useState<string | null>(null)

	const result = useMemo(() => {
		const parsed = parseIso(birthDate)
		if (!parsed) return null
		return calculateFullDestinyMatrix(parsed.day, parsed.month, parsed.year)
	}, [birthDate])

	const age = birthDate ? ageFromBirthDate(birthDate) : null

	const activePeriod =
		result && age !== null
			? (() => {
					const sector = getYearsMatrixSector(age, [
						result.day,
						result.month,
						result.year,
						result.fourth
					])
					return { ...sector, arcana: getArcana(sector.arcanaNumber) }
				})()
			: null

	const toggleLine = (key: string) => {
		setHighlightedLine(current => (current === key ? null : key))
	}

	const copyResult = async () => {
		if (!result) return
		const lines: string[] = []
		if (name) lines.push(`Матрица судьбы: ${name}`, '')
		lines.push(
			...POSITIONS.map(({ key, label }) => {
				const arcana = getArcana(result[key])
				return `${label}: ${arcana.number} (${arcana.name})`
			})
		)
		const center = getArcana(result.center)
		lines.push(`Предназначение: ${center.number} (${center.name})`)

		if (activePeriod) {
			lines.push(
				`Матрица лет (сейчас): ${activePeriod.arcana.number} (${activePeriod.arcana.name})`
			)
		}

		await navigator.clipboard.writeText(lines.join('\n'))
		setCopied(true)
		setTimeout(() => setCopied(false), 2000)
	}

	const downloadPdf = () => {
		if (!result) return
		downloadDestinyMatrixPdf(result, { name: name || undefined, gender })
	}

	return (
		<WidgetSEOWrapper widget={widget}>
			<Card className='overflow-hidden p-0'>
				<div className='space-y-4 border-b px-5 py-6 sm:px-6'>
					<div className='grid gap-4 sm:grid-cols-2'>
						<label className='block'>
							<span className='mb-1.5 block text-sm text-muted-foreground'>
								Имя (необязательно)
							</span>
							<input
								type='text'
								value={name}
								onChange={event => setName(event.target.value)}
								placeholder='Например, Мария'
								className='w-full rounded-md border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-ring'
							/>
						</label>

						<div>
							<span className='mb-1.5 block text-sm text-muted-foreground'>
								Пол (необязательно)
							</span>
							<div className={toolToggleTrack}>
								<button
									type='button'
									onClick={() =>
										setGender(current =>
											current === 'male' ? undefined : 'male'
										)
									}
									className={toolToggleOption(gender === 'male')}
								>
									Мужской
								</button>
								<button
									type='button'
									onClick={() =>
										setGender(current =>
											current === 'female' ? undefined : 'female'
										)
									}
									className={toolToggleOption(gender === 'female')}
								>
									Женский
								</button>
							</div>
						</div>
					</div>

					<div className='flex flex-wrap items-end gap-4'>
						<label className='block'>
							<span className='mb-1.5 block text-sm text-muted-foreground'>
								Дата рождения
							</span>
							<DatePicker
								value={birthDate}
								onChange={setBirthDate}
								ariaLabel='Дата рождения'
								className='w-full cursor-pointer rounded-md border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-ring'
							/>
						</label>

						{result && age !== null && (
							<div>
								<span className='mb-1.5 block text-sm text-muted-foreground'>
									Возраст
								</span>
								<span className='block rounded-md border bg-muted/30 px-3 py-2 text-sm text-foreground'>
									{age} {pluralizeRu(age, ['год', 'года', 'лет'])}
								</span>
							</div>
						)}

						{activePeriod && (
							<div>
								<span className='mb-1.5 block text-sm text-muted-foreground'>
									Активный период
								</span>
								<span className='block rounded-md border border-primary bg-primary/5 px-3 py-2 text-sm text-primary'>
									{activePeriod.sectorStart}-{activePeriod.sectorEnd - 1} лет ·
									аркан {activePeriod.arcana.number} ({activePeriod.arcana.name}
									)
								</span>
							</div>
						)}

						<div className='ml-auto flex items-center gap-2'>
							<Button
								size='icon'
								variant='ghost'
								onClick={downloadPdf}
								disabled={!result}
								title='Скачать PDF'
								className='h-10 w-10 cursor-pointer text-muted-foreground hover:bg-muted hover:text-foreground'
							>
								<Download className='h-4 w-4' />
							</Button>
							<Button
								variant='outline'
								onClick={copyResult}
								disabled={!result}
								className='cursor-pointer'
							>
								{copied ? (
									<Check className='mr-2 h-4 w-4 text-green-600 dark:text-green-400' />
								) : (
									<Copy className='mr-2 h-4 w-4' />
								)}
								Копировать расчёт
							</Button>
						</div>
					</div>
				</div>

				{result ? (
					<div className='px-5 py-8 sm:px-6'>
						{name && (
							<p className='mb-6 text-center text-lg font-medium text-foreground'>
								Матрица судьбы: {name}
							</p>
						)}

						<div className='grid gap-6 lg:grid-cols-[1fr_360px]'>
							<div>
								<DestinyMatrixFullDiagram
									result={result}
									active={active}
									onSelect={setActive}
									highlightedLine={highlightedLine}
								/>
								<DestinyYearsMatrix result={result} birthDate={birthDate} />
							</div>

							<div className='space-y-4'>
								<DestinyMatrixPointDetail
									result={result}
									active={active}
									gender={gender}
								/>

								<div className='space-y-2'>
									<span className='block text-xs font-medium uppercase tracking-wide text-muted-foreground'>
										Все пять точек
									</span>
									{[
										...POSITIONS,
										{ key: 'center' as const, label: 'Главное предназначение' }
									].map(({ key, label }) => {
										const arcana = getArcana(result[key])
										return (
											<button
												key={key}
												type='button'
												onClick={() => setActive(key)}
												className={
													active === key
														? 'flex w-full cursor-pointer items-center justify-between rounded-lg border border-primary bg-primary/5 p-3 text-left'
														: 'flex w-full cursor-pointer items-center justify-between rounded-lg border p-3 text-left hover:border-primary/50'
												}
											>
												<span className='flex items-center gap-3'>
													<span className='font-mono text-sm font-bold text-foreground'>
														{arcana.number}
													</span>
													<span>
														<span className='block text-sm font-medium text-foreground'>
															{arcana.name}
														</span>
														<span className='block text-xs text-muted-foreground'>
															{label}
														</span>
													</span>
												</span>
												<ChevronRight className='h-4 w-4 shrink-0 text-muted-foreground' />
											</button>
										)
									})}
								</div>

								<DestinyMatrixLinesPanel
									result={result}
									highlightedLine={highlightedLine}
									onToggle={toggleLine}
								/>
							</div>
						</div>
					</div>
				) : (
					<p className='px-5 py-16 text-center text-sm text-muted-foreground sm:px-6'>
						Укажите дату рождения
					</p>
				)}

				<div className={toolFooterBar}>
					<span className='text-sm text-muted-foreground'>
						У метода нет единого стандарта расчёта, числа на разных сайтах могут
						немного отличаться. Расширенные точки (родовые линии, любовь,
						деньги, талант) посчитаны по одной конкретной методике
						(gadalkindom), а не по общепринятому стандарту.
					</span>
				</div>
			</Card>

			<DestinyMatrixCalculatorSeo />
		</WidgetSEOWrapper>
	)
}
