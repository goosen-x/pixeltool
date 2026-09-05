import Link from 'next/link'

export function ConversionRateCalculatorSeo() {
	return (
		<div className='mx-auto mt-16 max-w-3xl space-y-12'>
			<section>
				<h2 className='text-2xl font-bold tracking-tight'>
					Что такое конверсия и как её считать
				</h2>
				<p className='mt-3 text-muted-foreground'>
					Конверсия (conversion rate, CR) — доля посетителей, совершивших
					целевое действие: заявку, заказ, регистрацию, звонок. Целевые действия
					делят на визиты и умножают на сто. 30 заявок с 1500 визитов —
					конверсия 2%. Обратный режим отвечает на вопрос планирования: сколько
					трафика привести, чтобы получить нужное число заявок при известной
					конверсии. Шагом раньше в этой же воронке стоит клик по объявлению —
					его долю считает{' '}
					<Link
						href='/tools/ctr-calculator'
						className='cursor-pointer font-medium text-primary hover:underline'
					>
						калькулятор CTR
					</Link>
					.
				</p>
			</section>

			<section>
				<h2 className='text-2xl font-bold tracking-tight'>
					Считать от визитов или от посетителей
				</h2>
				<p className='mt-3 text-muted-foreground'>
					И то и другое допустимо, но база должна быть единой на всём отчёте.
					Один человек может зайти на сайт несколько раз перед покупкой: от
					визитов конверсия получится ниже, от уникальных посетителей — выше.
					Смешивать эти две базы в одном сравнении нельзя, иначе цифры
					несопоставимы между периодами и каналами.
				</p>
			</section>

			<section>
				<h2 className='text-2xl font-bold tracking-tight'>
					Какая конверсия считается хорошей
				</h2>
				<p className='mt-3 text-muted-foreground'>
					Диапазоны ниже — ориентировочные, в среднем по рынку:
				</p>
				<div className='mt-4 overflow-x-auto'>
					<table className='w-full text-left text-sm'>
						<thead>
							<tr className='border-b text-muted-foreground'>
								<th className='py-2 pr-4 font-medium'>Ниша</th>
								<th className='py-2 font-medium'>Конверсия</th>
							</tr>
						</thead>
						<tbody className='text-foreground'>
							<tr className='border-b'>
								<td className='py-2 pr-4'>Интернет-магазины</td>
								<td className='py-2 font-mono'>1–3%</td>
							</tr>
							<tr className='border-b'>
								<td className='py-2 pr-4'>Лендинги, лидогенерация</td>
								<td className='py-2 font-mono'>5–15%</td>
							</tr>
							<tr>
								<td className='py-2 pr-4'>B2B-заявки</td>
								<td className='py-2 font-mono'>менее 1%</td>
							</tr>
						</tbody>
					</table>
				</div>
				<p className='mt-3 text-muted-foreground'>
					Само по себе число мало о чём говорит: конверсия 1% при дешёвом
					трафике и высоком чеке может быть выгоднее, чем 5% при дорогом.
					Оценивать её нужно вместе со стоимостью привлечения и средним чеком —
					через калькуляторы CPA и CAC/LTV, а окупаемость самой рекламы в
					деньгах покажет{' '}
					<Link
						href='/tools/roas-calculator'
						className='cursor-pointer font-medium text-primary hover:underline'
					>
						калькулятор ROAS
					</Link>
					.
				</p>
			</section>
		</div>
	)
}
