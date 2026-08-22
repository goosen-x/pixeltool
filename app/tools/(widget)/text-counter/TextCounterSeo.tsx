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
			</section>

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
