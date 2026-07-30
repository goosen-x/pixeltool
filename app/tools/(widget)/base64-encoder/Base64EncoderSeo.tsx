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
					Строка data:image/png;base64 — что это
				</h2>
				<p className='mt-3 text-muted-foreground'>
					Если вы встретили в коде страницы длинную строку вида{' '}
					<code className='font-mono'>data:image/png;base64,iVBORw0KG...</code>—
					это картинка, закодированная в Base64 и вставленная прямо в HTML/CSS
					вместо ссылки на файл. Самый быстрый способ увидеть саму картинку —
					скопировать строку целиком (вместе с{' '}
					<code className='font-mono'>data:</code>) и вставить в адресную строку
					браузера: он отрисует её как обычное изображение.
				</p>
			</section>

			<section>
				<h2 className='text-2xl font-bold tracking-tight'>
					URL-безопасный Base64 — не то же самое, что обычный
				</h2>
				<p className='mt-3 text-muted-foreground'>
					Переключатель «URL-безопасный» меняет два символа алфавита:{' '}
					<code className='font-mono'>+</code> и{' '}
					<code className='font-mono'>/</code> на{' '}
					<code className='font-mono'>-</code> и{' '}
					<code className='font-mono'>_</code>, а завершающие{' '}
					<code className='font-mono'>=</code> убираются — так строку можно
					безопасно использовать прямо в адресе страницы. Именно в таком виде
					закодированы части{' '}
					<Link
						href='/tools/jwt-decoder'
						className='cursor-pointer font-medium text-primary hover:underline'
					>
						JWT-токенов
					</Link>{' '}
					— если вставить такую часть сюда без включённого переключателя,
					декодер покажет ошибку или мусор вместо текста.
				</p>
			</section>

			<p className='text-muted-foreground'>
				Подробный разбор — зачем вообще нужен Base64, частые ошибки
				декодирования и как раскодировать не только текст, но и понять, что
				внутри длинной строки с картинкой, — в статье{' '}
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
