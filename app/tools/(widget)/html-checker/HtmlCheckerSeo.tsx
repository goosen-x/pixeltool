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
					Вставьте разметку в поле, дайте ссылку на страницу или загрузите файл
					— проверка запускается сама, нажимать ничего не нужно. Инструмент
					разбирает код и показывает найденные ошибки с номерами строк, а рядом
					ставит оценку от 0 до 100 по каждой категории, чтобы было видно, за
					что браться в первую очередь. Разбор идёт прямо в браузере:
					вставленный код никуда не отправляется. На сервер обращаемся только в
					двух случаях — когда нужно скачать страницу по ссылке и когда
					запускаем официальный валидатор W3C.
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
						<strong className='font-semibold text-foreground'>
							Валидность по W3C.
						</strong>{' '}
						Тот же движок, что и на validator.w3.org (Nu HTML Checker):
						формальные нарушения спецификации HTML — недопустимые атрибуты,
						устаревшие теги, неверные значения.
					</li>
					<li>
						<strong className='font-semibold text-foreground'>
							Линтинг разметки.
						</strong>{' '}
						Ошибки в самом коде, до которых валидатор добирается не всегда:
						незакрытые и неправильно вложенные теги, дублирующиеся{' '}
						<code className='font-mono'>id</code>, неэкранированные{' '}
						<code className='font-mono'>&lt;</code> и{' '}
						<code className='font-mono'>&amp;</code>, пустой{' '}
						<code className='font-mono'>src</code>, картинки без{' '}
						<code className='font-mono'>alt</code>. Каждое замечание — с номером
						строки и колонки.
					</li>
					<li>
						<strong className='font-semibold text-foreground'>
							Семантика.
						</strong>{' '}
						Есть ли <code className='font-mono'>main</code>,{' '}
						<code className='font-mono'>header</code>,{' '}
						<code className='font-mono'>footer</code>,{' '}
						<code className='font-mono'>article</code>, или страница целиком
						держится на <code className='font-mono'>div</code>.
					</li>
					<li>
						<strong className='font-semibold text-foreground'>
							Доступность.
						</strong>{' '}
						Подписи у изображений и полей формы,{' '}
						<code className='font-mono'>lang</code> у страницы, уникальность{' '}
						<code className='font-mono'>id</code> — то, без чего страницей
						тяжело пользоваться со скринридером.
					</li>
					<li>
						<strong className='font-semibold text-foreground'>
							Заголовки.
						</strong>{' '}
						Один ли <code className='font-mono'>H1</code> на странице и не
						перепрыгивает ли иерархия с него сразу на{' '}
						<code className='font-mono'>H3</code>. Тут же строится дерево
						заголовков.
					</li>
				</ul>
				<p className='mt-4 text-muted-foreground'>
					Всё это собирается в единый отчёт с оценкой, который можно скачать в
					PDF.
				</p>
			</section>

			<section>
				<h2 className='text-2xl font-bold tracking-tight'>
					Дерево разметки и дерево браузера — не одно и то же
				</h2>
				<p className='mt-3 text-muted-foreground'>
					Здесь вы видите дерево своего HTML: теги ровно там, где вы их
					написали. Браузер же строит из этой разметки DOM-дерево и по дороге
					чинит её — достраивает <code className='font-mono'>tbody</code>,
					закрывает забытые теги, выносит лишнее из таблиц наружу. Из-за этого,
					например, молча не работает селектор{' '}
					<code className='font-mono'>table &gt; tr</code>. Где именно
					расходятся два дерева — разбираем в статье{' '}
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
