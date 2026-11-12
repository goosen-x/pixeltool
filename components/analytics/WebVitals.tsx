'use client'

import { useReportWebVitals } from 'next/web-vitals'

type LayoutShiftSource = {
	node?: Node | null
	previousRect: DOMRectReadOnly
	currentRect: DOMRectReadOnly
}

type LayoutShiftEntry = PerformanceEntry & {
	value: number
	sources?: LayoutShiftSource[]
}

/** Короткое описание узла для лога: тег, id/классы и id ближайшего предка
 *  с id. Классы Tailwind длинные, берём первые несколько. */
function describeNode(node: Node | null | undefined): string {
	if (!node) return '?'
	if (node.nodeType !== Node.ELEMENT_NODE) {
		return `#text(${(node.textContent ?? '').trim().slice(0, 30)})`
	}
	const el = node as Element
	let label = el.tagName.toLowerCase()
	if (el.id) label += `#${el.id}`
	const cls = typeof el.className === 'string' ? el.className.trim() : ''
	if (cls) label += '.' + cls.split(/\s+/).slice(0, 4).join('.')

	let parent = el.parentElement
	for (let i = 0; parent && i < 10; i++, parent = parent.parentElement) {
		if (parent.id) {
			label += ` in #${parent.id}`
			break
		}
	}
	return label
}

function rect(r: DOMRectReadOnly): number[] {
	return [r.x, r.y, r.width, r.height].map(Math.round)
}

/** Самые крупные сдвиги из сессионного окна CLS с элементами, которые
 *  сдвинулись. Нужно, чтобы видеть причину CLS у реальных посетителей:
 *  в лабораторном замере реклама РСЯ почти не грузится, и он показывает
 *  0,05 там, где GSC видит 0,70. */
function clsAttribution(entries: PerformanceEntry[]) {
	return (entries as LayoutShiftEntry[])
		.slice()
		.sort((a, b) => b.value - a.value)
		.slice(0, 3)
		.map(entry => ({
			t: Math.round(entry.startTime),
			v: Number(entry.value.toFixed(4)),
			src: (entry.sources ?? []).slice(0, 3).map(s => ({
				node: describeNode(s.node),
				from: rect(s.previousRect),
				to: rect(s.currentRect)
			}))
		}))
}

export function WebVitals() {
	useReportWebVitals(metric => {
		if (process.env.NODE_ENV === 'development') {
			console.log(metric)
			return
		}
		if (!navigator.sendBeacon) return

		const body: Record<string, unknown> = {
			metric: metric.name,
			value: metric.value,
			id: metric.id,
			url: window.location.href,
			vw: window.innerWidth,
			vh: window.innerHeight
		}
		if (metric.name === 'CLS' && metric.value > 0.05) {
			body.shifts = clsAttribution(metric.entries)
		}

		navigator.sendBeacon('/api/analytics/vitals', JSON.stringify(body))
	})

	return null
}
