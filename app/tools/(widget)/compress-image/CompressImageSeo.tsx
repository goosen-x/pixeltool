import Link from 'next/link'

export function CompressImageSeo() {
	return (
		<div className='mx-auto mt-16 max-w-3xl space-y-12'>
			<section>
				<h2 className='text-2xl font-bold tracking-tight'>
					Как устроено сжатие без сервера
				</h2>
				<p className='mt-3 text-muted-foreground'>
					Пересжатие делает браузер сам, через canvas, встроенный механизм
					рисования и кодирования изображений. Файл рисуется на невидимом холсте
					и заново кодируется в JPEG или WebP с выбранным уровнем качества.
					Ровно это же делают графические редакторы, только здесь не нужно
					ставить программу и загружать фото на чужой сервер. После сжатия
					точный вес и разрешение файла можно перепроверить в{' '}
					<Link
						href='/tools/image-size-checker'
						className='cursor-pointer font-medium text-primary hover:underline'
					>
						проверке размера изображения
					</Link>
					.
				</p>
			</section>

			<section>
				<h2 className='text-2xl font-bold tracking-tight'>
					Почему у PNG ползунок ничего не меняет
				</h2>
				<p className='mt-3 text-muted-foreground'>
					PNG сжимает без потерь. Жертвовать деталями ради размера он не умеет,
					поэтому параметра «качество» у него в принципе нет. Если исходник в
					PNG, а файл нужен полегче, переключите формат на JPEG или WebP. Они
					сжимают управляемо и теряют ровно столько деталей, сколько вы
					разрешите ползунком. Если PNG нужен именно из-за прозрачного фона,
					сначала уберите фон в{' '}
					<Link
						href='/tools/remove-background'
						className='cursor-pointer font-medium text-primary hover:underline'
					>
						удалении фона с фото
					</Link>
					, а затем сжимайте результат здесь.
				</p>
				<div className='mt-4 overflow-x-auto'>
					<table className='w-full border-collapse text-sm'>
						<thead>
							<tr className='border-b text-left'>
								<th className='py-2 pr-4 font-semibold'>Формат</th>
								<th className='py-2 font-semibold'>Когда использовать</th>
							</tr>
						</thead>
						<tbody>
							<tr className='border-b last:border-0'>
								<td className='py-2 pr-4 align-top'>JPEG</td>
								<td className='py-2 align-top text-muted-foreground'>
									Фотографии и любые изображения без прозрачности — сжимает с
									потерями и даёт самый лёгкий файл
								</td>
							</tr>
							<tr className='border-b last:border-0'>
								<td className='py-2 pr-4 align-top'>PNG</td>
								<td className='py-2 align-top text-muted-foreground'>
									Графика с прозрачным фоном, скриншоты, иконки — сжимает без
									потерь, поэтому детали и резкие края остаются как есть
								</td>
							</tr>
							<tr className='border-b last:border-0'>
								<td className='py-2 pr-4 align-top'>WebP</td>
								<td className='py-2 align-top text-muted-foreground'>
									Баланс размера и качества для сайтов — весит меньше JPEG при
									сравнимой картинке, поддерживает и прозрачность
								</td>
							</tr>
						</tbody>
					</table>
				</div>
			</section>

			<section>
				<h2 className='text-2xl font-bold tracking-tight'>
					Сжать или сменить формат — разные задачи
				</h2>
				<p className='mt-3 text-muted-foreground'>
					Этот инструмент про вес: цель — уложить фото в лимит формы или
					хостинга, а формат на выходе (JPEG или WebP) выбирается как средство к
					этому, потому что оба сжимают с потерями и дают лёгкий файл. PNG здесь
					намеренно нет: он сжимает без потерь и для уменьшения веса не годится.
				</p>
				<p className='mt-3 text-muted-foreground'>
					Если вес устраивает, а нужен именно другой формат (перевести скачанный
					с сайта WebP в привычный JPG, получить PNG с прозрачностью для вставки
					в макет), берите{' '}
					<Link
						href='/tools/image-converter'
						className='cursor-pointer font-medium text-primary hover:underline'
					>
						конвертер изображений
					</Link>
					: там есть PNG и рамка задачи другая.
				</p>
			</section>
		</div>
	)
}
