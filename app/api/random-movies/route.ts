import { NextRequest, NextResponse } from 'next/server'

const KINOPOISK_API_URL = 'https://kinopoiskapiunofficial.tech/api/v2.2/films'
const MAX_PAGE = 5 // на каждый жанр минимум 100 фильмов (5 страниц по 20) с ratingFrom=7

interface KinopoiskFilm {
	kinopoiskId: number
	nameRu: string | null
	nameOriginal: string | null
	year: number | string | null
	genres: { genre: string }[]
	countries: { country: string }[]
	ratingKinopoisk: number | null
	ratingImdb: number | null
	posterUrl: string | null
}

export interface RandomMovie {
	id: number
	title: string
	originalTitle: string | null
	year: number | null
	genres: string[]
	countries: string[]
	ratingKinopoisk: number | null
	ratingImdb: number | null
	posterUrl: string | null
	kinopoiskUrl: string
}

function shuffle<T>(array: T[]): T[] {
	const result = [...array]
	for (let i = result.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1))
		;[result[i], result[j]] = [result[j], result[i]]
	}
	return result
}

export async function GET(request: NextRequest) {
	const apiKey = process.env.KINOPOISK_API_KEY
	if (!apiKey) {
		return NextResponse.json(
			{ error: 'KINOPOISK_API_KEY не настроен' },
			{ status: 500 }
		)
	}

	const genreId = request.nextUrl.searchParams.get('genre')
	const page = Math.floor(Math.random() * MAX_PAGE) + 1

	// order=RATING поднимает нишевые фильмы с 3-5 оценками выше признанной
	// классики (маленькая выборка легко даёт средний балл 9-10) — NUM_VOTE
	// сортирует по популярности, ratingFrom всё равно отсекает низкий рейтинг.
	const params = new URLSearchParams({
		order: 'NUM_VOTE',
		type: 'FILM',
		ratingFrom: '7',
		page: String(page)
	})
	if (genreId) params.set('genres', genreId)

	try {
		const response = await fetch(`${KINOPOISK_API_URL}?${params}`, {
			headers: { 'X-API-KEY': apiKey },
			// Кинопоиск — не наши данные, кэшировать час достаточно и укладывается
			// в дневную квоту бесплатного тарифа (500 запросов/день).
			next: { revalidate: 3600 }
		})

		if (!response.ok) {
			return NextResponse.json(
				{ error: `Kinopoisk API ответил ${response.status}` },
				{ status: 502 }
			)
		}

		const data: { items: KinopoiskFilm[] } = await response.json()

		const movies: RandomMovie[] = data.items
			.filter(film => film.nameRu)
			.map(film => ({
				id: film.kinopoiskId,
				title: film.nameRu!,
				originalTitle: film.nameOriginal,
				year: film.year ? Number(film.year) : null,
				genres: film.genres.map(g => g.genre),
				countries: film.countries.map(c => c.country),
				ratingKinopoisk: film.ratingKinopoisk,
				ratingImdb: film.ratingImdb,
				posterUrl: film.posterUrl,
				kinopoiskUrl: `https://www.kinopoisk.ru/film/${film.kinopoiskId}/`
			}))

		return NextResponse.json({ movies: shuffle(movies) })
	} catch {
		return NextResponse.json(
			{ error: 'Не удалось получить данные с Кинопоиска' },
			{ status: 502 }
		)
	}
}
