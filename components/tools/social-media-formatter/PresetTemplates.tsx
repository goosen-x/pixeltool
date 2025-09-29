'use client'

import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import {
	FileText,
	List,
	Quote,
	Megaphone,
	BookOpen,
	Star,
	Sparkles,
	Play
} from 'lucide-react'

export interface Template {
	id: string
	name: string
	description: string
	icon: React.ReactNode
	example: string
	category: 'content' | 'formatting' | 'social'
	tags: string[]
}

const templates: Template[] = [
	{
		id: 'poem',
		name: 'Poem',
		description: 'Perfect for poetry and lyrics',
		icon: <FileText className='w-5 h-5' />,
		example: `Roses are red,
     violets are blue,
Beautiful   formatting
     makes posts   shine through`,
		category: 'content',
		tags: ['poetry', 'creative', 'artistic']
	},
	{
		id: 'list',
		name: 'Indented List',
		description: 'For clear lists and enumerations',
		icon: <List className='w-5 h-5' />,
		example: `Top 5 Tips:
• First important tip
    → Sub-point here
    → Another detail
• Second tip to remember
    → With explanation
• Third essential point`,
		category: 'formatting',
		tags: ['lists', 'organized', 'tips']
	},
	{
		id: 'quote',
		name: 'Quote',
		description: 'Centered quotes and citations',
		icon: <Quote className='w-5 h-5' />,
		example: `     "Success is not final,
     failure is not fatal:
     it is the courage to continue
     that counts."

          — Winston Churchill`,
		category: 'content',
		tags: ['quotes', 'inspiration', 'wisdom']
	},
	{
		id: 'announcement',
		name: 'Announcement',
		description: 'For important announcements',
		icon: <Megaphone className='w-5 h-5' />,
		example: `🎯 IMPORTANT ANNOUNCEMENT

      We're excited to share
      some amazing news!

📅 Date: Coming Soon
💬 Details in comments
🔔 Turn on notifications`,
		category: 'social',
		tags: ['news', 'important', 'business']
	},
	{
		id: 'story',
		name: 'Story',
		description: 'Narrative content with flow',
		icon: <BookOpen className='w-5 h-5' />,
		example: `Chapter 1: The Beginning

Once upon a time,   in a digital world   far, far away...

     There lived a developer
     who discovered the magic
     of proper formatting.

And that's how this story begins! 📖✨`,
		category: 'content',
		tags: ['storytelling', 'narrative', 'creative']
	},
	{
		id: 'review',
		name: 'Review',
		description: 'Product or service reviews',
		icon: <Star className='w-5 h-5' />,
		example: `⭐⭐⭐⭐⭐ 5/5 Stars!

📱 Product: Amazing App
👤 Reviewer: Happy User

✅ Pros:
    • Easy to use
    • Great features
    • Excellent support

❌ Cons:
    • Could use dark mode

💭 Final thoughts:   Highly recommended!`,
		category: 'social',
		tags: ['reviews', 'feedback', 'rating']
	}
]

interface PresetTemplatesProps {
	onSelectTemplate: (template: Template) => void
	className?: string
}

export function PresetTemplates({
	onSelectTemplate,
	className
}: PresetTemplatesProps) {
	const getCategoryColor = (category: Template['category']) => {
		switch (category) {
			case 'content':
				return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
			case 'formatting':
				return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
			case 'social':
				return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200'
			default:
				return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
		}
	}

	return (
		<div className={cn('space-y-6', className)}>
			<div className='text-center space-y-2'>
				<div className='flex items-center justify-center gap-2'>
					<Sparkles className='w-5 h-5 text-primary' />
					<h2 className='text-xl font-bold'>Готовые шаблоны</h2>
					<Sparkles className='w-5 h-5 text-primary' />
				</div>
				<p className='text-muted-foreground text-sm'>
					Choose a template to get started quickly with professional formatting
				</p>
			</div>

			<div className='grid md:grid-cols-2 lg:grid-cols-3 gap-4'>
				{templates.map(template => (
					<Card
						key={template.id}
						className='cursor-pointer transition-all hover:shadow-lg hover:scale-105 group'
						onClick={() => onSelectTemplate(template)}
					>
						<CardHeader className='pb-3'>
							<div className='flex items-start justify-between'>
								<div className='flex items-center gap-2'>
									<div className='p-2 rounded-lg bg-primary/10 text-primary'>
										{template.icon}
									</div>
									<div>
										<CardTitle className='text-base group-hover:text-primary transition-colors'>
											{template.name}
										</CardTitle>
									</div>
								</div>
								<Badge
									variant='secondary'
									className={getCategoryColor(template.category)}
								>
									{template.category}
								</Badge>
							</div>
							<p className='text-sm text-muted-foreground'>
								{template.description}
							</p>
						</CardHeader>

						<CardContent className='pt-0'>
							{/* Preview */}
							<div className='mb-4'>
								<div className='text-xs text-muted-foreground mb-2 flex items-center gap-1'>
									<Play className='w-3 h-3' />
									Preview:
								</div>
								<div className='bg-muted/50 rounded-lg p-3 text-xs font-mono whitespace-pre-wrap border border-dashed border-muted-foreground/30 group-hover:border-primary/50 transition-colors'>
									{template.example}
								</div>
							</div>

							{/* Tags */}
							<div className='flex flex-wrap gap-1 mb-3'>
								{template.tags.map(tag => (
									<Badge
										key={tag}
										variant='outline'
										className='text-xs px-2 py-0'
									>
										#{tag}
									</Badge>
								))}
							</div>

							{/* Action Button */}
							<Button
								variant='outline'
								size='sm'
								className='w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors'
							>
								<Sparkles className='w-4 h-4 mr-2' />
								Use Template
							</Button>
						</CardContent>
					</Card>
				))}
			</div>

			{/* Custom Template Hint */}
			<Card className='bg-gradient-to-r from-primary/5 to-primary/10 border-primary/20'>
				<CardContent className='p-4'>
					<div className='flex items-center gap-3'>
						<div className='p-2 rounded-full bg-primary/20'>
							<Sparkles className='w-5 h-5 text-primary' />
						</div>
						<div className='flex-1'>
							<h3 className='font-semibold text-sm'>Need a custom template?</h3>
							<p className='text-xs text-muted-foreground'>
								Start with any template and modify it to match your style. Your
								changes will be preserved!
							</p>
						</div>
					</div>
				</CardContent>
			</Card>
		</div>
	)
}

export { templates }
