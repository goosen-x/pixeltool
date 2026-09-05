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
					браузера. Он отрисует её как обычное изображение. Для SVG такую строку
					удобнее собирать отдельным{' '}
					<Link
						href='/tools/svg-to-base64-encoder'
						className='cursor-pointer font-medium text-primary hover:underline'
					>
						кодировщиком SVG в Base64
					</Link>
					, он учитывает особенности векторного формата.
				</p>
				<p className='mt-3 text-muted-foreground'>
					Префикс до запятой у data-URL всегда называет MIME-тип содержимого,
					вот самые частые:
				</p>
				<div className='mt-4 overflow-x-auto'>
					<table className='w-full text-left text-sm'>
						<thead>
							<tr className='border-b text-muted-foreground'>
								<th className='py-2 pr-4 font-medium'>Префикс</th>
								<th className='py-2 font-medium'>Формат</th>
							</tr>
						</thead>
						<tbody className='text-foreground'>
							<tr className='border-b'>
								<td className='py-2 pr-4 font-mono'>data:image/png;base64,</td>
								<td className='py-2'>PNG-изображение</td>
							</tr>
							<tr className='border-b'>
								<td className='py-2 pr-4 font-mono'>data:image/jpeg;base64,</td>
								<td className='py-2'>JPEG-изображение</td>
							</tr>
							<tr className='border-b'>
								<td className='py-2 pr-4 font-mono'>
									data:image/svg+xml;base64,
								</td>
								<td className='py-2'>SVG-изображение</td>
							</tr>
							<tr className='border-b'>
								<td className='py-2 pr-4 font-mono'>
									data:application/pdf;base64,
								</td>
								<td className='py-2'>PDF-документ</td>
							</tr>
							<tr>
								<td className='py-2 pr-4 font-mono'>data:font/woff2;base64,</td>
								<td className='py-2'>Шрифт в формате WOFF2</td>
							</tr>
						</tbody>
					</table>
				</div>
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
