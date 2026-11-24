import Link from 'next/link'

const code = 'rounded bg-muted px-1.5 py-0.5 text-sm'

const ROWS: [string, string, string, string][] = [
	['Ё', 'E', 'yo', 'e'],
	['Й', 'I', 'j', 'y'],
	['Х', 'KH', 'x', 'h'],
	['Ц', 'TS', 'cz / c', 'c'],
	['Щ', 'SHCH', 'shh', 'sch'],
	['Ъ', 'IE', '``', 'не пишется'],
	['Ы', 'Y', 'y`', 'y'],
	['Ь', 'не пишется', '`', 'не пишется'],
	['Э', 'E', 'e`', 'e'],
	['Ю', 'IU', 'yu', 'yu'],
	['Я', 'IA', 'ya', 'ya']
]

export function TranslitSeo() {
	return (
		<div className='mx-auto mt-16 max-w-3xl space-y-12'>
			<section>
				<h2 className='text-2xl font-bold tracking-tight'>
					Какой транслит выбрать
				</h2>
				<p className='mt-3 text-muted-foreground'>
					Единого транслита нет. Одна и та же «Юля» в загранпаспорте станет
					IULIA, по ГОСТу yulya, а в адресе статьи yulya. Схема зависит от того,
					куда вы потом вставите текст. Для анкеты, билета, визы и банковской
					карты берите «Загранпаспорт»: авиакомпании и банки сверяют имя с
					паспортом буква в букву. «ГОСТ 7.79-2000» нужен для списков литературы
					и каталогов. «Для URL» делает из заголовка готовый адрес страницы.
				</p>
				<div className='mt-4 overflow-x-auto'>
					<table className='w-full border-collapse text-sm'>
						<thead>
							<tr className='border-b text-left'>
								<th className='py-2 pr-4 font-semibold'>Буква</th>
								<th className='py-2 pr-4 font-semibold'>Загранпаспорт</th>
								<th className='py-2 pr-4 font-semibold'>ГОСТ 7.79, сист. Б</th>
								<th className='py-2 font-semibold'>Для URL</th>
							</tr>
						</thead>
						<tbody>
							{ROWS.map(([letter, passport, gost, url]) => (
								<tr key={letter} className='border-b last:border-0'>
									<td className='py-2 pr-4 align-top'>{letter}</td>
									<td className='py-2 pr-4 align-top font-mono text-muted-foreground'>
										{passport}
									</td>
									<td className='py-2 pr-4 align-top font-mono text-muted-foreground'>
										{gost}
									</td>
									<td className='py-2 align-top font-mono text-muted-foreground'>
										{url}
									</td>
								</tr>
							))}
						</tbody>
					</table>
					<p className='mt-2 text-xs text-muted-foreground'>
						В таблице только буквы, на которых схемы расходятся. Остальные
						совпадают везде: А → a, Б → b, Ж → zh, Ч → ch, Ш → sh и так далее.
					</p>
				</div>
			</section>

			<section>
				<h2 className='text-2xl font-bold tracking-tight'>
					Транслитерация для загранпаспорта
				</h2>
				<p className='mt-3 text-muted-foreground'>
					Имя в загранпаспорте пишут по таблице из приложения к приказу МВД
					России от 31.12.2019 № 996. Она повторяет рекомендации ICAO, поэтому
					выглядит непривычно: Юлия превращается в IULIIA, Дарья в DARIA,
					Подъячев в PODIEIACHEV. Мягкий знак пропадает, твёрдый становится IE,
					Й пишется как I. Если имя уже где-то записано латиницей иначе, к
					анкете можно приложить заявление об изменении написания и документ с
					нужным вариантом: прежний загранпаспорт, свидетельство о браке, вид на
					жительство. Без такого заявления имя впишут строго по таблице.
				</p>
			</section>

			<section>
				<h2 className='text-2xl font-bold tracking-tight'>
					ГОСТ 7.79-2000 и почему он не годится для ссылок
				</h2>
				<p className='mt-3 text-muted-foreground'>
					Система Б этого ГОСТа обходится без букв с диакритикой, но твёрдый и
					мягкий знак, Ы и Э передаёт обратным апострофом:{' '}
					<code className={code}>объём</code> →{' '}
					<code className={code}>ob``yom</code>,{' '}
					<code className={code}>мэр</code> → <code className={code}>me`r</code>
					. У Ц два варианта: c перед i, e, y, j и cz во всех остальных случаях
					(цирк → cirk, лицо → liczo). Транслитератор делает это сам. В адресе
					страницы обратный апостроф превращается в{' '}
					<code className={code}>%60</code>, поэтому для ссылок есть отдельная
					схема.
				</p>
			</section>

			<section>
				<h2 className='text-2xl font-bold tracking-tight'>Транслит для URL</h2>
				<p className='mt-3 text-muted-foreground'>
					Официальной таблицы у Яндекса нет. «Яндексовой» называют упрощённую
					схему, которой в рунете пишут адреса страниц: Х → h, Щ → sch, Ц → c,
					твёрдый и мягкий знаки выбрасываются. Режим «Для URL» переводит
					заголовок в строчные буквы, меняет пробелы и знаки препинания на
					дефисы и убирает дефисы по краям. Каждая строка обрабатывается
					отдельно, так что можно вставить сразу список заголовков. Для ссылки с
					метками для рекламы пригодится{' '}
					<Link
						href='/tools/utm-link-builder'
						className='cursor-pointer font-medium text-primary hover:underline'
					>
						конструктор UTM-меток
					</Link>
					.
				</p>
			</section>

			<p className='text-muted-foreground'>
				Текст переводится прямо в браузере и никуда не отправляется. Если в
				русском тексте затесались латинские буквы-двойники (английская c вместо
				русской с), транслит пропустит их как есть. Найти такие буквы поможет{' '}
				<Link
					href='/tools/latin-cyrillic-checker'
					className='cursor-pointer font-medium text-primary hover:underline'
				>
					проверка на латиницу в русском тексте
				</Link>
				.
			</p>
		</div>
	)
}
