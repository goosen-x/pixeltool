// Готовит форму уголка для страниц PDF-шпаргалки: блок с картинкой баннера,
// прижатый к верхнему и правому краю. Внутренний угол скруглён выпукло, а в
// двух местах стыка со страницей — вогнутые уголки (тот же визуальный язык,
// что у CornerBadge на сайте, только зеркально).
//
// Почему растром, а не примитивами: в jsPDF нет ни масок, ни clip-path, ни
// скругления картинок — форму пришлось бы собирать дугами вручную.
//
// Запуск: node scripts/generate-pdf-corner.mjs
import sharp from 'sharp'
import { readFileSync } from 'fs'

const W = 76 // ширина блока в pt (равна высоте — уголок квадратный)
const H = 76 // высота блока в pt
const R = 18 // выпуклое скругление внутреннего угла
const N = 11 // радиус вогнутых стыков со страницей
const SCALE = 6 // растеризуем крупно и уменьшаем: иначе сетка точек даёт муар

const cw = W + N
const ch = H + N

const shape = [
	// сам блок со скруглённым нижним левым углом
	`M ${N} 0 L ${N} ${H - R} A ${R} ${R} 0 0 0 ${N + R} ${H} L ${cw} ${H} L ${cw} 0 Z`,
	// вогнутый стык слева, вдоль верхнего края страницы
	`M 0 0 L ${N} 0 L ${N} ${N} A ${N} ${N} 0 0 0 0 0 Z`,
	// вогнутый стык снизу, вдоль правого края страницы
	`M ${W} ${H} L ${cw} ${H} L ${cw} ${ch} A ${N} ${N} 0 0 0 ${W} ${H} Z`
].join(' ')

const mask = Buffer.from(
	`<svg xmlns="http://www.w3.org/2000/svg" width="${cw * SCALE}" height="${ch * SCALE}" viewBox="0 0 ${cw} ${ch}"><path d="${shape}" fill="#fff"/></svg>`
)

await sharp(readFileSync('public/images/lead-magnet/card-banner-v2.png'))
	// cover, а не fill: растяжение по одной оси ломает сетку точек баннера
	.resize(cw * SCALE, ch * SCALE, { fit: 'cover', position: 'right top' })
	.composite([{ input: mask, blend: 'dest-in' }])
	.png()
	.toFile('assets/pdf-icons/page-corner.png')

console.log(`page-corner.png: ${cw}×${ch} pt (растр ${cw * SCALE}×${ch * SCALE})`)
