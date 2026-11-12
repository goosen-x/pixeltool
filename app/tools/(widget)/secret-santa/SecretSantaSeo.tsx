import Link from 'next/link'

export function SecretSantaSeo() {
	return (
		<div className='mx-auto mt-16 max-w-3xl space-y-12'>
			<section>
				<h2 className='text-2xl font-bold tracking-tight'>
					Как провести Тайного Санту онлайн
				</h2>
				<ol className='mt-4 list-decimal space-y-2 pl-5 text-muted-foreground'>
					<li>
						Впишите участников, по одному на строку. Если кто-то уже сказал, что
						хочет, добавьте это через двоеточие: «Аня: книга».
					</li>
					<li>
						Укажите бюджет и дату обмена подарками. Они попадут в карточку
						каждого участника, и никто не переспросит в чате.
					</li>
					<li>
						Если в компании есть пары или семьи, впишите их в исключения:
						супругам скучно дарить друг другу ещё один подарок.
					</li>
					<li>
						Нажмите «Провести жеребьёвку» и разошлите каждому его личную ссылку.
						Открыв её, человек увидит только своего подопечного.
					</li>
				</ol>
				<p className='mt-4 text-muted-foreground'>
					Регистрация не нужна ни организатору, ни участникам. Раскладка
					хранится в вашем браузере, поэтому ссылки не пропадут, если закрыть
					вкладку и вернуться позже.
				</p>
			</section>

			<section>
				<h2 className='text-2xl font-bold tracking-tight'>
					Правила игры в Тайного Санту
				</h2>
				<p className='mt-3 text-muted-foreground'>
					Каждый участник тайно дарит подарок одному человеку из группы и сам
					получает подарок от кого-то другого. Кто кому дарит, знает только
					даритель. На встрече подарки складывают под ёлку или вручают по
					очереди, а угадать своего Санту можно по ходу вечера или не узнать
					вовсе.
				</p>
				<p className='mt-4 text-muted-foreground'>
					Чтобы игра прошла без обид, заранее договоритесь о трёх вещах: одном
					бюджете для всех, дате обмена и том, можно ли дарить деньги и
					подарочные сертификаты. Бюджет и дату удобно вписать прямо в
					жеребьёвку. Жеребьёвка гарантирует, что никто не вытянет сам себя и
					каждый получит ровно один подарок.
				</p>
			</section>

			<section>
				<h2 className='text-2xl font-bold tracking-tight'>
					Что подарить, если пожелания нет
				</h2>
				<div className='mt-4 overflow-x-auto'>
					<table className='w-full text-left text-sm'>
						<thead>
							<tr className='border-b text-muted-foreground'>
								<th className='py-2 pr-4 font-medium'>Бюджет</th>
								<th className='py-2 font-medium'>Что обычно дарят</th>
							</tr>
						</thead>
						<tbody className='text-foreground'>
							<tr className='border-b'>
								<td className='py-2 pr-4 whitespace-nowrap'>до 500 ₽</td>
								<td className='py-2'>
									хороший чай или кофе, сладости ручной работы, носки с принтом,
									ёлочная игрушка
								</td>
							</tr>
							<tr className='border-b'>
								<td className='py-2 pr-4 whitespace-nowrap'>500–1500 ₽</td>
								<td className='py-2'>
									книга, термокружка, карточная или небольшая настольная игра,
									свеча, пазл
								</td>
							</tr>
							<tr>
								<td className='py-2 pr-4 whitespace-nowrap'>1500–3000 ₽</td>
								<td className='py-2'>
									беспроводная зарядка, плед, набор для хобби, сертификат на
									мастер-класс
								</td>
							</tr>
						</tbody>
					</table>
				</div>
				<p className='mt-4 text-muted-foreground'>
					Если участники почти не знакомы, выручают вещи, которые пригодятся
					любому: что-то съедобное, тёплое или для рабочего стола. Парфюм и
					одежда по размеру рискованны, их лучше оставить тем, кто знает
					подопечного.
				</p>
			</section>

			<section>
				<h2 className='text-2xl font-bold tracking-tight'>
					Как устроены личные ссылки
				</h2>
				<p className='mt-3 text-muted-foreground'>
					Жеребьёвка проходит в браузере организатора, на сервер список не
					отправляется. В каждой ссылке закодирована карточка одного человека:
					кому он дарит, пожелание, бюджет и дата. Эта часть адреса стоит после
					знака #, а браузеры её на сервер не передают. Имя подопечного в ссылке
					не читается глазами, но это защита от случайного взгляда, а не шифр:
					организатор всегда может нажать «Показать пары».
				</p>
				<p className='mt-4 text-muted-foreground'>
					Нужно просто вытянуть одно имя из списка или раздать места по жребию?
					Для этого есть{' '}
					<Link
						href='/tools/draw-lots'
						className='cursor-pointer font-medium text-primary hover:underline'
					>
						онлайн-жеребьёвка
					</Link>
					, а поделить людей на команды поможет{' '}
					<Link
						href='/tools/team-randomizer'
						className='cursor-pointer font-medium text-primary hover:underline'
					>
						рандомайзер команд
					</Link>
					.
				</p>
			</section>
		</div>
	)
}
