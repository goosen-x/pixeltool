import Link from 'next/link'

export function ReactionTestSeo() {
	return (
		<div className='mx-auto mt-16 max-w-3xl space-y-12'>
			<section>
				<h2 className='text-2xl font-bold tracking-tight'>
					Как измеряется время реакции
				</h2>
				<p className='mt-3 text-muted-foreground'>
					После нажатия «Начать» экран ждёт случайную паузу от 1,2 до 4 секунд —
					так нельзя предугадать момент по ритму. Как только фон становится
					зелёным, браузер запоминает точное время, а при клике считает разницу
					в миллисекундах. Случайная задержка — не косметика, а часть теста: без
					неё можно подловить момент и щёлкнуть заранее, результат перестанет
					быть замером реакции.
				</p>
			</section>

			<section>
				<h2 className='text-2xl font-bold tracking-tight'>
					Что считается нормальным результатом
				</h2>
				<p className='mt-3 text-muted-foreground'>
					Среднее время простой зрительно-моторной реакции у взрослого человека
					— примерно 200–250 мс, у тренированных игроков и киберспортсменов
					результат может опускаться к 150–180 мс. Клик до появления зелёного
					цвета засчитывается как «рано» и не идёт в зачёт: это защита от
					угадывания момента, а не ошибка теста. Итоговая цифра — среднее из
					пяти раундов, так одно случайно быстрое или медленное нажатие не
					искажает картину. Ещё один навык, который легко измерить и сравнить с
					нормой, это скорость печати, для неё есть{' '}
					<Link
						href='/tools/typing-speed-test'
						className='cursor-pointer font-medium text-primary hover:underline'
					>
						тест скорости печати
					</Link>
					.
				</p>
				<div className='mt-4 overflow-x-auto'>
					<table className='w-full border-collapse text-sm'>
						<thead>
							<tr className='border-b text-left'>
								<th className='py-2 pr-4 font-semibold'>Категория</th>
								<th className='py-2 font-semibold'>
									Время реакции (ориентировочно)
								</th>
							</tr>
						</thead>
						<tbody>
							<tr className='border-b last:border-0'>
								<td className='py-2 pr-4 align-top'>Обычный человек</td>
								<td className='py-2 align-top text-muted-foreground'>
									200–300 мс
								</td>
							</tr>
							<tr className='border-b last:border-0'>
								<td className='py-2 pr-4 align-top'>Водитель за рулём</td>
								<td className='py-2 align-top text-muted-foreground'>
									150–200 мс
								</td>
							</tr>
							<tr className='border-b last:border-0'>
								<td className='py-2 pr-4 align-top'>Геймер, киберспортсмен</td>
								<td className='py-2 align-top text-muted-foreground'>
									120–170 мс
								</td>
							</tr>
						</tbody>
					</table>
					<p className='mt-2 text-xs text-muted-foreground'>
						Диапазоны ориентировочные, а не медицинский норматив: реакция
						зависит от возраста, усталости, освещения и того, каким устройством
						пользуетесь для клика.
					</p>
				</div>
			</section>
		</div>
	)
}
