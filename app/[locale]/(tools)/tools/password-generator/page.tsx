'use client'

import { useState, useEffect, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { Slider } from '@/components/ui/slider'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { Progress } from '@/components/ui/progress'
import { Input } from '@/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { 
	Copy, 
	RefreshCw, 
	Shield, 
	AlertTriangle,
	Check,
	X,
	Eye,
	EyeOff,
	History,
	Download,
	Zap,
	Keyboard,
	Lock,
	Settings,
	Trash2
} from 'lucide-react'
import { toast } from 'sonner'
import { useTranslations } from 'next-intl'
import { KeyboardShortcuts } from '@/components/tools/KeyboardShortcuts'
import { WidgetLayout } from '@/components/widgets/WidgetLayout'
import { WidgetSection } from '@/components/widgets/WidgetSection'
import { WidgetInput } from '@/components/widgets/WidgetInput'
import { WidgetOutput } from '@/components/widgets/WidgetOutput'

interface PasswordOptions {
	length: number
	uppercase: boolean
	lowercase: boolean
	numbers: boolean
	symbols: boolean
	excludeSimilar: boolean
	excludeAmbiguous: boolean
}

interface PasswordHistory {
	password: string
	strength: number
	timestamp: Date
}

const DEFAULT_OPTIONS: PasswordOptions = {
	length: 16,
	uppercase: true,
	lowercase: true,
	numbers: true,
	symbols: true,
	excludeSimilar: false,
	excludeAmbiguous: false
}

