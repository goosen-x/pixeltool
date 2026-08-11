#!/usr/bin/env tsx
// scripts/check-internal-links.ts
import { buildLinkGraph, runChecks } from '../lib/seo/internal-links'

function main(): void {
	const graph = buildLinkGraph(process.cwd())

	if (graph.tools.length === 0 || graph.articles.length === 0) {
		console.error(
			`✖ Источник данных пуст: тулов ${graph.tools.length}, статей ${graph.articles.length}. ` +
				'Проверь, что скрипт запущен из корня репозитория и _posts/ на месте.'
		)
		process.exit(1)
	}

	const report = runChecks(graph)

	console.log(`Тулов: ${report.toolCount}, статей: ${report.articleCount}\n`)

	const errors = report.issues.filter(i => i.severity === 'error')
	const warnings = report.issues.filter(i => i.severity === 'warning')

	if (errors.length === 0 && warnings.length === 0) {
		console.log('✅ Проблем не найдено\n')
	}

	if (errors.length > 0) {
		console.log(`✖ Ошибки (${errors.length}):`)
		errors.forEach(issue => console.log(`  ✖ ${issue.message}`))
		console.log('')
	}

	if (warnings.length > 0) {
		console.log(`⚠ Предупреждения (${warnings.length}):`)
		warnings.forEach(issue => console.log(`  ⚠ ${issue.message}`))
		console.log('')
	}

	if (errors.length > 0) {
		process.exit(1)
	}
}

main()
