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
					Код рисуется прямо в браузере, данные из полей превращаются в картинку
					на <code className='font-mono'>canvas</code> без обращения к серверу.
					Значит, ссылка, пароль от Wi-Fi или ID приложения никуда не
					передаются. Всё, что вы ввели, остаётся на вашем устройстве, а
					итоговый PNG можно сразу скачать или скопировать в буфер обмена.
				</p>

				<p className='mt-4 text-muted-foreground'>
					QR-код это просто закодированная строка. Три режима инструмента
					отличаются только тем, какую строку он собирает:
				</p>
				<div className='mt-4 overflow-x-auto'>
					<table className='w-full text-left text-sm'>
						<thead>
							<tr className='border-b text-muted-foreground'>
								<th className='py-2 pr-4 font-medium'>Режим</th>
								<th className='py-2 pr-4 font-medium'>Что попадает в код</th>
								<th className='py-2 font-medium'>Как ведёт себя камера</th>
							</tr>
						</thead>
						<tbody className='text-foreground'>
							<tr className='border-b'>
								<td className='py-2 pr-4'>Ссылка</td>
								<td className='py-2 pr-4 font-mono'>адрес как есть</td>
								<td className='py-2'>предлагает открыть сайт</td>
							</tr>
							<tr className='border-b'>
								<td className='py-2 pr-4'>Wi-Fi</td>
								<td className='py-2 pr-4 font-mono'>
									WIFI:T:тип;S:имя;P:пароль;H:скрытая;
								</td>
								<td className='py-2'>предлагает подключиться к сети</td>
							</tr>
							<tr>
								<td className='py-2 pr-4'>Приложение</td>
								<td className='py-2 pr-4 font-mono'>
									ссылка на App Store или Google Play
								</td>
								<td className='py-2'>открывает магазин на нужной странице</td>
							</tr>
						</tbody>
					</table>
				</div>
				<p className='mt-4 text-muted-foreground'>
					Пароль от Wi-Fi лежит в коде открытым текстом: любой, кто отсканирует
					картинку, увидит его целиком. Поэтому такой код уместен на стене в
					кафе, но не в открытом посте.
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
					Но если код должен работать одинаково на любом телефоне, выбирайте
					режим «Универсальная». Инструмент соберёт ссылку на собственный
					редирект, который на лету определит систему устройства и откроет
					нужный магазин. Печатать два разных кода для iPhone и Android не
					придётся.
				</p>
			</section>

			<p className='text-muted-foreground'>
				Какой тип данных выбрать, какой уровень коррекции ошибок нужен для
				печати и что делать, если код не сканируется, разобрано в статье{' '}
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
