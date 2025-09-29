'use client'

import { Widget } from '@/lib/constants/widgets'

import { WidgetStructuredData } from './WidgetStructuredData'
import { usePathname } from 'next/navigation'
import { ReactNode } from 'react'

interface WidgetSEOWrapperProps {
	widget: Widget
	children: ReactNode
}

// Comprehensive widget translations mapping
const WIDGET_TRANSLATIONS = {
	'css-clamp-calculator': {
		title: 'CSS Clamp калькулятор',
		description:
			'Создавайте адаптивную типографику и отступы, которые плавно масштабируются между размерами экрана'
	},
	'flexbox-generator': {
		title: 'Генератор CSS Flexbox онлайн',
		description:
			'Бесплатный онлайн генератор CSS Flexbox. Визуальный инструмент для создания и изучения CSS Flexbox макетов с кодом'
	},
	'grid-generator': {
		title: 'Генератор CSS Grid онлайн',
		description:
			'Бесплатный онлайн генератор CSS Grid. Визуальный инструмент для создания и изучения CSS Grid макетов с кодом'
	},
	'css-specificity': {
		title: 'CSS калькулятор специфичности',
		description:
			'Анализируйте специфичность CSS селекторов для понимания правил каскада'
	},
	'bezier-curve': {
		title: 'Генератор кривых Безье',
		description:
			'Создавайте пользовательские функции плавности cubic-bezier для CSS анимаций'
	},
	'svg-encoder': {
		title: 'SVG URL кодировщик',
		description:
			'Кодируйте SVG для использования в CSS свойстве background-image'
	},
	'youtube-thumbnail': {
		title: 'YouTube превью граббер',
		description:
			'Извлекайте изображения превью из любого видео YouTube в различных разрешениях'
	},
	'qr-generator': {
		title: 'Генератор QR кодов онлайн - создать QR код бесплатно',
		description:
			'Бесплатный генератор QR кодов онлайн. Создайте QR код для URL, WiFi, App Store за секунды. Генератор qr работает без регистрации'
	},
	'color-converter': {
		title: 'Конвертер цветов',
		description:
			'Конвертируйте цвета между HEX, RGB, HSL, CMYK, LAB и другими цветовыми моделями'
	},
	'html-tree': {
		title: 'HTML древо визуализатор',
		description: 'Визуализируйте HTML структуру в виде дерева с валидацией БЭМ'
	},
	'speed-test': {
		title: 'Тест скорости интернета',
		description: 'Проверьте скорость вашего интернет-соединения'
	},
	'mock-data-generator': {
		title: 'Генератор тестовых данных онлайн API',
		description:
			'Бесплатный онлайн генератор тестовых данных. Получайте примеры данных из бесплатных API для тестирования'
	},
	'password-generator': {
		title: 'Генератор паролей онлайн',
		description:
			'Бесплатный генератор паролей онлайн. Создать пароль любой сложности. Генератор надежных паролей с анализом стойкости'
	},
	'utm-builder': {
		title: 'UTM конструктор ссылок',
		description:
			'Создавайте отслеживаемые ссылки с UTM параметрами для маркетинговых кампаний'
	},
	'seo-markdown-generator': {
		title: 'SEO Markdown генератор',
		description:
			'Генерируйте SEO-оптимизированные markdown файлы для блог постов'
	},
	'team-randomizer': {
		title: 'Рандомайзер команд',
		description:
			'Создавайте случайные команды быстро и честно. Отлично подходит для игр, работы или развлечений'
	},
	'draw-lots': {
		title: 'Жеребьёвка',
		description:
			'Цифровая жеребьёвка - выбирайте имена или делайте случайный выбор честно'
	},
	'email-validator': {
		title: 'Валидатор Email',
		description: 'Проверка email адресов на синтаксис, домен и временные адреса'
	},
	'special-symbols-picker': {
		title: 'Выбор специальных символов',
		description:
			'Кликните для копирования специальных символов и Unicode символов для любого текста'
	},
	'fancy-text-generator': {
		title: 'Генератор текста онлайн - создать стилизованный текст бесплатно',
		description:
			'Бесплатный генератор текста онлайн. Создать красивый стилизованный текст в Unicode стилях для соцсетей и постов'
	},
	'random-number-generator': {
		title: 'Генератор случайных чисел онлайн',
		description:
			'Бесплатный онлайн генератор случайных чисел. Генерируйте криптографически надёжные случайные числа с опцией без дубликатов для игр и розыгрышей'
	},
	'percentage-calculator': {
		title: 'Калькулятор процентов',
		description:
			'Рассчитывайте проценты для скидок, налогов, чаевых и инвестиций'
	},
	'tip-calculator': {
		title: 'Калькулятор чаевых',
		description: 'Рассчитывайте чаевые и делите счета для ресторанов и услуг'
	},
	'text-case-converter': {
		title: 'Конвертер регистра текста',
		description: 'Конвертируйте текст в различные форматы регистра одним кликом'
	},
	'image-size-checker': {
		title: 'Проверка размера изображений',
		description:
			'Мгновенно проверьте размеры, размер файла и формат изображений'
	},
	'html-xml-parser': {
		title: 'HTML/XML парсер',
		description:
			'Парсинг и валидация HTML/XML документов с подсветкой синтаксиса'
	},
	'random-list-generator': {
		title: 'Генератор случайных списков',
		description:
			'Создавайте случайные списки элементов для тестирования или творчества'
	},
	'coin-flip': {
		title: 'Подбрасывание монеты',
		description:
			'Виртуальное подбрасывание монеты с анимацией для принятия решений'
	},
	'dice-roller': {
		title: 'Бросок костей',
		description:
			'Виртуальный бросок костей с несколькими конфигурациями и анимациями'
	},
	'social-media-formatter': {
		title: 'Форматтер для соцсетей',
		description: 'Оптимизируйте тексты для Twitter, Instagram, LinkedIn'
	},
	'emoji-list': {
		title: 'Список эмодзи',
		description: 'Просмотрите и скопируйте 1800+ эмодзи по категориям'
	},
	'text-emoticons': {
		title: 'Текстовые эмотиконы',
		description: 'ASCII смайлики и японские каомодзи для чатов'
	},
	'text-to-speech': {
		title: 'Текст в речь',
		description: 'Превращайте текст в речь с разными голосами'
	},
	'system-info': {
		title: 'Информация о системе',
		description:
			'Получите детальную информацию о вашем браузере, устройстве и операционной системе'
	},
	'json-tools': {
		title: 'JSON инструменты',
		description: 'Форматирование, валидация, минификация и сравнение JSON'
	},
	'js-css-compressor': {
		title: 'JS/CSS компрессор',
		description:
			'Минифицируйте JavaScript и CSS для улучшения производительности'
	},
	'js-validator': {
		title: 'JavaScript валидатор',
		description: 'Найдите ошибки в JavaScript коде'
	},
	'age-calculator': {
		title: 'Калькулятор возраста',
		description: 'Рассчитайте точный возраст в годах, месяцах, днях и часах'
	},
	'temperature-converter': {
		title: 'Конвертер температур',
		description: 'Конвертируйте между Цельсием, Фаренгейтом и Кельвином'
	},
	'bmi-calculator': {
		title: 'Калькулятор ИМТ',
		description: 'Рассчитайте индекс массы тела с интерпретацией результатов'
	},
	'text-counter': {
		title: 'Счётчик текста',
		description: 'Подсчитайте слова, символы, абзацы и время чтения мгновенно'
	},
	'timer-countdown': {
		title: 'Таймер и секундомер',
		description: 'Таймер, обратный отсчёт и секундомер с уведомлениями'
	},
	'currency-converter': {
		title: 'Конвертер валют',
		description: 'Конвертируйте между основными мировыми валютами'
	},
	'text-diff': {
		title: 'Сравнение текстов',
		description: 'Сравнивайте два текста и находите различия'
	},
	'php-syntax-checker': {
		title: 'PHP валидатор',
		description: 'Проверка синтаксиса PHP для версий 5, 7 и 8'
	},
	'mysql-syntax-checker': {
		title: 'MySQL валидатор',
		description: 'Проверка синтаксиса MySQL запросов на ошибки'
	},
	'regex-tester': {
		title: 'Тестер регулярных выражений',
		description: 'Тестируйте регулярные выражения для JavaScript, PHP и Python'
	},
	'javascript-syntax-checker': {
		title: 'JavaScript валидатор',
		description: 'Проверка синтаксиса JavaScript/ES6/ES2020+ с JSX'
	},
	'px-rem-converter': {
		title: 'Конвертер px в rem/em',
		description:
			'Конвертируйте между px, rem и em единицами с настройкой базового размера шрифта'
	},
	'css-box-shadow': {
		title: 'Генератор CSS box-shadow',
		description:
			'Создавайте CSS тени с визуальным предпросмотром и множественными тенями'
	},
	'css-gradient': {
		title: 'Генератор CSS градиентов',
		description:
			'Создавайте красивые CSS градиенты с визуальным редактором и предпросмотром'
	},
	'color-contrast': {
		title: 'Проверка контрастности цветов',
		description:
			'Проверьте контрастность цветов для соответствия стандартам доступности WCAG'
	},
	'css-keyframes': {
		title: 'Генератор CSS анимаций',
		description:
			'Создавайте CSS анимации с keyframes с визуальным предпросмотром'
	},
	'json-yaml-formatter': {
		title: 'JSON/YAML форматтер',
		description: 'Форматирование, валидация и конвертация JSON/YAML'
	},
	'favicon-generator': {
		title: 'Генератор Favicon',
		description: 'Создайте favicon для вашего веб-сайта всех размеров'
	},
	'base64-encoder': {
		title: 'Base64 кодировщик',
		description: 'Кодируйте и декодируйте данные в формате Base64'
	},
	'jwt-decoder': {
		title: 'JWT декодер',
		description: 'Декодируйте и анализируйте JSON Web Token без ключа'
	},
	'uuid-generator': {
		title: 'Генератор UUID',
		description: 'Создавайте уникальные идентификаторы UUID всех версий'
	},
	'compound-interest': {
		title: 'Сложные проценты',
		description: 'Рассчитайте сложные проценты с детализацией'
	},
	'loan-calculator': {
		title: 'Кредитный калькулятор',
		description: 'Рассчитайте платежи по кредиту с графиком погашения'
	},
	'fuel-calculator': {
		title: 'Калькулятор топлива',
		description: 'Рассчитайте расход топлива и стоимость поездки'
	},
	'ascii-art-generator': {
		title: 'Генератор ASCII арта',
		description: 'Превращайте текст в ASCII искусство'
	},
	'opengraph-validator': {
		title: 'OpenGraph валидатор',
		description: 'Проверяйте OpenGraph теги для соцсетей'
	}
} as const

