'use client'

import { useMemo, useState } from 'react'
import { Card } from '@/components/ui/card'
import { RotateCcw } from 'lucide-react'
import { cn } from '@/lib/utils'
import {
	toolBar,
	toolFooterBar,
	toolIconButton,
	toolPill
} from '@/lib/ui/tool-pill'
import { CAR_REGIONS, type CarRegion } from '@/lib/data/car-region-codes'
import { robotoCondensedFont } from '@/lib/fonts/fonts'
import { WidgetSEOWrapper } from '@/components/seo/WidgetSEOWrapper'
import { getWidgetById } from '@/lib/constants/widgets'
import { CarRegionCodesSeo } from './CarRegionCodesSeo'
import { ToolScreenshot } from '@/components/tools/ToolScreenshot'

const DISTRICTS = [
	'Все',
	...Array.from(new Set(CAR_REGIONS.map(region => region.district))).sort()
]

/** Буквы, которые по ГОСТ Р 50577 допускаются в российском автономере —
 *  кириллица, совпадающая по начертанию с латиницей. */
const PLATE_LETTERS = 'АВЕКМНОРСТУХ'

/** Латинские двойники тех же букв — принимаем при вводе с английской
 *  раскладки или вставке номера, набранного латиницей, и превращаем в
 *  кириллицу той же формы. */
const LATIN_TO_CYRILLIC: Record<string, string> = {
	A: 'А',
	B: 'В',
	E: 'Е',
	K: 'К',
	M: 'М',
	H: 'Н',
	O: 'О',
	P: 'Р',
	C: 'С',
	T: 'Т',
	Y: 'У',
	X: 'Х'
}

/** Формат российского номера: буква, три цифры, две буквы — в этом и
 *  только в этом порядке. */
const PLATE_PATTERN: Array<'letter' | 'digit'> = [
	'letter',
	'digit',
	'digit',
	'digit',
	'letter',
	'letter'
]

/**
 * Позиционная маска: символ принимается, только если подходит под ожидаемый
 * класс (буква/цифра) для текущей позиции — иначе нажатие просто не даёт
 * эффекта, как в маске номера карты. Так на выходе всегда либо пустая
 * строка, либо префикс реального формата, а не произвольный набор из
 * шести букв или цифр.
 */
function filterPlateBody(value: string): string {
	const upper = value.toUpperCase()
	let result = ''

	for (const raw of upper) {
		if (result.length >= PLATE_PATTERN.length) break

		const char = LATIN_TO_CYRILLIC[raw] ?? raw
		const expected = PLATE_PATTERN[result.length]

		if (expected === 'letter' && PLATE_LETTERS.includes(char)) {
			result += char
		} else if (expected === 'digit' && /[0-9]/.test(char)) {
			result += char
		}
	}

	return result
}

/**
 * Вердикт по трёхзначному числу в номере — без внешних данных, только
 * арифметика на цифрах. Категории соответствуют тому, за что на рынке
 * перекупов реально платят больше номинала.
 */
function getBeautyVerdict(threeDigits: string): string | null {
	if (threeDigits.length !== 3) return null

	const [a, b, c] = threeDigits.split('').map(Number)

	if (a === b && b === c) {
		return 'Все три цифры одинаковые — самый ценный тип красивого номера'
	}
	if (a === c) {
		return 'Зеркальный номер — первая и последняя цифры совпадают'
	}
	if ((b === a + 1 && c === b + 1) || (b === a - 1 && c === b - 1)) {
		return 'Цифры идут по порядку'
	}
	if (b === 0 && c === 0) {
		return 'Круглый номер — заканчивается на два нуля'
	}
	return null
}

function RussianFlag() {
	return (
		<span className='flex h-4 w-6 flex-col overflow-hidden rounded-[1px] border border-black/20 sm:h-5 sm:w-7'>
			<span className='h-[2px] flex-1 bg-white' />
			<span className='h-[2px] flex-1 bg-blue-600' />
			<span className='h-[2px] flex-1 bg-red-600' />
		</span>
	)
}

