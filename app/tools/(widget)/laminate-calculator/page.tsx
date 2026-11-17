'use client'

import { useMemo, useState } from 'react'
import { Card } from '@/components/ui/card'
import { toolBar, toolFooterBar, toolPill } from '@/lib/ui/tool-pill'
import { WidgetSEOWrapper } from '@/components/seo/WidgetSEOWrapper'
import { getWidgetById } from '@/lib/constants/widgets'
import { calculateLaminate, type LaminateOffset } from '@/lib/laminate'
import { pluralizeRu } from '@/lib/utils/pluralize'
import { HairlineFigure } from '@/components/tools/HairlineFigure'
import { laminateFigure } from '@/lib/hairline/figures/laminate'
import { figureDim, useFigureFocus } from '@/lib/hairline/use-figure-focus'
import { LaminateCalculatorSeo } from './LaminateCalculatorSeo'

const OFFSETS: { value: LaminateOffset; label: string; hint: string }[] = [
	{
		value: 'free',
		label: 'Свободное',
		hint: 'Ряд начинается обрезком прошлого ряда: меньше всего отходов'
	},
	{
		value: 'half',
		label: '1/2',
		hint: 'Стыки через полдоски, «кирпичиком»'
	},
	{
		value: 'third',
		label: '1/3',
		hint: 'Стыки сдвинуты на треть доски, лесенкой'
	}
]

/** Фигуры раскладки на каждый вариант смещения: смена варианта пересобирает схему. */
const FIGURES = {
	free: laminateFigure('free'),
	half: laminateFigure('half'),
	third: laminateFigure('third')
}

const inputClass =
	'w-full rounded-md border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-ring'

function toNumber(value: string): number | null {
	const parsed = parseFloat(value.replace(',', '.'))
	return Number.isFinite(parsed) && parsed > 0 ? parsed : null
}

