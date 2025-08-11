'use client'

import { useState, useEffect } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Slider } from '@/components/ui/slider'
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
	Settings,
	History,
	Bookmark,
	Trash2
} from 'lucide-react'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'

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
	timestamp: Date
}

interface BookmarkItem {
	id: string
	text: string
	name: string
	timestamp: Date
}

export default function TextToSpeechPage() {
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
	const [bookmarks, setBookmarks] = useState<BookmarkItem[]>([])
	const [currentUtterance, setCurrentUtterance] =
		useState<SpeechSynthesisUtterance | null>(null)
	const [showSettings, setShowSettings] = useState(false)
	const [showHistory, setShowHistory] = useState(false)
	const [showBookmarks, setShowBookmarks] = useState(false)

	useEffect(() => {
		setMounted(true)

		// Load voices
		const loadVoices = () => {
			const availableVoices = speechSynthesis.getVoices()
			const voiceList: Voice[] = availableVoices.map(voice => ({
				voice,
				name: voice.name,
				lang: voice.lang,
				localService: voice.localService
			}))
			setVoices(voiceList)

			// Set default voice (prefer local Russian voice if available)
			const russianVoice = voiceList.find(
				v => v.lang.startsWith('ru') && v.localService
			)
			const englishVoice = voiceList.find(
				v => v.lang.startsWith('en') && v.localService
			)
			const defaultVoice = russianVoice || englishVoice || voiceList[0]

			if (defaultVoice) {
				setSelectedVoice(defaultVoice.name)
			}
		}

		loadVoices()
		speechSynthesis.addEventListener('voiceschanged', loadVoices)

		// Load history and bookmarks
		const savedHistory = localStorage.getItem('ttsHistory')
		if (savedHistory) {
			const parsed = JSON.parse(savedHistory).map((item: any) => ({
				...item,
				timestamp: new Date(item.timestamp)
			}))
			setHistory(parsed)
		}

		const savedBookmarks = localStorage.getItem('ttsBookmarks')
		if (savedBookmarks) {
			const parsed = JSON.parse(savedBookmarks).map((item: any) => ({
				...item,
				timestamp: new Date(item.timestamp)
			}))
			setBookmarks(parsed)
		}

		return () => {
			speechSynthesis.removeEventListener('voiceschanged', loadVoices)
			if (currentUtterance) {
				speechSynthesis.cancel()
			}
		}
	}, [])

	const speak = () => {
		if (!text.trim()) {
			toast.error('Please enter some text to speak')
			return
		}

		if (isPaused) {
			speechSynthesis.resume()
			setIsPaused(false)
			setIsPlaying(true)
			return
		}

		// Stop current speech
		speechSynthesis.cancel()

		const utterance = new SpeechSynthesisUtterance(text)
		const voice = voices.find(v => v.name === selectedVoice)?.voice

		if (voice) {
			utterance.voice = voice
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
			toast.error('Speech synthesis failed')
		}

		setCurrentUtterance(utterance)
		speechSynthesis.speak(utterance)

		// Add to history
		const historyItem: HistoryItem = {
			id: crypto.randomUUID(),
			text: text.slice(0, 100) + (text.length > 100 ? '...' : ''),
			voice: selectedVoice,
			timestamp: new Date()
		}

		const newHistory = [historyItem, ...history].slice(0, 50)
		setHistory(newHistory)
		localStorage.setItem('ttsHistory', JSON.stringify(newHistory))
	}

	const pause = () => {
		speechSynthesis.pause()
		setIsPaused(true)
		setIsPlaying(false)
	}

	const stop = () => {
		speechSynthesis.cancel()
		setIsPlaying(false)
		setIsPaused(false)
		setCurrentUtterance(null)
	}

	const addBookmark = () => {
		if (!text.trim()) {
			toast.error('Please enter some text to bookmark')
			return
		}

		const name = prompt('Enter a name for this bookmark:')
		if (!name) return

		const bookmark: BookmarkItem = {
			id: crypto.randomUUID(),
			text,
			name,
			timestamp: new Date()
		}

		const newBookmarks = [bookmark, ...bookmarks].slice(0, 20)
		setBookmarks(newBookmarks)
		localStorage.setItem('ttsBookmarks', JSON.stringify(newBookmarks))
		toast.success('Bookmark added!')
	}

	const loadFromHistory = (historyText: string) => {
		setText(historyText)
		setShowHistory(false)
	}

	const loadFromBookmark = (bookmarkText: string) => {
		setText(bookmarkText)
		setShowBookmarks(false)
	}

	const clearHistory = () => {
		setHistory([])
		localStorage.removeItem('ttsHistory')
		toast.success('History cleared')
	}

	const deleteBookmark = (id: string) => {
		const newBookmarks = bookmarks.filter(b => b.id !== id)
		setBookmarks(newBookmarks)
		localStorage.setItem('ttsBookmarks', JSON.stringify(newBookmarks))
		toast.success('Bookmark deleted')
	}

	const getVoicesByLanguage = () => {
		const grouped: { [key: string]: Voice[] } = {}
		voices.forEach(voice => {
			const lang = voice.lang.split('-')[0]
			if (!grouped[lang]) {
				grouped[lang] = []
			}
			grouped[lang].push(voice)
		})
		return grouped
	}

	if (!mounted) {
		return (
			<div className='max-w-6xl mx-auto space-y-8'>
				<div>
					<h1 className='text-3xl font-bold tracking-tight mb-2'>
						Text to Speech
					</h1>
					<p className='text-muted-foreground'>
						Convert text to speech using browser synthesis API
					</p>
				</div>
				<div className='animate-pulse space-y-8'>
					<div className='h-96 bg-muted rounded-lg'></div>
				</div>
			</div>
		)
	}

	const voicesByLanguage = getVoicesByLanguage()
	const selectedVoiceObj = voices.find(v => v.name === selectedVoice)

	return (
		<div className='max-w-6xl mx-auto space-y-8'>
			{/* Main Input */}
			<Card className='p-6'>
				<div className='space-y-4'>
					<Label htmlFor='text-input'>Enter text to speak</Label>
					<Textarea
						id='text-input'
						value={text}
						onChange={e => setText(e.target.value)}
						placeholder='Type or paste your text here, then press ENTER or click Speak...'
						className='min-h-[120px]'
						onKeyPress={e => {
							if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
								speak()
							}
						}}
					/>

					<div className='flex items-center gap-2 flex-wrap'>
						<Button
							onClick={speak}
							disabled={isPlaying}
							className='flex items-center gap-2'
						>
							<Play className='w-4 h-4' />
							{isPaused ? 'Resume' : 'Speak'}
						</Button>

						<Button
							onClick={pause}
							disabled={!isPlaying}
							variant='outline'
							className='flex items-center gap-2'
						>
							<Pause className='w-4 h-4' />
							Pause
						</Button>

						<Button
							onClick={stop}
							disabled={!isPlaying && !isPaused}
							variant='outline'
							className='flex items-center gap-2'
						>
							<Square className='w-4 h-4' />
							Stop
						</Button>

						<Button
							onClick={addBookmark}
							variant='outline'
							size='icon'
							disabled={!text.trim()}
						>
							<Bookmark className='w-4 h-4' />
						</Button>

						<Button
							onClick={() => setShowSettings(!showSettings)}
							variant='outline'
							size='icon'
						>
							<Settings className='w-4 h-4' />
						</Button>

						<Button
							onClick={() => setShowHistory(!showHistory)}
							variant='outline'
							size='icon'
						>
							<History className='w-4 h-4' />
						</Button>
					</div>

					{selectedVoiceObj && (
						<div className='text-sm text-muted-foreground'>
							Current voice:{' '}
							<Badge variant='secondary'>{selectedVoiceObj.name}</Badge>
							<Badge variant='outline' className='ml-2'>
								{selectedVoiceObj.lang}
							</Badge>
							{selectedVoiceObj.localService && (
								<Badge variant='outline' className='ml-2'>
									Local
								</Badge>
							)}
						</div>
					)}
				</div>
			</Card>

			{/* Voice Settings */}
			{showSettings && (
				<Card className='p-6'>
					<h3 className='font-semibold mb-4 flex items-center gap-2'>
						<Settings className='w-4 h-4' />
						Voice Settings
					</h3>

					<div className='grid md:grid-cols-2 gap-6'>
						<div className='space-y-4'>
							<div>
								<Label htmlFor='voice-select'>Voice</Label>
								<Select value={selectedVoice} onValueChange={setSelectedVoice}>
									<SelectTrigger id='voice-select'>
										<SelectValue placeholder='Select a voice' />
									</SelectTrigger>
									<SelectContent className='max-h-[300px]'>
										{Object.entries(voicesByLanguage).map(
											([lang, langVoices]) => (
												<div key={lang}>
													<div className='px-2 py-1 text-sm font-medium text-muted-foreground'>
														{lang.toUpperCase()}
													</div>
													{langVoices.map(voice => (
														<SelectItem key={voice.name} value={voice.name}>
															<div className='flex items-center gap-2'>
																<span>{voice.name}</span>
																<Badge variant='outline' className='text-xs'>
																	{voice.lang}
																</Badge>
																{voice.localService && (
																	<Badge
																		variant='secondary'
																		className='text-xs'
																	>
																		Local
																	</Badge>
																)}
															</div>
														</SelectItem>
													))}
												</div>
											)
										)}
									</SelectContent>
								</Select>
							</div>

							<div>
								<Label>Speed: {rate[0].toFixed(1)}x</Label>
								<Slider
									value={rate}
									onValueChange={setRate}
									min={0.1}
									max={2.0}
									step={0.1}
									className='mt-2'
								/>
							</div>
						</div>

						<div className='space-y-4'>
							<div>
								<Label>Pitch: {pitch[0].toFixed(1)}</Label>
								<Slider
									value={pitch}
									onValueChange={setPitch}
									min={0.1}
									max={2.0}
									step={0.1}
									className='mt-2'
								/>
							</div>

							<div>
								<Label className='flex items-center gap-2'>
									<Volume2 className='w-4 h-4' />
									Volume: {Math.round(volume[0] * 100)}%
								</Label>
								<Slider
									value={volume}
									onValueChange={setVolume}
									min={0.1}
									max={1.0}
									step={0.1}
									className='mt-2'
								/>
							</div>
						</div>
					</div>
				</Card>
			)}

			{/* History */}
			{showHistory && history.length > 0 && (
				<Card className='p-6'>
					<div className='flex items-center justify-between mb-4'>
						<h3 className='font-semibold flex items-center gap-2'>
							<History className='w-4 h-4' />
							History
						</h3>
						<Button onClick={clearHistory} variant='outline' size='sm'>
							Clear All
						</Button>
					</div>

					<div className='space-y-2 max-h-[300px] overflow-y-auto'>
						{history.map(item => (
							<div
								key={item.id}
								className='flex items-start gap-3 p-3 rounded-lg border cursor-pointer hover:bg-accent'
								onClick={() => loadFromHistory(item.text)}
							>
								<div className='flex-1'>
									<p className='text-sm'>{item.text}</p>
									<div className='flex items-center gap-2 mt-1'>
										<Badge variant='outline' className='text-xs'>
											{item.voice}
										</Badge>
										<span className='text-xs text-muted-foreground'>
											{item.timestamp.toLocaleString()}
										</span>
									</div>
								</div>
							</div>
						))}
					</div>
				</Card>
			)}

			{/* Bookmarks */}
			{showBookmarks && bookmarks.length > 0 && (
				<Card className='p-6'>
					<h3 className='font-semibold mb-4 flex items-center gap-2'>
						<Bookmark className='w-4 h-4' />
						Bookmarks
					</h3>

					<div className='space-y-2 max-h-[300px] overflow-y-auto'>
						{bookmarks.map(bookmark => (
							<div
								key={bookmark.id}
								className='flex items-start gap-3 p-3 rounded-lg border'
							>
								<div
									className='flex-1 cursor-pointer hover:text-primary'
									onClick={() => loadFromBookmark(bookmark.text)}
								>
									<p className='font-medium text-sm'>{bookmark.name}</p>
									<p className='text-sm text-muted-foreground line-clamp-2'>
										{bookmark.text}
									</p>
									<span className='text-xs text-muted-foreground'>
										{bookmark.timestamp.toLocaleString()}
									</span>
								</div>
								<Button
									onClick={() => deleteBookmark(bookmark.id)}
									size='icon'
									variant='ghost'
									className='h-8 w-8'
								>
									<Trash2 className='w-3 h-3' />
								</Button>
							</div>
						))}
					</div>
				</Card>
			)}

			{/* Quick Examples */}
			<Card className='p-6'>
				<h3 className='font-semibold mb-3'>Quick Examples</h3>
				<div className='grid md:grid-cols-2 gap-3'>
					{[
						'Hello, how are you today?',
						'Привет, как дела?',
						'I love you',
						'Я тебя люблю',
						'What time is it?',
						'Сколько время?'
					].map(example => (
						<Button
							key={example}
							variant='outline'
							size='sm'
							onClick={() => setText(example)}
							className='text-left justify-start h-auto p-3'
						>
							{example}
						</Button>
					))}
				</div>
			</Card>

			{/* Info Section */}
			<Card className='p-6 bg-muted/50'>
				<h3 className='font-semibold mb-3'>About Text to Speech</h3>
				<div className='space-y-3 text-sm text-muted-foreground'>
					<p>
						Text-to-Speech (TTS) uses the browser&apos;s Speech Synthesis API to
						convert written text into spoken words. The available voices depend
						on your operating system and language settings.
					</p>

					<div className='grid md:grid-cols-2 gap-4 mt-4'>
						<div>
							<h4 className='font-medium text-foreground mb-2'>When to Use</h4>
							<ul className='space-y-1 text-xs'>
								<li>• Accessibility for visually impaired users</li>
								<li>• Language learning and pronunciation</li>
								<li>• Voice acting and content creation</li>
								<li>• When you have a sore throat</li>
								<li>• Creating voice assistants or bots</li>
							</ul>
						</div>

						<div>
							<h4 className='font-medium text-foreground mb-2'>
								Platform Support
							</h4>
							<ul className='space-y-1 text-xs'>
								<li>• Windows 7/10+ (built-in voices)</li>
								<li>• macOS/iOS (high-quality voices)</li>
								<li>• Android (Google voices)</li>
								<li>• Modern browsers (Chrome, Safari, Firefox)</li>
							</ul>
						</div>
					</div>

					<p className='text-xs mt-4'>
						<strong>Tip:</strong> Press Ctrl/Cmd + Enter while typing to speak
						the text quickly. Local voices provide better quality and work
						offline.
					</p>
				</div>
			</Card>
		</div>
	)
}
