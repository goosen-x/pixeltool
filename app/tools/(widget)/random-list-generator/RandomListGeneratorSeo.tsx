import Link from 'next/link'

export function RandomListGeneratorSeo() {
	return (
		<div className='mx-auto mt-16 max-w-3xl space-y-12'>
			<section>
				<h2 className='text-2xl font-bold tracking-tight'>
					Чем это отличается от жеребьёвки
				</h2>
				<p className='mt-3 text-muted-foreground'>
					Жеребьёвка вытягивает элементы по одному, и это удобно, когда процесс
					выбора должен идти на глазах у всех. Здесь же список перемешивается
					целиком за один клик. На выходе тот же список, но в новом
					непредсказуемом порядке. Подходит, когда важен только результат, а не
					сам процесс.
				</p>

				<p className='mt-4 text-muted-foreground'>
					Сколько вообще существует вариантов порядка. Это факториал числа
					элементов, и растёт он пугающе быстро:
				</p>
				<div className='mt-4 overflow-x-auto'>
					<table className='w-full text-left text-sm'>
						<thead>
							<tr className='border-b text-muted-foreground'>
								<th className='py-2 pr-4 font-medium'>Элементов</th>
								<th className='py-2 font-medium'>Возможных порядков</th>
							</tr>
						</thead>
						<tbody className='text-foreground'>
							<tr className='border-b'>
								<td className='py-2 pr-4 font-mono'>3</td>
								<td className='py-2 font-mono'>6</td>
							</tr>
							<tr className='border-b'>
								<td className='py-2 pr-4 font-mono'>5</td>
								<td className='py-2 font-mono'>120</td>
							</tr>
							<tr className='border-b'>
								<td className='py-2 pr-4 font-mono'>7</td>
								<td className='py-2 font-mono'>5 040</td>
							</tr>
							<tr className='border-b'>
								<td className='py-2 pr-4 font-mono'>10</td>
								<td className='py-2 font-mono'>3 628 800</td>
							</tr>
							<tr>
								<td className='py-2 pr-4 font-mono'>15</td>
								<td className='py-2 font-mono'>1 307 674 368 000</td>
							</tr>
						</tbody>
					</table>
				</div>
				<p className='mt-4 text-muted-foreground'>
					Уже на пятнадцати элементах вариантов больше триллиона, так что
					случайно получить один и тот же порядок дважды практически невозможно.
				</p>
			</section>

			<p className='text-muted-foreground'>
				Если нужен не весь список в новом порядке, а один случайный номер,
				возьмите{' '}
				<Link
					href='/tools/random-number-generator'
					className='cursor-pointer font-medium text-primary hover:underline'
				>
					генератор случайных чисел
				</Link>
				, а для деления списка участников на равные группы есть{' '}
				<Link
					href='/tools/team-randomizer'
					className='cursor-pointer font-medium text-primary hover:underline'
				>
					разделение на команды
				</Link>
				. Другие способы получить случайный результат (жребий, монетка, кубик,
				деление на команды) собраны в статье{' '}
				<Link
					href='/blog/randomayzer-zherebevka-online'
					className='cursor-pointer font-medium text-primary hover:underline'
				>
					Рандомайзер: команды, жребий, кубик и монетка онлайн
				</Link>
				.
			</p>
		</div>
	)
}
