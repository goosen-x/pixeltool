import Link from 'next/link'

/**
 * SEO-контент под инструментом. Раскрывает интенты, которых нет в FAQ,
 * что означают три числа в карточке результата (размеры, соотношение,
 * вес), и главный смежный запрос, «какой размер картинки нужен для
 * площадки». Последний измерен Вордстатом отдельно (только по обложкам ВК
 * ~4700/мес), тул показывает фактический размер, но не говорит, каким он
 * должен быть.
 *
 * Правка 27.08.2026: таблица ВК была на 8 строк и дублировала статью
 * `razmer-kartinki-dlya-socsetey.md` целиком, а заголовок обещал ещё
 * YouTube и Telegram, которых внутри не было вообще. Оставлены только
 * 3 самых спрашиваемых формата (обложка, живая обложка, аватар), за
 * остальным ссылка на статью, чтобы тул и статья не дублировали один и
 * тот же контент под разными URL. Заодно поправлена таблица соотношений,
 * лента Instagram давно перешла с 1:1 на портрет 4:5.
 */
export function ImageSizeCheckerSeo() {
	return (
		<div className='mx-auto mt-16 max-w-3xl space-y-12'>
			<section>
				<h2 className='text-2xl font-bold tracking-tight'>
					Три числа в карточке: размеры, соотношение сторон и вес
				</h2>
				<p className='mt-3 text-muted-foreground'>
					Ширина и высота в пикселях, вот что за «1920 × 1080» показывает
					карточка результата. Это свойство самого файла, оно не зависит от
					экрана, на котором вы его открыли. Соотношение сторон, та же пара
					чисел, только сокращённая до простейшей дроби. У 1920 × 1080 и у 1280
					× 720 одно и то же 16:9, и в макет под 16:9 обе картинки лягут без
					обрезки, несмотря на разный размер.
				</p>
				<p className='mt-3 text-muted-foreground'>
					С весом сложнее, он не следует из размеров напрямую. Две фотографии
					1920 × 1080 легко весят 200 КБ и 4 МБ, а разница вся в формате и
					степени сжатия. Чаще всего люди как раз и сверяют, где эти три числа
					расходятся. Макет просит квадрат, а у файла 4:3, площадка обрежет
					края. Или с размерами всё в порядке, а весит картинка 6 МБ, и страница
					грузится секундами.
				</p>

				<div className='mt-6 overflow-x-auto'>
					<table className='w-full text-sm'>
						<thead>
							<tr className='border-b text-left'>
								<th className='py-2 pr-4 font-medium'>Соотношение</th>
								<th className='py-2 font-medium'>Где встречается</th>
							</tr>
						</thead>
						<tbody className='text-muted-foreground'>
							<tr className='border-b'>
								<td className='py-2 pr-4 font-mono'>1:1</td>
								<td className='py-2'>квадрат, аватар профиля или иконка</td>
							</tr>
							<tr className='border-b'>
								<td className='py-2 pr-4 font-mono'>4:5</td>
								<td className='py-2'>
									пост в Instagram, актуальная рекомендация ленты
								</td>
							</tr>
							<tr className='border-b'>
								<td className='py-2 pr-4 font-mono'>4:3</td>
								<td className='py-2'>традиционное фото</td>
							</tr>
							<tr className='border-b'>
								<td className='py-2 pr-4 font-mono'>3:2</td>
								<td className='py-2'>классический кадр 35 мм</td>
							</tr>
							<tr className='border-b'>
								<td className='py-2 pr-4 font-mono'>16:9</td>
								<td className='py-2'>широкий экран, обложка YouTube</td>
							</tr>
							<tr className='border-b'>
								<td className='py-2 pr-4 font-mono'>9:16</td>
								<td className='py-2'>вертикальное видео и сторис</td>
							</tr>
							<tr>
								<td className='py-2 pr-4 font-mono'>2:1</td>
								<td className='py-2'>шапка профиля</td>
							</tr>
						</tbody>
					</table>
				</div>
				<p className='mt-4 text-muted-foreground'>
					Если инструмент показал, что готовая иконка не того размера, а нужен
					сам файл favicon.ico под сайт, соберите его в{' '}
					<Link
						href='/tools/favicon-generator'
						className='cursor-pointer font-medium text-primary hover:underline'
					>
						генераторе фавиконок
					</Link>
					, там же сразу все нужные размеры и код для вставки в head.
				</p>
			</section>

			<section>
				<h2 className='text-2xl font-bold tracking-tight'>
					Точные размеры для ВКонтакте
				</h2>
				<p className='mt-3 text-muted-foreground'>
					Чаще всего спрашивают именно про обложку сообщества и аватар, там
					неверное соотношение обрезает важную часть картинки. Цифры из
					официальной справки ВКонтакте, проверено в августе 2026 года.
				</p>
				<div className='mt-4 overflow-x-auto'>
					<table className='w-full text-sm'>
						<thead>
							<tr className='border-b text-left'>
								<th className='py-2 pr-4 font-medium'>Что оформляем</th>
								<th className='py-2 pr-4 font-medium'>Размер</th>
								<th className='py-2 font-medium'>Соотношение</th>
							</tr>
						</thead>
						<tbody className='text-muted-foreground'>
							<tr className='border-b'>
								<td className='py-2 pr-4'>Обложка сообщества</td>
								<td className='py-2 pr-4 font-mono'>1920 × 768</td>
								<td className='py-2 font-mono'>5:2</td>
							</tr>
							<tr className='border-b'>
								<td className='py-2 pr-4'>Живая обложка</td>
								<td className='py-2 pr-4 font-mono'>1920 × 1080</td>
								<td className='py-2 font-mono'>16:9</td>
							</tr>
							<tr>
								<td className='py-2 pr-4'>Аватар сообщества</td>
								<td className='py-2 pr-4 font-mono'>400 × 400</td>
								<td className='py-2 font-mono'>1:1</td>
							</tr>
						</tbody>
					</table>
				</div>
				<p className='mt-4 text-muted-foreground'>
					Обложке нужны именно 5:2. Загрузите туда фотографию 4:3, и площадка
					срежет верх и низ, обычно вместе с половиной текста на картинке.
				</p>
				<p className='mt-3 text-muted-foreground'>
					Остальные форматы ВКонтакте (посты, сторис, товары), точные размеры
					для YouTube и Telegram и разбор, почему картинка мылится после
					загрузки, есть в статье{' '}
					<Link
						href='/blog/razmer-kartinki-dlya-socsetey'
						className='cursor-pointer font-medium text-primary hover:underline'
					>
						Размер обложки ВК, Telegram и YouTube: точные цифры
					</Link>
					.
				</p>
			</section>

			<section>
				<h2 className='text-2xl font-bold tracking-tight'>
					Когда картинка «слишком тяжёлая»
				</h2>
				<p className='mt-3 text-muted-foreground'>
					Для картинки на сайте разумный ориентир, до 200–300 КБ на иллюстрацию
					и до 1 МБ на крупное фоновое изображение. Если инструмент показал
					больше, причина обычно одна и та же. Файл в PNG там, где подошёл бы
					JPEG или WebP. Размеры кратно больше, чем место, в котором картинка
					показывается (фотография 6000 × 4000 в блоке шириной 800 пикселей).
					Либо это исходник прямо из камеры или графического редактора, со всеми
					метаданными.
				</p>
				<p className='mt-3 text-muted-foreground'>
					Вес напрямую влияет на скорость загрузки страницы и на оценку Core Web
					Vitals. Как это связано с позициями в поиске, разобрано в статье{' '}
					<Link
						href='/blog/lighthouse-100'
						className='cursor-pointer font-medium text-primary hover:underline'
					>
						100 баллов в Lighthouse
					</Link>
					.
				</p>
			</section>

			<section>
				<h2 className='text-2xl font-bold tracking-tight'>
					Почему размеры считаются прямо в браузере
				</h2>
				<p className='mt-3 text-muted-foreground'>
					Браузер сам умеет открыть изображение и сообщить его ширину, высоту и
					вес, а формат берётся из типа файла. Сервер в этом не участвует, файл
					остаётся на вашем устройстве, так что подходит и для служебных
					скриншотов, и для клиентских макетов. По той же причине можно закинуть
					сразу десяток файлов и выгрузить таблицу с результатами в CSV,
					ограничение только в производительности вашего компьютера.
				</p>
			</section>
		</div>
	)
}
