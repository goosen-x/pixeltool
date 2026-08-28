'use client'

import { useEffect, useRef, useState } from 'react'
import {
	compressImage,
	EXTENSIONS,
	type OutputFormat
} from '@/lib/tools/image-compress'
import { percentSaved } from '@/lib/utils/format-bytes'

type Status = 'idle' | 'processing' | 'done' | 'error'

export interface UseImageCompressResult {
	format: OutputFormat
	setFormat: (format: OutputFormat) => void
	quality: number
	setQuality: (quality: number) => void
	status: Status
	compressedBlob: Blob | null
	compressedUrl: string | null
	dimensions: { width: number; height: number } | null
	errorMessage: string | null
	/** Экономия в % — никогда не отрицательная: если пересжатый файл вышел
	 *  тяжелее исходника, показываем 0%, а не «−12%» красным. Пользователю
	 *  незачем видеть, что «сжатие» иногда увеличивает вес — это деталь
	 *  реализации (JPEG/WebP не всегда выигрывают у уже эффективного PNG),
	 *  а не что-то, что он должен решать сам. */
	savedPercent: number | null
	/** true, если пересжатый файл не легче исходного — download() в этом
	 *  случае молча скачивает оригинал вместо результата с перевесом. */
	isOriginalBest: boolean
	/** Скачивает лучший из двух вариантов — пересжатый или (если он тяжелее)
	 *  исходный файл — под именем `pixeltool.pro-{filenameBase}[-compressed].ext`. */
	download: (filenameBase: string) => void
}

/**
 * Пересжимает file через canvas при смене формата/качества — с дебаунсом,
 * чтобы не гонять canvas на каждый пиксель движения ползунка. Общая логика
 * для compress-image и инлайн-панели сжатия в image-size-checker
 * (components/tools/ImageCompressPanel.tsx).
 */
export function useImageCompress(file: File | null): UseImageCompressResult {
	const [format, setFormat] = useState<OutputFormat>('image/jpeg')
	const [quality, setQuality] = useState(80)
	const [status, setStatus] = useState<Status>('idle')
	const [compressedBlob, setCompressedBlob] = useState<Blob | null>(null)
	const [compressedUrl, setCompressedUrl] = useState<string | null>(null)
	const [dimensions, setDimensions] = useState<{
		width: number
		height: number
	} | null>(null)
	const [errorMessage, setErrorMessage] = useState<string | null>(null)
	const urlRef = useRef<string | null>(null)

	useEffect(() => {
		if (!file) {
			setStatus('idle')
			setCompressedBlob(null)
			setCompressedUrl(null)
			setDimensions(null)
			return
		}

		let cancelled = false
		setStatus('processing')
		setErrorMessage(null)

		const timeout = setTimeout(() => {
			void compressImage(file, format, quality)
				.then(result => {
					if (cancelled) return
					if (urlRef.current) URL.revokeObjectURL(urlRef.current)
					const url = URL.createObjectURL(result.blob)
					urlRef.current = url
					setCompressedBlob(result.blob)
					setCompressedUrl(url)
					setDimensions({ width: result.width, height: result.height })
					setStatus('done')
				})
				.catch(error => {
					if (cancelled) return
					console.error(error)
					setErrorMessage(
						'Не получилось сжать файл. Попробуйте другое изображение.'
					)
					setStatus('error')
				})
		}, 200)

		return () => {
			cancelled = true
			clearTimeout(timeout)
		}
	}, [file, format, quality])

	// Отдельный эффект только для финальной очистки — revoke внутри эффекта
	// выше уже случается при каждой смене URL, здесь только на размонтирование.
	useEffect(() => {
		return () => {
			if (urlRef.current) URL.revokeObjectURL(urlRef.current)
		}
	}, [])

	const rawPercent =
		file && compressedBlob ? percentSaved(file.size, compressedBlob.size) : null
	const isOriginalBest = rawPercent !== null && rawPercent < 0
	const savedPercent = rawPercent !== null ? Math.max(0, rawPercent) : null

	const download = (filenameBase: string) => {
		if (!file) return
		const useOriginal = isOriginalBest || !compressedBlob
		const blob = useOriginal ? file : compressedBlob
		const extension = useOriginal
			? (file.name.match(/\.([^.]+)$/)?.[1] ?? 'jpg')
			: EXTENSIONS[format]

		const url = URL.createObjectURL(blob)
		const link = document.createElement('a')
		link.href = url
		link.download = useOriginal
			? `pixeltool.pro-${filenameBase}.${extension}`
			: `pixeltool.pro-${filenameBase}-compressed.${extension}`
		link.click()
		URL.revokeObjectURL(url)
	}

	return {
		format,
		setFormat,
		quality,
		setQuality,
		status,
		compressedBlob,
		compressedUrl,
		dimensions,
		errorMessage,
		savedPercent,
		isOriginalBest,
		download
	}
}
