import Link from 'next/link'

export function RoasCalculatorSeo() {
	return (
		<div className='mx-auto mt-16 max-w-3xl space-y-12'>
			<section>
				<h2 className='text-2xl font-bold tracking-tight'>
					Как считается ROAS
				</h2>
				<p className='mt-3 text-muted-foreground'>
					ROAS (return on ad spend) — отношение выручки от рекламы к расходам на
					эту рекламу. Выручку делят на рекламный бюджет; результат выражают в
					процентах или коэффициентом. Потратили 50 000, получили 200 000
					выручки — ROAS 400%, то есть 4 рубля выручки на каждый вложенный
					рубль. Из чего складывалась эта выручка, то есть какая доля переходов
					закончилась покупкой, показывает{' '}
					<Link
						href='/tools/conversion-rate-calculator'
						className='cursor-pointer font-medium text-primary hover:underline'
					>
						калькулятор конверсии
					</Link>
					.
				</p>
			</section>

			<section>
				<h2 className='text-2xl font-bold tracking-tight'>
					ROAS, ДРР и ROI — как связаны
				</h2>
				<p className='mt-3 text-muted-foreground'>
					<Link
						href='/tools/drr-calculator'
						className='cursor-pointer font-medium text-primary hover:underline'
					>
						ДРР
					</Link>{' '}
					— это перевёрнутый ROAS: доля рекламных расходов в выручке. ROAS 400%
					равен ДРР 25%. ROI отличается принципиально: он вычитает себестоимость
					товара и прочие затраты, поэтому всегда ниже ROAS. ROAS удобен для
					быстрой отбраковки убыточных каналов, но окончательное решение
					принимают по прибыли.
				</p>
			</section>

			<section>
				<h2 className='text-2xl font-bold tracking-tight'>
					Какой ROAS нужен для прибыли
				</h2>
				<p className='mt-3 text-muted-foreground'>
					Минимальный ROAS, при котором реклама не в убыток, зависит от маржи.
					Если валовая маржа 30%, точка окупаемости примерно на ROAS 330%: при
					меньшем значении реклама съедает больше, чем приносит прибыли. Формула
					ориентира — сто процентов, делённые на долю маржи. Проверить общую
					окупаемость проекта с учётом всех затрат поможет калькулятор ROI.
				</p>
				<div className='mt-4 overflow-x-auto'>
					<table className='w-full text-left text-sm'>
						<thead>
							<tr className='border-b text-muted-foreground'>
								<th className='py-2 pr-4 font-medium'>Маржа товара</th>
								<th className='py-2 font-medium'>Точка окупаемости ROAS</th>
							</tr>
						</thead>
						<tbody className='text-foreground'>
							<tr className='border-b'>
								<td className='py-2 pr-4 font-mono'>10%</td>
								<td className='py-2 font-mono'>1000%</td>
							</tr>
							<tr className='border-b'>
								<td className='py-2 pr-4 font-mono'>20%</td>
								<td className='py-2 font-mono'>500%</td>
							</tr>
							<tr className='border-b'>
								<td className='py-2 pr-4 font-mono'>30%</td>
								<td className='py-2 font-mono'>333%</td>
							</tr>
							<tr className='border-b'>
								<td className='py-2 pr-4 font-mono'>40%</td>
								<td className='py-2 font-mono'>250%</td>
							</tr>
							<tr>
								<td className='py-2 pr-4 font-mono'>50%</td>
								<td className='py-2 font-mono'>200%</td>
							</tr>
						</tbody>
					</table>
				</div>
			</section>
		</div>
	)
}
