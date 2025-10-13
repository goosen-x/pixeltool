#!/usr/bin/env tsx

import * as fs from 'fs'
import * as path from 'path'
import { widgets } from '../lib/constants/widgets'

interface SEOCheckResult {
	widgetId: string
	widgetTitle: string
	hasPage: boolean
	hasLayout: boolean
	hasGenerateMetadata: boolean
	hasWidgetSEOWrapper: boolean
	hasTitle: boolean
	hasDescription: boolean
	hasTags: boolean
	issues: string[]
}

const WIDGETS_DIR = path.join(process.cwd(), 'app/tools/(widgets)')

function checkWidgetSEO(widgetPath: string, widgetDirName: string): SEOCheckResult {
	// Find widget by path field, not id
	const widget = widgets.find(w => w.path === widgetDirName)
	const issues: string[] = []

	// Check if widget exists in constants
	if (!widget) {
		issues.push('Widget not found in constants/widgets (check path field)')
		return {
			widgetId: widgetDirName,
			widgetTitle: 'Unknown',
			hasPage: false,
			hasLayout: false,
			hasGenerateMetadata: false,
			hasWidgetSEOWrapper: false,
			hasTitle: false,
			hasDescription: false,
			hasTags: false,
			issues
		}
	}

	// Check page.tsx exists
	const pagePath = path.join(widgetPath, 'page.tsx')
	const hasPage = fs.existsSync(pagePath)
	if (!hasPage) {
		issues.push('Missing page.tsx')
	}

	// Check layout.tsx exists
	const layoutPath = path.join(widgetPath, 'layout.tsx')
	const hasLayout = fs.existsSync(layoutPath)
	if (!hasLayout) {
		issues.push('Missing layout.tsx (no generateMetadata)')
	}

	// Check if layout has generateMetadata
	let hasGenerateMetadata = false
	if (hasLayout) {
		const layoutContent = fs.readFileSync(layoutPath, 'utf-8')
		hasGenerateMetadata = layoutContent.includes('generateMetadata')
		if (!hasGenerateMetadata) {
			issues.push('layout.tsx exists but missing generateMetadata export')
		}
	}

	// Check if page.tsx has WidgetSEOWrapper
	let hasWidgetSEOWrapper = false
	if (hasPage) {
		const pageContent = fs.readFileSync(pagePath, 'utf-8')
		hasWidgetSEOWrapper = pageContent.includes('WidgetSEOWrapper')
		if (!hasWidgetSEOWrapper) {
			issues.push('page.tsx missing WidgetSEOWrapper')
		}
	}

	// Check widget metadata
	const hasTitle = !!widget.title && widget.title.length > 0
	const hasDescription = !!widget.description && widget.description.length > 0
	const hasTags = !!widget.tags && widget.tags.length > 0

	if (!hasTitle) {
		issues.push('Missing widget title')
	}
	if (!hasDescription) {
		issues.push('Missing widget description')
	}
	if (!hasTags) {
		issues.push('Missing widget tags')
	}

	// Check title length
	if (hasTitle && widget.title!.length < 10) {
		issues.push('Title too short (< 10 chars)')
	}
	if (hasTitle && widget.title!.length > 60) {
		issues.push('Title too long (> 60 chars)')
	}

	// Check description length
	if (hasDescription && widget.description!.length < 50) {
		issues.push('Description too short (< 50 chars)')
	}
	if (hasDescription && widget.description!.length > 160) {
		issues.push('Description too long (> 160 chars)')
	}

	return {
		widgetId: widgetDirName,
		widgetTitle: widget.title || widget.id,
		hasPage,
		hasLayout,
		hasGenerateMetadata,
		hasWidgetSEOWrapper,
		hasTitle,
		hasDescription,
		hasTags,
		issues
	}
}

