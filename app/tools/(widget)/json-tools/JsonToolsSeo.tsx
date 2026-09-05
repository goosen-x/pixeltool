import Link from 'next/link'

/**
 * SEO-контент под инструментом JSON. Отдельным компонентом, чтобы не раздувать
 * page.tsx. Секции покрывают реальные интенты кластера — форматирование,
 * проверка на ошибки, перевод в YAML и «что такое JSON» — а не набивают ключи.
 */
export function JsonToolsSeo() {
	return (
		<div className='mx-auto mt-16 max-w-3xl space-y-12'>
			<section>
				<h2 className='text-2xl font-bold tracking-tight'>Что такое JSON</h2>
				<p className='mt-3 text-muted-foreground'>
					JSON (JavaScript Object Notation) — текстовый формат для обмена
					данными. Это пары «ключ — значение», собранные в объекты{' '}
					<code className='font-mono'>{'{ }'}</code> и списки{' '}
					<code className='font-mono'>[ ]</code>. На нём отвечают почти все API,
					в нём хранят настройки и передают данные между сервером и браузером.
					Формат читается и человеком, и программой, за это его и любят. Строки
					берутся в двойные кавычки, значениями бывают число, строка,{' '}
					<code className='font-mono'>true/false</code>,{' '}
					<code className='font-mono'>null</code>, объект или массив. Вставьте
					данные в поле выше, и инструмент разберёт структуру и сразу покажет,
					всё ли в ней правильно.
				</p>

				<p className='mt-4 text-muted-foreground'>
					В JSON всего шесть типов значений, и на этом язык заканчивается:
				</p>
				<div className='mt-4 overflow-x-auto'>
					<table className='w-full text-left text-sm'>
						<thead>
							<tr className='border-b text-muted-foreground'>
								<th className='py-2 pr-4 font-medium'>Тип</th>
								<th className='py-2 pr-4 font-medium'>Пример</th>
								<th className='py-2 font-medium'>Тонкость</th>
							</tr>
						</thead>
						<tbody className='text-foreground'>
							<tr className='border-b'>
								<td className='py-2 pr-4'>Строка</td>
								<td className='py-2 pr-4 font-mono'>"текст"</td>
								<td className='py-2'>
									только двойные кавычки, одинарные это ошибка
								</td>
							</tr>
							<tr className='border-b'>
								<td className='py-2 pr-4'>Число</td>
								<td className='py-2 pr-4 font-mono'>42, 3.14, -1e5</td>
								<td className='py-2'>без ведущего нуля и без кавычек</td>
							</tr>
							<tr className='border-b'>
								<td className='py-2 pr-4'>Логическое</td>
								<td className='py-2 pr-4 font-mono'>true, false</td>
								<td className='py-2'>строчными буквами</td>
							</tr>
							<tr className='border-b'>
								<td className='py-2 pr-4'>Пустое</td>
								<td className='py-2 pr-4 font-mono'>null</td>
								<td className='py-2'>не Null и не NULL</td>
							</tr>
							<tr className='border-b'>
								<td className='py-2 pr-4'>Объект</td>
								<td className='py-2 pr-4 font-mono'>{'{ "a": 1 }'}</td>
								<td className='py-2'>ключи всегда строки в кавычках</td>
							</tr>
							<tr>
								<td className='py-2 pr-4'>Массив</td>
								<td className='py-2 pr-4 font-mono'>[1, 2, 3]</td>
								<td className='py-2'>
									запятая после последнего элемента запрещена
								</td>
							</tr>
						</tbody>
					</table>
				</div>
				<p className='mt-4 text-muted-foreground'>
					Больше половины ошибок разбора это как раз лишняя запятая в конце и
					одинарные кавычки, привычные по JavaScript.
				</p>
			</section>

			<section>
				<h2 className='text-2xl font-bold tracking-tight'>
					Как отформатировать JSON
				</h2>
				<p className='mt-3 text-muted-foreground'>
					JSON из API обычно приходит одной строкой без пробелов, и читать такое
					невозможно. Форматирование (его же называют beautify или «сделать
					красивый JSON») расставляет отступы и переносы строк, и структура
					становится наглядной: видно вложенность, где заканчивается объект, где
					начинается массив. Вставьте данные и откройте вкладку с читаемым
					видом, размер отступа в 2 или 4 пробела либо таб переключается в
					настройках. Обратная операция, сжатие (minify), убирает все лишние
					пробелы, чтобы уменьшить объём перед отправкой на сервер.
				</p>
			</section>

			<section>
				<h2 className='text-2xl font-bold tracking-tight'>
					Как проверить JSON на ошибки
				</h2>
				<p className='mt-3 text-muted-foreground'>
					Один лишний символ ломает весь файл, а приложение падает с невнятной
					ошибкой. Инструмент проверяет JSON на валидность и показывает строку и
					колонку, где споткнулся разбор. Самые частые причины: лишняя запятая
					после последнего элемента, одинарные кавычки вместо двойных, ключ без
					кавычек, незакрытая скобка и комментарии, которых в стандартном JSON
					нет. Проверьте данные здесь до того, как они уйдут в код. Так ошибку
					видно сразу, а не по логам продакшена. Если же ошибка не в самих
					данных, а в окружающем коде, который их обрабатывает, для этого есть{' '}
					<Link
						href='/tools/javascript-syntax-checker'
						className='cursor-pointer font-medium text-primary hover:underline'
					>
						проверка синтаксиса JavaScript
					</Link>
					.
				</p>
			</section>

			<section>
				<h2 className='text-2xl font-bold tracking-tight'>
					JSON и YAML: в чём разница
				</h2>
				<p className='mt-3 text-muted-foreground'>
					YAML — тот же набор данных, но записанный отступами вместо скобок. Он
					читается легче и допускает комментарии, поэтому в нём удобно держать
					конфиги. JSON строже и компактнее, им передают данные между
					программами. Инструмент переводит в обе стороны: вставьте JSON и
					откройте вкладку YAML или наоборот, формат распознается сам, а
					результат можно скопировать или скачать.
				</p>
			</section>

			<p className='text-muted-foreground'>
				Разбор синтаксиса с примерами, что такое ключи, массивы и вложенность и
				чем JSON отличается от XML, есть в статье{' '}
				<Link
					href='/blog/chto-takoe-json'
					className='cursor-pointer font-medium text-primary hover:underline'
				>
					Что такое JSON: формат данных простыми словами
				</Link>
				.
			</p>
		</div>
	)
}
