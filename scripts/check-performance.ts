#!/usr/bin/env tsx

import { execSync } from 'child_process'
import { readFileSync, existsSync } from 'fs'
import { glob } from 'glob'

interface PerformanceIssue {
	file: string
	line?: number
	issue: string
	severity: 'high' | 'medium' | 'low'
	suggestion: string
}

const PERFORMANCE_PATTERNS = [
	{
		pattern: /console\.log\(/gi,
		message: 'Console.log calls in production',
		severity: 'medium' as const,
		suggestion: 'Remove console.log or use conditional logging'
	},
	{
		pattern: /\.forEach\(/gi,
		message: 'forEach usage (consider map/filter for better performance)',
		severity: 'low' as const,
		suggestion: 'Use map/filter for functional operations'
	},
	{
		pattern: /document\.querySelector(?!All)/gi,
		message: 'Direct DOM queries (use React refs instead)',
		severity: 'medium' as const,
		suggestion: 'Use useRef or event handlers instead of DOM queries'
	},
	{
		pattern: /setInterval\(/gi,
		message: 'setInterval usage (potential memory leak)',
		severity: 'medium' as const,
		suggestion: 'Use useEffect cleanup or clearInterval'
	},
	{
		pattern: /new Date\(\)/gi,
		message: 'Date object creation in render',
		severity: 'low' as const,
		suggestion: 'Move outside render or use useMemo'
	}
]

async function checkPerformance(): Promise<void> {
	console.log('⚡ Running performance checks...')

	const issues: PerformanceIssue[] = []

	// Check JavaScript/TypeScript files
	const files = glob.sync('**/*.{ts,tsx,js,jsx}', {
		ignore: [
			'node_modules/**',
			'.next/**',
			'dist/**',
			'**/*.d.ts',
			'scripts/**'
		]
	})

	console.log(`📁 Analyzing ${files.length} files...`)

	for (const file of files) {
		try {
			const content = readFileSync(file, 'utf8')
			const lines = content.split('\n')

			lines.forEach((line, index) => {
				PERFORMANCE_PATTERNS.forEach(
					({ pattern, message, severity, suggestion }) => {
						if (pattern.test(line)) {
							issues.push({
								file,
								line: index + 1,
								issue: message,
								severity,
								suggestion
							})
						}
					}
				)
			})
		} catch (error) {
			console.log(`⚠️  Could not read file ${file}:`, error)
		}
	}

	// Check bundle size (if build exists)
	if (existsSync('.next')) {
		console.log('📦 Checking bundle size...')
		try {
			const bundleAnalysis = execSync(
				'npx next build --dry-run 2>&1 || echo "Build check failed"',
				{
					encoding: 'utf8',
					timeout: 30000
				}
			)

			if (
				bundleAnalysis.includes('Error') ||
				bundleAnalysis.includes('failed')
			) {
				issues.push({
					file: 'Build System',
					issue: 'Build analysis failed',
					severity: 'high',
					suggestion: 'Fix build errors before performance analysis'
				})
			}
		} catch (error) {
			console.log('⚠️  Bundle analysis failed')
		}
	}

	// Check for large files
	console.log('📄 Checking file sizes...')
	files.forEach(file => {
		try {
			const stats = require('fs').statSync(file)
			const sizeInKB = stats.size / 1024

			if (sizeInKB > 100) {
				issues.push({
					file,
					issue: `Large file size: ${sizeInKB.toFixed(1)}KB`,
					severity: 'medium',
					suggestion: 'Consider splitting into smaller modules'
				})
			}
		} catch (error) {
			// Ignore file size check errors
		}
	})

	// Check for unused imports/exports
	console.log('🔍 Checking for unused code...')
	try {
		const unusedCode = execSync(
			'npx ts-prune 2>/dev/null || echo "No unused exports found"',
			{
				encoding: 'utf8',
				timeout: 15000
			}
		)

		if (unusedCode.includes('used in module')) {
			const unusedCount = (unusedCode.match(/used in module/g) || []).length
			issues.push({
				file: 'Code Analysis',
				issue: `${unusedCount} potential unused exports found`,
				severity: 'low',
				suggestion: 'Run `npx ts-prune` for details and remove unused code'
			})
		}
	} catch (error) {
		// ts-prune not available, skip
	}

	// Report results
	console.log('\n📊 Performance Analysis Results:')

	if (issues.length === 0) {
		console.log('✅ No performance issues detected!')
		return
	}

	const highIssues = issues.filter(i => i.severity === 'high')
	const mediumIssues = issues.filter(i => i.severity === 'medium')
	const lowIssues = issues.filter(i => i.severity === 'low')

	console.log(`🔍 Found ${issues.length} potential performance issue(s):`)
	console.log(`   🔴 High: ${highIssues.length}`)
	console.log(`   🟡 Medium: ${mediumIssues.length}`)
	console.log(`   🔵 Low: ${lowIssues.length}`)

	// Show high priority issues
	if (highIssues.length > 0) {
		console.log('\n🔴 High Priority Issues:')
		highIssues.forEach(issue => {
			console.log(
				`   ${issue.file}${issue.line ? `:${issue.line}` : ''} - ${issue.issue}`
			)
			console.log(`      💡 ${issue.suggestion}`)
		})
	}

	// Show medium priority issues (limited)
	if (mediumIssues.length > 0) {
		console.log('\n🟡 Medium Priority Issues:')
		mediumIssues.slice(0, 10).forEach(issue => {
			console.log(
				`   ${issue.file}${issue.line ? `:${issue.line}` : ''} - ${issue.issue}`
			)
			console.log(`      💡 ${issue.suggestion}`)
		})
		if (mediumIssues.length > 10) {
			console.log(`   ... and ${mediumIssues.length - 10} more medium issues`)
		}
	}

	// Performance recommendations
	console.log('\n🚀 Performance Recommendations:')
	console.log('   1. Use React.memo for expensive components')
	console.log('   2. Implement proper loading states')
	console.log('   3. Use Next.js Image component for images')
	console.log('   4. Implement code splitting with dynamic imports')
	console.log('   5. Use useMemo/useCallback for expensive operations')
	console.log('   6. Consider implementing virtual scrolling for long lists')

	// Core Web Vitals recommendations
	console.log('\n📈 Core Web Vitals Tips:')
	console.log('   • LCP: Optimize images and fonts')
	console.log('   • FID: Minimize JavaScript blocking time')
	console.log('   • CLS: Use proper dimensions for media')

	// Exit with warning code if high issues found
	if (highIssues.length > 0) {
		console.log('\n⚠️  High priority performance issues found!')
		process.exit(1)
	}
}

if (require.main === module) {
	checkPerformance().catch(console.error)
}

export { checkPerformance }
