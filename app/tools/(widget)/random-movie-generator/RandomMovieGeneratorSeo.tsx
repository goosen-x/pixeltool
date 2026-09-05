export function RandomMovieGeneratorSeo() {
	return (
		<div className='mx-auto mt-16 max-w-3xl space-y-12'>
			<section>
				<h2 className='text-2xl font-bold tracking-tight'>
					Когда листать каталоги надоело
				</h2>
				<p className='mt-3 text-muted-foreground'>
					Выбор из бесконечного списка часто занимает больше времени, чем сам
					просмотр — знакомый эффект paradox of choice. Генератор решает задачу
					в одно нажатие: выбирайте жанр или оставьте «Любой жанр» и получите
					один конкретный фильм вместо десятков вариантов.
				</p>
			</section>

			<section>
				<h2 className='text-2xl font-bold tracking-tight'>
					Откуда данные о фильмах
				</h2>
				<p className='mt-3 text-muted-foreground'>
					Название, постер и рейтинги Кинопоиска и IMDb подтягиваются напрямую с
					Кинопоиска в момент запроса — не статичный список, а живая подборка
					фильмов с рейтингом от 7 из 10. Ссылка «Открыть на Кинопоиске» под
					каждым результатом ведёт к полному описанию, трейлеру и отзывам.
				</p>

				<p className='mt-4 text-muted-foreground'>
					Фильтр по жанру работает через идентификаторы Кинопоиска. Доступны
					восемь жанров плюс выбор без фильтра:
				</p>
				<div className='mt-4 overflow-x-auto'>
					<table className='w-full text-left text-sm'>
						<thead>
							<tr className='border-b text-muted-foreground'>
								<th className='py-2 pr-4 font-medium'>Жанр</th>
								<th className='py-2 font-medium'>ID в Кинопоиске</th>
							</tr>
						</thead>
						<tbody className='text-foreground'>
							<tr className='border-b'>
								<td className='py-2 pr-4'>Драма</td>
								<td className='py-2 font-mono'>2</td>
							</tr>
							<tr className='border-b'>
								<td className='py-2 pr-4'>Комедия</td>
								<td className='py-2 font-mono'>13</td>
							</tr>
							<tr className='border-b'>
								<td className='py-2 pr-4'>Боевик</td>
								<td className='py-2 font-mono'>11</td>
							</tr>
							<tr className='border-b'>
								<td className='py-2 pr-4'>Фантастика</td>
								<td className='py-2 font-mono'>6</td>
							</tr>
							<tr className='border-b'>
								<td className='py-2 pr-4'>Ужасы</td>
								<td className='py-2 font-mono'>17</td>
							</tr>
							<tr className='border-b'>
								<td className='py-2 pr-4'>Мультфильм</td>
								<td className='py-2 font-mono'>18</td>
							</tr>
							<tr className='border-b'>
								<td className='py-2 pr-4'>Фэнтези</td>
								<td className='py-2 font-mono'>12</td>
							</tr>
							<tr>
								<td className='py-2 pr-4'>Триллер</td>
								<td className='py-2 font-mono'>1</td>
							</tr>
						</tbody>
					</table>
				</div>
			</section>
		</div>
	)
}
