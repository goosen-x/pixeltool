// Картинки для письма с лид-магнитом. Прикладываются к письму как вложения
// с cid, а не ссылками: внешние картинки почтовые клиенты по умолчанию
// блокируют, а inline-вложения показывают сразу.
//
// Запуск: node scripts/generate-email-assets.mjs
import sharp from 'sharp'
import { readFileSync } from 'fs'

// Полоса-шапка: 600pt ширины письма при 2× плотности.
await sharp(readFileSync('public/images/lead-magnet/card-banner-v2.png'))
	.resize(1200, 340, { fit: 'cover', position: 'right top' })
	.png()
	.toFile('assets/email/header.png')

// Логотип — те же четыре квадрата, что в шапке сайта и в PDF.
const C = ['#f43f5e', '#facc15', '#3b82f6', '#22c55e']
const logo = `<svg xmlns="http://www.w3.org/2000/svg" width="128" height="128" viewBox="0 0 24 24">
  <rect width="24" height="24" rx="5" fill="#fff"/>
  <rect x="5" y="5" width="6" height="6" fill="${C[0]}"/>
  <rect x="13" y="5" width="6" height="6" fill="${C[1]}"/>
  <rect x="5" y="13" width="6" height="6" fill="${C[2]}"/>
  <rect x="13" y="13" width="6" height="6" fill="${C[3]}"/>
</svg>`
await sharp(Buffer.from(logo)).png().toFile('assets/email/logo.png')

console.log('assets/email/header.png, assets/email/logo.png')
