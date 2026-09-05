import Link from 'next/link'

export function ImageConverterSeo() {
	return (
		<div className='mx-auto mt-16 max-w-3xl space-y-12'>
			<section>
				<h2 className='text-2xl font-bold tracking-tight'>
					Какой формат когда нужен
				</h2>
				<p className='mt-3 text-muted-foreground'>
					JPEG сжимает с потерями и не умеет прозрачность — это формат для
					фотографий, где важен вес, а мелкие детали глаз всё равно не
					различает. PNG сжимает без потерь и хранит прозрачность: он для
					скриншотов, логотипов, схем и всего, где есть резкие границы и текст.
					WebP умеет и то и другое и при равном качестве весит меньше обоих, но
					принимают его не везде.
				</p>

				<p className='mt-4 text-muted-foreground'>
					Три формата, между которыми переводит конвертер:
				</p>
				<div className='mt-4 overflow-x-auto'>
					<table className='w-full text-left text-sm'>
						<thead>
							<tr className='border-b text-muted-foreground'>
								<th className='py-2 pr-4 font-medium'>Формат</th>
								<th className='py-2 pr-4 font-medium'>Прозрачность</th>
								<th className='py-2 pr-4 font-medium'>Сжатие</th>
								<th className='py-2 font-medium'>Для чего</th>
							</tr>
						</thead>
						<tbody className='text-foreground'>
							<tr className='border-b'>
								<td className='py-2 pr-4 font-mono'>JPEG</td>
								<td className='py-2 pr-4'>нет</td>
								<td className='py-2 pr-4'>с потерями</td>
								<td className='py-2'>фотографии, вложения, печать</td>
							</tr>
							<tr className='border-b'>
								<td className='py-2 pr-4 font-mono'>PNG</td>
								<td className='py-2 pr-4'>есть</td>
								<td className='py-2 pr-4'>без потерь</td>
								<td className='py-2'>
									логотипы, скриншоты, графика с прозрачным фоном
								</td>
							</tr>
							<tr>
								<td className='py-2 pr-4 font-mono'>WebP</td>
								<td className='py-2 pr-4'>есть</td>
								<td className='py-2 pr-4'>и так, и так</td>
								<td className='py-2'>
									картинки на сайте, вес меньше при том же качестве
								</td>
							</tr>
						</tbody>
					</table>
				</div>
				<p className='mt-4 text-muted-foreground'>
					Отсюда и главное правило перевода: из PNG в JPEG прозрачность теряется
					навсегда и заливается белым, а обратный перевод её не вернёт, потому
					что возвращать уже нечего.
				</p>
			</section>

			<section>
				<h2 className='text-2xl font-bold tracking-tight'>
					Прозрачность теряется безвозвратно
				</h2>
				<p className='mt-3 text-muted-foreground'>
					У JPEG нет альфа-канала. При переводе туда прозрачные области
					заливаются белым — не потому что так решили мы, а потому что иначе
					браузер оставил бы их чёрными, что почти всегда хуже. Обратно
					прозрачность не возвращается: белый фон становится частью картинки.
					Если она нужна, выбирайте PNG или WebP.
				</p>
			</section>

			<section>
				<h2 className='text-2xl font-bold tracking-tight'>
					Перекодирование не улучшает картинку
				</h2>
				<p className='mt-3 text-muted-foreground'>
					Перевод из формата с потерями в формат без потерь не восстанавливает
					утраченное. JPEG в PNG сохранит артефакты сжатия в точности и сделает
					файл тяжелее. Смысл такого перевода только один — не портить картинку
					дальше при следующих правках. А вот гонять её по кругу между форматами
					с потерями действительно вредно: каждый проход добавляет свои
					искажения, и через несколько кругов это становится заметно.
				</p>
			</section>

			<section>
				<h2 className='text-2xl font-bold tracking-tight'>
					Почему здесь нет HEIC
				</h2>
				<p className='mt-3 text-muted-foreground'>
					HEIC — формат, в котором снимает айфон, и запрос «heic в jpg» один из
					самых частых. Но браузеры, кроме Safari, его не декодируют вовсе: для
					этого нужен отдельный декодер весом больше мегабайта, который пришлось
					бы загружать всем посетителям ради формата, который у большинства не
					откроется. Обещать то, чего инструмент не сделает, мы не хотим.
				</p>
				<p className='mt-3 text-muted-foreground'>
					Простое решение есть на самом айфоне: Настройки → Камера → Форматы →
					Наиболее совместимый. После этого телефон снимает сразу в JPEG. Для
					уже снятых фотографий достаточно отправить их себе через любой
					мессенджер — он сконвертирует автоматически.
				</p>
			</section>

			<section>
				<h2 className='text-2xl font-bold tracking-tight'>Смежное</h2>
				<p className='mt-3 text-muted-foreground'>
					Этот инструмент про формат: он перекодирует картинку как есть,
					сохраняя размер в пикселях, и ползунок качества здесь нужен только
					чтобы не раздувать файл сверх необходимого. Если задача обратная и вес
					не влезает в лимит, а формат неважен, берите{' '}
					<Link
						href='/tools/compress-image'
						className='cursor-pointer font-medium text-primary hover:underline'
					>
						сжатие изображений
					</Link>
					: там расчёт идёт от целевого веса, есть живое сравнение до и после, и
					нет PNG, потому что он вес не уменьшает. Убрать фон умеет{' '}
					<Link
						href='/tools/remove-background'
						className='cursor-pointer font-medium text-primary hover:underline'
					>
						отдельный инструмент
					</Link>
					, а вытащить страницы из документа —{' '}
					<Link
						href='/tools/pdf-to-jpg'
						className='cursor-pointer font-medium text-primary hover:underline'
					>
						PDF в JPG
					</Link>
					.
				</p>
			</section>
		</div>
	)
}
