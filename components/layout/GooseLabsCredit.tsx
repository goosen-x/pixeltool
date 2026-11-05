// При наведении: рамка становится толще и жёлтой, гусь моргает, а глаз
// подпрыгивает, клюв чуть приоткрывается. Рамка толще через inset-тень,
// а не border-width, иначе прыгает раскладка.
// prefers-reduced-motion: движение выключается, остаётся только смена рамки.
const CSS = `
.glc { transition: box-shadow .3s ease, border-color .3s ease; }
.glc:hover { border-color: #FEC200; box-shadow: inset 0 0 0 1px #FEC200; }

.glc-beak, .glc-eye { transform-box: fill-box; }
.glc-beak { transform-origin: 95% 50%; transition: transform .25s ease; }
.glc-eye { transform-origin: 50% 50%; }
.glc:hover .glc-eye { animation: glc-blink .9s ease-in-out; }
.glc:hover .glc-beak { transform: translateX(-5%) rotate(-4deg); }
@keyframes glc-blink {
	0%, 30%, 50%, 100% { transform: scaleY(1); }
	40% { transform: scaleY(.1); }
	75% { transform: scaleY(1) translateY(-25%); }
}

@media (prefers-reduced-motion: reduce) {
	.glc, .glc * { animation: none !important; transition: none !important; }
	.glc:hover * { transform: none !important; }
}
`

const CAPTION = 'Сайт разработан студией'
const CAPTION_SIZE = 12

// «GooseLabs» контуром: Montserrat Alternates SemiBold 600 с кернингом, как в
// шапке gooselabs.ru. Контур вместо шрифта — не нужно грузить файл шрифта,
// нет подмены начертания при загрузке. Единицы — 1000 на кегль.
const NAME_VIEWBOX = '44 -744 5609 756'
const NAME_PATH =
	'M572 -358H695V0H588V-41Q513 10 400 10Q303 10 222 -32Q141 -74 92 -154Q44 -234 44 -345Q44 -450 93 -534Q142 -617 228 -664Q315 -710 423 -710Q511 -710 583 -681Q655 -652 704 -596L622 -516Q542 -596 429 -596Q355 -596 298 -564Q240 -533 208 -476Q175 -419 175 -346Q175 -269 208 -214Q240 -158 294 -130Q348 -101 412 -101Q457 -101 498 -115Q540 -129 572 -156ZM810 -267Q810 -346 846 -408Q883 -470 948 -505Q1013 -540 1094 -540Q1176 -540 1241 -505Q1306 -470 1342 -408Q1379 -346 1379 -267Q1379 -188 1342 -126Q1306 -63 1241 -28Q1176 7 1094 7Q1013 7 948 -28Q883 -63 846 -126Q810 -188 810 -267ZM1253 -267Q1253 -342 1208 -388Q1163 -434 1094 -434Q1025 -434 980 -388Q936 -342 936 -267Q936 -192 980 -146Q1025 -100 1094 -100Q1163 -100 1208 -146Q1253 -192 1253 -267ZM1455 -267Q1455 -346 1492 -408Q1528 -470 1593 -505Q1658 -540 1739 -540Q1821 -540 1886 -505Q1951 -470 1988 -408Q2024 -346 2024 -267Q2024 -188 1988 -126Q1951 -63 1886 -28Q1821 7 1739 7Q1658 7 1593 -28Q1528 -63 1492 -126Q1455 -188 1455 -267ZM1898 -267Q1898 -342 1853 -388Q1808 -434 1739 -434Q1670 -434 1626 -388Q1581 -342 1581 -267Q1581 -192 1626 -146Q1670 -100 1739 -100Q1808 -100 1853 -146Q1898 -192 1898 -267ZM2083 -53 2131 -148Q2167 -124 2218 -110Q2268 -95 2317 -95Q2429 -95 2429 -154Q2429 -182 2400 -193Q2372 -204 2309 -214Q2243 -224 2202 -237Q2160 -250 2130 -282Q2099 -315 2099 -373Q2099 -449 2162 -494Q2226 -540 2334 -540Q2389 -540 2444 -528Q2499 -515 2534 -494L2486 -399Q2418 -439 2333 -439Q2278 -439 2250 -422Q2221 -406 2221 -379Q2221 -349 2252 -336Q2282 -324 2346 -313Q2410 -303 2451 -290Q2492 -277 2522 -246Q2551 -215 2551 -158Q2551 -83 2486 -38Q2421 7 2309 7Q2244 7 2182 -10Q2120 -27 2083 -53ZM3058 -157 3124 -80Q3089 -37 3034 -15Q2979 7 2910 7Q2822 7 2755 -28Q2688 -63 2652 -126Q2615 -188 2615 -267Q2615 -345 2650 -408Q2686 -470 2748 -505Q2811 -540 2890 -540Q2965 -540 3026 -508Q3088 -475 3124 -414Q3160 -354 3160 -273L2751 -193Q2770 -147 2812 -123Q2854 -99 2913 -99Q3000 -99 3058 -157ZM2736 -274V-273L3038 -331Q3025 -380 2986 -410Q2946 -440 2890 -440Q2821 -440 2778 -395Q2736 -350 2736 -274ZM3292 -700H3422V-110H3788V0H3292ZM4396 -534V0H4277V-69Q4246 -31 4200 -12Q4155 7 4100 7Q4022 7 3960 -27Q3899 -61 3864 -123Q3830 -185 3830 -267Q3830 -349 3864 -410Q3899 -472 3960 -506Q4022 -540 4100 -540Q4152 -540 4196 -522Q4239 -504 4271 -469V-534ZM4273 -267Q4273 -342 4228 -388Q4183 -434 4114 -434Q4045 -434 4000 -388Q3956 -342 3956 -267Q3956 -192 4000 -146Q4045 -100 4114 -100Q4183 -100 4228 -146Q4273 -192 4273 -267ZM5127 -267Q5127 -186 5092 -124Q5057 -61 4996 -27Q4934 7 4856 7Q4801 7 4756 -12Q4710 -31 4679 -69V0H4560V-742H4685V-469Q4717 -504 4760 -522Q4804 -540 4856 -540Q4934 -540 4996 -506Q5057 -472 5092 -410Q5127 -348 5127 -267ZM5000 -267Q5000 -342 4956 -388Q4911 -434 4842 -434Q4797 -434 4761 -414Q4725 -393 4704 -355Q4683 -317 4683 -267Q4683 -217 4704 -179Q4725 -141 4761 -120Q4797 -100 4842 -100Q4911 -100 4956 -146Q5000 -192 5000 -267ZM5185 -53 5233 -148Q5269 -124 5320 -110Q5370 -95 5419 -95Q5531 -95 5531 -154Q5531 -182 5502 -193Q5474 -204 5411 -214Q5345 -224 5304 -237Q5262 -250 5232 -282Q5201 -315 5201 -373Q5201 -449 5264 -494Q5328 -540 5436 -540Q5491 -540 5546 -528Q5601 -515 5636 -494L5588 -399Q5520 -439 5435 -439Q5380 -439 5352 -422Q5323 -406 5323 -379Q5323 -349 5354 -336Q5384 -324 5448 -313Q5512 -303 5553 -290Q5594 -277 5624 -246Q5653 -215 5653 -158Q5653 -83 5588 -38Q5523 7 5411 7Q5346 7 5284 -10Q5222 -27 5185 -53Z'
