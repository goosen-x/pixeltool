import Link from 'next/link'
import {
	ELEMENT_NAMES,
	formatRange,
	QUALITY_NAMES,
	ZODIAC_SIGNS,
	type ZodiacId
} from '@/lib/utils/zodiac'

interface ZodiacTableProps {
	/** Текущий знак подсвечивается — на его странице таблица служит ещё и
	 *  указателем, где он стоит среди остальных. */
	activeSign?: ZodiacId
}

/**
 * Полная таблица знаков с датами.
 *
 * Ради неё половина спроса и приходит: «знаки зодиака по датам рождения
 * таблица» ищут отдельно от калькулятора. Поэтому она не прячется за
 * раскрывашку и рендерится в разметку, а не подставляется скриптом.
 */
export function ZodiacTable({ activeSign }: ZodiacTableProps) {
	return (
		<div className='overflow-x-auto'>
			<table className='w-full border-collapse text-sm'>
				<caption className='sr-only'>Знаки зодиака по датам рождения</caption>
				<thead>
					<tr className='border-b text-left text-muted-foreground'>
						<th scope='col' className='py-2 pr-4 font-medium'>
							Знак
						</th>
						<th scope='col' className='py-2 pr-4 font-medium'>
							Даты рождения
						</th>
						<th scope='col' className='py-2 pr-4 font-medium'>
							Стихия
						</th>
						<th scope='col' className='py-2 pr-4 font-medium'>
							Качество
						</th>
						<th scope='col' className='py-2 font-medium'>
							Управитель
						</th>
					</tr>
				</thead>
				<tbody>
					{ZODIAC_SIGNS.map(sign => (
						<tr
							key={sign.id}
							className={
								sign.id === activeSign
									? 'border-b bg-primary/5'
									: 'border-b last:border-0'
							}
						>
							<th
								scope='row'
								className='py-2 pr-4 font-normal whitespace-nowrap'
							>
								<Link
									href={`/tools/zodiac-sign/${sign.id}`}
									className='cursor-pointer hover:underline'
								>
									<span aria-hidden='true'>{sign.symbol}</span> {sign.name}
								</Link>
							</th>
							<td className='py-2 pr-4 whitespace-nowrap'>
								{formatRange(sign)}
							</td>
							<td className='py-2 pr-4'>{ELEMENT_NAMES[sign.element]}</td>
							<td className='py-2 pr-4'>{QUALITY_NAMES[sign.quality]}</td>
							<td className='py-2'>{sign.ruler}</td>
						</tr>
					))}
				</tbody>
			</table>
		</div>
	)
}
