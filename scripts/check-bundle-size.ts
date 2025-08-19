#!/usr/bin/env tsx

import { readFileSync, existsSync, statSync, readdirSync } from 'fs'
import { execSync } from 'child_process'
import { join } from 'path'
import { platform } from 'os'

interface BundleInfo {
	size: number
	gzipSize: number
	files: string[]
}

const MAX_BUNDLE_SIZE = 1024 * 1024 * 2 // 2MB
const MAX_CHUNK_SIZE = 1024 * 512 // 512KB

// Cross-platform directory size calculation
function getDirectorySize(dir: string): number {
	let totalSize = 0

	function calculateSize(path: string) {
		const stats = statSync(path)

		if (stats.isFile()) {
			totalSize += stats.size
		} else if (stats.isDirectory()) {
			const files = readdirSync(path)
			files.forEach(file => {
				calculateSize(join(path, file))
			})
		}
	}

	try {
		calculateSize(dir)
	} catch (error) {
		console.error(`Error calculating size for ${dir}:`, error)
	}

	return totalSize
}

// Cross-platform find large files
function findLargeFiles(
	dir: string,
	maxSize: number
): Array<{ path: string; size: number }> {
	const largeFiles: Array<{ path: string; size: number }> = []

	function searchFiles(path: string) {
		try {
			const stats = statSync(path)

			if (stats.isFile() && path.endsWith('.js') && stats.size > maxSize) {
				largeFiles.push({ path, size: stats.size })
			} else if (stats.isDirectory()) {
				const files = readdirSync(path)
				files.forEach(file => {
					searchFiles(join(path, file))
				})
			}
		} catch (error) {
			// Ignore permission errors
		}
	}

	if (existsSync(dir)) {
		searchFiles(dir)
	}

	return largeFiles
}

async function checkBundleSize(): Promise<void> {
	console.log('📦 Checking bundle size...')

	const buildDir = '.next'
	const staticDir = join(buildDir, 'static')

	if (!existsSync(buildDir)) {
		console.log('⚠️  No build found. Run npm run build first.')
		return
	}

	try {
		// Get build size
		const buildSize = getDirectorySize(buildDir)

		// Get static assets size
		if (existsSync(staticDir)) {
			const staticSize = getDirectorySize(staticDir)

			console.log(`📊 Build size: ${formatBytes(buildSize)}`)
			console.log(`📊 Static assets: ${formatBytes(staticSize)}`)

			if (staticSize > MAX_BUNDLE_SIZE) {
				console.log(
					`⚠️  Bundle size (${formatBytes(staticSize)}) exceeds recommended limit (${formatBytes(MAX_BUNDLE_SIZE)})`
				)
				console.log(
					'💡 Consider code splitting or removing unused dependencies'
				)
			} else {
				console.log('✅ Bundle size is within acceptable limits')
			}
		}

		// Check for large chunks
		const largeFiles = findLargeFiles(staticDir, MAX_CHUNK_SIZE)
		if (largeFiles.length > 0) {
			console.log('⚠️  Large JavaScript chunks detected:')
			largeFiles.forEach(({ path, size }) => {
				console.log(`   ${path}: ${formatBytes(size)}`)
			})
			console.log('💡 Consider splitting large chunks or lazy loading')
		}
	} catch (error) {
		console.log('⚠️  Could not analyze bundle size:', error)
	}
}

function formatBytes(bytes: number): string {
	if (bytes === 0) return '0 Bytes'
	const k = 1024
	const sizes = ['Bytes', 'KB', 'MB', 'GB']
	const i = Math.floor(Math.log(bytes) / Math.log(k))
	return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

if (require.main === module) {
	checkBundleSize().catch(console.error)
}

export { checkBundleSize }
