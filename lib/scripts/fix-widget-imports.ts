#!/usr/bin/env node
import fs from 'fs/promises'
import path from 'path'
import { glob } from 'glob'

async function fixWidgetImports() {
  console.log('🔧 Fixing widget imports...')
  
  // Find all widget files
  const widgetFiles = await glob('app/**/(tools)/tools/**/page.tsx', {
    cwd: process.cwd()
  })
  
  console.log(`Found ${widgetFiles.length} widget files`)
  
  let fixedCount = 0
  
  for (const file of widgetFiles) {
    const filePath = path.join(process.cwd(), file)
    const content = await fs.readFile(filePath, 'utf-8')
    
    // Check if file needs fixing
    if (content.includes("from '@/components/tools/WidgetLayout'")) {
      console.log(`Fixing imports in ${file}`)
      
      // Replace the old import with new imports
      let newContent = content.replace(
        /import\s*{\s*([^}]+)\s*}\s*from\s*['"]@\/components\/tools\/WidgetLayout['"]/g,
        (match, imports) => {
          // Parse the imports
          const importList = imports.split(',').map(i => i.trim())
          
          // Generate new import statements
          const newImports = importList
            .filter(imp => ['WidgetLayout', 'WidgetSection', 'WidgetInput', 'WidgetOutput'].includes(imp))
            .map(imp => `import { ${imp} } from '@/components/widgets/${imp}'`)
            .join('\n')
          
          return newImports
        }
      )
      
      await fs.writeFile(filePath, newContent, 'utf-8')
      fixedCount++
    }
  }
  
  console.log(`✅ Fixed ${fixedCount} files`)
}

// Run the script
fixWidgetImports().catch(console.error)