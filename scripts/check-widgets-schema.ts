#!/usr/bin/env tsx

import * as fs from 'fs'
import * as path from 'path'
import { widgets } from '../lib/constants/widgets'

interface SchemaCheckResult {
	widgetId: string
	widgetTitle: string
	hasPage: boolean
	hasWidgetSEOWrapper: boolean
	hasWidgetStructuredData: boolean
	hasLayout: boolean
	hasFAQs: boolean
	hasToolSpecificSchema: boolean
	schemaTypes: string[]
	issues: string[]
	warnings: string[]
}

const WIDGETS_DIR = path.join(process.cwd(), 'app/tools/(widgets)')

// Schema types that should be present for different widget categories
const EXPECTED_SCHEMAS: Record<string, string[]> = {
	css: ['SoftwareApplication', 'WebPage', 'HowTo'],
	html: ['SoftwareApplication', 'WebPage', 'HowTo'],
	javascript: ['SoftwareApplication', 'WebPage', 'HowTo'],
	text: ['SoftwareApplication', 'WebPage', 'HowTo'],
	generators: ['SoftwareApplication', 'WebPage', 'HowTo', 'CreativeWork'],
	security: ['SoftwareApplication', 'WebPage', 'HowTo', 'Service'],
	tools: ['SoftwareApplication', 'WebPage', 'HowTo']
}

