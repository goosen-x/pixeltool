import Link from 'next/link'

export function CpaCalculatorSeo() {
	return (
		<div className='mx-auto mt-16 max-w-3xl space-y-12'>
			<section>
				<h2 className='text-2xl font-bold tracking-tight'>
					CPC, CPL, CPA и CPM — что это
				</h2>
				<p className='mt-3 text-muted-foreground'>
					Все четыре метрики делят рекламный бюджет на количество результатов,
					меняется только результат. CPC — цена за клик, CPL — за лид (контакт
					потенциального клиента), CPA — за целевое действие: заявку, покупку,
					регистрацию. CPM стоит особняком: это цена за тысячу показов, поэтому
					бюджет делят на показы и умножают на тысячу.
				</p>

				<p className='mt-4 text-muted-foreground'>
					Все четыре метрики это одно деление, разница только в том, что стоит в
					знаменателе:
				</p>
				<div className='mt-4 overflow-x-auto'>
					<table className='w-full text-left text-sm'>
						<thead>
							<tr className='border-b text-muted-foreground'>
								<th className='py-2 pr-4 font-medium'>Метрика</th>
								<th className='py-2 pr-4 font-medium'>Формула</th>
								<th className='py-2 font-medium'>Знаменатель</th>
							</tr>
						</thead>
						<tbody className='text-foreground'>
							<tr className='border-b'>
								<td className='py-2 pr-4 font-mono'>CPC</td>
								<td className='py-2 pr-4 font-mono'>расход / клики</td>
								<td className='py-2'>клики по объявлению</td>
							</tr>
							<tr className='border-b'>
								<td className='py-2 pr-4 font-mono'>CPL</td>
								<td className='py-2 pr-4 font-mono'>расход / лиды</td>
								<td className='py-2'>заявки и контакты</td>
							</tr>
							<tr className='border-b'>
								<td className='py-2 pr-4 font-mono'>CPA</td>
								<td className='py-2 pr-4 font-mono'>расход / действия</td>
								<td className='py-2'>целевые действия: покупка, регистрация</td>
							</tr>
							<tr>
								<td className='py-2 pr-4 font-mono'>CPM</td>
								<td className='py-2 pr-4 font-mono'>расход / показы × 1000</td>
								<td className='py-2'>показы, цена считается за тысячу</td>
							</tr>
						</tbody>
					</table>
				</div>
			</section>

			<section>
				<h2 className='text-2xl font-bold tracking-tight'>
					Какую метрику смотреть
				</h2>
				<p className='mt-3 text-muted-foreground'>
					Ту, что ближе к деньгам. CPC и CPM помогают оценить, дорого или дёшево
					вы покупаете трафик, но окончательное решение о канале принимают по
					CPA: связка с дорогим кликом может приносить самые дешёвые продажи, и
					наоборот. CPA сравнивают не абстрактно, а с маржой — сколько вы можете
					платить за клиента, чтобы сделка осталась прибыльной, это и считает{' '}
					<Link
						href='/tools/cac-ltv-calculator'
						className='cursor-pointer font-medium text-primary hover:underline'
					>
						калькулятор CAC и LTV
					</Link>
					.
				</p>
			</section>

			<section>
				<h2 className='text-2xl font-bold tracking-tight'>
					Как метрики связаны между собой
				</h2>
				<p className='mt-3 text-muted-foreground'>
					CPC равен CPM, делённому на CTR и на десять. Поэтому поднять
					кликабельность объявления — прямой способ снизить цену клика без
					изменения ставок. А CPA равен CPC, делённому на конверсию сайта: тот
					же клик при конверсии 2% вместо 1% даёт вдвое более дешёвое целевое
					действие. Обе смежные метрики считаются в{' '}
					<Link
						href='/tools/ctr-calculator'
						className='cursor-pointer font-medium text-primary hover:underline'
					>
						калькуляторе CTR
					</Link>{' '}
					и конверсии.
				</p>
			</section>
		</div>
	)
}
