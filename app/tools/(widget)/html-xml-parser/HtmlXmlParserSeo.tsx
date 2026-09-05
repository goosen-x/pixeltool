import Link from 'next/link'

/**
 * SEO-контент под инструментом форматирования. Отдельным компонентом, чтобы не
 * раздувать page.tsx. Текст покрывает смысловое поле «форматировать/минифициро-
 * вать HTML и XML» и разводит инструмент с «Проверкой HTML» (валидация и анализ
 * живут там) — без набивки ключей, как объяснение.
 */
export function HtmlXmlParserSeo() {
	return (
		<div className='mx-auto mt-16 max-w-3xl space-y-12'>
			<section>
				<h2 className='text-2xl font-bold tracking-tight'>
					Как отформатировать HTML или XML онлайн
				</h2>
				<p className='mt-3 text-muted-foreground'>
					Вставьте код в поле, и результат появится сразу, нажимать ничего не
					нужно. Инструмент разбирает разметку и выстраивает теги по вложенности
					с отступами: можно выбрать 2, 4 или 8 пробелов и решить, сохранять ли
					комментарии. Если разметка невалидна, скажем в XML не закрыт тег,
					вместо результата покажется ошибка разбора. Готовый код копируется в
					буфер или скачивается файлом. Всё считается в браузере, вставленное
					никуда не отправляется.
				</p>
			</section>

			<section>
				<h2 className='text-2xl font-bold tracking-tight'>
					Форматирование и минификация: обратные операции
				</h2>
				<p className='mt-3 text-muted-foreground'>
					Форматирование (beautify) делает код читаемым: расставляет переносы и
					отступы, чтобы была видна структура документа. Минификация работает
					наоборот, она убирает лишние пробелы, переносы и, по желанию,
					комментарии и сжимает разметку в одну строку ради меньшего размера
					файла. Переключаются они одним тумблером «Минифицировать». Тип
					документа определяется автоматически по содержимому, так что
					инструмент одинаково работает и с HTML, и с XML. Для JSON та же пара
					операций (форматирование и минификация) собрана отдельно в{' '}
					<Link
						href='/tools/json-tools'
						className='cursor-pointer font-medium text-primary hover:underline'
					>
						JSON-инструментах
					</Link>
					.
				</p>
			</section>

			<section>
				<h2 className='text-2xl font-bold tracking-tight'>
					Отформатировать и проверить — разные вещи
				</h2>
				<p className='mt-3 text-muted-foreground'>
					Этот инструмент приводит код в порядок, но не оценивает его качество.
					Если нужно найти ошибки, проверить валидность по W3C, семантику и
					доступность или построить дерево заголовков, этим занимается{' '}
					<Link
						href='/tools/html-checker'
						className='cursor-pointer font-medium text-primary hover:underline'
					>
						Проверка HTML
					</Link>
					. Форматтер же удобен, когда разметку нужно просто причесать или
					сжать, в том числе для XML, который проверка не разбирает.
				</p>
			</section>

			<section>
				<h2 className='text-2xl font-bold tracking-tight'>
					Основные escape-сущности HTML
				</h2>
				<p className='mt-3 text-muted-foreground'>
					Символы ниже зарезервированы под синтаксис разметки, поэтому внутри
					текста их заменяют сущностями, иначе браузер примет их за начало тега
					или атрибута.
				</p>
				<div className='mt-4 overflow-x-auto'>
					<table className='w-full text-left text-sm'>
						<thead>
							<tr className='border-b text-muted-foreground'>
								<th className='py-2 pr-4 font-medium'>Символ</th>
								<th className='py-2 pr-4 font-medium'>Сущность</th>
								<th className='py-2 font-medium'>Значение</th>
							</tr>
						</thead>
						<tbody className='text-foreground'>
							<tr className='border-b'>
								<td className='py-2 pr-4 font-mono'>&amp;</td>
								<td className='py-2 pr-4 font-mono'>&amp;amp;</td>
								<td className='py-2'>Амперсанд</td>
							</tr>
							<tr className='border-b'>
								<td className='py-2 pr-4 font-mono'>&lt;</td>
								<td className='py-2 pr-4 font-mono'>&amp;lt;</td>
								<td className='py-2'>Знак «меньше», начало тега</td>
							</tr>
							<tr className='border-b'>
								<td className='py-2 pr-4 font-mono'>&gt;</td>
								<td className='py-2 pr-4 font-mono'>&amp;gt;</td>
								<td className='py-2'>Знак «больше», конец тега</td>
							</tr>
							<tr className='border-b'>
								<td className='py-2 pr-4 font-mono'>"</td>
								<td className='py-2 pr-4 font-mono'>&amp;quot;</td>
								<td className='py-2'>Двойная кавычка внутри атрибута</td>
							</tr>
							<tr>
								<td className='py-2 pr-4 font-mono'>&apos;</td>
								<td className='py-2 pr-4 font-mono'>&amp;#39;</td>
								<td className='py-2'>Одинарная кавычка (апостроф)</td>
							</tr>
						</tbody>
					</table>
				</div>
			</section>

			<p className='leading-relaxed'>
				Про разницу между форматированием текста и кода и про то, чем XML строже
				HTML, написано в статье{' '}
				<Link
					href='/blog/html-xml-parser'
					className='cursor-pointer font-medium text-primary hover:underline'
				>
					«Как отформатировать HTML и XML: beautify и минификация»
				</Link>
				.
			</p>
		</div>
	)
}
