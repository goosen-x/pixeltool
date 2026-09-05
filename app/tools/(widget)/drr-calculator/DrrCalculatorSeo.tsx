import Link from 'next/link'

export function DrrCalculatorSeo() {
	return (
		<div className='mx-auto mt-16 max-w-3xl space-y-12'>
			<section>
				<h2 className='text-2xl font-bold tracking-tight'>Что такое ДРР</h2>
				<p className='mt-3 text-muted-foreground'>
					ДРР — доля рекламных расходов в выручке. Рекламный бюджет делят на
					выручку от этой рекламы и умножают на сто. Потратили 30 000, получили
					200 000 выручки — ДРР 15%. Метрику любят на маркетплейсах и в
					перформанс-рекламе, потому что она сразу отвечает на вопрос «сколько
					копеек с каждого рубля выручки уходит на её продвижение».
				</p>
			</section>

			<section>
				<h2 className='text-2xl font-bold tracking-tight'>
					ДРР и ROAS — одно и то же с разных сторон
				</h2>
				<p className='mt-3 text-muted-foreground'>
					<Link
						href='/tools/roas-calculator'
						className='cursor-pointer font-medium text-primary hover:underline'
					>
						ROAS
					</Link>{' '}
					показывает, сколько выручки принёс рубль рекламы, ДРР — какую долю
					выручки этот рубль составил. ДРР 20% равен ROAS 500%, ДРР 50% — ROAS
					200%. Калькулятор считает обе величины, чтобы удобно было
					разговаривать с теми, кто привык к другой метрике.
				</p>

				<p className='mt-4 text-muted-foreground'>
					Пересчёт из одного в другое: ROAS в разах это 100 разделить на ДРР в
					процентах.
				</p>
				<div className='mt-4 overflow-x-auto'>
					<table className='w-full text-left text-sm'>
						<thead>
							<tr className='border-b text-muted-foreground'>
								<th className='py-2 pr-4 font-medium'>ДРР</th>
								<th className='py-2 pr-4 font-medium'>ROAS</th>
								<th className='py-2 font-medium'>Что это значит</th>
							</tr>
						</thead>
						<tbody className='text-foreground'>
							<tr className='border-b'>
								<td className='py-2 pr-4 font-mono'>5%</td>
								<td className='py-2 pr-4 font-mono'>20</td>
								<td className='py-2'>на рубль рекламы 20 рублей выручки</td>
							</tr>
							<tr className='border-b'>
								<td className='py-2 pr-4 font-mono'>10%</td>
								<td className='py-2 pr-4 font-mono'>10</td>
								<td className='py-2'>десятая часть выручки уходит в рекламу</td>
							</tr>
							<tr className='border-b'>
								<td className='py-2 pr-4 font-mono'>20%</td>
								<td className='py-2 pr-4 font-mono'>5</td>
								<td className='py-2'>типичный ориентир для e-commerce</td>
							</tr>
							<tr className='border-b'>
								<td className='py-2 pr-4 font-mono'>25%</td>
								<td className='py-2 pr-4 font-mono'>4</td>
								<td className='py-2'>четверть выручки в рекламе</td>
							</tr>
							<tr className='border-b'>
								<td className='py-2 pr-4 font-mono'>33%</td>
								<td className='py-2 pr-4 font-mono'>3</td>
								<td className='py-2'>треть выручки в рекламе</td>
							</tr>
							<tr className='border-b'>
								<td className='py-2 pr-4 font-mono'>50%</td>
								<td className='py-2 pr-4 font-mono'>2</td>
								<td className='py-2'>реклама съедает половину</td>
							</tr>
							<tr>
								<td className='py-2 pr-4 font-mono'>100%</td>
								<td className='py-2 pr-4 font-mono'>1</td>
								<td className='py-2'>выручка равна расходу, работа в ноль</td>
							</tr>
						</tbody>
					</table>
				</div>
			</section>

			<section>
				<h2 className='text-2xl font-bold tracking-tight'>
					Какой ДРР допустим
				</h2>
				<p className='mt-3 text-muted-foreground'>
					Верхняя граница — валовая маржа товара: если ДРР её превысил, сделка
					уходит в минус ещё до учёта прочих расходов. На практике на
					маркетплейсах держат ДРР в диапазоне 5–15% в зависимости от категории
					и наценки. Считать ДРР нужно от выручки, которую принесла именно
					реклама: если брать всю выручку вместе с органикой, показатель
					занижается и маскирует неэффективные кампании.
				</p>
			</section>
		</div>
	)
}
