import Link from 'next/link'

/**
 * SEO-контент под сканером QR-кодов. Закрывает то, что не поместилось в FAQ:
 * что именно показывает сканер после распознавания и как он технически
 * обрабатывает кадры без сервера.
 */
export function QrScannerSeo() {
	return (
		<div className='mx-auto mt-16 max-w-3xl space-y-12'>
			<section>
				<h2 className='text-2xl font-bold tracking-tight'>
					Что покажет сканер после распознавания
				</h2>
				<p className='mt-3 text-muted-foreground'>
					Сканер выводит ровно то, что зашито внутри кода, как есть, без
					интерпретации. Если это ссылка, рядом с текстом появится кнопка
					«Открыть ссылку». Если текст, номер телефона, данные Wi-Fi сети или
					что-то ещё, результат можно скопировать в буфер обмена кнопкой
					«Копировать». Расшифровкой формата, скажем восстановлением имени сети
					и пароля из строки Wi-Fi-кода, сканер не занимается, это задача того,
					кто код создавал.
				</p>

				<p className='mt-4 text-muted-foreground'>
					Внутри кода всегда текст, но по его началу видно, чем он был задуман:
				</p>
				<div className='mt-4 overflow-x-auto'>
					<table className='w-full text-left text-sm'>
						<thead>
							<tr className='border-b text-muted-foreground'>
								<th className='py-2 pr-4 font-medium'>Начало строки</th>
								<th className='py-2 pr-4 font-medium'>Что это</th>
								<th className='py-2 font-medium'>Что делать</th>
							</tr>
						</thead>
						<tbody className='text-foreground'>
							<tr className='border-b'>
								<td className='py-2 pr-4 font-mono'>https:// или http://</td>
								<td className='py-2 pr-4'>ссылка на сайт</td>
								<td className='py-2'>
									открыть, предварительно посмотрев домен
								</td>
							</tr>
							<tr className='border-b'>
								<td className='py-2 pr-4 font-mono'>WIFI:</td>
								<td className='py-2 pr-4'>параметры сети</td>
								<td className='py-2'>
									подключиться, имя и пароль видны в тексте
								</td>
							</tr>
							<tr className='border-b'>
								<td className='py-2 pr-4 font-mono'>tel: или sms:</td>
								<td className='py-2 pr-4'>телефон</td>
								<td className='py-2'>позвонить или написать</td>
							</tr>
							<tr className='border-b'>
								<td className='py-2 pr-4 font-mono'>mailto:</td>
								<td className='py-2 pr-4'>адрес почты</td>
								<td className='py-2'>написать письмо</td>
							</tr>
							<tr className='border-b'>
								<td className='py-2 pr-4 font-mono'>BEGIN:VCARD</td>
								<td className='py-2 pr-4'>визитка</td>
								<td className='py-2'>сохранить контакт</td>
							</tr>
							<tr>
								<td className='py-2 pr-4 font-mono'>обычный текст</td>
								<td className='py-2 pr-4'>просто строка</td>
								<td className='py-2'>скопировать</td>
							</tr>
						</tbody>
					</table>
				</div>
				<p className='mt-4 text-muted-foreground'>
					Сканер ничего не открывает сам и показывает содержимое текстом: по
					QR-коду на объявлении легко увести на поддельный сайт, и увидеть адрес
					до перехода тут важнее удобства.
				</p>
			</section>

			<section>
				<h2 className='text-2xl font-bold tracking-tight'>
					Как сканер распознаёт код
				</h2>
				<p className='mt-3 text-muted-foreground'>
					Камера отдаёт кадры на скрытый{' '}
					<code className='font-mono'>canvas</code>, а библиотека для
					распознавания разбирает пиксели прямо в браузере, непрерывно, по
					кадрам через <code className='font-mono'>requestAnimationFrame</code>,
					без отдельной кнопки «сделать снимок». То же самое происходит и с
					загруженной картинкой: файл рисуется на том же canvas и анализируется
					локально. Ни видеопоток, ни картинка никуда не отправляются.
				</p>
			</section>

			<p className='text-muted-foreground'>
				Если код не сканируется камерой телефона на печати, распространённые
				причины (мало контраста, мелкий размер, блики) разобраны в статье{' '}
				<Link
					href='/blog/kak-sozdat-qr-kod'
					className='cursor-pointer font-medium text-primary hover:underline'
				>
					Как создать QR-код: пошаговая инструкция
				</Link>
				. Собрать свой код можно в{' '}
				<Link
					href='/tools/qr-generator'
					className='cursor-pointer font-medium text-primary hover:underline'
				>
					генераторе QR-кодов
				</Link>
				.
			</p>
		</div>
	)
}
