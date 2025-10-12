'use client'

import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { PRESET_SIZES } from '@/lib/utils/unit-converter'
import { Type, Ruler, Box } from 'lucide-react'

interface QuickPresetsProps {
	onSelect: (px: number) => void
	activeValue?: number
}

export function QuickPresets({ onSelect, activeValue }: QuickPresetsProps) {
	return (
		<div className='space-y-4'>
			<h3 className='text-sm font-semibold text-muted-foreground'>
				Быстрый доступ
			</h3>

			<Tabs defaultValue='typography' className='w-full'>
				<TabsList className='grid w-full grid-cols-3 mb-4'>
					<TabsTrigger value='typography' className='gap-2 text-xs'>
						<Type className='h-3 w-3' />
						Типографика
					</TabsTrigger>
					<TabsTrigger value='spacing' className='gap-2 text-xs'>
						<Ruler className='h-3 w-3' />
						Отступы
					</TabsTrigger>
					<TabsTrigger value='common' className='gap-2 text-xs'>
						<Box className='h-3 w-3' />
						Общие
					</TabsTrigger>
				</TabsList>

				<TabsContent value='typography' className='mt-0'>
					<div className='flex flex-wrap gap-2'>
						{PRESET_SIZES.typography.map(preset => (
							<Button
								key={preset.label}
								variant={activeValue === preset.px ? 'default' : 'outline'}
								size='sm'
								onClick={() => onSelect(preset.px)}
								className='font-mono text-xs'
							>
								{preset.label}
								<span className='ml-1 opacity-70'>({preset.px}px)</span>
							</Button>
						))}
					</div>
				</TabsContent>

				<TabsContent value='spacing' className='mt-0'>
					<div className='flex flex-wrap gap-2'>
						{PRESET_SIZES.spacing.map(preset => (
							<Button
								key={preset.label}
								variant={activeValue === preset.px ? 'default' : 'outline'}
								size='sm'
								onClick={() => onSelect(preset.px)}
								className='font-mono text-xs'
							>
								{preset.label}
								<span className='ml-1 opacity-70'>({preset.px}px)</span>
							</Button>
						))}
					</div>
				</TabsContent>

				<TabsContent value='common' className='mt-0'>
					<div className='flex flex-wrap gap-2'>
						{PRESET_SIZES.common.map(preset => (
							<Button
								key={preset.label}
								variant={activeValue === preset.px ? 'default' : 'outline'}
								size='sm'
								onClick={() => onSelect(preset.px)}
								className='font-mono text-xs'
							>
								{preset.label}
								<span className='ml-1 opacity-70'>({preset.px}px)</span>
							</Button>
						))}
					</div>
				</TabsContent>
			</Tabs>
		</div>
	)
}
