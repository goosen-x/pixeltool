'use client'

import { useState } from 'react'
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle
} from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue
} from '@/components/ui/select'
import { Copy, Download, FileText, Sparkles } from 'lucide-react'
import { toast } from 'sonner'

export default function SEOMarkdownGeneratorPage() {

	const [formData, setFormData] = useState({
		title: '',
		excerpt: '',
		keywords: '',
		author: '',
		category: '',
		contentType: 'tutorial',
		includeTableOfContents: true,
		includeFAQ: true,
		includeRelatedLinks: true,
		contentOutline: ''
	})

	const [generatedMarkdown, setGeneratedMarkdown] = useState('')

	const contentTypes = {
		tutorial: {
			template: 'Tutorial/Guide',
			structure: 'Introduction → Steps → Examples → Conclusion'
		},
		comparison: {
			template: 'Comparison',
			structure: 'Overview → Feature comparison → Pros/Cons → Recommendation'
		},
		listicle: {
			template: 'List Article',
			structure: 'Introduction → Numbered items → Summary'
		},
		howto: {
			template: 'How-To',
			structure: 'Problem → Solution steps → Tips → Results'
		},
		review: {
			template: 'Review',
			structure: 'Overview → Features → Performance → Verdict'
		}
	}

	const generateMarkdown = () => {
		const date = new Date().toISOString()
		const slug = formData.title
			.toLowerCase()
			.replace(/\s+/g, '-')
			.replace(/[^\w-]/g, '')

		let markdown = `---
title: "${formData.title}"
excerpt: "${formData.excerpt}"
coverImage: "/assets/blog/${slug}/cover.jpg"
date: "${date}"
author:
  name: ${formData.author || 'Author Name'}
  picture: "/assets/blog/authors/avatar.jpeg"
ogImage:
  url: "/assets/blog/${slug}/cover.jpg"
categories: ["${formData.category}"]
keywords: [${formData.keywords
			.split(',')
			.map(k => `"${k.trim()}"`)
			.join(', ')}]
liveCodeExample: ${formData.contentType === 'tutorial' ? 'true' : 'false'}
---

`

		// Add introduction
		markdown += `${formData.excerpt}\n\n`

		// Add table of contents if enabled
		if (formData.includeTableOfContents) {
			markdown += `## Table of Contents\n\n`
			const sections = formData.contentOutline.split('\n').filter(s => s.trim())
			sections.forEach((section, index) => {
				markdown += `${index + 1}. [${section}](#${section.toLowerCase().replace(/\s+/g, '-')})\n`
			})
			markdown += '\n'
		}

		// Generate content based on type and outline
		const sections = formData.contentOutline.split('\n').filter(s => s.trim())

		sections.forEach(section => {
			markdown += `## ${section}\n\n`

			// Add placeholder content based on content type
			switch (formData.contentType) {
				case 'tutorial':
					markdown += `Here you'll learn about ${section.toLowerCase()}. This section covers the essential concepts and provides practical examples.\n\n`
					markdown += `\`\`\`javascript\n// Example code for ${section}\nconst example = () => {\n  // Your code here\n}\n\`\`\`\n\n`
					break
				case 'comparison':
					markdown += `### ${section} Overview\n\n`
					markdown += `| Feature | Option A | Option B |\n|---------|----------|----------|\n`
					markdown += `| Performance | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ |\n`
					markdown += `| Ease of Use | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ |\n`
					markdown += `| Price | $$$ | $$ |\n\n`
					break
				case 'listicle':
					markdown += `**Key Point**: Important information about ${section.toLowerCase()}.\n\n`
					markdown += `- Benefit 1\n- Benefit 2\n- Benefit 3\n\n`
					break
				case 'howto':
					markdown += `### Step-by-step process:\n\n`
					markdown += `1. First, prepare your environment\n2. Next, implement the solution\n3. Finally, test and verify\n\n`
					markdown += `> 💡 **Pro Tip**: Remember to check compatibility before starting.\n\n`
					break
				case 'review':
					markdown += `### ${section} Analysis\n\n`
					markdown += `**Pros:**\n- Advantage 1\n- Advantage 2\n\n`
					markdown += `**Cons:**\n- Limitation 1\n- Limitation 2\n\n`
					break
			}
		})

		// Add SEO-optimized sections
		markdown += `## Best Practices\n\n`
		markdown += `When working with ${formData.title.toLowerCase()}, keep these best practices in mind:\n\n`
		markdown += `1. **Optimize for performance**: Always consider the impact on load times\n`
		markdown += `2. **Follow standards**: Adhere to industry best practices\n`
		markdown += `3. **Test thoroughly**: Verify across different scenarios\n\n`

		// Add FAQ section if enabled
		if (formData.includeFAQ) {
			markdown += `## Frequently Asked Questions\n\n`
			markdown += `### Q: What is ${formData.title}?\n`
			markdown += `A: ${formData.excerpt}\n\n`
			markdown += `### Q: Who should use this?\n`
			markdown += `A: This is perfect for developers and designers looking to improve their workflow.\n\n`
			markdown += `### Q: Is it beginner-friendly?\n`
			markdown += `A: Yes, this guide is written with beginners in mind while still providing value for experienced users.\n\n`
		}

		// Add conclusion
		markdown += `## Conclusion\n\n`
		markdown += `${formData.title} is a powerful approach that can significantly improve your development workflow. `
		markdown += `By following the guidelines and best practices outlined in this article, you'll be well-equipped to implement these concepts in your own projects.\n\n`

		// Add related links if enabled
		if (formData.includeRelatedLinks) {
			markdown += `## Related Resources\n\n`
			markdown += `- [Official Documentation](#)\n`
			markdown += `- [Community Forum](#)\n`
			markdown += `- [Video Tutorial](#)\n`
			markdown += `- [GitHub Repository](#)\n\n`
		}

		// Add CTA
		markdown += `---\n\n`
		markdown += `*Found this article helpful? Share it with your network and leave a comment below with your thoughts!*`

		setGeneratedMarkdown(markdown)
	}

	const copyToClipboard = () => {
		navigator.clipboard.writeText(generatedMarkdown)
		toast.success('Скопировано в буфер обмена')
	}

	const downloadMarkdown = () => {
		const blob = new Blob([generatedMarkdown], { type: 'text/markdown' })
		const url = URL.createObjectURL(blob)
		const a = document.createElement('a')
		a.href = url
		a.download = `${formData.title.toLowerCase().replace(/\s+/g, '-')}.md`
		document.body.appendChild(a)
		a.click()
		document.body.removeChild(a)
		URL.revokeObjectURL(url)
		toast.success('Файл успешно загружен')
	}

	return (
		<div className='grid lg:grid-cols-2 gap-6'>
			<div className='space-y-6'>
				<Card>
					<CardHeader>
						<CardTitle>Настройки статьи</CardTitle>
						<CardDescription>
							Настройте основные параметры вашей статьи
						</CardDescription>
					</CardHeader>
					<CardContent className='space-y-4'>
						<div>
							<Label htmlFor='title'>Заголовок статьи</Label>
							<Input
								id='title'
								value={formData.title}
								onChange={e =>
									setFormData({ ...formData, title: e.target.value })
								}
								placeholder='Введите заголовок статьи'
							/>
						</div>

						<div>
							<Label htmlFor='excerpt'>Описание статьи</Label>
							<Textarea
								id='excerpt'
								value={formData.excerpt}
								onChange={e =>
									setFormData({ ...formData, excerpt: e.target.value })
								}
								placeholder='Краткое описание статьи'
								rows={3}
							/>
						</div>

						<div>
							<Label htmlFor='keywords'>Ключевые слова</Label>
							<Input
								id='keywords'
								value={formData.keywords}
								onChange={e =>
									setFormData({ ...formData, keywords: e.target.value })
								}
								placeholder='keyword1, keyword2, keyword3'
							/>
						</div>

						<div className='grid grid-cols-2 gap-4'>
							<div>
								<Label htmlFor='author'>Имя автора</Label>
								<Input
									id='author'
									value={formData.author}
									onChange={e =>
										setFormData({ ...formData, author: e.target.value })
									}
									placeholder='Имя автора'
								/>
							</div>

							<div>
								<Label htmlFor='category'>Категория</Label>
								<Input
									id='category'
									value={formData.category}
									onChange={e =>
										setFormData({ ...formData, category: e.target.value })
									}
									placeholder='Веб-разработка'
								/>
							</div>
						</div>

						<div>
							<Label htmlFor='contentType'>Тип контента</Label>
							<Select
								value={formData.contentType}
								onValueChange={value =>
									setFormData({ ...formData, contentType: value })
								}
							>
								<SelectTrigger>
									<SelectValue />
								</SelectTrigger>
								<SelectContent>
									{Object.entries(contentTypes).map(([key, value]) => (
										<SelectItem key={key} value={key}>
											{value.template}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
							<p className='text-sm text-muted-foreground mt-1'>
								{
									contentTypes[
										formData.contentType as keyof typeof contentTypes
									].structure
								}
							</p>
						</div>
					</CardContent>
				</Card>

				<Card>
					<CardHeader>
						<CardTitle>Структура контента</CardTitle>
						<CardDescription>
							Определите структуру и дополнительные разделы
						</CardDescription>
					</CardHeader>
					<CardContent className='space-y-4'>
						<div>
							<Label htmlFor='outline'>План контента</Label>
							<Textarea
								id='outline'
								value={formData.contentOutline}
								onChange={e =>
									setFormData({ ...formData, contentOutline: e.target.value })
								}
								placeholder='Введение\nОсновная часть\nЗаключение\n(каждый раздел с новой строки)'
								rows={6}
							/>
						</div>

						<div className='space-y-2'>
							<label className='flex items-center space-x-2'>
								<input
									type='checkbox'
									checked={formData.includeTableOfContents}
									onChange={e =>
										setFormData({
											...formData,
											includeTableOfContents: e.target.checked
										})
									}
									className='rounded'
								/>
								<span>Включить оглавление</span>
							</label>

							<label className='flex items-center space-x-2'>
								<input
									type='checkbox'
									checked={formData.includeFAQ}
									onChange={e =>
										setFormData({ ...formData, includeFAQ: e.target.checked })
									}
									className='rounded'
								/>
								<span>Включить раздел FAQ</span>
							</label>

							<label className='flex items-center space-x-2'>
								<input
									type='checkbox'
									checked={formData.includeRelatedLinks}
									onChange={e =>
										setFormData({
											...formData,
											includeRelatedLinks: e.target.checked
										})
									}
									className='rounded'
								/>
								<span>Включить связанные ссылки</span>
							</label>
						</div>

						<Button
							onClick={generateMarkdown}
							className='w-full'
							disabled={
								!formData.title || !formData.excerpt || !formData.contentOutline
							}
						>
							<Sparkles className='w-4 h-4 mr-2' />
							Генерировать Markdown
						</Button>
					</CardContent>
				</Card>
			</div>

			<div className='space-y-6'>
				<Card className='h-full'>
					<CardHeader>
						<CardTitle className='flex items-center justify-between'>
							<span>Предварительный просмотр</span>
							{generatedMarkdown && (
								<div className='flex gap-2'>
									<Button size='sm' variant='outline' onClick={copyToClipboard}>
										<Copy className='w-4 h-4' />
									</Button>
									<Button
										size='sm'
										variant='outline'
										onClick={downloadMarkdown}
									>
										<Download className='w-4 h-4' />
									</Button>
								</div>
							)}
						</CardTitle>
					</CardHeader>
					<CardContent>
						{generatedMarkdown ? (
							<pre className='bg-muted p-4 rounded-lg overflow-auto max-h-[600px] text-sm'>
								<code>{generatedMarkdown}</code>
							</pre>
						) : (
							<div className='flex flex-col items-center justify-center h-[400px] text-muted-foreground'>
								<FileText className='w-12 h-12 mb-4' />
								<p>Предварительный просмотр появится здесь</p>
							</div>
						)}
					</CardContent>
				</Card>
			</div>
		</div>
	)
}
