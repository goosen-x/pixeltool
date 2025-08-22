const { createCanvas } = require('canvas')
const fs = require('fs')
const path = require('path')

// Create a 1200x630 canvas (standard OG image size)
const width = 1200
const height = 630
const canvas = createCanvas(width, height)
const ctx = canvas.getContext('2d')

// Background gradient
const gradient = ctx.createLinearGradient(0, 0, width, height)
gradient.addColorStop(0, '#0f172a') // dark blue
gradient.addColorStop(1, '#1e293b') // slightly lighter blue
ctx.fillStyle = gradient
ctx.fillRect(0, 0, width, height)

// Add pattern overlay
ctx.globalAlpha = 0.05
for (let i = 0; i < width; i += 40) {
	for (let j = 0; j < height; j += 40) {
		ctx.beginPath()
		ctx.arc(i, j, 2, 0, Math.PI * 2)
		ctx.fillStyle = '#64748b'
		ctx.fill()
	}
}
ctx.globalAlpha = 1

// Logo/Brand
ctx.font = 'bold 80px sans-serif'
ctx.fillStyle = '#3b82f6' // blue
ctx.fillText('Pixel', 100, 150)
ctx.fillStyle = '#10b981' // green
ctx.fillText('Tool', 310, 150)

// Tagline
ctx.font = 'normal 36px sans-serif'
ctx.fillStyle = '#e2e8f0'
ctx.fillText('Professional Developer Tools', 100, 220)

// Feature list
ctx.font = 'normal 28px sans-serif'
ctx.fillStyle = '#cbd5e1'
const features = [
	'✓ 64+ Free Online Tools',
	'✓ No Installation Required',
	'✓ Works Offline',
	'✓ 100% Privacy Focused'
]

features.forEach((feature, index) => {
	ctx.fillText(feature, 100, 320 + index * 50)
})

// Website URL
ctx.font = 'normal 24px sans-serif'
ctx.fillStyle = '#94a3b8'
ctx.fillText('pixeltool.pro', 100, 550)

// Decorative element
ctx.beginPath()
ctx.moveTo(800, 100)
ctx.lineTo(1100, 100)
ctx.lineTo(1100, 530)
ctx.lineTo(800, 530)
ctx.lineTo(800, 100)
ctx.strokeStyle = '#3b82f6'
ctx.lineWidth = 3
ctx.stroke()

// Tool icons representation
const toolIcons = ['{ }', '</>', '#', '@', '[ ]']
ctx.font = 'bold 48px monospace'
toolIcons.forEach((icon, index) => {
	const x = 850 + (index % 2) * 120
	const y = 180 + Math.floor(index / 2) * 120
	ctx.fillStyle = index % 2 === 0 ? '#3b82f6' : '#10b981'
	ctx.fillText(icon, x, y)
})

// Save the image
const buffer = canvas.toBuffer('image/png')
const outputPath = path.join(__dirname, '..', 'public', 'og-image.png')
fs.writeFileSync(outputPath, buffer)

console.log('✅ OG image generated successfully at public/og-image.png')
console.log(`📐 Size: ${width}x${height}px`)
