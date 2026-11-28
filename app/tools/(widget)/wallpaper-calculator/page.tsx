'use client'

import { useMemo, useState } from 'react'
import { Plus, X } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
	toolBar,
	toolFooterBar,
	toolIconButton,
	toolPill,
	toolToggleOption,
	toolToggleTrack
} from '@/lib/ui/tool-pill'
import { WidgetSEOWrapper } from '@/components/seo/WidgetSEOWrapper'
import { getWidgetById } from '@/lib/constants/widgets'
import {
	calculateWallpaper,
	type OpeningKind,
	type WallpaperMatch,
	type WallpaperOpening
} from '@/lib/wallpaper-calculator'
import { pluralizeRu } from '@/lib/utils/pluralize'
import { WallpaperCalculatorSeo } from './WallpaperCalculatorSeo'

type RoomMode = 'room' | 'walls'

const ROLLS = [
	{ id: '053', label: '0,53 × 10,05', width: '0.53', length: '10.05' },
	{ id: '106', label: '1,06 × 10,05', width: '1.06', length: '10.05' },
	{ id: '106-25', label: '1,06 × 25', width: '1.06', length: '25' },
	{ id: 'custom', label: 'Свой', width: '', length: '' }
] as const

type RollId = (typeof ROLLS)[number]['id']

const MATCHES: { value: WallpaperMatch; label: string; hint: string }[] = [
	{
		value: 'none',
		label: 'Без подбора',
		hint: 'Однотонные обои или мелкий рисунок: полосы режутся подряд'
	},
	{
		value: 'straight',
		label: 'Прямая стыковка',
		hint: 'Рисунок на соседних полосах на одной высоте, каждая полоса начинается в той же точке раппорта'
	},
	{
		value: 'offset',
		label: 'Со смещением',
		hint: 'Рисунок на соседних полосах сдвинут на полраппорта, на этикетке это пишут как 64/32'
	}
]

interface OpeningRow {
	kind: OpeningKind
	width: string
	height: string
	sill: string
	count: string
}

const inputClass =
	'w-full rounded-md border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-ring'

function toNumber(value: string): number | null {
	const parsed = parseFloat(value.replace(',', '.'))
	return Number.isFinite(parsed) && parsed > 0 ? parsed : null
}

function toNonNegative(value: string): number {
	const parsed = parseFloat(value.replace(',', '.'))
	return Number.isFinite(parsed) && parsed > 0 ? parsed : 0
}

function Field({
	label,
	value,
	onChange
}: {
	label: string
	value: string
	onChange: (value: string) => void
}) {
	return (
		<label className='block'>
			<span className='mb-1.5 block text-sm text-muted-foreground'>
				{label}
			</span>
			<input
				type='text'
				inputMode='decimal'
				value={value}
				onChange={event => onChange(event.target.value)}
				aria-label={label}
				className={inputClass}
			/>
		</label>
	)
}

function SmallField({
	label,
	value,
	onChange,
	className = 'w-20'
}: {
	label: string
	value: string
	onChange: (value: string) => void
	className?: string
}) {
	return (
		<label className={className}>
			<span className='mb-1 block text-xs text-muted-foreground'>{label}</span>
			<input
				type='text'
				inputMode='decimal'
				value={value}
				onChange={event => onChange(event.target.value)}
				aria-label={label}
				className={inputClass}
			/>
		</label>
	)
}

const fmt = (n: number, digits = 2) =>
	n.toLocaleString('ru-RU', { maximumFractionDigits: digits })

function Stat({ value, label }: { value: string; label: string }) {
	return (
		<div>
			<span className='block font-mono text-3xl font-bold text-foreground'>
				{value}
			</span>
			<span className='mt-1 block text-sm text-muted-foreground'>{label}</span>
		</div>
	)
}

const WINDOW: OpeningRow = {
	kind: 'window',
	width: '1.5',
	height: '1.4',
	sill: '0.8',
	count: '1'
}
const DOOR: OpeningRow = {
	kind: 'door',
	width: '0.9',
	height: '2',
	sill: '',
	count: '1'
}

