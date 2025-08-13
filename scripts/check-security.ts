#!/usr/bin/env tsx

import { readFileSync, existsSync } from 'fs'
import { execSync } from 'child_process'
import { glob } from 'glob'

interface SecurityIssue {
  file: string
  line: number
  issue: string
  severity: 'high' | 'medium' | 'low'
}

const SECURITY_PATTERNS = [
  {
    pattern: /\beval\s*\(/gi,
    message: 'Potential XSS: eval() usage detected',
    severity: 'high' as const
  },
  {
    pattern: /dangerouslySetInnerHTML/gi,
    message: 'Potential XSS: dangerouslySetInnerHTML usage',
    severity: 'medium' as const
  },
  {
    pattern: /document\.write\s*\(/gi,
    message: 'Potential XSS: document.write usage',
    severity: 'medium' as const
  },
  {
    pattern: /innerHTML\s*=/gi,
    message: 'Potential XSS: innerHTML assignment',
    severity: 'medium' as const
  },
  {
    pattern: /(?:password|secret|key|token|api_key)\s*[:=]\s*['"]['"][^'"]*['"]/gi,
    message: 'Potential credential exposure: hardcoded secret',
    severity: 'high' as const
  },
  {
    pattern: /console\.log\([^)]*(?:password|secret|key|token)[^)]*\)/gi,
    message: 'Potential information leak: sensitive data in console.log',
    severity: 'medium' as const
  }
]

async function checkSecurity(): Promise<void> {
  console.log('🔒 Running security checks...')
  
  const issues: SecurityIssue[] = []
  
  // Get all TypeScript/JavaScript files
  const files = glob.sync('**/*.{ts,tsx,js,jsx}', {
    ignore: ['node_modules/**', '.next/**', 'dist/**', '**/*.d.ts', 'scripts/**']
  })

  for (const file of files) {
    try {
      const content = readFileSync(file, 'utf8')
      const lines = content.split('\n')
      
      lines.forEach((line, index) => {
        SECURITY_PATTERNS.forEach(({ pattern, message, severity }) => {
          if (pattern.test(line)) {
            issues.push({
              file,
              line: index + 1,
              issue: message,
              severity
            })
          }
        })
      })
    } catch (error) {
      console.log(`⚠️  Could not read file ${file}:`, error)
    }
  }

  // Report results
  if (issues.length === 0) {
    console.log('✅ No security issues detected')
    return
  }

  const highIssues = issues.filter(i => i.severity === 'high')
  const mediumIssues = issues.filter(i => i.severity === 'medium')
  const lowIssues = issues.filter(i => i.severity === 'low')

  console.log(`🔍 Found ${issues.length} potential security issue(s):`)
  console.log(`   🔴 High: ${highIssues.length}`)
  console.log(`   🟡 Medium: ${mediumIssues.length}`)
  console.log(`   🔵 Low: ${lowIssues.length}`)

  // Show high priority issues
  if (highIssues.length > 0) {
    console.log('\n🔴 High Priority Issues:')
    highIssues.forEach(issue => {
      console.log(`   ${issue.file}:${issue.line} - ${issue.issue}`)
    })
  }

  // Show medium priority issues (limited)
  if (mediumIssues.length > 0) {
    console.log('\n🟡 Medium Priority Issues:')
    mediumIssues.slice(0, 5).forEach(issue => {
      console.log(`   ${issue.file}:${issue.line} - ${issue.issue}`)
    })
    if (mediumIssues.length > 5) {
      console.log(`   ... and ${mediumIssues.length - 5} more`)
    }
  }

  console.log('\n💡 Review these issues and ensure they are intentional and secure')
  
  // Exit with error code if high severity issues found
  if (highIssues.length > 0) {
    console.log('❌ High severity security issues found!')
    process.exit(1)
  }
}

if (require.main === module) {
  checkSecurity().catch(console.error)
}

export { checkSecurity }