function main() {
	console.log('🔍 Checking SEO and metadata for all widgets...\n')

	const widgetDirs = fs
		.readdirSync(WIDGETS_DIR)
		.filter(name => {
			const fullPath = path.join(WIDGETS_DIR, name)
			return (
				fs.statSync(fullPath).isDirectory() &&
				!name.startsWith('_') &&
				!name.startsWith('[')
			)
		})
		.sort()

	const results: SEOCheckResult[] = []
	const issues: { [key: string]: string[] } = {}

	for (const widgetDir of widgetDirs) {
		const widgetPath = path.join(WIDGETS_DIR, widgetDir)
		const result = checkWidgetSEO(widgetPath, widgetDir)
		results.push(result)

		if (result.issues.length > 0) {
			issues[widgetDir] = result.issues
		}
	}

	// Summary statistics
	const stats = {
		total: results.length,
		withLayout: results.filter(r => r.hasLayout).length,
		withGenerateMetadata: results.filter(r => r.hasGenerateMetadata).length,
		withWidgetSEOWrapper: results.filter(r => r.hasWidgetSEOWrapper).length,
		withTitle: results.filter(r => r.hasTitle).length,
		withDescription: results.filter(r => r.hasDescription).length,
		withTags: results.filter(r => r.hasTags).length,
		withIssues: Object.keys(issues).length
	}

	// Print summary
	console.log('📊 Summary Statistics:')
	console.log('─────────────────────────────────────────')
	console.log(`Total widgets: ${stats.total}`)
	console.log(
		`✅ With layout.tsx: ${stats.withLayout} (${Math.round((stats.withLayout / stats.total) * 100)}%)`
	)
	console.log(
		`✅ With generateMetadata: ${stats.withGenerateMetadata} (${Math.round((stats.withGenerateMetadata / stats.total) * 100)}%)`
	)
	console.log(
		`✅ With WidgetSEOWrapper: ${stats.withWidgetSEOWrapper} (${Math.round((stats.withWidgetSEOWrapper / stats.total) * 100)}%)`
	)
	console.log(
		`✅ With title: ${stats.withTitle} (${Math.round((stats.withTitle / stats.total) * 100)}%)`
	)
	console.log(
		`✅ With description: ${stats.withDescription} (${Math.round((stats.withDescription / stats.total) * 100)}%)`
	)
	console.log(
		`✅ With tags: ${stats.withTags} (${Math.round((stats.withTags / stats.total) * 100)}%)`
	)
	console.log(
		`⚠️  With issues: ${stats.withIssues} (${Math.round((stats.withIssues / stats.total) * 100)}%)`
	)
	console.log('─────────────────────────────────────────\n')

	// Print issues by category
	if (Object.keys(issues).length > 0) {
		console.log('⚠️  Widgets with SEO issues:\n')

		const issuesByType: { [key: string]: string[] } = {}
		for (const [widgetId, widgetIssues] of Object.entries(issues)) {
			for (const issue of widgetIssues) {
				if (!issuesByType[issue]) {
					issuesByType[issue] = []
				}
				issuesByType[issue].push(widgetId)
			}
		}

		// Sort by number of widgets affected
		const sortedIssues = Object.entries(issuesByType).sort(
			(a, b) => b[1].length - a[1].length
		)

		for (const [issue, widgetIds] of sortedIssues) {
			console.log(`\n📌 ${issue} (${widgetIds.length} widgets):`)
			widgetIds.forEach(id => console.log(`   - ${id}`))
		}
		console.log('\n')
	}

	// Recommendations
	console.log('💡 Recommendations:\n')
	if (stats.withLayout < stats.total) {
		console.log(
			`1. Add layout.tsx with generateMetadata to ${stats.total - stats.withLayout} widgets`
		)
	}
	if (stats.withWidgetSEOWrapper < stats.total) {
		console.log(
			`2. Add WidgetSEOWrapper to ${stats.total - stats.withWidgetSEOWrapper} widgets`
		)
	}
	if (stats.withTitle < stats.total) {
		console.log(
			`3. Add titles to ${stats.total - stats.withTitle} widgets in widgets.ts`
		)
	}
	if (stats.withDescription < stats.total) {
		console.log(
			`4. Add descriptions to ${stats.total - stats.withDescription} widgets in widgets.ts`
		)
	}
	if (stats.withTags < stats.total) {
		console.log(
			`5. Add tags to ${stats.total - stats.withTags} widgets for better categorization`
		)
	}

	console.log('\n✅ SEO check completed!\n')

	// Exit with error if there are critical issues
	if (stats.withIssues > stats.total * 0.5) {
		console.log(
			'⚠️  More than 50% of widgets have SEO issues. Please address them.\n'
		)
		process.exit(1)
	}
}

main()
