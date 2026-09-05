import Link from 'next/link'

export function MeetingCostCalculatorSeo() {
	return (
		<div className='mx-auto mt-16 max-w-3xl space-y-12'>
			<section>
				<h2 className='text-2xl font-bold tracking-tight'>
					Как считается стоимость встречи
				</h2>
				<p className='mt-3 text-muted-foreground'>
					Число участников умножается на их среднюю часовую ставку и на
					длительность в часах. Восемь человек по 1500 рублей в час на встрече
					45 минут — это 9000 рублей рабочего времени, которое компания
					оплачивает независимо от того, был ли от встречи результат. Для
					регулярных совещаний калькулятор умножает эту сумму на число встреч в
					году.
				</p>

				<p className='mt-4 text-muted-foreground'>
					Часовая встреча при ставке 1500 рублей в час. Ставка взята для
					примера, свою подставьте в калькулятор:
				</p>
				<div className='mt-4 overflow-x-auto'>
					<table className='w-full text-left text-sm'>
						<thead>
							<tr className='border-b text-muted-foreground'>
								<th className='py-2 pr-4 font-medium'>Участников</th>
								<th className='py-2 pr-4 font-medium'>Одна встреча</th>
								<th className='py-2 font-medium'>Если еженедельно, за год</th>
							</tr>
						</thead>
						<tbody className='text-foreground'>
							<tr className='border-b'>
								<td className='py-2 pr-4 font-mono'>3</td>
								<td className='py-2 pr-4 font-mono'>4 500 ₽</td>
								<td className='py-2 font-mono'>234 000 ₽</td>
							</tr>
							<tr className='border-b'>
								<td className='py-2 pr-4 font-mono'>5</td>
								<td className='py-2 pr-4 font-mono'>7 500 ₽</td>
								<td className='py-2 font-mono'>390 000 ₽</td>
							</tr>
							<tr className='border-b'>
								<td className='py-2 pr-4 font-mono'>8</td>
								<td className='py-2 pr-4 font-mono'>12 000 ₽</td>
								<td className='py-2 font-mono'>624 000 ₽</td>
							</tr>
							<tr>
								<td className='py-2 pr-4 font-mono'>12</td>
								<td className='py-2 pr-4 font-mono'>18 000 ₽</td>
								<td className='py-2 font-mono'>936 000 ₽</td>
							</tr>
						</tbody>
					</table>
				</div>
				<p className='mt-4 text-muted-foreground'>
					Годовая колонка это 52 повторения. Именно она обычно и производит
					впечатление: еженедельный часовой статус на двенадцать человек стоит
					как ещё один сотрудник.
				</p>
			</section>

			<section>
				<h2 className='text-2xl font-bold tracking-tight'>
					Как получить часовую ставку
				</h2>
				<p className='mt-3 text-muted-foreground'>
					Простой способ — разделить месячный оклад на среднее число рабочих
					часов в месяце, примерно 165. Оклад 250 000 даёт около 1500 рублей в
					час. Это нижняя оценка: полная стоимость сотрудника для компании
					включает страховые взносы, налоги, аренду рабочего места и технику,
					поэтому реальная ставка обычно в полтора-два раза выше номинальной.
				</p>
			</section>

			<section>
				<h2 className='text-2xl font-bold tracking-tight'>
					Зачем переводить встречи в деньги
				</h2>
				<p className='mt-3 text-muted-foreground'>
					Время на календаре выглядит бесплатным, деньги — нет. Когда видно, что
					еженедельный часовой статус на двенадцать человек стоит компании
					несколько миллионов в год, проще решить, кому на нём обязательно быть,
					можно ли сократить его вдвое и не заменить ли асинхронным отчётом.
					Оценить, сколько рабочих часов у команды вообще остаётся на задачи
					после всех совещаний, поможет{' '}
					<Link
						href='/tools/team-capacity-calculator'
						className='cursor-pointer font-medium text-primary hover:underline'
					>
						калькулятор ёмкости команды
					</Link>
					.
				</p>
			</section>
		</div>
	)
}