export function WidgetSEOWrapper({ widget, children }: WidgetSEOWrapperProps) {

	const pathname = usePathname()
	const locale = pathname.split('/')[1]

	// Get title and description from the comprehensive mapping using widget.id
	const widgetData =
		WIDGET_TRANSLATIONS[widget.id as keyof typeof WIDGET_TRANSLATIONS]
	const title = widgetData?.title || widget.id
	const description = widgetData?.description || 'Инструмент для веб-разработки'

	return (
		<>
			<WidgetStructuredData
				widget={widget}
				locale={locale}
				title={title}
				description={description}
			/>
			<article
				className='w-full h-full'
				itemScope
				itemType='https://schema.org/SoftwareApplication'
			>
				<header className='sr-only'>
					<h1 itemProp='name'>{title}</h1>
					<p itemProp='description'>{description}</p>
					<meta itemProp='applicationCategory' content='WebApplication' />
					<meta itemProp='operatingSystem' content='Web Browser' />
				</header>

				<div
					itemProp='offers'
					itemScope
					itemType='https://schema.org/Offer'
					className='hidden'
				>
					<meta itemProp='price' content='0' />
					<meta itemProp='priceCurrency' content='USD' />
				</div>

				<section
					className='h-full'
					itemProp='mainEntity'
					itemScope
					itemType='https://schema.org/WebApplication'
				>
					{children}
				</section>
			</article>
		</>
	)
}
