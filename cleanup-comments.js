const fs = require('fs');
const path = require('path');

// Patterns to remove
const patternsToRemove = [
  // Commented import/export statements
  /^\s*\/\/\s*import.*from\s*['"]next-intl.*['"].*$/gm,
  /^\s*\/\/\s*import.*useTranslations.*$/gm,
  /^\s*\/\/\s*import.*getTranslations.*$/gm,
  /^\s*\/\/\s*import.*useLocale.*$/gm,
  /^\s*\/\/\s*import.*useRouter.*navigation.*$/gm,
  /^\s*\/\/\s*const\s+t\s*=.*useTranslations.*$/gm,
  /^\s*\/\/\s*const\s+t\s*=.*getTranslations.*$/gm,
  /^\s*\/\/\s*const\s+locale\s*=.*$/gm,
  /^\s*\/\/\s*const\s+router\s*=.*$/gm,
  /^\s*\/\/\s*const\s+pathname\s*=.*$/gm,
  
  // Old translation function calls
  /^\s*\/\/.*t\(['"].*['"]\).*$/gm,
  
  // Language/locale related comments
  /^\s*\/\/\s*.*locale.*removed.*$/gm,
  /^\s*\/\/\s*Language.*removed.*$/gm,
  
  // Empty comment lines after cleanup
  /^\s*\/\/\s*$/gm,
];

// Patterns to keep (important comments)
const patternsToKeep = [
  /\/\/\s*TODO/i,
  /\/\/\s*FIXME/i,
  /\/\/\s*HACK/i,
  /\/\/\s*NOTE/i,
  /\/\/\s*IMPORTANT/i,
  /\/\/\s*WARNING/i,
  /\/\/\s*eslint-disable/,
  /\/\/\s*@ts-/,
  /\/\*\*[\s\S]*?\*\//,  // JSDoc comments
  /\/\/\s*Force dynamic/i,
  /\/\/\s*Metadata/i,
  /\/\/\s*Helper/i,
  /\/\/\s*Hook/i,
  /\/\/\s*Component/i,
  /\/\/\s*Function/i,
  /\/\/\s*Type/i,
  /\/\/\s*Interface/i,
];

function shouldKeepComment(line) {
  return patternsToKeep.some(pattern => pattern.test(line));
}

function cleanFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  let cleaned = content;
  
  // First pass: remove unwanted patterns
  patternsToRemove.forEach(pattern => {
    cleaned = cleaned.replace(pattern, '');
  });
  
  // Second pass: clean up multiple empty lines
  cleaned = cleaned.replace(/\n\s*\n\s*\n/g, '\n\n');
  
  // Remove trailing whitespace
  cleaned = cleaned.replace(/[ \t]+$/gm, '');
  
  // Count changes
  const changeCount = content.length - cleaned.length;
  
  if (changeCount > 0) {
    fs.writeFileSync(filePath, cleaned);
    console.log(`✓ ${filePath} - removed ${changeCount} characters`);
    return 1;
  }
  
  return 0;
}

// Find all TypeScript/TSX files
function findFiles(dir, extensions = ['.ts', '.tsx']) {
  const files = [];
  
  function walk(currentDir) {
    const items = fs.readdirSync(currentDir);
    
    for (const item of items) {
      const fullPath = path.join(currentDir, item);
      const stat = fs.statSync(fullPath);
      
      if (stat.isDirectory() && !item.startsWith('.') && item !== 'node_modules') {
        walk(fullPath);
      } else if (stat.isFile() && extensions.some(ext => item.endsWith(ext))) {
        files.push(fullPath);
      }
    }
  }
  
  walk(dir);
  return files;
}

// Main execution
const directories = ['app', 'components', 'lib'];
let totalFilesUpdated = 0;

console.log('🧹 Cleaning up unnecessary comments...\n');

directories.forEach(dir => {
  if (fs.existsSync(dir)) {
    const files = findFiles(dir);
    files.forEach(file => {
      totalFilesUpdated += cleanFile(file);
    });
  }
});

console.log(`\n✨ Cleanup complete! Updated ${totalFilesUpdated} files.`);