/** Строка таблицы вместе с тем, по какому коду она нашлась. */
type Row = { region: CarRegion; matchedFormer: string | null }

function matches(region: CarRegion, needle: string): Row | null {
	if (!needle) return { region, matchedFormer: null }

	if (region.region.toLowerCase().includes(needle)) {
		return { region, matchedFormer: null }
	}
	if (region.codes.some(code => code.startsWith(needle))) {
		return { region, matchedFormer: null }
	}

	const former = region.formerCodes?.find(code => code.startsWith(needle))
	return former ? { region, matchedFormer: former } : null
}

export default function CarRegionCodesPage() {
	const widget = getWidgetById('car-region-codes')!

	const [query, setQuery] = useState('')
	const [district, setDistrict] = useState('Все')
	const [plateBody, setPlateBody] = useState('')
	const [regionCode, setRegionCode] = useState('')

	const matchedRegion = useMemo(() => {
		if (!regionCode) return null
		const current = CAR_REGIONS.find(region =>
			region.codes.includes(regionCode)
		)
		if (current) return { region: current, former: false }
		const former = CAR_REGIONS.find(region =>
			region.formerCodes?.includes(regionCode)
		)
		return former ? { region: former, former: true } : null
	}, [regionCode])

	const beautyVerdict = useMemo(
		() => getBeautyVerdict(plateBody.replace(/[^0-9]/g, '')),
		[plateBody]
	)

	const rows = useMemo(() => {
		const needle = query.trim().toLowerCase()

		return CAR_REGIONS.reduce<Row[]>((acc, region) => {
			if (district !== 'Все' && region.district !== district) return acc
			const row = matches(region, needle)
			if (row) acc.push(row)
			return acc
		}, [])
	}, [query, district])

	return (
		<WidgetSEOWrapper widget={widget}>
			<Card className='overflow-hidden p-0'>
				<div className='flex flex-col items-center gap-4 border-b bg-muted/30 px-5 py-6 sm:px-6'>
					<div className='flex items-stretch gap-3'>
						<div
							className={cn(
								robotoCondensedFont.variable,
								'flex w-fit items-stretch overflow-hidden rounded-lg border-[6px] border-black bg-white shadow-md'
							)}
						>
							<input
								type='text'
								value={plateBody}
								onChange={event =>
									setPlateBody(filterPlateBody(event.target.value))
								}
								placeholder='А123ВС'
								aria-label='Буквы и цифры номера'
								maxLength={6}
								size={1}
								className='plate-font w-[4.4em] border-0 bg-transparent px-4 py-3 text-left text-5xl tracking-wider text-black placeholder:text-black/25 focus:outline-none sm:px-6 sm:text-7xl'
							/>
							<div className='flex flex-col items-center justify-center gap-1.5 border-l-4 border-black px-3 py-2'>
								<input
									type='text'
									inputMode='numeric'
									value={regionCode}
									onChange={event =>
										setRegionCode(
											event.target.value.replace(/\D/g, '').slice(0, 3)
										)
									}
									placeholder='78'
									aria-label='Код региона'
									maxLength={3}
									size={1}
									className='plate-font w-[2.2em] border-0 bg-transparent text-left text-3xl leading-none text-black placeholder:text-black/25 focus:outline-none sm:text-5xl'
								/>
								<span className='flex items-center gap-1.5 text-xl leading-none font-bold text-black sm:text-2xl'>
									RUS
									<RussianFlag />
								</span>
							</div>
						</div>

						<button
							type='button'
							onClick={() => {
								setPlateBody('')
								setRegionCode('')
							}}
							disabled={!plateBody && !regionCode}
							title='Сбросить'
							className={cn(
								toolIconButton,
								'self-center',
								!(plateBody || regionCode) && 'invisible'
							)}
						>
							<RotateCcw className='h-4 w-4' />
						</button>
					</div>

					<div className='flex flex-col items-center gap-1.5 text-center'>
						{matchedRegion ? (
							<p className='text-lg font-semibold text-foreground sm:text-xl'>
								{matchedRegion.region.region}
								{matchedRegion.former && (
									<span className='ml-2 align-middle text-xs font-normal text-amber-600 dark:text-amber-400'>
										бывший код
									</span>
								)}
								<span className='block text-sm font-normal text-muted-foreground'>
									{matchedRegion.region.district} округ
								</span>
							</p>
						) : (
							<p className='text-sm text-muted-foreground'>
								Впишите код региона в номер — узнаете субъект
							</p>
						)}

						{beautyVerdict && (
							<span className='inline-flex items-center rounded-full border border-primary/40 bg-primary/10 px-3 py-1 text-xs font-medium text-primary'>
								{beautyVerdict}
							</span>
						)}
					</div>

					<p className='max-w-md text-center text-xs text-muted-foreground'>
						Формат: буква → 3 цифры → 2 буквы. Печатайте прямо на номере или
						кликните на строку в таблице ниже — её код региона подставится сюда
					</p>
				</div>

				<div className={toolBar}>
					<input
						type='search'
						value={query}
						onChange={event => setQuery(event.target.value)}
						placeholder='Код или регион — например 116 или Татарстан'
						aria-label='Поиск по коду или названию региона'
						className='w-full max-w-sm rounded-md border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-ring'
					/>

					<span className='text-sm text-muted-foreground sm:ml-auto'>
						найдено{' '}
						<span className='font-mono text-foreground'>{rows.length}</span>
					</span>
				</div>

				<div className={toolBar}>
					<div className='flex flex-wrap gap-1.5'>
						{DISTRICTS.map(option => (
							<button
								key={option}
								type='button'
								onClick={() => setDistrict(option)}
								aria-pressed={district === option}
								className={toolPill(district === option)}
							>
								{option}
							</button>
						))}
					</div>
				</div>

				{rows.length === 0 ? (
					<p className='px-5 py-16 text-center text-sm text-muted-foreground sm:px-6'>
						Ничего не нашлось — проверьте код или название региона
					</p>
				) : (
					<div className='overflow-x-auto'>
						<table className='w-full text-sm'>
							<thead>
								<tr className='border-b text-left text-muted-foreground'>
									<th className='px-5 py-3 font-medium sm:px-6'>Коды</th>
									<th className='px-5 py-3 font-medium sm:px-6'>Регион</th>
									<th className='hidden px-5 py-3 font-medium sm:table-cell sm:px-6'>
										Федеральный округ
									</th>
								</tr>
							</thead>
							<tbody>
								{rows.map(({ region, matchedFormer }) => (
									<tr
										key={region.region}
										onClick={() => setRegionCode(region.codes[0])}
										className={cn(
											'cursor-pointer border-b last:border-0 hover:bg-muted/40',
											regionCode &&
												region.codes.includes(regionCode) &&
												'bg-primary/5'
										)}
									>
										<td className='px-5 py-3 font-mono whitespace-nowrap sm:px-6'>
											{region.codes.join(', ')}
											{matchedFormer && (
												<span
													className='ml-2 rounded-full border border-amber-500/40 px-2 py-0.5 text-xs text-amber-700 dark:text-amber-400'
													title='Код за этим регионом больше не выдаётся'
												>
													был {matchedFormer}
												</span>
											)}
										</td>
										<td
											className={cn(
												'px-5 py-3 sm:px-6',
												matchedFormer && 'text-muted-foreground'
											)}
										>
											{region.region}
										</td>
										<td className='hidden px-5 py-3 text-muted-foreground sm:table-cell sm:px-6'>
											{region.district}
										</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>
				)}

				<div className={toolFooterBar}>
					<span className='text-sm text-muted-foreground'>
						Коды 80, 81, 82, 84, 85 и 88 когда-то принадлежали упразднённым
						автономным округам и позже были переназначены — такие совпадения
						помечены
					</span>
				</div>
			</Card>

			<ToolScreenshot slug='car-region-codes' />
			<CarRegionCodesSeo />
		</WidgetSEOWrapper>
	)
}
