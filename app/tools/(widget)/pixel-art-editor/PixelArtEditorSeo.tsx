import Link from 'next/link'

export function PixelArtEditorSeo() {
	return (
		<div className='mx-auto mt-16 max-w-3xl space-y-12'>
			<section>
				<h2 className='text-2xl font-bold tracking-tight'>
					Рисовать с нуля или превратить фото: холст один и тот же
				</h2>
				<p className='mt-3 text-muted-foreground'>
					Загруженное фото не открывается в отдельном режиме. Оно квантуется в
					ту же сетку, что и ручное рисование, и дальше редактируется кистью как
					обычный рисунок. Фото сэмплируется по центру каждой ячейки, и для
					сетки 16×16 из фотографии остаются только крупные пятна света и тени,
					мелкий узор пропадает. Портреты, логотипы и предметы на контрастном
					фоне держат форму лучше, чем пейзажи и мелкий текст. Если нужен
					символьный, а не пиксельный результат, похожим образом фото превращает
					в рисунок{' '}
					<Link
						href='/tools/ascii-art-generator'
						className='cursor-pointer font-medium text-primary hover:underline'
					>
						ASCII-генератор
					</Link>
					.
				</p>
			</section>

			<section>
				<h2 className='text-2xl font-bold tracking-tight'>
					Зачем ограничивать себя ретро-палитрой
				</h2>
				<p className='mt-3 text-muted-foreground'>
					Game Boy рисовал четырьмя оттенками зелёного, потому что экран
					физически не умел больше. NES и PICO-8 точно так же ограничены железом
					или движком. Инструмент воссоздаёт эти наборы. С палитрой Game Boy
					покрасить пиксель в случайный цвет не выйдет, только в один из
					четырёх. Это не баг, а способ быстро получить узнаваемую
					ретро-эстетику вместо случайного набора цветов, который никогда не
					читается как «пиксель-арт». Чтобы подобрать точный HEX-код цвета из
					своего фото перед рисованием, воспользуйтесь{' '}
					<Link
						href='/tools/photo-color-picker'
						className='cursor-pointer font-medium text-primary hover:underline'
					>
						пипеткой цвета по фото
					</Link>
					.
				</p>
				<div className='mt-4 overflow-x-auto'>
					<table className='w-full border-collapse text-sm'>
						<thead>
							<tr className='border-b text-left'>
								<th className='py-2 pr-4 font-semibold'>Палитра</th>
								<th className='py-2 pr-4 font-semibold'>Цветов</th>
								<th className='py-2 font-semibold'>Примеры HEX</th>
							</tr>
						</thead>
						<tbody>
							<tr className='border-b last:border-0'>
								<td className='py-2 pr-4 align-top'>Game Boy</td>
								<td className='py-2 pr-4 align-top text-muted-foreground'>4</td>
								<td className='py-2 align-top font-mono text-xs text-muted-foreground'>
									#0f380f, #306230, #8bac0f, #9bbc0f
								</td>
							</tr>
							<tr className='border-b last:border-0'>
								<td className='py-2 pr-4 align-top'>NES</td>
								<td className='py-2 pr-4 align-top text-muted-foreground'>
									37
								</td>
								<td className='py-2 align-top font-mono text-xs text-muted-foreground'>
									#000000, #fcfcfc, #0078f8, #f83800, #00e436…
								</td>
							</tr>
							<tr className='border-b last:border-0'>
								<td className='py-2 pr-4 align-top'>PICO-8</td>
								<td className='py-2 pr-4 align-top text-muted-foreground'>
									16
								</td>
								<td className='py-2 align-top font-mono text-xs text-muted-foreground'>
									#000000, #1d2b53, #ff004d, #29adff, #00e436…
								</td>
							</tr>
						</tbody>
					</table>
				</div>
			</section>
		</div>
	)
}
