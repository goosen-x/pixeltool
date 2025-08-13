#!/usr/bin/env tsx

import { readFileSync, existsSync } from 'fs'
import { execSync } from 'child_process'
import { join } from 'path'

interface BundleInfo {
  size: number
  gzipSize: number
  files: string[]
}

const MAX_BUNDLE_SIZE = 1024 * 1024 * 2 // 2MB
const MAX_CHUNK_SIZE = 1024 * 512 // 512KB

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
    const buildSizeOutput = execSync(`du -sb ${buildDir}`, { encoding: 'utf8' })
    const buildSize = parseInt(buildSizeOutput.split('\t')[0])

    // Get static assets size
    if (existsSync(staticDir)) {
      const staticSizeOutput = execSync(`du -sb ${staticDir}`, { encoding: 'utf8' })
      const staticSize = parseInt(staticSizeOutput.split('\t')[0])

      console.log(`📊 Build size: ${formatBytes(buildSize)}`)
      console.log(`📊 Static assets: ${formatBytes(staticSize)}`)

      if (staticSize > MAX_BUNDLE_SIZE) {
        console.log(`⚠️  Bundle size (${formatBytes(staticSize)}) exceeds recommended limit (${formatBytes(MAX_BUNDLE_SIZE)})`)
        console.log('💡 Consider code splitting or removing unused dependencies')
      } else {
        console.log('✅ Bundle size is within acceptable limits')
      }
    }

    // Check for large chunks
    try {
      const chunksOutput = execSync(`find ${staticDir} -name "*.js" -size +${MAX_CHUNK_SIZE}c 2>/dev/null || true`, { encoding: 'utf8' })
      if (chunksOutput.trim()) {
        console.log('⚠️  Large JavaScript chunks detected:')
        chunksOutput.trim().split('\n').forEach(chunk => {
          const size = execSync(`du -b "${chunk}"`, { encoding: 'utf8' }).split('\t')[0]
          console.log(`   ${chunk}: ${formatBytes(parseInt(size))}`)
        })
        console.log('💡 Consider splitting large chunks or lazy loading')
      }
    } catch (error) {
      // Ignore errors for chunk analysis
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