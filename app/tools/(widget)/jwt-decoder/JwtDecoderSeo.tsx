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
					Вставьте строку в поле выше — расшифровка начнётся сразу, кнопок
					нажимать не нужно. Ключ не требуется: заголовок и payload у JWT не
					зашифрованы, а всего лишь закодированы, поэтому прочитать их может кто
					угодно. Декодер разложит токен на три части, покажет claims списком с
					расшифровкой стандартных имён и отдельно выведет срок действия — истёк
					токен или сколько ему осталось. Разбор происходит прямо в браузере —
					токен целиком остаётся на вашем устройстве.
				</p>
			</section>

			<section>
				<h2 className='text-2xl font-bold tracking-tight'>
					Формат токена: из чего состоит JWT
				</h2>
				<p className='mt-3 text-muted-foreground'>
					JWT — это три блока, разделённые точками: <strong>заголовок</strong>{' '}
					(каким алгоритмом подписан токен), <strong>payload</strong> (сами
					данные — кто пользователь, какие у него роли, до какого времени токен
					годен) и <strong>подпись</strong> (она не содержит данных, а
					доказывает, что токен не подделали). Первые два блока — обычный{' '}
					<Link
						href='/tools/json-tools'
						className='cursor-pointer font-medium text-primary hover:underline'
					>
						JSON
					</Link>
					, поэтому декодер и показывает их читаемым списком.
				</p>
			</section>

			<section>
				<h2 className='text-2xl font-bold tracking-tight'>
					Расшифровать токен — не значит проверить его
				</h2>
				<p className='mt-3 text-muted-foreground'>
					Это разные операции, и путать их опасно. Расшифровка — разбор Base64,
					ключ не нужен, делает кто угодно. Проверка токена — пересчёт подписи
					секретным или публичным ключом, и только она отвечает на вопрос «этот
					токен вообще наш?». Здесь подпись не проверяется намеренно: для этого
					пришлось бы просить у вас ключ. Поэтому решение о доступе всегда
					принимается на сервере после верификации, а декодер — инструмент для
					отладки: посмотреть, что внутри, и понять, почему запрос отлетает.
					Подробный разбор с примерами кода — в статье{' '}
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
					Заголовок, payload и подпись JWT закодированы в{' '}
					<strong>Base64URL</strong> — варианте Base64, где символы{' '}
					<code className='font-mono'>+</code> и{' '}
					<code className='font-mono'>/</code> заменены на{' '}
					<code className='font-mono'>-</code> и{' '}
					<code className='font-mono'>_</code>, а завершающие{' '}
					<code className='font-mono'>=</code> обычно опущены — так строку можно
					безопасно вставлять в URL и заголовки без экранирования. Обычный{' '}
					<Link
						href='/tools/base64-encoder'
						className='cursor-pointer font-medium text-primary hover:underline'
					>
						Base64-кодировщик
					</Link>{' '}
					на такой строке споткнётся или выдаст мусор — этот декодер сначала
					возвращает символы обратно и восстанавливает паддинг, а потом уже
					разбирает JSON.
				</p>
			</section>

			<section>
				<h2 className='text-2xl font-bold tracking-tight'>
					Не вставляйте сюда боевые токены с чужими данными
				</h2>
				<p className='mt-3 text-muted-foreground'>
					Декодирование происходит локально в браузере — но это не повод
					копировать в любой сайт токен из продакшена, где в payload лежат
					реальные email, роли или ID пользователей. Для отладки формата и
					claims безопаснее использовать один из встроенных примеров (Auth0,
					Firebase, AWS Cognito) или тестовый токен, который вы сгенерировали
					сами, а не тот, что выдала боевая система реальному пользователю.
				</p>
			</section>

			<p className='text-muted-foreground'>
				JWT — те же данные JSON, просто закодированные в base64; разбор самого
				формата и отличие от XML — в статье{' '}
				<Link
					href='/blog/chto-takoe-json'
					className='cursor-pointer font-medium text-primary hover:underline'
				>
					Что такое JSON: формат данных простыми словами
				</Link>
				, а про access- и refresh-токены, срок жизни и типичные ошибки — в{' '}
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
