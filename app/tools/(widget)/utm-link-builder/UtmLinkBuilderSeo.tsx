import Link from 'next/link'

/**
 * SEO-контент под инструментом. Секция про Tilda/Директ отвечает на реальный
 * кластер запросов («utm метки тильда» 816, «utm метки директ» 777 —
 * Вордстат 07.08.2026) — люди явно ищут метки под конкретную площадку, а не
 * абстрактный конструктор.
 */
export function UtmLinkBuilderSeo() {
	return (
		<div className='mx-auto mt-16 max-w-3xl space-y-12'>
			<section>
				<h2 className='text-2xl font-bold tracking-tight'>
					UTM-метки для Tilda, Яндекс.Директа и других площадок
				</h2>
				<p className='mt-3 text-muted-foreground'>
					Специального формата под конкретную платформу не существует. UTM
					одинаковы везде, разница только в готовых значениях{' '}
					<code className='rounded bg-muted px-1.5 py-0.5 text-sm'>
						utm_source
					</code>{' '}
					и{' '}
					<code className='rounded bg-muted px-1.5 py-0.5 text-sm'>
						utm_medium
					</code>
					. Пресеты в конструкторе уже подставляют правильные значения для
					Google Ads, Яндекс.Директа, VK, Facebook, Instagram и email, так что
					точное написание вспоминать не придётся. Если сайт сделан на Tilda,
					готовую ссылку с меткой просто вставляют в поле URL кнопки или блока,
					конструктор сайта её не меняет и не обрезает.
				</p>
			</section>

			<section>
				<h2 className='text-2xl font-bold tracking-tight'>
					Почему регистр и пробелы ломают отчёты
				</h2>
				<p className='mt-3 text-muted-foreground'>
					Google Analytics и Яндекс.Метрика различают источники по точному
					совпадению строки. «Email» и «email» для аналитики два разных
					источника, и трафик расползается по двум строкам вместо одной. Пробел
					в значении параметра превращается в ссылке в{' '}
					<code className='rounded bg-muted px-1.5 py-0.5 text-sm'>%20</code>,
					поэтому в названии кампании лучше сразу использовать дефис вместо
					пробела.
				</p>
			</section>

			<p className='text-muted-foreground'>
				Полный разбор параметров и частых ошибок есть в статье{' '}
				<Link
					href='/blog/kak-sozdat-utm-metku'
					className='cursor-pointer font-medium text-primary hover:underline'
				>
					Как создать UTM-метку для ссылки
				</Link>
				.
			</p>
		</div>
	)
}
