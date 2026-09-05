import Link from 'next/link'

/**
 * SEO-контент под инструментом. Раздел «с пробелами и без» закрывает
 * реальный кластер запросов («счетчик символов с пробелами», «подсчет
 * символов без пробелов» — Вордстат 07.08.2026) — люди явно уточняют это в
 * поиске, значит стоит явно объяснить, что считает инструмент.
 */
export function TextCounterSeo() {
	return (
		<div className='mx-auto mt-16 max-w-3xl space-y-12'>
			<section>
				<h2 className='text-2xl font-bold tracking-tight'>
					С пробелами и без: что и как считается
				</h2>
				<p className='mt-3 text-muted-foreground'>
					Инструмент показывает оба числа одновременно. Символы с пробелами дают
					длину текста ровно такой, какой её увидит форма или база данных с
					ограничением на количество символов. Без пробелов считаются только
					сами знаки, без пропусков между словами. Для лимитов соцсетей и SEO
					важны символы с пробелами, именно так их считают X, ВКонтакте, Google
					и большинство форм на сайтах.
				</p>
			</section>

			<section>
				<h2 className='text-2xl font-bold tracking-tight'>
					Лимиты площадок в одном месте
				</h2>
				<p className='mt-3 text-muted-foreground'>
					Инструмент сразу показывает, сколько текста осталось до лимита
					конкретной площадки: X (280 символов), Instagram (2200), LinkedIn
					(3000), Facebook (63206), ВКонтакте и Одноклассники (15895), Telegram
					(4096 в сообщении, 1024 в подписи к медиа, 255 в описании канала).
					Отдельно идут SEO-лимиты Google и Яндекса: около 60 символов для тега{' '}
					<code className='rounded bg-muted px-1.5 py-0.5 text-sm'>title</code>{' '}
					и около 160 для{' '}
					<code className='rounded bg-muted px-1.5 py-0.5 text-sm'>
						meta description
					</code>
					. Считать символы вручную или искать эти цифры отдельно не нужно,
					прогресс-бар сразу показывает, сколько места осталось.
				</p>

				<p className='mt-4 text-muted-foreground'>
					Те же значения, что подсвечиваются в счётчике:
				</p>
				<div className='mt-4 overflow-x-auto'>
					<table className='w-full text-left text-sm'>
						<thead>
							<tr className='border-b text-muted-foreground'>
								<th className='py-2 pr-4 font-medium'>Площадка</th>
								<th className='py-2 pr-4 font-medium'>Что именно</th>
								<th className='py-2 font-medium'>Лимит</th>
							</tr>
						</thead>
						<tbody className='text-foreground'>
							<tr className='border-b'>
								<td className='py-2 pr-4'>X (Twitter)</td>
								<td className='py-2 pr-4'>твит</td>
								<td className='py-2 font-mono'>280</td>
							</tr>
							<tr className='border-b'>
								<td className='py-2 pr-4'>ВКонтакте</td>
								<td className='py-2 pr-4'>пост</td>
								<td className='py-2 font-mono'>15 895</td>
							</tr>
							<tr className='border-b'>
								<td className='py-2 pr-4'>Одноклассники</td>
								<td className='py-2 pr-4'>заметка</td>
								<td className='py-2 font-mono'>15 895</td>
							</tr>
							<tr className='border-b'>
								<td className='py-2 pr-4'>Facebook</td>
								<td className='py-2 pr-4'>пост</td>
								<td className='py-2 font-mono'>63 206</td>
							</tr>
							<tr className='border-b'>
								<td className='py-2 pr-4'>Instagram</td>
								<td className='py-2 pr-4'>подпись</td>
								<td className='py-2 font-mono'>2 200</td>
							</tr>
							<tr className='border-b'>
								<td className='py-2 pr-4'>Telegram</td>
								<td className='py-2 pr-4'>сообщение</td>
								<td className='py-2 font-mono'>4 096</td>
							</tr>
							<tr className='border-b'>
								<td className='py-2 pr-4'>Telegram</td>
								<td className='py-2 pr-4'>подпись к медиа</td>
								<td className='py-2 font-mono'>1 024</td>
							</tr>
							<tr className='border-b'>
								<td className='py-2 pr-4'>LinkedIn</td>
								<td className='py-2 pr-4'>пост</td>
								<td className='py-2 font-mono'>3 000</td>
							</tr>
							<tr className='border-b'>
								<td className='py-2 pr-4'>SMS</td>
								<td className='py-2 pr-4'>одно сообщение</td>
								<td className='py-2 font-mono'>160</td>
							</tr>
							<tr className='border-b'>
								<td className='py-2 pr-4'>Google и Яндекс</td>
								<td className='py-2 pr-4'>SEO-заголовок</td>
								<td className='py-2 font-mono'>60</td>
							</tr>
							<tr>
								<td className='py-2 pr-4'>Google и Яндекс</td>
								<td className='py-2 pr-4'>SEO-описание</td>
								<td className='py-2 font-mono'>160</td>
							</tr>
						</tbody>
					</table>
				</div>
				<p className='mt-4 text-muted-foreground'>
					Лимиты считаются в символах с пробелами. Время чтения инструмент
					оценивает по 200 слов в минуту, это средняя скорость чтения про себя.
				</p>
			</section>

			<p className='text-muted-foreground'>
				Готовый текст можно не только посчитать, но и прослушать через{' '}
				<Link
					href='/tools/text-to-speech'
					className='cursor-pointer font-medium text-primary hover:underline'
				>
					синтез речи
				</Link>
				, а если нужно сравнить две версии текста и увидеть отличия построчно,
				для этого есть{' '}
				<Link
					href='/tools/text-diff-tool'
					className='cursor-pointer font-medium text-primary hover:underline'
				>
					сравнение текстов
				</Link>
				.
			</p>

			<p className='text-muted-foreground'>
				Как эти же лимиты title и description влияют на технический SEO-аудит
				сайта, разобрано в статье{' '}
				<Link
					href='/blog/lighthouse-100'
					className='cursor-pointer font-medium text-primary hover:underline'
				>
					Как получить 100% в Lighthouse
				</Link>
				.
			</p>
		</div>
	)
}
