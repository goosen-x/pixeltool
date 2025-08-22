const fs = require('fs')
const path = require('path')

// Create a simple fallback OG image
const svgContent = `<svg width="1200" height="630" viewBox="0 0 1200 630" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#0f172a"/>
      <stop offset="100%" style="stop-color:#1e293b"/>
    </linearGradient>
  </defs>
  
  <!-- Background -->
  <rect width="1200" height="630" fill="url(#bg)"/>
  
  <!-- Content centered -->
  <g transform="translate(600,315)">
    <!-- Logo -->
    <text text-anchor="middle" y="-100" font-family="Arial, sans-serif" font-size="80" font-weight="bold">
      <tspan fill="#3b82f6">Pixel</tspan><tspan fill="#10b981">Tool</tspan>
    </text>
    
    <!-- Tagline -->
    <text text-anchor="middle" y="-20" font-family="Arial, sans-serif" font-size="36" fill="#e2e8f0">
      Professional Developer Tools
    </text>
    
    <!-- Subtitle -->
    <text text-anchor="middle" y="40" font-family="Arial, sans-serif" font-size="24" fill="#94a3b8">
      64+ Free Online Tools for Developers
    </text>
  </g>
  
  <!-- URL -->
  <text x="600" y="580" text-anchor="middle" font-family="Arial, sans-serif" font-size="20" fill="#64748b">
    pixeltool.pro
  </text>
</svg>`

// Save SVG
const outputPath = path.join(__dirname, '..', 'public', 'og-fallback.svg')
fs.writeFileSync(outputPath, svgContent)

console.log('✅ Fallback OG image created at public/og-fallback.svg')
console.log('📐 Size: 1200x630px')
console.log('\n⚠️  Note: To convert to PNG, you can use:')
console.log('   - Online converter: https://cloudconvert.com/svg-to-png')
console.log('   - Or install sharp: npm install sharp')
console.log('   - Or use ImageMagick: convert og-fallback.svg og-image.png')
