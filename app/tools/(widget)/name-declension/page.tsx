'use client'

import { useMemo, useState, type ClipboardEvent } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Check, Copy, Lightbulb, Trash2 } from 'lucide-react'
import {
	toolBar,
	toolFooterBar,
	toolIconButton,
	toolPill
} from '@/lib/ui/tool-pill'
import { WidgetSEOWrapper } from '@/components/seo/WidgetSEOWrapper'
import { getWidgetById } from '@/lib/constants/widgets'
import {
	CASES,
	declineFullName,
	formatName,
	splitFullName,
	type FullName,
	type Gender,
	type NameFormat
} from '@/lib/name-declension'
import { NameDeclensionSeo } from './NameDeclensionSeo'

type GenderMode = 'auto' | Gender

const GENDERS: { value: GenderMode; label: string }[] = [
	{ value: 'auto', label: 'Авто' },
	{ value: 'male', label: 'Мужской' },
	{ value: 'female', label: 'Женский' }
]

const FORMATS: { value: NameFormat; label: string }[] = [
	{ value: 'fio', label: 'Фамилия Имя Отчество' },
	{ value: 'iof', label: 'Имя Отчество Фамилия' },
	{ value: 'initials', label: 'Фамилия И. О.' }
]

const EXAMPLES: FullName[] = [
	{ last: 'Иванова', first: 'Мария', middle: 'Сергеевна' },
	{ last: 'Шевчук', first: 'Дмитрий', middle: 'Ильич' },
	{ last: 'Римский-Корсаков', first: 'Николай', middle: 'Андреевич' },
	{ last: 'Шевчук', first: 'Анна', middle: 'Павловна' }
]

const EMPTY: FullName = { last: '', first: '', middle: '' }

const FIELDS: { key: keyof FullName; label: string; placeholder: string }[] = [
	{ key: 'last', label: 'Фамилия', placeholder: 'Иванова' },
	{ key: 'first', label: 'Имя', placeholder: 'Мария' },
	{ key: 'middle', label: 'Отчество', placeholder: 'Сергеевна' }
]

const inputClass =
	'w-full rounded-md border bg-background px-3 py-2 text-base text-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-ring md:text-sm'

