'use client'

import { useState, useCallback, useMemo } from 'react'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Slider } from '@/components/ui/slider'
import {
	ChevronRight,
	ChevronDown,
	Search,
	FileCode,
	Hash,
	BarChart3,
	AlertTriangle,
	CheckCircle2,
	XCircle,
	Info,
	Layers,
	Eye,
	EyeOff
} from 'lucide-react'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'

const EXAMPLE_HTML = `<!DOCTYPE html>
<html class="page" lang="ru">
<head>
  <title>Пример BEM страницы</title>
  <meta charset="utf-8">
</head>
<body class="page__body">
  <header class="header">
    <h1 class="header__title">Главный заголовок сайта</h1>
    <nav class="header__navigation navigation">
      <a class="navigation__link navigation__link--active" href="#">Главная</a>
      <a class="navigation__link" href="#">О нас</a>
      <a class="navigation__link navigation__link--disabled" href="#">Контакты</a>
    </nav>
  </header>
  <main class="content">
    <section class="section">
      <h2 class="section__title">Рекомендуемые мероприятия</h2>
      <article class="article">
        <h3 class="article__title">SimpleOne DAY 25</h3>
        <p class="article__description">Описание мероприятия</p>
        <button class="button button--primary">Подробнее</button>
      </article>
    </section>
    <section class="section section--highlighted">
      <h2 class="section__title">Все мероприятия</h2>
      <div class="events">
        <article class="article events__item">
          <h3 class="article__title">Битва за IT-таланты</h3>
          <p class="article__description">HR IT конференция</p>
          <span class="article__tag tag tag--category">HR</span>
        </article>
      </div>
    </section>
  </main>
  <footer class="footer">
    <div class="footer__content">
      <p class="footer__copyright">© 2024</p>
    </div>
  </footer>
</body>
</html>`

interface TreeNode {
	tag: string
	originalTag: string
	classes: string[]
	id?: string
	children: TreeNode[]
	level: number
	text?: string
	path: string
	bemIssues: BemIssue[]
	isHighlighted?: boolean
	highlightColor?: string
}

interface BemIssue {
	className: string
	type: 'missing-block' | 'invalid-modifier' | 'wrong-element'
	message: string
}

interface HeadingInfo {
	level: number
	tag: string
	text: string
	position: number
}

interface HeadingAnalysis {
	headings: HeadingInfo[]
	hasH1: boolean
	h1Count: number
	issues: string[]
	warnings: string[]
	isWholePage: boolean
}

interface Statistics {
	totalElements: number
	maxDepth: number
	elementCounts: Record<string, number>
	classCount: number
	idCount: number
	bemIssuesCount: number
}

const WHOLE_PAGE_MARKERS = ['META', 'TITLE', 'LINK']
const SKIPPED_TAGS = [
	'SCRIPT',
	'META',
	'TITLE',
	'LINK',
	'NOSCRIPT',
	'BR',
	'STYLE'
]
const HIGHLIGHT_COLORS = [
	'#00ffff',
	'#00ff00',
	'#ffff00',
	'#ff00ff',
	'#ffa500',
	'#ff69b4'
]

