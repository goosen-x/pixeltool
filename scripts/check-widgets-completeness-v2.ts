#!/usr/bin/env tsx
/**
 * Script to check if all widgets have:
 * - At least 3 recommended tools
 * - At least 5 FAQ entries
 *
 * Reads data from widgets.ts (the actual source of truth)
 */

import { widgets } from '../lib/constants/widgets'

interface IssueWidget {
	id: string
	title: string
	issues: string[]
	recommendedCount: number
	faqCount: number
}

const MIN_RECOMMENDED_TOOLS = 3
const MIN_FAQ_COUNT = 5

const issuesFound: IssueWidget[] = []

console.log('🔍 Checking all widgets for completeness...\n')

for (const widget of widgets) {
	const issues: string[] = []

	// Check recommended tools
	const recommendedCount = widget.recommendedTools?.length || 0
	if (recommendedCount < MIN_RECOMMENDED_TOOLS) {
		issues.push(
			`❌ Recommended tools: ${recommendedCount}/${MIN_RECOMMENDED_TOOLS} (need ${MIN_RECOMMENDED_TOOLS - recommendedCount} more)`
		)
	}

	// Check FAQ (data is in widgets.ts, not widget-faq.ts)
	const faqCount = widget.faqs?.length || 0
	if (faqCount < MIN_FAQ_COUNT) {
		issues.push(
			`❌ FAQ entries: ${faqCount}/${MIN_FAQ_COUNT} (need ${MIN_FAQ_COUNT - faqCount} more)`
		)
	}

	if (issues.length > 0) {
		issuesFound.push({
			id: widget.id,
			title: widget.title || widget.translationKey,
			issues,
			recommendedCount,
			faqCount
		})
	}
}

console.log('📊 Analysis Results:\n')
console.log(`Total widgets: ${widgets.length}`)
console.log(`Widgets with issues: ${issuesFound.length}`)
console.log(
	`Complete widgets: ${widgets.length - issuesFound.length} ✅\n`
)

if (issuesFound.length > 0) {
	console.log('⚠️  Widgets that need attention:\n')

	// Group by severity
	const criticalIssues = issuesFound.filter(
		w => w.recommendedCount < MIN_RECOMMENDED_TOOLS && w.faqCount === 0
	)
	const needBoth = issuesFound.filter(
		w =>
			w.recommendedCount < MIN_RECOMMENDED_TOOLS &&
			w.faqCount > 0 &&
			w.faqCount < MIN_FAQ_COUNT
	)
	const needRecommended = issuesFound.filter(
		w => w.recommendedCount < MIN_RECOMMENDED_TOOLS && w.faqCount >= MIN_FAQ_COUNT
	)
	const needFaq = issuesFound.filter(
		w => w.recommendedCount >= MIN_RECOMMENDED_TOOLS && w.faqCount < MIN_FAQ_COUNT
	)

	if (criticalIssues.length > 0) {
		console.log(`🔴 CRITICAL - No FAQ + Need recommended (${criticalIssues.length}):`)
		criticalIssues.forEach((widget, index) => {
			console.log(
				`   ${index + 1}. ${widget.title} (${widget.id}) - ${widget.recommendedCount}/3 tools, ${widget.faqCount}/5 FAQ`
			)
		})
		console.log('')
	}

	if (needBoth.length > 0) {
		console.log(`🟠 Need both FAQ + recommended (${needBoth.length}):`)
		needBoth.forEach((widget, index) => {
			console.log(
				`   ${index + 1}. ${widget.title} (${widget.id}) - ${widget.recommendedCount}/3 tools, ${widget.faqCount}/5 FAQ`
			)
		})
		console.log('')
	}

	if (needRecommended.length > 0) {
		console.log(`🟡 Need ONLY recommended tools (${needRecommended.length}):`)
		needRecommended.forEach((widget, index) => {
			console.log(
				`   ${index + 1}. ${widget.title} (${widget.id}) - ${widget.recommendedCount}/3 tools`
			)
		})
		console.log('')
	}

	if (needFaq.length > 0) {
		console.log(`🟢 Need ONLY FAQ (${needFaq.length}):`)
		needFaq.forEach((widget, index) => {
			console.log(
				`   ${index + 1}. ${widget.title} (${widget.id}) - ${widget.faqCount}/5 FAQ`
			)
		})
		console.log('')
	}

	console.log('\n📋 Summary by issue type:')
	const totalNeedRecommended = issuesFound.filter(
		w => w.recommendedCount < MIN_RECOMMENDED_TOOLS
	).length
	const totalNeedFaq = issuesFound.filter(w => w.faqCount < MIN_FAQ_COUNT).length

	console.log(`- Need recommended tools: ${totalNeedRecommended} widgets`)
	console.log(`- Need FAQ entries: ${totalNeedFaq} widgets`)
	console.log(`- Total FAQ questions to write: ${issuesFound.reduce((acc, w) => acc + (MIN_FAQ_COUNT - w.faqCount), 0)}`)
} else {
	console.log('✅ All widgets are complete!')
}

console.log('\n✨ Check complete!')
