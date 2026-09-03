'use client'

import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Slider } from '@/components/ui/slider'
import { ToolSelect } from '@/components/ui/tool-select'
import { Play, Pause, Square, Trash2, FileDown, Copy } from 'lucide-react'
import { cn } from '@/lib/utils'
import {
	toolBar,
	toolFooterBar,
	toolIconButton,
	toolPill
} from '@/lib/ui/tool-pill'
import { WidgetSEOWrapper } from '@/components/seo/WidgetSEOWrapper'
import { getWidgetById } from '@/lib/constants/widgets'
import { TextToSpeechSeo } from './TextToSpeechSeo'
import { ToolScreenshot } from '@/components/tools/ToolScreenshot'

/** Короткие фразы, на которых слышно разницу между голосами. */
const EXAMPLE_PHRASES = [
	{
		label: 'Приветствие',
		text: 'Привет! Добро пожаловать на наш сайт. Мы рады вас видеть!'
	},
	{
		label: 'Объявление',
		text: 'Внимание! Завтра состоится важное собрание в 14:00.'
	},
	{
		label: 'Сказка',
		text: 'Жил-был в лесу маленький ёжик, который очень любил собирать грибы.'
	},
	{
		label: 'Стихи',
		text: 'Белая берёза под моим окном принакрылась снегом, точно серебром.'
	}
]

interface Voice {
	voice: SpeechSynthesisVoice
	name: string
	lang: string
	localService: boolean
}

interface HistoryItem {
	id: string
	text: string
	voice: string
	rate: number
	pitch: number
	timestamp: Date
	duration?: number
}