export default function NameDeclensionPage() {
	const widget = getWidgetById('name-declension')!
	const [name, setName] = useState<FullName>(EMPTY)
	const [genderMode, setGenderMode] = useState<GenderMode>('auto')
	const [format, setFormat] = useState<NameFormat>('fio')
	const [copied, setCopied] = useState<number | 'all' | null>(null)
	const [exampleIndex, setExampleIndex] = useState(0)

	const isEmpty = !name.last.trim() && !name.first.trim() && !name.middle.trim()

	const declined = useMemo(
		() =>
			declineFullName(name, genderMode === 'auto' ? undefined : genderMode),
		[name, genderMode]
	)

	const rows = CASES.map((c, i) => ({
		...c,
		value: formatName(declined, i, format)
	}))

	const setField = (key: keyof FullName, value: string) =>
		setName(prev => ({ ...prev, [key]: value }))

	// ФИО целиком, вставленное в поле фамилии или имени, раскладываем по полям
	const pasteField = (
		key: keyof FullName,
		event: ClipboardEvent<HTMLInputElement>
	) => {
		const text = event.clipboardData.getData('text').trim()
		if (key === 'middle' || !/\s/.test(text)) return
		event.preventDefault()
		setName(splitFullName(text))
	}

	const copy = (text: string, marker: number | 'all') => {
		navigator.clipboard.writeText(text)
		setCopied(marker)
		setTimeout(() => setCopied(null), 2000)
	}

	const copyAll = () =>
		copy(
			rows.map(r => `${r.label} (${r.question}) ${r.value}`).join('\n'),
			'all'
		)

	const showExample = () => {
		setName(EXAMPLES[exampleIndex])
		setGenderMode('auto')
		setExampleIndex((exampleIndex + 1) % EXAMPLES.length)
	}

	const genderHint =
		genderMode !== 'auto'
			? null
			: declined.detected
				? `Пол определён автоматически: ${declined.gender === 'male' ? 'мужской' : 'женский'}`
				: 'Пол не понять по введённому, склоняю как мужской. Выберите пол вручную, если нужно'

	return (
		<WidgetSEOWrapper widget={widget}>
			<Card className='overflow-hidden p-0'>
				<div className={toolBar}>
					<span className='text-sm text-muted-foreground'>Пол</span>
					<div className='flex flex-wrap gap-1.5'>
						{GENDERS.map(g => (
							<button
								key={g.value}
								type='button'
								onClick={() => setGenderMode(g.value)}
								aria-pressed={genderMode === g.value}
								className={toolPill(genderMode === g.value)}
							>
								{g.label}
							</button>
						))}
					</div>

					<div className='flex items-center gap-0.5 sm:ml-auto'>
						<Button
							size='sm'
							variant='ghost'
							onClick={showExample}
							title='Подставить пример'
							className='cursor-pointer gap-1.5 text-muted-foreground hover:bg-muted hover:text-foreground'
						>
							<Lightbulb className='h-4 w-4' />
							Пример
						</Button>
						<Button
							size='icon'
							variant='ghost'
							onClick={copyAll}
							disabled={isEmpty}
							title='Скопировать все падежи'
							className={toolIconButton}
						>
							{copied === 'all' ? (
								<Check className='h-4 w-4 text-green-600 dark:text-green-400' />
							) : (
								<Copy className='h-4 w-4' />
							)}
						</Button>
						<Button
							size='icon'
							variant='ghost'
							onClick={() => setName(EMPTY)}
							disabled={isEmpty}
							title='Очистить'
							className={toolIconButton}
						>
							<Trash2 className='h-4 w-4' />
						</Button>
					</div>
				</div>

				<div className='grid gap-4 border-b px-5 py-6 sm:grid-cols-3 sm:px-6'>
					{FIELDS.map((field, i) => (
						<label key={field.key} className='block'>
							<span className='mb-1.5 block text-sm text-muted-foreground'>
								{field.label}
							</span>
							<input
								type='text'
								value={name[field.key]}
								onChange={event => setField(field.key, event.target.value)}
								onPaste={event => pasteField(field.key, event)}
								placeholder={field.placeholder}
								autoFocus={i === 0}
								autoComplete='off'
								spellCheck={false}
								aria-label={field.label}
								className={inputClass}
							/>
						</label>
					))}
					<p className='text-xs text-muted-foreground sm:col-span-3'>
						Можно вставить ФИО целиком в поле фамилии, оно само разложится по
						полям. Любое поле можно оставить пустым.
					</p>
				</div>

				{isEmpty ? (
					<p className='px-5 py-16 text-center text-sm text-muted-foreground sm:px-6'>
						Введите фамилию, имя или отчество
					</p>
				) : (
					<div className='divide-y'>
						{rows.map((row, i) => (
							<button
								key={row.id}
								type='button'
								onClick={() => copy(row.value, i)}
								title='Нажмите, чтобы скопировать'
								className='group flex w-full cursor-pointer flex-col gap-1 px-5 py-3 text-left transition-colors hover:bg-muted/40 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring sm:flex-row sm:items-center sm:gap-6 sm:px-6'
							>
								<span className='w-44 shrink-0 text-sm text-muted-foreground'>
									{row.label}{' '}
									<span className='text-xs opacity-70'>{row.question}</span>
								</span>
								<span className='flex-1 text-lg font-semibold break-words text-foreground'>
									{row.value}
								</span>
								<span className='hidden shrink-0 text-muted-foreground sm:block'>
									{copied === i ? (
										<Check className='h-4 w-4 text-green-600 dark:text-green-400' />
									) : (
										<Copy className='h-4 w-4 opacity-0 transition-opacity group-hover:opacity-100' />
									)}
								</span>
							</button>
						))}
					</div>
				)}

				<div className={toolFooterBar}>
					<div className='flex flex-wrap gap-1.5'>
						{FORMATS.map(f => (
							<button
								key={f.value}
								type='button'
								onClick={() => setFormat(f.value)}
								aria-pressed={format === f.value}
								className={toolPill(format === f.value)}
							>
								{f.label}
							</button>
						))}
					</div>
					{genderHint && !isEmpty && (
						<span className='text-sm text-muted-foreground sm:ml-auto'>
							{genderHint}
						</span>
					)}
				</div>
			</Card>

			<NameDeclensionSeo />
		</WidgetSEOWrapper>
	)
}