function checkWidgetSchema(
	widgetPath: string,
	widgetDirName: string
): SchemaCheckResult {
	const widget = widgets.find(w => w.path === widgetDirName)
	const issues: string[] = []
	const warnings: string[] = []
	const schemaTypes: string[] = []

	if (!widget) {
		return {
			widgetId: widgetDirName,
			widgetTitle: 'Unknown',
			hasPage: false,
			hasWidgetSEOWrapper: false,
			hasWidgetStructuredData: false,
			hasLayout: false,
			hasFAQs: false,
			hasToolSpecificSchema: false,
			schemaTypes: [],
			issues: ['Widget not found in constants/widgets'],
			warnings: []
		}
	}

	// Check if page.tsx exists
	const pagePath = path.join(widgetPath, 'page.tsx')
	const hasPage = fs.existsSync(pagePath)
	if (!hasPage) {
		issues.push('Missing page.tsx')
		return {
			widgetId: widgetDirName,
			widgetTitle: widget.title || widget.id,
			hasPage,
			hasWidgetSEOWrapper: false,
			hasWidgetStructuredData: false,
			hasLayout: false,
			hasFAQs: false,
			hasToolSpecificSchema: false,
			schemaTypes: [],
			issues,
			warnings
		}
	}

	// Check page.tsx for WidgetSEOWrapper and WidgetStructuredData
	const pageContent = fs.readFileSync(pagePath, 'utf-8')
	const hasWidgetSEOWrapper = pageContent.includes('WidgetSEOWrapper')
	const hasWidgetStructuredData = pageContent.includes('WidgetStructuredData')

	if (!hasWidgetSEOWrapper && !hasWidgetStructuredData) {
		issues.push(
			'No Schema.org markup found (missing WidgetSEOWrapper/WidgetStructuredData)'
		)
	}

	// Check if WidgetSEOWrapper is imported
	if (hasWidgetSEOWrapper) {
		const hasImport =
			pageContent.includes("from '@/components/seo/WidgetSEOWrapper'") ||
			pageContent.includes('from "@/components/seo/WidgetSEOWrapper"')
		if (!hasImport) {
			issues.push('WidgetSEOWrapper used but not imported')
		}
		schemaTypes.push('SoftwareApplication', 'WebPage', 'HowTo')
	}

	if (hasWidgetStructuredData) {
		const hasImport =
			pageContent.includes("from '@/components/seo/WidgetStructuredData'") ||
			pageContent.includes('from "@/components/seo/WidgetStructuredData"')
		if (!hasImport) {
			issues.push('WidgetStructuredData used but not imported')
		}
		schemaTypes.push('SoftwareApplication', 'WebPage', 'HowTo')
	}

	// Check layout.tsx exists
	const layoutPath = path.join(widgetPath, 'layout.tsx')
	const hasLayout = fs.existsSync(layoutPath)

	// Check widget metadata
	const hasFAQs =
		(widget.faqs && widget.faqs.length > 0) ||
		pageContent.includes('faqs:') ||
		pageContent.includes('faq:')

	if (hasFAQs) {
		schemaTypes.push('FAQPage')
	}

	// Check for tool-specific schemas based on widget type
	let hasToolSpecificSchema = false

	// CreativeWork for generators/formatters
	if (
		widget.category === 'generators' ||
		widget.translationKey.includes('generator') ||
		widget.translationKey.includes('formatter')
	) {
		hasToolSpecificSchema = true
		if (!schemaTypes.includes('CreativeWork')) {
			schemaTypes.push('CreativeWork')
		}
	}

	// Service for calculators/converters
	if (
		widget.category === 'tools' ||
		widget.translationKey.includes('calculator') ||
		widget.translationKey.includes('converter')
	) {
		hasToolSpecificSchema = true
		if (!schemaTypes.includes('Service')) {
			schemaTypes.push('Service')
		}
	}

	// DataCatalog for data tools
	if (
		widget.translationKey.includes('json') ||
		widget.translationKey.includes('xml') ||
		widget.translationKey.includes('yaml')
	) {
		hasToolSpecificSchema = true
		if (!schemaTypes.includes('DataCatalog')) {
			schemaTypes.push('DataCatalog')
		}
	}

	// ImageObject for image tools
	if (
		widget.category === 'tools' ||
		widget.translationKey.includes('image') ||
		widget.translationKey.includes('favicon')
	) {
		hasToolSpecificSchema = true
		if (!schemaTypes.includes('ImageObject')) {
			schemaTypes.push('ImageObject')
		}
	}

	// Warnings for missing optional but recommended schemas
	if (!hasFAQs) {
		warnings.push('No FAQs defined - consider adding FAQPage schema')
	}

	if (!hasLayout) {
		warnings.push('No layout.tsx - SEO metadata not server-rendered')
	}

	// Check expected schemas for category
	const expectedSchemas = EXPECTED_SCHEMAS[widget.category] || []
	const missingSchemas = expectedSchemas.filter(s => !schemaTypes.includes(s))
	if (missingSchemas.length > 0) {
		warnings.push(
			`Missing recommended schemas for ${widget.category} category: ${missingSchemas.join(', ')}`
		)
	}

	return {
		widgetId: widgetDirName,
		widgetTitle: widget.title || widget.id,
		hasPage,
		hasWidgetSEOWrapper,
		hasWidgetStructuredData,
		hasLayout,
		hasFAQs,
		hasToolSpecificSchema,
		schemaTypes: [...new Set(schemaTypes)],
		issues,
		warnings
	}
}

