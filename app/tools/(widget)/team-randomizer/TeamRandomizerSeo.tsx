import Link from 'next/link'

export function TeamRandomizerSeo() {
	return (
		<div className='mx-auto mt-16 max-w-3xl space-y-12'>
			<section>
				<h2 className='text-2xl font-bold tracking-tight'>
					Когда команды не делятся поровну
				</h2>
				<p className='mt-3 text-muted-foreground'>
					Если число участников не делится на число команд без остатка, лишние
					люди распределяются по одному в разные команды. Разница между самой
					большой и самой маленькой командой никогда не превышает одного
					человека. Например, 11 человек на 3 команды дадут 4+4+3, а не 5+3+3.
				</p>

				<p className='mt-4 text-muted-foreground'>
					Участники раздаются по кругу, поэтому лишние достаются первым
					командам, а разница между самой большой и самой маленькой никогда не
					превышает одного человека:
				</p>
				<div className='mt-4 overflow-x-auto'>
					<table className='w-full text-left text-sm'>
						<thead>
							<tr className='border-b text-muted-foreground'>
								<th className='py-2 pr-4 font-medium'>Участников</th>
								<th className='py-2 pr-4 font-medium'>Команд</th>
								<th className='py-2 font-medium'>Получится</th>
							</tr>
						</thead>
						<tbody className='text-foreground'>
							<tr className='border-b'>
								<td className='py-2 pr-4 font-mono'>7</td>
								<td className='py-2 pr-4 font-mono'>2</td>
								<td className='py-2 font-mono'>4 и 3</td>
							</tr>
							<tr className='border-b'>
								<td className='py-2 pr-4 font-mono'>10</td>
								<td className='py-2 pr-4 font-mono'>3</td>
								<td className='py-2 font-mono'>4, 3 и 3</td>
							</tr>
							<tr className='border-b'>
								<td className='py-2 pr-4 font-mono'>11</td>
								<td className='py-2 pr-4 font-mono'>4</td>
								<td className='py-2 font-mono'>3, 3, 3 и 2</td>
							</tr>
							<tr>
								<td className='py-2 pr-4 font-mono'>22</td>
								<td className='py-2 pr-4 font-mono'>5</td>
								<td className='py-2 font-mono'>5, 5, 4, 4 и 4</td>
							</tr>
						</tbody>
					</table>
				</div>
			</section>

			<p className='text-muted-foreground'>
				Если нужно не поделить на команды, а вытянуть один номер победителя,
				подойдёт{' '}
				<Link
					href='/tools/random-number-generator'
					className='cursor-pointer font-medium text-primary hover:underline'
				>
					генератор случайных чисел
				</Link>
				, а для очерёдности по именам без деления на группы есть{' '}
				<Link
					href='/tools/draw-lots'
					className='cursor-pointer font-medium text-primary hover:underline'
				>
					жеребьёвка
				</Link>
				. Про монетку и остальные способы получить случайный результат в статье{' '}
				<Link
					href='/blog/randomayzer-zherebevka-online'
					className='cursor-pointer font-medium text-primary hover:underline'
				>
					Рандомайзер: команды, жребий, кубик и монетка онлайн
				</Link>{' '}
				разобрано, какой инструмент для какой задачи.
			</p>
		</div>
	)
}
