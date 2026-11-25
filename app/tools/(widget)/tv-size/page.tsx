'use client'

import { useCallback, useMemo, useState } from 'react'
import { Card } from '@/components/ui/card'
import { toolBar, toolFooterBar, toolPill } from '@/lib/ui/tool-pill'
import { WidgetSEOWrapper } from '@/components/seo/WidgetSEOWrapper'
import { getWidgetById } from '@/lib/constants/widgets'
import {
	ASPECT_RATIOS,
	COMMON_DIAGONALS,
	diagonalForWidth,
	getRatio,
	inchesWord,
	screenSize,
	viewingRangeM
} from '@/lib/utils/screen-size'
import { TvSizeSeo } from './TvSizeSeo'
import {
	HairlineFigure,
	type FigureDim
} from '@/components/tools/HairlineFigure'
import { TV_FIGURE } from '@/lib/hairline/figures/tv'

const cm = (v: number) => String(Math.round(v * 10) / 10).replace('.', ',')

/** Запас на рамку корпуса: по 2 см с каждой стороны, с верхом диапазона. */
const BEZEL_ALLOWANCE_CM = 4

/** «55», «55,5», «55.5» — да; «55abc», «пять» — нет, а не тихо 55. */
function parseNumber(raw: string): number {
	const t = raw.trim().replace(',', '.')
	return /^\d+(\.\d+)?$/.test(t) ? parseFloat(t) : NaN
}

