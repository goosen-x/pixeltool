'use client'

import { useState, useEffect } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue
} from '@/components/ui/select'
import {
	Database,
	CheckCircle,
	AlertCircle,
	XCircle,
	Copy,
	RefreshCw,
	FileText,
	Info,
	Lightbulb,
	Terminal,
	Eye,
	Play
} from 'lucide-react'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'

type QueryType =
	| 'SELECT'
	| 'INSERT'
	| 'UPDATE'
	| 'DELETE'
	| 'CREATE'
	| 'ALTER'
	| 'DROP'
	| 'UNKNOWN'
type ErrorSeverity = 'error' | 'warning' | 'info'

interface SQLError {
	line: number
	column: number
	message: string
	severity: ErrorSeverity
	type: string
}

interface QueryInfo {
	type: QueryType
	tables: string[]
	columns: string[]
	hasWhere: boolean
	hasOrderBy: boolean
	hasGroupBy: boolean
	hasLimit: boolean
}

interface SyntaxCheckResult {
	isValid: boolean
	errors: SQLError[]
	warnings: SQLError[]
	queryInfo: QueryInfo
	executionPlan?: string
}

const SQL_EXAMPLES = {
	valid: `SELECT u.id, u.name, u.email, p.title
FROM users u
LEFT JOIN posts p ON u.id = p.user_id
WHERE u.status = 'active'
  AND u.created_at >= '2023-01-01'
ORDER BY u.name ASC, p.created_at DESC
LIMIT 10;`,

	invalid: `SELECT u.id u.name, u.email p.title
FROM users u
LEFT JOIN posts p ON u.id = p.user_id
WHERE u.status = 'active
  AND u.created_at >= '2023-01-01'
ORDER BY u.name ASC p.created_at DESC
LIMIT 10`,

	complex: `WITH user_stats AS (
  SELECT
    user_id,
    COUNT(*) as post_count,
    AVG(views) as avg_views,
    MAX(created_at) as last_post
  FROM posts
  WHERE status = 'published'
  GROUP BY user_id
  HAVING COUNT(*) >= 5
),
top_users AS (
  SELECT
    u.id,
    u.name,
    us.post_count,
    us.avg_views,
    CASE
      WHEN us.avg_views > 1000 THEN 'Popular'
      WHEN us.avg_views > 500 THEN 'Good'
      ELSE 'Average'
    END as category
  FROM users u
  INNER JOIN user_stats us ON u.id = us.user_id
  WHERE u.status = 'active'
)
SELECT * FROM top_users
ORDER BY avg_views DESC
LIMIT 20;`
}

const SQL_KEYWORDS = [
	'SELECT',
	'FROM',
	'WHERE',
	'JOIN',
	'INNER JOIN',
	'LEFT JOIN',
	'RIGHT JOIN',
	'FULL JOIN',
	'INSERT',
	'UPDATE',
	'DELETE',
	'CREATE',
	'ALTER',
	'DROP',
	'TABLE',
	'INDEX',
	'VIEW',
	'ORDER BY',
	'GROUP BY',
	'HAVING',
	'LIMIT',
	'OFFSET',
	'UNION',
	'DISTINCT',
	'AS',
	'AND',
	'OR',
	'NOT',
	'IN',
	'EXISTS',
	'LIKE',
	'BETWEEN',
	'IS NULL',
	'IS NOT NULL',
	'COUNT',
	'SUM',
	'AVG',
	'MAX',
	'MIN',
	'CASE',
	'WHEN',
	'THEN',
	'ELSE',
	'END',
	'WITH',
	'RECURSIVE',
	'OVER',
	'PARTITION BY',
	'ROW_NUMBER',
	'RANK',
	'DENSE_RANK'
]

const SQL_FUNCTIONS = [
	'NOW()',
	'CURRENT_DATE',
	'CURRENT_TIME',
	'CURRENT_TIMESTAMP',
	'DATE()',
	'TIME()',
	'YEAR()',
	'MONTH()',
	'DAY()',
	'HOUR()',
	'MINUTE()',
	'SECOND()',
	'CONCAT()',
	'SUBSTRING()',
	'LENGTH()',
	'TRIM()',
	'UPPER()',
	'LOWER()',
	'COALESCE()',
	'IFNULL()',
	'NULLIF()',
	'GREATEST()',
	'LEAST()'
]

