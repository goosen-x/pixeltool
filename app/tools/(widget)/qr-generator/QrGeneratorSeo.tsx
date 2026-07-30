import Link from 'next/link'

/**
 * SEO-контент под генератором QR-кодов. Секции закрывают то, что не поместилось
 * в короткие FAQ-ответы: приватность генерации и универсальную ссылку на
 * приложение — самую нетривиальную функцию тула.
 */
export function QrGeneratorSeo() {
	return (
		<div className='mx-auto mt-16 max-w-3xl space-y-12'>
			<section>
				<h2 className='text-2xl font-bold tracking-tight'>
					Как собирается QR-код
				</h2>
				<p className='mt-3 text-muted-foreground'>
					Код рисуется прямо в браузере — данные из полей превращаются в
					картинку на <code className='font-mono'>canvas</code> без обращения к
					серверу. Это значит, что ссылка, пароль от Wi-Fi или ID приложения
					никуда не передаются: всё, что вы ввели, остаётся на вашем устройстве,
					а итоговый PNG можно сразу скачать или скопировать в буфер обмена.
				</p>
			</section>

			<section>
				<h2 className='text-2xl font-bold tracking-tight'>
					QR-код на приложение: iOS, Android или обе платформы сразу
				</h2>
				<p className='mt-3 text-muted-foreground'>
					Для ссылки на конкретный магазин достаточно ID: числового
					идентификатора из URL App Store для iOS или package ID (вида{' '}
					<code className='font-mono'>com.example.app</code>) для Google Play.
					Но если код должен работать одинаково на любом телефоне — выбирайте
					режим «Универсальная»: инструмент соберёт ссылку на собственный
					редирект, который на лету определит систему устройства и откроет
					нужный магазин — не нужно печатать два разных кода для iPhone и
					Android.
				</p>
			</section>

			<p className='text-muted-foreground'>
				Пошаговый разбор — какой тип данных выбрать, какой уровень коррекции
				ошибок нужен для печати и что делать, если код не сканируется, — в
				статье{' '}
				<Link
					href='/blog/kak-sozdat-qr-kod'
					className='cursor-pointer font-medium text-primary hover:underline'
				>
					Как создать QR-код: пошаговая инструкция
				</Link>
				. Проверить готовый код перед печатью можно в{' '}
				<Link
					href='/tools/qr-scanner'
					className='cursor-pointer font-medium text-primary hover:underline'
				>
					сканере QR-кодов
				</Link>
				.
			</p>
		</div>
	)
}
