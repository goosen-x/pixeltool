import Link from 'next/link'

/**
 * SEO-контент под генератором паролей. Секции закрывают доверие к клиентской
 * генерации и разницу «генератор vs менеджер» — то, что ищут рядом с «генератор
 * паролей», но не покрыто короткими FAQ-ответами.
 */
export function PasswordSeo() {
	return (
		<div className='mx-auto mt-16 max-w-3xl space-y-12'>
			<section>
				<h2 className='text-2xl font-bold tracking-tight'>
					Как работает генератор паролей
				</h2>
				<p className='mt-3 text-muted-foreground'>
					Пароль собирается прямо в браузере через{' '}
					<code className='font-mono'>crypto.getRandomValues</code>,
					криптографически стойкий генератор случайных чисел. Тот же механизм
					используют менеджеры паролей и браузерные автозаполнения. Ни сам
					пароль, ни параметры генерации никуда не отправляются. Страницу можно
					открыть даже без интернета после первой загрузки, и результат будет
					таким же случайным.
				</p>

				<p className='mt-4 text-muted-foreground'>
					Стойкость пароля измеряется в битах энтропии: это длина, умноженная на
					двоичный логарифм размера алфавита. Сколько получается при разных
					наборах:
				</p>
				<div className='mt-4 overflow-x-auto'>
					<table className='w-full text-left text-sm'>
						<thead>
							<tr className='border-b text-muted-foreground'>
								<th className='py-2 pr-4 font-medium'>Набор символов</th>
								<th className='py-2 pr-4 font-medium'>Символов</th>
								<th className='py-2 pr-4 font-medium'>8 знаков</th>
								<th className='py-2 pr-4 font-medium'>12 знаков</th>
								<th className='py-2 font-medium'>16 знаков</th>
							</tr>
						</thead>
						<tbody className='text-foreground'>
							<tr className='border-b'>
								<td className='py-2 pr-4'>Только строчные</td>
								<td className='py-2 pr-4 font-mono'>26</td>
								<td className='py-2 pr-4 font-mono'>38 бит</td>
								<td className='py-2 pr-4 font-mono'>56 бит</td>
								<td className='py-2 font-mono'>75 бит</td>
							</tr>
							<tr className='border-b'>
								<td className='py-2 pr-4'>Строчные и заглавные</td>
								<td className='py-2 pr-4 font-mono'>52</td>
								<td className='py-2 pr-4 font-mono'>46 бит</td>
								<td className='py-2 pr-4 font-mono'>68 бит</td>
								<td className='py-2 font-mono'>91 бит</td>
							</tr>
							<tr className='border-b'>
								<td className='py-2 pr-4'>Плюс цифры</td>
								<td className='py-2 pr-4 font-mono'>62</td>
								<td className='py-2 pr-4 font-mono'>48 бит</td>
								<td className='py-2 pr-4 font-mono'>71 бит</td>
								<td className='py-2 font-mono'>95 бит</td>
							</tr>
							<tr>
								<td className='py-2 pr-4'>Плюс спецсимволы</td>
								<td className='py-2 pr-4 font-mono'>88</td>
								<td className='py-2 pr-4 font-mono'>52 бита</td>
								<td className='py-2 pr-4 font-mono'>78 бит</td>
								<td className='py-2 font-mono'>103 бита</td>
							</tr>
						</tbody>
					</table>
				</div>
				<p className='mt-4 text-muted-foreground'>
					Последняя строка это настройки по умолчанию: 16 знаков из всех четырёх
					наборов. Ориентир простой: до 60 бит пароль слабый, 80 бит приемлемо,
					от 100 бит перебором его не возьмут.
				</p>
			</section>

			<section>
				<h2 className='text-2xl font-bold tracking-tight'>
					Генератор или менеджер паролей
				</h2>
				<p className='mt-3 text-muted-foreground'>
					Это разные задачи. Генератор придумывает здесь и сейчас один случайный
					пароль нужной длины и сложности. Менеджер паролей хранит уже
					сгенерированные пароли для всех сайтов и подставляет их при входе, и
					для этого хватает встроенного менеджера в браузере или телефоне,
					ставить отдельное приложение необязательно. Генератор менеджер не
					заменяет. Связка обычная: генератор делает уникальный пароль под
					конкретный сайт, а менеджер его запоминает, чтобы не пришлось вводить
					руками или повторно использовать один и тот же пароль везде.
				</p>
			</section>

			<p className='text-muted-foreground'>
				Пошаговый разбор, что делает пароль надёжным и как придумать его самому,
				без генератора, есть в статье{' '}
				<Link
					href='/blog/nadezhnyy-parol'
					className='cursor-pointer font-medium text-primary hover:underline'
				>
					Как создать надёжный пароль
				</Link>
				.
			</p>
		</div>
	)
}
