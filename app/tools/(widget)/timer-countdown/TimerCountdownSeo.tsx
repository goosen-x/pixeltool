import Link from 'next/link'

/**
 * SEO-контент под таймером. Закрывает то, что не поместилось в FAQ: суть
 * техники Помодоро (отдельный кластер спроса) и практическую разницу между
 * таймером и секундомером для тех, кто путает эти два режима.
 */
export function TimerCountdownSeo() {
	return (
		<div className='mx-auto mt-16 max-w-3xl space-y-12'>
			<section>
				<h2 className='text-2xl font-bold tracking-tight'>
					Что такое техника Помодоро
				</h2>
				<p className='mt-3 text-muted-foreground'>
					Метод предложил в конце 1980-х Франческо Чирилло. Он засекал время
					учёбы кухонным таймером в форме помидора (отсюда название) и заметил,
					что короткие рабочие отрезки с обязательным перерывом держат
					концентрацию лучше, чем попытка работать без остановки. Классический
					цикл — 25 минут сфокусированной работы, затем 5 минут отдыха. После
					четырёх таких сессий подряд перерыв увеличивается до 15–30 минут,
					чтобы мозг успел восстановиться перед новым блоком задач.
				</p>
				<p className='mt-3 text-muted-foreground'>
					Готовые интервалы для разных задач:
				</p>
				<div className='mt-4 overflow-x-auto'>
					<table className='w-full text-left text-sm'>
						<thead>
							<tr className='border-b text-muted-foreground'>
								<th className='py-2 pr-4 font-medium'>Пресет</th>
								<th className='py-2 font-medium'>Работа / перерыв</th>
							</tr>
						</thead>
						<tbody className='text-foreground'>
							<tr className='border-b'>
								<td className='py-2 pr-4'>Классический Помодоро</td>
								<td className='py-2 font-mono'>25 / 5 минут</td>
							</tr>
							<tr className='border-b'>
								<td className='py-2 pr-4'>Короткий перерыв</td>
								<td className='py-2 font-mono'>25 / 5 минут</td>
							</tr>
							<tr className='border-b'>
								<td className='py-2 pr-4'>Длинный перерыв (после 4 циклов)</td>
								<td className='py-2 font-mono'>25 / 15–30 минут</td>
							</tr>
							<tr>
								<td className='py-2 pr-4'>Спринт для длинных задач</td>
								<td className='py-2 font-mono'>50 / 10 минут</td>
							</tr>
						</tbody>
					</table>
				</div>
			</section>

			<section>
				<h2 className='text-2xl font-bold tracking-tight'>
					Таймер или секундомер: что выбрать
				</h2>
				<p className='mt-3 text-muted-foreground'>
					Берите таймер обратного отсчёта, если заранее знаете нужную
					длительность: готовка, ограничение на разминку, тайм-лимит на задачу.
					Секундомер решает обратную задачу, когда неизвестно, сколько времени
					займёт действие, и его нужно замерить: пробежка, время ответа,
					продолжительность тренировки. Режим Pomodoro — фактически таймер
					обратного отсчёта с готовым циклом «работа → перерыв», настроенным
					заранее, чтобы не запускать его вручную после каждой сессии. А если
					отсчёт идёт не от минут, а от конкретной календарной даты (дедлайна
					или дня рождения), точнее посчитает{' '}
					<Link
						href='/tools/date-difference-calculator'
						className='cursor-pointer font-medium text-primary hover:underline'
					>
						калькулятор разницы дат
					</Link>
					.
				</p>
			</section>

			<p className='text-muted-foreground'>
				Зачем нужны перерывы, какие бывают частые ошибки и как адаптировать
				классический цикл под себя, разобрано в статье{' '}
				<Link
					href='/blog/tehnika-pomodoro'
					className='cursor-pointer font-medium text-primary hover:underline'
				>
					Метод Помодоро: как работает техника 25/5 и как её использовать
				</Link>
				.
			</p>
		</div>
	)
}
