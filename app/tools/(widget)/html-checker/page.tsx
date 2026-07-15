'use client'

import { useState, useCallback, useRef } from 'react'
import { HtmlAnalysis } from './HtmlAnalysis'
import Link from 'next/link'
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
	AlertTriangle,
	CheckCircle2,
	XCircle,
	Info,
	Layers,
	Upload,
	Globe
} from 'lucide-react'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'

const EXAMPLE_HTML = `<!DOCTYPE html>
<html class="page" lang="ru">
<head>
  <title>Пример HTML-страницы</title>
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
	isHighlighted?: boolean
	highlightColor?: string
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
	const fileInputRef = useRef<HTMLInputElement>(null)
	const [urlValue, setUrlValue] = useState('')
	const [isFetchingUrl, setIsFetchingUrl] = useState(false)
	const [isDragging, setIsDragging] = useState(false)

	const loadFromUrl = useCallback(async () => {
		const address = urlValue.trim()
		if (!address) return
		setIsFetchingUrl(true)
		try {
			const res = await fetch(
				`/api/fetch-html?url=${encodeURIComponent(address)}`
			)
			const data = await res.json()
			if (!res.ok) {
				toast.error(data.error ?? 'Не удалось загрузить страницу')
			} else {
				handleInputChange(data.html)
				toast.success('Страница загружена')
			}
		} catch {
			toast.error('Не удалось загрузить страницу')
		} finally {
			setIsFetchingUrl(false)
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [urlValue])

	const loadFromFile = useCallback(async (file: File) => {
		try {
			handleInputChange(await file.text())
			toast.success(`Загружен ${file.name}`)
		} catch {
			toast.error('Не удалось прочитать файл')
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])
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

		const traverse = (n: TreeNode) => {
			totalElements++
			elementCounts[n.originalTag] = (elementCounts[n.originalTag] || 0) + 1
			maxDepth = Math.max(maxDepth, n.level)
			classCount += n.classes.length
			if (n.id) idCount++
			n.children.forEach(traverse)
		}

		traverse(node)

		return {
			totalElements,
			maxDepth,
			elementCounts,
			classCount,
			idCount
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
						path
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
		[analyzeHeadings, calculateStatistics, getTagClass, expandAll]
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

			if (!matches && !node.children.some(child => matchesSearch(child)))
				return null

			return (
				<div key={node.path} className='select-none'>
					<div
						className={cn(
							'flex items-center gap-2 py-1.5 px-2 rounded hover:bg-muted/50 cursor-pointer group',
							matches && searchQuery && 'bg-yellow-100 dark:bg-yellow-900/20'
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

									return (
										<span
											key={index}
											className={cn(
												'text-xs font-mono px-1.5 py-0.5 rounded cursor-pointer hover:bg-muted transition-colors text-blue-600 dark:text-blue-400'
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

						{node.children.length > 0 && (
							<span className='text-xs text-muted-foreground ml-auto'>
								{node.children.length}
							</span>
						)}
					</div>

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
			classHighlights,
			searchQuery,
			toggleNode,
			toggleClassHighlight
		]
	)

	return (
		<div className='space-y-6'>
			{/* Ввод и результаты — в одной карточке: разрыв на три блока (ввод,
			    полоса табов, дерево) выглядел раздробленно */}
			<Card>
				<CardContent className='space-y-6 pt-6'>
					{/* Три источника HTML большими вкладками: вставить код, загрузить
					    по адресу (через серверный роут — из браузера чужую страницу не
					    забрать) или из файла. Все три наполняют одно поле ввода. */}
					<Tabs defaultValue='paste' className='w-full'>
						{/* Прижат к верху и бокам карточки: отрицательные отступы гасят
						    padding CardContent, верхние углы скруглены под карточку */}
						<TabsList className='-mx-6 -mt-6 mb-6 grid h-auto w-[calc(100%+3rem)] grid-cols-3 gap-0 overflow-hidden rounded-b-none rounded-t-2xl p-0'>
							<TabsTrigger value='paste' className='h-full flex-col gap-1 rounded-none border-0 py-3 focus-visible:ring-0 data-[state=active]:bg-background data-[state=active]:shadow-none'>
								<FileCode className='h-5 w-5' />
								Вставить код
							</TabsTrigger>
							<TabsTrigger value='url' className='h-full flex-col gap-1 rounded-none border-0 py-3 focus-visible:ring-0 data-[state=active]:bg-background data-[state=active]:shadow-none'>
								<Globe className='h-5 w-5' />
								По адресу
							</TabsTrigger>
							<TabsTrigger value='file' className='h-full flex-col gap-1 rounded-none border-0 py-3 focus-visible:ring-0 data-[state=active]:bg-background data-[state=active]:shadow-none'>
								<Upload className='h-5 w-5' />
								Из файла
							</TabsTrigger>
						</TabsList>

						<TabsContent value='paste' className='h-72'>
							<Textarea
								placeholder='Вставьте HTML код страницы...'
								value={htmlInput}
								onChange={e => handleInputChange(e.target.value)}
								className='h-full resize-none font-mono text-sm'
								spellCheck={false}
							/>
						</TabsContent>

						<TabsContent value='url' className='h-72'>
							<div className='flex h-full flex-col justify-center rounded-xl border bg-muted/20 p-8'>
								<div className='flex flex-wrap items-center gap-2'>
									<Input
										value={urlValue}
										onChange={e => setUrlValue(e.target.value)}
										onKeyDown={e => e.key === 'Enter' && loadFromUrl()}
										placeholder='example.com'
										aria-label='Адрес страницы для загрузки HTML'
										className='max-w-sm bg-background'
									/>
									<Button
										onClick={loadFromUrl}
										disabled={isFetchingUrl}
										className='cursor-pointer'
									>
										{isFetchingUrl ? 'Загрузка…' : 'Загрузить'}
									</Button>
								</div>
								<p className='mt-2 text-xs text-muted-foreground'>
									Загрузим HTML страницы и построим по нему дерево. Данные
									обрабатываются на нашем сервере только для скачивания.
								</p>
							</div>
						</TabsContent>

						<TabsContent value='file' className='h-72'>
							{/* Объединённая зона: клик или перетаскивание файла */}
							<div
								role='button'
								tabIndex={0}
								onClick={() => fileInputRef.current?.click()}
								onKeyDown={e => {
									if (e.key === 'Enter' || e.key === ' ') {
										e.preventDefault()
										fileInputRef.current?.click()
									}
								}}
								onDragOver={e => {
									e.preventDefault()
									setIsDragging(true)
								}}
								onDragLeave={() => setIsDragging(false)}
								onDrop={e => {
									e.preventDefault()
									setIsDragging(false)
									const file = e.dataTransfer.files?.[0]
									if (file) loadFromFile(file)
								}}
								className={cn(
									'flex h-full cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed text-center transition-colors',
									isDragging
										? 'border-primary bg-primary/5'
										: 'hover:border-primary/40'
								)}
							>
								<Upload className='h-8 w-8 text-muted-foreground' />
								<span className='text-sm font-medium'>
									Перетащите файл сюда или нажмите
								</span>
								<span className='text-xs text-muted-foreground'>
									.html, .htm, .xml, .svg — читается в браузере
								</span>
							</div>
							<input
								ref={fileInputRef}
								type='file'
								accept='.html,.htm,.xml,.svg,text/html'
								className='hidden'
								onChange={event => {
									const file = event.target.files?.[0]
									if (file) loadFromFile(file)
									event.target.value = ''
								}}
							/>
						</TabsContent>

						<TabsContent value='url' className='min-h-[18rem]'>
							<div className='flex flex-wrap items-center gap-2'>
								<Input
									value={urlValue}
									onChange={e => setUrlValue(e.target.value)}
									onKeyDown={e => e.key === 'Enter' && loadFromUrl()}
									placeholder='example.com'
									aria-label='Адрес страницы для загрузки HTML'
									className='max-w-sm'
								/>
								<Button
									onClick={loadFromUrl}
									disabled={isFetchingUrl}
									className='cursor-pointer'
								>
									{isFetchingUrl ? 'Загрузка…' : 'Загрузить'}
								</Button>
							</div>
							<p className='mt-2 text-xs text-muted-foreground'>
								Загрузим HTML страницы и построим по нему дерево. Данные
								обрабатываются на нашем сервере только для скачивания.
							</p>
						</TabsContent>

						<TabsContent value='file' className='min-h-[18rem]'>
							<button
								type='button'
								onClick={() => fileInputRef.current?.click()}
								className='flex w-full cursor-pointer flex-col items-center gap-2 rounded-xl border-2 border-dashed py-10 text-center transition-colors hover:border-primary/40'
							>
								<Upload className='h-8 w-8 text-muted-foreground' />
								<span className='text-sm font-medium'>Выберите HTML-файл</span>
								<span className='text-xs text-muted-foreground'>
									.html, .htm, .xml, .svg — читается в браузере
								</span>
							</button>
							<input
								ref={fileInputRef}
								type='file'
								accept='.html,.htm,.xml,.svg,text/html'
								className='hidden'
								onChange={event => {
									const file = event.target.files?.[0]
									if (file) loadFromFile(file)
									event.target.value = ''
								}}
							/>
						</TabsContent>
					</Tabs>

					{/* Пример — вне табов: полезен независимо от выбранного источника */}
					<Button
						variant='outline'
						size='sm'
						onClick={() => {
							handleInputChange(EXAMPLE_HTML)
							toast.success('Пример загружен')
						}}
						className='mt-3 w-fit cursor-pointer'
					>
						Загрузить пример
					</Button>

					{treeData && (
						<div className='mt-6 space-y-8'>
							{/* Единый отчёт: сводка анализа, затем дерево, заголовки и статистика */}
							<HtmlAnalysis html={htmlInput} />

							{/* Tree View */}
							<section className='space-y-4 border-t pt-8'>
								<Card className='border-0 bg-transparent shadow-none'>
									<CardHeader>
										<div className='flex items-center justify-between gap-4'>
											<CardTitle>Дерево элементов</CardTitle>
											<div className='flex items-center gap-2'>
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
																style={{
																	backgroundColor: color,
																	color: '#000'
																}}
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
							</section>

							{/* Headings Analysis */}
							<section className='space-y-4 border-t pt-8'>
								<Card className='border-0 bg-transparent shadow-none'>
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
												Всего заголовков:{' '}
												{headingAnalysis?.headings.length || 0}
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
															{headingAnalysis.warnings.map(
																(warning, index) => (
																	<li key={index} className='text-sm'>
																		{warning}
																	</li>
																)
															)}
														</ul>
													</AlertDescription>
												</Alert>
											)}

									{/* Heading Structure — отступ по реальной вложенности, а не по
										    номеру тега: заголовок вкладывается под ближайший
										    предыдущий более высокого уровня (стек уровней). Так
										    пропуск h2→h4 не даёт ложной глубины. */}
										{headingAnalysis?.headings &&
											headingAnalysis.headings.length > 0 &&
											(() => {
												const stack: number[] = []
												const withDepth = headingAnalysis.headings.map(h => {
													while (
														stack.length > 0 &&
														stack[stack.length - 1] >= h.level
													) {
														stack.pop()
													}
													const depth = stack.length
													stack.push(h.level)
													return { ...h, depth }
												})

												return (
													<div className='space-y-2'>
														<h3 className='font-semibold text-sm'>
															Структура заголовков:
														</h3>
														<div className='rounded-lg border bg-muted/30 p-4'>
															{withDepth.map((heading, index) => (
																<div
																	key={index}
																	className='flex items-start gap-3 py-1.5 font-mono text-sm'
																	style={{ paddingLeft: `${heading.depth * 24}px` }}
																>
																	{heading.depth > 0 && (
																		<span
																			aria-hidden
																			className='-ml-3 self-stretch border-l border-border'
																		/>
																	)}
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
												)
											})()}
									</CardContent>
								</Card>
							</section>

							{/* Statistics */}
							<section className='space-y-4 border-t pt-8'>
								<div className='grid gap-4 md:grid-cols-2'>
									<Card className='border-0 bg-transparent shadow-none'>
										<CardHeader>
											<CardTitle className='text-base'>
												Общая информация
											</CardTitle>
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
												<Badge variant='secondary'>
													{statistics?.maxDepth}
												</Badge>
											</div>
											<div className='flex justify-between items-center'>
												<span className='text-sm text-muted-foreground'>
													Всего классов:
												</span>
												<Badge variant='secondary'>
													{statistics?.classCount}
												</Badge>
											</div>
											<div className='flex justify-between items-center'>
												<span className='text-sm text-muted-foreground'>
													Всего ID:
												</span>
												<Badge variant='secondary'>{statistics?.idCount}</Badge>
											</div>
										</CardContent>
									</Card>

									<Card className='border-0 bg-transparent shadow-none'>
										<CardHeader>
											<CardTitle className='text-base'>
												Элементы по типам
											</CardTitle>
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
							</section>
							{/* W3C Validation */}
						</div>
					)}
				</CardContent>
			</Card>

			<section className='mx-auto mt-16 max-w-3xl'>
				<h2 className='text-2xl font-bold tracking-tight'>
					Дерево разметки и дерево браузера — не одно и то же
				</h2>
				<p className='mt-3 text-muted-foreground'>
					Здесь вы видите дерево своего HTML: теги ровно там, где вы их
					написали. Браузер же строит из этой разметки DOM-дерево и по дороге
					чинит её — достраивает <code className='font-mono'>tbody</code>,
					закрывает забытые теги, выносит лишнее из таблиц наружу. Из-за этого,
					например, молча не работает селектор{' '}
					<code className='font-mono'>table &gt; tr</code>. Где именно
					расходятся два дерева — разбираем в статье{' '}
					<Link
						href='/blog/html-tree-vs-dom-tree'
						className='cursor-pointer font-medium text-primary hover:underline'
					>
						HTML-дерево и DOM-дерево
					</Link>
					.
				</p>
			</section>
		</div>
	)
}