export default function PasswordGeneratorPage() {
	const t = useTranslations('widgets.passwordGenerator')
	const [password, setPassword] = useState('')
	const [options, setOptions] = useState<PasswordOptions>(DEFAULT_OPTIONS)
	const [strength, setStrength] = useState(0)
	const [showPassword, setShowPassword] = useState(true)
	const [history, setHistory] = useState<PasswordHistory[]>([])
	const [customWords, setCustomWords] = useState('')
	const [activeTab, setActiveTab] = useState('random')

	// Character sets
	const LOWERCASE = 'abcdefghijklmnopqrstuvwxyz'
	const UPPERCASE = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
	const NUMBERS = '0123456789'
	const SYMBOLS = '!@#$%^&*()_+-=[]{}|;:,.<>?'
	const SIMILAR = 'il1Lo0O'
	const AMBIGUOUS = '{}[]()/\\\'"`~,;.<>'

	// Load history from localStorage
	useEffect(() => {
		const savedHistory = localStorage.getItem('password-history')
		if (savedHistory) {
			const parsed = JSON.parse(savedHistory)
			setHistory(parsed.map((item: any) => ({
				...item,
				timestamp: new Date(item.timestamp)
			})))
		}
	}, [])

	const calculateStrength = useCallback((pass: string): number => {
		if (!pass) return 0
		
		let score = 0
		
		// Length score
		if (pass.length >= 8) score += 20
		if (pass.length >= 12) score += 20
		if (pass.length >= 16) score += 20
		
		// Character diversity
		if (/[a-z]/.test(pass)) score += 10
		if (/[A-Z]/.test(pass)) score += 10
		if (/[0-9]/.test(pass)) score += 10
		if (/[^A-Za-z0-9]/.test(pass)) score += 10
		
		// No repeated characters
		if (!/(.)\1{2,}/.test(pass)) score += 10
		
		// No common patterns
		const commonPatterns = ['123', 'abc', 'password', 'qwerty', '111']
		const hasCommonPattern = commonPatterns.some(pattern => 
			pass.toLowerCase().includes(pattern)
		)
		if (!hasCommonPattern) score += 10
		
		return Math.min(score, 100)
	}, [])

	const generatePassword = useCallback(() => {
		let charset = ''
		
		if (options.lowercase) charset += LOWERCASE
		if (options.uppercase) charset += UPPERCASE
		if (options.numbers) charset += NUMBERS
		if (options.symbols) charset += SYMBOLS
		
		if (!charset) {
			toast.error(t('errors.noCharset'))
			return
		}
		
		// Remove excluded characters
		if (options.excludeSimilar) {
			charset = charset.split('').filter(char => !SIMILAR.includes(char)).join('')
		}
		if (options.excludeAmbiguous) {
			charset = charset.split('').filter(char => !AMBIGUOUS.includes(char)).join('')
		}
		
		// Generate password
		let newPassword = ''
		const array = new Uint32Array(options.length)
		crypto.getRandomValues(array)
		
		for (let i = 0; i < options.length; i++) {
			newPassword += charset[array[i] % charset.length]
		}
		
		// Ensure at least one character from each selected type
		const ensureTypes = []
		if (options.lowercase) ensureTypes.push(LOWERCASE)
		if (options.uppercase) ensureTypes.push(UPPERCASE)
		if (options.numbers) ensureTypes.push(NUMBERS)
		if (options.symbols) ensureTypes.push(SYMBOLS)
		
		if (ensureTypes.length > 1 && options.length >= ensureTypes.length) {
			const positions = new Set<number>()
			while (positions.size < ensureTypes.length) {
				positions.add(Math.floor(Math.random() * options.length))
			}
			
			const posArray = Array.from(positions)
			ensureTypes.forEach((type, index) => {
				const pos = posArray[index]
				const char = type[Math.floor(Math.random() * type.length)]
				newPassword = newPassword.substring(0, pos) + char + newPassword.substring(pos + 1)
			})
		}
		
		setPassword(newPassword)
		const newStrength = calculateStrength(newPassword)
		setStrength(newStrength)
		
		// Add to history
		const historyItem: PasswordHistory = {
			password: newPassword,
			strength: newStrength,
			timestamp: new Date()
		}
		
		const newHistory = [historyItem, ...history].slice(0, 50)
		setHistory(newHistory)
		localStorage.setItem('password-history', JSON.stringify(newHistory))
		
		toast.success(t('toast.generated'))
	}, [options, history, calculateStrength, t])

	const generatePassphrase = () => {
		const words = customWords.trim().split(/\s+/).filter(w => w.length > 0)
		
		if (words.length < 4) {
			toast.error(t('errors.notEnoughWords'))
			return
		}
		
		// Shuffle words
		const shuffled = [...words].sort(() => Math.random() - 0.5)
		const selectedWords = shuffled.slice(0, Math.min(6, shuffled.length))
		
		// Add random numbers and symbols
		const separator = options.symbols ? '-' : ''
		const number = options.numbers ? Math.floor(Math.random() * 100) : ''
		
		let passphrase = selectedWords.join(separator)
		if (options.uppercase) {
			passphrase = selectedWords.map(w => 
				w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()
			).join(separator)
		}
		if (number) passphrase += separator + number
		
		setPassword(passphrase)
		const newStrength = calculateStrength(passphrase)
		setStrength(newStrength)
		
		// Add to history
		const historyItem: PasswordHistory = {
			password: passphrase,
			strength: newStrength,
			timestamp: new Date()
		}
		
		const newHistory = [historyItem, ...history].slice(0, 50)
		setHistory(newHistory)
		localStorage.setItem('password-history', JSON.stringify(newHistory))
		
		toast.success(t('toast.passphraseGenerated'))
	}

	const copyToClipboard = async () => {
		if (!password) return
		
		try {
			await navigator.clipboard.writeText(password)
			toast.success(t('toast.copied'))
		} catch (err) {
			toast.error(t('toast.copyError'))
		}
	}

	const clearHistory = () => {
		setHistory([])
		localStorage.removeItem('password-history')
		toast.success(t('toast.historyCleared'))
	}

	const downloadPasswords = () => {
		const content = history.map(item => 
			`${item.password}\t${item.strength}%\t${item.timestamp.toLocaleString()}`
		).join('\n')
		
		const blob = new Blob([content], { type: 'text/plain' })
		const url = URL.createObjectURL(blob)
		const a = document.createElement('a')
		a.href = url
		a.download = `passwords-${Date.now()}.txt`
		a.click()
		URL.revokeObjectURL(url)
		
		toast.success(t('toast.downloaded'))
	}

	const getStrengthColor = (score: number) => {
		if (score >= 80) return 'text-green-600 dark:text-green-400'
		if (score >= 60) return 'text-yellow-600 dark:text-yellow-400'
		if (score >= 40) return 'text-orange-600 dark:text-orange-400'
		return 'text-red-600 dark:text-red-400'
	}

	const getStrengthLabel = (score: number) => {
		if (score >= 80) return t('strength.veryStrong')
		if (score >= 60) return t('strength.strong')
		if (score >= 40) return t('strength.medium')
		if (score >= 20) return t('strength.weak')
		return t('strength.veryWeak')
	}

	// Generate initial password
	useEffect(() => {
		generatePassword()
	}, []) // Only on mount

	// Update strength when password changes
	useEffect(() => {
		setStrength(calculateStrength(password))
	}, [password, calculateStrength])

	// Keyboard shortcuts
	const shortcuts = [
		{
			key: 'c',
			meta: true,
			action: copyToClipboard,
			description: t('copy')
		},
		{
			key: 'r',
			meta: true,
			action: () => activeTab === 'random' ? generatePassword() : generatePassphrase(),
			description: t('generate')
		},
		{
			key: 'k',
			meta: true,
			action: () => {
				setPassword('')
				setCustomWords('')
			},
			description: 'Clear'
		}
	]

	return (
		<WidgetLayout>
			<KeyboardShortcuts shortcuts={shortcuts} />
			
			{/* Main Password Display */}
			<WidgetOutput
				gradientFrom="from-primary/20"
				gradientTo="to-accent/20"
			>
					<div className="space-y-6">
						<div className="relative">
							<Input
								value={password}
								onChange={(e) => setPassword(e.target.value)}
								type={showPassword ? 'text' : 'password'}
								className="pr-28 pl-4 font-mono text-xl h-14 rounded-2xl bg-background/80 border-border/50 focus:bg-background transition-all duration-300"
								placeholder={t('placeholder')}
							/>
							<div className="absolute right-3 top-1/2 -translate-y-1/2 flex gap-2">
								<Button
									size="icon"
									variant="ghost"
									onClick={() => setShowPassword(!showPassword)}
									className="h-9 w-9"
								>
									{showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
								</Button>
								<Button
									size="icon"
									variant="ghost"
									onClick={copyToClipboard}
									disabled={!password}
									className="h-9 w-9 hover:bg-primary hover:text-primary-foreground transition-colors"
								>
									<Copy className="w-4 h-4" />
								</Button>
							</div>
						</div>

						{/* Strength Indicator */}
						<div className="space-y-2">
							<div className="flex items-center justify-between text-sm">
								<span className="text-muted-foreground">{t('strength.label')}</span>
								<span className={`font-medium ${getStrengthColor(strength)}`}>
									{getStrengthLabel(strength)} ({strength}%)
								</span>
							</div>
							<Progress 
								value={strength} 
								className="h-2"
							/>
						</div>

						{/* Quick Actions */}
						<div className="flex gap-3">
							<Button 
								onClick={() => activeTab === 'random' ? generatePassword() : generatePassphrase()}
								size="lg"
								className="flex-1 h-12 bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105"
							>
								<RefreshCw className="w-5 h-5 mr-2" />
								{t('generate')}
							</Button>
							<Button
								variant="outline"
								size="lg"
								onClick={copyToClipboard}
								disabled={!password}
								className="h-12 bg-background/80 hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all duration-300"
							>
								<Copy className="w-5 h-5 mr-2" />
								{t('copy')}
							</Button>
						</div>
					</div>
			</WidgetOutput>

			<Tabs value={activeTab} onValueChange={setActiveTab} className="max-w-4xl mx-auto">
				<TabsList className="grid w-full grid-cols-3 h-12 bg-muted/50 backdrop-blur-sm">
					<TabsTrigger value="random">
						<Shield className="w-4 h-4 mr-2" />
						{t('tabs.random')}
					</TabsTrigger>
					<TabsTrigger value="passphrase">
						<Zap className="w-4 h-4 mr-2" />
						{t('tabs.passphrase')}
					</TabsTrigger>
					<TabsTrigger value="history">
						<History className="w-4 h-4 mr-2" />
						{t('tabs.history')}
					</TabsTrigger>
				</TabsList>

				<TabsContent value="random" className="mt-6 space-y-6">
					<div className="grid gap-6 lg:grid-cols-2">
						{/* Options */}
						<WidgetSection
							icon={<Settings className="h-5 w-5" />}
							title={t('options.title')}
							description={t('options.description')}
						>
							<div className="space-y-6">
								{/* Length */}
								<WidgetInput
									label={t('options.length')}
									description={t('options.lengthDescription')}
								>
									<div className="space-y-2">
										<div className="flex items-center justify-between mb-2">
											<span className="text-sm text-muted-foreground">4</span>
											<span className="text-lg font-semibold">{options.length}</span>
											<span className="text-sm text-muted-foreground">64</span>
										</div>
										<Slider
											value={[options.length]}
											onValueChange={([value]) => setOptions({ ...options, length: value })}
											min={4}
											max={64}
											step={1}
										/>
									</div>
								</WidgetInput>

								{/* Character Types */}
								<WidgetInput
									label={t('options.characterTypes')}
									description={t('options.characterTypesDescription')}
								>
									<div className="space-y-3">
										<div className="flex items-center justify-between">
											<Label htmlFor="uppercase" className="font-normal cursor-pointer">
												{t('options.uppercase')} (A-Z)
											</Label>
											<Switch
												id="uppercase"
												checked={options.uppercase}
												onCheckedChange={(checked) => setOptions({ ...options, uppercase: checked })}
											/>
										</div>
										<div className="flex items-center justify-between">
											<Label htmlFor="lowercase" className="font-normal cursor-pointer">
												{t('options.lowercase')} (a-z)
											</Label>
											<Switch
												id="lowercase"
												checked={options.lowercase}
												onCheckedChange={(checked) => setOptions({ ...options, lowercase: checked })}
											/>
										</div>
										<div className="flex items-center justify-between">
											<Label htmlFor="numbers" className="font-normal cursor-pointer">
												{t('options.numbers')} (0-9)
											</Label>
											<Switch
												id="numbers"
												checked={options.numbers}
												onCheckedChange={(checked) => setOptions({ ...options, numbers: checked })}
											/>
										</div>
										<div className="flex items-center justify-between">
											<Label htmlFor="symbols" className="font-normal cursor-pointer">
												{t('options.symbols')} (!@#$%...)
											</Label>
											<Switch
												id="symbols"
												checked={options.symbols}
												onCheckedChange={(checked) => setOptions({ ...options, symbols: checked })}
											/>
										</div>
									</div>
								</WidgetInput>

								{/* Exclusions */}
								<WidgetInput
									label={t('options.exclusions')}
									description={t('options.exclusionsDescription')}
								>
									<div className="space-y-3">
										<div className="flex items-center justify-between">
											<Label htmlFor="similar" className="font-normal cursor-pointer">
												{t('options.excludeSimilar')} (il1Lo0O)
											</Label>
											<Switch
												id="similar"
												checked={options.excludeSimilar}
												onCheckedChange={(checked) => setOptions({ ...options, excludeSimilar: checked })}
											/>
										</div>
										<div className="flex items-center justify-between">
											<Label htmlFor="ambiguous" className="font-normal cursor-pointer">
												{t('options.excludeAmbiguous')} ({}[]()...)
											</Label>
											<Switch
												id="ambiguous"
												checked={options.excludeAmbiguous}
												onCheckedChange={(checked) => setOptions({ ...options, excludeAmbiguous: checked })}
											/>
										</div>
									</div>
								</WidgetInput>
							</div>
						</WidgetSection>

						{/* Tips */}
						<WidgetSection
							icon={<AlertTriangle className="h-5 w-5" />}
							title={t('tips.title')}
							description={t('tips.description')}
						>
								<ul className="space-y-2 text-sm text-muted-foreground">
									<li className="flex items-start gap-2">
										<Check className="w-4 h-4 text-green-600 mt-0.5" />
										{t('tips.length')}
									</li>
									<li className="flex items-start gap-2">
										<Check className="w-4 h-4 text-green-600 mt-0.5" />
										{t('tips.unique')}
									</li>
									<li className="flex items-start gap-2">
										<Check className="w-4 h-4 text-green-600 mt-0.5" />
										{t('tips.manager')}
									</li>
									<li className="flex items-start gap-2">
										<X className="w-4 h-4 text-red-600 mt-0.5" />
										{t('tips.personal')}
									</li>
									<li className="flex items-start gap-2">
										<X className="w-4 h-4 text-red-600 mt-0.5" />
										{t('tips.reuse')}
									</li>
								</ul>
						</WidgetSection>
					</div>
				</TabsContent>

				<TabsContent value="passphrase" className="mt-6 space-y-6">
					<WidgetSection
						icon={<Zap className="h-5 w-5" />}
						title={t('passphrase.title')}
						description={t('passphrase.description')}
					>
						<div className="space-y-4">
							<div className="space-y-2">
								<Label>{t('passphrase.words')}</Label>
								<textarea
									className="w-full min-h-[80px] p-3 border rounded-md resize-none"
									placeholder={t('passphrase.placeholder')}
									value={customWords}
									onChange={(e) => setCustomWords(e.target.value)}
								/>
								<p className="text-xs text-muted-foreground">
									{t('passphrase.hint')}
								</p>
							</div>
							<Button onClick={generatePassphrase} className="w-full">
								<Zap className="w-4 h-4 mr-2" />
								{t('passphrase.generate')}
							</Button>
						</div>
					</WidgetSection>
				</TabsContent>

				<TabsContent value="history" className="mt-6 space-y-6">
					<WidgetSection
						icon={<History className="h-5 w-5" />}
						title={t('history.title')}
						description={t('history.description')}
					>
						<div className="space-y-4">
							<div className="flex items-center justify-between">
								<span className="text-sm text-muted-foreground">{t('history.count', { count: history.length })}</span>
								<div className="flex gap-2">
									{history.length > 0 && (
										<>
											<Button
												variant="outline"
												size="sm"
												onClick={downloadPasswords}
											>
												<Download className="w-4 h-4 mr-1" />
												{t('history.download')}
											</Button>
											<Button
												variant="outline"
												size="sm"
												onClick={clearHistory}
											>
												<RefreshCw className="w-4 h-4 mr-1" />
												{t('history.clear')}
											</Button>
										</>
									)}
								</div>
							</div>
							{history.length > 0 ? (
								<div className="space-y-2">
									{history.map((item, index) => (
										<div
											key={index}
											className="p-3 border rounded-lg space-y-2"
										>
											<div className="flex items-center justify-between">
												<code className="font-mono text-sm">
													{showPassword ? item.password : '••••••••••••'}
												</code>
												<div className="flex items-center gap-2">
													<span className={`text-xs font-medium ${getStrengthColor(item.strength)}`}>
														{item.strength}%
													</span>
													<Button
														size="icon"
														variant="ghost"
														className="h-8 w-8 hover:bg-accent hover:text-white"
														onClick={async () => {
															await navigator.clipboard.writeText(item.password)
															toast.success(t('toast.copied'))
														}}
													>
														<Copy className="w-3 h-3" />
													</Button>
												</div>
											</div>
											<div className="text-xs text-muted-foreground">
												{item.timestamp.toLocaleString()}
											</div>
										</div>
									))}
								</div>
							) : (
								<p className="text-center text-muted-foreground py-8">
									{t('history.empty')}
								</p>
							)}
						</div>
					</WidgetSection>
				</TabsContent>
			</Tabs>

		</WidgetLayout>
	)
}