export default function TvSizePage() {
	const widget = getWidgetById('tv-size')!

	const [diagonal, setDiagonal] = useState('55')
	const [ratioId, setRatioId] = useState('16-9')
	const [diagonalFocused, setDiagonalFocused] = useState(false)
	const [niche, setNiche] = useState('')

	const ratio = getRatio(ratioId)!
	const diagonalValue = parseNumber(diagonal)
	const size = useMemo(
		() => screenSize(diagonalValue, ratio),
		[diagonalValue, ratio]
	)

	// Обратная задача: какая диагональ встанет в нишу. Из ширины ниши
	// вычитаем запас на рамку, иначе расчётный экран встанет, а корпус нет.
	const nicheValue = parseNumber(niche)
	const nicheFit = useMemo(() => {
		const max = diagonalForWidth(nicheValue - BEZEL_ALLOWANCE_CM, ratio)
		if (max === null) return null
		const common = [...COMMON_DIAGONALS].reverse().find(d => d <= max) ?? null
		return { max, common }
	}, [nicheValue, ratio])

	// Схема получает размеры в сантиметрах, подписи она собирает сама.
	const figureDims = useMemo<FigureDim[]>(
		() =>
			size
				? [
						{ key: 'w', letter: '', meters: size.widthCm, text: '' },
						{ key: 'h', letter: '', meters: size.heightCm, text: '' },
						{ key: 'diag', letter: '', meters: size.diagonalCm, text: '' },
						{ key: 'in', letter: '', meters: size.diagonalInches, text: '' }
					]
				: [],
		[size]
	)

	const range = (is4k: boolean) => {
		if (!size) return ''
		const r = viewingRangeM(size.diagonalInches, is4k)
		return `${cm(r.min)}–${cm(r.max)}`
	}

	// Любой размер на схеме зависит от одной диагонали: клик ставит курсор в неё.
	const focusDiagonal = useCallback(() => {
		document.getElementById('tv-diagonal')?.focus()
	}, [])

	return (
		<WidgetSEOWrapper widget={widget}>
			<Card className='overflow-hidden p-0'>
				<div className={toolBar}>
					<label className='flex items-center gap-2 text-sm text-muted-foreground'>
						Диагональ
						<input
							id='tv-diagonal'
							type='text'
							inputMode='decimal'
							value={diagonal}
							onChange={event => setDiagonal(event.target.value)}
							onFocus={() => setDiagonalFocused(true)}
							onBlur={() => setDiagonalFocused(false)}
							aria-label='Диагональ в дюймах'
							className='w-20 rounded-md border bg-background px-3 py-1.5 text-center font-mono focus:outline-none focus-visible:ring-2 focus-visible:ring-ring'
						/>
						{inchesWord(Number.isFinite(diagonalValue) ? diagonalValue : 5)}
					</label>

					<div className='flex flex-wrap items-center gap-1.5 sm:ml-auto'>
						{ASPECT_RATIOS.map(r => (
							<button
								key={r.id}
								type='button'
								onClick={() => setRatioId(r.id)}
								aria-pressed={ratioId === r.id}
								title={r.hint}
								className={toolPill(ratioId === r.id)}
							>
								{r.name}
							</button>
						))}
					</div>
				</div>

				{size ? (
					<>
						{/* Схема экрана в пропорции: по числам «121,8 на 68,5» нишу
						    не представить, а по телевизору с выносками видно сразу. */}
						<div className='flex flex-col items-center gap-4 px-5 py-8 sm:px-6'>
							<HairlineFigure
								id='tv-size'
								figure={TV_FIGURE}
								dims={figureDims}
								focusKey={diagonalFocused ? 'diag' : null}
								onPick={focusDiagonal}
								label={`Телевизор ${cm(size.widthCm)} на ${cm(size.heightCm)} см`}
								className='w-full max-w-lg'
							/>

							<p className='text-center text-base'>
								{cm(size.diagonalInches)} {inchesWord(size.diagonalInches)} —{' '}
								<span className='font-mono font-medium'>
									{cm(size.diagonalCm)} см
								</span>{' '}
								<span className='text-muted-foreground'>по диагонали</span>
							</p>

							<div className='flex flex-wrap justify-center gap-x-8 gap-y-2 text-sm'>
								<span className='text-muted-foreground'>
									Ширина{' '}
									<span className='font-mono text-foreground'>
										{cm(size.widthCm)} см
									</span>
								</span>
								<span className='text-muted-foreground'>
									Высота{' '}
									<span className='font-mono text-foreground'>
										{cm(size.heightCm)} см
									</span>
								</span>
								<span className='text-muted-foreground'>
									Диагональ{' '}
									<span className='font-mono text-foreground'>
										{cm(size.diagonalCm)} см
									</span>
								</span>
								<span className='text-muted-foreground'>
									Площадь{' '}
									<span className='font-mono text-foreground'>
										{String(Math.round(size.areaCm2 / 100) / 100).replace(
											'.',
											','
										)}{' '}
										м²
									</span>
								</span>
							</div>

							<p className='text-center text-sm text-muted-foreground'>
								Смотреть комфортно с расстояния {range(true)} м для 4K и{' '}
								{range(false)} м для Full HD
							</p>
						</div>

						{/* Обратный вопрос «что встанет в нишу» — ради него инструмент
						    чаще всего и открывают, а таблицу перебирать неудобно. */}
						<div className='border-t px-5 py-5 sm:px-6'>
							<label className='flex flex-wrap items-center gap-2 text-sm text-muted-foreground'>
								Ниша или тумба шириной
								<input
									type='text'
									inputMode='decimal'
									value={niche}
									onChange={event => setNiche(event.target.value)}
									placeholder='120'
									aria-label='Ширина ниши в сантиметрах'
									className='w-20 rounded-md border bg-background px-3 py-1.5 text-center font-mono focus:outline-none focus-visible:ring-2 focus-visible:ring-ring'
								/>
								см
							</label>
							{niche.trim() === '' ? (
								<p className='mt-2 text-sm text-muted-foreground'>
									Введите ширину, и посчитаем, какая диагональ {ratio.name}{' '}
									в неё встанет
								</p>
							) : !Number.isFinite(nicheValue) ? (
								<p className='mt-2 text-sm text-destructive'>
									Нужно число в сантиметрах, например 120
								</p>
							) : nicheFit ? (
								<p className='mt-2 text-sm'>
									Встанет экран {ratio.name} до{' '}
									<span className='font-mono font-medium'>
										{cm(nicheFit.max)}″
									</span>
									{nicheFit.common !== null && (
										<>
											{' '}
											— из ходовых это{' '}
											<button
												type='button'
												onClick={() => setDiagonal(String(nicheFit.common))}
												className='cursor-pointer font-mono font-medium text-primary hover:underline'
											>
												{nicheFit.common}″
											</button>
										</>
									)}
									.{' '}
									<span className='text-muted-foreground'>
										С запасом {BEZEL_ALLOWANCE_CM} см на рамку корпуса
									</span>
								</p>
							) : (
								<p className='mt-2 text-sm text-muted-foreground'>
									В такую ширину телевизор не встанет: нужно больше{' '}
									{BEZEL_ALLOWANCE_CM} см с учётом рамки
								</p>
							)}
						</div>

						{/* Справочная таблица ходовых диагоналей — половина спроса
						    именно «32 дюйма в сантиметрах», а не свой размер. */}
						<div className='overflow-x-auto border-t px-5 py-5 sm:px-6'>
							<table className='w-full border-collapse text-sm'>
								<caption className='sr-only'>
									Размеры телевизоров по диагонали
								</caption>
								<thead>
									<tr className='border-b text-left text-muted-foreground'>
										<th scope='col' className='py-2 pr-4 font-medium'>
											Дюймы
										</th>
										<th scope='col' className='py-2 pr-4 font-medium'>
											Ширина, см
										</th>
										<th scope='col' className='py-2 pr-4 font-medium'>
											Высота, см
										</th>
										<th scope='col' className='py-2 font-medium'>
											Диагональ, см
										</th>
									</tr>
								</thead>
								<tbody className='font-mono tabular-nums'>
									{COMMON_DIAGONALS.map(d => {
										const s = screenSize(d, ratio)!
										const active = Math.abs(d - size.diagonalInches) < 0.01
										return (
											<tr
												key={d}
												className={`border-b last:border-0 ${active ? 'bg-primary/5' : ''}`}
											>
												<th
													scope='row'
													className='py-1.5 pr-4 text-left font-normal'
												>
													<button
														type='button'
														onClick={() => setDiagonal(String(d))}
														className='cursor-pointer hover:underline'
													>
														{d}"
													</button>
												</th>
												<td className='py-1.5 pr-4'>{cm(s.widthCm)}</td>
												<td className='py-1.5 pr-4'>{cm(s.heightCm)}</td>
												<td className='py-1.5'>{cm(s.diagonalCm)}</td>
											</tr>
										)
									})}
								</tbody>
							</table>
						</div>
					</>
				) : (
					<p
						className={`px-5 py-16 text-center text-sm sm:px-6 ${diagonal.trim() === '' ? 'text-muted-foreground' : 'text-destructive'}`}
					>
						{diagonal.trim() === ''
							? 'Введите диагональ в дюймах, например 55'
							: 'Диагональ должна быть числом больше нуля, например 55 или 49,5'}
					</p>
				)}

				<div className={toolFooterBar}>
					<span className='text-sm text-muted-foreground'>
						Размеры даны по экрану. Корпус шире и выше на рамку — обычно от
						половины до двух сантиметров с каждой стороны, у моделей с
						подставкой добавьте её ширину
					</span>
				</div>
			</Card>

			<TvSizeSeo />
		</WidgetSEOWrapper>
	)
}