const MARK_HEIGHT = 16
const MARK_WIDTH = MARK_HEIGHT * 2 // пропорции viewBox клюва 190×95
const GAP = 8

// Клюв студии Goose Labs (gooselabs img/Vector.svg).
const BEAK =
	'M157.01 104.497C155.131 95.6004 145.401 90.8275 137.216 94.7871L44.9951 139.397C31.6071 145.874 36.2193 166 51.0918 166H152.734C161.63 166 168.27 157.811 166.432 149.106L157.01 104.497Z'

function Beak() {
	return (
		<svg
			viewBox='30 80 190 95'
			aria-hidden='true'
			className='shrink-0 overflow-visible'
			style={{ width: MARK_WIDTH, height: MARK_HEIGHT }}
		>
			<g className='glc-beak'>
				<path d={BEAK} fill='#FEC200' />
				<circle cx='140' cy='106' r='3' fill='black' />
			</g>
			<circle className='glc-eye' cx='196' cy='95' r='11' fill='black' />
		</svg>
	)
}

/**
 * Подпись «Сайт разработан студией GooseLabs» для обоих футеров:
 * белая карточка в рамке (в любой теме), во 2 строке клюв и название.
 * 2 строка ровно в ширину подписи — название-SVG занимает остаток места.
 */
// UTM, чтобы в аналитике gooselabs.ru переходы с PixelTool были видны
// отдельно. utm_content различает место плашки на сайте.
function creditHref(placement: CreditPlacement) {
	const params = new URLSearchParams({
		utm_source: 'pixeltool',
		utm_medium: 'referral',
		utm_campaign: 'site_credit',
		utm_content: placement
	})
	return `https://gooselabs.ru/?${params}`
}

type CreditPlacement = 'footer' | 'tool_sidebar' | 'tool_footer'

export function GooseLabsCredit({
	placement = 'footer'
}: {
	placement?: CreditPlacement
}) {
	return (
		<>
			<style>{CSS}</style>
			<a
				href={creditHref(placement)}
				data-gooselabs-credit
				target='_blank'
				rel='noopener'
				className='glc inline-flex cursor-pointer flex-col items-start gap-1 rounded-xl border border-neutral-200 bg-white px-4 py-1.5 leading-tight text-neutral-500'
			>
				<span
					className='glc-caption whitespace-nowrap'
					style={{ fontSize: CAPTION_SIZE }}
				>
					{CAPTION}
				</span>
				{/* Строка во всю ширину подписи: клюв фиксированный, название
				    растягивается на остаток. width 0 + flex-1: само колонку не
				    распирает, её ширину задаёт подпись. */}
				<span className='flex w-full items-center' style={{ gap: GAP }}>
					<Beak />
					<svg
						viewBox={NAME_VIEWBOX}
						role='img'
						aria-label='GooseLabs'
						className='h-auto w-0 flex-1 overflow-visible'
					>
						<path d={NAME_PATH} fill='#0a0a0a' />
					</svg>
				</span>
			</a>
		</>
	)
}
