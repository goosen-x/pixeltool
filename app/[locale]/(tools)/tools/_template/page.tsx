'use client'

// import { useTranslations } from 'next-intl'
import { useState, useCallback, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue
} from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { useWidgetCreation } from '@/lib/hooks/widgets/useWidgetCreation'
import {
	Sparkles, // Replace with your widget icon
	Copy,
	Download,
	RefreshCw,
	Info
} from 'lucide-react'
import { toast } from 'sonner'

// TODO: Update widget configuration
const WIDGET_CONFIG = {
	id: 'template-widget', // TODO: Update widget ID
	icon: Sparkles, // TODO: Update icon
	gradient: 'from-purple-500 to-pink-600' // TODO: Choose gradient
}

export default function TemplateWidgetPage() {
	// TODO: Update translation key
	// const t = useTranslations('widgets.templateWidget')

	// Initialize widget with creation hook
	const widget = useWidgetCreation({
		widgetId: WIDGET_CONFIG.id,
		enableKeyboard: true,
		enableAnalytics: true,
		enableFavorites: true,
		defaultState: {
			inputs: {
				mainInput: '',
				option: 'option1',
				enabled: false
			},
			custom: {
				activeTab: 'input'
			}
		},
		validationRules: {
			mainInput: value => {
				if (!value || value.trim().length === 0) {
					return 'Это поле обязательно'
				}
				// TODO: Add more validation rules
				return true
			}
		}
	})

	// Widget-specific state
	const [isProcessing, setIsProcessing] = useState(false)

	// Main widget logic
	const processInput = useCallback(async () => {
		// Validate inputs
		if (!widget.validateAllInputs()) {
			return
		}

		widget.setLoading(true)
		setIsProcessing(true)

		try {
			// TODO: Implement your widget logic here
			// Simulate processing
			await new Promise(resolve => setTimeout(resolve, 1000))

			const result = {
				output: `Processed: ${widget.inputs.mainInput}`,
				metadata: {
					option: widget.inputs.option,
					enabled: widget.inputs.enabled,
					timestamp: new Date().toISOString()
				}
			}

			widget.setResult(result)
			toast.success('Успешно обработано')
		} catch (error) {
			widget.setError('Произошла ошибка')
			toast.error('Произошла ошибка')
		} finally {
			widget.setLoading(false)
			setIsProcessing(false)
		}
	}, [widget])

	// Keyboard shortcuts
	useEffect(() => {
		const handleKeyPress = (e: KeyboardEvent) => {
			// Ctrl/Cmd + Enter to process
			if ((e.ctrlKey || e.metaKey) && e.key === 'Enter' && !widget.isLoading) {
				e.preventDefault()
				processInput()
			}
			// Escape to reset
			if (e.key === 'Escape' && !widget.isLoading) {
				e.preventDefault()
				widget.reset()
			}
			// Ctrl/Cmd + C to copy result
			if (
				(e.ctrlKey || e.metaKey) &&
				e.key === 'c' &&
				widget.result &&
				!window.getSelection()?.toString()
			) {
				e.preventDefault()
				handleCopyResult()
			}
		}

		window.addEventListener('keydown', handleKeyPress)
		return () => window.removeEventListener('keydown', handleKeyPress)
	}, [processInput, widget])

	// Copy result to clipboard
	const handleCopyResult = useCallback(() => {
		if (widget.result) {
			widget.copyToClipboard(
				JSON.stringify(widget.result, null, 2),
				'Скопировано в буфер обмена'
			)
		}
	}, [widget])

	// Download result as file
	const handleDownloadResult = useCallback(() => {
		if (widget.result) {
			widget.downloadAsFile(
				JSON.stringify(widget.result, null, 2),
				`result-${Date.now()}.json`,
				'application/json'
			)
		}
	}, [widget])

	return (
		<div className='space-y-6'>
			<Tabs
				value={widget.customState.activeTab}
				onValueChange={value => widget.updateCustomState('activeTab', value)}
				className='w-full'
			>
				<TabsList className='grid w-full grid-cols-2'>
					<TabsTrigger value='input'>Ввод</TabsTrigger>
					<TabsTrigger value='settings'>Настройки</TabsTrigger>
				</TabsList>

				<TabsContent value='input' className='space-y-4'>
					<Card className='p-4'>
						<div className='space-y-4'>
							{/* Main Input */}
							<div>
								<Label htmlFor='mainInput'>Основной ввод</Label>
								<Input
									id='mainInput'
									type='text'
									value={widget.inputs.mainInput}
									onChange={e =>
										widget.updateInput('mainInput', e.target.value)
									}
									placeholder='Введите текст для обработки'
									disabled={widget.isLoading}
									className='font-mono'
								/>
							</div>

							{/* Action Buttons */}
							<div className='flex gap-2'>
								<Button
									onClick={processInput}
									disabled={widget.isLoading || !widget.inputs.mainInput}
									className='flex-1'
								>
									{widget.isLoading ? (
										<RefreshCw className='w-4 h-4 mr-2 animate-spin' />
									) : (
										<Sparkles className='w-4 h-4 mr-2' />
									)}
									{widget.isLoading ? 'Обработка...' : 'Обработать'}
								</Button>

								<Button
									onClick={widget.reset}
									variant='outline'
									disabled={widget.isLoading}
								>
									<RefreshCw className='w-4 h-4 mr-2' />
									{'Сбросить'}
								</Button>
							</div>

							{/* Keyboard Shortcuts Info */}
							<div className='text-xs text-muted-foreground space-y-1'>
								<div className='flex items-center gap-2'>
									<kbd className='px-2 py-0.5 bg-muted rounded text-xs'>
										Ctrl + Enter
									</kbd>
									<span>Обработать</span>
								</div>
								<div className='flex items-center gap-2'>
									<kbd className='px-2 py-0.5 bg-muted rounded text-xs'>
										Esc
									</kbd>
									<span>Сбросить</span>
								</div>
							</div>
						</div>
					</Card>
				</TabsContent>

				<TabsContent value='settings' className='space-y-4'>
					<Card className='p-4'>
						<div className='space-y-4'>
							{/* Select Option */}
							<div>
								<Label htmlFor='option'>Опция</Label>
								<Select
									value={widget.inputs.option}
									onValueChange={value => widget.updateInput('option', value)}
								>
									<SelectTrigger id='option'>
										<SelectValue />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value='option1'>Опция 1</SelectItem>
										<SelectItem value='option2'>Опция 2</SelectItem>
										<SelectItem value='option3'>Опция 3</SelectItem>
									</SelectContent>
								</Select>
							</div>

							{/* Toggle Option */}
							<div className='flex items-center justify-between'>
								<Label htmlFor='enabled' className='flex-1'>
									<div>Включить функцию</div>
									<div className='text-xs text-muted-foreground font-normal'>
										Включает дополнительную обработку данных
									</div>
								</Label>
								<Switch
									id='enabled'
									checked={widget.inputs.enabled}
									onCheckedChange={checked =>
										widget.updateInput('enabled', checked)
									}
								/>
							</div>
						</div>
					</Card>
				</TabsContent>
			</Tabs>

			{/* Result Section */}
			{widget.result && (
				<Card className='p-4'>
					<div className='space-y-4'>
						<div className='flex items-center justify-between'>
							<div className='font-semibold'>Результат</div>
							<div className='flex gap-2'>
								<Button onClick={handleCopyResult} size='sm' variant='outline'>
									<Copy className='w-4 h-4 mr-2' />
									{'Копировать'}
								</Button>

								<Button
									onClick={handleDownloadResult}
									size='sm'
									variant='outline'
								>
									<Download className='w-4 h-4 mr-2' />
									{'Скачать'}
								</Button>
							</div>
						</div>

						{/* Result Display */}
						<div className='space-y-2'>
							<div className='font-mono text-sm bg-muted p-4 rounded-lg overflow-x-auto'>
								<pre>{JSON.stringify(widget.result, null, 2)}</pre>
							</div>

							{/* Result Metadata */}
							{widget.result.metadata && (
								<div className='text-sm text-muted-foreground'>
									<p>Option: {widget.result.metadata.option}</p>
									<p>
										Feature Enabled:{' '}
										{widget.result.metadata.enabled ? 'Yes' : 'No'}
									</p>
									<p>
										Generated:{' '}
										{new Date(
											widget.result.metadata.timestamp
										).toLocaleString()}
									</p>
								</div>
							)}
						</div>
					</div>
				</Card>
			)}

			{/* Error Display */}
			{widget.error && (
				<Card className='p-4 border-destructive bg-destructive/10'>
					<p className='text-destructive'>{widget.error}</p>
				</Card>
			)}

			{/* Information Card */}
			<Card className='p-4 bg-muted/50'>
				<div className='flex gap-3'>
					<Info className='w-5 h-5 text-muted-foreground shrink-0 mt-0.5' />
					<div className='space-y-2 text-sm text-muted-foreground'>
						<div className='font-semibold text-foreground'>
							Информация о виджете
						</div>
						<ul className='space-y-1'>
							<li>• Это шаблон для создания новых виджетов</li>
							<li>• Поддерживает горячие клавиши для быстрой работы</li>
							<li>• Включает валидацию и обработку ошибок</li>
						</ul>

						{/* Pro Tip */}
						<div className='mt-3 p-3 bg-background rounded-lg border'>
							<div className='font-semibold text-foreground mb-1'>
								Полезный совет
							</div>
							<p>
								Используйте горячие клавиши для ускорения работы. Ctrl+Enter для
								обработки, Esc для сброса.
							</p>
						</div>
					</div>
				</div>
			</Card>
		</div>
	)
}
