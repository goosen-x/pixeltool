'use client'

import { useYandexAd } from './useYandexAd'

const BLOCK_ID = 'R-A-19531689-1'
const CONTAINER_ID = 'yandex_rtb_sidebar_R-A-19531689-1'

/**
 * Тот же блок в боковой колонке. Как и AdSection, не занимает места, пока
 * объявление не пришло.
 */
export function SidebarAd() {
	const filled = useYandexAd(BLOCK_ID, CONTAINER_ID)

	return (
		<div className={filled ? 'my-5 flex w-full justify-center' : undefined}>
			<div id={CONTAINER_ID} className='mx-auto w-full max-w-[300px]' />
		</div>
	)
}
