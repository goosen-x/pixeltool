'use client'

import { useMemo, useRef, useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import {
	Copy,
	Check,
	Trash2,
	CheckCircle,
	XCircle,
	AlertCircle
} from 'lucide-react'
import { cn } from '@/lib/utils'
import {
	toolBar,
	toolFooterBar,
	toolIconButton,
	toolPill
} from '@/lib/ui/tool-pill'
import { JsSyntaxSeo } from './JsSyntaxSeo'
import { ToolScreenshot } from '@/components/tools/ToolScreenshot'
import { checkJsSyntax, type JsVersion } from '@/lib/js-syntax-check'

interface CodeExample {
	name: string
	code: string
	description: string
	mode: JsVersion
}

const CODE_EXAMPLES: CodeExample[] = [
	{
		name: 'ES6 стрелочная функция',
		code: `const greet = (name) => {
  console.log(\`Hello, \${name}!\`);
};

greet('World');`,
		description: 'Стрелочная функция с шаблонной строкой',
		mode: 'es6'
	},
	{
		name: 'ES6 класс',
		code: `class Person {
  constructor(name, age) {
    this.name = name;
    this.age = age;
  }

  greet() {
    return \`Hi, I'm \${this.name}\`;
  }
}`,
		description: 'Класс ES6 с конструктором',
		mode: 'es6'
	},
	{
		name: 'ES6 деструктуризация',
		code: `const person = { name: 'John', age: 30 };
const { name, age } = person;

const numbers = [1, 2, 3];
const [first, ...rest] = numbers;`,
		description: 'Деструктуризация объектов и массивов',
		mode: 'es6'
	},
	{
		name: 'ES2020 async/await',
		code: `async function fetchData() {
  try {
    const response = await fetch('/api/data');
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error:', error);
  }
}`,
		description: 'Асинхронная функция',
		mode: 'es2020'
	},
	{
		name: 'ES6 модули',
		code: `import { sum, multiply } from './math.js';

export const total = (items) => items.reduce(sum, 0);
export default function double(x) {
  return multiply(x, 2);
}`,
		description: 'Импорт/экспорт ES6',
		mode: 'es6'
	},
	{
		name: 'ES2020 optional chaining',
		code: `const user = {
  name: 'John',
  address: {
    city: 'New York'
  }
};

const zipCode = user.address?.zipCode ?? '00000';`,
		description: 'Optional chaining и nullish coalescing',
		mode: 'es2020'
	},
	{
		name: 'React JSX',
		code: `export function Greeting({ name }) {
  return (
    <div className="greeting">
      <h1>Привет, {name}!</h1>
    </div>
  );
}`,
		description: 'Компонент React с JSX',
		mode: 'latest'
	},
	{
		name: 'Ошибка синтаксиса',
		code: `function broken() {
  const x = 10
  if (x > 5 {
    console.log('Greater than 5');
  }
}`,
		description: 'Пример с ошибкой',
		mode: 'es6'
	}
]

export default function JavaScriptSyntaxCheckerPage() {
	const [code, setCode] = useState('')
	const [mode, setMode] = useState<JsVersion>('latest')
	const [copied, setCopied] = useState(false)
	const textareaRef = useRef<HTMLTextAreaElement>(null)

	// Разбор дешёвый (acorn), поэтому проверяем на каждое изменение, без кнопки.
	const result = useMemo(
		() => (code.trim() ? checkJsSyntax(code, mode) : null),
		[code, mode]
	)

	const errorLine =
		result?.error && code.split('\n')[result.error.line - 1] !== undefined
			? code.split('\n')[result.error.line - 1]
			: null

	const jumpToError = () => {
		const el = textareaRef.current
		if (!el || !result?.error) return
		el.focus()
		el.setSelectionRange(result.error.offset, result.error.offset + 1)
	}

	const loadExample = (example: CodeExample) => {
		setCode(example.code)
		setMode(example.mode)
	}

	const copyResult = () => {
		if (!result) return

		const text = result.valid
			? `Синтаксис корректен\n\nФункций: ${result.stats?.functions ?? 0}\nПеременных: ${result.stats?.variables ?? 0}\nКлассов: ${result.stats?.classes ?? 0}` +
				(result.warnings.length ? `\n\n${result.warnings.join('\n')}` : '')
			: `Ошибка синтаксиса: строка ${result.error!.line}, столбец ${result.error!.column}\n${result.error!.message}${result.error!.hint ? '\n' + result.error!.hint : ''}`

		navigator.clipboard.writeText(text)
		setCopied(true)
		setTimeout(() => setCopied(false), 2000)
	}

	const reset = () => setCode('')

	return (
		<>
			<Card className='overflow-hidden p-0'>
				{/* Верхняя полоса: по каким правилам разбирать код. Два тумблера
				    («Модуль», «JSX») стали таблетками — это флаги режима, а не
				    настройки с подписями. */}
				<div className={toolBar}>
					<div className='flex flex-wrap items-center gap-1.5'>
						{(
							[
								['es5', 'ES5'],
								['es6', 'ES6'],
								['es2020', 'ES2020'],
								['latest', 'Latest']
							] as [JsVersion, string][]
						).map(([value, label]) => (
							<button
								key={value}
								type='button'
								onClick={() => setMode(value)}
								aria-pressed={mode === value}
								className={toolPill(mode === value, 'font-mono')}
							>
								{label}
							</button>
						))}
					</div>

					<div className='flex items-center gap-0.5 sm:ml-auto'>
						<Button
							size='icon'
							variant='ghost'
							onClick={copyResult}
							disabled={!result}
							title='Скопировать отчёт'
							className={toolIconButton}
						>
							{copied ? (
								<Check className='h-4 w-4 text-green-600 dark:text-green-400' />
							) : (
								<Copy className='h-4 w-4' />
							)}
						</Button>
						<Button
							size='icon'
							variant='ghost'
							onClick={reset}
							disabled={!code}
							title='Очистить'
							className={toolIconButton}
						>
							<Trash2 className='h-4 w-4' />
						</Button>
					</div>
				</div>

				<div className='grid lg:grid-cols-2'>
					<Textarea
						ref={textareaRef}
						id='code-input'
						value={code}
						onChange={e => setCode(e.target.value)}
						placeholder={
							'Вставьте код JavaScript или JSX.\nПроверка идёт сразу, код не запускается.'
						}
						spellCheck={false}
						aria-label='Код JavaScript'
						className='min-h-[20rem] resize-none rounded-none border-0 px-5 py-6 font-mono text-base focus-visible:ring-0 sm:px-6 md:text-sm lg:border-r'
					/>

					<div className='min-h-[20rem] px-5 py-6 sm:px-6'>
						{result ? (
							<>
								<p
									className={cn(
										'flex items-center gap-2 text-sm font-medium',
										result.valid
											? 'text-green-600 dark:text-green-400'
											: 'text-destructive'
									)}
								>
									{result.valid ? (
										<CheckCircle className='h-4 w-4' />
									) : (
										<XCircle className='h-4 w-4' />
									)}
									{result.valid ? 'Синтаксис корректен' : 'Ошибка синтаксиса'}
								</p>

								{result.error && (
									<div className='mt-4 space-y-2 text-sm'>
										<button
											type='button'
											onClick={jumpToError}
											title='Поставить курсор на место ошибки'
											className='cursor-pointer font-mono text-xs text-muted-foreground underline decoration-dotted underline-offset-4 hover:text-foreground'
										>
											строка {result.error.line}, столбец {result.error.column}
										</button>
										<p className='text-destructive'>{result.error.message}</p>
										{errorLine !== null && (
											<pre className='overflow-x-auto rounded-md bg-muted px-3 py-2 font-mono text-xs leading-5'>
												<span className='select-none text-muted-foreground'>
													{result.error.line} |{' '}
												</span>
												{errorLine}
												{'\n'}
												<span className='select-none text-destructive'>
													{' '.repeat(String(result.error.line).length + 3) +
														errorLine
															.slice(0, result.error.column - 1)
															.replace(/[^\t]/g, ' ') +
														'^'}
												</span>
											</pre>
										)}
										{result.error.hint && (
											<p className='text-muted-foreground'>
												{result.error.hint}
											</p>
										)}
									</div>
								)}

								{result.valid && result.module && (
									<p className='mt-2 text-sm text-muted-foreground'>
										Разобран как ES-модуль: в коде есть import, export или await
										вне функций.
									</p>
								)}

								{result.warnings.length > 0 && (
									<div className='mt-4 space-y-1'>
										{result.warnings.map((warning, index) => (
											<p
												key={index}
												className='flex items-start gap-2 text-sm text-amber-600 dark:text-amber-500'
											>
												<AlertCircle className='mt-0.5 h-4 w-4 shrink-0' />
												{warning}
											</p>
										))}
									</div>
								)}

								{result.stats && result.valid && (
									<div className='mt-4 flex flex-wrap gap-x-5 gap-y-1'>
										{(
											[
												['функций', result.stats.functions],
												['переменных', result.stats.variables],
												['классов', result.stats.classes],
												['импортов', result.stats.imports],
												['экспортов', result.stats.exports]
											] as [string, number][]
										).map(([label, value]) => (
											<span
												key={label}
												className='text-sm text-muted-foreground'
											>
												<span className='font-mono text-foreground'>
													{value}
												</span>{' '}
												{label}
											</span>
										))}
									</div>
								)}
							</>
						) : (
							<p className='flex h-full items-center justify-center text-center text-sm text-muted-foreground'>
								Вставьте код — результат проверки появится здесь
							</p>
						)}
					</div>
				</div>

				{/* Полоса примеров: на них видно, что именно ловит проверка. */}
				<div className={toolFooterBar}>
					<span className='mr-1 text-sm text-muted-foreground'>Примеры</span>
					{CODE_EXAMPLES.map((example, index) => (
						<button
							key={index}
							type='button'
							onClick={() => loadExample(example)}
							title={example.description}
							className={toolPill(false)}
						>
							{example.name}
						</button>
					))}
				</div>
			</Card>

			<ToolScreenshot slug='javascript-syntax-checker' />
			<JsSyntaxSeo />
		</>
	)
}
