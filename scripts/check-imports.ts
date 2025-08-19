#!/usr/bin/env tsx

import { readFileSync, existsSync } from 'fs'
import { glob } from 'glob'

interface ImportIssue {
	file: string
	line: number
	issue: string
	type: 'unused' | 'duplicate' | 'deprecated' | 'circular'
}

async function checkImports(): Promise<void> {
	console.log('🔗 Checking imports...')

	const issues: ImportIssue[] = []

	// Get all TypeScript/JavaScript files
	const files = glob.sync('**/*.{ts,tsx,js,jsx}', {
		ignore: ['node_modules/**', '.next/**', 'dist/**', '**/*.d.ts']
	})

	// Deprecated packages to warn about
	const deprecatedPackages = [
		'moment', // Use date-fns or dayjs instead
		'request', // Use fetch or axios
		'lodash' // Use native methods or lodash-es
	]

	for (const file of files) {
		try {
			const content = readFileSync(file, 'utf8')
			const lines = content.split('\n')

			const imports = new Set<string>()

			lines.forEach((line, index) => {
				const trimmedLine = line.trim()

				// Check for import statements
				const importMatch = trimmedLine.match(
					/import\s+.*?from\s+['"]([^'"]+)['"]/
				)
				if (importMatch) {
					const packageName = importMatch[1]

					// Check for duplicate imports
					if (imports.has(packageName)) {
						issues.push({
							file,
							line: index + 1,
							issue: `Duplicate import: ${packageName}`,
							type: 'duplicate'
						})
					}
					imports.add(packageName)

					// Check for deprecated packages
					deprecatedPackages.forEach(deprecated => {
						if (packageName.includes(deprecated)) {
							issues.push({
								file,
								line: index + 1,
								issue: `Deprecated package: ${deprecated}`,
								type: 'deprecated'
							})
						}
					})
				}

				// Check for common React anti-patterns
				if (trimmedLine.includes('import * as React')) {
					issues.push({
						file,
						line: index + 1,
						issue:
							'Consider using named imports instead of namespace import for React',
						type: 'deprecated'
					})
				}

				// Check for default exports that should be named
				if (trimmedLine.match(/export\s+default\s+function\s+[A-Z]/)) {
					// This is actually fine for React components
				}
			})
		} catch (error) {
			console.log(`⚠️  Could not read file ${file}:`, error)
		}
	}

	// Report results
	if (issues.length === 0) {
		console.log('✅ No import issues detected')
		return
	}

	const duplicates = issues.filter(i => i.type === 'duplicate')
	const deprecated = issues.filter(i => i.type === 'deprecated')

	console.log(`🔍 Found ${issues.length} import issue(s):`)
	if (duplicates.length > 0) {
		console.log(`   🔄 Duplicates: ${duplicates.length}`)
	}
	if (deprecated.length > 0) {
		console.log(`   ⚠️  Deprecated: ${deprecated.length}`)
	}

	// Show issues (limited output)
	issues.slice(0, 10).forEach(issue => {
		const emoji = issue.type === 'duplicate' ? '🔄' : '⚠️'
		console.log(`   ${emoji} ${issue.file}:${issue.line} - ${issue.issue}`)
	})

	if (issues.length > 10) {
		console.log(`   ... and ${issues.length - 10} more issues`)
	}

	console.log(
		'\n💡 Consider cleaning up these imports for better maintainability'
	)
}

if (require.main === module) {
	checkImports().catch(console.error)
}

export { checkImports }