export default function TextToSpeechPage() {
	const widget = getWidgetById('text-to-speech')!
	const locale = 'ru'
	const [mounted, setMounted] = useState(false)
	const [text, setText] = useState('')
	const [voices, setVoices] = useState<Voice[]>([])
	const [selectedVoice, setSelectedVoice] = useState<string>('')
	const [isPlaying, setIsPlaying] = useState(false)
	const [isPaused, setIsPaused] = useState(false)
	const [rate, setRate] = useState([1])
	const [pitch, setPitch] = useState([1])
	const [volume, setVolume] = useState([1])
	const [history, setHistory] = useState<HistoryItem[]>([])
	const [currentUtterance, setCurrentUtterance] =
		useState<SpeechSynthesisUtterance | null>(null)
	const textareaRef = useRef<HTMLTextAreaElement>(null)

	// Load saved data from localStorage
	useEffect(() => {
		setMounted(true)
		const savedHistory = localStorage.getItem('tts-history')
		if (savedHistory) {
			try {
				const parsedHistory = JSON.parse(savedHistory).map((item: any) => ({
					...item,
					timestamp: new Date(item.timestamp)
				}))
				setHistory(parsedHistory)
			} catch (error) {
				console.error('Error parsing history:', error)
			}
		}

		const savedSettings = localStorage.getItem('tts-settings')
		if (savedSettings) {
			try {
				const settings = JSON.parse(savedSettings)
				if (settings.rate) setRate([settings.rate])
				if (settings.pitch) setPitch([settings.pitch])
				if (settings.volume) setVolume([settings.volume])
			} catch (error) {
				console.error('Error parsing settings:', error)
			}
		}
	}, [])

	// Load voices
	useEffect(() => {
		const loadVoices = () => {
			const availableVoices = speechSynthesis.getVoices()
			if (availableVoices.length > 0) {
				const voiceList: Voice[] = availableVoices.map(voice => ({
					voice,
					name: voice.name,
					lang: voice.lang,
					localService: voice.localService
				}))
				setVoices(voiceList)

				if (!selectedVoice && voiceList.length > 0) {
					// If locale is Russian, try to find a Russian voice first
					if (locale === 'ru') {
						const russianVoice = voiceList.find(v => v.lang.startsWith('ru'))
						if (russianVoice) {
							setSelectedVoice(russianVoice.name)
							return
						}
					}
					// Otherwise use default voice
					const defaultVoice =
						voiceList.find(v => v.voice.default) || voiceList[0]
					setSelectedVoice(defaultVoice.name)
				}
			}
		}

		loadVoices()
		speechSynthesis.addEventListener('voiceschanged', loadVoices)
		return () =>
			speechSynthesis.removeEventListener('voiceschanged', loadVoices)
	}, [selectedVoice, locale])

	// Save settings to localStorage
	useEffect(() => {
		if (mounted) {
			const settings = {
				rate: rate[0],
				pitch: pitch[0],
				volume: volume[0]
			}
			localStorage.setItem('tts-settings', JSON.stringify(settings))
		}
	}, [rate, pitch, volume, mounted])

	// Helper functions
	const getVoicesByLanguage = useCallback(() => {
		const grouped = voices.reduce(
			(acc, voice) => {
				const langName =
					new Intl.DisplayNames(['en'], { type: 'language' }).of(
						voice.lang.split('-')[0]
					) || voice.lang
				if (!acc[langName]) acc[langName] = []
				acc[langName].push(voice)
				return acc
			},
			{} as Record<string, Voice[]>
		)
		return grouped
	}, [voices])

	const addToHistory = useCallback(
		(text: string, voice: string, rate: number, pitch: number) => {
			const newItem: HistoryItem = {
				id: Date.now().toString(),
				text,
				voice,
				rate,
				pitch,
				timestamp: new Date()
			}

			const updatedHistory = [newItem, ...history].slice(0, 50) // Keep only 50 items
			setHistory(updatedHistory)
			localStorage.setItem('tts-history', JSON.stringify(updatedHistory))
		},
		[history]
	)

	const deleteHistoryItem = useCallback(
		(id: string) => {
			const updatedHistory = history.filter(item => item.id !== id)
			setHistory(updatedHistory)
			localStorage.setItem('tts-history', JSON.stringify(updatedHistory))
		},
		[history]
	)

	const clearHistory = useCallback(() => {
		setHistory([])
		localStorage.removeItem('tts-history')
	}, [])

	const speak = useCallback(() => {
		if (!text.trim()) {
			return
		}

		if (speechSynthesis.speaking) {
			speechSynthesis.cancel()
		}

		const utterance = new SpeechSynthesisUtterance(text)
		const selectedVoiceObj = voices.find(v => v.name === selectedVoice)

		if (selectedVoiceObj) {
			utterance.voice = selectedVoiceObj.voice
		}

		utterance.rate = rate[0]
		utterance.pitch = pitch[0]
		utterance.volume = volume[0]

		utterance.onstart = () => {
			setIsPlaying(true)
			setIsPaused(false)
		}

		utterance.onend = () => {
			setIsPlaying(false)
			setIsPaused(false)
			setCurrentUtterance(null)
		}

		utterance.onerror = () => {
			setIsPlaying(false)
			setIsPaused(false)
			setCurrentUtterance(null)
			console.error('Ошибка при воспроизведении речи')
		}

		setCurrentUtterance(utterance)
		speechSynthesis.speak(utterance)

		// Add to history
		addToHistory(text, selectedVoice, rate[0], pitch[0])
	}, [text, voices, selectedVoice, rate, pitch, volume, addToHistory])

	const pause = useCallback(() => {
		if (speechSynthesis.speaking && !speechSynthesis.paused) {
			speechSynthesis.pause()
			setIsPaused(true)
		}
	}, [])

	const resume = useCallback(() => {
		if (speechSynthesis.paused) {
			speechSynthesis.resume()
			setIsPaused(false)
		}
	}, [])

	const stop = useCallback(() => {
		speechSynthesis.cancel()
		setIsPlaying(false)
		setIsPaused(false)
		setCurrentUtterance(null)
	}, [])

	const exportText = useCallback(() => {
		const blob = new Blob([text], { type: 'text/plain' })
		const url = URL.createObjectURL(blob)
		const a = document.createElement('a')
		a.href = url
		a.download = 'speech-text.txt'
		a.click()
		URL.revokeObjectURL(url)
	}, [text])

	const copyToClipboard = useCallback(() => {
		navigator.clipboard.writeText(text).then(() => {})
	}, [text])

	if (!mounted) {
		return null
	}

	const voicesByLanguage = getVoicesByLanguage()
	const selectedVoiceObj = voices.find(v => v.name === selectedVoice)

	return (
		<WidgetSEOWrapper widget={widget}>
			<Card className='overflow-hidden p-0'>
				{/* Верхняя полоса: воспроизведение и что сделать с текстом. Кнопка
				    «играть» раньше была кругом 48×48 справа от поля ввода — она
				    кричала громче самого текста. */}
				<div className={toolBar}>
					<div className='flex items-center gap-0.5'>
						{!isPlaying ? (
							<Button
								size='icon'
								variant='ghost'
								onClick={speak}
								disabled={!text.trim()}
								title='Прочитать вслух'
								className={toolIconButton}
							>
								<Play className='h-4 w-4' />
							</Button>
						) : (
							<>
								<Button
									size='icon'
									variant='ghost'
									onClick={isPaused ? resume : pause}
									title={isPaused ? 'Продолжить' : 'Пауза'}
									className={toolIconButton}
								>
									{isPaused ? (
										<Play className='h-4 w-4' />
									) : (
										<Pause className='h-4 w-4' />
									)}
								</Button>
								<Button
									size='icon'
									variant='ghost'
									onClick={stop}
									title='Остановить'
									className={toolIconButton}
								>
									<Square className='h-4 w-4' />
								</Button>
							</>
						)}
					</div>

					<span className='text-sm text-muted-foreground'>
						{text.length} / 5000
					</span>

					<div className='flex items-center gap-0.5 sm:ml-auto'>
						<Button
							size='icon'
							variant='ghost'
							onClick={copyToClipboard}
							disabled={!text.trim()}
							title='Скопировать текст'
							className={toolIconButton}
						>
							<Copy className='h-4 w-4' />
						</Button>
						<Button
							size='icon'
							variant='ghost'
							onClick={exportText}
							disabled={!text.trim()}
							/* Иконка загрузки рядом с озвучкой читается как
							   «скачать аудио», а кнопка сохраняет .txt —
							   говорим об этом прямо в подсказке */
							title='Сохранить текст в файл .txt'
							className={toolIconButton}
						>
							<FileDown className='h-4 w-4' />
						</Button>
						<Button
							size='icon'
							variant='ghost'
							onClick={() => setText('')}
							disabled={!text}
							title='Очистить'
							className={toolIconButton}
						>
							<Trash2 className='h-4 w-4' />
						</Button>
					</div>
				</div>

				<Textarea
					id='text-input'
					ref={textareaRef}
					value={text}
					onChange={e => setText(e.target.value)}
					placeholder='Введите текст для озвучивания'
					maxLength={5000}
					aria-label='Текст для озвучивания'
					className='min-h-[10rem] resize-none rounded-none border-0 px-5 py-6 text-base leading-relaxed focus-visible:ring-0 sm:px-6'
				/>

				{/* Полоса голоса и его настроек. */}
				<div className={toolFooterBar}>
					<label className='flex items-center gap-2 text-sm text-muted-foreground'>
						<span>Голос</span>
						<ToolSelect
							value={selectedVoice}
							onChange={event => setSelectedVoice(event.target.value)}
							className='max-w-[16rem]'
						>
							{Object.entries(voicesByLanguage).map(([lang, langVoices]) => (
								<optgroup key={lang} label={lang.toUpperCase()}>
									{langVoices.map(voice => (
										<option key={voice.name} value={voice.name}>
											{voice.name} ({voice.lang})
											{voice.localService ? ' · локальный' : ''}
										</option>
									))}
								</optgroup>
							))}
						</ToolSelect>
					</label>

					{[
						{
							label: 'скорость',
							value: rate,
							onChange: setRate,
							min: 0.25,
							max: 3,
							step: 0.25,
							format: `${rate[0].toFixed(2)}x`
						},
						{
							label: 'тон',
							value: pitch,
							onChange: setPitch,
							min: 0.1,
							max: 2,
							step: 0.1,
							format: pitch[0].toFixed(1)
						},
						{
							label: 'громкость',
							value: volume,
							onChange: setVolume,
							min: 0,
							max: 1,
							step: 0.1,
							format: `${Math.round(volume[0] * 100)}%`
						}
					].map(control => (
						<label
							key={control.label}
							className='flex items-center gap-2 text-sm text-muted-foreground'
						>
							<span>{control.label}</span>
							<Slider
								value={control.value}
								onValueChange={control.onChange}
								min={control.min}
								max={control.max}
								step={control.step}
								className='w-24 cursor-pointer'
								aria-label={control.label}
							/>
							<span className='w-12 font-mono text-sm text-foreground tabular-nums'>
								{control.format}
							</span>
						</label>
					))}
				</div>

				{/* Быстрые примеры — короткие фразы, на которых слышно разницу
				    между голосами и скоростями. */}
				<div className={toolFooterBar}>
					<span className='mr-1 text-sm text-muted-foreground'>Примеры</span>
					{EXAMPLE_PHRASES.map(example => (
						<button
							key={example.label}
							type='button'
							onClick={() => setText(example.text)}
							title={example.text}
							className={toolPill(false)}
						>
							{example.label}
						</button>
					))}
				</div>
			</Card>

			{/* История — тихая полка под инструментом. */}
			{history.length > 0 && (
				<div className='mt-6'>
					<div className='flex items-center justify-between gap-3 px-1'>
						<p className='text-sm text-muted-foreground'>
							Что уже читали вслух
						</p>
						<Button
							size='icon'
							variant='ghost'
							onClick={clearHistory}
							title='Очистить историю'
							className={toolIconButton}
						>
							<Trash2 className='h-4 w-4' />
						</Button>
					</div>
					<div className='mt-2 divide-y rounded-xl border'>
						{history.slice(0, 5).map(item => (
							<div
								key={item.id}
								className='group flex items-start justify-between gap-3 px-4 py-3'
							>
								<button
									type='button'
									onClick={() => setText(item.text)}
									title='Вернуть текст в поле'
									className='min-w-0 flex-1 cursor-pointer text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-ring'
								>
									<span className='block truncate text-sm'>{item.text}</span>
									<span className='mt-0.5 block text-xs text-muted-foreground'>
										{new Date(item.timestamp).toLocaleDateString('ru-RU')} ·{' '}
										{item.voice} · {item.rate.toFixed(2)}x
									</span>
								</button>
								<Button
									size='icon'
									variant='ghost'
									onClick={() => deleteHistoryItem(item.id)}
									title='Удалить из истории'
									className={cn(
										toolIconButton,
										'h-7 w-7 opacity-0 group-hover:opacity-100 focus-visible:opacity-100'
									)}
								>
									<Trash2 className='h-3.5 w-3.5' />
								</Button>
							</div>
						))}
					</div>
				</div>
			)}

			<ToolScreenshot slug='text-to-speech' />
			<TextToSpeechSeo />
		</WidgetSEOWrapper>
	)
}
