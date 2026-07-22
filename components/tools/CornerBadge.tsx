import type { CSSProperties, ComponentType } from 'react'
import { cn } from '@/lib/utils'

// Размеры по умолчанию — как на карточках-плитках. Строчные карточки
// передают меньший size/notchSize через пропсы (см. EnhancedWidgetSearch).
const DEFAULT_BADGE_SIZE = 60
const DEFAULT_NOTCH_SIZE = 22

// Бейдж и оба выреза красятся ОДНИМ и тем же градиентом, но рисуют его каждый
// как часть общего холста canvas×canvas (background-size + свой отрицательный
// background-position) — иначе каждый кусок считает свой маленький градиент
// независимо от 0 до 100% внутри собственных границ, и на резких градиентах
// (например from-black to-white) на стыке виден шов. Общий холст гарантирует
// непрерывность при любых цветах.
function sharedGradientStyle(
	x: number,
	y: number,
	canvas: number
): CSSProperties {
	return {
		backgroundSize: `${canvas}px ${canvas}px`,
		backgroundPosition: `${-x}px ${-y}px`
	}
}

// Вогнутый уголок для бейджа-иконки — та же идея, что и Notch в hero
// (components/homepage/HeroSection): почти весь вырез прозрачный (видна
// карточка под ним), кроме маленькой дуги-мостика в точке стыка с бейджем.
function CornerNotch({
	focal,
	gradient,
	x,
	y,
	canvas,
	notchSize,
	className,
	transform
}: {
	focal: string
	gradient: string
	x: number
	y: number
	canvas: number
	notchSize: number
	className: string
	transform: string
}) {
	const mask = `radial-gradient(circle at ${focal}, transparent calc(${notchSize}px - 0.5px), #000 ${notchSize}px)`
	return (
		<span
			aria-hidden
			className={cn(
				'pointer-events-none absolute z-0 bg-gradient-to-br',
				gradient,
				className
			)}
			style={{
				width: notchSize,
				height: notchSize,
				WebkitMask: mask,
				mask,
				transform,
				...sharedGradientStyle(x, y, canvas)
			}}
		/>
	)
}

interface CornerBadgeProps {
	icon: ComponentType<{ className?: string }>
	gradient: string
	/** Сторона квадрата бейджа в px. По умолчанию — размер с карточек-плиток. */
	size?: number
	/** Радиус вогнутых вырезов в px. */
	notchSize?: number
	/** Классы иконки внутри бейджа — меняются вместе с size на мелких вариантах. */
	iconClassName?: string
}

// Квадратный бейдж-уголок с вогнутыми вырезами, сидящий вплотную в правом
// верхнем углу карточки (родитель должен быть rounded-3xl + overflow-hidden +
// position: relative). Общий приём для ToolCard и любых других карточек,
// которым нужен тот же визуальный язык.
export function CornerBadge({
	icon: Icon,
	gradient,
	size = DEFAULT_BADGE_SIZE,
	notchSize = DEFAULT_NOTCH_SIZE,
	iconClassName = 'h-6 w-6 sm:h-7 sm:w-7'
}: CornerBadgeProps) {
	const canvas = size + notchSize

	return (
		<div
			className={cn(
				'absolute right-0 top-0 z-10 flex items-center justify-center rounded-bl-2xl rounded-tr-3xl bg-gradient-to-br text-white shadow-lg',
				gradient
			)}
			style={{
				width: size,
				height: size,
				...sharedGradientStyle(canvas - size, 0, canvas)
			}}
		>
			<CornerNotch
				focal='bottom left'
				gradient={gradient}
				x={canvas - notchSize}
				y={size}
				canvas={canvas}
				notchSize={notchSize}
				className='bottom-0 right-0'
				transform='translateY(100%)'
			/>
			<CornerNotch
				focal='bottom left'
				gradient={gradient}
				x={0}
				y={0}
				canvas={canvas}
				notchSize={notchSize}
				className='left-0 top-0'
				transform='translateX(-100%)'
			/>
			<Icon className={cn('relative z-10', iconClassName)} />
		</div>
	)
}
