import type { CSSProperties, ComponentType } from 'react'
import { cn } from '@/lib/utils'

// Размеры бейджа-уголка и его вырезов. Фиксированные (не адаптивные): все
// три куска (бейдж + два выреза) должны договориться об одном общем холсте
// градиента (см. ниже), поэтому упрощаем до одного набора чисел.
const BADGE_SIZE = 60
const NOTCH_SIZE = 22
const CANVAS = BADGE_SIZE + NOTCH_SIZE

// Бейдж и оба выреза красятся ОДНИМ и тем же градиентом, но рисуют его каждый
// как часть общего холста CANVAS×CANVAS (background-size + свой отрицательный
// background-position) — иначе каждый кусок считает свой маленький градиент
// независимо от 0 до 100% внутри собственных границ, и на резких градиентах
// (например from-black to-white) на стыке виден шов. Общий холст гарантирует
// непрерывность при любых цветах.
function sharedGradientStyle(x: number, y: number): CSSProperties {
	return {
		backgroundSize: `${CANVAS}px ${CANVAS}px`,
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
	className,
	transform
}: {
	focal: string
	gradient: string
	x: number
	y: number
	className: string
	transform: string
}) {
	const mask = `radial-gradient(circle at ${focal}, transparent calc(${NOTCH_SIZE}px - 0.5px), #000 ${NOTCH_SIZE}px)`
	return (
		<span
			aria-hidden
			className={cn(
				'pointer-events-none absolute z-0 bg-gradient-to-br',
				gradient,
				className
			)}
			style={{
				width: NOTCH_SIZE,
				height: NOTCH_SIZE,
				WebkitMask: mask,
				mask,
				transform,
				...sharedGradientStyle(x, y)
			}}
		/>
	)
}

interface CornerBadgeProps {
	icon: ComponentType<{ className?: string }>
	gradient: string
}

// Квадратный бейдж-уголок с вогнутыми вырезами, сидящий вплотную в правом
// верхнем углу карточки (родитель должен быть rounded-3xl + overflow-hidden +
// position: relative). Общий приём для ToolCard и любых других карточек,
// которым нужен тот же визуальный язык.
export function CornerBadge({ icon: Icon, gradient }: CornerBadgeProps) {
	return (
		<div
			className={cn(
				'absolute right-0 top-0 z-10 flex items-center justify-center rounded-bl-2xl rounded-tr-3xl bg-gradient-to-br text-white shadow-lg',
				gradient
			)}
			style={{
				width: BADGE_SIZE,
				height: BADGE_SIZE,
				...sharedGradientStyle(CANVAS - BADGE_SIZE, 0)
			}}
		>
			<CornerNotch
				focal='bottom left'
				gradient={gradient}
				x={CANVAS - NOTCH_SIZE}
				y={BADGE_SIZE}
				className='bottom-0 right-0'
				transform='translateY(100%)'
			/>
			<CornerNotch
				focal='bottom left'
				gradient={gradient}
				x={0}
				y={0}
				className='left-0 top-0'
				transform='translateX(-100%)'
			/>
			<Icon className='relative z-10 h-6 w-6 sm:h-7 sm:w-7' />
		</div>
	)
}
