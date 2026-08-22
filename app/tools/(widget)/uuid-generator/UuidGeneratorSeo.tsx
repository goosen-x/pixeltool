import Link from 'next/link'

/**
 * SEO-контент под генератором UUID. Закрывает то, что не помещается в FAQ:
 * UUID vs GUID (отдельный кластер спроса — «guid generator» 594 + «генератор
 * guid» 423), четыре формата записи (соответствуют выпадающему списку в самом
 * туле), выбор версии под первичный ключ, генерация в коде («как сгенерировать
 * uuid в postgresql» и соседние ~250/мес) и разбор структуры строки.
 *
 * Намеренно НЕ дублирует FAQ, который отвечает коротко на «в чём разница
 * версий», «бывают ли коллизии», «UUID или автоинкремент»: здесь те же темы
 * раскрыты практически — таблицами, кодом и разбором по битам.
 */

const FORMATS: [string, string, string][] = [
	[
		'Стандартный',
		'9efcd058-79dd-485f-94a0-22cf61231d0f',
		'Канонический вид из RFC 9562. Его ждут PostgreSQL, MySQL и большинство API'
	],
	[
		'Без дефисов',
		'9efcd05879dd485f94a022cf61231d0f',
		'32 символа, компактнее в URL и ключах кэша, дефисы всегда можно вернуть'
	],
	[
		'Верхний регистр',
		'9EFCD058-79DD-485F-94A0-22CF61231D0F',
		'Привычен в мире Microsoft. Сравнивать UUID нужно без учёта регистра'
	],
	[
		'URN',
		'urn:uuid:9efcd058-79dd-485f-94a0-22cf61231d0f',
		'Форма с префиксом для XML, RDF и других мест, где нужен полноценный URI'
	]
]

const VERSIONS: [string, string, string][] = [
	[
		'v4',
		'122 случайных бита',
		'Значение по умолчанию. Берите, если ID не станет первичным ключом большой таблицы'
	],
	[
		'v7',
		'Время + случайность',
		'Лучший выбор под первичный ключ, сортируется по времени создания'
	],
	[
		'v1',
		'Время + MAC-адрес',
		'Наследие. Раскрывает устройство-источник, для новых проектов не нужен'
	],
	[
		'nil',
		'Только нули',
		'Заглушка «идентификатора нет», удобнее NULL, когда колонка обязательная'
	]
]

const SNIPPETS: [string, string][] = [
	['PostgreSQL 13+', 'gen_random_uuid()'],
	['PostgreSQL (v7)', 'uuidv7(), начиная с версии 18'],
	['MySQL 8+', 'UUID()'],
	['JavaScript / Node 19+', 'crypto.randomUUID()'],
	['Python', 'import uuid; uuid.uuid4()'],
	['Go', 'github.com/google/uuid → uuid.New()'],
	['C# / .NET', 'Guid.NewGuid()'],
	['Java', 'UUID.randomUUID()']
]

