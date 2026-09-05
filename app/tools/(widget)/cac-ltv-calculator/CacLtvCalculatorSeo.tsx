import Link from 'next/link'

export function CacLtvCalculatorSeo() {
	return (
		<div className='mx-auto mt-16 max-w-3xl space-y-12'>
			<section>
				<h2 className='text-2xl font-bold tracking-tight'>
					CAC и LTV — основа юнит-экономики
				</h2>
				<p className='mt-3 text-muted-foreground'>
					CAC (customer acquisition cost) — сколько стоит привлечь одного
					клиента: все расходы на маркетинг и продажи делятся на число
					привлечённых. Ту же стоимость привлечения, но по конкретному целевому
					действию, а не по всем клиентам сразу, считает{' '}
					<Link
						href='/tools/cpa-calculator'
						className='cursor-pointer font-medium text-primary hover:underline'
					>
						калькулятор CPA
					</Link>
					. LTV (lifetime value) — сколько прибыли клиент приносит за всё время:
					средний чек умножается на число покупок за жизнь клиента и на маржу.
					LTV именно по марже, а не по выручке — иначе показатель оторван от
					реальной прибыли.
				</p>
			</section>

			<section>
				<h2 className='text-2xl font-bold tracking-tight'>
					Какое отношение LTV к CAC считается здоровым
				</h2>
				<div className='mt-4 overflow-x-auto'>
					<table className='w-full text-left text-sm'>
						<thead>
							<tr className='border-b text-muted-foreground'>
								<th className='py-2 pr-4 font-medium'>LTV : CAC</th>
								<th className='py-2 font-medium'>Что это значит</th>
							</tr>
						</thead>
						<tbody className='text-foreground'>
							<tr className='border-b'>
								<td className='py-2 pr-4 font-mono'>ниже 1:1</td>
								<td className='py-2'>Бизнес теряет деньги на каждом клиенте</td>
							</tr>
							<tr className='border-b'>
								<td className='py-2 pr-4 font-mono'>1:1–2:1</td>
								<td className='py-2'>
									Работа на грани, любое подорожание рекламы уводит в минус
								</td>
							</tr>
							<tr className='border-b'>
								<td className='py-2 pr-4 font-mono'>3:1</td>
								<td className='py-2'>Здоровый ориентир</td>
							</tr>
							<tr>
								<td className='py-2 pr-4 font-mono'>выше 5:1</td>
								<td className='py-2'>
									В маркетинг часто недоинвестируют, можно привлекать больше
								</td>
							</tr>
						</tbody>
					</table>
				</div>
			</section>

			<section>
				<h2 className='text-2xl font-bold tracking-tight'>
					Почему одного отношения мало
				</h2>
				<p className='mt-3 text-muted-foreground'>
					LTV/CAC не учитывает время. Клиент может окупить привлечение через два
					месяца, а может через два года — во втором случае при быстром росте
					возникает кассовый разрыв: деньги на привлечение нужны сейчас, а
					отдача растянута. Поэтому вместе с отношением смотрят срок окупаемости
					CAC; для подписочных моделей нормой считают возврат за 12 месяцев и
					меньше. Общую окупаемость вложений в маркетинг покажет{' '}
					<Link
						href='/tools/roi-calculator'
						className='cursor-pointer font-medium text-primary hover:underline'
					>
						калькулятор ROI
					</Link>
					.
				</p>
			</section>
		</div>
	)
}
