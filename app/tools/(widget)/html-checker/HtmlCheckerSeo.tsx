import Link from 'next/link'

/**
 * SEO-контент под страницей инструмента. Отдельным компонентом, чтобы не
 * раздувать page.tsx. Текст покрывает смысловое поле запроса «проверить HTML на
 * ошибки» (валидность W3C, линтинг, семантика, доступность, заголовки, дерево),
 * а не набивает ключи — задача в том, чтобы это читалось как объяснение.
 */
export function HtmlCheckerSeo() {
	return (
		<div className='mx-auto mt-16 max-w-3xl space-y-12'>
			<section>
				<h2 className='text-2xl font-bold tracking-tight'>
					Как проверить HTML-код на ошибки
				</h2>
				<p className='mt-3 text-muted-foreground'>
					Вставьте разметку в поле, дайте ссылку на страницу или загрузите файл,
					и проверка запустится сама, нажимать ничего не нужно. Инструмент
					разбирает код и показывает найденные ошибки с номерами строк, а рядом
					ставит оценку от 0 до 100 по каждой категории, чтобы было видно, за
					что браться в первую очередь. На сервер обращаемся только в двух
					случаях: когда нужно скачать страницу по ссылке и когда запускаем
					официальный валидатор W3C.
				</p>
			</section>

			<section>
				<h2 className='text-2xl font-bold tracking-tight'>
					Что именно проверяется
				</h2>
				<p className='mt-3 text-muted-foreground'>
					Проверка идёт сразу по нескольким направлениям, и каждое отвечает за
					свой тип проблем.
				</p>
				<ul className='mt-4 space-y-3 text-muted-foreground'>
					<li>
						Валидность по W3C. Тот же движок, что и на validator.w3.org (Nu HTML
						Checker), находит формальные нарушения спецификации HTML:
						недопустимые атрибуты, устаревшие теги, неверные значения.
					</li>
					<li>
						Линтинг разметки. Ошибки в самом коде, до которых валидатор
						добирается не всегда: незакрытые и неправильно вложенные теги,
						дублирующиеся <code className='font-mono'>id</code>,
						неэкранированные <code className='font-mono'>&lt;</code> и{' '}
						<code className='font-mono'>&amp;</code>, пустой{' '}
						<code className='font-mono'>src</code>, картинки без{' '}
						<code className='font-mono'>alt</code>. Каждое замечание идёт с
						номером строки и колонки.
					</li>
					<li>
						Семантика. Есть ли <code className='font-mono'>main</code>,{' '}
						<code className='font-mono'>header</code>,{' '}
						<code className='font-mono'>footer</code>,{' '}
						<code className='font-mono'>article</code>, или страница целиком
						держится на <code className='font-mono'>div</code>.
					</li>
					<li>
						Доступность. Подписи у изображений и полей формы,{' '}
						<code className='font-mono'>lang</code> у страницы, уникальность{' '}
						<code className='font-mono'>id</code>. Без этого страницей тяжело
						пользоваться со скринридером.
					</li>
					<li>
						Заголовки. Один ли <code className='font-mono'>H1</code> на странице
						и не перепрыгивает ли иерархия с него сразу на{' '}
						<code className='font-mono'>H3</code>. Тут же строится дерево
						заголовков.
					</li>
				</ul>
				<p className='mt-4 text-muted-foreground'>
					Всё это собирается в единый отчёт с оценкой, который можно скачать в
					PDF. А если разметку нужно не только проверить, но и привести в
					порядок (отступы, экранирование{' '}
					<code className='font-mono'>&lt;</code> и{' '}
					<code className='font-mono'>&amp;</code>, подсчёт тегов), для этого
					есть отдельный{' '}
					<Link
						href='/tools/html-xml-parser'
						className='cursor-pointer font-medium text-primary hover:underline'
					>
						форматировщик HTML
					</Link>
					.
				</p>
			</section>

			<section>
				<h2 className='text-2xl font-bold tracking-tight'>
					Частые ошибки и как их исправить
				</h2>
				<p className='mt-3 text-muted-foreground'>
					Большая часть находок в проверке сводится к нескольким повторяющимся
					проблемам:
				</p>
				<div className='mt-4 overflow-x-auto'>
					<table className='w-full text-left text-sm'>
						<thead>
							<tr className='border-b text-muted-foreground'>
								<th className='py-2 pr-4 font-medium'>Ошибка</th>
								<th className='py-2 font-medium'>Исправление</th>
							</tr>
						</thead>
						<tbody className='text-foreground'>
							<tr className='border-b'>
								<td className='py-2 pr-4 font-mono'>Незакрытый тег</td>
								<td className='py-2'>
									Добавить закрывающий тег или сделать его самозакрывающимся (
									<code className='font-mono'>&lt;img /&gt;</code>,{' '}
									<code className='font-mono'>&lt;br /&gt;</code>)
								</td>
							</tr>
							<tr className='border-b'>
								<td className='py-2 pr-4 font-mono'>
									Дублирующийся <code className='font-mono'>id</code>
								</td>
								<td className='py-2'>
									Оставить один уникальный id на странице, для остальных
									использовать class
								</td>
							</tr>
							<tr className='border-b'>
								<td className='py-2 pr-4 font-mono'>
									Изображение без <code className='font-mono'>alt</code>
								</td>
								<td className='py-2'>
									Добавить атрибут alt с описанием картинки (пустой alt="", если
									изображение декоративное)
								</td>
							</tr>
							<tr className='border-b'>
								<td className='py-2 pr-4 font-mono'>
									Блочный элемент внутри строчного
								</td>
								<td className='py-2'>
									Например, div внутри span — поменять местами или заменить
									строчный элемент на блочный
								</td>
							</tr>
							<tr className='border-b'>
								<td className='py-2 pr-4 font-mono'>
									Неэкранированные <code className='font-mono'>&lt;</code> и{' '}
									<code className='font-mono'>&amp;</code>
								</td>
								<td className='py-2'>
									Заменить на сущности{' '}
									<code className='font-mono'>&amp;lt;</code> и{' '}
									<code className='font-mono'>&amp;amp;</code>
								</td>
							</tr>
							<tr>
								<td className='py-2 pr-4 font-mono'>
									Отсутствует <code className='font-mono'>lang</code> у страницы
								</td>
								<td className='py-2'>
									Указать язык в теге html, например{' '}
									<code className='font-mono'>&lt;html lang="ru"&gt;</code>
								</td>
							</tr>
						</tbody>
					</table>
				</div>
			</section>

			<section>
				<h2 className='text-2xl font-bold tracking-tight'>
					Дерево разметки и дерево браузера различаются
				</h2>
				<p className='mt-3 text-muted-foreground'>
					Здесь вы видите дерево своего HTML: теги ровно там, где вы их
					написали. Браузер же строит из этой разметки DOM-дерево и по дороге её
					чинит. Достраивает <code className='font-mono'>tbody</code>, закрывает
					забытые теги, выносит лишнее из таблиц наружу. Из-за этого молча не
					работает селектор <code className='font-mono'>table &gt; tr</code>.
					Где именно расходятся два дерева, разобрано в статье{' '}
					<Link
						href='/blog/html-tree-vs-dom-tree'
						className='cursor-pointer font-medium text-primary hover:underline'
					>
						HTML-дерево и DOM-дерево
					</Link>
					.
				</p>
			</section>
		</div>
	)
}
