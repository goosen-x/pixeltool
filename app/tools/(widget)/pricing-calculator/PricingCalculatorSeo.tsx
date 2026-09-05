import Link from 'next/link'

export function PricingCalculatorSeo() {
	return (
		<div className='mx-auto mt-16 max-w-3xl space-y-12'>
			<section>
				<h2 className='text-2xl font-bold tracking-tight'>
					Наценка и маржа — это не одно и то же
				</h2>
				<p className='mt-3 text-muted-foreground'>
					Наценка считается от себестоимости, маржа — от цены продажи. Товар с
					себестоимостью 1000 продают за 1500: наценка 50% (500 делим на 1000),
					маржа 33% (500 делим на 1500). Числа всегда разные, и подмена одного
					другим приводит к тому, что реальная прибыль оказывается ниже
					ожидаемой. Калькулятор считает обе величины сразу, в каком бы режиме
					вы ни задали расчёт.
				</p>
			</section>

			<section>
				<h2 className='text-2xl font-bold tracking-tight'>
					Как перевести наценку в маржу и обратно
				</h2>
				<p className='mt-3 text-muted-foreground'>
					Маржа равна наценке, делённой на единицу плюс наценка. Наценка 100%
					даёт маржу 50%, наценка 25% — маржу 20%, наценка 400% — маржу 80%.
					Обратный перевод: наценка равна марже, делённой на единицу минус
					маржа. Из этого следует практический предел: маржа 100% недостижима,
					потому что означала бы нулевую себестоимость.
				</p>
				<div className='mt-4 overflow-x-auto'>
					<table className='w-full text-left text-sm'>
						<thead>
							<tr className='border-b text-muted-foreground'>
								<th className='py-2 pr-4 font-medium'>Наценка</th>
								<th className='py-2 font-medium'>Маржа</th>
							</tr>
						</thead>
						<tbody className='text-foreground'>
							<tr className='border-b'>
								<td className='py-2 pr-4 font-mono'>10%</td>
								<td className='py-2 font-mono'>9,09%</td>
							</tr>
							<tr className='border-b'>
								<td className='py-2 pr-4 font-mono'>20%</td>
								<td className='py-2 font-mono'>16,67%</td>
							</tr>
							<tr className='border-b'>
								<td className='py-2 pr-4 font-mono'>30%</td>
								<td className='py-2 font-mono'>23,08%</td>
							</tr>
							<tr className='border-b'>
								<td className='py-2 pr-4 font-mono'>50%</td>
								<td className='py-2 font-mono'>33,33%</td>
							</tr>
							<tr>
								<td className='py-2 pr-4 font-mono'>100%</td>
								<td className='py-2 font-mono'>50%</td>
							</tr>
						</tbody>
					</table>
				</div>
			</section>

			<section>
				<h2 className='text-2xl font-bold tracking-tight'>
					От чего отталкиваться при расчёте цены
				</h2>
				<p className='mt-3 text-muted-foreground'>
					От той величины, в которой ведётся учёт. Розница и опт обычно думают в
					наценке, финансовый отдел и маркетплейсы — в марже, потому что
					комиссии площадок считаются процентом от цены. Задайте известное
					значение, и калькулятор посчитает цену, прибыль с единицы и
					недостающий из двух показателей. Проверить, при каком объёме эта цена
					окупает постоянные расходы, поможет{' '}
					<Link
						href='/tools/breakeven-calculator'
						className='cursor-pointer font-medium text-primary hover:underline'
					>
						калькулятор точки безубыточности
					</Link>
					.
				</p>
			</section>
		</div>
	)
}
