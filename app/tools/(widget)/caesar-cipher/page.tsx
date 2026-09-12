'use client'

import { useMemo, useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Slider } from '@/components/ui/slider'
import { ArrowUpDown, Check, Copy, Trash2 } from 'lucide-react'
import {
	toolBar,
	toolFooterBar,
	toolIconButton,
	toolPill,
	toolToggleOption,
	toolToggleTrack
} from '@/lib/ui/tool-pill'
import { WidgetSEOWrapper } from '@/components/seo/WidgetSEOWrapper'
import { getWidgetById } from '@/lib/constants/widgets'
import { CaesarWheel } from '@/components/tools/CaesarWheel'
import {
	CAESAR_ALPHABETS,
	type CaesarAlphabet,
	alphabetSize,
	caesarBruteForce,
	caesarShift,
	detectAlphabet,
	hasForeignLetters
} from '@/lib/utils/caesar-cipher'
import { CaesarCipherSeo } from './CaesarCipherSeo'

type Mode = 'encrypt' | 'decrypt'

const MODES: [Mode, string][] = [
	['encrypt', 'Зашифровать'],
	['decrypt', 'Расшифровать']
]

const ALPHABETS: [CaesarAlphabet, string][] = [
	['cyrillic', 'Кириллица'],
	['latin', 'Латиница']
]

