import Link from 'next/link'
import {
	calculateFullDestinyMatrix,
	getArcana,
	type FullPointKey
} from '@/lib/utils/destiny-matrix'
import { DestinyMatrixDiagram } from './DestinyMatrixDiagram'
import { DestinyMatrixFullDiagram } from './DestinyMatrixFullDiagram'

export const EXAMPLE_BIRTH_DATE = '1994-03-17'
export const EXAMPLE_RESULT = calculateFullDestinyMatrix(17, 3, 1994)

interface DestinyMatrixCalculatorSeoProps {
	/**
	 * Сплошной текст расшифровки для примерной даты, посчитанный в
	 * layout.tsx (серверный компонент) через fetchNarrativeBlock. Тут, а не
	 * внутри этого файла, потому что сам Seo-блок рендерится изнутри
	 * клиентской page.tsx и не может быть асинхронным компонентом ни
	 * получить доступ к 550-текстовому датасету без утечки в клиентский
	 * бандл (см. комментарий у getPositionalMeaning).
	 */
	narrativeTexts: Partial<Record<FullPointKey, string>>
}

export function DestinyMatrixCalculatorSeo({
	narrativeTexts
}: DestinyMatrixCalculatorSeoProps) {
	const exampleResult = EXAMPLE_RESULT
	const m = getArcana(exampleResult.m)
	const n = getArcana(exampleResult.n)
	const d = getArcana(exampleResult.fourth)
	const introText =
		narrativeTexts.center ?? getArcana(exampleResult.center).meaning

	return (
		<div className='mx-auto mt-16 max-w-3xl space-y-12'>
			<section>
				<h2 className='text-2xl font-bold tracking-tight'>
					Как считается матрица судьбы
				</h2>
				<p className='mt-3 text-muted-foreground'>
					Метод соединяет нумерологию с символикой 22 старших арканов Таро.
					Число и месяц рождения берутся как есть, из года складываются цифры.
					Это три базовые точки. Четвёртая точка — сумма первых трёх, а
					центральный аркан — сумма всех четырёх. Если промежуточная сумма
					получается больше 22, цифры результата складываются повторно, пока не
					выйдет число от 1 до 22. Ровно столько старших арканов и существует.
					Классическая нумерология сворачивает дату рождения иначе, до цифры от
					1 до 9, этот расчёт есть в{' '}
					<Link
						href='/tools/numerology-calculator'
						className='cursor-pointer font-medium text-primary hover:underline'
					>
						калькуляторе числа жизненного пути
					</Link>
					.
				</p>
			</section>

			<section>
				<h2 className='text-2xl font-bold tracking-tight'>
					Пример расчёта по шагам
				</h2>
				<p className='mt-3 text-muted-foreground'>
					Возьмём дату 17 марта 1994 года. День 17 не больше 22, поэтому точка A
					= 17 как есть. Месяц 3 тоже берётся как есть, B = 3. Цифры года
					складываются: 1+9+9+4 = 23, это больше 22, поэтому цифры результата
					складываются повторно: 2+3 = 5, значит C = 5. Четвёртая точка, сумма
					первых трёх: 17+3+5 = 25, снова сводим: 2+5 = 7, D = 7. Центр, сумма
					всех четырёх: 17+3+5+7 = 32, сводим: 3+2 = 5, центр = 5.
				</p>
				<div className='mt-6'>
					<DestinyMatrixDiagram result={exampleResult} />
				</div>
			</section>

			<section>
				<h2 className='text-2xl font-bold tracking-tight'>
					Что означает каждая точка
				</h2>
				<p className='mt-3 text-muted-foreground'>
					Левая точка (день рождения) говорит про личность и характер. Верхняя
					(месяц) про таланты, данные от рождения. Правая (сумма цифр года) про
					родовые программы, то, что досталось по наследству от семьи. Нижняя
					(сумма первых трёх) про то, как всё это реализуется в социуме, в делах
					и отношениях с людьми. Центр — главное предназначение и зона, где
					человеку комфортнее всего быть собой.
				</p>
			</section>

			<section>
				<h2 className='text-2xl font-bold tracking-tight'>
					Матрица лет: как расчёт продолжается по возрасту
				</h2>
				<p className='mt-3 text-muted-foreground'>
					У полной методики есть ещё одна часть: матрица лет, кольцо вокруг
					основной схемы, которое показывает, какая точка «действует» в разном
					возрасте. Это 8 секторов по 10 лет на восемь точек расширенной схемы:
					день, родовой квадрат дня и месяца, месяц, родовой квадрат месяца и
					года, год, родовой квадрат года и четвёртой точки, четвёртая точка,
					родовой квадрат четвёртой точки и дня, по кругу A→F→B→G→C→H→D→I→снова
					A. Цикл занимает 80 лет, после чего секторы повторяются.
				</p>
				<div className='mt-6'>
					<DestinyMatrixFullDiagram
						result={exampleResult}
						birthDate={EXAMPLE_BIRTH_DATE}
						selection={{ kind: 'point', key: 'center' }}
						highlightedLine={null}
					/>
				</div>
			</section>

			<section>
				<h2 className='text-2xl font-bold tracking-tight'>
					Родовые линии, любовь, деньги и талант
				</h2>
				<p className='mt-3 text-muted-foreground'>
					Поверх пяти базовых точек полная методика достраивает родовой квадрат
					(точки F, G, H, I) и диагонали рода: они показывают унаследованные
					семейные программы, а не личные черты. Линия любви и линия денег
					строятся на личных диагоналях и относятся к отношениям и финансам.
					Талант в этой схеме не одна точка, а три: личный талант и два родовых,
					доставшихся по мужской и по женской линии. Калькулятор строит все
					точки сразу и даёт трактовку под каждую в блоке «Полное толкование
					матрицы судьбы» ниже, а весь расчёт можно скачать PDF-отчётом.
				</p>
			</section>

			<section>
				<h2 className='text-2xl font-bold tracking-tight'>
					Расшифровка матрицы судьбы
				</h2>
				<p className='mt-3 text-muted-foreground'>
					Расшифровка не сводится к номеру аркана: калькулятор пишет отдельный
					текст под каждую точку в контексте её позиции, не общее значение
					карты. Вот как это звучит для главного предназначения в примере 17
					марта 1994 года: «{introText}» В таком же формате разобрана каждая из
					родовых линий, любовь, деньги и талант, во вкладках блока «Полное
					толкование матрицы судьбы» выше.
				</p>
			</section>

			<section>
				<h2 className='text-2xl font-bold tracking-tight'>
					Кармический хвост в матрице судьбы
				</h2>
				<p className='mt-3 text-muted-foreground'>
					Цепочка из трёх точек: M (сумма четвёртой точки и центра), N (сумма
					четвёртой точки и M) и сама четвёртая точка D, которой цепочка
					замыкается. В примере это аркан {m.number} ({m.name}), затем{' '}
					{n.number} ({n.name}), затем {d.number} ({d.name}), повторяющийся
					сценарий, а не разовое событие. Калькулятор строит эту линию для любой
					даты во вкладке «Кармический хвост».
				</p>
			</section>

			<section>
				<h2 className='text-2xl font-bold tracking-tight'>
					Почему цифры могут отличаться от других сайтов
				</h2>
				<p className='mt-3 text-muted-foreground'>
					У расчёта нет единого отраслевого стандарта. Разные авторы по-разному
					сводят числа больше 22: кто-то вычитает 22, кто-то, как здесь,
					повторно складывает цифры результата. Поэтому на другом сайте цифры в
					вашей матрице вполне могут отличаться. Ошибки тут нет ни у кого,
					просто методики разные. Воспринимайте результат как повод для
					размышления о себе, а не как строгий факт.
				</p>
			</section>

			<section>
				<h2 className='text-2xl font-bold tracking-tight'>
					Чем матрица судьбы отличается от Квадрата Пифагора
				</h2>
				<p className='mt-3 text-muted-foreground'>
					Эти два метода часто путают, хотя они устроены по-разному. Матрица
					судьбы даёт несколько чисел от 1 до 22 и связывает их со старшими
					арканами Таро: от пяти базовых точек до родового квадрата, диагоналей
					рода и линий любви, денег и таланта, именно её считает этот
					калькулятор. Квадрат Пифагора устроен иначе: это более старая система,
					3×3 сетка, в которую записывается, сколько раз каждая цифра
					встречается в дате рождения, арканы Таро в ней не участвуют вовсе.
					Если на другом сайте увидели квадрат с частотой цифр, это другой
					метод, а не другой расчёт того же самого.
				</p>
			</section>

			<p className='text-muted-foreground'>
				Разбор методики на числовом примере и значение каждой позиции есть в
				статье{' '}
				<Link
					href='/blog/kak-rasschitat-matritsu-sudby'
					className='cursor-pointer font-medium text-primary hover:underline'
				>
					Как рассчитать матрицу судьбы по дате рождения
				</Link>
				.
			</p>
		</div>
	)
}
