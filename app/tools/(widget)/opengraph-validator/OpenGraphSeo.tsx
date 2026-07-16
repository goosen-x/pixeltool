import Link from 'next/link'

/**
 * SEO-контент под инструментом. Отдельным компонентом, чтобы не раздувать
 * page.tsx. Текст покрывает смысловое поле «превью ссылки / og:image» — как
 * сделать, почему не показывается, как обновить кэш — а не набивает ключи.
 */
export function OpenGraphSeo() {
	return (
		<div className='mx-auto mt-16 max-w-3xl space-y-12'>
			<section>
				<h2 className='text-2xl font-bold tracking-tight'>
					Как сделать превью ссылки
				</h2>
				<p className='mt-3 text-muted-foreground'>
					Превью ссылки — та карточка с картинкой и текстом, которую соцсеть
					показывает, когда вы вставляете адрес страницы. За неё отвечают теги
					Open Graph в <code className='font-mono'>&lt;head&gt;</code>:{' '}
					<code className='font-mono'>og:title</code> (заголовок),{' '}
					<code className='font-mono'>og:description</code> (описание),{' '}
					<code className='font-mono'>og:image</code> (картинка) и{' '}
					<code className='font-mono'>og:url</code>. Вставьте адрес страницы в
					поле выше — инструмент разберёт эти теги, покажет, как ссылка выглядит
					в Telegram, Facebook, Twitter и WhatsApp, и подскажет, каких тегов не
					хватает, с готовым кодом для вставки.
				</p>
			</section>

			<section>
				<h2 className='text-2xl font-bold tracking-tight'>
					Предпросмотр ссылки в Телеграме и других соцсетях
				</h2>
				<p className='mt-3 text-muted-foreground'>
					Предпросмотр ссылки — это то же превью для сайта, только увиденное
					заранее: как карточка появится в чате или ленте до того, как вы
					отправите пост. Чаще всего его проверяют для{' '}
					<strong>Телеграма</strong> — там предпросмотр ссылок включён по
					умолчанию и показывается сразу под сообщением. Вставьте адрес в поле
					выше, и инструмент соберёт предпросмотр для каждой соцсети из тегов
					Open Graph: вы увидите картинку, заголовок и описание ровно так, как их
					отрисуют Telegram, ВКонтакте, Facebook и WhatsApp, — и успеете поправить
					теги до публикации.
				</p>
			</section>

			<section>
				<h2 className='text-2xl font-bold tracking-tight'>
					Каким должен быть og:image
				</h2>
				<p className='mt-3 text-muted-foreground'>
					Оптимальный размер картинки — <strong>1200×630</strong> пикселей
					(соотношение 1.91:1), минимум 600×315. Формат JPG или PNG, файл до 8
					МБ, и обязательно доступный по <strong>HTTPS</strong> по прямой ссылке
					— если картинка отдаётся с ошибкой или только по HTTP, соцсеть покажет
					пустую карточку. Полезно рядом с{' '}
					<code className='font-mono'>og:image</code> задать{' '}
					<code className='font-mono'>og:image:width</code> и{' '}
					<code className='font-mono'>og:image:height</code>: тогда превью
					отрисуется сразу, без «прыжка» при загрузке.
				</p>
			</section>

			<section>
				<h2 className='text-2xl font-bold tracking-tight'>
					Почему превью не обновляется
				</h2>
				<p className='mt-3 text-muted-foreground'>
					Соцсети надолго кэшируют превью, поэтому после смены{' '}
					<code className='font-mono'>og:image</code> ссылка ещё какое-то время
					показывает старую картинку. Кэш нужно сбросить вручную: в{' '}
					<strong>Telegram</strong> — написать боту{' '}
					<code className='font-mono'>@WebpageBot</code> и отправить ему URL; в{' '}
					<strong>Facebook</strong> — прогнать ссылку через Sharing Debugger и
					нажать «Scrape Again»; во <strong>ВКонтакте</strong> кэш обычно
					обновляется сам. Пошагово по каждой соцсети — в статье{' '}
					<Link
						href='/blog/preview-ssylki-open-graph'
						className='cursor-pointer font-medium text-primary hover:underline'
					>
						Превью ссылки в соцсетях: Open Graph и обновление og:image
					</Link>
					.
				</p>
			</section>
		</div>
	)
}
