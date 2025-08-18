// Service Worker for PixelTool PWA
const CACHE_NAME = 'pixeltool-v1'
const urlsToCache = [
	'/',
	'/en',
	'/ru',
	'/en/tools',
	'/ru/tools',
	'/manifest.json',
	'/icon.svg',
	'/fonts/Tektur-Regular.ttf',
	'/fonts/Tektur-Medium.ttf',
	'/fonts/Tektur-Bold.ttf'
]

// Install event - cache resources
self.addEventListener('install', event => {
	event.waitUntil(
		caches
			.open(CACHE_NAME)
			.then(cache => {
				console.log('Opened cache')
				return cache.addAll(urlsToCache)
			})
			.catch(err => {
				console.log('Cache failed:', err)
			})
	)
	self.skipWaiting()
})

// Activate event - cleanup old caches
self.addEventListener('activate', event => {
	event.waitUntil(
		caches.keys().then(cacheNames => {
			return Promise.all(
				cacheNames.map(cacheName => {
					if (cacheName !== CACHE_NAME) {
						console.log('Deleting old cache:', cacheName)
						return caches.delete(cacheName)
					}
				})
			)
		})
	)
	self.clients.claim()
})

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', event => {
	// Skip non-GET requests
	if (event.request.method !== 'GET') {
		return
	}

	// Skip chrome-extension and other non-http(s) requests
	if (!event.request.url.startsWith('http')) {
		return
	}

	event.respondWith(
		caches
			.match(event.request)
			.then(response => {
				// Cache hit - return response
				if (response) {
					return response
				}

				// Clone the request
				const fetchRequest = event.request.clone()

				return fetch(fetchRequest).then(response => {
					// Check if valid response
					if (
						!response ||
						response.status !== 200 ||
						response.type !== 'basic'
					) {
						return response
					}

					// Clone the response
					const responseToCache = response.clone()

					// Cache dynamic content (tools, API responses)
					if (
						event.request.url.includes('/tools/') ||
						event.request.url.includes('/api/')
					) {
						caches.open(CACHE_NAME).then(cache => {
							cache.put(event.request, responseToCache)
						})
					}

					return response
				})
			})
			.catch(() => {
				// Offline fallback
				if (event.request.destination === 'document') {
					return caches.match('/offline.html')
				}
			})
	)
})

// Background sync for offline actions
self.addEventListener('sync', event => {
	if (event.tag === 'sync-analytics') {
		event.waitUntil(syncAnalytics())
	}
})

async function syncAnalytics() {
	// Sync any offline analytics data
	console.log('Syncing analytics data...')
}
