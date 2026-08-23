'use client'

import { useYandexAd } from './useYandexAd'

const BLOCK_ID = 'R-A-19531689-1'
const CONTAINER_ID = 'yandex_rtb_R-A-19531689-1'

/**
 * Рекламный блок в потоке страницы. Контейнер всегда в DOM, иначе РСЯ некуда
 * рисовать, но высоту он получает только после того, как объявление реально
 * вставлено: пустой блок схлопывается в ноль и не оставляет дыры в вёрстке.
 */
export function AdSection() {
	const filled = useYandexAd(BLOCK_ID, CONTAINER_ID)

	return (
		<div className={filled ? 'my-6 w-full' : undefined}>
			<div id={CONTAINER_ID} className='mx-auto w-full' />
		</div>
	)
}
