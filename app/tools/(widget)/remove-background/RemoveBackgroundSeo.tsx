import Link from 'next/link'

export function RemoveBackgroundSeo() {
	return (
		<div className='mx-auto mt-16 max-w-3xl space-y-12'>
			<section>
				<h2 className='text-2xl font-bold tracking-tight'>
					Почему это не отправляется на сервер
				</h2>
				<p className='mt-3 text-muted-foreground'>
					Большинство похожих сервисов присылают фото на свой сервер, вырезают
					фон там и отдают результат обратно. Им так проще и быстрее, но ваше
					фото на время оказывается на чужом сервере. Здесь распознавание
					объекта считает модель ИИ, загруженная прямо в браузер. Она работает
					через WebAssembly на вашем устройстве, а фото никуда не отправляется.
					Проверить это можно во вкладке Network браузерных инструментов
					разработчика: после загрузки модели там не будет ни одного запроса с
					самим изображением.
				</p>
			</section>

			<section>
				<h2 className='text-2xl font-bold tracking-tight'>
					Плата за приватность — вес модели
				</h2>
				<p className='mt-3 text-muted-foreground'>
					У обработки в браузере есть цена. Чтобы ничего не отправлять на
					сервер, нужно сначала загрузить саму модель распознавания, а это около
					40 МБ при первом запуске на устройстве. Дальше браузер держит её в
					кэше, и повторных загрузок не будет, пока кэш не очистят вручную.
					Обработка каждого следующего фото после этого занимает пару секунд.
					PNG с прозрачным фоном обычно весит больше исходника, если файл нужен
					полегче, прогоните его через{' '}
					<Link
						href='/tools/compress-image'
						className='cursor-pointer font-medium text-primary hover:underline'
					>
						сжатие изображений
					</Link>
					.
				</p>

				<p className='mt-4 text-muted-foreground'>
					Что модель отделяет хорошо, а где придётся дорабатывать руками:
				</p>
				<div className='mt-4 overflow-x-auto'>
					<table className='w-full text-left text-sm'>
						<thead>
							<tr className='border-b text-muted-foreground'>
								<th className='py-2 pr-4 font-medium'>Сюжет</th>
								<th className='py-2 font-medium'>Результат</th>
							</tr>
						</thead>
						<tbody className='text-foreground'>
							<tr className='border-b'>
								<td className='py-2 pr-4 font-mono'>
									Человек на однородном фоне
								</td>
								<td className='py-2'>
									отделяется чисто, включая контур причёски
								</td>
							</tr>
							<tr className='border-b'>
								<td className='py-2 pr-4 font-mono'>Предмет на столе</td>
								<td className='py-2'>надёжно, если предмет контрастнее фона</td>
							</tr>
							<tr className='border-b'>
								<td className='py-2 pr-4 font-mono'>
									Волосы и шерсть на пёстром фоне
								</td>
								<td className='py-2'>на просвет остаются артефакты</td>
							</tr>
							<tr className='border-b'>
								<td className='py-2 pr-4 font-mono'>
									Прозрачное и полупрозрачное: стекло, вуаль
								</td>
								<td className='py-2'>модель считает это фоном и вырезает</td>
							</tr>
							<tr>
								<td className='py-2 pr-4 font-mono'>
									Несколько людей на общем плане
								</td>
								<td className='py-2'>мелкие фигуры по краям могут пропасть</td>
							</tr>
						</tbody>
					</table>
				</div>
				<p className='mt-4 text-muted-foreground'>
					Результат сохраняется в PNG: у JPEG нет прозрачности, и вместо
					вырезанного фона там оказался бы белый прямоугольник.
				</p>
			</section>
		</div>
	)
}
