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
					Из-за дробной длины месяца лунных дней бывает то 29, то 30, и
					последний оказывается коротким — иногда всего несколько часов. Первый
					лунный день начинается в момент новолуния, а не в полночь, поэтому он
					тоже редко бывает полным.
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
					Расчёт идёт по средней длине синодического месяца от опорного
					новолуния 6 января 2000 года. Это приближение: орбита Луны вытянута, и
					настоящее новолуние отклоняется от среднего на несколько часов, в
					редких случаях до полусуток. Для фазы, лунного дня и календарной сетки
					такой точности достаточно, и день почти всегда совпадает с
					астрономическим.
				</p>
				<p className='mt-3 text-muted-foreground'>
					Чего этим методом делать нельзя: рассчитывать затмения, приливы или
					астрологическую карту. Там нужны эфемериды — таблицы точных положений
					небесных тел, а не средний период. Сказать об этом честнее, чем
					обещать астрономическую точность, которой здесь нет.
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
