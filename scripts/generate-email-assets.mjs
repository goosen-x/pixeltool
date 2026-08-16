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

// Логотип — не рисуем заново, а берём тот же файл, что отдаётся сайту
// (public/icon.svg): сетка 3×3 на белом скруглённом квадрате. Любая ручная
// пересборка эмблемы рано или поздно разъезжается с оригиналом.
await sharp(readFileSync('public/icon.svg'))
	.resize(128, 128)
	.png()
	.toFile('assets/email/logo.png')

console.log('assets/email/header.png, assets/email/logo.png')
