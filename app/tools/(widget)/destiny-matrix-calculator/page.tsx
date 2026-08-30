'use client'

import { useMemo, useState } from 'react'
import { Check, Copy, Download } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { DatePicker } from '@/components/ui/date-picker'
import {
	toolBar,
	toolFooterBar,
	toolIconButton,
	toolToggleOption,
	toolToggleTrack
} from '@/lib/ui/tool-pill'
import {
	calculateDestinyMatrix,
	getArcana,
	getPersonalizedMeaning,
	getYearsMatrixSector,
	POSITIONS,
	type Gender
} from '@/lib/utils/destiny-matrix'
import { WidgetSEOWrapper } from '@/components/seo/WidgetSEOWrapper'
import { getWidgetById } from '@/lib/constants/widgets'
import { DestinyMatrixCalculatorSeo } from './DestinyMatrixCalculatorSeo'
import { DestinyMatrixDiagram } from './DestinyMatrixDiagram'
import { downloadDestinyMatrixPdf } from './DestinyMatrixPdf'
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

	const result = useMemo(() => {
		const parsed = parseIso(birthDate)
		if (!parsed) return null
		return calculateDestinyMatrix(parsed.day, parsed.month, parsed.year)
	}, [birthDate])

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

		const parsed = parseIso(birthDate)
		if (parsed) {
			const today = new Date()
			const birth = new Date(parsed.year, parsed.month - 1, parsed.day)
			let age = today.getFullYear() - birth.getFullYear()
			const hadBirthday =
				today.getMonth() > birth.getMonth() ||
				(today.getMonth() === birth.getMonth() &&
					today.getDate() >= birth.getDate())
			if (!hadBirthday) age -= 1
			const sector = getYearsMatrixSector(Math.max(age, 0), [
				result.day,
				result.month,
				result.year,
				result.fourth
			])
			const sectorArcana = getArcana(sector.arcanaNumber)
			lines.push(
				`Матрица лет (сейчас): ${sectorArcana.number} (${sectorArcana.name})`
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
				<div className={toolBar}>
					<span className='text-sm text-muted-foreground'>Дата рождения</span>

					<div className='flex items-center gap-0.5 sm:ml-auto'>
						<Button
							size='icon'
							variant='ghost'
							onClick={downloadPdf}
							disabled={!result}
							title='Скачать PDF'
							className={toolIconButton}
						>
							<Download className='h-4 w-4' />
						</Button>
						<Button
							size='icon'
							variant='ghost'
							onClick={copyResult}
							disabled={!result}
							title='Скопировать результат'
							className={toolIconButton}
						>
							{copied ? (
								<Check className='h-4 w-4 text-green-600 dark:text-green-400' />
							) : (
								<Copy className='h-4 w-4' />
							)}
						</Button>
					</div>
				</div>

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

					<label className='block max-w-xs'>
						<span className='mb-1.5 block text-sm text-muted-foreground'>
							Число, месяц и год рождения
						</span>
						<DatePicker
							value={birthDate}
							onChange={setBirthDate}
							ariaLabel='Дата рождения'
							className='w-full cursor-pointer rounded-md border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-ring'
						/>
					</label>
				</div>

				{result ? (
					<div className='px-5 py-8 sm:px-6'>
						{name && (
							<p className='mb-6 text-center text-lg font-medium text-foreground'>
								Матрица судьбы: {name}
							</p>
						)}

						<DestinyMatrixDiagram result={result} gender={gender} />
						<DestinyYearsMatrix result={result} birthDate={birthDate} />

						<span className='mx-auto mt-8 block max-w-lg border-t pt-8 text-center text-sm text-muted-foreground'>
							То же самое подробно
						</span>

						<div className='mx-auto grid max-w-lg grid-cols-2 gap-3'>
							{POSITIONS.map(({ key, label }) => {
								const arcana = getArcana(result[key])
								return (
									<div key={key} className='rounded-xl border p-4 text-center'>
										<span className='block font-mono text-3xl font-bold tracking-tight text-foreground'>
											{arcana.number}
										</span>
										<span className='mt-1 block text-sm font-medium text-foreground'>
											{arcana.name}
										</span>
										<span className='mt-1 block text-xs text-muted-foreground'>
											{label}
										</span>
									</div>
								)
							})}
						</div>

						{(() => {
							const center = getArcana(result.center)
							return (
								<div className='mx-auto mt-3 max-w-lg rounded-xl border border-primary bg-primary/5 p-5 text-center'>
									<span className='block font-mono text-4xl font-bold tracking-tight text-primary'>
										{center.number}
									</span>
									<span className='mt-1 block font-medium text-foreground'>
										{center.name}
									</span>
									<span className='mt-1 block text-xs text-muted-foreground'>
										Главное предназначение
									</span>
									<p className='mt-3 text-sm text-muted-foreground'>
										{getPersonalizedMeaning(center, gender)}
									</p>
								</div>
							)
						})()}

						<div className='mx-auto mt-6 max-w-lg space-y-3'>
							{POSITIONS.map(({ key, label }) => {
								const arcana = getArcana(result[key])
								return (
									<p key={key} className='text-sm text-muted-foreground'>
										<span className='font-medium text-foreground'>
											{label} ({arcana.name}):
										</span>{' '}
										{getPersonalizedMeaning(arcana, gender)}
									</p>
								)
							})}
						</div>
					</div>
				) : (
					<p className='px-5 py-16 text-center text-sm text-muted-foreground sm:px-6'>
						Укажите дату рождения
					</p>
				)}

				<div className={toolFooterBar}>
					<span className='text-sm text-muted-foreground'>
						У метода нет единого стандарта расчёта — числа на разных сайтах
						могут немного отличаться
					</span>
				</div>
			</Card>

			<DestinyMatrixCalculatorSeo />
		</WidgetSEOWrapper>
	)
}
