import Link from 'next/link'

export function MorseCodeTranslatorSeo() {
	return (
		<div className='mx-auto mt-16 max-w-3xl space-y-12'>
			<section>
				<h2 className='text-2xl font-bold tracking-tight'>
					Почему при расшифровке нужен выбор языка
				</h2>
				<p className='mt-3 text-muted-foreground'>
					При переводе текста в код язык определяется сам: кириллица и латиница
					не пересекаются, поэтому «Hello Привет» кодируется целиком без ошибок,
					а выбирать ничего не нужно. С расшифровкой сложнее — азбука Морзе
					кодирует таблицу соответствий, а не буквы алфавита напрямую, и у
					русской и латинской таблиц одинаковые последовательности точек и тире
					означают разные буквы. Код «.--.» — это П в русской таблице и P в
					английской: символы разные, а сигнал один и тот же. Тул сам подбирает
					язык с меньшим числом нераспознанных символов, но переключатель ниже
					поля остаётся — поправить вручную, если сообщение короткое или
					намеренно смешанное.
				</p>
			</section>

			<section>
				<h2 className='text-2xl font-bold tracking-tight'>
					Как читать результат: пробелы и «/»
				</h2>
				<p className='mt-3 text-muted-foreground'>
					Один пробел между группами точек и тире разделяет буквы внутри слова,
					а символ «/» с пробелами по бокам разделяет слова. Например, «... ---
					... / ... --- ...» — это два слова «SOS SOS», а не одно длинное слово
					из шести букв.
				</p>
			</section>

			<section>
				<h2 className='text-2xl font-bold tracking-tight'>
					Таблица азбуки Морзе: русский алфавит и цифры
				</h2>
				<p className='mt-3 text-muted-foreground'>
					Точная таблица соответствий, которую использует сам инструмент. Ё и Е
					кодируются одинаково — точкой, отдельного знака для Ё в азбуке Морзе
					нет.
				</p>
				<div className='mt-4 overflow-x-auto'>
					<table className='w-full border-collapse text-sm'>
						<thead>
							<tr className='border-b text-left'>
								<th className='py-2 pr-4 font-semibold'>Буква</th>
								<th className='py-2 pr-4 font-semibold'>Код</th>
								<th className='py-2 pr-4 font-semibold'>Буква</th>
								<th className='py-2 font-semibold'>Код</th>
							</tr>
						</thead>
						<tbody>
							{[
								['А', '.-', 'Р', '.-.'],
								['Б', '-...', 'С', '...'],
								['В', '.--', 'Т', '-'],
								['Г', '--.', 'У', '..-'],
								['Д', '-..', 'Ф', '..-.'],
								['Е / Ё', '.', 'Х', '....'],
								['Ж', '...-', 'Ц', '-.-.'],
								['З', '--..', 'Ч', '---.'],
								['И', '..', 'Ш', '----'],
								['Й', '.---', 'Щ', '--.-'],
								['К', '-.-', 'Ъ', '--.--'],
								['Л', '.-..', 'Ы', '-.--'],
								['М', '--', 'Ь', '-..-'],
								['Н', '-.', 'Э', '..-..'],
								['О', '---', 'Ю', '..--'],
								['П', '.--.', 'Я', '.-.-']
							].map(([l1, c1, l2, c2]) => (
								<tr key={l1} className='border-b last:border-0'>
									<td className='py-2 pr-4 align-top'>{l1}</td>
									<td className='py-2 pr-4 align-top font-mono text-muted-foreground'>
										{c1}
									</td>
									<td className='py-2 pr-4 align-top'>{l2}</td>
									<td className='py-2 align-top font-mono text-muted-foreground'>
										{c2}
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
				<div className='mt-4 overflow-x-auto'>
					<table className='w-full border-collapse text-sm'>
						<thead>
							<tr className='border-b text-left'>
								<th className='py-2 pr-4 font-semibold'>Цифра</th>
								<th className='py-2 font-semibold'>Код</th>
							</tr>
						</thead>
						<tbody>
							{[
								['0', '-----'],
								['1', '.----'],
								['2', '..---'],
								['3', '...--'],
								['4', '....-'],
								['5', '.....'],
								['6', '-....'],
								['7', '--...'],
								['8', '---..'],
								['9', '----.']
							].map(([digit, code]) => (
								<tr key={digit} className='border-b last:border-0'>
									<td className='py-2 pr-4 align-top'>{digit}</td>
									<td className='py-2 align-top font-mono text-muted-foreground'>
										{code}
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			</section>

			<p className='text-muted-foreground'>
				История кода и разбор различий между русской и английской таблицей
				собраны в статье{' '}
				<Link
					href='/blog/azbuka-morze'
					className='cursor-pointer font-medium text-primary hover:underline'
				>
					Азбука Морзе: как устроен код и как перевести текст в точки и тире
				</Link>
				.
			</p>
		</div>
	)
}
