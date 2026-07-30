import Link from 'next/link'

/**
 * SEO-контент под сканером QR-кодов. Закрывает то, что не поместилось в FAQ:
 * что именно показывает сканер после распознавания и как он technически
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
					Сканер выводит ровно то, что зашито внутри кода, — как есть, без
					интерпретации. Если это ссылка, рядом с текстом появится кнопка
					«Открыть ссылку»; если текст, номер телефона, данные Wi-Fi сети или
					что-то ещё — результат просто можно скопировать в буфер обмена кнопкой
					«Копировать». Расшифровкой формата (например, восстановлением имени
					сети и пароля из строки Wi-Fi-кода) сканер не занимается — это задача
					того, кто код создавал.
				</p>
			</section>

			<section>
				<h2 className='text-2xl font-bold tracking-tight'>
					Как сканер распознаёт код без сервера
				</h2>
				<p className='mt-3 text-muted-foreground'>
					Камера отдаёт кадры на скрытый{' '}
					<code className='font-mono'>canvas</code>, а библиотека для
					распознавания разбирает пиксели прямо в браузере — непрерывно, по
					кадрам через <code className='font-mono'>requestAnimationFrame</code>,
					без отдельной кнопки «сделать снимок». То же самое происходит и с
					загруженной картинкой: файл рисуется на том же canvas и анализируется
					локально. Ни видеопоток, ни картинка никуда не отправляются.
				</p>
			</section>

			<p className='text-muted-foreground'>
				Если код не сканируется камерой телефона на печати — распространённые
				причины (мало контраста, мелкий размер, блики) разобраны в статье{' '}
				<Link
					href='/blog/kak-sozdat-qr-kod'
					className='cursor-pointer font-medium text-primary hover:underline'
				>
					Как создать QR-код: пошаговая инструкция
				</Link>
				. Собрать свой код — в{' '}
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
