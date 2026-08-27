/**
 * Передача файла между тулами без сервера — File нельзя сериализовать в
 * строку, поэтому используем IndexedDB: она хранит File/Blob напрямую
 * через structured clone (в отличие от localStorage/sessionStorage,
 * которые работают только со строками и потребовали бы base64).
 *
 * IndexedDB, а не переменная модуля: модульное состояние живёт только в
 * памяти вкладки и гибнет при полном reload — а ChunkErrorReload
 * (components/global/ChunkErrorReload.tsx) именно его и делает, когда
 * после свежего деплоя чанк целевой страницы устарел. Пользователь жмёт
 * «Сжать» на image-size-checker в первые минуты после деплоя — навигация
 * ловит устаревший чанк, страница перезагружается целиком, вся память
 * вкладки обнуляется раньше, чем истёк бы любой TTL на переменной. Запись
 * на диске такой reload переживает.
 *
 * Значение не стирается при первом чтении, а протухает по TTL: в
 * dev-режиме Next.js страница назначения может смонтироваться несколько
 * раз подряд (React StrictMode плюс дозагрузка ещё не открытого
 * маршрута), и «съесть один раз» означало бы, что файл достаётся
 * фантомному промежуточному монтированию, а не тому, что реально увидел
 * пользователь.
 */

const DB_NAME = 'pixeltool-handoff'
const STORE_NAME = 'files'
const RECORD_KEY = 'pending-file'
const TTL_MS = 15_000

interface HandoffRecord {
	file: File
	expiresAt: number
}

function openDb(): Promise<IDBDatabase> {
	return new Promise((resolve, reject) => {
		const request = indexedDB.open(DB_NAME, 1)
		request.onupgradeneeded = () => {
			request.result.createObjectStore(STORE_NAME)
		}
		request.onsuccess = () => resolve(request.result)
		request.onerror = () => reject(request.error)
	})
}

export async function setHandoffFile(file: File): Promise<void> {
	if (typeof indexedDB === 'undefined') return
	try {
		const db = await openDb()
		const record: HandoffRecord = { file, expiresAt: Date.now() + TTL_MS }
		await new Promise<void>((resolve, reject) => {
			const tx = db.transaction(STORE_NAME, 'readwrite')
			tx.objectStore(STORE_NAME).put(record, RECORD_KEY)
			tx.oncomplete = () => resolve()
			tx.onerror = () => reject(tx.error)
		})
		db.close()
	} catch {
		// IndexedDB недоступна (приватный режим старого Safari и т.п.) —
		// передача файла просто не сработает, как и без неё.
	}
}

export async function takeHandoffFile(): Promise<File | null> {
	if (typeof indexedDB === 'undefined') return null
	try {
		const db = await openDb()
		const record = await new Promise<HandoffRecord | undefined>(
			(resolve, reject) => {
				const tx = db.transaction(STORE_NAME, 'readonly')
				const request = tx.objectStore(STORE_NAME).get(RECORD_KEY)
				request.onsuccess = () => resolve(request.result)
				request.onerror = () => reject(request.error)
			}
		)
		db.close()
		if (!record || record.expiresAt < Date.now()) return null
		return record.file
	} catch {
		return null
	}
}
