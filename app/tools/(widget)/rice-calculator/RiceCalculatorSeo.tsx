import Link from 'next/link'

export function RiceCalculatorSeo() {
	return (
		<div className='mx-auto mt-16 max-w-3xl space-y-12'>
			<section>
				<h2 className='text-2xl font-bold tracking-tight'>
					Как считается RICE
				</h2>
				<p className='mt-3 text-muted-foreground'>
					RICE = (Reach × Impact × Confidence) ÷ Effort. Reach — сколько людей
					затронет изменение за выбранный период. Impact — насколько сильно
					повлияет на каждого, по условной шкале от 0,25 до 3. Confidence —
					насколько вы уверены в оценках, в процентах: он штрафует за
					предположения без данных. Effort — трудозатраты в человеко-месяцах, и
					он в знаменателе, потому что чем дороже задача, тем ниже её приоритет
					при прочих равных.
				</p>

				<p className='mt-4 text-muted-foreground'>
					Impact не произвольное число, а выбор из фиксированной шкалы. Она и
					стоит в выпадающем списке калькулятора:
				</p>
				<div className='mt-4 overflow-x-auto'>
					<table className='w-full text-left text-sm'>
						<thead>
							<tr className='border-b text-muted-foreground'>
								<th className='py-2 pr-4 font-medium'>Влияние</th>
								<th className='py-2 pr-4 font-medium'>Значение</th>
								<th className='py-2 font-medium'>Когда ставят</th>
							</tr>
						</thead>
						<tbody className='text-foreground'>
							<tr className='border-b'>
								<td className='py-2 pr-4'>Огромное</td>
								<td className='py-2 pr-4 font-mono'>3</td>
								<td className='py-2'>меняет продукт или ключевую метрику</td>
							</tr>
							<tr className='border-b'>
								<td className='py-2 pr-4'>Большое</td>
								<td className='py-2 pr-4 font-mono'>2</td>
								<td className='py-2'>заметно улучшает сценарий</td>
							</tr>
							<tr className='border-b'>
								<td className='py-2 pr-4'>Среднее</td>
								<td className='py-2 pr-4 font-mono'>1</td>
								<td className='py-2'>обычное полезное улучшение</td>
							</tr>
							<tr className='border-b'>
								<td className='py-2 pr-4'>Малое</td>
								<td className='py-2 pr-4 font-mono'>0,5</td>
								<td className='py-2'>мелочь, которую заметят немногие</td>
							</tr>
							<tr>
								<td className='py-2 pr-4'>Минимальное</td>
								<td className='py-2 pr-4 font-mono'>0,25</td>
								<td className='py-2'>почти незаметно</td>
							</tr>
						</tbody>
					</table>
				</div>
			</section>

			<section>
				<h2 className='text-2xl font-bold tracking-tight'>Чем ICE проще</h2>
				<p className='mt-3 text-muted-foreground'>
					В ICE три множителя вместо четырёх: Impact × Confidence × Ease, все по
					шкале от 1 до 10. Нет отдельного охвата и трудозатрат в реальных
					единицах, Effort заменён на обратную ему «простоту». ICE быстрее для
					грубой сортировки идей на старте, когда данных по аудитории ещё нет.
					RICE точнее, когда есть чем подкрепить оценку охвата.
				</p>
			</section>

			<section>
				<h2 className='text-2xl font-bold tracking-tight'>
					Что значит итоговый балл
				</h2>
				<p className='mt-3 text-muted-foreground'>
					Сам по себе — ничего. Балл RICE 120 не «хороший» и не «плохой», он
					просто выше, чем 40 у другой задачи, и значит, её стоит взять раньше.
					Сравнивать имеет смысл только задачи, оценённые по одной шкале и, по
					возможности, одним человеком: у разных людей калибровка Impact и
					Confidence разъезжается. Приоритизация нужна, чтобы спор о бэклоге
					сводился к обсуждению оценок, а не к перетягиванию каждой строки.
					После того как порядок задач выбран, сколько реально займёт каждая от
					старта до готовности, показывает{' '}
					<Link
						href='/tools/cycle-time-calculator'
						className='cursor-pointer font-medium text-primary hover:underline'
					>
						калькулятор cycle time
					</Link>
					.
				</p>
			</section>
		</div>
	)
}
