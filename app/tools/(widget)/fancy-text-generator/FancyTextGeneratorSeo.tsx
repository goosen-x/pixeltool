import Link from 'next/link'

export function FancyTextGeneratorSeo() {
	return (
		<div className='mx-auto mt-16 max-w-3xl space-y-12'>
			<section>
				<h2 className='text-2xl font-bold tracking-tight'>
					Это не шрифт, а отдельные символы Unicode
				</h2>
				<p className='mt-3 text-muted-foreground'>
					Каждое начертание собрано из отдельных знаков Unicode, а не из файла
					шрифта. Поэтому текст вставляется куда угодно: в ник, в шапку профиля,
					в сообщение. Оформление сохраняется даже там, где своих шрифтов нет и
					HTML не работает. Есть и обратная сторона. Для программы чтения с
					экрана и для поиска по сайту это просто незнакомые символы, а не
					жирная «A», распознать и прочитать такой текст они не могут. Если
					нужен просто ЗАГЛАВНЫЙ текст или Title Case без стилизации, для этого
					есть{' '}
					<Link
						href='/tools/text-case-converter'
						className='cursor-pointer font-medium text-primary hover:underline'
					>
						конвертер регистра текста
					</Link>
					.
				</p>
				<div className='mt-4 overflow-x-auto'>
					<table className='w-full border-collapse text-sm'>
						<thead>
							<tr className='border-b text-left'>
								<th className='py-2 pr-4 font-semibold'>Начертание</th>
								<th className='py-2 font-semibold'>Слово Text</th>
							</tr>
						</thead>
						<tbody>
							<tr className='border-b last:border-0'>
								<td className='py-2 pr-4 align-top'>Обычный</td>
								<td className='py-2 align-top text-muted-foreground'>Text</td>
							</tr>
							<tr className='border-b last:border-0'>
								<td className='py-2 pr-4 align-top'>Жирный</td>
								<td className='py-2 align-top text-muted-foreground'>𝐓𝐞𝐱𝐭</td>
							</tr>
							<tr className='border-b last:border-0'>
								<td className='py-2 pr-4 align-top'>Курсив</td>
								<td className='py-2 align-top text-muted-foreground'>𝑇𝑒𝑥𝑡</td>
							</tr>
							<tr className='border-b last:border-0'>
								<td className='py-2 pr-4 align-top'>Готический</td>
								<td className='py-2 align-top text-muted-foreground'>𝔗𝔢𝔵𝔱</td>
							</tr>
							<tr className='border-b last:border-0'>
								<td className='py-2 pr-4 align-top'>Zalgo</td>
								<td className='py-2 align-top text-muted-foreground'>T̠̪̀͟e̯͐ͤ̕x̖̄̕ṭ̈̆͟͡</td>
							</tr>
						</tbody>
					</table>
					<p className='mt-2 text-xs text-muted-foreground'>
						Жирный, курсив и готический работают только на латинице — так
						устроен сам стандарт Unicode, для кириллицы таких символов не
						существует. Zalgo каждый раз накладывает знаки заново, так что
						точный результат в таблице не повторится, но принцип тот же.
					</p>
				</div>
			</section>

			<section>
				<h2 className='text-2xl font-bold tracking-tight'>
					Ник красивым шрифтом
				</h2>
				<p className='mt-3 text-muted-foreground'>
					Чаще всего сюда приходят за ником для игры, Discord, Steam или
					ВКонтакте, а не за текстом для поста. Впишите ник вместо текста,
					выберите стиль и скопируйте результат. Работает почти везде, где можно
					ввести имя пользователя. Если ник обрезается или не сохраняется, дело
					обычно в ограничении платформы на длину или набор символов, а не в
					самом стиле. Попробуйте укоротить ник или взять шрифт попроще, скажем
					жирный вместо готики.
				</p>
			</section>

			<section>
				<h2 className='text-2xl font-bold tracking-tight'>
					Zalgo — «сломанный» текст с диакритикой
				</h2>
				<p className='mt-3 text-muted-foreground'>
					Стиль Zalgo собирает хаотичный, будто «сломанный» текст из
					комбинирующихся диакритических знаков. Они накладываются на каждую
					букву сверху, снизу и посередине. Чем выше выбранная интенсивность,
					тем больше знаков наслаивается на один символ. Учтите, что часть
					площадок обрезает такой текст по длине или показывает его как обычный,
					без наложений. Для ника, который должен пройти проверку платформы,
					лучше взять уровень пониже.
				</p>
			</section>

			<p className='text-muted-foreground'>
				Отдельные стрелки, тире и другие знаки без стилизации всего текста можно
				взять в{' '}
				<Link
					href='/tools/special-symbols-picker'
					className='cursor-pointer font-medium text-primary hover:underline'
				>
					подборке спецсимволов
				</Link>
				. Про эмодзи, текстовые смайлики и спецсимволы написано в статье{' '}
				<Link
					href='/blog/smayliki-shrifty-simvoly-dlya-teksta'
					className='cursor-pointer font-medium text-primary hover:underline'
				>
					Смайлики текстом, эмодзи, красивые шрифты и символы
				</Link>
				.
			</p>
		</div>
	)
}
