'use client'

import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Slider } from '@/components/ui/slider'
import { Input } from '@/components/ui/input'
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue
} from '@/components/ui/select'
import {
	Play,
	Pause,
	Square,
	Volume2,
	VolumeX,
	Volume1,
	Settings,
	History,
	Trash2,
	Download,
	Copy,
	Upload,
	FastForward,
	AudioWaveform,
	Music,
	Sparkles,
	Clock,
	Mic
} from 'lucide-react'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'
import { useTranslations, useLocale } from 'next-intl'

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
	const t = useTranslations('widgets.textToSpeech')
	const locale = useLocale()
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
		toast.success(t('success.historyCleared'))
	}, [t])

	const getVolumeIcon = () => {
		if (volume[0] === 0) return VolumeX
		if (volume[0] < 0.5) return Volume1
		return Volume2
	}

	const speak = useCallback(() => {
		if (!text.trim()) {
			toast.error(t('errors.emptyText'))
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
			toast.error(t('errors.speechFailed'))
		}

		setCurrentUtterance(utterance)
		speechSynthesis.speak(utterance)

		// Add to history
		addToHistory(text, selectedVoice, rate[0], pitch[0])
	}, [text, voices, selectedVoice, rate, pitch, volume, t, addToHistory])

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
		toast.success(t('success.textExported'))
	}, [text, t])

	const copyToClipboard = useCallback(() => {
		navigator.clipboard.writeText(text).then(() => {
			toast.success(t('success.textCopied'))
		})
	}, [text, t])

	if (!mounted) {
		return null
	}

	const voicesByLanguage = getVoicesByLanguage()
	const selectedVoiceObj = voices.find(v => v.name === selectedVoice)

	return (
		<div className='max-w-6xl mx-auto space-y-8'>
			{/* Main Interface */}
			<Card className='overflow-hidden'>
				<CardContent className='p-6 space-y-6'>
					{/* Text Input Area with controls */}
					<div className='space-y-3'>
						<div className='flex items-center justify-between'>
							<Label htmlFor='text-input' className='text-base font-medium'>
								{t('enterText')}
							</Label>
							<div className='flex items-center gap-2'>
								<Badge variant='outline' className='text-xs'>
									{text.length} {t('characters')}
								</Badge>
							</div>
						</div>

						{/* Quick Examples */}
						<div className='flex flex-wrap gap-2'>
							{[
								{ key: 'examples.greeting', text: t('examples.greeting') },
								{
									key: 'examples.announcement',
									text: t('examples.announcement')
								},
								{ key: 'examples.story', text: t('examples.story') },
								{ key: 'examples.poem', text: t('examples.poem') }
							].map((example, index) => (
								<Button
									key={example.key}
									variant='outline'
									size='sm'
									onClick={() => setText(example.text)}
									className='text-xs h-7 px-2'
								>
									{example.text.slice(0, 30)}...
								</Button>
							))}
						</div>

						<div className='flex gap-3'>
							<div className='flex-1 relative'>
								<Textarea
									id='text-input'
									ref={textareaRef}
									value={text}
									onChange={e => setText(e.target.value)}
									placeholder={t('placeholder')}
									className='min-h-[120px] text-base leading-relaxed resize-none w-full pr-20'
									maxLength={5000}
								/>
								{/* Export and Copy buttons in corner */}
								<div className='absolute top-2 right-2 flex gap-1'>
									<Button
										onClick={copyToClipboard}
										variant='ghost'
										size='icon'
										disabled={!text.trim()}
										className='w-8 h-8'
										title={t('copy')}
									>
										<Copy className='w-4 h-4' />
									</Button>
									<Button
										onClick={exportText}
										variant='ghost'
										size='icon'
										disabled={!text.trim()}
										className='w-8 h-8'
										title={t('export')}
									>
										<Download className='w-4 h-4' />
									</Button>
								</div>
							</div>
							<div className='flex flex-col gap-2'>
								{/* Play/Pause/Stop buttons */}
								{!isPlaying ? (
									<Button
										onClick={speak}
										disabled={!text.trim()}
										className='w-12 h-12 rounded-full bg-primary hover:bg-primary/90 shadow-lg hover:shadow-xl transition-shadow flex items-center justify-center p-0'
										size='lg'
									>
										<Play className='w-5 h-5 text-white' fill='currentColor' />
									</Button>
								) : (
									<>
										{isPaused ? (
											<Button
												onClick={resume}
												className='w-12 h-12 rounded-full bg-primary hover:bg-primary/90 flex items-center justify-center p-0'
												size='lg'
											>
												<Play
													className='w-5 h-5 text-white'
													fill='currentColor'
												/>
											</Button>
										) : (
											<Button
												onClick={pause}
												className='w-12 h-12 rounded-full bg-primary hover:bg-primary/90 flex items-center justify-center p-0'
												size='lg'
											>
												<Pause
													className='w-5 h-5 text-white'
													fill='currentColor'
												/>
											</Button>
										)}
										<Button
											onClick={stop}
											variant='outline'
											size='icon'
											className='w-12 h-12'
										>
											<Square className='w-4 h-4' />
										</Button>
									</>
								)}
							</div>
						</div>
					</div>

					{/* All Settings in one row */}
					<div className='grid grid-cols-1 md:grid-cols-4 gap-4 p-4 bg-muted/50 rounded-lg'>
						{/* Voice Selection */}
						<div className='flex items-center gap-3'>
							<Mic className='w-4 h-4 text-muted-foreground flex-shrink-0' />
							<div className='flex-1 space-y-1'>
								<Label className='text-xs'>{t('voice')}</Label>
								<Select value={selectedVoice} onValueChange={setSelectedVoice}>
									<SelectTrigger className='h-8 text-xs'>
										<SelectValue placeholder={t('selectVoice')} />
									</SelectTrigger>
									<SelectContent className='max-h-[300px]'>
										{Object.entries(voicesByLanguage).map(
											([lang, langVoices]) => (
												<div key={lang}>
													<div className='px-3 py-2 text-xs font-semibold text-primary border-b'>
														{lang.toUpperCase()}
													</div>
													{langVoices.map(voice => (
														<SelectItem key={voice.name} value={voice.name}>
															<div className='flex items-center justify-between w-full'>
																<span className='text-xs'>
																	{voice.name.split(' ')[0]}
																</span>
																<div className='flex items-center gap-1'>
																	<Badge
																		variant='outline'
																		className='text-[10px] h-4 px-1'
																	>
																		{voice.lang}
																	</Badge>
																	{voice.localService && (
																		<Badge
																			variant='secondary'
																			className='text-[10px] h-4 px-1 bg-green-50 text-green-700'
																		>
																			{t('local')}
																		</Badge>
																	)}
																</div>
															</div>
														</SelectItem>
													))}
												</div>
											)
										)}
									</SelectContent>
								</Select>
							</div>
						</div>

						{/* Speed */}
						<div className='flex items-center gap-3'>
							<FastForward className='w-4 h-4 text-muted-foreground flex-shrink-0' />
							<div className='flex-1 space-y-1'>
								<div className='flex items-center justify-between'>
									<Label className='text-xs'>{t('speed')}</Label>
									<span className='text-xs font-mono text-muted-foreground'>
										{rate[0].toFixed(1)}x
									</span>
								</div>
								<Slider
									value={rate}
									onValueChange={setRate}
									min={0.25}
									max={3.0}
									step={0.25}
									className='h-1'
								/>
							</div>
						</div>

						{/* Pitch */}
						<div className='flex items-center gap-3'>
							<AudioWaveform className='w-4 h-4 text-muted-foreground flex-shrink-0' />
							<div className='flex-1 space-y-1'>
								<div className='flex items-center justify-between'>
									<Label className='text-xs'>{t('pitch')}</Label>
									<span className='text-xs font-mono text-muted-foreground'>
										{pitch[0].toFixed(1)}
									</span>
								</div>
								<Slider
									value={pitch}
									onValueChange={setPitch}
									min={0.1}
									max={2.0}
									step={0.1}
									className='h-1'
								/>
							</div>
						</div>

						{/* Volume */}
						<div className='flex items-center gap-3'>
							{(() => {
								const IconComponent = getVolumeIcon()
								return (
									<IconComponent className='w-4 h-4 text-muted-foreground flex-shrink-0' />
								)
							})()}
							<div className='flex-1 space-y-1'>
								<div className='flex items-center justify-between'>
									<Label className='text-xs'>{t('volume')}</Label>
									<span className='text-xs font-mono text-muted-foreground'>
										{Math.round(volume[0] * 100)}%
									</span>
								</div>
								<Slider
									value={volume}
									onValueChange={setVolume}
									min={0}
									max={1.0}
									step={0.1}
									className='h-1'
								/>
							</div>
						</div>
					</div>
				</CardContent>
			</Card>

			{/* History at the bottom */}
			{history.length > 0 && (
				<Card>
					<CardHeader>
						<div className='flex items-center justify-between'>
							<CardTitle className='flex items-center gap-2'>
								<History className='w-5 h-5' />
								{t('history')}
							</CardTitle>
							<Button onClick={clearHistory} variant='outline' size='sm'>
								{t('clearAll')}
							</Button>
						</div>
					</CardHeader>
					<CardContent>
						<div className='grid gap-3 max-h-[300px] overflow-y-auto'>
							{history.slice(0, 5).map((item, index) => (
								<div
									key={item.id}
									className='p-3 border rounded-lg hover:bg-muted/50 transition-colors group'
								>
									<div className='flex items-start justify-between gap-3'>
										<div className='flex-1 min-w-0'>
											<p className='text-sm mb-2 break-words'>
												{item.text.slice(0, 100)}...
											</p>
											<div className='flex items-center gap-3 text-xs text-muted-foreground'>
												<span>
													{new Date(item.timestamp).toLocaleDateString()}
												</span>
												<span>{item.voice}</span>
												<span>{item.rate.toFixed(1)}x</span>
											</div>
										</div>
										<div className='flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity'>
											<Button
												onClick={() => setText(item.text)}
												size='sm'
												variant='ghost'
												className='h-7 w-7 p-0'
											>
												<Copy className='w-3 h-3' />
											</Button>
											<Button
												onClick={() => deleteHistoryItem(item.id)}
												size='sm'
												variant='ghost'
												className='h-7 w-7 p-0 text-destructive'
											>
												<Trash2 className='w-3 h-3' />
											</Button>
										</div>
									</div>
								</div>
							))}
						</div>
					</CardContent>
				</Card>
			)}
		</div>
	)
}
