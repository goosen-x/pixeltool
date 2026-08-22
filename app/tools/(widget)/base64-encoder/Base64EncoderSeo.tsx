import Link from 'next/link'

/**
 * SEO-контент под Base64-кодировщиком. Закрывает то, что не поместилось в
 * FAQ: феномен data:image/png;base64 (крупный кластер спроса) и разницу
 * между обычным Base64 и URL-безопасным вариантом.
 */
export function Base64EncoderSeo() {
	return (
		<div className='mx-auto mt-16 max-w-3xl space-y-12'>
			<section>
				<h2 className='text-2xl font-bold tracking-tight'>
					Что такое строка data:image/png;base64
				</h2>
				<p className='mt-3 text-muted-foreground'>
					Если вы встретили в коде страницы длинную строку вида{' '}
					<code className='font-mono'>data:image/png;base64,iVBORw0KG...</code>,
					это картинка, закодированная в Base64 и вставленная прямо в HTML или
					CSS вместо ссылки на файл. Быстрее всего увидеть саму картинку так:
					скопировать строку целиком (вместе с{' '}
					<code className='font-mono'>data:</code>) и вставить в адресную строку
					браузера. Он отрисует её как обычное изображение.
				</p>
			</section>

			<section>
				<h2 className='text-2xl font-bold tracking-tight'>
					Чем URL-безопасный Base64 отличается от обычного
				</h2>
				<p className='mt-3 text-muted-foreground'>
					Переключатель «URL-безопасный» меняет два символа алфавита:{' '}
					<code className='font-mono'>+</code> и{' '}
					<code className='font-mono'>/</code> на{' '}
					<code className='font-mono'>-</code> и{' '}
					<code className='font-mono'>_</code>, а завершающие{' '}
					<code className='font-mono'>=</code> убираются. Так строку можно
					безопасно использовать прямо в адресе страницы. Именно в таком виде
					закодированы части{' '}
					<Link
						href='/tools/jwt-decoder'
						className='cursor-pointer font-medium text-primary hover:underline'
					>
						JWT-токенов
					</Link>{' '}
					. Если вставить такую часть сюда без включённого переключателя,
					декодер покажет ошибку или мусор вместо текста.
				</p>
			</section>

			<p className='text-muted-foreground'>
				Зачем вообще нужен Base64, какие ошибки чаще всего ломают декодирование
				и что лежит внутри длинной строки с картинкой, разобрано в статье{' '}
				<Link
					href='/blog/chto-takoe-base64'
					className='cursor-pointer font-medium text-primary hover:underline'
				>
					Что такое Base64: как раскодировать строку и посмотреть, что внутри
				</Link>
				.
			</p>
		</div>
	)
}
