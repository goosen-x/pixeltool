import Link from 'next/link'

export function MergePdfSeo() {
	return (
		<div className='mx-auto mt-16 max-w-3xl space-y-12'>
			<section>
				<h2 className='text-2xl font-bold tracking-tight'>
					Почему документы никуда не отправляются
				</h2>
				<p className='mt-3 text-muted-foreground'>
					Обычные сервисы склейки принимают файлы на свой сервер, там их
					обрабатывают и отдают ссылку на результат. Для договора, паспорта или
					медицинской выписки это означает, что документ полежал на чужом диске
					— и вы не знаете, сколько именно. Здесь склейка идёт в самой вкладке:
					браузер читает файлы с диска, собирает новый документ в памяти и
					отдаёт его вам. Наружу не уходит ничего, и это видно по тому, что
					инструмент продолжает работать с выключенным интернетом.
				</p>
			</section>

			<section>
				<h2 className='text-2xl font-bold tracking-tight'>
					Порядок страниц задаёт список
				</h2>
				<p className='mt-3 text-muted-foreground'>
					Файлы склеиваются сверху вниз в том порядке, в каком стоят в списке, —
					стрелками его можно менять до объединения. Это важнее, чем кажется:
					при выборе нескольких файлов сразу система отдаёт их в своём порядке,
					обычно по алфавиту, а не в том, в котором вы их отмечали. Скан на
					десять листов, названный «Скан (1)…Скан (10)», по алфавиту встанет
					так, что десятый лист окажется вторым.
				</p>
			</section>

			<section>
				<h2 className='text-2xl font-bold tracking-tight'>
					Что происходит с содержимым страниц
				</h2>
				<p className='mt-3 text-muted-foreground'>
					Страницы переносятся в новый документ как есть, без перерисовки: текст
					остаётся текстом, его можно выделить и найти поиском, шрифты и
					картинки сохраняют качество, размер и поворот листа не меняются.
					Поэтому объединение не увеличивает вес — итоговый файл примерно равен
					сумме исходных. Если нужно, чтобы он весил меньше, это отдельная
					задача:{' '}
					<Link
						href='/tools/compress-pdf'
						className='cursor-pointer font-medium text-primary hover:underline'
					>
						сжатие PDF
					</Link>
					.
				</p>

				<p className='mt-4 text-muted-foreground'>
					При склейке страницы переносятся как есть, без перерисовки. Что при
					этом сохраняется, а что теряется:
				</p>
				<div className='mt-4 overflow-x-auto'>
					<table className='w-full text-left text-sm'>
						<thead>
							<tr className='border-b text-muted-foreground'>
								<th className='py-2 pr-4 font-medium'>Элемент документа</th>
								<th className='py-2 font-medium'>После объединения</th>
							</tr>
						</thead>
						<tbody className='text-foreground'>
							<tr className='border-b'>
								<td className='py-2 pr-4 font-mono'>Текст и шрифты</td>
								<td className='py-2'>сохраняются, текст остаётся выделяемым</td>
							</tr>
							<tr className='border-b'>
								<td className='py-2 pr-4 font-mono'>
									Картинки и векторная графика
								</td>
								<td className='py-2'>переносятся без пересжатия</td>
							</tr>
							<tr className='border-b'>
								<td className='py-2 pr-4 font-mono'>Поворот страницы</td>
								<td className='py-2'>сохраняется</td>
							</tr>
							<tr className='border-b'>
								<td className='py-2 pr-4 font-mono'>Разный размер страниц</td>
								<td className='py-2'>
									сохраняется, страницы остаются разного формата
								</td>
							</tr>
							<tr className='border-b'>
								<td className='py-2 pr-4 font-mono'>Закладки и оглавление</td>
								<td className='py-2'>теряются</td>
							</tr>
							<tr className='border-b'>
								<td className='py-2 pr-4 font-mono'>
									Формы и поля для заполнения
								</td>
								<td className='py-2'>теряются</td>
							</tr>
							<tr>
								<td className='py-2 pr-4 font-mono'>Пароль на открытие</td>
								<td className='py-2'>
									такой файл не примется, его надо снять заранее
								</td>
							</tr>
						</tbody>
					</table>
				</div>
			</section>

			<section>
				<h2 className='text-2xl font-bold tracking-tight'>Файлы с защитой</h2>
				<p className='mt-3 text-muted-foreground'>
					У многих PDF стоит формальная защита — запрет печати или правки с
					пустым паролем. Такие файлы открываются любой читалкой, и объединение
					с ними работает. А вот документ, который при открытии спрашивает
					пароль, зашифрован по-настоящему: его содержимое недоступно, пока
					пароль не введён. Снимите защиту в программе, где документ
					открывается, и объединяйте уже расшифрованную копию. Если готовый
					документ после склейки нужно ещё и подписать, для этого есть{' '}
					<Link
						href='/tools/sign-pdf'
						className='cursor-pointer font-medium text-primary hover:underline'
					>
						подпись PDF
					</Link>
					.
				</p>
			</section>
		</div>
	)
}
