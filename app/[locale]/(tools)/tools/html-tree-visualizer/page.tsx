'use client'

import { useState, useEffect } from 'react'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Slider } from '@/components/ui/slider'
import { Badge } from '@/components/ui/badge'
import { AlertCircle } from 'lucide-react'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { toast } from 'sonner'
import { useTranslations } from 'next-intl'

const EXAMPLE_HTML = `<div class="container">
  <header class="header">
    <h1 class="header__title">Welcome</h1>
    <nav class="header__nav">
      <a class="nav__link nav__link--active" href="#">Home</a>
      <a class="nav__link" href="#">About</a>
    </nav>
  </header>
  <main class="content">
    <section class="content__section">
      <h2>Main Content</h2>
      <p>This is a paragraph.</p>
    </section>
  </main>
</div>`

interface TreeNode {
	tag: string
	classes: string[]
	children: TreeNode[]
	level: number
}

export default function HTMLTreePage() {
	const t = useTranslations('widgets.htmlTree')
	const [htmlInput, setHtmlInput] = useState('')
	const [treeData, setTreeData] = useState<TreeNode | null>(null)
	const [maxDepth, setMaxDepth] = useState(10)
	const [visibleDepth, setVisibleDepth] = useState(10)
	const [bemWarnings, setBemWarnings] = useState<string[]>([])

	const parseHTML = (
		htmlString: string,
		t: any
	): { tree: TreeNode | null; warnings: string[] } => {
		try {
			const parser = new DOMParser()
			const doc = parser.parseFromString(htmlString, 'text/html')
			const body = doc.body

			if (!body.firstElementChild) return { tree: null, warnings: [] }

			const warnings: string[] = []

			const buildTree = (element: Element, level: number = 0): TreeNode => {
				const classes = Array.from(element.classList)

				// Check BEM naming
				classes.forEach(className => {
					if (className.includes('__')) {
						const blockName = className.split('__')[0]
						if (
							!classes.includes(blockName) &&
							!element.parentElement?.classList.contains(blockName)
						) {
							warnings.push(
								t('warnings.blockNotFound', { className, blockName })
							)
						}
					}
					if (className.includes('--')) {
						const baseName = className.split('--')[0]
						if (!classes.includes(baseName)) {
							warnings.push(t('warnings.baseNotFound', { className, baseName }))
						}
					}
				})

				const children: TreeNode[] = []
				element.children &&
					Array.from(element.children).forEach(child => {
						children.push(buildTree(child as Element, level + 1))
					})

				return {
					tag: element.tagName.toLowerCase(),
					classes,
					children,
					level
				}
			}

			const tree = buildTree(body.firstElementChild)

			// Calculate max depth
			const getMaxDepth = (node: TreeNode): number => {
				if (node.children.length === 0) return node.level
				return Math.max(...node.children.map(child => getMaxDepth(child)))
			}

			const depth = getMaxDepth(tree)
			setMaxDepth(depth)
			setVisibleDepth(depth)

			return { tree, warnings }
		} catch (error) {
			console.error('Error parsing HTML:', error)
			toast.error(t('toast.parseError'))
			return { tree: null, warnings: [] }
		}
	}

	const handleInputChange = (value: string) => {
		setHtmlInput(value)
		if (value.trim()) {
			const result = parseHTML(value, t)
			setTreeData(result.tree)
			setBemWarnings(result.warnings)
			if (result.tree && result.warnings.length === 0) {
				toast.success(t('toast.parsed'))
			} else if (result.tree && result.warnings.length > 0) {
				const plural = result.warnings.length > 1 ? 'ями' : 'ем'
				toast.warning(
					t('toast.parsedWithWarnings', {
						count: result.warnings.length,
						plural
					})
				)
			}
		} else {
			setTreeData(null)
			setBemWarnings([])
		}
	}

	const renderTree = (node: TreeNode): React.ReactElement | null => {
		if (node.level > visibleDepth) return null

		return (
			<li key={Math.random()} className='my-1'>
				<div className='flex items-center gap-2'>
					<span className='font-mono text-sm text-blue-600 dark:text-blue-400'>
						{node.tag}
					</span>
					{node.classes.length > 0 && (
						<span className='font-mono text-xs text-gray-600 dark:text-gray-400'>
							.{node.classes.join(' .')}
						</span>
					)}
				</div>
				{node.children.length > 0 && (
					<ul className='ml-4 border-l-2 border-gray-200 dark:border-gray-700 pl-4'>
						{node.children.map(child => renderTree(child))}
					</ul>
				)}
			</li>
		)
	}

	return (
		<>
			<div className='grid gap-6 lg:grid-cols-2'>
				<Card>
					<CardHeader>
						<CardTitle>{t('htmlInput')}</CardTitle>
					</CardHeader>
					<CardContent className='space-y-4'>
						<Textarea
							placeholder={t('placeholder')}
							value={htmlInput}
							onChange={e => handleInputChange(e.target.value)}
							className='min-h-[300px] font-mono text-sm'
							spellCheck={false}
						/>
						<Button
							variant='outline'
							onClick={() => {
								handleInputChange(EXAMPLE_HTML)
								toast.success(t('toast.exampleLoaded'))
							}}
							className='w-full'
						>
							{t('loadExample')}
						</Button>
					</CardContent>
				</Card>

				<Card>
					<CardHeader>
						<CardTitle className='flex items-center justify-between'>
							<span>{t('treeStructure')}</span>
							{treeData && (
								<div className='flex items-center gap-2'>
									<span className='text-sm text-muted-foreground'>
										{t('depth')}: {visibleDepth}/{maxDepth}
									</span>
									<div className='w-32'>
										<Slider
											value={[visibleDepth]}
											onValueChange={([value]) => setVisibleDepth(value)}
											min={1}
											max={maxDepth}
											step={1}
										/>
									</div>
								</div>
							)}
						</CardTitle>
					</CardHeader>
					<CardContent>
						{treeData ? (
							<div className='overflow-auto'>
								<ul className='font-mono text-sm'>{renderTree(treeData)}</ul>
							</div>
						) : (
							<div className='text-center py-12 text-muted-foreground'>
								{t('emptyState')}
							</div>
						)}
					</CardContent>
				</Card>
			</div>

			{bemWarnings.length > 0 && (
				<Alert>
					<AlertCircle className='h-4 w-4' />
					<AlertDescription>
						<div className='font-semibold mb-2'>{t('bemWarnings')}</div>
						<ul className='list-disc list-inside space-y-1'>
							{bemWarnings.map((warning, index) => (
								<li key={index} className='text-sm'>
									{warning}
								</li>
							))}
						</ul>
					</AlertDescription>
				</Alert>
			)}
		</>
	)
}
