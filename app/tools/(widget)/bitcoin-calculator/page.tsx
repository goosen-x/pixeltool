'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import { ArrowUpDown, Loader2, RefreshCw } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { toolBar, toolFooterBar, toolIconButton } from '@/lib/ui/tool-pill'
import { WidgetSEOWrapper } from '@/components/seo/WidgetSEOWrapper'
import { getWidgetById } from '@/lib/constants/widgets'
import { BitcoinCalculatorSeo } from './BitcoinCalculatorSeo'

type CryptoId = 'bitcoin' | 'ethereum' | 'tether'
type FiatCode = 'rub' | 'usd' | 'eur'
type Direction = 'toFiat' | 'toCrypto'

const CRYPTO: { id: CryptoId; label: string }[] = [
	{ id: 'bitcoin', label: 'Bitcoin (BTC)' },
	{ id: 'ethereum', label: 'Ethereum (ETH)' },
	{ id: 'tether', label: 'Tether (USDT)' }
]

const FIAT: { code: FiatCode; label: string; symbol: string }[] = [
	{ code: 'rub', label: 'Российский рубль', symbol: '₽' },
	{ code: 'usd', label: 'Доллар США', symbol: '$' },
	{ code: 'eur', label: 'Евро', symbol: '€' }
]

type Prices = Record<CryptoId, Record<FiatCode, number>>

const COINGECKO_URL =
	'https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,tether&vs_currencies=rub,usd,eur'

function toNumber(value: string): number | null {
	const parsed = parseFloat(value.replace(',', '.'))
	return Number.isFinite(parsed) && parsed >= 0 ? parsed : null
}

// Крипта — до 8 знаков (спутник копейки биткоина иначе теряется), фиат — 2.
function formatAmount(value: number, isCrypto: boolean): string {
	const digits = isCrypto ? 8 : 2
	const rounded = value.toFixed(digits)
	return isCrypto ? rounded.replace(/\.?0+$/, '') || '0' : rounded
}

function formatDisplay(value: number, isCrypto: boolean): string {
	return value.toLocaleString('ru-RU', {
		maximumFractionDigits: isCrypto ? 8 : 2
	})
}

const selectClass =
	'w-full cursor-pointer rounded-md border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-ring'
const inputClass =
	'w-full rounded-md border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-ring'

