import { Formula } from '@/components/seo/Formula'

export function WorldAquaticsPointsCalculatorSeo() {
	return (
		<div className='mx-auto mt-16 max-w-3xl space-y-12'>
			<section>
				<h2 className='text-2xl font-bold tracking-tight'>
					Как сравнить 100 м вольным и 1500 м
				</h2>
				<p className='mt-3 text-muted-foreground'>
					Пловец на 1500 м и пловец на 50 м баттерфляем никогда не встретятся на
					одной дорожке, но тренеру всё равно нужно сравнивать их результаты.
					Система очков World Aquatics (бывшая FINA) переводит время в любой
					дисциплине на единую шкалу, где 1000 очков — уровень действующего
					мирового рекорда.
				</p>

				<p className='mt-4 text-muted-foreground'>
					Базовые времена для вольного стиля в 50-метровом бассейне, из тех же
					официальных таблиц, что использует калькулятор. Проплыть ровно базовое
					время означает получить 1000 очков:
				</p>
				<div className='mt-4 overflow-x-auto'>
					<table className='w-full text-left text-sm'>
						<thead>
							<tr className='border-b text-muted-foreground'>
								<th className='py-2 pr-4 font-medium'>Дистанция</th>
								<th className='py-2 pr-4 font-medium'>Мужчины</th>
								<th className='py-2 font-medium'>Женщины</th>
							</tr>
						</thead>
						<tbody className='text-foreground'>
							<tr className='border-b'>
								<td className='py-2 pr-4'>50 м</td>
								<td className='py-2 pr-4 font-mono'>20,91</td>
								<td className='py-2 font-mono'>23,61</td>
							</tr>
							<tr className='border-b'>
								<td className='py-2 pr-4'>100 м</td>
								<td className='py-2 pr-4 font-mono'>46,40</td>
								<td className='py-2 font-mono'>51,71</td>
							</tr>
							<tr className='border-b'>
								<td className='py-2 pr-4'>200 м</td>
								<td className='py-2 pr-4 font-mono'>1:42,00</td>
								<td className='py-2 font-mono'>1:52,23</td>
							</tr>
							<tr className='border-b'>
								<td className='py-2 pr-4'>400 м</td>
								<td className='py-2 pr-4 font-mono'>3:39,96</td>
								<td className='py-2 font-mono'>3:54,18</td>
							</tr>
							<tr className='border-b'>
								<td className='py-2 pr-4'>800 м</td>
								<td className='py-2 pr-4 font-mono'>7:32,12</td>
								<td className='py-2 font-mono'>8:04,12</td>
							</tr>
							<tr>
								<td className='py-2 pr-4'>1500 м</td>
								<td className='py-2 pr-4 font-mono'>14:30,67</td>
								<td className='py-2 font-mono'>15:20,48</td>
							</tr>
						</tbody>
					</table>
				</div>
			</section>

			<section>
				<h2 className='text-2xl font-bold tracking-tight'>
					Почему в формуле куб, а не проценты
				</h2>
				<p className='mt-3 text-muted-foreground'>
					Очки считаются по кубической кривой. Куб, а не проценты, потому что
					доли секунды на разных дистанциях весят по-разному: сократить 50 м
					вольным на 0.1 с намного труднее, чем срезать ту же долю секунды со
					счёта на 1500 м. Очки округляются вниз до целого, как в официальном
					калькуляторе.
				</p>
				<Formula
					latex='P = 1000 \cdot \left(\dfrac{B}{T}\right)^{3}'
					caption='B — базовое время, мировой рекорд на начало сезона, T — время пловца'
				/>
			</section>

			<section>
				<h2 className='text-2xl font-bold tracking-tight'>
					Длинная и короткая вода — разные таблицы
				</h2>
				<p className='mt-3 text-muted-foreground'>
					Базовое время своё для каждой связки пол, дистанция и бассейн, где
					бассейн бывает 50 м (LCM) или 25 м (SCM). В короткой воде рекорды
					обычно на пару секунд быстрее, чем в длинной, на тех же 100 метрах,
					так что сравнивать очки между LCM и SCM напрямую нельзя. Это две
					разные шкалы. Таблицы к тому же обновляются каждый сезон, когда падает
					очередной мировой рекорд, поэтому старое сравнение через год-два может
					слегка сместиться.
				</p>
			</section>
		</div>
	)
}
