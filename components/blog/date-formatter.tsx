import { parseISO, format } from 'date-fns'
import { ru } from 'date-fns/locale'

type Props = {
	dateString: string
}

/**
 * Дата публикации по-русски: «19 мая 2026» вместо «May 19, 2026».
 * Без locale date-fns форматирует по-английски, и на русскоязычном блоге
 * это выглядело как недоперевод.
 */
const DateFormatter = ({ dateString }: Props) => {
	const date = parseISO(dateString)

	return (
		<time dateTime={dateString}>
			{format(date, 'd MMMM yyyy', { locale: ru })}
		</time>
	)
}

export default DateFormatter
