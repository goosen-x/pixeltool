import Link from 'next/link'
import { GuideCodeBlock } from '@/components/widgets/GuideCodeBlock'

// Четыре стартовых покемона — для превью ниже. Спрайты берём напрямую из
// GitHub-репозитория PokeAPI: тот же адрес, что приходит в ответе API
// (sprites.front_default), но без живого запроса — на статичной странице
// он не нужен, а рендер получается предсказуемым.
const SAMPLE_POKEMON = [
	{ id: 1, name: 'bulbasaur' },
	{ id: 4, name: 'charmander' },
	{ id: 7, name: 'squirtle' },
	{ id: 25, name: 'pikachu' }
]
const spriteUrl = (id: number) =>
	`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`

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
					Все эндпоинты бесплатны и не требуют регистрации или API-ключа. Шесть
					категорий:
				</p>
				<ul className='mt-3 list-disc space-y-2 pl-5 text-muted-foreground'>
					<li>
						<strong className='text-foreground'>Пользователи и профили</strong>{' '}
						— JSONPlaceholder и RandomUser: готовые профили с именами,
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

			<section>
				<h2 className='text-2xl font-bold tracking-tight'>
					Пример: как использовать ответ PokeAPI
				</h2>
				<p className='mt-3 text-muted-foreground'>
					Эндпоинт «Список покемонов» отдаёт только имена и ссылки на
					подробности — так устроен PokeAPI, чтобы не гонять по сети лишний вес.
					Имя показать можно сразу, а за картинкой и характеристиками нужен
					второй запрос по адресу из <code>url</code>:
				</p>
				<GuideCodeBlock
					className='mt-4'
					language='jsx'
					code={`const list = await fetch(
  'https://pokeapi.co/api/v2/pokemon?limit=10'
).then(res => res.json())

// list.results — только { name, url }, для карточки нужны детали
const pokemon = await Promise.all(
  list.results.map(p => fetch(p.url).then(res => res.json()))
)

function PokemonCard({ name, sprite }) {
  return (
    <div className="rounded-xl border p-4 text-center">
      <img src={sprite} alt={name} className="mx-auto h-20 w-20" />
      <p className="mt-2 text-sm capitalize">{name}</p>
    </div>
  )
}

// pokemon[i].sprites.front_default — прямая ссылка на картинку
<div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
  {pokemon.map(p => (
    <PokemonCard
      key={p.name}
      name={p.name}
      sprite={p.sprites.front_default}
    />
  ))}
</div>`}
				/>

				<p className='mt-6 text-sm text-muted-foreground'>
					Так это выглядит на странице:
				</p>
				<div className='mt-3 grid grid-cols-2 gap-4 sm:grid-cols-4'>
					{SAMPLE_POKEMON.map(p => (
						<div key={p.name} className='rounded-xl border p-4 text-center'>
							{/* eslint-disable-next-line @next/next/no-img-element -- статичный внешний спрайт, не оптимизируем через next/image */}
							<img
								src={spriteUrl(p.id)}
								alt={p.name}
								className='mx-auto h-20 w-20'
								width={80}
								height={80}
							/>
							<p className='mt-2 text-sm text-foreground capitalize'>
								{p.name}
							</p>
						</div>
					))}
				</div>

				<p className='mt-6 text-muted-foreground'>
					Тот же приём подходит для любого списочного эндпоинта отсюда, где
					объект содержит ссылку на себя, а не все поля сразу.
				</p>
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
