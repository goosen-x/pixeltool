import Link from 'next/link'

/**
 * SEO-контент под JWT-декодером. Закрывает то, что не поместилось в FAQ:
 * разницу base64 / base64url и совет не носить в подобные инструменты
 * боевые токены с чужими данными.
 */
export function JwtDecoderSeo() {
	return (
		<div className='mx-auto mt-16 max-w-3xl space-y-12'>
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
					Декодирование происходит локально в браузере, и сам инструмент никуда
					токен не отправляет — но это не повод копировать в любой сайт токен из
					продакшена, где в payload лежат реальные email, роли или ID
					пользователей. Для отладки формата и claims безопаснее использовать
					один из встроенных примеров (Auth0, Firebase, AWS Cognito) или
					тестовый токен, который вы сгенерировали сами, а не тот, что выдала
					боевая система реальному пользователю.
				</p>
			</section>

			<p className='text-muted-foreground'>
				JWT — те же данные JSON, просто закодированные в base64; разбор формата
				и отличие от XML — в статье{' '}
				<Link
					href='/blog/chto-takoe-json'
					className='cursor-pointer font-medium text-primary hover:underline'
				>
					Что такое JSON: формат данных простыми словами
				</Link>
				.
			</p>
		</div>
	)
}
