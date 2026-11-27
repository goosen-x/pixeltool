import Link from 'next/link'

export function CtrCalculatorSeo() {
	return (
		<div className='mx-auto mt-16 max-w-3xl space-y-12'>
			<section>
				<h2 className='text-2xl font-bold tracking-tight'>Как считается CTR</h2>
				<p className='mt-3 text-muted-foreground'>
					CTR (click-through rate) показывает, какая доля показов закончилась
					кликом. Клики делят на показы и умножают на сто: 75 кликов на 5000
					показов дают CTR 1,5%. Обратный расчёт нужен при планировании. Если
					площадка обещает 20 000 показов, а в прошлых кампаниях CTR был около
					1%, ждите примерно 200 кликов.
				</p>
				<p className='mt-3 text-muted-foreground'>
					Если заполнить поле «Расход», калькулятор заодно покажет CPC (цену
					клика, расход ÷ клики) и CPM (цену тысячи показов, расход ÷ показы ×
					1000). Так видно, во что обходится каждый клик при вашем CTR: 3000 ₽
					на 5000 показов и 75 кликов дают CPC 40 ₽ и CPM 600 ₽.
				</p>
			</section>

			<section>
				<h2 className='text-2xl font-bold tracking-tight'>
					Какой CTR считать нормальным
				</h2>
				<p className='mt-3 text-muted-foreground'>
					Единой планки нет, всё зависит от канала. Диапазоны ниже примерные,
					в среднем по рынку:
				</p>
				<div className='mt-4 overflow-x-auto'>
					<table className='w-full text-left text-sm'>
						<thead>
							<tr className='border-b text-muted-foreground'>
								<th className='py-2 pr-4 font-medium'>Канал</th>
								<th className='py-2 font-medium'>CTR</th>
							</tr>
						</thead>
						<tbody className='text-foreground'>
							<tr className='border-b'>
								<td className='py-2 pr-4'>Поиск, горячие запросы</td>
								<td className='py-2 font-mono'>3–5% и выше</td>
							</tr>
							<tr className='border-b'>
								<td className='py-2 pr-4'>
									Органическая выдача, среднее по сайту в Вебмастере или Search
									Console
								</td>
								<td className='py-2 font-mono'>2–5%</td>
							</tr>
							<tr className='border-b'>
								<td className='py-2 pr-4'>КМС, медийная реклама, баннеры</td>
								<td className='py-2 font-mono'>0,1–1%</td>
							</tr>
							<tr className='border-b'>
								<td className='py-2 pr-4'>Соцсети, лента</td>
								<td className='py-2 font-mono'>0,3–1%</td>
							</tr>
							<tr>
								<td className='py-2 pr-4'>Email-рассылки</td>
								<td className='py-2 font-mono'>2–5%</td>
							</tr>
						</tbody>
					</table>
				</div>
				<p className='mt-3 text-muted-foreground'>
					Сравнивать чужие бенчмарки с вашими цифрами почти бесполезно:
					ориентируйтесь на свою историю в том же канале и на тех же аудиториях.
				</p>
			</section>

			<section>
				<h2 className='text-2xl font-bold tracking-tight'>
					CTR показывает интерес, а не продажи
				</h2>
				<p className='mt-3 text-muted-foreground'>
					Высокий CTR показывает, что объявление привлекает внимание, но ничего
					не говорит о том, покупают ли эти люди. Кликбейтный заголовок поднимет
					CTR и обрушит конверсию, потому что трафик придёт нецелевой. Поэтому
					CTR смотрят вместе с конверсией и стоимостью целевого действия. Для
					этого есть{' '}
					<Link
						href='/tools/conversion-rate-calculator'
						className='cursor-pointer font-medium text-primary hover:underline'
					>
						калькулятор конверсии
					</Link>{' '}
					и{' '}
					<Link
						href='/tools/cpa-calculator'
						className='cursor-pointer font-medium text-primary hover:underline'
					>
						калькулятор CPA
					</Link>
					.
				</p>
			</section>
		</div>
	)
}
