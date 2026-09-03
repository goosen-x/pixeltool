'use client'

import { useMemo, useState } from 'react'
import { Card } from '@/components/ui/card'
import { toolBar, toolFooterBar, toolPill } from '@/lib/ui/tool-pill'
import { WidgetSEOWrapper } from '@/components/seo/WidgetSEOWrapper'
import { getWidgetById } from '@/lib/constants/widgets'
import { calculateTiles } from '@/lib/utils/tile-calculator'
import { TileCalculatorSeo } from './TileCalculatorSeo'
import { ToolScreenshot } from '@/components/tools/ToolScreenshot'

const WASTE_OPTIONS = [5, 10, 15, 20]

const inputClass =
	'w-full rounded-md border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-ring'

function toNumber(value: string): number | null {
	const parsed = parseFloat(value.replace(',', '.'))
	return Number.isFinite(parsed) && parsed > 0 ? parsed : null
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

export default function TileCalculatorPage() {
	const widget = getWidgetById('tile-calculator')!

	const [roomLength, setRoomLength] = useState('4')
	const [roomWidth, setRoomWidth] = useState('3')
	const [tileLength, setTileLength] = useState('60')
	const [tileWidth, setTileWidth] = useState('60')
	const [tileThickness, setTileThickness] = useState('9')
	const [jointWidth, setJointWidth] = useState('2')
	const [waste, setWaste] = useState(10)

	const result = useMemo(() => {
		const rl = toNumber(roomLength)
		const rw = toNumber(roomWidth)
		const tl = toNumber(tileLength)
		const tw = toNumber(tileWidth)
		const th = toNumber(tileThickness)
		const jw = toNumber(jointWidth)
		if (!rl || !rw || !tl || !tw || !th || jw === null) return null

		return calculateTiles({
			roomLength: rl,
			roomWidth: rw,
			tileLength: tl,
			tileWidth: tw,
			tileThicknessMm: th,
			jointWidthMm: jw,
			wastePercent: waste
		})
	}, [
		roomLength,
		roomWidth,
		tileLength,
		tileWidth,
		tileThickness,
		jointWidth,
		waste
	])

	return (
		<WidgetSEOWrapper widget={widget}>
			<Card className='overflow-hidden p-0'>
				<div className={toolBar}>
					<span className='text-sm text-muted-foreground'>
						Запас на подрезку
					</span>
					<div className='flex flex-wrap gap-1.5'>
						{WASTE_OPTIONS.map(option => (
							<button
								key={option}
								type='button'
								onClick={() => setWaste(option)}
								aria-pressed={waste === option}
								className={toolPill(waste === option)}
							>
								{option}%
							</button>
						))}
					</div>
				</div>

				<div className='grid gap-4 border-b px-5 py-6 sm:grid-cols-2 sm:px-6'>
					<Field
						label='Длина помещения, м'
						value={roomLength}
						onChange={setRoomLength}
					/>
					<Field
						label='Ширина помещения, м'
						value={roomWidth}
						onChange={setRoomWidth}
					/>
				</div>

				<div className='grid gap-4 border-b px-5 py-6 sm:grid-cols-4 sm:px-6'>
					<Field
						label='Длина плитки, см'
						value={tileLength}
						onChange={setTileLength}
					/>
					<Field
						label='Ширина плитки, см'
						value={tileWidth}
						onChange={setTileWidth}
					/>
					<Field
						label='Толщина плитки, мм'
						value={tileThickness}
						onChange={setTileThickness}
					/>
					<Field
						label='Ширина шва, мм'
						value={jointWidth}
						onChange={setJointWidth}
					/>
				</div>

				{result ? (
					<div className='grid grid-cols-3 gap-4 px-5 py-8 text-center sm:px-6'>
						<div>
							<span className='block font-mono text-3xl font-bold text-foreground'>
								{result.areaM2.toLocaleString('ru-RU', {
									maximumFractionDigits: 2
								})}
							</span>
							<span className='mt-1 block text-sm text-muted-foreground'>
								м² площади
							</span>
						</div>
						<div>
							<span className='block font-mono text-3xl font-bold text-foreground'>
								{result.tilesWithWaste}
							</span>
							<span className='mt-1 block text-sm text-muted-foreground'>
								плиток с запасом
							</span>
						</div>
						<div>
							<span className='block font-mono text-3xl font-bold text-foreground'>
								{result.groutKgTotal.toLocaleString('ru-RU', {
									maximumFractionDigits: 1
								})}
							</span>
							<span className='mt-1 block text-sm text-muted-foreground'>
								кг затирки
							</span>
						</div>
					</div>
				) : (
					<p className='px-5 py-16 text-center text-sm text-muted-foreground sm:px-6'>
						Заполните все размеры
					</p>
				)}

				<div className={toolFooterBar}>
					<span className='text-sm text-muted-foreground'>
						{result
							? `Без запаса — ${Math.ceil(result.tilesExact)} плиток. Затирка — по формуле производителей, реальный расход зависит от марки смеси`
							: 'Расход затирки считается по формуле (L+W)/(L×W) × толщина × шов × плотность'}
					</span>
				</div>
			</Card>

			<ToolScreenshot slug='tile-calculator' />
			<TileCalculatorSeo />
		</WidgetSEOWrapper>
	)
}