export default function MySQLSyntaxCheckerPage() {
	const [sqlQuery, setSqlQuery] = useState('')
	const [checkResult, setCheckResult] = useState<SyntaxCheckResult | null>(null)
	const [isChecking, setIsChecking] = useState(false)
	const [showLineNumbers, setShowLineNumbers] = useState(true)
	const [autoFormat, setAutoFormat] = useState(false)

	// Auto-check when query changes
	useEffect(() => {
		if (sqlQuery.trim()) {
			const timer = setTimeout(() => {
				checkSyntax()
			}, 1000)
			return () => clearTimeout(timer)
		} else {
			setCheckResult(null)
		}
	}, [sqlQuery])

	const checkSyntax = async () => {
		setIsChecking(true)

		setTimeout(() => {
			try {
				const result = validateSQLSyntax(sqlQuery)
				setCheckResult(result)
			} catch (error) {
				toast.error('Ошибка при проверке SQL синтаксиса')
				console.error('SQL syntax check error:', error)
			} finally {
				setIsChecking(false)
			}
		}, 300)
	}

	const validateSQLSyntax = (query: string): SyntaxCheckResult => {
		const errors: SQLError[] = []
		const warnings: SQLError[] = []

		// Clean and normalize query
		const lines = query.split('\n')
		const normalizedQuery = query.toUpperCase().replace(/\s+/g, ' ').trim()

		// Determine query type
		let queryType: QueryType = 'UNKNOWN'
		if (normalizedQuery.startsWith('SELECT')) queryType = 'SELECT'
		else if (normalizedQuery.startsWith('INSERT')) queryType = 'INSERT'
		else if (normalizedQuery.startsWith('UPDATE')) queryType = 'UPDATE'
		else if (normalizedQuery.startsWith('DELETE')) queryType = 'DELETE'
		else if (normalizedQuery.startsWith('CREATE')) queryType = 'CREATE'
		else if (normalizedQuery.startsWith('ALTER')) queryType = 'ALTER'
		else if (normalizedQuery.startsWith('DROP')) queryType = 'DROP'

		// Basic syntax validation
		let parenCount = 0
		let singleQuoteCount = 0
		let doubleQuoteCount = 0
		let inSingleQuote = false
		let inDoubleQuote = false

		for (let i = 0; i < lines.length; i++) {
			const line = lines[i]
			const lineNum = i + 1

			// Check for unmatched quotes and parentheses
			for (let j = 0; j < line.length; j++) {
				const char = line[j]
				const prevChar = j > 0 ? line[j - 1] : ''

				if (!inDoubleQuote && char === "'" && prevChar !== '\\') {
					inSingleQuote = !inSingleQuote
					singleQuoteCount += inSingleQuote ? 1 : -1
				}

				if (!inSingleQuote && char === '"' && prevChar !== '\\') {
					inDoubleQuote = !inDoubleQuote
					doubleQuoteCount += inDoubleQuote ? 1 : -1
				}

				if (!inSingleQuote && !inDoubleQuote) {
					if (char === '(') parenCount++
					else if (char === ')') parenCount--
				}
			}

			// Check for common errors
			const trimmedLine = line.trim().toUpperCase()

			// Missing semicolon at end (only for the last meaningful line)
			if (i === lines.length - 1 && line.trim() && !line.trim().endsWith(';')) {
				warnings.push({
					line: lineNum,
					column: line.length + 1,
					message: 'Missing semicolon at end of statement',
					severity: 'warning',
					type: 'syntax'
				})
			}

			// Check for invalid SQL keywords combinations
			if (trimmedLine.includes('SELECT') && trimmedLine.includes('FROM')) {
				const selectIndex = trimmedLine.indexOf('SELECT')
				const fromIndex = trimmedLine.indexOf('FROM')
				const between = trimmedLine.substring(selectIndex + 6, fromIndex).trim()

				if (!between && selectIndex < fromIndex) {
					errors.push({
						line: lineNum,
						column: fromIndex,
						message: 'Missing column specification in SELECT statement',
						severity: 'error',
						type: 'syntax'
					})
				}
			}

			// Check for malformed JOIN statements
			if (
				trimmedLine.includes('JOIN') &&
				!trimmedLine.includes('ON') &&
				!trimmedLine.includes('USING')
			) {
				const joinKeywords = [
					'INNER JOIN',
					'LEFT JOIN',
					'RIGHT JOIN',
					'FULL JOIN',
					'JOIN'
				]
				const hasJoin = joinKeywords.some(keyword =>
					trimmedLine.includes(keyword)
				)

				if (hasJoin && i < lines.length - 1) {
					const nextLine = lines[i + 1]?.trim().toUpperCase() || ''
					if (!nextLine.startsWith('ON') && !nextLine.startsWith('USING')) {
						errors.push({
							line: lineNum,
							column: line.indexOf('JOIN') + 1,
							message: 'JOIN clause missing ON or USING condition',
							severity: 'error',
							type: 'join'
						})
					}
				}
			}

			// Check for potential SQL injection patterns
			if (
				line.includes("'") &&
				line.includes('+') &&
				line.toLowerCase().includes('or')
			) {
				warnings.push({
					line: lineNum,
					column: line.indexOf("'") + 1,
					message: 'Potential SQL injection pattern detected',
					severity: 'warning',
					type: 'security'
				})
			}

			// Check for deprecated syntax
			if (trimmedLine.includes('!=')) {
				warnings.push({
					line: lineNum,
					column: line.indexOf('!=') + 1,
					message: "Use '<>' instead of '!=' for better compatibility",
					severity: 'info',
					type: 'style'
				})
			}

			// Check for missing WHERE in UPDATE/DELETE
			if (
				(trimmedLine.startsWith('UPDATE') ||
					trimmedLine.startsWith('DELETE')) &&
				!normalizedQuery.includes('WHERE')
			) {
				warnings.push({
					line: lineNum,
					column: 1,
					message: 'UPDATE/DELETE without WHERE clause affects all rows',
					severity: 'warning',
					type: 'logic'
				})
			}
		}

		// Check for unmatched parentheses and quotes
		if (parenCount !== 0) {
			errors.push({
				line: lines.length,
				column: 1,
				message:
					parenCount > 0
						? 'Missing closing parenthesis'
						: 'Extra closing parenthesis',
				severity: 'error',
				type: 'syntax'
			})
		}

		if (singleQuoteCount !== 0) {
			errors.push({
				line: lines.length,
				column: 1,
				message: 'Unmatched single quote',
				severity: 'error',
				type: 'syntax'
			})
		}

		if (doubleQuoteCount !== 0) {
			errors.push({
				line: lines.length,
				column: 1,
				message: 'Unmatched double quote',
				severity: 'error',
				type: 'syntax'
			})
		}

		// Extract query information
		const tables = extractTables(normalizedQuery)
		const columns = extractColumns(normalizedQuery)

		const queryInfo: QueryInfo = {
			type: queryType,
			tables,
			columns,
			hasWhere: normalizedQuery.includes('WHERE'),
			hasOrderBy: normalizedQuery.includes('ORDER BY'),
			hasGroupBy: normalizedQuery.includes('GROUP BY'),
			hasLimit: normalizedQuery.includes('LIMIT')
		}

		return {
			isValid: errors.length === 0,
			errors,
			warnings,
			queryInfo
		}
	}

	const extractTables = (query: string): string[] => {
		const tables: string[] = []

		// Extract FROM tables
		const fromMatch = query.match(/FROM\s+([^\s]+)/i)
		if (fromMatch) tables.push(fromMatch[1])

		// Extract JOIN tables
		const joinMatches = query.match(/JOIN\s+([^\s]+)/gi)
		if (joinMatches) {
			joinMatches.forEach(match => {
				const table = match.replace(/JOIN\s+/i, '')
				if (!tables.includes(table)) tables.push(table)
			})
		}

		return tables
	}

	const extractColumns = (query: string): string[] => {
		const columns: string[] = []

		if (query.startsWith('SELECT')) {
			const selectPart = query.match(/SELECT\s+(.*?)\s+FROM/i)
			if (selectPart) {
				const columnsStr = selectPart[1]
				if (columnsStr !== '*') {
					const columnList = columnsStr.split(',').map(col => col.trim())
					columns.push(...columnList)
				}
			}
		}

		return columns
	}

	const formatSQL = () => {
		// Basic SQL formatting
		const formatted = sqlQuery
			.replace(/\bSELECT\b/gi, 'SELECT')
			.replace(/\bFROM\b/gi, '\nFROM')
			.replace(/\bWHERE\b/gi, '\nWHERE')
			.replace(/\bORDER BY\b/gi, '\nORDER BY')
			.replace(/\bGROUP BY\b/gi, '\nGROUP BY')
			.replace(/\bHAVING\b/gi, '\nHAVING')
			.replace(/\bLIMIT\b/gi, '\nLIMIT')
			.replace(/\bJOIN\b/gi, '\nJOIN')
			.replace(/\bLEFT JOIN\b/gi, '\nLEFT JOIN')
			.replace(/\bRIGHT JOIN\b/gi, '\nRIGHT JOIN')
			.replace(/\bINNER JOIN\b/gi, '\nINNER JOIN')

		setSqlQuery(formatted)
		toast.success('SQL отформатирован')
	}

	const loadExample = (type: keyof typeof SQL_EXAMPLES) => {
		setSqlQuery(SQL_EXAMPLES[type])
		toast.success('Пример загружен')
	}

	const clearQuery = () => {
		setSqlQuery('')
		setCheckResult(null)
		toast.success('Запрос очищен')
	}

	const copyQuery = () => {
		navigator.clipboard.writeText(sqlQuery)
		toast.success('SQL запрос скопирован в буфер обмена!')
	}

	const getErrorIcon = (severity: ErrorSeverity) => {
		switch (severity) {
			case 'error':
				return <XCircle className='w-4 h-4 text-red-500' />
			case 'warning':
				return <AlertCircle className='w-4 h-4 text-yellow-500' />
			case 'info':
				return <Info className='w-4 h-4 text-blue-500' />
		}
	}

	return (
		<div className='max-w-7xl mx-auto space-y-6'>
			{/* Controls */}
			<Card className='p-4'>
				<div className='flex items-center justify-between flex-wrap gap-4'>
					<div className='flex items-center gap-4'>
						<Button
							onClick={() => setShowLineNumbers(!showLineNumbers)}
							variant='outline'
							size='sm'
						>
							<Eye className='w-4 h-4 mr-2' />
							{showLineNumbers ? 'Скрыть номера' : 'Показать номера'}
						</Button>

						<Button onClick={formatSQL} variant='outline' size='sm'>
							<Terminal className='w-4 h-4 mr-2' />
							Форматировать SQL
						</Button>
					</div>

					<div className='flex items-center gap-2'>
						<Button
							onClick={() => loadExample('valid')}
							variant='outline'
							size='sm'
						>
							Валидный запрос
						</Button>
						<Button
							onClick={() => loadExample('invalid')}
							variant='outline'
							size='sm'
						>
							С ошибками
						</Button>
						<Button
							onClick={() => loadExample('complex')}
							variant='outline'
							size='sm'
						>
							Сложный запрос
						</Button>
						<Button onClick={copyQuery} variant='outline' size='sm'>
							<Copy className='w-4 h-4 mr-2' />
							Копировать
						</Button>
						<Button onClick={clearQuery} variant='outline' size='sm'>
							<RefreshCw className='w-4 h-4 mr-2' />
							Очистить
						</Button>
					</div>
				</div>
			</Card>

			{/* SQL Editor */}
			<Card className='p-6'>
				<Label htmlFor='sql-query' className='mb-2 block'>
					SQL запрос
				</Label>
				<div className='relative'>
					<Textarea
						id='sql-query'
						value={sqlQuery}
						onChange={e => setSqlQuery(e.target.value)}
						placeholder='Введите ваш SQL запрос здесь...'
						className='min-h-96 font-mono text-sm'
						style={{
							lineHeight: '1.5',
							tabSize: 2
						}}
					/>
					{showLineNumbers && (
						<div className='absolute left-2 top-3 text-xs text-muted-foreground pointer-events-none select-none font-mono leading-6'>
							{sqlQuery.split('\n').map((_, index) => (
								<div key={index} className='h-6'>
									{index + 1}
								</div>
							))}
						</div>
					)}
				</div>

				{isChecking && (
					<div className='mt-4 flex items-center gap-2 text-sm text-muted-foreground'>
						<RefreshCw className='w-4 h-4 animate-spin' />
						Проверка синтаксиса...
					</div>
				)}
			</Card>

			{/* Results */}
			{checkResult && (
				<>
					{/* Status */}
					<Card className='p-4'>
						<div className='flex items-center justify-between'>
							<div className='flex items-center gap-3'>
								{checkResult.isValid ? (
									<>
										<CheckCircle className='w-6 h-6 text-green-500' />
										<div>
											<h3 className='font-semibold text-green-700 dark:text-green-400'>
												Синтаксис корректен
											</h3>
											<p className='text-sm text-muted-foreground'>
												SQL запрос прошел проверку
											</p>
										</div>
									</>
								) : (
									<>
										<XCircle className='w-6 h-6 text-red-500' />
										<div>
											<h3 className='font-semibold text-red-700 dark:text-red-400'>
												Найдены ошибки в запросе
											</h3>
											<p className='text-sm text-muted-foreground'>
												Обнаружено {checkResult.errors.length} ошибок
											</p>
										</div>
									</>
								)}
							</div>

							<div className='flex items-center gap-2'>
								<Badge variant='destructive'>
									{checkResult.errors.length} ошибок
								</Badge>
								<Badge variant='default'>
									{checkResult.warnings.length} предупреждений
								</Badge>
								<Badge variant='outline'>{checkResult.queryInfo.type}</Badge>
							</div>
						</div>
					</Card>

					{/* Query Info */}
					<Card className='p-6'>
						<h3 className='font-semibold mb-4 flex items-center gap-2'>
							<Info className='w-5 h-5' />
							Информация о запросе
						</h3>

						<div className='grid md:grid-cols-2 gap-6'>
							<div>
								<h4 className='font-medium mb-2'>Основные характеристики</h4>
								<div className='space-y-2 text-sm'>
									<div className='flex justify-between'>
										<span className='text-muted-foreground'>Тип запроса:</span>
										<Badge variant='outline'>
											{checkResult.queryInfo.type}
										</Badge>
									</div>
									<div className='flex justify-between'>
										<span className='text-muted-foreground'>Таблицы:</span>
										<span className='font-mono'>
											{checkResult.queryInfo.tables.length > 0
												? checkResult.queryInfo.tables.join(', ')
												: 'Не найдено'}
										</span>
									</div>
									<div className='flex justify-between'>
										<span className='text-muted-foreground'>Колонки:</span>
										<span className='font-mono text-right max-w-64 truncate'>
											{checkResult.queryInfo.columns.length > 0
												? checkResult.queryInfo.columns.join(', ')
												: 'Не найдено'}
										</span>
									</div>
								</div>
							</div>

							<div>
								<h4 className='font-medium mb-2'>Использованные конструкции</h4>
								<div className='space-y-2 text-sm'>
									<div className='flex justify-between'>
										<span className='text-muted-foreground'>
											WHERE условие:
										</span>
										<Badge
											variant={
												checkResult.queryInfo.hasWhere ? 'default' : 'outline'
											}
										>
											{checkResult.queryInfo.hasWhere ? 'Да' : 'Нет'}
										</Badge>
									</div>
									<div className='flex justify-between'>
										<span className='text-muted-foreground'>ORDER BY:</span>
										<Badge
											variant={
												checkResult.queryInfo.hasOrderBy ? 'default' : 'outline'
											}
										>
											{checkResult.queryInfo.hasOrderBy ? 'Да' : 'Нет'}
										</Badge>
									</div>
									<div className='flex justify-between'>
										<span className='text-muted-foreground'>GROUP BY:</span>
										<Badge
											variant={
												checkResult.queryInfo.hasGroupBy ? 'default' : 'outline'
											}
										>
											{checkResult.queryInfo.hasGroupBy ? 'Да' : 'Нет'}
										</Badge>
									</div>
									<div className='flex justify-between'>
										<span className='text-muted-foreground'>LIMIT:</span>
										<Badge
											variant={
												checkResult.queryInfo.hasLimit ? 'default' : 'outline'
											}
										>
											{checkResult.queryInfo.hasLimit ? 'Да' : 'Нет'}
										</Badge>
									</div>
								</div>
							</div>
						</div>
					</Card>

					{/* Error Details */}
					{(checkResult.errors.length > 0 ||
						checkResult.warnings.length > 0) && (
						<Card className='p-6'>
							<h3 className='font-semibold mb-4 flex items-center gap-2'>
								<Terminal className='w-5 h-5' />
								Детали проверки
							</h3>

							<div className='space-y-3 max-h-96 overflow-auto'>
								{[...checkResult.errors, ...checkResult.warnings]
									.sort((a, b) => a.line - b.line)
									.map((issue, index) => (
										<div
											key={index}
											className={cn(
												'p-3 rounded-lg border-l-4 bg-muted/30',
												issue.severity === 'error' &&
													'border-red-500 bg-red-50 dark:bg-red-950/20',
												issue.severity === 'warning' &&
													'border-yellow-500 bg-yellow-50 dark:bg-yellow-950/20',
												issue.severity === 'info' &&
													'border-blue-500 bg-blue-50 dark:bg-blue-950/20'
											)}
										>
											<div className='flex items-start gap-3'>
												{getErrorIcon(issue.severity)}
												<div className='flex-1 min-w-0'>
													<div className='flex items-center gap-2 mb-1'>
														<Badge variant='outline' className='text-xs'>
															Строка {issue.line}
														</Badge>
														<Badge variant='outline' className='text-xs'>
															{issue.type}
														</Badge>
													</div>
													<p className='text-sm font-medium'>{issue.message}</p>
												</div>
											</div>
										</div>
									))}
							</div>
						</Card>
					)}
				</>
			)}

			{!checkResult && !isChecking && (
				<Card className='p-6'>
					<div className='flex items-center justify-center h-40 text-muted-foreground'>
						<div className='text-center'>
							<FileText className='w-12 h-12 mx-auto mb-3 opacity-50' />
							<p>Введите SQL запрос для проверки синтаксиса</p>
							<p className='text-sm mt-2'>
								Результат будет показан автоматически
							</p>
						</div>
					</div>
				</Card>
			)}

			{/* SQL Reference */}
			<Card className='p-6 bg-muted/50'>
				<h3 className='font-semibold mb-4 flex items-center gap-2'>
					<Lightbulb className='w-4 h-4' />
					Справочник SQL
				</h3>
				<div className='grid md:grid-cols-2 gap-6 text-sm'>
					<div>
						<h4 className='font-medium mb-2'>Основные ключевые слова</h4>
						<div className='flex flex-wrap gap-1'>
							{SQL_KEYWORDS.slice(0, 15).map((keyword, index) => (
								<Badge key={index} variant='outline' className='text-xs'>
									{keyword}
								</Badge>
							))}
						</div>
					</div>
					<div>
						<h4 className='font-medium mb-2'>Популярные функции</h4>
						<div className='flex flex-wrap gap-1'>
							{SQL_FUNCTIONS.slice(0, 12).map((func, index) => (
								<Badge key={index} variant='outline' className='text-xs'>
									{func}
								</Badge>
							))}
						</div>
					</div>
				</div>
			</Card>

			{/* Tips */}
			<Card className='p-6 bg-muted/50'>
				<h3 className='font-semibold mb-4 flex items-center gap-2'>
					<Info className='w-4 h-4' />О проверке SQL синтаксиса
				</h3>
				<div className='grid md:grid-cols-3 gap-6 text-sm'>
					<div>
						<h4 className='font-medium mb-2'>Что проверяется</h4>
						<ul className='text-muted-foreground space-y-1'>
							<li>• Синтаксические ошибки</li>
							<li>• Несбалансированные кавычки и скобки</li>
							<li>• Неправильные JOIN конструкции</li>
							<li>• Потенциально опасные запросы</li>
						</ul>
					</div>
					<div>
						<h4 className='font-medium mb-2'>Рекомендации</h4>
						<ul className='text-muted-foreground space-y-1'>
							<li>• Всегда используйте WHERE в UPDATE/DELETE</li>
							<li>• Предпочитайте &lt;&gt; вместо !=</li>
							<li>• Используйте LIMIT для больших выборок</li>
							<li>• Избегайте SELECT * в продакшене</li>
						</ul>
					</div>
					<div>
						<h4 className='font-medium mb-2'>Ограничения</h4>
						<ul className='text-muted-foreground space-y-1'>
							<li>• Базовая проверка синтаксиса</li>
							<li>• Не проверяет существование таблиц</li>
							<li>• Не выполняет запросы</li>
							<li>• Работает в браузере без БД</li>
						</ul>
					</div>
				</div>
			</Card>
		</div>
	)
}
