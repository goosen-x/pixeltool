'use client'

import { useState, type DragEvent } from 'react'

/**
 * Драг-энд-дроп файла на произвольный контейнер: подсвечивает зону, пока
 * что-то тащат над ней, и отдаёт первый файл при отпускании.
 */
export function useFileDrop(onFile: (file: File) => void) {
	const [isDragging, setIsDragging] = useState(false)

	function onDragOver(event: DragEvent) {
		event.preventDefault()
		setIsDragging(true)
	}

	function onDragLeave(event: DragEvent) {
		event.preventDefault()
		setIsDragging(false)
	}

	function onDrop(event: DragEvent) {
		event.preventDefault()
		setIsDragging(false)
		const file = event.dataTransfer.files?.[0]
		if (file) onFile(file)
	}

	return { isDragging, onDragOver, onDragLeave, onDrop }
}
