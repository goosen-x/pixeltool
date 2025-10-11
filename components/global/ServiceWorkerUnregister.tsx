'use client'

import { useEffect } from 'react'

/**
 * ServiceWorkerUnregister component
 * Удаляет Service Worker у пользователей, которые его установили ранее
 * Можно будет удалить этот компонент через несколько недель после деплоя
 */
export function ServiceWorkerUnregister() {
	useEffect(() => {
		if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
			// Отменяем регистрацию всех Service Workers
			navigator.serviceWorker.getRegistrations().then(registrations => {
				for (const registration of registrations) {
					registration
						.unregister()
						.then(success => {
							if (success) {
								console.log('Service Worker unregistered successfully')
							}
						})
						.catch(error => {
							console.error('Service Worker unregister failed:', error)
						})
				}
			})

			// Очищаем все кеши
			if ('caches' in window) {
				caches.keys().then(cacheNames => {
					cacheNames.forEach(cacheName => {
						caches.delete(cacheName)
					})
				})
			}
		}
	}, [])

	return null
}
