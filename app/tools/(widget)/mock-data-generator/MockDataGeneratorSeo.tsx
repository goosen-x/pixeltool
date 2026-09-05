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
					Конфигурируемый генератор, где задают список полей (имя, email,
					телефон, адрес), количество строк и экспорт в CSV, SQL или Excel,
					делают сервисы вроде Mockaroo. Наш инструмент устроен иначе, это
					подборка реальных бесплатных публичных API. Вы выбираете готовый
					эндпоинт и получаете живой ответ настоящего сервиса, с реальной
					структурой полей, задержкой сети и форматом данных, какими они будут в
					проде. Это удобнее, когда нужно быстро посмотреть, как выглядит ответ
					конкретного API, а не сгенерировать произвольный набор строк под свою
					схему. А если нужен просто уникальный идентификатор для записи, без
					остальных полей, быстрее взять{' '}
					<Link
						href='/tools/uuid-generator'
						className='cursor-pointer font-medium text-primary hover:underline'
					>
						генератор UUID
					</Link>
					.
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
						Пользователи и профили. JSONPlaceholder и RandomUser отдают готовые
						профили с именами, аватарами и адресами для вёрстки списков и
						карточек.
					</li>
					<li>
						Записи и контент. Посты блога с комментариями, цитаты,
						изображения-заглушки для тестовых лент и превью.
					</li>
					<li>
						Товары и e-commerce. Fake Store API и DummyJSON отдают товары с
						ценами, категориями и изображениями для витрин и карточек товара.
					</li>
					<li>
						Географические данные. Страны и погода для форм с выбором региона
						или виджетов локации.
					</li>
					<li>
						Развлечения. Покемоны, персонажи сериалов, факты о животных. Удобно
						для демо-контента, который не выглядит как унылый lorem ipsum.
					</li>
					<li>
						Утилиты. Задачи, httpbin для проверки самого запроса, советы дня.
					</li>
				</ul>
				<p className='mt-4 text-muted-foreground'>
					Полный список источников и что каждый отдаёт:
				</p>
				<div className='mt-4 overflow-x-auto'>
					<table className='w-full text-left text-sm'>
						<thead>
							<tr className='border-b text-muted-foreground'>
								<th className='py-2 pr-4 font-medium'>Источник</th>
								<th className='py-2 font-medium'>Что отдаёт</th>
							</tr>
						</thead>
						<tbody className='text-foreground'>
							<tr className='border-b'>
								<td className='py-2 pr-4'>JSONPlaceholder</td>
								<td className='py-2'>
									Тестовых пользователей, записи блога, список задач
								</td>
							</tr>
							<tr className='border-b'>
								<td className='py-2 pr-4'>RandomUser.me</td>
								<td className='py-2'>Случайных пользователей с фотографиями</td>
							</tr>
							<tr className='border-b'>
								<td className='py-2 pr-4'>DummyJSON</td>
								<td className='py-2'>
									Случайные цитаты и товары с категориями
								</td>
							</tr>
							<tr className='border-b'>
								<td className='py-2 pr-4'>Lorem Picsum</td>
								<td className='py-2'>Случайные изображения-заглушки</td>
							</tr>
							<tr className='border-b'>
								<td className='py-2 pr-4'>Fake Store API</td>
								<td className='py-2'>
									Товары интернет-магазина с ценами и картинками
								</td>
							</tr>
							<tr className='border-b'>
								<td className='py-2 pr-4'>mledoze/countries</td>
								<td className='py-2'>Подробные данные о странах</td>
							</tr>
							<tr className='border-b'>
								<td className='py-2 pr-4'>Open-Meteo</td>
								<td className='py-2'>Текущую погоду</td>
							</tr>
							<tr className='border-b'>
								<td className='py-2 pr-4'>PokeAPI</td>
								<td className='py-2'>Список покемонов с подробностями</td>
							</tr>
							<tr className='border-b'>
								<td className='py-2 pr-4'>Rick and Morty API</td>
								<td className='py-2'>Персонажей сериала «Рик и Морти»</td>
							</tr>
							<tr className='border-b'>
								<td className='py-2 pr-4'>Chuck Norris API</td>
								<td className='py-2'>Шутки о Чаке Норрисе</td>
							</tr>
							<tr className='border-b'>
								<td className='py-2 pr-4'>httpbin</td>
								<td className='py-2'>Проверку HTTP-запросов и ответов</td>
							</tr>
							<tr className='border-b'>
								<td className='py-2 pr-4'>Dog API</td>
								<td className='py-2'>Факты о собаках</td>
							</tr>
							<tr className='border-b'>
								<td className='py-2 pr-4'>Cat Facts</td>
								<td className='py-2'>Факты о кошках</td>
							</tr>
							<tr className='border-b'>
								<td className='py-2 pr-4'>Advice Slip API</td>
								<td className='py-2'>Случайный совет дня</td>
							</tr>
							<tr>
								<td className='py-2 pr-4'>Bored API</td>
								<td className='py-2'>Идею, чем заняться от скуки</td>
							</tr>
						</tbody>
					</table>
				</div>
			</section>

			<section>
				<h2 className='text-2xl font-bold tracking-tight'>
					Пример: как использовать ответ PokeAPI
				</h2>
				<p className='mt-3 text-muted-foreground'>
					Эндпоинт «Список покемонов» отдаёт только имена и ссылки на
					подробности. Так устроен PokeAPI, чтобы не гонять по сети лишний вес.
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
					объект содержит ссылку на себя, а не все поля сразу. Полученный ответ
					удобно сразу привести в читаемый вид в{' '}
					<Link
						href='/tools/json-tools'
						className='cursor-pointer font-medium text-primary hover:underline'
					>
						JSON-инструментах
					</Link>
					.
				</p>
			</section>

			<p className='text-muted-foreground'>
				Почему почти все эти API отвечают именно JSON и как устроен этот формат,
				рассказано в статье{' '}
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
