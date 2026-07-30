import Link from 'next/link'

/**
 * SEO-контент под генератором UUID. Закрывает то, что не поместилось в FAQ:
 * UUID vs GUID (отдельный кластер спроса) и практический совет по выбору
 * версии для первичного ключа базы данных.
 */
export function UuidGeneratorSeo() {
	return (
		<div className='mx-auto mt-16 max-w-3xl space-y-12'>
			<section>
				<h2 className='text-2xl font-bold tracking-tight'>UUID и GUID</h2>
				<p className='mt-3 text-muted-foreground'>
					Это один и тот же формат — 128-битный уникальный идентификатор. GUID —
					более старое название, которое закрепилось в мире Microsoft (реестр
					Windows, .NET, COM); в остальном вебе и в базах данных прижилось UUID.
					Разницы в самом значении нет — этот генератор одинаково подходит для
					обеих задач, в любом из четырёх форматов записи.
				</p>
			</section>

			<section>
				<h2 className='text-2xl font-bold tracking-tight'>
					Какую версию выбрать для первичного ключа базы данных
				</h2>
				<p className='mt-3 text-muted-foreground'>
					Version 4 (случайный) неудобен как первичный ключ таблицы: значения
					ложатся в случайные места индекса, и вставка новых строк получается
					медленнее, чем с последовательным ID. Version 7 решает это —
					начинается с временной метки, поэтому новые записи растут в конец
					индекса почти как автоинкремент, но остаются такими же
					непредсказуемыми для внешнего наблюдателя. Version 1 умеет то же
					самое, но старым способом и с меньшими гарантиями — для новых проектов
					вместо него сейчас обычно берут v7.
				</p>
			</section>

			<p className='text-muted-foreground'>
				Подробный разбор всех версий и пространства значений — почему
				столкновение практически невозможно — в статье{' '}
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
