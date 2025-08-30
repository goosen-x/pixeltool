'use client'

import { useTranslations } from 'next-intl'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Lightbulb } from 'lucide-react'
import type { Widget } from '@/lib/constants/widgets'

interface UseCaseCardProps {
	widget: Widget
}

export function UseCaseCard({ widget }: UseCaseCardProps) {
	const t = useTranslations('widgets')
	const tSidebar = useTranslations('widgets.rightSidebar')

	if (!widget.useCase) return null

	return (
		<Card>
			<CardHeader className='pb-3'>
				<CardTitle className='text-sm flex items-center gap-2'>
					<Lightbulb className='w-4 h-4' />
					{tSidebar('useCase.title')}
				</CardTitle>
			</CardHeader>
			<CardContent>
				<p className='text-sm text-muted-foreground'>
					{(() => {
						try {
							return t(`${widget.translationKey}.useCase`)
						} catch {
							return widget.useCase
						}
					})()}
				</p>
			</CardContent>
		</Card>
	)
}
