// This script creates a simple 1x1 pixel PNG as a placeholder
// You should replace it with a proper 1200x630 image

const fs = require('fs')
const path = require('path')

// Create a minimal 1x1 transparent PNG
const pngData = Buffer.from([
	0x89,
	0x50,
	0x4e,
	0x47,
	0x0d,
	0x0a,
	0x1a,
	0x0a, // PNG signature
	0x00,
	0x00,
	0x00,
	0x0d,
	0x49,
	0x48,
	0x44,
	0x52, // IHDR chunk
	0x00,
	0x00,
	0x00,
	0x01,
	0x00,
	0x00,
	0x00,
	0x01,
	0x08,
	0x06,
	0x00,
	0x00,
	0x00,
	0x1f,
	0x15,
	0xc4,
	0x89,
	0x00,
	0x00,
	0x00,
	0x0a,
	0x49,
	0x44,
	0x41,
	0x54,
	0x78,
	0x9c,
	0x62,
	0x00,
	0x01,
	0x00,
	0x00,
	0x05,
	0x00,
	0x01,
	0x0d,
	0x0a,
	0x2d,
	0xb4,
	0x00,
	0x00,
	0x00,
	0x00,
	0x49,
	0x45,
	0x4e,
	0x44,
	0xae,
	0x42,
	0x60,
	0x82
])

const outputPath = path.join(__dirname, '..', 'public', 'og-image.png')
fs.writeFileSync(outputPath, pngData)

console.log('✅ Placeholder PNG created at public/og-image.png')
console.log('\n⚠️  IMPORTANT: This is just a 1x1 placeholder!')
console.log('You should create a proper 1200x630 OG image by:')
console.log('1. Using a design tool like Figma, Canva, or Photoshop')
console.log('2. Converting the SVG at public/og-fallback.svg to PNG')
console.log('3. Using the dynamic API route at /api/og')
console.log('\nRecommended OG image specs:')
console.log('- Size: 1200x630 pixels')
console.log('- Format: PNG or JPG')
console.log('- File size: Under 8MB (ideally under 300KB)')
console.log('- Content: Clear branding, readable text')
