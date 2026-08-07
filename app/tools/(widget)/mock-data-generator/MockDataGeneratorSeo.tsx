import Link from 'next/link'

/**
 * SEO-контент под инструментом. Отдельная секция про Mockaroo намеренно
 * закрывает разрыв ожиданий: интент «генератор тестовых данных» в поиске
 * ведёт на конфигурируемые генераторы полей, а этот тул — витрина готовых
 * бесплатных API. Лучше явно объяснить разницу, чем оставить человека
 * недоумевать, почему нет настройки полей.
 */
export function MockDataGeneratorSeo() {
	return (
		<div className='mx-auto mt-16 max-w-3xl space-y-12'>
			<section>
				<h2 className='text-2xl font-bold tracking-tight'>
					Чем это отличается от генератора тестовых данных
				</h2>
				<p className='mt-3 text-muted-foreground'>
					Если вам нужен конфигурируемый генератор — задать список полей (имя,
					email, телефон, адрес), количество строк и экспортировать в CSV, SQL
					или Excel — это делают сервисы вроде Mockaroo. Наш инструмент устроен
					иначе: это подборка реальных бесплатных публичных API. Вы выбираете
					готовый эндпоинт — и получаете живой ответ настоящего сервиса: с
					реальной структурой полей, задержкой сети и форматом данных, какими
					они будут в проде. Это удобнее, когда нужно быстро посмотреть, как
					выглядит ответ конкретного API, а не сгенерировать произвольный набор
					строк под свою схему.
				</p>
			</section>

			<section>
				<h2 className='text-2xl font-bold tracking-tight'>
					Какие API входят и когда какой использовать
				</h2>
				<p className='mt-3 text-muted-foreground'>
					Все эндпоинты бесплатны, не требуют регистрации и API-ключа, кроме
					одного демо-примера. Шесть категорий:
				</p>
				<ul className='mt-3 list-disc space-y-2 pl-5 text-muted-foreground'>
					<li>
						<strong className='text-foreground'>Пользователи и профили</strong>{' '}
						— JSONPlaceholder, RandomUser, ReqRes: готовые профили с именами,
						аватарами, адресами для верстки списков и карточек.
					</li>
					<li>
						<strong className='text-foreground'>Записи и контент</strong> —
						посты блога с комментариями, цитаты, изображения-заглушки для
						тестовых лент и превью.
					</li>
					<li>
						<strong className='text-foreground'>Товары и e-commerce</strong> —
						Fake Store API и DummyJSON: товары с ценами, категориями и
						изображениями для витрин и карточек товара.
					</li>
					<li>
						<strong className='text-foreground'>Географические данные</strong> —
						страны и погода для форм с выбором региона или виджетов локации.
					</li>
					<li>
						<strong className='text-foreground'>Развлечения</strong> — покемоны,
						персонажи сериалов, факты о животных: удобно для демо-контента,
						который не выглядит как унылый lorem ipsum.
					</li>
					<li>
						<strong className='text-foreground'>Утилиты</strong> — задачи,
						httpbin для проверки самого запроса, советы дня.
					</li>
				</ul>
			</section>

			<p className='text-muted-foreground'>
				Про то, почему почти все эти API отвечают именно JSON и как устроен этот
				формат — в статье{' '}
				<Link
					href='/blog/chto-takoe-json'
					className='cursor-pointer font-medium text-primary hover:underline'
				>
					Что такое JSON
				</Link>
				.
			</p>
		</div>
	)
}