export default function HTMLTreePage() {
	const [htmlInput, setHtmlInput] = useState('')
	const [treeData, setTreeData] = useState<TreeNode | null>(null)
	const [headingAnalysis, setHeadingAnalysis] =
		useState<HeadingAnalysis | null>(null)
	const [statistics, setStatistics] = useState<Statistics | null>(null)
	const [searchQuery, setSearchQuery] = useState('')
	const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set())
	const [expandAll, setExpandAll] = useState(false)
	const [maxVisibleDepth, setMaxVisibleDepth] = useState(10)
	const [classHighlights, setClassHighlights] = useState<Map<string, string>>(
		new Map()
	)
	const [showBemIssues, setShowBemIssues] = useState(true)

	const validateBemClass = useCallback(
		(className: string, element: Element, allClasses: string[]): BemIssue[] => {
			const issues: BemIssue[] = []

			// Check for BEM patterns
			const hasModifier = className.includes('--')
			const hasElement = className.includes('__')
			const hasSingleUnderscore = /[^_]_[^_]/.test(className)

			if (!hasModifier && !hasElement && !hasSingleUnderscore) {
				return issues // Regular class, no BEM validation needed
			}

			// Validate elements (with __)
			if (hasElement) {
				const blockName = className.split('__')[0]
				const hasBlockOnElement = allClasses.includes(blockName)

				if (!hasBlockOnElement) {
					// Check if block exists on parent elements
					let parent = element.parentElement
					let blockFoundOnParent = false

					while (parent && parent !== document.body) {
						if (parent.classList.contains(blockName)) {
							blockFoundOnParent = true
							break
						}
						parent = parent.parentElement
					}

					if (!blockFoundOnParent) {
						issues.push({
							className,
							type: 'missing-block',
							message: `Блок "${blockName}" не найден на элементе или родителях`
						})
					}
				}
			}

			// Validate modifiers (with -- or single _)
			let modifierBase = ''
			if (hasModifier) {
				modifierBase = className.split('--')[0]
			} else if (hasSingleUnderscore) {
				const match = className.match(/^(.+?)_[^_]+$/)
				if (match) {
					modifierBase = match[1]
				}
			}

			if (modifierBase && !allClasses.includes(modifierBase)) {
				issues.push({
					className,
					type: 'invalid-modifier',
					message: `Базовый класс "${modifierBase}" не найден для модификатора`
				})
			}

			return issues
		},
		[]
	)

	const analyzeHeadings = useCallback((doc: Document): HeadingAnalysis => {
		const headingTags = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6']
		const headings: HeadingInfo[] = []
		const issues: string[] = []
		const warnings: string[] = []

		// Check if it's a whole page
		const isWholePage = WHOLE_PAGE_MARKERS.some(
			tag => doc.querySelector(tag.toLowerCase()) !== null
		)

		headingTags.forEach(tag => {
			const elements = doc.querySelectorAll(tag)
			elements.forEach((el, index) => {
				headings.push({
					level: parseInt(tag[1]),
					tag: tag.toUpperCase(),
					text: el.textContent?.trim() || '',
					position: headings.length
				})
			})
		})

		// Check H1
		const h1Count = headings.filter(h => h.level === 1).length
		const hasH1 = h1Count > 0

		if (isWholePage && !hasH1) {
			issues.push('❌ Полная страница должна содержать заголовок H1')
		} else if (!hasH1) {
			warnings.push('⚠️ Рекомендуется добавить заголовок H1')
		}

		if (h1Count > 1) {
			warnings.push(`⚠️ Найдено ${h1Count} заголовков H1 (рекомендуется один)`)
		}

		// Check heading hierarchy
		for (let i = 1; i < headings.length; i++) {
			const prev = headings[i - 1]
			const current = headings[i]
			const levelDiff = current.level - prev.level

			if (levelDiff > 1) {
				warnings.push(
					`⚠️ Пропущен уровень: ${prev.tag} → ${current.tag} (позиция ${i + 1})`
				)
			}
		}

		// Check if headings exist for content pages
		if (headings.length === 0 && isWholePage) {
			issues.push('❌ На странице нет заголовков')
		}

		return {
			headings,
			hasH1,
			h1Count,
			issues,
			warnings,
			isWholePage
		}
	}, [])

	const calculateStatistics = useCallback((node: TreeNode): Statistics => {
		const elementCounts: Record<string, number> = {}
		let totalElements = 0
		let maxDepth = 0
		let classCount = 0
		let idCount = 0
		let bemIssuesCount = 0

		const traverse = (n: TreeNode) => {
			totalElements++
			elementCounts[n.originalTag] = (elementCounts[n.originalTag] || 0) + 1
			maxDepth = Math.max(maxDepth, n.level)
			classCount += n.classes.length
			if (n.id) idCount++
			bemIssuesCount += n.bemIssues.length
			n.children.forEach(traverse)
		}

		traverse(node)

		return {
			totalElements,
			maxDepth,
			elementCounts,
			classCount,
			idCount,
			bemIssuesCount
		}
	}, [])

	const getTagClass = useCallback(
		(code: string, tagName: string = 'body'): string[] => {
			const regexp = new RegExp(`<${tagName}[^>]*class="([^"]*)"`)
			const result = code.match(regexp)
			return result ? result[1].split(' ').filter(Boolean) : []
		},
		[]
	)

	const parseHTML = useCallback(
		(htmlString: string) => {
			try {
				const parser = new DOMParser()
				const doc = parser.parseFromString(htmlString, 'text/html')

				// Analyze headings first
				const headingAnalysis = analyzeHeadings(doc)
				setHeadingAnalysis(headingAnalysis)

				// Get HTML and BODY classes
				const htmlClasses = getTagClass(htmlString, 'html')
				const bodyClasses = getTagClass(htmlString, 'body')

				const buildTree = (
					element: Element,
					level: number = 1,
					path: string = '0'
				): TreeNode | null => {
					// Skip certain tags
					if (SKIPPED_TAGS.includes(element.tagName)) {
						return null
					}

					const classes = Array.from(element.classList)
					const id = element.id || undefined

					// Validate BEM for this element
					const bemIssues: BemIssue[] = []
					classes.forEach(className => {
						const issues = validateBemClass(className, element, classes)
						bemIssues.push(...issues)
					})

					// Determine display tag name
					let displayTag = element.tagName.toLowerCase()
					const originalTag = displayTag

					if (headingAnalysis.isWholePage) {
						if (level === 1 && element === doc.documentElement) {
							displayTag = 'html'
						} else if (level === 2 && element === doc.body) {
							displayTag = 'body'
						}
					}

					const children: TreeNode[] = []
					let childIndex = 0
					Array.from(element.children).forEach(child => {
						const childNode = buildTree(
							child,
							level + 1,
							`${path}-${childIndex}`
						)
						if (childNode) {
							children.push(childNode)
							childIndex++
						}
					})

					return {
						tag: displayTag,
						originalTag,
						classes:
							level === 1 && headingAnalysis.isWholePage
								? htmlClasses
								: level === 2 && headingAnalysis.isWholePage
									? bodyClasses
									: classes,
						id,
						children,
						level,
						text: element.textContent?.substring(0, 50),
						path,
						bemIssues
					}
				}

				let rootElement: Element
				if (headingAnalysis.isWholePage && doc.documentElement) {
					rootElement = doc.documentElement
				} else if (doc.body.firstElementChild) {
					rootElement = doc.body.firstElementChild
				} else {
					setTreeData(null)
					setStatistics(null)
					return
				}

				const tree = buildTree(rootElement)
				if (tree) {
					setTreeData(tree)
					const stats = calculateStatistics(tree)
					setStatistics(stats)

					// Initialize expanded state for first level nodes
					if (!expandAll) {
						const initialExpanded = new Set<string>()
						initialExpanded.add(tree.path) // Always expand root
						tree.children.forEach(child => {
							initialExpanded.add(child.path) // Expand first level
						})
						setExpandedNodes(initialExpanded)
					}

					toast.success('HTML успешно разобран')
				}
			} catch (error) {
				console.error('Error parsing HTML:', error)
				toast.error('Ошибка разбора HTML')
				setTreeData(null)
				setHeadingAnalysis(null)
				setStatistics(null)
			}
		},
		[
			analyzeHeadings,
			calculateStatistics,
			getTagClass,
			validateBemClass,
			expandAll
		]
	)

	const handleInputChange = useCallback(
		(value: string) => {
			setHtmlInput(value)
			if (value.trim()) {
				parseHTML(value)
			} else {
				setTreeData(null)
				setHeadingAnalysis(null)
				setStatistics(null)
			}
		},
		[parseHTML]
	)

	const toggleNode = useCallback(
		(path: string) => {
			if (expandAll) {
				// When expandAll is true, first click should collapse this specific node
				setExpandAll(false)
				const newExpanded = new Set(expandedNodes)
				// Add all other expanded nodes except this one
				const allPaths = new Set<string>()
				const collectPaths = (node: TreeNode) => {
					if (node.path !== path) {
						allPaths.add(node.path)
					}
					node.children.forEach(collectPaths)
				}
				if (treeData) collectPaths(treeData)
				setExpandedNodes(allPaths)
			} else {
				const newExpanded = new Set(expandedNodes)
				if (newExpanded.has(path)) {
					newExpanded.delete(path)
				} else {
					newExpanded.add(path)
				}
				setExpandedNodes(newExpanded)
			}
		},
		[expandAll, expandedNodes, treeData]
	)

	const toggleClassHighlight = useCallback(
		(className: string) => {
			const newHighlights = new Map(classHighlights)
			const currentColor = newHighlights.get(className)

			if (currentColor) {
				newHighlights.delete(className)
			} else {
				const colorIndex = newHighlights.size % HIGHLIGHT_COLORS.length
				newHighlights.set(className, HIGHLIGHT_COLORS[colorIndex])
			}

			setClassHighlights(newHighlights)
		},
		[classHighlights]
	)

	const matchesSearch = useCallback(
		(node: TreeNode): boolean => {
			if (!searchQuery) return true
			const query = searchQuery.toLowerCase()
			return (
				node.tag.toLowerCase().includes(query) ||
				node.classes.some(c => c.toLowerCase().includes(query)) ||
				node.id?.toLowerCase().includes(query) ||
				false
			)
		},
		[searchQuery]
	)

	const renderTree = useCallback(
		(node: TreeNode, currentDepth: number = 1): React.ReactElement | null => {
			if (currentDepth > maxVisibleDepth) return null

			const hasChildren = node.children.length > 0
			const isExpanded = expandAll ? true : expandedNodes.has(node.path)
			const matches = matchesSearch(node)
			const hasBemIssues = showBemIssues && node.bemIssues.length > 0

			if (!matches && !node.children.some(child => matchesSearch(child)))
				return null

			return (
				<div key={node.path} className='select-none'>
					<div
						className={cn(
							'flex items-center gap-2 py-1.5 px-2 rounded hover:bg-muted/50 cursor-pointer group',
							matches && searchQuery && 'bg-yellow-100 dark:bg-yellow-900/20',
							hasBemIssues && 'border-l-2 border-red-400'
						)}
						onClick={() => hasChildren && toggleNode(node.path)}
					>
						{hasChildren ? (
							<button className='flex-shrink-0 p-0.5 hover:bg-muted rounded'>
								{isExpanded ? (
									<ChevronDown className='w-4 h-4' />
								) : (
									<ChevronRight className='w-4 h-4' />
								)}
							</button>
						) : (
							<div className='w-5' />
						)}

						<Badge variant='outline' className='font-mono text-xs'>
							{node.tag}
						</Badge>

						{node.id && (
							<span className='text-xs font-mono text-purple-600 dark:text-purple-400'>
								#{node.id}
							</span>
						)}

						{node.classes.length > 0 && (
							<div className='flex items-center gap-1 flex-wrap'>
								{node.classes.map((className, index) => {
									const highlightColor = classHighlights.get(className)
									const hasIssue = node.bemIssues.some(
										issue => issue.className === className
									)

									return (
										<span
											key={index}
											className={cn(
												'text-xs font-mono px-1.5 py-0.5 rounded cursor-pointer hover:bg-muted transition-colors',
												hasIssue
													? 'text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20'
													: 'text-blue-600 dark:text-blue-400'
											)}
											style={{
												backgroundColor: highlightColor || undefined,
												color: highlightColor ? '#000' : undefined
											}}
											onClick={e => {
												e.stopPropagation()
												toggleClassHighlight(className)
											}}
										>
											.{className}
										</span>
									)
								})}
							</div>
						)}

						{hasBemIssues && (
							<AlertTriangle className='w-4 h-4 text-red-500 flex-shrink-0' />
						)}

						{node.children.length > 0 && (
							<span className='text-xs text-muted-foreground ml-auto'>
								{node.children.length}
							</span>
						)}
					</div>

					{/* BEM Issues */}
					{showBemIssues && node.bemIssues.length > 0 && (
						<div className='ml-6 pl-2 border-l-2 border-red-200 dark:border-red-800'>
							{node.bemIssues.map((issue, index) => (
								<div
									key={index}
									className='text-xs text-red-600 dark:text-red-400 py-1'
								>
									<span className='font-mono'>.{issue.className}</span>:{' '}
									{issue.message}
								</div>
							))}
						</div>
					)}

					{hasChildren && isExpanded && (
						<div className='ml-6 border-l-2 border-border/50 pl-2'>
							{node.children.map(child => renderTree(child, currentDepth + 1))}
						</div>
					)}
				</div>
			)
		},
		[
			maxVisibleDepth,
			expandAll,
			expandedNodes,
			matchesSearch,
			showBemIssues,
			classHighlights,
			searchQuery,
			toggleNode,
			toggleClassHighlight
		]
	)

	const renderBemIssues = useCallback(
		(node: TreeNode): React.ReactElement[] => {
			const issues: React.ReactElement[] = []

			const collectIssues = (n: TreeNode) => {
				if (n.bemIssues.length > 0) {
					issues.push(
						<div key={n.path} className='border rounded-lg p-3 space-y-2'>
							<div className='flex items-center gap-2'>
								<Badge variant='outline' className='font-mono text-xs'>
									{n.tag}
								</Badge>
								<span className='text-sm text-muted-foreground'>
									{n.bemIssues.length} проблем
								</span>
							</div>
							<div className='space-y-1'>
								{n.bemIssues.map((issue, index) => (
									<div key={index} className='text-sm'>
										<span className='font-mono text-red-600'>
											.{issue.className}
										</span>
										<span className='text-muted-foreground ml-2'>
											{issue.message}
										</span>
									</div>
								))}
							</div>
						</div>
					)
				}
				n.children.forEach(collectIssues)
			}

			collectIssues(node)
			return issues
		},
		[]
	)

	const bemIssuesCount = useMemo(() => {
		if (!statistics) return 0
		return statistics.bemIssuesCount
	}, [statistics])

	return (
		<div className='space-y-6'>
			{/* Input Section */}
			<Card>
				<CardHeader>
					<CardTitle className='flex items-center gap-2'>
						<FileCode className='w-5 h-5' />
						Ввод HTML
					</CardTitle>
				</CardHeader>
				<CardContent className='space-y-4'>
					<Textarea
						placeholder='Вставьте HTML код страницы...'
						value={htmlInput}
						onChange={e => handleInputChange(e.target.value)}
						className='min-h-[200px] font-mono text-sm'
						spellCheck={false}
					/>
					<Button
						variant='outline'
						onClick={() => {
							handleInputChange(EXAMPLE_HTML)
							toast.success('Пример загружен')
						}}
						className='w-full'
					>
						Загрузить пример
					</Button>
				</CardContent>
			</Card>

			{/* Results Tabs */}
			{treeData && (
				<Tabs defaultValue='tree' className='w-full'>
					<TabsList className='grid w-full grid-cols-4 text-xs sm:text-sm gap-1 sm:gap-2'>
						<TabsTrigger value='tree' className='gap-1 sm:gap-2'>
							<FileCode className='w-4 h-4 hidden sm:inline-block' />
							Дерево
						</TabsTrigger>

						<TabsTrigger value='headings' className='gap-1 sm:gap-2'>
							<Hash className='w-4 h-4 hidden sm:inline-block' />
							Заголовки
						</TabsTrigger>

						<TabsTrigger value='bem' className='gap-1 sm:gap-2 relative'>
							<AlertTriangle className='w-4 h-4 hidden sm:inline-block' />
							БЭМ
							{bemIssuesCount > 0 && (
								<Badge
									variant='destructive'
									className='ml-1 h-5 text-[10px] sm:text-xs'
								>
									{bemIssuesCount}
								</Badge>
							)}
						</TabsTrigger>

						<TabsTrigger value='stats' className='gap-1 sm:gap-2'>
							<BarChart3 className='w-4 h-4 hidden sm:inline-block' />
							Статистика
						</TabsTrigger>
					</TabsList>

					{/* Tree View */}
					<TabsContent value='tree' className='space-y-4'>
						<Card>
							<CardHeader>
								<div className='flex items-center justify-between gap-4'>
									<CardTitle>Дерево элементов</CardTitle>
									<div className='flex items-center gap-2'>
										<Button
											variant='outline'
											size='sm'
											onClick={() => setShowBemIssues(!showBemIssues)}
										>
											{showBemIssues ? (
												<Eye className='w-4 h-4' />
											) : (
												<EyeOff className='w-4 h-4' />
											)}
											БЭМ
										</Button>
										<Button
											variant='outline'
											size='sm'
											onClick={() => {
												if (expandAll) {
													// Collapse all
													setExpandAll(false)
													setExpandedNodes(new Set())
												} else {
													// Expand all
													setExpandAll(true)
													const allPaths = new Set<string>()
													const collectAllPaths = (node: TreeNode) => {
														allPaths.add(node.path)
														node.children.forEach(collectAllPaths)
													}
													if (treeData) collectAllPaths(treeData)
													setExpandedNodes(allPaths)
												}
											}}
										>
											{expandAll ? 'Свернуть все' : 'Развернуть все'}
										</Button>
									</div>
								</div>
							</CardHeader>
							<CardContent className='space-y-4'>
								{/* Search */}
								<div className='relative'>
									<Search className='absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground' />
									<Input
										placeholder='Поиск по тегам, классам, ID...'
										value={searchQuery}
										onChange={e => setSearchQuery(e.target.value)}
										className='pl-10'
									/>
								</div>

								{/* Depth Control */}
								<div className='space-y-2'>
									<div className='flex items-center gap-4'>
										<Layers className='w-4 h-4 text-muted-foreground' />
										<span className='text-sm font-medium'>
											Максимальная глубина: {maxVisibleDepth}
										</span>
									</div>
									<Slider
										value={[maxVisibleDepth]}
										onValueChange={value => setMaxVisibleDepth(value[0])}
										max={statistics?.maxDepth || 10}
										min={1}
										step={1}
										className='w-full'
									/>
								</div>

								{/* Class Highlights */}
								{classHighlights.size > 0 && (
									<div className='space-y-2'>
										<span className='text-sm font-medium'>
											Выделенные классы:
										</span>
										<div className='flex flex-wrap gap-2'>
											{Array.from(classHighlights.entries()).map(
												([className, color]) => (
													<Badge
														key={className}
														variant='outline'
														className='cursor-pointer'
														style={{ backgroundColor: color, color: '#000' }}
														onClick={() => toggleClassHighlight(className)}
													>
														.{className} ×
													</Badge>
												)
											)}
										</div>
									</div>
								)}

								{/* Tree */}
								<div className='border rounded-lg p-4 bg-muted/20 max-h-[600px] overflow-auto'>
									{renderTree(treeData)}
								</div>
							</CardContent>
						</Card>
					</TabsContent>

					{/* Headings Analysis */}
					<TabsContent value='headings' className='space-y-4'>
						<Card>
							<CardHeader>
								<CardTitle>Анализ заголовков</CardTitle>
							</CardHeader>
							<CardContent className='space-y-4'>
								{/* Status */}
								<div className='flex items-center gap-4'>
									<div className='flex items-center gap-2'>
										{headingAnalysis?.hasH1 ? (
											<CheckCircle2 className='w-5 h-5 text-green-600' />
										) : (
											<XCircle className='w-5 h-5 text-red-600' />
										)}
										<span className='text-sm font-medium'>
											{headingAnalysis?.hasH1
												? 'H1 присутствует'
												: 'H1 отсутствует'}
										</span>
									</div>
									<Badge variant='secondary'>
										Всего заголовков: {headingAnalysis?.headings.length || 0}
									</Badge>
									{headingAnalysis?.isWholePage && (
										<Badge variant='outline'>Полная страница</Badge>
									)}
								</div>

								{/* Issues */}
								{headingAnalysis?.issues &&
									headingAnalysis.issues.length > 0 && (
										<Alert variant='destructive'>
											<AlertTriangle className='h-4 w-4' />
											<AlertTitle>Критические проблемы</AlertTitle>
											<AlertDescription>
												<ul className='list-disc list-inside space-y-1 mt-2'>
													{headingAnalysis.issues.map((issue, index) => (
														<li key={index} className='text-sm'>
															{issue}
														</li>
													))}
												</ul>
											</AlertDescription>
										</Alert>
									)}

								{/* Warnings */}
								{headingAnalysis?.warnings &&
									headingAnalysis.warnings.length > 0 && (
										<Alert>
											<Info className='h-4 w-4' />
											<AlertTitle>Предупреждения</AlertTitle>
											<AlertDescription>
												<ul className='list-disc list-inside space-y-1 mt-2'>
													{headingAnalysis.warnings.map((warning, index) => (
														<li key={index} className='text-sm'>
															{warning}
														</li>
													))}
												</ul>
											</AlertDescription>
										</Alert>
									)}

								{/* Heading Structure */}
								{headingAnalysis?.headings &&
									headingAnalysis.headings.length > 0 && (
										<div className='space-y-2'>
											<h3 className='font-semibold text-sm'>
												Структура заголовков:
											</h3>
											<div className='space-y-1 p-4 rounded-lg border bg-muted/30'>
												{headingAnalysis.headings.map((heading, index) => (
													<div
														key={index}
														className='flex items-start gap-3 py-2 font-mono text-sm'
														style={{
															paddingLeft: `${(heading.level - 1) * 20}px`
														}}
													>
														<Badge
															variant={
																heading.level === 1 ? 'default' : 'secondary'
															}
															className='flex-shrink-0'
														>
															{heading.tag}
														</Badge>
														<span className='flex-1 truncate'>
															{heading.text || '(пустой заголовок)'}
														</span>
													</div>
												))}
											</div>
										</div>
									)}
							</CardContent>
						</Card>
					</TabsContent>

					{/* BEM Analysis */}
					<TabsContent value='bem' className='space-y-4'>
						<Card>
							<CardHeader>
								<CardTitle className='flex items-center gap-2'>
									БЭМ Валидация
									{bemIssuesCount > 0 && (
										<Badge variant='destructive'>
											{bemIssuesCount} проблем
										</Badge>
									)}
								</CardTitle>
							</CardHeader>
							<CardContent className='space-y-4'>
								{bemIssuesCount === 0 ? (
									<div className='text-center py-8'>
										<CheckCircle2 className='w-12 h-12 text-green-600 mx-auto mb-4' />
										<h3 className='text-lg font-semibold text-green-600 mb-2'>
											Отлично! БЭМ ошибок не найдено
										</h3>
										<p className='text-muted-foreground'>
											Все классы соответствуют методологии БЭМ
										</p>
									</div>
								) : (
									<Alert variant='destructive'>
										<AlertTriangle className='h-4 w-4' />
										<AlertTitle>Найдены БЭМ нарушения</AlertTitle>
										<AlertDescription>
											Обнаружено {bemIssuesCount} проблем с именованием классов
											по БЭМ методологии. Проверьте дерево элементов для
											детального анализа.
										</AlertDescription>
									</Alert>
								)}

								{/* BEM Issues Details */}
								{bemIssuesCount > 0 && treeData && (
									<div className='space-y-4'>
										<h3 className='font-semibold text-sm'>
											Детали БЭМ нарушений:
										</h3>
										<div className='text-xs text-muted-foreground mb-2'>
											Кликните на класс в дереве, чтобы выделить его цветом
										</div>
										{renderBemIssues(treeData)}
									</div>
								)}
							</CardContent>
						</Card>
					</TabsContent>

					{/* Statistics */}
					<TabsContent value='stats' className='space-y-4'>
						<div className='grid gap-4 md:grid-cols-2'>
							<Card>
								<CardHeader>
									<CardTitle className='text-base'>Общая информация</CardTitle>
								</CardHeader>
								<CardContent className='space-y-3'>
									<div className='flex justify-between items-center'>
										<span className='text-sm text-muted-foreground'>
											Всего элементов:
										</span>
										<Badge variant='secondary'>
											{statistics?.totalElements}
										</Badge>
									</div>
									<div className='flex justify-between items-center'>
										<span className='text-sm text-muted-foreground'>
											Максимальная глубина:
										</span>
										<Badge variant='secondary'>{statistics?.maxDepth}</Badge>
									</div>
									<div className='flex justify-between items-center'>
										<span className='text-sm text-muted-foreground'>
											Всего классов:
										</span>
										<Badge variant='secondary'>{statistics?.classCount}</Badge>
									</div>
									<div className='flex justify-between items-center'>
										<span className='text-sm text-muted-foreground'>
											Всего ID:
										</span>
										<Badge variant='secondary'>{statistics?.idCount}</Badge>
									</div>
									<div className='flex justify-between items-center'>
										<span className='text-sm text-muted-foreground'>
											БЭМ нарушений:
										</span>
										<Badge
											variant={bemIssuesCount > 0 ? 'destructive' : 'secondary'}
										>
											{bemIssuesCount}
										</Badge>
									</div>
								</CardContent>
							</Card>

							<Card>
								<CardHeader>
									<CardTitle className='text-base'>Элементы по типам</CardTitle>
								</CardHeader>
								<CardContent>
									<div className='space-y-2 max-h-[300px] overflow-auto'>
										{statistics &&
											Object.entries(statistics.elementCounts)
												.sort((a, b) => b[1] - a[1])
												.map(([tag, count]) => (
													<div
														key={tag}
														className='flex justify-between items-center'
													>
														<code className='text-sm font-mono'>{tag}</code>
														<Badge variant='outline'>{count}</Badge>
													</div>
												))}
									</div>
								</CardContent>
							</Card>
						</div>
					</TabsContent>
				</Tabs>
			)}
		</div>
	)
}
