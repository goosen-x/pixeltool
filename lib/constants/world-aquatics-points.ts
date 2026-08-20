export type SwimCourse = 'LCM' | 'SCM'
export type SwimGender = 'male' | 'female'
export type SwimStroke =
	| 'freestyle'
	| 'backstroke'
	| 'breaststroke'
	| 'butterfly'
	| 'medley'

export const STROKE_LABELS: Record<SwimStroke, string> = {
	freestyle: 'Вольный стиль',
	backstroke: 'На спине',
	breaststroke: 'Брасс',
	butterfly: 'Баттерфляй',
	medley: 'Комплекс'
}

export const COURSE_LABELS: Record<SwimCourse, string> = {
	LCM: '50 м (длинная вода)',
	SCM: '25 м (короткая вода)'
}

/** Дистанции по стилю и типу бассейна — комплекс на 100 м есть только в короткой воде. */
export const DISTANCES: Record<SwimCourse, Record<SwimStroke, number[]>> = {
	LCM: {
		freestyle: [50, 100, 200, 400, 800, 1500],
		backstroke: [50, 100, 200],
		breaststroke: [50, 100, 200],
		butterfly: [50, 100, 200],
		medley: [200, 400]
	},
	SCM: {
		freestyle: [50, 100, 200, 400, 800, 1500],
		backstroke: [50, 100, 200],
		breaststroke: [50, 100, 200],
		butterfly: [50, 100, 200],
		medley: [100, 200, 400]
	}
}

type BaseTimeTable = Partial<
	Record<SwimStroke, Partial<Record<number, number>>>
>

/**
 * Базовые времена (секунды) на 1000 очков — строка «1000» из официальных
 * таблиц World Aquatics Point Scoring. LCM 2026 (валидны 01.01–31.12.2026),
 * SCM 2025 (валидны 01.09.2025–31.08.2026, актуальная версия на момент
 * добавления тула). Источник: resources.fina.org, PDF World-Aquatics-Points-*.
 */
export const BASE_TIMES: Record<
	SwimCourse,
	Record<SwimGender, BaseTimeTable>
> = {
	LCM: {
		male: {
			freestyle: {
				50: 20.91,
				100: 46.4,
				200: 102.0,
				400: 219.96,
				800: 452.12,
				1500: 870.67
			},
			backstroke: { 50: 23.55, 100: 51.6, 200: 111.92 },
			breaststroke: { 50: 25.95, 100: 56.88, 200: 124.53 },
			butterfly: { 50: 22.27, 100: 49.45, 200: 110.34 },
			medley: { 200: 112.69, 400: 242.5 }
		},
		female: {
			freestyle: {
				50: 23.61,
				100: 51.71,
				200: 112.23,
				400: 234.18,
				800: 484.12,
				1500: 920.48
			},
			backstroke: { 50: 26.86, 100: 57.13, 200: 123.14 },
			breaststroke: { 50: 29.16, 100: 64.13, 200: 137.55 },
			butterfly: { 50: 24.43, 100: 54.6, 200: 121.81 },
			medley: { 200: 125.7, 400: 263.65 }
		}
	},
	SCM: {
		male: {
			freestyle: {
				50: 19.9,
				100: 44.84,
				200: 98.61,
				400: 212.25,
				800: 440.46,
				1500: 846.88
			},
			backstroke: { 50: 22.11, 100: 48.33, 200: 105.63 },
			breaststroke: { 50: 24.95, 100: 55.28, 200: 120.16 },
			butterfly: { 50: 21.32, 100: 47.71, 200: 106.85 },
			medley: { 100: 49.28, 200: 108.91, 400: 234.81 }
		},
		female: {
			freestyle: {
				50: 22.83,
				100: 50.31,
				200: 110.25,
				400: 237.42,
				800: 477.42,
				1500: 908.24
			},
			backstroke: { 50: 25.23, 100: 54.02, 200: 118.04 },
			breaststroke: { 50: 28.37, 100: 62.36, 200: 132.5 },
			butterfly: { 50: 23.94, 100: 52.71, 200: 119.32 },
			medley: { 100: 55.11, 200: 121.63, 400: 255.48 }
		}
	}
}

export function getBaseTime(
	course: SwimCourse,
	gender: SwimGender,
	stroke: SwimStroke,
	distance: number
): number | null {
	return BASE_TIMES[course][gender][stroke]?.[distance] ?? null
}
