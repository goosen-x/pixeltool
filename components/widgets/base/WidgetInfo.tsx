import { Card } from '@/components/ui/card'
import { ReactNode } from 'react'
import { Info, Lightbulb, AlertCircle } from 'lucide-react'

interface InfoSection {
	title: string
	content: string | string[] | ReactNode
	icon?: ReactNode
}

interface WidgetInfoProps {
	title?: string
	sections?: InfoSection[]
	howToUse?: string[]
	features?: string[]
	tips?: string[]
	warnings?: string[]
	customContent?: ReactNode
}

export function WidgetInfo({
	title = 'About This Tool',
	sections,
	howToUse,
	features,
	tips,
	warnings,
	customContent
}: WidgetInfoProps) {
	// Default sections if none provided
	const defaultSections: InfoSection[] = []

	if (howToUse && howToUse.length > 0) {
		defaultSections.push({
			title: 'How to Use',
			content: howToUse,
			icon: <Info className='w-4 h-4' />
		})
	}

	if (features && features.length > 0) {
		defaultSections.push({
			title: 'Features',
			content: features,
			icon: <Lightbulb className='w-4 h-4' />
		})
	}

	const displaySections = sections || defaultSections

	return (
		<Card className='p-6 bg-muted/50'>
			<h3 className='font-semibold mb-4 text-lg'>{title}</h3>

			{displaySections.length > 0 && (
				<div className='grid md:grid-cols-2 gap-6'>
					{displaySections.map((section, index) => (
						<div key={index}>
							<h4 className='font-medium text-foreground mb-3 flex items-center gap-2'>
								{section.icon}
								{section.title}
							</h4>
							{Array.isArray(section.content) ? (
								<ul className='space-y-1 text-sm text-muted-foreground'>
									{section.content.map((item, i) => (
										<li key={i} className='flex items-start'>
											<span className='mr-2'>•</span>
											<span>{item}</span>
										</li>
									))}
								</ul>
							) : typeof section.content === 'string' ? (
								<p className='text-sm text-muted-foreground'>
									{section.content}
								</p>
							) : (
								section.content
							)}
						</div>
					))}
				</div>
			)}

			{tips && tips.length > 0 && (
				<div className='mt-6 p-4 bg-primary/5 rounded-lg border border-primary/20'>
					<h4 className='font-medium text-foreground mb-2 flex items-center gap-2'>
						<Lightbulb className='w-4 h-4 text-primary' />
						Pro Tips
					</h4>
					<ul className='space-y-1 text-sm text-muted-foreground'>
						{tips.map((tip, index) => (
							<li key={index} className='flex items-start'>
								<span className='mr-2 text-primary'>💡</span>
								<span>{tip}</span>
							</li>
						))}
					</ul>
				</div>
			)}

			{warnings && warnings.length > 0 && (
				<div className='mt-6 p-4 bg-destructive/5 rounded-lg border border-destructive/20'>
					<h4 className='font-medium text-foreground mb-2 flex items-center gap-2'>
						<AlertCircle className='w-4 h-4 text-destructive' />
						Important Notes
					</h4>
					<ul className='space-y-1 text-sm text-muted-foreground'>
						{warnings.map((warning, index) => (
							<li key={index} className='flex items-start'>
								<span className='mr-2 text-destructive'>⚠️</span>
								<span>{warning}</span>
							</li>
						))}
					</ul>
				</div>
			)}

			{customContent && <div className='mt-6'>{customContent}</div>}
		</Card>
	)
}