export default function WallpaperCalculatorPage() {
	const widget = getWidgetById('wallpaper-calculator')!

	const [mode, setMode] = useState<RoomMode>('room')
	const [roomLength, setRoomLength] = useState('4')
	const [roomWidth, setRoomWidth] = useState('3')
	const [wallsLength, setWallsLength] = useState('14')
	const [height, setHeight] = useState('2.7')
	const [rollId, setRollId] = useState<RollId>('106')
	const [rollWidth, setRollWidth] = useState('1.06')
	const [rollLength, setRollLength] = useState('10.05')
	const [match, setMatch] = useState<WallpaperMatch>('none')
	const [rapport, setRapport] = useState('64')
	const [trim, setTrim] = useState('10')
	const [openings, setOpenings] = useState<OpeningRow[]>([WINDOW, DOOR])

	const selectRoll = (id: RollId) => {
		setRollId(id)
		const roll = ROLLS.find(r => r.id === id)!
		if (roll.width) {
			setRollWidth(roll.width)
			setRollLength(roll.length)
		}
	}

	const updateOpening = (index: number, patch: Partial<OpeningRow>) =>
		setOpenings(current =>
			current.map((o, i) => (i === index ? { ...o, ...patch } : o))
		)

	const result = useMemo(() => {
		const perimeter =
			mode === 'room'
				? (() => {
						const l = toNumber(roomLength)
						const w = toNumber(roomWidth)
						return l && w ? 2 * (l + w) : null
					})()
				: toNumber(wallsLength)
		const h = toNumber(height)
		const rw = toNumber(rollWidth)
		const rl = toNumber(rollLength)
		if (!perimeter || !h || !rw || !rl) return null
		// рулон в метрах: 53 вместо 0,53 почти наверняка сантиметры
		if (rw > 5 || rl > 100) return 'units' as const
		const r = toNonNegative(rapport) / 100
		const list: WallpaperOpening[] = []
		for (const o of openings) {
			const width = toNumber(o.width)
			const oh = toNumber(o.height)
			if (!width || !oh) continue
			const count = Math.min(
				50,
				Math.max(1, Math.round(toNumber(o.count) ?? 1))
			)
			for (let i = 0; i < count; i++)
				list.push({
					kind: o.kind,
					width,
					height: oh,
					sill: o.kind === 'window' ? toNonNegative(o.sill) : undefined
				})
		}
		return calculateWallpaper({
			perimeter,
			height: h,
			rollWidth: rw,
			rollLength: rl,
			rapport: r,
			match: r > 0 ? match : 'none',
			trim: toNonNegative(trim) / 100,
			openings: list
		})
	}, [
		mode,
		roomLength,
		roomWidth,
		wallsLength,
		height,
		rollWidth,
		rollLength,
		rapport,
		match,
		trim,
		openings
	])

	const matchHint = MATCHES.find(m => m.value === match)!.hint

	return (
		<WidgetSEOWrapper widget={widget}>
			<Card className='overflow-hidden p-0'>
				<div className={toolBar}>
					<div className={toolToggleTrack}>
						<button
							type='button'
							onClick={() => setMode('room')}
							aria-pressed={mode === 'room'}
							className={toolToggleOption(mode === 'room')}
						>
							Комната
						</button>
						<button
							type='button'
							onClick={() => setMode('walls')}
							aria-pressed={mode === 'walls'}
							className={toolToggleOption(mode === 'walls')}
						>
							Отдельные стены
						</button>
					</div>
					<div className='flex flex-wrap items-center gap-1.5'>
						<span className='mr-1 text-sm text-muted-foreground'>Рулон, м</span>
						{ROLLS.map(roll => (
							<button
								key={roll.id}
								type='button'
								onClick={() => selectRoll(roll.id)}
								aria-pressed={rollId === roll.id}
								className={toolPill(rollId === roll.id)}
							>
								{roll.label}
							</button>
						))}
					</div>
				</div>

				<div className='space-y-6 border-b px-5 py-6 sm:px-6'>
					<div className='grid gap-4 sm:grid-cols-3'>
						{mode === 'room' ? (
							<>
								<Field
									label='Длина комнаты, м'
									value={roomLength}
									onChange={setRoomLength}
								/>
								<Field
									label='Ширина комнаты, м'
									value={roomWidth}
									onChange={setRoomWidth}
								/>
							</>
						) : (
							<div className='sm:col-span-2'>
								<Field
									label='Общая длина стен, м'
									value={wallsLength}
									onChange={setWallsLength}
								/>
							</div>
						)}
						<Field label='Высота стен, м' value={height} onChange={setHeight} />
						{rollId === 'custom' && (
							<>
								<Field
									label='Ширина рулона, м'
									value={rollWidth}
									onChange={setRollWidth}
								/>
								<Field
									label='Длина рулона, м'
									value={rollLength}
									onChange={setRollLength}
								/>
							</>
						)}
						{match !== 'none' && (
							<Field
								label='Раппорт, см'
								value={rapport}
								onChange={setRapport}
							/>
						)}
						<Field
							label='Запас на подрезку, см'
							value={trim}
							onChange={setTrim}
						/>
					</div>

					<div className='space-y-3'>
						<span className='block text-sm text-muted-foreground'>
							Окна и двери, м. Проём меньше двух ширин рулона клеится как стена
						</span>
						{openings.map((opening, index) => (
							<div key={index} className='flex flex-wrap items-end gap-2'>
								<div className={`${toolToggleTrack} mb-0.5`}>
									{(['window', 'door'] as const).map(kind => (
										<button
											key={kind}
											type='button'
											onClick={() =>
												updateOpening(index, {
													kind,
													sill:
														kind === 'window' && !opening.sill
															? '0.8'
															: opening.sill
												})
											}
											aria-pressed={opening.kind === kind}
											className={toolToggleOption(opening.kind === kind)}
										>
											{kind === 'window' ? 'Окно' : 'Дверь'}
										</button>
									))}
								</div>
								<SmallField
									label='ширина'
									value={opening.width}
									onChange={width => updateOpening(index, { width })}
								/>
								<SmallField
									label='высота'
									value={opening.height}
									onChange={value => updateOpening(index, { height: value })}
								/>
								{opening.kind === 'window' && (
									<SmallField
										label='от пола'
										value={opening.sill}
										onChange={sill => updateOpening(index, { sill })}
									/>
								)}
								<SmallField
									label='штук'
									value={opening.count}
									onChange={count => updateOpening(index, { count })}
									className='w-16'
								/>
								<Button
									size='icon'
									variant='ghost'
									onClick={() =>
										setOpenings(current =>
											current.filter((_, i) => i !== index)
										)
									}
									title='Убрать проём'
									aria-label='Убрать проём'
									className={`${toolIconButton} mb-0.5`}
								>
									<X className='h-4 w-4' />
								</Button>
							</div>
						))}
						{openings.length < 12 && (
							<Button
								variant='ghost'
								onClick={() => setOpenings(current => [...current, WINDOW])}
								className='cursor-pointer gap-2 px-2 text-sm'
							>
								<Plus className='h-4 w-4' />
								Добавить окно или дверь
							</Button>
						)}
					</div>
				</div>

				<div aria-live='polite'>
					{result === 'units' ? (
						<p className='px-5 py-16 text-center text-sm text-muted-foreground sm:px-6'>
							Размеры рулона вводятся в метрах: например, 0,53 и 10,05
						</p>
					) : result === 'strip-too-long' ? (
						<p className='px-5 py-16 text-center text-sm text-muted-foreground sm:px-6'>
							Полоса с запасом длиннее рулона: проверьте высоту стен и длину
							рулона
						</p>
					) : result === 'rapport-too-long' ? (
						<p className='px-5 py-16 text-center text-sm text-muted-foreground sm:px-6'>
							Раппорт вводится в сантиметрах: например, 64
						</p>
					) : result ? (
						<>
							<div className='grid grid-cols-2 gap-6 px-5 py-8 text-center sm:grid-cols-4 sm:px-6'>
								<Stat
									value={String(result.rolls)}
									label={pluralizeRu(result.rolls, [
										'рулон',
										'рулона',
										'рулонов'
									])}
								/>
								<Stat
									value={String(result.fullStrips)}
									label={`${pluralizeRu(result.fullStrips, ['полоса', 'полосы', 'полос'])} во всю высоту`}
								/>
								<Stat
									value={String(result.stripsPerRoll)}
									label={`${pluralizeRu(result.stripsPerRoll, ['полоса', 'полосы', 'полос'])} из рулона`}
								/>
								<Stat
									value={fmt(result.wallArea)}
									label='м² стен без проёмов'
								/>
							</div>
							<p className='border-t px-5 py-4 text-center text-sm text-muted-foreground sm:px-6'>
								{match !== 'none' && toNonNegative(rapport) > 0
									? `С подгонкой рисунка на полосу уходит до ${fmt(result.stripConsumption)} м рулона. `
									: ''}
								{result.shortPieces > 0
									? `Над и под проёмами ${result.shortPieces} ${pluralizeRu(result.shortPieces, ['кусок', 'куска', 'кусков'])}, они режутся из остатков. `
									: ''}
								{result.rollsWithoutOpenings > result.rolls
									? `Без вычета проёмов вышло бы ${result.rollsWithoutOpenings}. `
									: ''}
								Купите {fmt(result.boughtArea)} м² обоев из одной партии.
							</p>
						</>
					) : (
						<p className='px-5 py-16 text-center text-sm text-muted-foreground sm:px-6'>
							Заполните размеры комнаты и рулона
						</p>
					)}
				</div>

				<div className={toolFooterBar}>
					<div className='flex flex-wrap gap-1.5'>
						{MATCHES.map(option => (
							<button
								key={option.value}
								type='button'
								onClick={() => setMatch(option.value)}
								aria-pressed={match === option.value}
								title={option.hint}
								className={toolPill(match === option.value)}
							>
								{option.label}
							</button>
						))}
					</div>
					<span className='text-sm text-muted-foreground'>{matchHint}.</span>
				</div>
			</Card>

			<WallpaperCalculatorSeo />
		</WidgetSEOWrapper>
	)
}
