export function HttpStatusCodesSeo() {
	return (
		<div className='mx-auto mt-16 max-w-3xl space-y-12'>
			<section>
				<h2 className='text-2xl font-bold tracking-tight'>
					Что означает первая цифра кода
				</h2>
				<p className='mt-3 text-muted-foreground'>
					Коды ответа HTTP разбиты на пять классов по первой цифре: 1xx —
					информационные (запрос ещё обрабатывается), 2xx — успех, 3xx —
					редирект на другой адрес, 4xx — ошибка на стороне клиента (неверный
					запрос, нет доступа, ресурс не найден), 5xx — ошибка на стороне
					сервера. По одной этой цифре уже понятно, в какую сторону смотреть при
					отладке, даже не читая точное название кода.
				</p>
			</section>

			<section>
				<h2 className='text-2xl font-bold tracking-tight'>
					Зачем нужны коды, если есть текст ошибки
				</h2>
				<p className='mt-3 text-muted-foreground'>
					Текст сообщения об ошибке пишет каждый сервер по-своему, а числовой
					код — часть стандарта HTTP и одинаков везде. Скрипт, который
					обрабатывает ответ сервера, проверяет именно код, а не текст: это
					предсказуемо работает независимо от языка интерфейса и конкретной
					формулировки. Разница между похожими кодами тоже не случайна —
					например, 401 означает «сначала войдите», а 403 — «вы вошли, но сюда
					всё равно нельзя».
				</p>
			</section>

			<section>
				<h2 className='text-2xl font-bold tracking-tight'>
					Коды, которые встречаются чаще всего
				</h2>
				<p className='mt-3 text-muted-foreground'>
					Из нескольких десятков кодов на практике нужны меньше пятнадцати. Вот
					они, с ситуацией, в которой каждый обычно появляется:
				</p>
				<div className='mt-4 overflow-x-auto'>
					<table className='w-full text-left text-sm'>
						<thead>
							<tr className='border-b text-muted-foreground'>
								<th className='py-2 pr-4 font-medium'>Код</th>
								<th className='py-2 pr-4 font-medium'>Название</th>
								<th className='py-2 font-medium'>Когда возникает</th>
							</tr>
						</thead>
						<tbody className='text-foreground'>
							<tr className='border-b'>
								<td className='py-2 pr-4 font-mono'>200</td>
								<td className='py-2 pr-4'>OK</td>
								<td className='py-2'>Запрос выполнен успешно</td>
							</tr>
							<tr className='border-b'>
								<td className='py-2 pr-4 font-mono'>301</td>
								<td className='py-2 pr-4'>Moved Permanently</td>
								<td className='py-2'>
									Ресурс окончательно переехал на новый адрес
								</td>
							</tr>
							<tr className='border-b'>
								<td className='py-2 pr-4 font-mono'>302</td>
								<td className='py-2 pr-4'>Found</td>
								<td className='py-2'>Временный редирект, адрес ещё вернётся</td>
							</tr>
							<tr className='border-b'>
								<td className='py-2 pr-4 font-mono'>400</td>
								<td className='py-2 pr-4'>Bad Request</td>
								<td className='py-2'>Сервер не смог разобрать запрос</td>
							</tr>
							<tr className='border-b'>
								<td className='py-2 pr-4 font-mono'>401</td>
								<td className='py-2 pr-4'>Unauthorized</td>
								<td className='py-2'>
									Нужна авторизация, вход ещё не выполнен
								</td>
							</tr>
							<tr className='border-b'>
								<td className='py-2 pr-4 font-mono'>403</td>
								<td className='py-2 pr-4'>Forbidden</td>
								<td className='py-2'>
									Вход выполнен, но доступа к ресурсу нет
								</td>
							</tr>
							<tr className='border-b'>
								<td className='py-2 pr-4 font-mono'>404</td>
								<td className='py-2 pr-4'>Not Found</td>
								<td className='py-2'>Ресурс по этому адресу не существует</td>
							</tr>
							<tr className='border-b'>
								<td className='py-2 pr-4 font-mono'>429</td>
								<td className='py-2 pr-4'>Too Many Requests</td>
								<td className='py-2'>
									Превышен лимит запросов, нужно снизить частоту
								</td>
							</tr>
							<tr className='border-b'>
								<td className='py-2 pr-4 font-mono'>500</td>
								<td className='py-2 pr-4'>Internal Server Error</td>
								<td className='py-2'>
									Сервер упал на своей стороне без уточнения причины
								</td>
							</tr>
							<tr className='border-b'>
								<td className='py-2 pr-4 font-mono'>502</td>
								<td className='py-2 pr-4'>Bad Gateway</td>
								<td className='py-2'>
									Промежуточный сервер получил некорректный ответ от
									вышестоящего
								</td>
							</tr>
							<tr>
								<td className='py-2 pr-4 font-mono'>503</td>
								<td className='py-2 pr-4'>Service Unavailable</td>
								<td className='py-2'>
									Сервер временно не может обработать запрос (перегрузка,
									обслуживание)
								</td>
							</tr>
						</tbody>
					</table>
				</div>
			</section>
		</div>
	)
}
