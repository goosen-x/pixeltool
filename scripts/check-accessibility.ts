#!/usr/bin/env tsx

import { readFileSync } from 'fs'
import { glob } from 'glob'

interface A11yIssue {
	file: string
	line: number
	issue: string
	severity: 'high' | 'medium' | 'low'
	suggestion: string
}

const ACCESSIBILITY_PATTERNS = [
	{
		pattern: /<img(?![^>]*alt=)/gi,
		message: 'Image without alt attribute',
		severity: 'high' as const,
		suggestion: 'Add alt="" for decorative images or descriptive alt text'
	},
	{
		pattern: /<button[^>]*onClick[^>]*>(?!.*aria-label)(?!.*title)/gi,
		message: 'Button without accessible label',
		severity: 'medium' as const,
		suggestion: 'Add aria-label or ensure visible text content'
	},
	{
		pattern: /<input(?![^>]*aria-label)(?![^>]*placeholder)/gi,
		message: 'Input without label or aria-label',
		severity: 'high' as const,
		suggestion: 'Add aria-label, placeholder, or associate with label'
	},
	{
		pattern: /<div[^>]*role="button"[^>]*>(?![^>]*tabIndex)/gi,
		message: 'Interactive div without tabIndex',
		severity: 'medium' as const,
		suggestion: 'Add tabIndex="0" for keyboard accessibility'
	},
	{
		pattern: /onClick.*(?!onKeyDown|onKeyPress|onKeyUp)/gi,
		message: 'onClick without keyboard event handler',
		severity: 'medium' as const,
		suggestion: 'Add onKeyDown handler for Enter/Space keys'
	},
	{
		pattern: /<a[^>]*href="#"[^>]*>/gi,
		message: 'Link with href="#" (accessibility issue)',
		severity: 'low' as const,
		suggestion: 'Use button element for actions or proper href for links'
	},
	{
		pattern: /autoFocus/gi,
		message: 'AutoFocus usage (can be disorienting)',
		severity: 'low' as const,
		suggestion: 'Consider manual focus management or remove autoFocus'
	}
]

const COLOR_CONTRAST_PATTERNS = [
	{
		pattern: /text-gray-300|text-gray-400/gi,
		message: 'Light gray text (potential contrast issue)',
		severity: 'medium' as const,
		suggestion: 'Check color contrast ratio against background'
	},
	{
		pattern: /bg-yellow-100.*text-yellow-600/gi,
		message: 'Yellow on yellow (potential contrast issue)',
		severity: 'medium' as const,
		suggestion: 'Verify sufficient contrast ratio (4.5:1 minimum)'
	}
]

async function checkAccessibility(): Promise<void> {
	console.log('♿ Running accessibility checks...')

	const issues: A11yIssue[] = []

	// Get all component files
	const files = glob.sync('**/*.{tsx,jsx}', {
		ignore: [
			'node_modules/**',
			'.next/**',
			'dist/**',
			'**/*.d.ts',
			'scripts/**',
			'__tests__/**'
		]
	})

	console.log(`📁 Analyzing ${files.length} component files...`)

	for (const file of files) {
		try {
			const content = readFileSync(file, 'utf8')
			const lines = content.split('\n')

			lines.forEach((line, index) => {
				// Check accessibility patterns
				ACCESSIBILITY_PATTERNS.forEach(
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

				// Check color contrast patterns
				COLOR_CONTRAST_PATTERNS.forEach(
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

	// Check for semantic HTML usage
	console.log('🏗️  Checking semantic HTML usage...')
	files.forEach(file => {
		try {
			const content = readFileSync(file, 'utf8')

			// Check for semantic elements
			const hasSemanticElements =
				/\b(main|article|section|nav|header|footer|aside)\b/i.test(content)
			const hasDivs = /<div/gi.test(content)

			if (hasDivs && !hasSemanticElements && !file.includes('/ui/')) {
				issues.push({
					file,
					line: 1,
					issue: 'Component uses divs without semantic HTML elements',
					severity: 'low',
					suggestion:
						'Consider using semantic elements like <main>, <section>, <article>'
				})
			}
		} catch (error) {
			// Ignore
		}
	})

	// Report results
	console.log('\n♿ Accessibility Analysis Results:')

	if (issues.length === 0) {
		console.log('✅ No accessibility issues detected!')
		console.log('🎉 Great job maintaining accessible code!')
		return
	}

	const highIssues = issues.filter(i => i.severity === 'high')
	const mediumIssues = issues.filter(i => i.severity === 'medium')
	const lowIssues = issues.filter(i => i.severity === 'low')

	console.log(`🔍 Found ${issues.length} potential accessibility issue(s):`)
	console.log(`   🔴 High: ${highIssues.length}`)
	console.log(`   🟡 Medium: ${mediumIssues.length}`)
	console.log(`   🔵 Low: ${lowIssues.length}`)

	// Show high priority issues
	if (highIssues.length > 0) {
		console.log('\n🔴 High Priority Issues (WCAG Level A violations):')
		highIssues.forEach(issue => {
			console.log(`   ${issue.file}:${issue.line} - ${issue.issue}`)
			console.log(`      💡 ${issue.suggestion}`)
		})
	}

	// Show medium priority issues (limited)
	if (mediumIssues.length > 0) {
		console.log('\n🟡 Medium Priority Issues (WCAG Level AA):')
		mediumIssues.slice(0, 10).forEach(issue => {
			console.log(`   ${issue.file}:${issue.line} - ${issue.issue}`)
			console.log(`      💡 ${issue.suggestion}`)
		})
		if (mediumIssues.length > 10) {
			console.log(`   ... and ${mediumIssues.length - 10} more medium issues`)
		}
	}

	// Accessibility guidelines
	console.log('\n📋 Accessibility Guidelines Reminder:')
	console.log('   ✅ Use semantic HTML elements')
	console.log('   ✅ Provide alt text for images')
	console.log('   ✅ Ensure sufficient color contrast (4.5:1)')
	console.log('   ✅ Make interactive elements keyboard accessible')
	console.log('   ✅ Use ARIA labels where needed')
	console.log('   ✅ Test with screen readers')
	console.log('   ✅ Support focus management')

	// Tools recommendations
	console.log('\n🛠️  Recommended Tools:')
	console.log('   • axe-core browser extension')
	console.log('   • WAVE accessibility evaluator')
	console.log('   • Color contrast analyzers')
	console.log('   • Screen reader testing (NVDA, JAWS)')

	// Exit with error code if high severity issues found
	if (highIssues.length > 0) {
		console.log('\n❌ High priority accessibility issues found!')
		console.log('♿ Please fix these issues to ensure inclusive design')
		process.exit(1)
	}
}

if (require.main === module) {
	checkAccessibility().catch(console.error)
}

export { checkAccessibility }
