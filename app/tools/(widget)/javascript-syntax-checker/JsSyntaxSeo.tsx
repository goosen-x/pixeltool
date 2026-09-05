import Link from 'next/link'

/**
 * SEO-контент под инструментом проверки JavaScript. Секции покрывают реальные
 * интенты кластера — как проверить JS на ошибки, частые ошибки синтаксиса,
 * отличие синтаксиса от рантайма и вопрос про TypeScript — без набивки ключей.
 */
export function JsSyntaxSeo() {
	return (
		<div className='mx-auto mt-16 max-w-3xl space-y-12'>
			<section>
				<h2 className='text-2xl font-bold tracking-tight'>
					Как проверить JavaScript на ошибки
				</h2>
				<p className='mt-3 text-muted-foreground'>
					Скрипт не запускается или страница молча не реагирует. Чаще всего
					виновата синтаксическая ошибка: пропущенная скобка, лишняя запятая,
					опечатка в ключевом слове. Вставьте код в поле выше, и проверка
					разберёт его прямо в браузере, без запуска, и укажет строку и колонку,
					где споткнулся парсер. Поддерживается современный JavaScript
					(ES6/ES2020+) и JSX, то есть то, что выполняется в браузере напрямую.
				</p>
			</section>

			<section>
				<h2 className='text-2xl font-bold tracking-tight'>
					Частые ошибки синтаксиса
				</h2>
				<p className='mt-3 text-muted-foreground'>
					Больше девяти из десяти «поломок» — это одно из нескольких: незакрытая
					скобка <code className='font-mono'>{'}'}</code> или кавычка,
					пропущенная запятая между полями объекта, опечатка в ключевом слове (
					<code className='font-mono'>fucntion</code>,{' '}
					<code className='font-mono'>retrun</code>), забытые кавычки у строки.
					Все эти случаи проверка ловит до запуска, просто разбирая текст кода,
					как это делает движок браузера. Если же ошибка сидит в самих данных
					(объекте или массиве, который вы получили от API), быстрее проверить
					их отдельно в{' '}
					<Link
						href='/tools/json-tools'
						className='cursor-pointer font-medium text-primary hover:underline'
					>
						JSON-инструментах
					</Link>
					.
				</p>
				<div className='mt-4 overflow-x-auto'>
					<table className='w-full text-left text-sm'>
						<thead>
							<tr className='border-b text-muted-foreground'>
								<th className='py-2 pr-4 font-medium'>Ошибка</th>
								<th className='py-2 pr-4 font-medium'>Пример</th>
								<th className='py-2 font-medium'>Исправление</th>
							</tr>
						</thead>
						<tbody className='text-foreground'>
							<tr className='border-b'>
								<td className='py-2 pr-4'>Незакрытая скобка</td>
								<td className='py-2 pr-4 font-mono'>
									function f(a {'{'} return a
								</td>
								<td className='py-2'>
									Закрыть каждую открытую <code className='font-mono'>(</code> и{' '}
									<code className='font-mono'>{'{'}</code>
								</td>
							</tr>
							<tr className='border-b'>
								<td className='py-2 pr-4'>Пропущенная запятая</td>
								<td className='py-2 pr-4 font-mono'>{'{ a: 1 b: 2 }'}</td>
								<td className='py-2'>
									Разделить поля объекта запятой:{' '}
									<code className='font-mono'>{'{ a: 1, b: 2 }'}</code>
								</td>
							</tr>
							<tr className='border-b'>
								<td className='py-2 pr-4'>Опечатка в ключевом слове</td>
								<td className='py-2 pr-4 font-mono'>fucntion, retrun</td>
								<td className='py-2'>
									Проверить написание:{' '}
									<code className='font-mono'>function</code>,{' '}
									<code className='font-mono'>return</code>
								</td>
							</tr>
							<tr className='border-b'>
								<td className='py-2 pr-4'>Незакрытая строка</td>
								<td className='py-2 pr-4 font-mono'>const s = &apos;текст</td>
								<td className='py-2'>Закрыть кавычку того же типа</td>
							</tr>
							<tr>
								<td className='py-2 pr-4'>Лишняя закрывающая скобка</td>
								<td className='py-2 pr-4 font-mono'>{'if (a) { b(); } }'}</td>
								<td className='py-2'>
									Убрать скобку без пары или добавить недостающую открывающую
								</td>
							</tr>
						</tbody>
					</table>
				</div>
			</section>

			<section>
				<h2 className='text-2xl font-bold tracking-tight'>
					Синтаксис или выполнение
				</h2>
				<p className='mt-3 text-muted-foreground'>
					Ошибки в JavaScript бывают двух видов. Синтаксические (
					<code className='font-mono'>SyntaxError</code>) означают, что код не
					соответствует грамматике языка и не запускается вообще, их и находит
					проверка синтаксиса. Ошибки выполнения (
					<code className='font-mono'>TypeError</code>,{' '}
					<code className='font-mono'>ReferenceError</code>) возникают уже в
					работающем коде и видны только в консоли браузера. Этот инструмент
					закрывает первый случай, когда нужно быстро понять, почему скрипт не
					грузится, не открывая IDE. Регулярное выражение с опечаткой тоже даёт{' '}
					<code className='font-mono'>SyntaxError</code>, но разбираться, что в
					нём не так, удобнее в{' '}
					<Link
						href='/tools/regex-tester'
						className='cursor-pointer font-medium text-primary hover:underline'
					>
						тестере регулярных выражений
					</Link>
					.
				</p>
			</section>

			<section>
				<h2 className='text-2xl font-bold tracking-tight'>
					А что с TypeScript
				</h2>
				<p className='mt-3 text-muted-foreground'>
					TypeScript — это тот же JavaScript плюс типы:{' '}
					<code className='font-mono'>name: string</code>, интерфейсы,
					дженерики. Обычная проверка JS на таком коде споткнётся уже на
					двоеточии с типом, для JavaScript это чужой синтаксис. Типы проверяет
					компилятор TypeScript (<code className='font-mono'>tsc</code>) или
					онлайн-песочница Playground. Этот инструмент рассчитан на JavaScript и
					JSX.
				</p>
			</section>

			<p className='text-muted-foreground'>
				Разбор частых ошибок и объяснение, чем синтаксис отличается от ошибок
				выполнения, есть в статье{' '}
				<Link
					href='/blog/proverka-javascript'
					className='cursor-pointer font-medium text-primary hover:underline'
				>
					Проверка JavaScript: как найти ошибку в коде
				</Link>
				.
			</p>
		</div>
	)
}
