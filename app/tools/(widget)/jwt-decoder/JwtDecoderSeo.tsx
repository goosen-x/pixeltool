import Link from 'next/link'

/**
 * SEO-контент под JWT-декодером. Заголовки секций стоят на формах, которыми
 * спрос реально сформулирован (Вордстат 03.08.2026): «расшифровать jwt токен»
 * ~190/мес, «формат токена jwt» 81, «jwt проверить токен» + «jwt токен
 * проверка» 69. Раньше здесь были только два предостережения — про base64url
 * и про боевые токены: полезные, но ни один из главных запросов не закрывали.
 */
export function JwtDecoderSeo() {
	return (
		<div className='mx-auto mt-16 max-w-3xl space-y-12'>
			<section>
				<h2 className='text-2xl font-bold tracking-tight'>
					Как расшифровать JWT токен
				</h2>
				<p className='mt-3 text-muted-foreground'>
					Вставьте строку в поле выше, и расшифровка начнётся сразу, кнопок
					нажимать не нужно. Ключ не требуется: заголовок и payload у JWT не
					зашифрованы, а всего лишь закодированы, поэтому прочитать их может кто
					угодно. Декодер разложит токен на три части, покажет claims списком с
					расшифровкой стандартных имён и отдельно выведет срок действия: истёк
					токен или сколько ему осталось. Всё считается прямо в браузере, токен
					никуда не отправляется.
				</p>
			</section>

			<section>
				<h2 className='text-2xl font-bold tracking-tight'>
					Формат токена: из чего состоит JWT
				</h2>
				<p className='mt-3 text-muted-foreground'>
					JWT — это три блока, разделённые точками: заголовок (каким алгоритмом
					подписан токен), payload (сами данные: кто пользователь, какие у него
					роли, до какого времени токен годен) и подпись (она не содержит
					данных, а доказывает, что токен не подделали). Первые два блока —
					обычный{' '}
					<Link
						href='/tools/json-tools'
						className='cursor-pointer font-medium text-primary hover:underline'
					>
						JSON
					</Link>
					, поэтому декодер и показывает их читаемым списком.
				</p>
				<p className='mt-3 text-muted-foreground'>
					У payload есть набор стандартных полей (registered claims), их
					понимает любая библиотека JWT:
				</p>
				<div className='mt-4 overflow-x-auto'>
					<table className='w-full text-left text-sm'>
						<thead>
							<tr className='border-b text-muted-foreground'>
								<th className='py-2 pr-4 font-medium'>Claim</th>
								<th className='py-2 font-medium'>Значение</th>
							</tr>
						</thead>
						<tbody className='text-foreground'>
							<tr className='border-b'>
								<td className='py-2 pr-4 font-mono'>iss</td>
								<td className='py-2'>Issuer, кто выпустил токен</td>
							</tr>
							<tr className='border-b'>
								<td className='py-2 pr-4 font-mono'>sub</td>
								<td className='py-2'>
									Subject, для кого выпущен токен (ID пользователя)
								</td>
							</tr>
							<tr className='border-b'>
								<td className='py-2 pr-4 font-mono'>aud</td>
								<td className='py-2'>
									Audience, для какого получателя предназначен токен
								</td>
							</tr>
							<tr className='border-b'>
								<td className='py-2 pr-4 font-mono'>exp</td>
								<td className='py-2'>
									Expiration time, момент, после которого токен недействителен
								</td>
							</tr>
							<tr className='border-b'>
								<td className='py-2 pr-4 font-mono'>iat</td>
								<td className='py-2'>Issued at, когда токен выпущен</td>
							</tr>
							<tr className='border-b'>
								<td className='py-2 pr-4 font-mono'>nbf</td>
								<td className='py-2'>
									Not before, момент, раньше которого токен ещё не действует
								</td>
							</tr>
							<tr>
								<td className='py-2 pr-4 font-mono'>jti</td>
								<td className='py-2'>
									JWT ID, уникальный идентификатор конкретного токена
								</td>
							</tr>
						</tbody>
					</table>
				</div>
			</section>

			<section>
				<h2 className='text-2xl font-bold tracking-tight'>
					Расшифровать токен — не значит проверить его
				</h2>
				<p className='mt-3 text-muted-foreground'>
					Это разные операции, и путать их опасно. Расшифровка — разбор Base64,
					ключ не нужен, делает кто угодно. Проверка токена — пересчёт подписи
					секретным или публичным ключом, и только она отвечает на вопрос «этот
					токен вообще наш?». Здесь подпись не проверяется намеренно, для этого
					пришлось бы просить у вас ключ. Поэтому решение о доступе всегда
					принимается на сервере после верификации, а декодер остаётся
					инструментом для отладки: посмотреть, что внутри, и понять, почему
					запрос отлетает. Разбор с примерами кода есть в статье{' '}
					<Link
						href='/blog/chto-takoe-jwt'
						className='cursor-pointer font-medium text-primary hover:underline'
					>
						что внутри JWT-токена и как работает авторизация
					</Link>
					.
				</p>
			</section>

			<section>
				<h2 className='text-2xl font-bold tracking-tight'>
					Почему JWT не декодируется обычным Base64
				</h2>
				<p className='mt-3 text-muted-foreground'>
					Заголовок, payload и подпись JWT закодированы в Base64URL, варианте
					Base64, где символы <code className='font-mono'>+</code> и{' '}
					<code className='font-mono'>/</code> заменены на{' '}
					<code className='font-mono'>-</code> и{' '}
					<code className='font-mono'>_</code>, а завершающие{' '}
					<code className='font-mono'>=</code> обычно опущены. Так строку можно
					безопасно вставлять в URL и заголовки без экранирования. Обычный{' '}
					<Link
						href='/tools/base64-encoder'
						className='cursor-pointer font-medium text-primary hover:underline'
					>
						Base64-кодировщик
					</Link>{' '}
					на такой строке споткнётся или выдаст мусор. Этот декодер сначала
					возвращает символы обратно и восстанавливает паддинг, а потом уже
					разбирает JSON.
				</p>
			</section>

			<section>
				<h2 className='text-2xl font-bold tracking-tight'>
					Не вставляйте сюда боевые токены с чужими данными
				</h2>
				<p className='mt-3 text-muted-foreground'>
					Декодирование происходит локально в браузере, и сам инструмент никуда
					токен не отправляет. Но это не повод копировать в любой сайт токен из
					продакшена, где в payload лежат реальные email, роли или ID
					пользователей. Для отладки формата и claims безопаснее взять один из
					встроенных примеров (Auth0, Firebase, AWS Cognito) или тестовый токен,
					который вы сгенерировали сами, а не тот, что выдала боевая система
					реальному пользователю.
				</p>
			</section>

			<p className='text-muted-foreground'>
				JWT — те же данные JSON, просто закодированные в base64. Разбор самого
				формата и отличие от XML есть в статье{' '}
				<Link
					href='/blog/chto-takoe-json'
					className='cursor-pointer font-medium text-primary hover:underline'
				>
					Что такое JSON: формат данных простыми словами
				</Link>
				, а про access- и refresh-токены, срок жизни и типичные ошибки написано
				в{' '}
				<Link
					href='/blog/chto-takoe-jwt'
					className='cursor-pointer font-medium text-primary hover:underline'
				>
					разборе JWT-токена
				</Link>
				.
			</p>
		</div>
	)
}
