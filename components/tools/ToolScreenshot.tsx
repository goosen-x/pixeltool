import { getToolScreenshot } from '@/lib/constants/tool-screenshots'

interface ToolScreenshotProps {
	slug: string
}

/**
 * Иллюстрация интерфейса инструмента в начале SEO-блока страницы.
 * Отдаёт предоптимизированные webp (1200w/800w) напрямую через <img> с srcset —
 * next/image добавил бы лишний рантайм-проход оптимизатора поверх уже готовых
 * файлов. Рендерится только у тулов, для которых есть запись в toolScreenshots.
 */
export function ToolScreenshot({ slug }: ToolScreenshotProps) {
	const shot = getToolScreenshot(slug)
	if (!shot) return null

	const base = `/images/tools/${shot.file}`

	return (
		<figure className='mx-auto mt-16 max-w-3xl'>
			{/* eslint-disable-next-line @next/next/no-img-element -- предоптимизированный webp, next/image дал бы лишний проход оптимизатора */}
			<img
				src={`${base}-1200.webp`}
				srcSet={`${base}-800.webp 800w, ${base}-1200.webp 1200w`}
				sizes='(max-width: 768px) 100vw, 768px'
				width={1200}
				height={675}
				alt={shot.alt}
				loading='lazy'
				decoding='async'
				className='h-auto w-full rounded-lg border'
			/>
			<figcaption className='mt-3 text-center text-sm text-muted-foreground'>
				{shot.caption}
			</figcaption>
		</figure>
	)
}