export default function BitcoinCalculatorPage() {
	const widget = getWidgetById('bitcoin-calculator')!

	const [amount, setAmount] = useState('1')
	const [cryptoId, setCryptoId] = useState<CryptoId>('bitcoin')
	const [fiatCode, setFiatCode] = useState<FiatCode>('rub')
	const [direction, setDirection] = useState<Direction>('toFiat')

	const [prices, setPrices] = useState<Prices | null>(null)
	const [updatedAt, setUpdatedAt] = useState<Date | null>(null)
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState<string | null>(null)

	const fetchPrices = useCallback(async () => {
		setLoading(true)
		setError(null)
		try {
			const response = await fetch(COINGECKO_URL)
			if (!response.ok) throw new Error('bad status')
			const data = (await response.json()) as Prices
			setPrices(data)
			setUpdatedAt(new Date())
		} catch {
			setError('Не удалось получить курс. Проверьте связь и обновите вручную.')
		} finally {
			setLoading(false)
		}
	}, [])

	useEffect(() => {
		void fetchPrices()
	}, [fetchPrices])

	const rate = prices?.[cryptoId]?.[fiatCode] ?? null

	const result = useMemo(() => {
		const amt = toNumber(amount)
		if (amt === null || rate === null) return null
		return direction === 'toFiat' ? amt * rate : amt / rate
	}, [amount, rate, direction])

	const swap = () => {
		if (result !== null) {
			setAmount(formatAmount(result, direction === 'toCrypto'))
		}
		setDirection(prev => (prev === 'toFiat' ? 'toCrypto' : 'toFiat'))
	}

	const fiatMeta = FIAT.find(item => item.code === fiatCode)!
	const cryptoMeta = CRYPTO.find(item => item.id === cryptoId)!

	return (
		<WidgetSEOWrapper widget={widget}>
			<Card className='overflow-hidden p-0'>
				<div className={toolBar}>
					<span className='text-sm text-muted-foreground'>
						{loading
							? 'Получаем курс…'
							: updatedAt
								? `Курс на ${updatedAt.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })}`
								: 'Курс недоступен'}
					</span>

					<div className='flex items-center gap-0.5 sm:ml-auto'>
						<Button
							size='icon'
							variant='ghost'
							onClick={() => void fetchPrices()}
							disabled={loading}
							title='Обновить курс'
							className={toolIconButton}
						>
							{loading ? (
								<Loader2 className='h-4 w-4 animate-spin' />
							) : (
								<RefreshCw className='h-4 w-4' />
							)}
						</Button>
					</div>
				</div>

				<div className='grid gap-3 px-5 py-6 sm:px-6'>
					{/* Верхняя строка — то, что вводит пользователь; нижняя — результат.
					    Свап меняет местами не сами поля, а то, какая валюта сейчас ввод. */}
					<div className='grid gap-3 sm:grid-cols-[1fr_1fr]'>
						{direction === 'toFiat' ? (
							<>
								<select
									value={cryptoId}
									onChange={event =>
										setCryptoId(event.target.value as CryptoId)
									}
									aria-label='Криптовалюта'
									className={selectClass}
								>
									{CRYPTO.map(item => (
										<option key={item.id} value={item.id}>
											{item.label}
										</option>
									))}
								</select>
								<input
									type='text'
									inputMode='decimal'
									value={amount}
									onChange={event => setAmount(event.target.value)}
									aria-label='Сумма в криптовалюте'
									className={inputClass}
								/>
							</>
						) : (
							<>
								<select
									value={fiatCode}
									onChange={event =>
										setFiatCode(event.target.value as FiatCode)
									}
									aria-label='Валюта'
									className={selectClass}
								>
									{FIAT.map(item => (
										<option key={item.code} value={item.code}>
											{item.label} ({item.symbol})
										</option>
									))}
								</select>
								<input
									type='text'
									inputMode='decimal'
									value={amount}
									onChange={event => setAmount(event.target.value)}
									aria-label='Сумма в валюте'
									className={inputClass}
								/>
							</>
						)}
					</div>

					<div className='flex justify-center'>
						<Button
							size='icon'
							variant='outline'
							onClick={swap}
							title='Поменять местами'
							className='h-8 w-8 cursor-pointer rounded-full'
						>
							<ArrowUpDown className='h-4 w-4' />
						</Button>
					</div>

					<div className='grid gap-3 sm:grid-cols-[1fr_1fr]'>
						{direction === 'toFiat' ? (
							<>
								<select
									value={fiatCode}
									onChange={event =>
										setFiatCode(event.target.value as FiatCode)
									}
									aria-label='Валюта'
									className={selectClass}
								>
									{FIAT.map(item => (
										<option key={item.code} value={item.code}>
											{item.label} ({item.symbol})
										</option>
									))}
								</select>
								<div className={`${inputClass} bg-muted/40 font-mono`}>
									{result !== null ? formatDisplay(result, false) : '—'}
								</div>
							</>
						) : (
							<>
								<select
									value={cryptoId}
									onChange={event =>
										setCryptoId(event.target.value as CryptoId)
									}
									aria-label='Криптовалюта'
									className={selectClass}
								>
									{CRYPTO.map(item => (
										<option key={item.id} value={item.id}>
											{item.label}
										</option>
									))}
								</select>
								<div className={`${inputClass} bg-muted/40 font-mono`}>
									{result !== null ? formatDisplay(result, true) : '—'}
								</div>
							</>
						)}
					</div>

					{error && <p className='text-sm text-destructive'>{error}</p>}
				</div>

				<div className={toolFooterBar}>
					<span className='text-sm text-muted-foreground'>
						{rate !== null
							? `1 ${cryptoMeta.label.split(' ')[0]} ≈ ${formatDisplay(rate, false)} ${fiatMeta.symbol}`
							: 'Курс появится после загрузки'}
					</span>
				</div>
			</Card>

			<BitcoinCalculatorSeo />
		</WidgetSEOWrapper>
	)
}
