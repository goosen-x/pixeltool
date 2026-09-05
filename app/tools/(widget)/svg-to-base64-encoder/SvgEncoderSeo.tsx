import Link from 'next/link'

/**
 * Компактный SEO-блок под кодировщиком SVG. Намеренно короткий: спрос по теме
 * маленький («svg в css» 138/мес, «svg в base64» 39), разворачивать здесь
 * полноценный лонгрид смысла нет. Основная задача блока — снять путаницу
 * «Base64 или не Base64» (слаг тула обещает Base64, а кодирование тут
 * URL-овое) и дать исходящие ссылки, которых у страницы не было вообще.
 */
export function SvgEncoderSeo() {
	return (
		<div className='mx-auto mt-16 max-w-3xl space-y-12'>
			<section>
				<h2 className='text-2xl font-bold tracking-tight'>
					Почему SVG в CSS не кодируют в Base64
				</h2>
				<p className='mt-3 text-muted-foreground'>
					<Link
						href='/tools/base64-encoder'
						className='cursor-pointer font-medium text-primary hover:underline'
					>
						Base64
					</Link>{' '}
					нужен, когда двоичный файл (PNG, шрифт, PDF) приходится протащить
					через место, где допустим только текст. SVG двоичным не является, это
					обычная разметка, и в правило CSS её можно положить как есть.
					Достаточно экранировать символы, которые ломают значение{' '}
					<code className='rounded bg-secondary px-1.5 py-0.5 font-mono text-sm'>
						url()
					</code>{' '}
					: угловые скобки, кавычки, решётку в цветах. Именно это и делает
					кодировщик выше.
				</p>
				<p className='mt-3 text-muted-foreground'>
					Выигрыш двойной. Base64 раздувает данные примерно на треть, а
					экранирование добавляет считаные проценты, так что строка выходит
					короче. И она остаётся читаемой: в экранированном SVG видно теги и
					цвета, так что поправить заливку можно прямо в CSS, не перекодируя
					картинку заново. Что такое Base64 и когда он всё-таки нужен,
					рассказано в статье{' '}
					<Link
						href='/blog/chto-takoe-base64'
						className='cursor-pointer font-medium text-primary hover:underline'
					>
						про кодирование Base64
					</Link>
					.
				</p>
			</section>

			<section>
				<h2 className='text-2xl font-bold tracking-tight'>
					Три способа подключить SVG
				</h2>
				<p className='mt-3 text-muted-foreground'>
					Инлайн-разметка, экранированная (или Base64) строка в CSS и внешний
					файл решают разные задачи, вот чем они отличаются:
				</p>
				<div className='mt-4 overflow-x-auto'>
					<table className='w-full text-left text-sm'>
						<thead>
							<tr className='border-b text-muted-foreground'>
								<th className='py-2 pr-4 font-medium'>Способ</th>
								<th className='py-2 pr-4 font-medium'>Размер</th>
								<th className='py-2 pr-4 font-medium'>Кэшируется отдельно</th>
								<th className='py-2 font-medium'>Анимация</th>
							</tr>
						</thead>
						<tbody className='text-foreground'>
							<tr className='border-b'>
								<td className='py-2 pr-4'>Инлайн SVG в HTML</td>
								<td className='py-2 pr-4'>Без накрутки</td>
								<td className='py-2 pr-4'>Нет, живёт в разметке страницы</td>
								<td className='py-2'>
									Полная, доступны CSS- и JS-анимация, стили из документа
								</td>
							</tr>
							<tr className='border-b'>
								<td className='py-2 pr-4'>Base64/URL в CSS</td>
								<td className='py-2 pr-4'>+10–35% к весу файла</td>
								<td className='py-2 pr-4'>Нет, живёт в CSS-файле</td>
								<td className='py-2'>
									Только то, что описано внутри самого SVG
								</td>
							</tr>
							<tr>
								<td className='py-2 pr-4'>Внешний .svg-файл</td>
								<td className='py-2 pr-4'>Без накрутки</td>
								<td className='py-2 pr-4'>Да, отдельным запросом</td>
								<td className='py-2'>
									Только то, что описано внутри самого SVG
								</td>
							</tr>
						</tbody>
					</table>
				</div>
			</section>

			<section>
				<h2 className='text-2xl font-bold tracking-tight'>
					Где пригодится встроенный SVG
				</h2>
				<ul className='mt-3 space-y-2 text-muted-foreground'>
					<li>
						Иконки в псевдоэлементах. Стрелка или галочка через{' '}
						<code className='rounded bg-secondary px-1.5 py-0.5 font-mono text-xs'>
							content
						</code>{' '}
						зависит от шрифта и съезжает по базовой линии, а фон с SVG выглядит
						одинаково везде. Разбор самих псевдоэлементов есть в статье{' '}
						<Link
							href='/blog/css-pseudo-selectors'
							className='cursor-pointer font-medium text-primary hover:underline'
						>
							про псевдоклассы и псевдоэлементы CSS
						</Link>
						.
					</li>
					<li>
						Мелкая декоративная графика. Паттерны, разделители, галочки в
						списках. Каждая такая картинка отдельным файлом даёт лишний сетевой
						запрос, а встроенная приезжает вместе со стилями.
					</li>
					<li>
						Экономия на запросах. Приём даёт заметный эффект именно на мелочи в
						единицы килобайт. Крупную иллюстрацию встраивать не стоит, она
						раздует CSS, который блокирует рендер, и попадёт в кеш вместе со
						стилями вместо собственного.
					</li>
				</ul>
			</section>
		</div>
	)
}
