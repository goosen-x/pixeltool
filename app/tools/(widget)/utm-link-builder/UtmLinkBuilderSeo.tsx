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
				<div className='mt-4 overflow-x-auto'>
					<table className='w-full border-collapse text-sm'>
						<thead>
							<tr className='border-b text-left'>
								<th className='py-2 pr-4 font-semibold'>Площадка</th>
								<th className='py-2 pr-4 font-semibold'>utm_source</th>
								<th className='py-2 font-semibold'>utm_medium</th>
							</tr>
						</thead>
						<tbody>
							<tr className='border-b last:border-0'>
								<td className='py-2 pr-4 align-top'>Яндекс.Директ</td>
								<td className='py-2 pr-4 align-top font-mono text-xs text-muted-foreground'>
									yandex
								</td>
								<td className='py-2 align-top font-mono text-xs text-muted-foreground'>
									cpc
								</td>
							</tr>
							<tr className='border-b last:border-0'>
								<td className='py-2 pr-4 align-top'>VK Реклама</td>
								<td className='py-2 pr-4 align-top font-mono text-xs text-muted-foreground'>
									vk
								</td>
								<td className='py-2 align-top font-mono text-xs text-muted-foreground'>
									social
								</td>
							</tr>
							<tr className='border-b last:border-0'>
								<td className='py-2 pr-4 align-top'>Email-рассылка</td>
								<td className='py-2 pr-4 align-top font-mono text-xs text-muted-foreground'>
									newsletter
								</td>
								<td className='py-2 align-top font-mono text-xs text-muted-foreground'>
									email
								</td>
							</tr>
							<tr className='border-b last:border-0'>
								<td className='py-2 pr-4 align-top'>Telegram</td>
								<td className='py-2 pr-4 align-top font-mono text-xs text-muted-foreground'>
									telegram
								</td>
								<td className='py-2 align-top font-mono text-xs text-muted-foreground'>
									social
								</td>
							</tr>
						</tbody>
					</table>
					<p className='mt-2 text-xs text-muted-foreground'>
						Значения — ориентир, а не стандарт: единого реестра меток не
						существует, важно лишь использовать одни и те же значения постоянно,
						чтобы отчёты не расползались на варианты написания.
					</p>
				</div>
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
					пробела. Когда трафик с размеченных ссылок пошёл на две версии
					посадочной страницы, разницу в конверсии между ними считает{' '}
					<Link
						href='/tools/ab-test-calculator'
						className='cursor-pointer font-medium text-primary hover:underline'
					>
						калькулятор A/B-теста
					</Link>
					.
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
