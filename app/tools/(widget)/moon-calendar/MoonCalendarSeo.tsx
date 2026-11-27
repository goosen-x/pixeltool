import Link from 'next/link'

export function MoonCalendarSeo() {
	return (
		<div className='mx-auto mt-16 max-w-3xl space-y-12'>
			<section>
				<h2 className='text-2xl font-bold tracking-tight'>
					Что такое лунный день и почему их 30
				</h2>
				<p className='mt-3 text-muted-foreground'>
					Лунный месяц длится примерно 29,53 суток — столько проходит от одного
					новолуния до следующего. Это называется синодическим месяцем, и он не
					равен ни календарному месяцу, ни времени оборота Луны вокруг Земли:
					пока Луна делает оборот, Земля успевает сдвинуться по своей орбите, и
					до повторения той же фазы нужно ещё пара суток.
				</p>
				<p className='mt-3 text-muted-foreground'>
					Лунные сутки отсчитываются от восхода до восхода Луны. Каждый день
					Луна встаёт в среднем на 50 минут позже, поэтому лунные сутки длиннее
					обычных. Первый лунный день начинается в момент новолуния и
					заканчивается ближайшим восходом, так что он бывает и в полчаса, и
					почти в сутки. За месяц набирается 29 или 30 лунных дней.
				</p>
				<p className='mt-3 text-muted-foreground'>
					Восход зависит от места: в Новосибирске Луна встаёт не тогда, когда в
					Москве, и лунный день там меняется в другое время. Календарь считает
					восходы для Москвы, как большинство русских лунных календарей. Время
					переводится в часовой пояс вашего устройства.
				</p>

				<p className='mt-4 text-muted-foreground'>
					Фаза определяется по доле пройденного цикла. Восемь фаз распределены
					неравномерно: четверти и полнолуние это узкие окна около точной даты,
					а промежуточные фазы длятся по несколько дней:
				</p>
				<div className='mt-4 overflow-x-auto'>
					<table className='w-full text-left text-sm'>
						<thead>
							<tr className='border-b text-muted-foreground'>
								<th className='py-2 pr-4 font-medium'>Фаза</th>
								<th className='py-2 pr-4 font-medium'>Доля цикла</th>
								<th className='py-2 font-medium'>Что видно</th>
							</tr>
						</thead>
						<tbody className='text-foreground'>
							<tr className='border-b'>
								<td className='py-2 pr-4'>Новолуние</td>
								<td className='py-2 pr-4 font-mono'>0 и 100%</td>
								<td className='py-2'>диска не видно</td>
							</tr>
							<tr className='border-b'>
								<td className='py-2 pr-4'>Растущий серп</td>
								<td className='py-2 pr-4 font-mono'>2–23%</td>
								<td className='py-2'>тонкий серп справа</td>
							</tr>
							<tr className='border-b'>
								<td className='py-2 pr-4'>Первая четверть</td>
								<td className='py-2 pr-4 font-mono'>23–27%</td>
								<td className='py-2'>ровно половина диска</td>
							</tr>
							<tr className='border-b'>
								<td className='py-2 pr-4'>Растущая Луна</td>
								<td className='py-2 pr-4 font-mono'>27–48%</td>
								<td className='py-2'>больше половины</td>
							</tr>
							<tr className='border-b'>
								<td className='py-2 pr-4'>Полнолуние</td>
								<td className='py-2 pr-4 font-mono'>48–52%</td>
								<td className='py-2'>полный диск</td>
							</tr>
							<tr className='border-b'>
								<td className='py-2 pr-4'>Убывающая Луна</td>
								<td className='py-2 pr-4 font-mono'>52–73%</td>
								<td className='py-2'>больше половины, убывает</td>
							</tr>
							<tr className='border-b'>
								<td className='py-2 pr-4'>Последняя четверть</td>
								<td className='py-2 pr-4 font-mono'>73–77%</td>
								<td className='py-2'>половина диска слева</td>
							</tr>
							<tr>
								<td className='py-2 pr-4'>Убывающий серп</td>
								<td className='py-2 pr-4 font-mono'>77–98%</td>
								<td className='py-2'>тонкий серп слева</td>
							</tr>
						</tbody>
					</table>
				</div>
			</section>

			<section>
				<h2 className='text-2xl font-bold tracking-tight'>
					Точность этого календаря
				</h2>
				<p className='mt-3 text-muted-foreground'>
					Положение Луны считается по формулам Жана Меёса из «Астрономических
					алгоритмов», положение Солнца тоже. Моменты новолуния, четвертей и
					полнолуния отличаются от точных эфемерид не больше чем на пару минут,
					восход Луны примерно на минуту. Знак зодиака, в котором стоит Луна,
					берётся из той же долготы.
				</p>
				<p className='mt-3 text-muted-foreground'>
					Если другой календарь показывает соседний номер лунного дня, почти
					всегда дело в городе или в часе: номер меняется вечером, с восходом
					Луны, а не в полночь. Нажмите на число в сетке, и под фазой будет
					видно, во сколько начинается следующий лунный день.
				</p>
				<p className='mt-3 text-muted-foreground'>
					Чего здесь нет: затмений, приливов и натальной карты. Значения лунных
					дней и списки благоприятных дел это традиция, а не расчёт, и календари
					расходятся в них между собой. Здесь показано только то, что можно
					проверить по небу.
				</p>
			</section>

			<section>
				<h2 className='text-2xl font-bold tracking-tight'>
					Как читать картинку
				</h2>
				<p className='mt-3 text-muted-foreground'>
					Освещённая часть диска показана светлым, тень — тёмным, а граница
					между ними называется терминатором. У растущей Луны свет с правой
					стороны, у убывающей — с левой. Запомнить помогает старое правило:
					если серп похож на букву «С», Луна стареет, то есть убывает; если к
					нему мысленно приставить палочку и получается «Р», она растёт. Знак
					зодиака, в котором находится Солнце в ту же дату, можно узнать в{' '}
					<Link
						href='/tools/zodiac-sign'
						className='cursor-pointer font-medium text-primary hover:underline'
					>
						калькуляторе знака зодиака
					</Link>
					.
				</p>
			</section>
		</div>
	)
}
