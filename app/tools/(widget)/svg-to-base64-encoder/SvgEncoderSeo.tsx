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
					Base64 нужен, когда двоичный файл — PNG, шрифт, PDF — приходится
					протащить через место, где допустим только текст. SVG двоичным не
					является: это обычная разметка, и в правило CSS её можно положить как
					есть. Достаточно экранировать символы, которые ломают значение{' '}
					<code className='rounded bg-secondary px-1.5 py-0.5 font-mono text-sm'>
						url()
					</code>{' '}
					— угловые скобки, кавычки, решётку в цветах. Именно это и делает
					кодировщик выше.
				</p>
				<p className='mt-3 text-muted-foreground'>
					Выигрыш двойной. Base64 раздувает данные примерно на треть, а
					экранирование добавляет считаные проценты — строка выходит короче. И
					она остаётся читаемой: в экранированном SVG видно теги и цвета, так
					что поправить заливку можно прямо в CSS, не перекодируя картинку
					заново. Что такое Base64 и когда он всё-таки нужен — в статье{' '}
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
					Где пригодится встроенный SVG
				</h2>
				<ul className='mt-3 space-y-2 text-muted-foreground'>
					<li>
						<strong className='text-foreground'>
							Иконки в псевдоэлементах.
						</strong>{' '}
						Стрелка или галочка через{' '}
						<code className='rounded bg-secondary px-1.5 py-0.5 font-mono text-xs'>
							content
						</code>{' '}
						зависит от шрифта и съезжает по базовой линии; фон с SVG выглядит
						одинаково везде. Разбор самих псевдоэлементов — в статье{' '}
						<Link
							href='/blog/css-pseudo-selectors'
							className='cursor-pointer font-medium text-primary hover:underline'
						>
							про псевдоклассы и псевдоэлементы CSS
						</Link>
						.
					</li>
					<li>
						<strong className='text-foreground'>
							Мелкая декоративная графика.
						</strong>{' '}
						Паттерны, разделители, галочки в списках. Каждая такая картинка
						отдельным файлом — это лишний сетевой запрос, а встроенная приезжает
						вместе со стилями.
					</li>
					<li>
						<strong className='text-foreground'>Экономия на запросах.</strong>{' '}
						Приём даёт заметный эффект именно на мелочи в единицы килобайт.
						Крупную иллюстрацию встраивать не стоит: она раздует CSS, который
						блокирует рендер, и попадёт в кеш вместе со стилями вместо
						собственного.
					</li>
				</ul>
			</section>
		</div>
	)
}