function Field({
	label,
	value,
	onChange,
	id,
	onFocus,
	onBlur
}: {
	label: string
	value: string
	onChange: (value: string) => void
	id?: string
	onFocus?: () => void
	onBlur?: () => void
}) {
	return (
		<label className='block'>
			<span className='mb-1.5 block text-sm text-muted-foreground'>
				{label}
			</span>
			<input
				id={id}
				type='text'
				inputMode='decimal'
				value={value}
				onChange={event => onChange(event.target.value)}
				onFocus={onFocus}
				onBlur={onBlur}
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

export default function LaminateCalculatorPage() {
	const widget = getWidgetById('laminate-calculator')!

	const [roomLength, setRoomLength] = useState('4')
	const [roomWidth, setRoomWidth] = useState('3')
	const [boardLength, setBoardLength] = useState('1380')
	const [boardWidth, setBoardWidth] = useState('193')
	const [perPack, setPerPack] = useState('8')
	const [doorWidth, setDoorWidth] = useState('0.8')
	const [offset, setOffset] = useState<LaminateOffset>('free')
	const figure = useFigureFocus('laminate')

	const figureDims = useMemo(
		() => [
			figureDim('roomLength', toNumber(roomLength)),
			figureDim('roomWidth', toNumber(roomWidth)),
			figureDim('boardLength', toNumber(boardLength)),
			figureDim('boardWidth', toNumber(boardWidth))
		],
		[roomLength, roomWidth, boardLength, boardWidth]
	)

	const result = useMemo(() => {
		const rl = toNumber(roomLength)
		const rw = toNumber(roomWidth)
		const bl = toNumber(boardLength)
		const bw = toNumber(boardWidth)
		const pack = toNumber(perPack)
		const door = parseFloat(doorWidth.replace(',', '.'))
		if (!rl || !rw || !bl || !bw || !pack) return null
		// доска в миллиметрах: 1,38 вместо 1380 почти наверняка метры
		if (bl < 100 || bw < 50) return 'units' as const
		return calculateLaminate({
			roomLength: rl,
			roomWidth: rw,
			boardLength: bl,
			boardWidth: bw,
			boardsPerPack: Math.round(pack),
			offset,
			doorWidth: Number.isFinite(door) && door > 0 ? door : 0
		})
	}, [roomLength, roomWidth, boardLength, boardWidth, perPack, doorWidth, offset])

	const offsetHint = OFFSETS.find(o => o.value === offset)!.hint

	return (
		<WidgetSEOWrapper widget={widget}>
			<Card className='overflow-hidden p-0'>
				<div className={toolBar}>
					<span className='text-sm text-muted-foreground'>Смещение рядов</span>
					<div className='flex flex-wrap gap-1.5'>
						{OFFSETS.map(option => (
							<button
								key={option.value}
								type='button'
								onClick={() => setOffset(option.value)}
								aria-pressed={offset === option.value}
								title={option.hint}
								className={toolPill(offset === option.value)}
							>
								{option.label}
							</button>
						))}
					</div>
				</div>

				<div className='grid gap-6 border-b px-5 py-6 sm:px-6 md:grid-cols-2 md:items-center'>
					<HairlineFigure
						id={`laminate-${offset}`}
						figure={FIGURES[offset]}
						dims={figureDims}
						focusKey={figure.focusKey}
						onPick={figure.onPick}
						label='Схема раскладки ламината по рядам'
						className='mx-auto w-full max-w-sm'
					/>
					<div className='grid gap-4 sm:grid-cols-2'>
						<Field
							label='Длина комнаты, м'
							value={roomLength}
							onChange={setRoomLength}
							{...figure.bind('roomLength')}
						/>
						<Field
							label='Ширина комнаты, м'
							value={roomWidth}
							onChange={setRoomWidth}
							{...figure.bind('roomWidth')}
						/>
						<Field
							label='Длина доски, мм'
							value={boardLength}
							onChange={setBoardLength}
							{...figure.bind('boardLength')}
						/>
						<Field
							label='Ширина доски, мм'
							value={boardWidth}
							onChange={setBoardWidth}
							{...figure.bind('boardWidth')}
						/>
						<Field
							label='Досок в упаковке, шт'
							value={perPack}
							onChange={setPerPack}
						/>
						<Field
							label='Ширина двери, м'
							value={doorWidth}
							onChange={setDoorWidth}
						/>
					</div>
				</div>

				{result === 'units' ? (
					<p className='px-5 py-16 text-center text-sm text-muted-foreground sm:px-6'>
						Размер доски вводится в миллиметрах: например, 1380 и 193
					</p>
				) : result ? (
					<>
						<div className='grid grid-cols-2 gap-6 px-5 py-8 text-center sm:grid-cols-4 sm:px-6'>
							<Stat
								value={String(result.packs)}
								label={`${pluralizeRu(result.packs, ['упаковка', 'упаковки', 'упаковок'])} по ${fmt(result.packArea, 3)} м²`}
							/>
							<Stat
								value={String(result.boards)}
								label={`${pluralizeRu(result.boards, ['доска', 'доски', 'досок'])} уйдёт`}
							/>
							<Stat value={fmt(result.floorArea)} label='м² пола' />
							<Stat
								value={String(result.plinthPieces)}
								label={`${pluralizeRu(result.plinthPieces, ['планка', 'планки', 'планок'])} плинтуса по 2,5 м`}
							/>
						</div>
						<p className='border-t px-5 py-4 text-center text-sm text-muted-foreground sm:px-6'>
							Купите {fmt(result.boughtArea)} м², в обрезки уйдёт около{' '}
							{fmt(result.wastePercent, 1)}%
							{result.spareBoards > 0 &&
								`, в последней упаковке останется ${result.spareBoards} ${pluralizeRu(result.spareBoards, ['доска', 'доски', 'досок'])}`}
							. Подложки нужно {result.underlayArea} м², плинтуса{' '}
							{fmt(result.plinthLength, 1)} м по периметру без двери.
						</p>
					</>
				) : (
					<p className='px-5 py-16 text-center text-sm text-muted-foreground sm:px-6'>
						Заполните размеры комнаты и доски
					</p>
				)}

				<div className={toolFooterBar}>
					<span className='text-sm text-muted-foreground'>
						{offsetHint}. Доски раскладываются по рядам вдоль длины комнаты с
						зазором 10 мм у стен, куски короче 30 см не используются.
					</span>
				</div>
			</Card>

			<LaminateCalculatorSeo />
		</WidgetSEOWrapper>
	)
}
