'use client'

import { useEffect, useState, type ReactNode } from 'react'
import { X } from 'lucide-react'
import { measureChromeHeight } from '@/lib/ui/chrome-height'

interface ToolOfMonthBannerDismissProps {
	children: ReactNode
}

const STORAGE_KEY_PREFIX = 'pixeltool:tool-of-month-dismissed:'

export const TOOL_OF_MONTH_BANNER_ID = 'tool-of-month-banner'

/** Ключ считаем на клиенте, а не берём пропом с сервера: рендер лежит в ISR-кэше
 *  (app/layout.tsx, revalidate), и страница, отданная в июле, может открыться у
 *  человека уже в августе — тогда серверный year_month записал бы флаг не в тот
 *  месяц. new Date().toISOString() даёт UTC, ровно как currentYearMonth(). */
function dismissKey(): string {
	return STORAGE_KEY_PREFIX + new Date().toISOString().slice(0, 7)
}

/** Синхронный скрипт до первой отрисовки: баннер стоит в обычном потоке в самом
 *  верху страницы, поэтому «сначала спрятать, после гидратации показать» (как в
 *  CookieConsent) сдвинуло бы вниз всю страницу на каждом непросмотренном
 *  визите. Здесь наоборот: разметка приходит с сервера видимой, а этот скрипт
 *  успевает скрыть её до paint, если флаг уже стоит. */
const HIDE_IF_DISMISSED = `(function(){try{var s=document.currentScript;var e=s&&s.parentElement;if(!e)return;var k=${JSON.stringify(STORAGE_KEY_PREFIX)}+new Date().toISOString().slice(0,7);if(localStorage.getItem(k))e.style.display='none'}catch(_){}})()`

export function ToolOfMonthBannerDismiss({
	children
}: ToolOfMonthBannerDismissProps) {
	const [isDismissed, setIsDismissed] = useState(false)

	// Догоняем инлайн-скрипт в React-состоянии: сам по себе он только прячет
	// узел (без мигания), а здесь баннер честно убирается из дерева. Нужно и на
	// случай, когда скрипт не отработал (чистый клиентский рендер, тесты).
	useEffect(() => {
		try {
			if (localStorage.getItem(dismissKey())) setIsDismissed(true)
		} catch {
			// приватный режим/заблокированное хранилище — оставляем видимым
		}
	}, [])

	// Высота «шапки» изменилась — пересчитать --chrome-h, на неё завязана
	// раскладка страниц тулов (components/sidebars/*).
	useEffect(() => {
		measureChromeHeight()
	}, [isDismissed])

	const handleDismiss = () => {
		try {
			localStorage.setItem(dismissKey(), '1')
		} catch {
			// приватный режим — переживёт до перезагрузки, не критично
		}
		setIsDismissed(true)
	}

	if (isDismissed) return null

	return (
		<div
			id={TOOL_OF_MONTH_BANNER_ID}
			className='relative flex items-center bg-gradient-to-r from-primary to-primary/80 text-primary-foreground'
		>
			<script dangerouslySetInnerHTML={{ __html: HIDE_IF_DISMISSED }} />
			<div className='min-w-0 flex-1'>{children}</div>
			{/* right-1 (0.25rem) + p-1.5 + иконка 1rem = ровно 2rem — столько же,
			    сколько px-8 у ссылки внутри, так что кнопка не наезжает на текст */}
			<button
				onClick={handleDismiss}
				aria-label='Закрыть'
				className='absolute right-1 top-1/2 shrink-0 -translate-y-1/2 cursor-pointer rounded-lg p-1.5 text-primary-foreground/80 transition-colors hover:bg-black/10 hover:text-primary-foreground'
			>
				<X className='h-4 w-4' />
			</button>
		</div>
	)
}
