'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Slider } from '@/components/ui/slider'
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger
} from '@/components/ui/dialog'
import { Settings, RefreshCw } from 'lucide-react'
import type { ConverterConfig } from '@/lib/utils/unit-converter'

interface SettingsInlineProps {
	config: ConverterConfig
	onBaseChange: (size: number) => void
	onParentChange: (size: number) => void
	onViewportWidthChange: (width: number) => void
	onViewportHeightChange: (height: number) => void
	onReset: () => void
}

export function SettingsInline({
	config,
	onBaseChange,
	onParentChange,
	onViewportWidthChange,
	onViewportHeightChange,
	onReset
}: SettingsInlineProps) {
	const [open, setOpen] = useState(false)

	return (
		<div className='flex items-center justify-between gap-4 p-4 bg-muted/50 rounded-lg'>
			<Dialog open={open} onOpenChange={setOpen}>
				<DialogTrigger asChild>
					<Button variant='ghost' size='sm' className='gap-2'>
						<Settings className='h-4 w-4' />
						<span className='text-sm'>
							Base:{' '}
							<span className='font-mono font-semibold'>
								{config.baseFontSize}px
							</span>
						</span>
						{config.parentFontSize !== config.baseFontSize && (
							<span className='text-sm text-muted-foreground'>
								| Parent:{' '}
								<span className='font-mono font-semibold'>
									{config.parentFontSize}px
								</span>
							</span>
						)}
					</Button>
				</DialogTrigger>

				<DialogContent className='sm:max-w-[500px]'>
					<DialogHeader>
						<DialogTitle>Настройки конвертера</DialogTitle>
						<DialogDescription>
							Настройте базовые размеры для точных расчетов
						</DialogDescription>
					</DialogHeader>

					<div className='space-y-6 py-4'>
						{/* Base Font Size */}
						<div className='space-y-3'>
							<div className='flex items-center justify-between'>
								<Label htmlFor='base-font'>
									Базовый размер шрифта (для REM)
								</Label>
								<span className='text-sm font-mono font-semibold'>
									{config.baseFontSize}px
								</span>
							</div>
							<Slider
								id='base-font'
								value={[config.baseFontSize]}
								onValueChange={values => onBaseChange(values[0])}
								min={8}
								max={32}
								step={1}
								className='w-full'
							/>
							<p className='text-xs text-muted-foreground'>
								Обычно 16px (размер шрифта в HTML элементе)
							</p>
						</div>

						{/* Parent Font Size */}
						<div className='space-y-3'>
							<div className='flex items-center justify-between'>
								<Label htmlFor='parent-font'>
									Родительский размер (для EM)
								</Label>
								<span className='text-sm font-mono font-semibold'>
									{config.parentFontSize}px
								</span>
							</div>
							<Slider
								id='parent-font'
								value={[config.parentFontSize]}
								onValueChange={values => onParentChange(values[0])}
								min={8}
								max={48}
								step={1}
								className='w-full'
							/>
							<p className='text-xs text-muted-foreground'>
								Размер шрифта родительского элемента
							</p>
							<Button
								variant='outline'
								size='sm'
								onClick={() => onParentChange(config.baseFontSize)}
								className='w-full'
							>
								Сбросить на базовый ({config.baseFontSize}px)
							</Button>
						</div>

						{/* Viewport Dimensions */}
						<div className='space-y-3'>
							<Label>Размеры viewport (для VW/VH)</Label>
							<div className='grid grid-cols-2 gap-3'>
								<div className='space-y-2'>
									<Label htmlFor='viewport-width' className='text-xs'>
										Ширина (px)
									</Label>
									<Input
										id='viewport-width'
										type='number'
										value={config.viewportWidth}
										onChange={e =>
											onViewportWidthChange(parseInt(e.target.value) || 1440)
										}
										min={320}
										max={3840}
										className='font-mono'
									/>
								</div>
								<div className='space-y-2'>
									<Label htmlFor='viewport-height' className='text-xs'>
										Высота (px)
									</Label>
									<Input
										id='viewport-height'
										type='number'
										value={config.viewportHeight}
										onChange={e =>
											onViewportHeightChange(parseInt(e.target.value) || 900)
										}
										min={200}
										max={2160}
										className='font-mono'
									/>
								</div>
							</div>
							<div className='flex gap-2'>
								<Button
									variant='outline'
									size='sm'
									onClick={() => {
										onViewportWidthChange(375)
										onViewportHeightChange(667)
									}}
									className='flex-1 text-xs'
								>
									Mobile
								</Button>
								<Button
									variant='outline'
									size='sm'
									onClick={() => {
										onViewportWidthChange(768)
										onViewportHeightChange(1024)
									}}
									className='flex-1 text-xs'
								>
									Tablet
								</Button>
								<Button
									variant='outline'
									size='sm'
									onClick={() => {
										onViewportWidthChange(1440)
										onViewportHeightChange(900)
									}}
									className='flex-1 text-xs'
								>
									Desktop
								</Button>
							</div>
						</div>

						{/* Reset Button */}
						<Button
							variant='outline'
							onClick={onReset}
							className='w-full gap-2'
						>
							<RefreshCw className='h-4 w-4' />
							Сбросить все настройки
						</Button>
					</div>
				</DialogContent>
			</Dialog>

			<span className='text-xs text-muted-foreground'>
				Click to customize base sizes
			</span>
		</div>
	)
}
