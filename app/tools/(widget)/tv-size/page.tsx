'use client'

import { useMemo, useState } from 'react'
import { Card } from '@/components/ui/card'
import { toolBar, toolFooterBar, toolPill } from '@/lib/ui/tool-pill'
import { WidgetSEOWrapper } from '@/components/seo/WidgetSEOWrapper'
import { getWidgetById } from '@/lib/constants/widgets'
import {
	ASPECT_RATIOS,
	COMMON_DIAGONALS,
	getRatio,
	screenSize,
	viewingDistanceM
} from '@/lib/utils/screen-size'
import { TvSizeSeo } from './TvSizeSeo'

const cm = (v: number) => String(Math.round(v * 10) / 10).replace('.', ',')

export default function TvSizePage() {
	const widget = getWidgetById('tv-size')!

	const [diagonal, setDiagonal] = useState('55')
	const [ratioId, setRatioId] = useState('16-9')

	const ratio = getRatio(ratioId)!
	const size = useMemo(
		() => screenSize(parseFloat(diagonal.replace(',', '.')), ratio),
		[diagonal, ratio]
	)

	return (
		<WidgetSEOWrapper widget={widget}>
			<Card className='overflow-hidden p-0'>
				<div className={toolBar}>
					<label className='flex items-center gap-2 text-sm text-muted-foreground'>
						Диагональ
						<input
							type='text'
							inputMode='decimal'
							value={diagonal}
							onChange={event => setDiagonal(event.target.value)}
							aria-label='Диагональ в дюймах'
							className='w-20 rounded-md border bg-background px-3 py-1.5 text-center font-mono focus:outline-none focus-visible:ring-2 focus-visible:ring-ring'
						/>
						дюймов
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
						{/* Схема экрана в пропорции — по числам «121,8 на 68,5» нишу
						    не представить, а по прямоугольнику видно сразу. */}
						<div className='flex flex-col items-center gap-4 px-5 py-8 sm:px-6'>
							<div
								className='relative flex w-full max-w-md items-center justify-center rounded-lg border-2 border-foreground/70 bg-muted/30'
								style={{ aspectRatio: `${ratio.w} / ${ratio.h}` }}
							>
								<span className='text-center'>
									<span className='block font-mono text-3xl font-bold tabular-nums'>
										{cm(size.widthCm)} × {cm(size.heightCm)}
									</span>
									<span className='mt-1 block text-sm text-muted-foreground'>
										сантиметров
									</span>
								</span>
							</div>

							<p className='text-center text-base'>
								{diagonal} {'\u0434\u044e\u0439\u043c\u043e\u0432'} —{' '}
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
										{Math.round(size.areaCm2 / 100) / 100} м²
									</span>
								</span>
							</div>

							<p className='text-center text-sm text-muted-foreground'>
								Смотреть комфортно примерно с{' '}
								{String(
									Math.round(viewingDistanceM(size.diagonalInches, true) * 10) /
										10
								).replace('.', ',')}{' '}
								м для 4K и{' '}
								{String(
									Math.round(
										viewingDistanceM(size.diagonalInches, false) * 10
									) / 10
								).replace('.', ',')}{' '}
								м для Full HD
							</p>
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
											Ширина
										</th>
										<th scope='col' className='py-2 pr-4 font-medium'>
											Высота
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
					<p className='px-5 py-16 text-center text-sm text-muted-foreground sm:px-6'>
						Введите диагональ в дюймах
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
