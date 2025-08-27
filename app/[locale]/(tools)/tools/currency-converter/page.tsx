'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import {
	ArrowUpDown,
	Copy,
	RefreshCw,
	DollarSign,
	Euro,
	PoundSterling,
	IndianRupee,
	Banknote,
	TrendingUp,
	TrendingDown,
	Calculator,
	Info,
	Globe,
	Sparkles,
	Search,
	Star,
	History,
	ChevronDown,
	ArrowRight,
	X,
	Clock
} from 'lucide-react'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'
import { useTranslations } from 'next-intl'
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from '@/components/ui/dialog'
import {
	Command,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
} from '@/components/ui/command'
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from '@/components/ui/tooltip'

interface Currency {
	code: string
	name: string
	symbol: string
	icon: any
	flag: string
}

interface ExchangeRate {
	from: string
	to: string
	rate: number
	trend?: 'up' | 'down' | 'stable'
	changePercent?: number
}

// Currency configurations with gradients
const CURRENCY_GRADIENTS: { [key: string]: string } = {
	USD: 'from-green-500 to-emerald-600',
	EUR: 'from-blue-500 to-indigo-600',
	GBP: 'from-purple-500 to-pink-600',
	RUB: 'from-red-500 to-rose-600',
	CNY: 'from-amber-500 to-orange-600',
	JPY: 'from-pink-500 to-rose-500',
	INR: 'from-orange-500 to-amber-600',
	CHF: 'from-gray-500 to-slate-600',
	CAD: 'from-red-500 to-pink-500',
	AUD: 'from-blue-500 to-cyan-600'
}

// Fixed exchange rates (as of example date)
const CURRENCIES: Currency[] = [
	{
		code: 'USD',
		name: 'Доллар США',
		symbol: '$',
		icon: DollarSign,
		flag: '🇺🇸'
	},
	{ code: 'EUR', name: 'Евро', symbol: '€', icon: Euro, flag: '🇪🇺' },
	{
		code: 'GBP',
		name: 'Фунт стерлингов',
		symbol: '£',
		icon: PoundSterling,
		flag: '🇬🇧'
	},
	{
		code: 'RUB',
		name: 'Российский рубль',
		symbol: '₽',
		icon: Banknote,
		flag: '🇷🇺'
	},
	{
		code: 'CNY',
		name: 'Китайский юань',
		symbol: '¥',
		icon: Banknote,
		flag: '🇨🇳'
	},
	{
		code: 'JPY',
		name: 'Японская иена',
		symbol: '¥',
		icon: Banknote,
		flag: '🇯🇵'
	},
	{
		code: 'INR',
		name: 'Индийская рупия',
		symbol: '₹',
		icon: IndianRupee,
		flag: '🇮🇳'
	},
	{
		code: 'CHF',
		name: 'Швейцарский франк',
		symbol: 'Fr',
		icon: Banknote,
		flag: '🇨🇭'
	},
	{
		code: 'CAD',
		name: 'Канадский доллар',
		symbol: 'C$',
		icon: DollarSign,
		flag: '🇨🇦'
	},
	{
		code: 'AUD',
		name: 'Австралийский доллар',
		symbol: 'A$',
		icon: DollarSign,
		flag: '🇦🇺'
	}
]

// Fixed exchange rates relative to USD
const EXCHANGE_RATES: { [key: string]: number } = {
	USD: 1.0,
	EUR: 0.92,
	GBP: 0.79,
	RUB: 92.5,
	CNY: 7.25,
	JPY: 149.5,
	INR: 83.2,
	CHF: 0.88,
	CAD: 1.36,
	AUD: 1.52
}

// Amount presets
const AMOUNT_PRESETS = [100, 500, 1000, 5000, 10000]

