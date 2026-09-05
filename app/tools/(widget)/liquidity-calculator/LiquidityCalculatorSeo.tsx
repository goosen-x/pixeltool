export function LiquidityCalculatorSeo() {
	return (
		<div className='mx-auto mt-16 max-w-3xl space-y-12'>
			<section>
				<h2 className='text-2xl font-bold tracking-tight'>
					Три коэффициента и что каждый показывает
				</h2>
				<p className='mt-3 text-muted-foreground'>
					Текущая ликвидность — оборотные активы, делённые на краткосрочные
					обязательства: хватит ли всего оборотного капитала расплатиться по
					коротким долгам. Быстрая исключает запасы, которые не всегда удаётся
					быстро продать без потери в цене. Абсолютная берёт только деньги и их
					эквиваленты — сможет ли компания заплатить прямо сегодня. Каждый
					следующий коэффициент строже предыдущего.
				</p>
			</section>

			<section>
				<h2 className='text-2xl font-bold tracking-tight'>
					Нормативы и как их читать
				</h2>
				<div className='mt-4 overflow-x-auto'>
					<table className='w-full text-left text-sm'>
						<thead>
							<tr className='border-b text-muted-foreground'>
								<th className='py-2 pr-4 font-medium'>Коэффициент</th>
								<th className='py-2 font-medium'>Норматив</th>
							</tr>
						</thead>
						<tbody className='text-foreground'>
							<tr className='border-b'>
								<td className='py-2 pr-4'>Текущая ликвидность</td>
								<td className='py-2 font-mono'>1,5–2,5</td>
							</tr>
							<tr className='border-b'>
								<td className='py-2 pr-4'>Быстрая ликвидность</td>
								<td className='py-2 font-mono'>0,8–1</td>
							</tr>
							<tr>
								<td className='py-2 pr-4'>Абсолютная ликвидность</td>
								<td className='py-2 font-mono'>от 0,2</td>
							</tr>
						</tbody>
					</table>
				</div>
				<p className='mt-3 text-muted-foreground'>
					Значения ниже нормы говорят о риске кассовых разрывов и неплатежей.
					Значения заметно выше нормы — не всегда хорошо: это часто означает,
					что на счетах и складе заморожены деньги, которые могли бы работать в
					обороте или развитии. Нормативы приблизительные и сильно зависят от
					отрасли: у ритейла с быстрым оборотом они одни, у производства с
					длинным циклом — другие.
				</p>
			</section>

			<section>
				<h2 className='text-2xl font-bold tracking-tight'>
					Откуда брать числа
				</h2>
				<p className='mt-3 text-muted-foreground'>
					Из бухгалтерского баланса. Оборотные активы — итог раздела II,
					краткосрочные обязательства — итог раздела V, запасы и денежные
					средства — отдельные строки раздела II. Для оценки контрагента перед
					отсрочкой платежа берут его последнюю отчётность из открытых
					источников, для своей компании — актуальный баланс.
				</p>
			</section>
		</div>
	)
}
