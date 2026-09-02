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

/**
 * То же, но для инструментов, которые работают с пачкой файлов сразу
 * (объединение PDF). Отдельная функция, а не флаг у `useFileDrop`: тип
 * колбэка разный, и одиночным тулам не нужно разбирать массив из одного
 * элемента на каждом дропе.
 */
export function useFilesDrop(onFiles: (files: File[]) => void) {
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
		const files = Array.from(event.dataTransfer.files ?? [])
		if (files.length > 0) onFiles(files)
	}

	return { isDragging, onDragOver, onDragLeave, onDrop }
}