function main() {
	console.log('🔍 Checking Schema.org structured data for all widgets...\n')

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

	const results: SchemaCheckResult[] = []
	const criticalIssues: { [key: string]: string[] } = {}
	const warningIssues: { [key: string]: string[] } = {}

	for (const widgetDir of widgetDirs) {
		const widgetPath = path.join(WIDGETS_DIR, widgetDir)
		const result = checkWidgetSchema(widgetPath, widgetDir)
		results.push(result)

		if (result.issues.length > 0) {
			criticalIssues[widgetDir] = result.issues
		}
		if (result.warnings.length > 0) {
			warningIssues[widgetDir] = result.warnings
		}
	}

	// Summary statistics
	const stats = {
		total: results.length,
		withSchema: results.filter(
			r => r.hasWidgetSEOWrapper || r.hasWidgetStructuredData
		).length,
		withSEOWrapper: results.filter(r => r.hasWidgetSEOWrapper).length,
		withStructuredData: results.filter(r => r.hasWidgetStructuredData).length,
		withFAQs: results.filter(r => r.hasFAQs).length,
		withToolSpecificSchema: results.filter(r => r.hasToolSpecificSchema).length,
		withCriticalIssues: Object.keys(criticalIssues).length,
		withWarnings: Object.keys(warningIssues).length
	}

	// Print summary
	console.log('📊 Schema.org Markup Summary:')
	console.log('─────────────────────────────────────────')
	console.log(`Total widgets: ${stats.total}`)
	console.log(
		`✅ With Schema.org markup: ${stats.withSchema} (${Math.round((stats.withSchema / stats.total) * 100)}%)`
	)
	console.log(
		`✅ With WidgetSEOWrapper: ${stats.withSEOWrapper} (${Math.round((stats.withSEOWrapper / stats.total) * 100)}%)`
	)
	console.log(
		`✅ With WidgetStructuredData: ${stats.withStructuredData} (${Math.round((stats.withStructuredData / stats.total) * 100)}%)`
	)
	console.log(
		`✅ With FAQs: ${stats.withFAQs} (${Math.round((stats.withFAQs / stats.total) * 100)}%)`
	)
	console.log(
		`✅ With tool-specific schemas: ${stats.withToolSpecificSchema} (${Math.round((stats.withToolSpecificSchema / stats.total) * 100)}%)`
	)
	console.log(
		`⚠️  With critical issues: ${stats.withCriticalIssues} (${Math.round((stats.withCriticalIssues / stats.total) * 100)}%)`
	)
	console.log(
		`⚠️  With warnings: ${stats.withWarnings} (${Math.round((stats.withWarnings / stats.total) * 100)}%)`
	)
	console.log('─────────────────────────────────────────\n')

	// Schema type distribution
	console.log('📋 Schema Type Distribution:')
	const schemaTypeCount: Record<string, number> = {}
	results.forEach(r => {
		r.schemaTypes.forEach(type => {
			schemaTypeCount[type] = (schemaTypeCount[type] || 0) + 1
		})
	})
	Object.entries(schemaTypeCount)
		.sort((a, b) => b[1] - a[1])
		.forEach(([type, count]) => {
			console.log(
				`  ${type}: ${count} widgets (${Math.round((count / stats.total) * 100)}%)`
			)
		})
	console.log()

	// Print critical issues
	if (Object.keys(criticalIssues).length > 0) {
		console.log('🚨 Critical Issues:\n')

		const issuesByType: { [key: string]: string[] } = {}
		for (const [widgetId, widgetIssues] of Object.entries(criticalIssues)) {
			for (const issue of widgetIssues) {
				if (!issuesByType[issue]) {
					issuesByType[issue] = []
				}
				issuesByType[issue].push(widgetId)
			}
		}

		const sortedIssues = Object.entries(issuesByType).sort(
			(a, b) => b[1].length - a[1].length
		)

		for (const [issue, widgetIds] of sortedIssues) {
			console.log(`📌 ${issue} (${widgetIds.length} widgets):`)
			widgetIds.slice(0, 10).forEach(id => console.log(`   - ${id}`))
			if (widgetIds.length > 10) {
				console.log(`   ... and ${widgetIds.length - 10} more`)
			}
			console.log()
		}
	}

	// Print warnings
	if (Object.keys(warningIssues).length > 0) {
		console.log('⚠️  Warnings (Recommendations):\n')

		const warningsByType: { [key: string]: string[] } = {}
		for (const [widgetId, widgetWarnings] of Object.entries(warningIssues)) {
			for (const warning of widgetWarnings) {
				if (!warningsByType[warning]) {
					warningsByType[warning] = []
				}
				warningsByType[warning].push(widgetId)
			}
		}

		const sortedWarnings = Object.entries(warningsByType).sort(
			(a, b) => b[1].length - a[1].length
		)

		for (const [warning, widgetIds] of sortedWarnings) {
			console.log(`💡 ${warning} (${widgetIds.length} widgets)`)
			if (widgetIds.length <= 5) {
				widgetIds.forEach(id => console.log(`   - ${id}`))
			}
			console.log()
		}
	}

	// Widgets with excellent Schema.org implementation
	const excellentWidgets = results.filter(
		r =>
			r.hasWidgetSEOWrapper &&
			r.hasLayout &&
			r.issues.length === 0 &&
			r.schemaTypes.length >= 3
	)
	if (excellentWidgets.length > 0) {
		console.log('⭐ Widgets with Excellent Schema.org Implementation:\n')
		excellentWidgets.forEach(w => {
			console.log(`  ✅ ${w.widgetTitle} (${w.widgetId})`)
			console.log(`     Schemas: ${w.schemaTypes.join(', ')}`)
			if (w.hasFAQs) {
				console.log(`     + FAQPage`)
			}
		})
		console.log()
	}

	// Recommendations
	console.log('💡 Recommendations:\n')

	if (stats.withSchema < stats.total) {
		console.log(
			`1. Add Schema.org markup (WidgetSEOWrapper) to ${stats.total - stats.withSchema} widgets`
		)
	}

	if (stats.withFAQs < stats.total * 0.3) {
		console.log(
			`2. Add FAQs to more widgets (currently only ${stats.withFAQs} have FAQs)`
		)
	}

	if (stats.withToolSpecificSchema < stats.total * 0.5) {
		console.log(
			`3. Add tool-specific schemas (CreativeWork, Service, DataCatalog, etc.) to ${stats.total - stats.withToolSpecificSchema} widgets`
		)
	}

	console.log(
		'4. Use Google Rich Results Test to validate structured data: https://search.google.com/test/rich-results'
	)
	console.log(
		'5. Use Schema.org Validator to check compliance: https://validator.schema.org/'
	)

	console.log('\n✅ Schema.org check completed!\n')

	// Generate detailed report
	const reportPath = path.join(process.cwd(), 'WIDGET_SCHEMA_AUDIT.md')
	generateReport(results, stats, reportPath)
	console.log(`📄 Detailed report saved to: ${reportPath}\n`)

	// Exit with error if there are critical issues
	if (stats.withCriticalIssues > stats.total * 0.5) {
		console.log(
			'⚠️  More than 50% of widgets have critical Schema.org issues. Please address them.\n'
		)
		process.exit(1)
	}
}

