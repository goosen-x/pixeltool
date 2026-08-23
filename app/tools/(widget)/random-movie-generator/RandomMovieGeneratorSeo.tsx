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
			</section>
		</div>
	)
}
