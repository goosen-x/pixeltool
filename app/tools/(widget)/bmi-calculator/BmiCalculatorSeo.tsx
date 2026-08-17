import Link from 'next/link'

export function BmiCalculatorSeo() {
	return (
		<div className='mx-auto mt-16 max-w-3xl space-y-12'>
			<section>
				<h2 className='text-2xl font-bold tracking-tight'>
					Как считается индекс массы тела
				</h2>
				<p className='mt-3 text-muted-foreground'>
					Формула простая: вес в килограммах делится на рост в метрах в
					квадрате. Придумал её в XIX веке бельгийский статистик Адольф
					Кетле — не как медицинский показатель, а как способ сравнивать
					телосложение людей в больших группах для статистики. В медицину
					как массовый ориентировочный инструмент ИМТ вошёл только в XX
					веке — именно поэтому у него нет привязки к конкретному человеку,
					только к усреднённым данным по популяции.
				</p>
			</section>

			<section>
				<h2 className='text-2xl font-bold tracking-tight'>
					Категории ИМТ по стандарту ВОЗ
				</h2>
				<p className='mt-3 text-muted-foreground'>
					Пороги одинаковы для мужчин и женщин — сама формула пол не
					учитывает:
				</p>
				<div className='mt-4 overflow-x-auto'>
					<table className='w-full text-left text-sm'>
						<thead>
							<tr className='border-b text-muted-foreground'>
								<th className='py-2 pr-4 font-medium'>ИМТ</th>
								<th className='py-2 font-medium'>Категория</th>
							</tr>
						</thead>
						<tbody className='text-foreground'>
							<tr className='border-b'>
								<td className='py-2 pr-4 font-mono'>меньше 18.5</td>
								<td className='py-2'>Недостаток массы тела</td>
							</tr>
							<tr className='border-b'>
								<td className='py-2 pr-4 font-mono'>18.5–24.9</td>
								<td className='py-2'>Норма</td>
							</tr>
							<tr className='border-b'>
								<td className='py-2 pr-4 font-mono'>25–29.9</td>
								<td className='py-2'>Избыточная масса тела</td>
							</tr>
							<tr>
								<td className='py-2 pr-4 font-mono'>30 и больше</td>
								<td className='py-2'>Ожирение</td>
							</tr>
						</tbody>
					</table>
				</div>
			</section>

			<section>
				<h2 className='text-2xl font-bold tracking-tight'>
					Почему ИМТ — не окончательный ответ
				</h2>
				<p className='mt-3 text-muted-foreground'>
					Главное ограничение — формула не различает мышцы и жир, она
					видит только суммарный вес. Поэтому у людей с развитой
					мускулатурой (спортсмены, бодибилдеры) ИМТ часто показывает
					«избыточную массу» или даже «ожирение», хотя процента жира в
					организме у них ниже среднего. Показатель также не учитывает,
					где именно в теле распределён жир — а это медицински важнее
					самой цифры. ИМТ остаётся полезным как быстрый ориентир для
					среднестатистического взрослого, но не как диагноз и не как
					единственный аргумент в решениях о весе — для этого разумнее
					обратиться к врачу.
				</p>
			</section>

			<p className='text-muted-foreground'>
				Разбор формулы на примере, история происхождения ИМТ и подробнее
				об ограничениях — в статье{' '}
				<Link
					href='/blog/kak-rasschitat-imt'
					className='cursor-pointer font-medium text-primary hover:underline'
				>
					Как рассчитать ИМТ: формула, таблица категорий и её ограничения
				</Link>
				.
			</p>
		</div>
	)
}
