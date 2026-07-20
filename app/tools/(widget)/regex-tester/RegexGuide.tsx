import Link from 'next/link'
import type { ReactNode } from 'react'
import { GuideCodeBlock } from '@/components/widgets/GuideCodeBlock'

/**
 * Образовательный контент под тестером регулярных выражений.
 * Повышает глубину страницы (качество), закрывает информационные запросы
 * по regex-синтаксису и даёт внутреннюю перелинковку на смежные тулы.
 */

const SYNTAX: { name: string; desc: string }[] = [
	{ name: '\\d \\D', desc: 'Цифра [0-9] и всё, кроме цифры' },
	{ name: '\\w \\W', desc: 'Буква/цифра/подчёркивание и всё остальное' },
	{ name: '\\s \\S', desc: 'Пробельный символ и всё, кроме него' },
	{ name: '.', desc: 'Любой символ, кроме переноса строки' },
	{ name: '^ $', desc: 'Начало и конец строки' },
	{ name: '\\b \\B', desc: 'Граница слова и её отсутствие' },
	{
		name: '[abc] [^abc]',
		desc: 'Один символ из набора и один символ не из набора'
	},
	{ name: '(...)', desc: 'Группа захвата' },
	{ name: '(?:...)', desc: 'Группа без захвата' },
	{ name: '(?<name>...)', desc: 'Именованная группа захвата' },
	{ name: 'a|b', desc: 'Альтернатива: a или b' }
]

const QUANTIFIERS: { name: string; desc: string }[] = [
	{ name: '*', desc: '0 или более повторений' },
	{ name: '+', desc: '1 или более повторений' },
	{ name: '?', desc: '0 или 1 повторение' },
	{ name: '{n}', desc: 'Ровно n повторений' },
	{ name: '{n,}', desc: 'n или более повторений' },
	{ name: '{n,m}', desc: 'От n до m повторений' }
]

const FLAGS: { name: string; desc: string }[] = [
	{ name: 'g', desc: 'Найти все совпадения, а не только первое' },
	{ name: 'i', desc: 'Не учитывать регистр букв' },
	{
		name: 'm',
		desc: '^ и $ работают на границах каждой строки, а не только всего текста'
	},
	{ name: 's', desc: 'Точка . дополнительно совпадает с переносом строки' },
	{
		name: 'u',
		desc: 'Корректная работа с Unicode — многобайтовыми символами и эмодзи'
	}
]

function Code({ children }: { children: ReactNode }) {
	return (
		<code className='rounded bg-secondary px-1.5 py-0.5 font-mono text-sm'>
			{children}
		</code>
	)
}

