export function TimezoneDifferenceSeo() {
	return (
		<div className='mx-auto mt-16 max-w-3xl space-y-12'>
			<section>
				<h2 className='text-2xl font-bold tracking-tight'>
					Одиннадцать часовых поясов России
				</h2>
				<p className='mt-3 text-muted-foreground'>
					С октября 2014 года страна живёт в 11 часовых поясах, от Калининграда
					(UTC+2) до Камчатки и Чукотки (UTC+12). Границы проведены не строго по
					меридианам, а по административным границам регионов, поэтому сосед
					через реку иногда живёт в другом времени. Переход на летнее время в
					России отменён, все 11 поясов держат время круглый год без сезонных
					сдвигов.
				</p>
				<div className='mt-6 overflow-x-auto'>
					<table className='w-full text-sm'>
						<thead>
							<tr className='border-b text-left'>
								<th className='py-2 pr-4 font-medium'>Пояс</th>
								<th className='py-2 pr-4 font-medium'>Смещение</th>
								<th className='py-2 font-medium'>Город-ориентир</th>
							</tr>
						</thead>
						<tbody className='text-muted-foreground'>
							<tr className='border-b'>
								<td className='py-2 pr-4'>Калининградское</td>
								<td className='py-2 pr-4 font-mono'>UTC+2</td>
								<td className='py-2'>Калининград</td>
							</tr>
							<tr className='border-b'>
								<td className='py-2 pr-4'>Московское</td>
								<td className='py-2 pr-4 font-mono'>UTC+3</td>
								<td className='py-2'>Москва</td>
							</tr>
							<tr className='border-b'>
								<td className='py-2 pr-4'>Самарское</td>
								<td className='py-2 pr-4 font-mono'>UTC+4</td>
								<td className='py-2'>Самара</td>
							</tr>
							<tr className='border-b'>
								<td className='py-2 pr-4'>Екатеринбургское</td>
								<td className='py-2 pr-4 font-mono'>UTC+5</td>
								<td className='py-2'>Екатеринбург</td>
							</tr>
							<tr className='border-b'>
								<td className='py-2 pr-4'>Омское</td>
								<td className='py-2 pr-4 font-mono'>UTC+6</td>
								<td className='py-2'>Омск</td>
							</tr>
							<tr className='border-b'>
								<td className='py-2 pr-4'>Красноярское</td>
								<td className='py-2 pr-4 font-mono'>UTC+7</td>
								<td className='py-2'>Красноярск, Новосибирск</td>
							</tr>
							<tr className='border-b'>
								<td className='py-2 pr-4'>Иркутское</td>
								<td className='py-2 pr-4 font-mono'>UTC+8</td>
								<td className='py-2'>Иркутск</td>
							</tr>
							<tr className='border-b'>
								<td className='py-2 pr-4'>Якутское</td>
								<td className='py-2 pr-4 font-mono'>UTC+9</td>
								<td className='py-2'>Якутск</td>
							</tr>
							<tr className='border-b'>
								<td className='py-2 pr-4'>Владивостокское</td>
								<td className='py-2 pr-4 font-mono'>UTC+10</td>
								<td className='py-2'>Владивосток</td>
							</tr>
							<tr className='border-b'>
								<td className='py-2 pr-4'>Магаданское</td>
								<td className='py-2 pr-4 font-mono'>UTC+11</td>
								<td className='py-2'>Магадан</td>
							</tr>
							<tr>
								<td className='py-2 pr-4'>Камчатское</td>
								<td className='py-2 pr-4 font-mono'>UTC+12</td>
								<td className='py-2'>Петропавловск-Камчатский</td>
							</tr>
						</tbody>
					</table>
				</div>
			</section>

			<section>
				<h2 className='text-2xl font-bold tracking-tight'>
					Почему разница бывает не круглым числом часов
				</h2>
				<p className='mt-3 text-muted-foreground'>
					Большинство поясов сдвинуты друг относительно друга на целое число
					часов, но не все. Индия живёт по UTC+5:30, Иран по UTC+3:30, часть
					Австралии по UTC+9:30 или UTC+8:45. Смещение на полчаса или без малого
					час появилось исторически, страна выбирала пояс так, чтобы полдень по
					солнцу и полдень по часам расходились не слишком сильно, а не
					подгоняла время под соседей. Разница между такой зоной и обычной
					поэтому тоже дробная, и это не ошибка расчёта.
				</p>
			</section>

			<section>
				<h2 className='text-2xl font-bold tracking-tight'>
					Летнее время меняет разницу в течение года
				</h2>
				<p className='mt-3 text-muted-foreground'>
					США и большинство стран Евросоюза переводят часы весной и осенью, а
					Россия, Китай и Индия, например, нет. Из-за этого разница между
					Москвой и Нью-Йорком не постоянна: около восьми часов зимой и семи
					летом, когда в США действует летнее время. Инструмент на этой странице
					берёт смещение на текущий момент, а не из таблицы прошлого года,
					поэтому сам подстраивается под такие переходы.
				</p>
			</section>

			<section>
				<h2 className='text-2xl font-bold tracking-tight'>
					Зачем переводить конкретное время, а не только «сейчас»
				</h2>
				<p className='mt-3 text-muted-foreground'>
					Текущая разница полезна для быстрой прикидки, но при созвоне важнее
					другое: во сколько собеседник в другом городе на самом деле сядет за
					компьютер. Поле «время в городе Откуда» переводит любой час дня, не
					только текущий, и отдельно показывает, если из-за разницы встреча
					попадает на следующие или предыдущие сутки, например 23:00 в Москве
					это уже утро следующего дня во Владивостоке.
				</p>
			</section>
		</div>
	)
}
