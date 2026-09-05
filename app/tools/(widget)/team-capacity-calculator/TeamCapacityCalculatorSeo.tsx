import Link from 'next/link'

export function TeamCapacityCalculatorSeo() {
	return (
		<div className='mx-auto mt-16 max-w-3xl space-y-12'>
			<section>
				<h2 className='text-2xl font-bold tracking-tight'>
					Как считается ёмкость команды
				</h2>
				<p className='mt-3 text-muted-foreground'>
					Сначала берут номинал: число людей умножают на рабочие часы в день и
					на длину спринта в днях. Из него вычитают часы на встречи и
					запланированные отгулы и отпуска. Полученную рабочую массу уменьшают
					на буфер в процентах — резерв под то, что в план не попадает: баги,
					поддержку, срочные правки, переключения между задачами. Остаток и есть
					время, которое можно расписать по задачам спринта.
				</p>

				<p className='mt-4 text-muted-foreground'>
					Как тают часы на примере значений по умолчанию: команда 5 человек,
					спринт 10 рабочих дней по 8 часов:
				</p>
				<div className='mt-4 overflow-x-auto'>
					<table className='w-full text-left text-sm'>
						<thead>
							<tr className='border-b text-muted-foreground'>
								<th className='py-2 pr-4 font-medium'>Шаг</th>
								<th className='py-2 pr-4 font-medium'>Часы</th>
								<th className='py-2 font-medium'>Осталось</th>
							</tr>
						</thead>
						<tbody className='text-foreground'>
							<tr className='border-b'>
								<td className='py-2 pr-4'>
									Номинал: 5 человек × 8 ч × 10 дней
								</td>
								<td className='py-2 pr-4 font-mono'>400</td>
								<td className='py-2 font-mono'>400</td>
							</tr>
							<tr className='border-b'>
								<td className='py-2 pr-4'>
									Минус встречи, 5 ч в неделю на человека
								</td>
								<td className='py-2 pr-4 font-mono'>−50</td>
								<td className='py-2 font-mono'>350</td>
							</tr>
							<tr className='border-b'>
								<td className='py-2 pr-4'>Минус отпуска и больничные</td>
								<td className='py-2 pr-4 font-mono'>−16</td>
								<td className='py-2 font-mono'>334</td>
							</tr>
							<tr>
								<td className='py-2 pr-4'>Минус буфер 20% на непредвиденное</td>
								<td className='py-2 pr-4 font-mono'>−66,8</td>
								<td className='py-2 font-mono'>267,2</td>
							</tr>
						</tbody>
					</table>
				</div>
				<p className='mt-4 text-muted-foreground'>
					Итог 267 часов из номинальных 400, то есть 67%. Планировать спринт на
					400 часов означает гарантированно его провалить.
				</p>
			</section>

			<section>
				<h2 className='text-2xl font-bold tracking-tight'>
					Какой буфер закладывать
				</h2>
				<p className='mt-3 text-muted-foreground'>
					Обычно от 15 до 25%. Если команда много занимается поддержкой и
					разбором инцидентов, буфер ближе к верхней границе или выше.
					Заниженный буфер — самая частая причина, по которой спринт стабильно
					не закрывается: план составлен так, будто помех не будет, а они есть
					всегда.
				</p>
			</section>

			<section>
				<h2 className='text-2xl font-bold tracking-tight'>
					Почему нельзя планировать на полную ёмкость
				</h2>
				<p className='mt-3 text-muted-foreground'>
					Восемь часов в офисе — не восемь часов работы над задачами. Между ними
					совещания, обсуждения, код-ревью, обед, ответы в мессенджерах и время
					на возвращение в контекст после каждого прерывания. Реально
					продуктивных часов у разработчика обычно пять-шесть из восьми, и план
					на сто процентов номинала срывается почти гарантированно. Оценить
					стоимость самих совещаний в деньгах поможет{' '}
					<Link
						href='/tools/meeting-cost-calculator'
						className='cursor-pointer font-medium text-primary hover:underline'
					>
						калькулятор стоимости встречи
					</Link>
					, а насколько быстро задачи проходят весь путь от старта до готовности
					—{' '}
					<Link
						href='/tools/cycle-time-calculator'
						className='cursor-pointer font-medium text-primary hover:underline'
					>
						калькулятор Cycle Time
					</Link>
					.
				</p>
			</section>
		</div>
	)
}