function generateReport(
	results: SchemaCheckResult[],
	stats: any,
	reportPath: string
) {
	let report = '# Widget Schema.org Microdata Audit Report\n\n'
	report += `Generated: ${new Date().toISOString()}\n\n`

	report += '## Executive Summary\n\n'
	report += `- **Total Widgets**: ${stats.total}\n`
	report += `- **With Schema.org Markup**: ${stats.withSchema} (${Math.round((stats.withSchema / stats.total) * 100)}%)\n`
	report += `- **With FAQs**: ${stats.withFAQs} (${Math.round((stats.withFAQs / stats.total) * 100)}%)\n`
	report += `- **With Critical Issues**: ${stats.withCriticalIssues} (${Math.round((stats.withCriticalIssues / stats.total) * 100)}%)\n`
	report += `- **With Warnings**: ${stats.withWarnings} (${Math.round((stats.withWarnings / stats.total) * 100)}%)\n\n`

	report += '## Widgets Without Schema.org Markup\n\n'
	const widgetsWithoutSchema = results.filter(
		r => !r.hasWidgetSEOWrapper && !r.hasWidgetStructuredData
	)
	if (widgetsWithoutSchema.length > 0) {
		widgetsWithoutSchema.forEach(w => {
			report += `- **${w.widgetTitle}** (\`${w.widgetId}\`)\n`
		})
	} else {
		report += '✅ All widgets have Schema.org markup!\n'
	}
	report += '\n'

	report += '## Widgets With Excellent Implementation\n\n'
	const excellentWidgets = results.filter(
		r =>
			r.hasWidgetSEOWrapper &&
			r.hasLayout &&
			r.issues.length === 0 &&
			r.schemaTypes.length >= 3
	)
	if (excellentWidgets.length > 0) {
		excellentWidgets.forEach(w => {
			report += `### ${w.widgetTitle} (\`${w.widgetId}\`)\n\n`
			report += `**Schema Types**: ${w.schemaTypes.join(', ')}\n\n`
			if (w.hasFAQs) {
				report += '**Has FAQs**: ✅\n\n'
			}
		})
	} else {
		report += 'No widgets meet the excellent criteria yet.\n\n'
	}

	report += '## Schema Type Coverage\n\n'
	const schemaTypeCount: Record<string, number> = {}
	results.forEach(r => {
		r.schemaTypes.forEach(type => {
			schemaTypeCount[type] = (schemaTypeCount[type] || 0) + 1
		})
	})
	Object.entries(schemaTypeCount)
		.sort((a, b) => b[1] - a[1])
		.forEach(([type, count]) => {
			report += `- **${type}**: ${count} widgets (${Math.round((count / stats.total) * 100)}%)\n`
		})
	report += '\n'

	report += '## Critical Issues by Widget\n\n'
	const widgetsWithIssues = results.filter(r => r.issues.length > 0)
	if (widgetsWithIssues.length > 0) {
		widgetsWithIssues.forEach(w => {
			report += `### ${w.widgetTitle} (\`${w.widgetId}\`)\n\n`
			w.issues.forEach(issue => {
				report += `- 🚨 ${issue}\n`
			})
			report += '\n'
		})
	} else {
		report += '✅ No critical issues found!\n\n'
	}

	report += '## Recommendations\n\n'
	report += '### Priority 1: Add Schema.org Markup\n\n'
	if (widgetsWithoutSchema.length > 0) {
		report += `${widgetsWithoutSchema.length} widgets need WidgetSEOWrapper added.\n\n`
		report += '**Template for adding WidgetSEOWrapper**:\n\n'
		report += '```tsx\n'
		report +=
			"import { WidgetSEOWrapper } from '@/components/seo/WidgetSEOWrapper'\n"
		report += "import { getWidgetByPath } from '@/lib/constants/widgets'\n\n"
		report += "const widget = getWidgetByPath('your-widget-path')!\n\n"
		report += 'export default function YourWidget() {\n'
		report += '  return (\n'
		report += "    <WidgetSEOWrapper widget={widget} locale='ru'>\n"
		report += '      {/* Your widget content */}\n'
		report += '    </WidgetSEOWrapper>\n'
		report += '  )\n'
		report += '}\n'
		report += '```\n\n'
	} else {
		report += '✅ All widgets have Schema.org markup.\n\n'
	}

	report += '### Priority 2: Add FAQs\n\n'
	const widgetsWithoutFAQs = results.filter(r => !r.hasFAQs)
	report += `${widgetsWithoutFAQs.length} widgets would benefit from FAQPage schema.\n\n`
	report += 'Add FAQs to widget definitions in `lib/constants/widgets/`:\n\n'
	report += '```typescript\n'
	report += '{\n'
	report += "  id: 'your-widget',\n"
	report += '  // ... other fields\n'
	report += '  faqs: [\n'
	report += '    {\n'
	report += "      question: 'How does this work?',\n"
	report += "      answer: 'This tool works by...'\n"
	report += '    }\n'
	report += '  ]\n'
	report += '}\n'
	report += '```\n\n'

	report += '### Priority 3: Validation\n\n'
	report +=
		'1. Test with [Google Rich Results Test](https://search.google.com/test/rich-results)\n'
	report +=
		'2. Validate with [Schema.org Validator](https://validator.schema.org/)\n'
	report +=
		'3. Check [Google Search Console](https://search.google.com/search-console) for structured data errors\n\n'

	report += '---\n\n'
	report += '*Generated by check-widgets-schema.ts*\n'

	fs.writeFileSync(reportPath, report, 'utf-8')
}

main()
