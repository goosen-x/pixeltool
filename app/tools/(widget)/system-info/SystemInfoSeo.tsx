import Link from 'next/link'

/**
 * SEO-контент под инструментом. Раскрывает два интента, которые не
 * поместились в FAQ: разница логического/физического разрешения (Retina) и
 * что вообще такое User-Agent и зачем сайты его читают.
 */
export function SystemInfoSeo() {
	return (
		<div className='mx-auto mt-16 max-w-3xl space-y-12'>
			<section>
				<h2 className='text-2xl font-bold tracking-tight'>
					Логическое и физическое разрешение: в чём разница
				</h2>
				<p className='mt-3 text-muted-foreground'>
					На Retina-экранах (MacBook, iPhone, большинство современных
					Android-флагманов) эти два числа расходятся. Логическим оперирует
					вёрстка сайта: CSS-пиксель на экране с{' '}
					<code className='rounded bg-muted px-1.5 py-0.5 text-sm'>
						devicePixelRatio: 2
					</code>{' '}
					физически состоит из четырёх реальных пикселей матрицы. Физическое
					(actual) разрешение — то, что напечатано в характеристиках устройства
					в магазине. Для скриншота или дизайн-макета берите физическое, а для
					вёрстки под конкретную ширину экрана логическое.
				</p>
			</section>

			<section>
				<h2 className='text-2xl font-bold tracking-tight'>
					Что такое User-Agent и зачем сайты его читают
				</h2>
				<p className='mt-3 text-muted-foreground'>
					User-Agent — строка, которую браузер сам отправляет каждому сайту при
					запросе страницы: название и версия браузера, движок, операционная
					система. Сайты читают её, чтобы понять, какую вёрстку отдать и не
					сломается ли конкретная функция в старой версии браузера. Строка не
					защищена, её легко подделать расширением вроде `user agent switcher`,
					поэтому единственным источником правды она быть не может. Современные
					сайты дополнительно проверяют реальную поддержку конкретных функций
					(feature detection), а не только имя браузера из строки.
				</p>

				<p className='mt-4 text-muted-foreground'>
					Инструмент показывает пять групп данных, все из браузерных API:
				</p>
				<div className='mt-4 overflow-x-auto'>
					<table className='w-full text-left text-sm'>
						<thead>
							<tr className='border-b text-muted-foreground'>
								<th className='py-2 pr-4 font-medium'>Группа</th>
								<th className='py-2 font-medium'>Что внутри</th>
							</tr>
						</thead>
						<tbody className='text-foreground'>
							<tr className='border-b'>
								<td className='py-2 pr-4 font-mono'>Устройство</td>
								<td className='py-2'>
									тип, производитель, модель, ОС, платформа, архитектура
								</td>
							</tr>
							<tr className='border-b'>
								<td className='py-2 pr-4 font-mono'>Браузер</td>
								<td className='py-2'>
									название, версия, движок, язык, User-Agent
								</td>
							</tr>
							<tr className='border-b'>
								<td className='py-2 pr-4 font-mono'>Экран</td>
								<td className='py-2'>
									логическое и физическое разрешение, плотность пикселей,
									глубина цвета
								</td>
							</tr>
							<tr className='border-b'>
								<td className='py-2 pr-4 font-mono'>Ввод и сеть</td>
								<td className='py-2'>
									тип указателя, сенсорный ввод, тип соединения
								</td>
							</tr>
							<tr>
								<td className='py-2 pr-4 font-mono'>Хранилище и приватность</td>
								<td className='py-2'>
									куки, локальное хранилище, режим инкогнито, Do Not Track
								</td>
							</tr>
						</tbody>
					</table>
				</div>
			</section>

			<p className='text-muted-foreground'>
				Зачем знать разрешение и версию браузера в быту (техподдержка, покупка
				монитора, настройка приложений), разобрано в статье{' '}
				<Link
					href='/blog/kak-uznat-razreshenie-ekrana-i-brauzer'
					className='cursor-pointer font-medium text-primary hover:underline'
				>
					Как узнать разрешение экрана и версию браузера
				</Link>
				.
			</p>
		</div>
	)
}
