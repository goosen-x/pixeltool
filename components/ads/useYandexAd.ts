'use client'

import { useEffect, useState } from 'react'
import { dev } from '@/lib/config/env'
import { ADS_DISABLED, AD_RENDER_TIMEOUT_MS } from '@/lib/config/ads'
import { loadYandexAds } from './loadYandexAds'

declare global {
	interface Window {
		yaContextCb?: Array<() => void>
		Ya?: {
			Context: {
				AdvManager: {
					render: (params: { blockId: string; renderTo: string }) => void
				}
			}
		}
	}
}

/** За сколько до появления слота в кадре начинаем тянуть скрипт РСЯ: экран
 *  вперёд, чтобы объявление успело прийти к моменту, когда до него доскроллят. */
const PRELOAD_MARGIN = '600px'

/**
 * Просит РСЯ отрисовать блок и сообщает, появилось ли в контейнере хоть что-то.
 *
 * Ответ «объявлений нет» приходит не колбэком, а просто отсутствием вставки,
 * поэтому факт заполнения ловим наблюдателем за DOM, а неудачу таймаутом. Пока
 * блок не заполнен, вызывающий компонент не должен занимать место на странице:
 * при заблокированном аккаунте или адблоке пустая рамка висела бы всегда.
 *
 * Сам скрипт РСЯ подгружается только когда контейнер подходит к вьюпорту
 * (см. loadYandexAds) — до этого момента ни одного стороннего байта.
 */
export function useYandexAd(blockId: string, containerId: string): boolean {
	const [filled, setFilled] = useState(false)

	useEffect(() => {
		// В dev рекламы нет: чужой домен, РСЯ отвечает ошибкой.
		if (ADS_DISABLED || dev) return

		const container = document.getElementById(containerId)
		if (!container) return

		let cleanupRender: (() => void) | undefined

		const requestAd = () => {
			const observer = new MutationObserver(() => {
				if (container.childElementCount > 0) {
					setFilled(true)
					observer.disconnect()
					clearTimeout(timer)
				}
			})
			observer.observe(container, { childList: true, subtree: true })

			// timer объявлен после observer, но читается только из колбэка, который
			// сработает позже: к тому моменту переменная уже инициализирована.
			const timer = setTimeout(
				() => observer.disconnect(),
				AD_RENDER_TIMEOUT_MS
			)

			loadYandexAds()
			window.yaContextCb = window.yaContextCb || []
			window.yaContextCb.push(() => {
				window.Ya?.Context?.AdvManager?.render({
					blockId,
					renderTo: containerId
				})
			})

			cleanupRender = () => {
				observer.disconnect()
				clearTimeout(timer)
			}
		}

		// Без IntersectionObserver (очень старые браузеры) поведение прежнее:
		// запрашиваем сразу, лучше лишний скрипт, чем потерянный показ.
		if (typeof IntersectionObserver === 'undefined') {
			requestAd()
			return () => cleanupRender?.()
		}

		const viewportObserver = new IntersectionObserver(
			entries => {
				if (!entries.some(entry => entry.isIntersecting)) return
				viewportObserver.disconnect()
				requestAd()
			},
			{ rootMargin: PRELOAD_MARGIN }
		)
		viewportObserver.observe(container)

		return () => {
			viewportObserver.disconnect()
			cleanupRender?.()
		}
	}, [blockId, containerId])

	return filled
}