export function RegexGuide() {
	return (
		<section className='mt-12 max-w-3xl mx-auto text-left text-foreground'>
			<h2 className='text-2xl font-bold tracking-tight'>
				Что такое регулярные выражения
			</h2>
			<p className='mt-3 leading-relaxed'>
				Регулярное выражение (regex, regexp) — это шаблон, который описывает
				набор строк по правилам, а не перечисляет их буквально. Шаблон{' '}
				<Code>
					^\d{'{3}'}-\d{'{4}'}$
				</Code>{' '}
				находит любую строку вида «123-4567», не зная заранее конкретных цифр.
				Regex одинаково используют для поиска, проверки формата (email, телефон,
				URL) и замены текста — три задачи, которые умеет тестер выше.
			</p>

			<h2 className='mt-10 text-2xl font-bold tracking-tight'>
				Как пользоваться тестером
			</h2>
			<ol className='mt-3 space-y-2 leading-relaxed'>
				<li>
					Введите шаблон в поле «Регулярное выражение» — без слэшей по краям.
				</li>
				<li>
					Вставьте текст для проверки — совпадения подсветятся сразу по мере
					ввода.
				</li>
				<li>
					Включайте флаги под полем шаблона, чтобы поменять поведение поиска.
				</li>
				<li>
					Кнопка «Копировать код» отдаёт готовый вызов на JavaScript, PHP или
					Python — язык выбирается наверху страницы.
				</li>
			</ol>

			<h2 className='mt-10 text-2xl font-bold tracking-tight'>
				Шпаргалка по синтаксису
			</h2>
			<p className='mt-3 leading-relaxed'>
				Основные конструкции, из которых собирается любой шаблон.
			</p>
			<div className='mt-4 overflow-x-auto'>
				<table className='w-full border-collapse text-sm'>
					<thead>
						<tr className='border-b text-left'>
							<th className='py-2 pr-4 font-semibold'>Синтаксис</th>
							<th className='py-2 font-semibold'>Что означает</th>
						</tr>
					</thead>
					<tbody>
						{SYNTAX.map(row => (
							<tr key={row.name} className='border-b align-top last:border-0'>
								<td className='py-2 pr-4'>
									<code className='rounded bg-secondary px-1.5 py-0.5 font-mono text-xs'>
										{row.name}
									</code>
								</td>
								<td className='py-2'>{row.desc}</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>

			<h2 className='mt-10 text-2xl font-bold tracking-tight'>
				Квантификаторы: сколько раз повторить
			</h2>
			<p className='mt-3 leading-relaxed'>
				Квантификатор ставится сразу после символа или группы и задаёт, сколько
				раз он может повториться.
			</p>
			<div className='mt-4 overflow-x-auto'>
				<table className='w-full border-collapse text-sm'>
					<thead>
						<tr className='border-b text-left'>
							<th className='py-2 pr-4 font-semibold'>Квантификатор</th>
							<th className='py-2 font-semibold'>Что означает</th>
						</tr>
					</thead>
					<tbody>
						{QUANTIFIERS.map(row => (
							<tr key={row.name} className='border-b align-top last:border-0'>
								<td className='py-2 pr-4'>
									<code className='rounded bg-secondary px-1.5 py-0.5 font-mono text-xs'>
										{row.name}
									</code>
								</td>
								<td className='py-2'>{row.desc}</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>

			<h2 className='mt-10 text-2xl font-bold tracking-tight'>
				Жадные и ленивые квантификаторы
			</h2>
			<p className='mt-3 leading-relaxed'>
				По умолчанию квантификаторы «жадные» — захватывают максимально длинный
				кусок текста. Добавленный после них знак вопроса делает их «ленивыми»:
				они останавливаются на первом же подходящем совпадении.
			</p>
			<GuideCodeBlock
				className='mt-4'
				code={`const text = '<b>жирный</b> и <b>ещё раз</b>'

text.match(/<b>.*<\\/b>/)   // жадный: захватит от первого <b> до последнего </b>
text.match(/<b>.*?<\\/b>/)  // ленивый: остановится на первом же </b>`}
			/>
			<p className='mt-3 leading-relaxed'>
				Ленивые квантификаторы почти всегда нужны при разборе HTML-подобной
				разметки или любого текста с повторяющимися парными разделителями.
			</p>

			<h2 className='mt-10 text-2xl font-bold tracking-tight'>
				Группы захвата и именованные группы
			</h2>
			<p className='mt-3 leading-relaxed'>
				Круглые скобки <Code>(...)</Code> не только группируют часть шаблона, но
				и запоминают найденный фрагмент — его можно достать из результата или
				подставить при замене как <Code>$1</Code>, <Code>$2</Code> и так далее.
				Если запоминать фрагмент не нужно — например, группа нужна только для
				альтернативы <Code>a|b</Code> внутри более крупного шаблона —
				используйте некапturing-группу <Code>(?:...)</Code>: она не засоряет
				список совпадений.
			</p>
			<GuideCodeBlock
				className='mt-4'
				code={`const match = '2024-06-15'.match(/(?<year>\\d{4})-(?<month>\\d{2})-(?<day>\\d{2})/)

match.groups.year   // '2024'
match.groups.month  // '06'
match.groups.day    // '15'`}
			/>
			<p className='mt-3 leading-relaxed'>
				Именованная группа <Code>(?&lt;name&gt;...)</Code> решает ту же задачу,
				но обращаться к результату можно по имени, а не по номеру — код проще
				читать, когда групп больше двух-трёх.
			</p>

			<h2 className='mt-10 text-2xl font-bold tracking-tight'>
				Просмотр вперёд и назад (lookahead / lookbehind)
			</h2>
			<p className='mt-3 leading-relaxed'>
				Иногда нужно проверить, что рядом с совпадением есть (или нет)
				определённый текст, не включая его в само совпадение. Для этого есть
				четыре конструкции просмотра:
			</p>
			<GuideCodeBlock
				className='mt-4'
				code={`(?=...)   // впереди должно быть — «100(?=руб)» найдёт 100 перед «руб»
(?!...)   // впереди не должно быть
(?<=...)  // позади должно быть — «(?<=\\$)\\d+» найдёт число после знака $
(?<!...)  // позади не должно быть`}
			/>
			<p className='mt-3 leading-relaxed'>
				Классический пример — найти цену без символа валюты:{' '}
				<Code>{`(?<=\\$)\\d+(\\.\\d{2})?`}</Code> находит «49.99» в строке
				«$49.99», не захватывая сам знак доллара.
			</p>

			<h2 className='mt-10 text-2xl font-bold tracking-tight'>
				Флаги регулярных выражений
			</h2>
			<p className='mt-3 leading-relaxed'>
				Флаги меняют поведение всего шаблона целиком и указываются после
				закрывающего слэша (в JavaScript) или отдельным аргументом (в PHP и
				Python) — в тестере выше их можно включать переключателями.
			</p>
			<div className='mt-4 overflow-x-auto'>
				<table className='w-full border-collapse text-sm'>
					<thead>
						<tr className='border-b text-left'>
							<th className='py-2 pr-4 font-semibold'>Флаг</th>
							<th className='py-2 font-semibold'>Что делает</th>
						</tr>
					</thead>
					<tbody>
						{FLAGS.map(row => (
							<tr key={row.name} className='border-b align-top last:border-0'>
								<td className='py-2 pr-4'>
									<code className='rounded bg-secondary px-1.5 py-0.5 font-mono text-xs'>
										{row.name}
									</code>
								</td>
								<td className='py-2'>{row.desc}</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>

			<h2 className='mt-10 text-2xl font-bold tracking-tight'>
				Regex в JavaScript, PHP и Python — отличия
			</h2>
			<p className='mt-3 leading-relaxed'>
				Ядро синтаксиса — классы символов, квантификаторы, группы — одинаково во
				всех трёх языках. Отличается обвязка: JavaScript пишет шаблон между
				слэшами (<Code>/regex/флаги</Code>), PHP оборачивает его в
				дополнительный разделитель-кавычку (
				<Code>&apos;/regex/флаги&apos;</Code>), а Python передаёт шаблон обычной
				строкой и флаги — отдельным аргументом функции. Именованные группы
				Python исторически писал как <Code>(?P&lt;name&gt;...)</Code>, но
				синтаксис <Code>(?&lt;name&gt;...)</Code> из тестера тоже валиден.
				Переключатель языка наверху страницы меняет именно эту обвязку в кнопке
				«Копировать код» — сам паттерн остаётся общим.
			</p>

			<p className='mt-8 leading-relaxed'>
				Проверить регулярное выражение прямо в рабочем коде поможет{' '}
				<Link
					href='/tools/javascript-syntax-checker'
					className='cursor-pointer font-medium text-primary hover:underline'
				>
					проверка синтаксиса JavaScript
				</Link>
				, а для PHP-скриптов — соответствующая{' '}
				<Link
					href='/tools/php-syntax-checker'
					className='cursor-pointer font-medium text-primary hover:underline'
				>
					проверка синтаксиса PHP
				</Link>
				.
			</p>
		</section>
	)
}