export default function CaesarCipherPage() {
	const widget = getWidgetById('caesar-cipher')!

	const [mode, setMode] = useState<Mode>('encrypt')
	const [alphabet, setAlphabet] = useState<CaesarAlphabet>('cyrillic')
	const [shift, setShift] = useState(3)
	const [input, setInput] = useState('')
	const [brute, setBrute] = useState(false)
	const [copied, setCopied] = useState(false)

	const size = alphabetSize(alphabet)
	const letters = useMemo(() => [...CAESAR_ALPHABETS[alphabet]], [alphabet])

	const result = useMemo(
		() => caesarShift(input, mode === 'encrypt' ? shift : -shift, alphabet),
		[input, shift, mode, alphabet]
	)

	// Последняя набранная буква подсвечивается на диске вместе со своей
	// заменой — так связь между текстом и кругом видна прямо во время набора
	const highlight = useMemo(() => {
		for (let index = input.length - 1; index >= 0; index--) {
			if (CAESAR_ALPHABETS[alphabet].includes(input[index].toUpperCase())) {
				return input[index]
			}
		}
		return null
	}, [input, alphabet])

	const guesses = useMemo(
		() => (brute && input ? caesarBruteForce(input, alphabet) : []),
		[brute, input, alphabet]
	)

	const foreign = input ? hasForeignLetters(input, alphabet) : false
	const otherAlphabet: CaesarAlphabet =
		alphabet === 'latin' ? 'cyrillic' : 'latin'

	// Сдвиг больше нового алфавита теряет смысл: 30 по латинице — это 4
	const applyAlphabet = (next: CaesarAlphabet) => {
		setAlphabet(next)
		setShift(current => current % alphabetSize(next))
	}

	const handleInput = (value: string) => {
		setInput(value)
		const detected = detectAlphabet(value, alphabet)
		if (detected !== alphabet) applyAlphabet(detected)
	}

	const copyResult = () => {
		navigator.clipboard.writeText(result)
		setCopied(true)
		setTimeout(() => setCopied(false), 2000)
	}

	return (
		<WidgetSEOWrapper widget={widget}>
			<Card className='overflow-hidden p-0'>
				{/* Шапка: направление шифрования слева, действия справа */}
				<div className={toolBar}>
					<div className={toolToggleTrack}>
						{MODES.map(([value, label]) => (
							<button
								key={value}
								type='button'
								onClick={() => setMode(value)}
								aria-pressed={mode === value}
								className={toolToggleOption(mode === value)}
							>
								{label}
							</button>
						))}
					</div>

					<div className='flex items-center gap-0.5 sm:ml-auto'>
						<Button
							size='icon'
							variant='ghost'
							onClick={() => setInput(result)}
							disabled={!result}
							title='Перенести результат в поле ввода'
							className={toolIconButton}
						>
							<ArrowUpDown className='h-4 w-4' />
						</Button>
						<Button
							size='icon'
							variant='ghost'
							onClick={copyResult}
							disabled={!result}
							title='Скопировать результат'
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
							onClick={() => setInput('')}
							disabled={!input}
							title='Очистить'
							className={toolIconButton}
						>
							<Trash2 className='h-4 w-4' />
						</Button>
					</div>
				</div>

				{/* Текст и диск рядом: на широком экране видно и результат, и ключ */}
				<div className='grid lg:grid-cols-[1fr_auto]'>
					<div className='grid md:grid-cols-2 lg:grid-cols-1'>
						<Textarea
							value={input}
							onChange={event => handleInput(event.target.value)}
							placeholder={
								mode === 'encrypt'
									? 'Введите текст для шифрования'
									: 'Вставьте шифротекст'
							}
							spellCheck={false}
							aria-label={mode === 'encrypt' ? 'Открытый текст' : 'Шифротекст'}
							className='min-h-[11rem] resize-none rounded-none border-0 border-b px-5 py-6 font-mono text-base focus-visible:ring-0 sm:px-6 md:border-r md:border-b-0 md:text-sm lg:border-r-0 lg:border-b'
						/>

						{result ? (
							<pre className='min-h-[11rem] overflow-auto px-5 py-6 font-mono text-sm break-all whitespace-pre-wrap sm:px-6'>
								{result}
							</pre>
						) : (
							<p className='flex min-h-[11rem] items-center justify-center px-5 text-center text-sm text-muted-foreground'>
								{mode === 'encrypt'
									? 'Шифротекст появится здесь'
									: 'Расшифровка появится здесь'}
							</p>
						)}
					</div>

					{/* Диск: ключ как угол поворота, а не как число в поле */}
					<div className='flex flex-col items-center gap-4 border-t px-5 py-6 sm:px-6 lg:w-[24rem] lg:border-t-0 lg:border-l'>
						<CaesarWheel
							letters={letters}
							shift={shift}
							onShiftChange={setShift}
							highlight={highlight}
						/>

						<Slider
							value={[shift]}
							min={0}
							max={size - 1}
							step={1}
							onValueChange={([value]) => setShift(value)}
							aria-label='Сдвиг'
							className='max-w-[18rem]'
						/>

						<p className='text-center text-sm text-muted-foreground'>
							Крутите внутреннее кольцо мышью или тяните ползунок — ключей всего{' '}
							{size - 1}
						</p>
					</div>
				</div>

				{/* Нижняя полоса: алфавит, готовые ключи и перебор */}
				<div className={toolFooterBar}>
					<div className={toolToggleTrack}>
						{ALPHABETS.map(([value, label]) => (
							<button
								key={value}
								type='button'
								onClick={() => applyAlphabet(value)}
								aria-pressed={alphabet === value}
								className={toolToggleOption(alphabet === value)}
							>
								{label}
							</button>
						))}
					</div>

					<div className='flex flex-wrap items-center gap-1.5'>
						<button
							type='button'
							onClick={() => setShift(3)}
							aria-pressed={shift === 3}
							className={toolPill(shift === 3)}
							title='Сдвиг, которым пользовался сам Цезарь'
						>
							сдвиг 3
						</button>
						{alphabet === 'latin' && (
							<button
								type='button'
								onClick={() => setShift(13)}
								aria-pressed={shift === 13}
								className={toolPill(shift === 13)}
								title='Сдвиг на половину алфавита — обратен самому себе'
							>
								ROT13
							</button>
						)}
						<button
							type='button'
							onClick={() => setBrute(!brute)}
							aria-pressed={brute}
							className={toolPill(brute)}
							title='Показать расшифровку всеми ключами сразу'
						>
							перебор ключей
						</button>
					</div>

					{foreign && (
						<button
							type='button'
							onClick={() => applyAlphabet(otherAlphabet)}
							className='cursor-pointer text-sm text-muted-foreground underline-offset-4 transition-colors hover:text-foreground hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-ring'
						>
							{alphabet === 'latin'
								? 'в тексте есть кириллица — она осталась как есть'
								: 'в тексте есть латиница — она осталась как есть'}
						</button>
					)}

					<span className='text-sm text-muted-foreground sm:ml-auto'>
						символов{' '}
						<span className='font-mono text-foreground'>{input.length}</span>
					</span>
				</div>
			</Card>

			{/* Перебор — тихий список под инструментом: 25 или 32 строки, среди
			    которых осмысленная видна глазом за пару секунд */}
			{brute && (
				<div className='mt-6'>
					<p className='px-1 text-sm text-muted-foreground'>
						{guesses.length > 0
							? 'Расшифровка всеми ключами — нажмите на строку, чтобы оставить этот сдвиг'
							: 'Введите шифротекст, и здесь появится расшифровка всеми ключами'}
					</p>
					{guesses.length > 0 && (
						<div className='mt-2 divide-y rounded-xl border'>
							{guesses.map(guess => (
								<button
									key={guess.shift}
									type='button'
									onClick={() => {
										setShift(guess.shift)
										setMode('decrypt')
									}}
									className='flex w-full cursor-pointer items-center gap-3 px-4 py-2 text-left transition-colors first:rounded-t-xl last:rounded-b-xl hover:bg-muted/50 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset'
								>
									<span className='w-8 shrink-0 text-right font-mono text-xs text-muted-foreground'>
										{guess.shift}
									</span>
									<span className='min-w-0 flex-1 truncate font-mono text-sm'>
										{guess.text}
									</span>
								</button>
							))}
						</div>
					)}
				</div>
			)}

			<CaesarCipherSeo />
		</WidgetSEOWrapper>
	)
}