export function UuidGeneratorSeo() {
	return (
		<div className='mx-auto mt-16 max-w-3xl space-y-12'>
			<section>
				<h2 className='text-2xl font-bold tracking-tight'>
					Нужен GUID: подойдёт этот же генератор
				</h2>
				<p className='mt-3 text-muted-foreground'>
					UUID и GUID — одно и то же, разное только название, второе прижилось в
					экосистеме Microsoft. На практике отличается лишь запись. В реестре
					Windows и в коде на C# идентификатор часто носят в фигурных скобках:{' '}
					<code className='rounded bg-secondary px-1.5 py-0.5 font-mono text-sm'>
						{'{6f9619ff-8b86-d011-b42d-00cf4fc964ff}'}
					</code>
					. Скобки — часть оформления, а не значения, перед сравнением или
					записью в базу их снимают.
				</p>
			</section>

			<section>
				<h2 className='text-2xl font-bold tracking-tight'>
					Четыре формата записи и где какой нужен
				</h2>
				<p className='mt-3 text-muted-foreground'>
					Один и тот же UUID можно записать по-разному, на значение это не
					влияет. Но принимающая сторона обычно ждёт конкретный вид:
				</p>
				<div className='mt-4 overflow-x-auto'>
					<table className='w-full border-collapse text-sm'>
						<thead>
							<tr className='border-b text-left'>
								<th className='py-2 pr-4 font-semibold'>Формат</th>
								<th className='py-2 pr-4 font-semibold'>Пример</th>
								<th className='py-2 font-semibold'>Когда нужен</th>
							</tr>
						</thead>
						<tbody>
							{FORMATS.map(([name, example, when]) => (
								<tr key={name} className='border-b last:border-0'>
									<td className='py-2 pr-4 align-top whitespace-nowrap'>
										{name}
									</td>
									<td className='py-2 pr-4 align-top'>
										<code className='font-mono text-xs break-all'>
											{example}
										</code>
									</td>
									<td className='py-2 align-top text-muted-foreground'>
										{when}
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			</section>

			<section>
				<h2 className='text-2xl font-bold tracking-tight'>
					Какую кнопку версии нажать
				</h2>
				<p className='mt-3 text-muted-foreground'>
					Короткая шпаргалка по переключателю выше. Почему версии устроены
					именно так и чем v7 лучше v1, разобрано в{' '}
					<Link
						href='/blog/chto-takoe-uuid'
						className='cursor-pointer font-medium text-primary hover:underline'
					>
						статье про версии UUID
					</Link>
					.
				</p>
				<div className='mt-4 overflow-x-auto'>
					<table className='w-full border-collapse text-sm'>
						<thead>
							<tr className='border-b text-left'>
								<th className='py-2 pr-4 font-semibold'>Версия</th>
								<th className='py-2 pr-4 font-semibold'>Из чего собран</th>
								<th className='py-2 font-semibold'>Когда брать</th>
							</tr>
						</thead>
						<tbody>
							{VERSIONS.map(([version, made, when]) => (
								<tr key={version} className='border-b last:border-0'>
									<td className='py-2 pr-4 align-top'>
										<code className='font-mono text-xs'>{version}</code>
									</td>
									<td className='py-2 pr-4 align-top whitespace-nowrap'>
										{made}
									</td>
									<td className='py-2 align-top text-muted-foreground'>
										{when}
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			</section>

			<section>
				<h2 className='text-2xl font-bold tracking-tight'>
					Как сгенерировать UUID в коде
				</h2>
				<p className='mt-3 text-muted-foreground'>
					Онлайн-генератор удобен, когда нужно несколько значений руками: для
					сида базы, теста или заглушки в конфиге. В самом приложении UUID
					генерируют средствами языка или СУБД, отдельная библиотека почти нигде
					уже не нужна:
				</p>
				<div className='mt-4 overflow-x-auto'>
					<table className='w-full border-collapse text-sm'>
						<thead>
							<tr className='border-b text-left'>
								<th className='py-2 pr-4 font-semibold'>Среда</th>
								<th className='py-2 font-semibold'>Вызов</th>
							</tr>
						</thead>
						<tbody>
							{SNIPPETS.map(([env, call]) => (
								<tr key={env} className='border-b last:border-0'>
									<td className='py-2 pr-4 align-top whitespace-nowrap'>
										{env}
									</td>
									<td className='py-2 align-top'>
										<code className='font-mono text-xs break-all'>{call}</code>
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
				<p className='mt-4 text-muted-foreground'>
					Все перечисленные функции дают v4 и берут случайность у
					криптографического генератора операционной системы. А вот{' '}
					<code className='rounded bg-secondary px-1.5 py-0.5 font-mono text-sm'>
						Math.random()
					</code>{' '}
					для сборки UUID вручную не годится. Он не криптостойкий, значения из
					него предсказуемы, и «уникальность» такого идентификатора держится
					только на удаче.
				</p>
			</section>

			<section>
				<h2 className='text-2xl font-bold tracking-tight'>
					Как понять, что перед вами UUID и какой версии
				</h2>
				<p className='mt-3 text-muted-foreground'>
					Строка всегда состоит из 32 шестнадцатеричных символов, разбитых
					дефисами по схеме 8-4-4-4-12. Версия и вариант зашиты прямо в неё, и
					прочитать их можно глазами:
				</p>
				<p className='mt-4 overflow-x-auto'>
					<code className='font-mono text-sm break-all whitespace-nowrap'>
						9efcd058-79dd-<strong className='text-foreground'>4</strong>
						85f-<strong className='text-foreground'>9</strong>
						4a0-22cf61231d0f
					</code>
				</p>
				<ul className='mt-4 space-y-2 text-muted-foreground'>
					<li>
						Первый символ третьей группы задаёт версию. Здесь{' '}
						<code className='rounded bg-secondary px-1.5 py-0.5 font-mono text-xs'>
							4
						</code>
						, то есть случайный UUID. У v7 на этом месте будет{' '}
						<code className='rounded bg-secondary px-1.5 py-0.5 font-mono text-xs'>
							7
						</code>
						.
					</li>
					<li>
						Первый символ четвёртой группы задаёт вариант. Значения{' '}
						<code className='rounded bg-secondary px-1.5 py-0.5 font-mono text-xs'>
							8
						</code>
						,{' '}
						<code className='rounded bg-secondary px-1.5 py-0.5 font-mono text-xs'>
							9
						</code>
						,{' '}
						<code className='rounded bg-secondary px-1.5 py-0.5 font-mono text-xs'>
							a
						</code>{' '}
						или{' '}
						<code className='rounded bg-secondary px-1.5 py-0.5 font-mono text-xs'>
							b
						</code>{' '}
						означают вариант RFC, тот, что используют все современные
						библиотеки.
					</li>
				</ul>
				<p className='mt-4 text-muted-foreground'>
					Генератор выше показывает разобранные версию и вариант под полем. По
					ним удобно проверить чужой идентификатор, не считая символы вручную.
				</p>
			</section>

			<section>
				<h2 className='text-2xl font-bold tracking-tight'>Чего UUID не даёт</h2>
				<p className='mt-3 text-muted-foreground'>
					Уникальность — единственное, что гарантирует формат. Отсюда
					ограничения, о которые спотыкаются регулярно.
				</p>
				<ul className='mt-4 space-y-2 text-muted-foreground'>
					<li>
						Это не секрет. UUID v4 нельзя угадать, но он попадает в адресную
						строку, историю браузера, логи и заголовок{' '}
						<code className='rounded bg-secondary px-1.5 py-0.5 font-mono text-xs'>
							Referer
						</code>
						. Как токен сессии или ссылка на сброс пароля он не годится, для
						этого нужны значения с ограниченным сроком жизни.
					</li>
					<li>
						v1 и v7 раскрывают время. Из такого идентификатора извлекается
						момент создания записи с точностью до миллисекунд, а v1 выдаёт ещё и
						сетевой адрес машины. Там, где порядок и время регистрации не должны
						быть видны снаружи, берите v4.
					</li>
					<li>
						Он не защищает от дублей. Два вызова генератора для одной и той же
						сущности дадут две разные строки. Уникальность идентификатора и
						уникальность данных — разные вещи, и вторую по-прежнему обеспечивает
						ограничение в базе.
					</li>
					<li>
						Он не бесплатный по месту. UUID занимает 16 байт против 4 у обычного{' '}
						<code className='rounded bg-secondary px-1.5 py-0.5 font-mono text-xs'>
							int
						</code>
						, и эти байты повторяются в каждом внешнем ключе и в каждом индексе,
						который на них ссылается. На сотне строк разницы нет, на десятках
						миллионов она заметна на диске и в памяти под индексы.
					</li>
				</ul>
			</section>

			<p className='text-muted-foreground'>
				Разбор всех версий и пространства значений, из-за которого столкновение
				практически невозможно, есть в статье{' '}
				<Link
					href='/blog/chto-takoe-uuid'
					className='cursor-pointer font-medium text-primary hover:underline'
				>
					Что такое UUID и чем отличаются версии v1, v4, v7
				</Link>
				.
			</p>
		</div>
	)
}
