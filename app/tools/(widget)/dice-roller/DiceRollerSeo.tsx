import Link from 'next/link'

export function DiceRollerSeo() {
	return (
		<div className='mx-auto mt-16 max-w-3xl space-y-12'>
			<section>
				<h2 className='text-2xl font-bold tracking-tight'>
					Кости для настольных игр: сколько бросать сразу
				</h2>
				<p className='mt-3 text-muted-foreground'>
					Бросить можно сразу несколько костей. Это удобно, если физических
					кубиков под рукой нет или не хватает на всех игроков за столом. Каждая
					кость считается независимо, поэтому сумма нескольких костей
					распределена неравномерно. Два кубика чаще дают 7, чем 2 или 12, и это
					не баг, а обычная статистика броска двух костей.
				</p>
				<div className='mt-4 overflow-x-auto'>
					<table className='w-full border-collapse text-sm'>
						<thead>
							<tr className='border-b text-left'>
								<th className='py-2 pr-4 font-semibold'>Сумма</th>
								<th className='py-2 font-semibold'>Вероятность</th>
							</tr>
						</thead>
						<tbody>
							{[
								[2, 1],
								[3, 2],
								[4, 3],
								[5, 4],
								[6, 5],
								[7, 6],
								[8, 5],
								[9, 4],
								[10, 3],
								[11, 2],
								[12, 1]
							].map(([sum, ways]) => (
								<tr key={sum} className='border-b last:border-0'>
									<td className='py-2 pr-4 align-top'>{sum}</td>
									<td className='py-2 align-top text-muted-foreground'>
										{ways}/36
									</td>
								</tr>
							))}
						</tbody>
					</table>
					<p className='mt-2 text-xs text-muted-foreground'>
						Комбинаций выпадения двух костей всего 36 (6×6), и у каждой суммы
						своё число сочетаний: 7 набирается шестью способами (1+6, 2+5, 3+4 и
						их зеркала), а 2 и 12 — только одним.
					</p>
				</div>
			</section>

			<p className='text-muted-foreground'>
				Если нужно выбрать всего из двух вариантов, проще подбросить{' '}
				<Link
					href='/tools/coin-flip'
					className='cursor-pointer font-medium text-primary hover:underline'
				>
					монетку
				</Link>
				, а для числа вне диапазона обычной кости подойдёт{' '}
				<Link
					href='/tools/random-number-generator'
					className='cursor-pointer font-medium text-primary hover:underline'
				>
					генератор случайных чисел
				</Link>
				. Если вместо кубика нужны монетка или деление на команды, в статье{' '}
				<Link
					href='/blog/randomayzer-zherebevka-online'
					className='cursor-pointer font-medium text-primary hover:underline'
				>
					Рандомайзер: команды, жребий, кубик и монетка онлайн
				</Link>{' '}
				разобрано, какой инструмент когда использовать.
			</p>
		</div>
	)
}
