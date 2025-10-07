'use client'

import Script from 'next/script'

const YandexMetrika = () => {
	const metrikaId = process.env.NEXT_PUBLIC_YANDEX_METRIKA_ID
	const isDevelopment = process.env.NODE_ENV === 'development'

	// Don't load Yandex Metrika if:
	// - No metrika ID
	// - In development mode
	if (!metrikaId || isDevelopment) {
		return null
	}

	return (
		<>
			<Script
				id='yandex-metrika'
				strategy='afterInteractive'
				dangerouslySetInnerHTML={{
					__html: `
						(function(m,e,t,r,i,k,a){
							m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};
							m[i].l=1*new Date();
							for (var j = 0; j < document.scripts.length; j++) {if (document.scripts[j].src === r) { return; }}
							k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)
						})(window, document,'script','https://mc.yandex.ru/metrika/tag.js?id=${metrikaId}', 'ym');

						ym(${metrikaId}, 'init', {
							ssr:true,
							webvisor:true,
							clickmap:true,
							ecommerce:"dataLayer",
							accurateTrackBounce:true,
							trackLinks:true
						});
					`
				}}
			/>
			<noscript>
				<div>
					{/* eslint-disable-next-line @next/next/no-img-element */}
					<img
						src={`https://mc.yandex.ru/watch/${metrikaId}`}
						style={{ position: 'absolute', left: '-9999px' }}
						alt=''
					/>
				</div>
			</noscript>
		</>
	)
}

export default YandexMetrika
