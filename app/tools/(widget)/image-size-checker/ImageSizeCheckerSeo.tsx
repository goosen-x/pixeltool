import Link from 'next/link'

/**
 * SEO-контент под инструментом. Раскрывает интенты, которых нет в FAQ:
 * что означают три числа в карточке результата (размеры / соотношение /
 * вес), и главный смежный запрос — «какой размер картинки нужен для
 * площадки». Последний измерен Вордстатом отдельно (только по обложкам ВК
 * ~4700/мес) и в самом инструменте никак не закрыт: тул показывает
 * фактический размер, но не говорит, каким он должен быть.
 */
export function ImageSizeCheckerSeo() {
	return (
		<div className='mx-auto mt-16 max-w-3xl space-y-12'>
			<section>
				<h2 className='text-2xl font-bold tracking-tight'>
					Три числа в карточке: размеры, соотношение сторон и вес
				</h2>
				<p className='mt-3 text-muted-foreground'>
					<strong className='text-foreground'>Размеры</strong> — ширина и высота
					в пикселях, то самое «1920 × 1080». Это свойство самого файла, оно не
					меняется от того, на каком экране вы его смотрите.{' '}
					<strong className='text-foreground'>Соотношение сторон</strong> — та
					же пара чисел, сокращённая до простейшей дроби: 1920 × 1080 и 1280 ×
					720 дают одинаковые 16:9, и в макет под 16:9 обе картинки встанут без
					обрезки. <strong className='text-foreground'>Вес</strong> — сколько
					файл занимает на диске. Он не следует из размеров напрямую: две
					картинки 1920 × 1080 могут весить 200 КБ и 4 МБ, разница в формате и
					степени сжатия.
				</p>
				<p className='mt-3 text-muted-foreground'>
					Чаще всего проверяют именно расхождение между этими тремя: макет
					просит квадрат, а у файла 4:3 — площадка обрежет края; или размеры в
					норме, а вес 6 МБ — страница будет грузиться секундами.
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
								<td className='py-2'>квадрат — пост в Instagram</td>
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
			</section>

			<section>
				<h2 className='text-2xl font-bold tracking-tight'>
					Какой размер картинки нужен для ВКонтакте, YouTube и Telegram
				</h2>
				<p className='mt-3 text-muted-foreground'>
					Цифры ниже — из официальной справки ВКонтакте (проверено в августе
					2026 года). Площадки меняют требования, поэтому перед важной
					публикацией сверяйтесь с их собственной документацией, а не со
					сторонними подборками — они расходятся между собой сильнее всего
					именно по обложкам.
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
								<td className='py-2 pr-4'>Обложка сообщества ВК</td>
								<td className='py-2 pr-4 font-mono'>1920 × 768</td>
								<td className='py-2 font-mono'>5:2</td>
							</tr>
							<tr className='border-b'>
								<td className='py-2 pr-4'>Живая обложка ВК</td>
								<td className='py-2 pr-4 font-mono'>1920 × 1080</td>
								<td className='py-2 font-mono'>16:9</td>
							</tr>
							<tr className='border-b'>
								<td className='py-2 pr-4'>Аватар сообщества ВК</td>
								<td className='py-2 pr-4 font-mono'>400 × 400</td>
								<td className='py-2 font-mono'>1:1</td>
							</tr>
							<tr className='border-b'>
								<td className='py-2 pr-4'>Картинка поста ВК</td>
								<td className='py-2 pr-4 font-mono'>от 550 по ширине</td>
								<td className='py-2 font-mono'>1:1 или 2:1</td>
							</tr>
							<tr className='border-b'>
								<td className='py-2 pr-4'>Сниппет внешней ссылки ВК</td>
								<td className='py-2 pr-4 font-mono'>от 500 по ширине</td>
								<td className='py-2 font-mono'>1:1 или 5:2</td>
							</tr>
							<tr className='border-b'>
								<td className='py-2 pr-4'>Товар в витрине ВК</td>
								<td className='py-2 pr-4 font-mono'>1000 × 1000</td>
								<td className='py-2 font-mono'>1:1</td>
							</tr>
							<tr className='border-b'>
								<td className='py-2 pr-4'>История ВК</td>
								<td className='py-2 pr-4 font-mono'>от 720 × 1280</td>
								<td className='py-2 font-mono'>9:16</td>
							</tr>
							<tr>
								<td className='py-2 pr-4'>Фотоальбом ВК</td>
								<td className='py-2 pr-4 font-mono'>1200 × 800</td>
								<td className='py-2 font-mono'>3:2</td>
							</tr>
						</tbody>
					</table>
				</div>
				<p className='mt-4 text-muted-foreground'>
					Практический смысл соотношения виден именно здесь: обложке сообщества
					нужны 5:2, и если загрузить туда фотографию 4:3, площадка срежет верх
					и низ — как правило, вместе с половиной текста на картинке. Поэтому
					проверять стоит не только «сколько пикселей», но и во что эти пиксели
					складываются.
				</p>
				<p className='mt-3 text-muted-foreground'>
					Размеры для YouTube и Telegram, безопасные зоны и разбор, почему
					картинка мылится после загрузки, — в статье{' '}
					<Link
						href='/blog/razmer-kartinki-dlya-socsetey'
						className='cursor-pointer font-medium text-primary hover:underline'
					>
						Какой размер картинки нужен: ВКонтакте, Telegram и YouTube
					</Link>
					.
				</p>
			</section>

			<section>
				<h2 className='text-2xl font-bold tracking-tight'>
					Когда картинка «слишком тяжёлая»
				</h2>
				<p className='mt-3 text-muted-foreground'>
					Для картинки на сайте разумный ориентир — до 200–300 КБ на иллюстрацию
					и до 1 МБ на крупное фоновое изображение. Если инструмент показал
					больше, причина обычно одна из трёх: файл в PNG там, где подошёл бы
					JPEG или WebP; размеры кратно больше, чем место, в котором картинка
					показывается (фотография 6000 × 4000 в блоке шириной 800 пикселей);
					либо это исходник прямо из камеры или графического редактора, со всеми
					метаданными.
				</p>
				<p className='mt-3 text-muted-foreground'>
					Вес напрямую влияет на скорость загрузки страницы и на оценку Core Web
					Vitals — как это связано с позициями в поиске, разобрано в статье{' '}
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
					Файлы никуда не загружаются: браузер сам умеет открыть изображение и
					сообщить его ширину, высоту и вес, а формат берётся из типа файла.
					Поэтому проверить можно и служебные скриншоты, и макеты клиента,
					которые нельзя отправлять на чужой сервер, — картинка не покидает ваше
					устройство. По той же причине можно закинуть сразу десяток файлов и
					выгрузить таблицу с результатами в CSV: ограничение только в
					производительности вашего компьютера.
				</p>
			</section>
		</div>
	)
}
