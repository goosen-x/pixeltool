#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const glob = require('glob');

// Read Russian translations
const ruTranslations = JSON.parse(
  fs.readFileSync(path.join(__dirname, '../messages/ru.json'), 'utf8')
);

// Function to get widget ID from file path
function getWidgetId(filePath) {
  const match = filePath.match(/tools\/([^/]+)\/page\.tsx$/);
  return match ? match[1] : null;
}

// Function to convert widget ID to translation key
function getTranslationKey(widgetId) {
  // Convert kebab-case to camelCase
  return widgetId.replace(/-([a-z])/g, (g) => g[1].toUpperCase());
}

// Function to get translations for a widget
function getWidgetTranslations(widgetId) {
  const translationKey = getTranslationKey(widgetId);
  return ruTranslations.widgets[translationKey] || {};
}

// Function to replace translation calls with hardcoded strings
function replaceTranslations(content, widgetId) {
  const translations = getWidgetTranslations(widgetId);
  
  // Remove import
  content = content.replace(/import\s*{\s*useTranslations\s*}\s*from\s*'next-intl'\s*\n?/g, '');
  
  // Remove useTranslations hook
  content = content.replace(/\s*const\s+t\s*=\s*useTranslations\([^)]+\)\s*\n?/g, '');
  
  // Replace t() calls
  const tCallRegex = /t\(['"]([^'"]+)['"]\)/g;
  content = content.replace(tCallRegex, (match, key) => {
    // Navigate through nested keys
    const keys = key.split('.');
    let value = translations;
    
    for (const k of keys) {
      if (value && typeof value === 'object' && k in value) {
        value = value[k];
      } else {
        console.log(`Warning: Translation key not found: ${key} in widget ${widgetId}`);
        return `'${key}'`; // Return the key as fallback
      }
    }
    
    // If value is still an object, it might be a complex translation
    if (typeof value === 'object') {
      console.log(`Warning: Complex translation object for key: ${key} in widget ${widgetId}`);
      return `'${key}'`; // Return the key as fallback
    }
    
    // Escape single quotes in the translation
    const escapedValue = String(value).replace(/'/g, "\\'");
    return `'${escapedValue}'`;
  });
  
  return content;
}

// Process all widget files
const widgetFiles = glob.sync('app/[locale]/(tools)/tools/*/page.tsx');

console.log(`Found ${widgetFiles.length} widget files`);

let processedCount = 0;
let skippedCount = 0;

widgetFiles.forEach((filePath) => {
  const widgetId = getWidgetId(filePath);
  if (!widgetId) {
    console.log(`Skipping: Could not extract widget ID from ${filePath}`);
    skippedCount++;
    return;
  }
  
  const content = fs.readFileSync(filePath, 'utf8');
  
  // Check if file uses translations
  if (!content.includes('useTranslations')) {
    console.log(`Skipping ${widgetId}: No translations used`);
    skippedCount++;
    return;
  }
  
  console.log(`Processing ${widgetId}...`);
  
  try {
    const updatedContent = replaceTranslations(content, widgetId);
    fs.writeFileSync(filePath, updatedContent);
    processedCount++;
    console.log(`✓ Processed ${widgetId}`);
  } catch (error) {
    console.error(`✗ Error processing ${widgetId}:`, error.message);
  }
});

console.log(`\nSummary:`);
console.log(`- Processed: ${processedCount} files`);
console.log(`- Skipped: ${skippedCount} files`);
console.log(`- Total: ${widgetFiles.length} files`);