export default function CurrencyConverterPage() {
	const t = useTranslations('widgets.currencyConverter')
	const [amount, setAmount] = useState<string>('1000')
	const [fromCurrency, setFromCurrency] = useState<Currency>(CURRENCIES[0]) // USD
	const [toCurrency, setToCurrency] = useState<Currency>(CURRENCIES[1]) // EUR
	const [result, setResult] = useState<number>(0)
	const [showFromDialog, setShowFromDialog] = useState(false)
	const [showToDialog, setShowToDialog] = useState(false)
	const [favorites, setFavorites] = useState<string[]>(['USD', 'EUR', 'GBP'])
	const [history, setHistory] = useState<
		Array<{
			from: Currency
			to: Currency
			amount: number
			result: number
			timestamp: Date
			rate: number
		}>
	>([])
	const [isConverting, setIsConverting] = useState(false)
	const [searchFrom, setSearchFrom] = useState('')
	const [searchTo, setSearchTo] = useState('')

	// Calculate exchange
	const calculateExchange = useCallback(() => {
		const numAmount = parseFloat(amount) || 0
		if (numAmount <= 0) {
			setResult(0)
			return
		}

		setIsConverting(true)
		
		// Simulate API call with animation
		setTimeout(() => {
			// Convert from source currency to USD
			const amountInUSD = numAmount / EXCHANGE_RATES[fromCurrency.code]
			// Convert from USD to target currency
			const convertedAmount = amountInUSD * EXCHANGE_RATES[toCurrency.code]
			
			setResult(convertedAmount)
			setIsConverting(false)
			
			// Add to history
			const rate = EXCHANGE_RATES[toCurrency.code] / EXCHANGE_RATES[fromCurrency.code]
			const newEntry = {
				from: fromCurrency,
				to: toCurrency,
				amount: numAmount,
				result: convertedAmount,
				timestamp: new Date(),
				rate
			}
			setHistory(prev => [newEntry, ...prev.slice(0, 4)])
		}, 300)
	}, [amount, fromCurrency, toCurrency])

	useEffect(() => {
		calculateExchange()
	}, [calculateExchange])

	// Load favorites from localStorage
	useEffect(() => {
		const saved = localStorage.getItem('currency-favorites')
		if (saved) {
			try {
				setFavorites(JSON.parse(saved))
			} catch {}
		}
	}, [])

	const swapCurrencies = () => {
		setFromCurrency(toCurrency)
		setToCurrency(fromCurrency)
		toast.success(t('toast.swapped') || 'Валюты поменяны местами')
	}

	const copyResult = () => {
		const formattedResult = `${amount} ${fromCurrency.code} = ${result.toFixed(2)} ${toCurrency.code}`
		navigator.clipboard.writeText(formattedResult)
		toast.success(t('toast.copied') || 'Результат скопирован!')
	}

	const resetCalculator = () => {
		setAmount('1000')
		setFromCurrency(CURRENCIES[0])
		setToCurrency(CURRENCIES[1])
		toast.success(t('toast.reset') || 'Калькулятор сброшен')
	}

	const toggleFavorite = (code: string) => {
		const newFavorites = favorites.includes(code)
			? favorites.filter(f => f !== code)
			: [...favorites, code]
		
		setFavorites(newFavorites)
		localStorage.setItem('currency-favorites', JSON.stringify(newFavorites))
		
		toast.success(
			favorites.includes(code)
				? t('toast.removedFromFavorites') || 'Удалено из избранного'
				: t('toast.addedToFavorites') || 'Добавлено в избранное'
		)
	}

	const getExchangeRate = (from: string, to: string): number => {
		const fromRate = EXCHANGE_RATES[from]
		const toRate = EXCHANGE_RATES[to]
		return toRate / fromRate
	}

	const formatCurrency = (value: number, currency: Currency): string => {
		return new Intl.NumberFormat('ru-RU', {
			style: 'currency',
			currency: currency.code,
			minimumFractionDigits: 2,
			maximumFractionDigits: 2
		}).format(value)
	}

	const formatNumber = (value: number): string => {
		return new Intl.NumberFormat('ru-RU', {
			minimumFractionDigits: 2,
			maximumFractionDigits: 2
		}).format(value)
	}

	// Currency selector component
	const CurrencySelector = ({ 
		value, 
		onChange, 
		open, 
		onOpenChange,
		search,
		onSearchChange,
		label 
	}: {
		value: Currency
		onChange: (currency: Currency) => void
		open: boolean
		onOpenChange: (open: boolean) => void
		search: string
		onSearchChange: (search: string) => void
		label: string
	}) => {
		const filteredCurrencies = CURRENCIES.filter(
			currency => 
				currency.code.toLowerCase().includes(search.toLowerCase()) ||
				currency.name.toLowerCase().includes(search.toLowerCase())
		)

		const favoriteCurrencies = filteredCurrencies.filter(c => favorites.includes(c.code))
		const otherCurrencies = filteredCurrencies.filter(c => !favorites.includes(c.code))

		return (
			<Dialog open={open} onOpenChange={onOpenChange}>
				<Button
					variant="outline"
					className="w-full justify-between text-left font-normal h-16 px-4"
					onClick={() => onOpenChange(true)}
				>
					<div className="flex items-center gap-3">
						<span className="text-2xl">{value.flag}</span>
						<div>
							<div className="font-semibold">{value.code}</div>
							<div className="text-xs text-muted-foreground">{value.name}</div>
						</div>
					</div>
					<ChevronDown className="h-4 w-4 opacity-50" />
				</Button>

				<DialogContent className="max-w-[400px] p-0">
					<DialogHeader className="p-6 pb-0">
						<DialogTitle>{label}</DialogTitle>
					</DialogHeader>
					<Command className="border-0">
						<CommandInput 
							placeholder={t('searchCurrency') || "Поиск валюты..."}
							value={search}
							onValueChange={onSearchChange}
						/>
						<CommandList>
							<CommandEmpty>{t('noCurrencyFound') || "Валюта не найдена"}</CommandEmpty>
							
							{favoriteCurrencies.length > 0 && (
								<CommandGroup heading={t('favorites') || "Избранные"}>
									{favoriteCurrencies.map((currency) => (
										<CommandItem
											key={currency.code}
											value={currency.code}
											onSelect={() => {
												onChange(currency)
												onOpenChange(false)
												onSearchChange('')
											}}
											className="flex items-center justify-between py-3"
										>
											<div className="flex items-center gap-3">
												<span className="text-2xl">{currency.flag}</span>
												<div>
													<div className="font-medium">{currency.code}</div>
													<div className="text-sm text-muted-foreground">
														{currency.name}
													</div>
												</div>
											</div>
											<div className="flex items-center gap-2">
												<Star
													className={cn(
														"h-4 w-4",
														favorites.includes(currency.code)
															? "fill-yellow-500 text-yellow-500"
															: "text-muted-foreground"
													)}
												/>
												<span className="text-sm font-mono text-muted-foreground">
													{currency.symbol}
												</span>
											</div>
										</CommandItem>
									))}
								</CommandGroup>
							)}
							
							{otherCurrencies.length > 0 && (
								<CommandGroup heading={t('allCurrencies') || "Все валюты"}>
									{otherCurrencies.map((currency) => (
										<CommandItem
											key={currency.code}
											value={currency.code}
											onSelect={() => {
												onChange(currency)
												onOpenChange(false)
												onSearchChange('')
											}}
											className="flex items-center justify-between py-3"
										>
											<div className="flex items-center gap-3">
												<span className="text-2xl">{currency.flag}</span>
												<div>
													<div className="font-medium">{currency.code}</div>
													<div className="text-sm text-muted-foreground">
														{currency.name}
													</div>
												</div>
											</div>
											<div className="flex items-center gap-2">
												<button
													onClick={(e) => {
														e.stopPropagation()
														toggleFavorite(currency.code)
													}}
													className="p-1 hover:bg-muted rounded"
												>
													<Star
														className={cn(
															"h-4 w-4",
															favorites.includes(currency.code)
																? "fill-yellow-500 text-yellow-500"
																: "text-muted-foreground"
														)}
													/>
												</button>
												<span className="text-sm font-mono text-muted-foreground">
													{currency.symbol}
												</span>
											</div>
										</CommandItem>
									))}
								</CommandGroup>
							)}
						</CommandList>
					</Command>
				</DialogContent>
			</Dialog>
		)
	}

	return (
		<TooltipProvider>
			<div className='max-w-4xl mx-auto space-y-6'>
				{/* Main Converter Card */}
				<Card className='relative overflow-hidden'>
					{/* Background gradient */}
					<div className={cn(
						'absolute inset-0 bg-gradient-to-br opacity-5',
						CURRENCY_GRADIENTS[fromCurrency.code]
					)} />
					
					<CardContent className='relative p-6 lg:p-8'>
						<div className='space-y-6'>
							{/* Amount Presets */}
							<div className='flex flex-wrap gap-2'>
								{AMOUNT_PRESETS.map((preset) => (
									<Button
										key={preset}
										variant={amount === preset.toString() ? 'default' : 'outline'}
										size="sm"
										onClick={() => setAmount(preset.toString())}
										className="transition-all"
									>
										{preset.toLocaleString('ru-RU')}
									</Button>
								))}
								<Button
									variant="outline"
									size="sm"
									onClick={() => setAmount('')}
									className="transition-all"
								>
									<Calculator className="h-4 w-4" />
								</Button>
							</div>

							{/* Conversion Flow */}
							<div className='grid lg:grid-cols-[1fr,auto,1fr] gap-6 items-center'>
								{/* From Currency */}
								<div className='space-y-4'>
									<label className='text-sm font-medium text-muted-foreground'>
										{t('from') || 'Из валюты'}
									</label>
									<CurrencySelector
										value={fromCurrency}
										onChange={setFromCurrency}
										open={showFromDialog}
										onOpenChange={setShowFromDialog}
										search={searchFrom}
										onSearchChange={setSearchFrom}
										label={t('selectFromCurrency') || 'Выберите валюту'}
									/>
									<div className='relative'>
										<Input
											type='number'
											value={amount}
											onChange={(e) => setAmount(e.target.value)}
											placeholder='0.00'
											className='text-2xl lg:text-3xl font-bold h-16 pr-12'
											min='0'
											step='any'
										/>
										<span className='absolute right-4 top-1/2 -translate-y-1/2 text-xl font-medium text-muted-foreground'>
											{fromCurrency.code}
										</span>
									</div>
								</div>

								{/* Swap Button */}
								<div className='flex justify-center'>
									<motion.button
										whileHover={{ scale: 1.1 }}
										whileTap={{ scale: 0.9, rotate: 180 }}
										onClick={swapCurrencies}
										className='p-4 rounded-full bg-primary text-primary-foreground shadow-lg'
									>
										<ArrowUpDown className='h-5 w-5' />
									</motion.button>
								</div>

								{/* To Currency */}
								<div className='space-y-4'>
									<label className='text-sm font-medium text-muted-foreground'>
										{t('to') || 'В валюту'}
									</label>
									<CurrencySelector
										value={toCurrency}
										onChange={setToCurrency}
										open={showToDialog}
										onOpenChange={setShowToDialog}
										search={searchTo}
										onSearchChange={setSearchTo}
										label={t('selectToCurrency') || 'Выберите валюту'}
									/>
									<div className='relative'>
										<AnimatePresence mode="wait">
											{isConverting ? (
												<motion.div
													key="loading"
													initial={{ opacity: 0 }}
													animate={{ opacity: 1 }}
													exit={{ opacity: 0 }}
													className='h-16 flex items-center justify-center'
												>
													<div className='flex gap-2'>
														<div className='w-2 h-2 bg-primary rounded-full animate-bounce' />
														<div className='w-2 h-2 bg-primary rounded-full animate-bounce [animation-delay:0.1s]' />
														<div className='w-2 h-2 bg-primary rounded-full animate-bounce [animation-delay:0.2s]' />
													</div>
												</motion.div>
											) : (
												<motion.div
													key="result"
													initial={{ opacity: 0, y: 20 }}
													animate={{ opacity: 1, y: 0 }}
													exit={{ opacity: 0, y: -20 }}
													className='text-2xl lg:text-3xl font-bold h-16 flex items-center px-4 bg-muted rounded-lg'
												>
													<span className={cn(
														'bg-gradient-to-r bg-clip-text text-transparent',
														CURRENCY_GRADIENTS[toCurrency.code]
													)}>
														{formatNumber(result)}
													</span>
													<span className='ml-3 text-muted-foreground'>
														{toCurrency.code}
													</span>
												</motion.div>
											)}
										</AnimatePresence>
									</div>
								</div>
							</div>

							{/* Exchange Rate Info */}
							<div className='flex flex-wrap items-center justify-between gap-4 p-4 bg-muted/50 rounded-lg'>
								<div className='flex items-center gap-3'>
									<div className='p-2 bg-background rounded-lg'>
										<TrendingUp className='h-4 w-4 text-green-500' />
									</div>
									<div className='text-sm'>
										<p className='font-medium'>
											1 {fromCurrency.code} = {getExchangeRate(fromCurrency.code, toCurrency.code).toFixed(4)} {toCurrency.code}
										</p>
										<p className='text-muted-foreground'>
											{t('exchangeRate') || 'Обменный курс'}
										</p>
									</div>
								</div>
								<div className='flex gap-2'>
									<Tooltip>
										<TooltipTrigger asChild>
											<Button
												size='icon'
												variant='ghost'
												onClick={copyResult}
											>
												<Copy className='h-4 w-4' />
											</Button>
										</TooltipTrigger>
										<TooltipContent>
											<p>{t('copyResult') || 'Копировать результат'}</p>
										</TooltipContent>
									</Tooltip>
									<Tooltip>
										<TooltipTrigger asChild>
											<Button
												size='icon'
												variant='ghost'
												onClick={resetCalculator}
											>
												<RefreshCw className='h-4 w-4' />
											</Button>
										</TooltipTrigger>
										<TooltipContent>
											<p>{t('reset') || 'Сбросить'}</p>
										</TooltipContent>
									</Tooltip>
								</div>
							</div>
						</div>
					</CardContent>
				</Card>

				{/* History Section */}
				{history.length > 0 && (
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ delay: 0.2 }}
					>
						<Card>
							<CardContent className='p-6'>
								<div className='flex items-center gap-2 mb-4'>
									<History className='h-5 w-5 text-primary' />
									<h3 className='font-semibold'>{t('history') || 'История конвертаций'}</h3>
								</div>
								<div className='space-y-3'>
									{history.map((entry, index) => (
										<motion.div
											key={index}
											initial={{ opacity: 0, x: -20 }}
											animate={{ opacity: 1, x: 0 }}
											transition={{ delay: index * 0.05 }}
											className='flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors cursor-pointer'
											onClick={() => {
												setAmount(entry.amount.toString())
												setFromCurrency(entry.from)
												setToCurrency(entry.to)
											}}
										>
											<div className='flex items-center gap-3'>
												<div className='flex items-center gap-2'>
													<span className='text-lg'>{entry.from.flag}</span>
													<span className='font-medium'>{entry.amount.toLocaleString('ru-RU')}</span>
													<span className='text-muted-foreground'>{entry.from.code}</span>
												</div>
												<ArrowRight className='h-4 w-4 text-muted-foreground' />
												<div className='flex items-center gap-2'>
													<span className='text-lg'>{entry.to.flag}</span>
													<span className='font-medium'>{entry.result.toFixed(2)}</span>
													<span className='text-muted-foreground'>{entry.to.code}</span>
												</div>
											</div>
											<div className='flex items-center gap-2'>
												<Badge variant='secondary' className='text-xs'>
													{entry.rate.toFixed(4)}
												</Badge>
												<span className='text-xs text-muted-foreground flex items-center gap-1'>
													<Clock className='h-3 w-3' />
													{entry.timestamp.toLocaleTimeString('ru-RU', {
														hour: '2-digit',
														minute: '2-digit'
													})}
												</span>
											</div>
										</motion.div>
									))}
								</div>
							</CardContent>
						</Card>
					</motion.div>
				)}

				{/* Info Card */}
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ delay: 0.3 }}
				>
					<Card className='bg-muted/50'>
						<CardContent className='p-6'>
							<div className='flex items-center gap-2 mb-3'>
								<Info className='h-4 w-4 text-muted-foreground' />
								<h3 className='font-medium'>{t('info.title') || 'Информация'}</h3>
							</div>
							<div className='space-y-2 text-sm text-muted-foreground'>
								<p>{t('info.disclaimer') || 'Данный калькулятор использует фиксированные курсы валют для демонстрации.'}</p>
								<p>{t('info.sources') || 'Для получения актуальных курсов используйте официальные источники.'}</p>
							</div>
						</CardContent>
					</Card>
				</motion.div>
			</div>
		</TooltipProvider>
	)
}