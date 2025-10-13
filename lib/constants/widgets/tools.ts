import { Widget } from './index'
import {
	Clock,
	Code,
	Database,
	ImageIcon,
	LinkIcon,
	Monitor,
	TerminalSquare,
	Youtube
} from 'lucide-react'
import { SVGIcon } from '@/components/icons/SVGIcon'

export const toolWidgets: Widget[] = [
	{
		id: 'svg-encoder',
		icon: SVGIcon,
		category: 'tools',
		translationKey: 'svgEncoder',
		path: 'svg-to-base64-encoder',
		gradient: 'from-teal-500 to-cyan-500',
		title: 'SVG URL кодировщик',
		description:
			'Кодируйте SVG для использования в CSS свойстве background-image',
		useCase: 'Кодирование SVG изображений для CSS фонов без внешних файлов',
		recommendedTools: ['qr-generator', 'color-converter', 'youtube-thumbnail'],
		difficulty: 'beginner',
		tags: ['svg', 'encoder', 'base64', 'css', 'background'],
		metaDescription:
			'SVG to CSS encoder. Convert SVG images to data URLs for CSS backgrounds.',
		faqs: [
			{
				question: 'Что такое кодирование SVG?',
				answer:
					'Кодирование SVG преобразует SVG-файлы в data URL, которые можно встраивать прямо в CSS, устраняя необходимость во внешних файлах.'
			},
			{
				question: 'Когда использовать закодированные SVG?',
				answer:
					'Используйте закодированные SVG для маленьких иконок и декоративных элементов в CSS для уменьшения HTTP-запросов и улучшения скорости загрузки.'
			},
			{
				question: 'Какие есть ограничения?',
				answer:
					'Закодированные SVG увеличивают размер CSS файла. Лучше всего для графики менее 5КБ. Большие файлы должны оставаться внешними.'
			},
			{
				question: 'URL-кодирование лучше Base64 для SVG?',
				answer:
					'Да! URL-кодирование SVG примерно на 30% компактнее Base64. Оно кодирует только специальные символы, сохраняя читаемость и меньший размер файла.'
			},
			{
				question: 'Как оптимизировать SVG перед кодированием?',
				answer:
					'Удалите ненужные метаданные, упростите пути, округлите координаты, минифицируйте код. Используйте инструменты вроде SVGO для автоматической оптимизации перед встраиванием.'
			}
		]
	},
	{
		id: 'youtube-thumbnail',
		icon: Youtube,
		category: 'tools',
		translationKey: 'youtubeThumbnail',
		path: 'youtube-thumbnail-downloader',
		gradient: 'from-red-500 to-pink-500',
		title: 'YouTube превью граббер',
		description:
			'Извлекайте изображения превью из любого видео YouTube в различных разрешениях',
		useCase:
			'Извлечение превью YouTube видео в разных разрешениях для создания контента',
		recommendedTools: ['qr-generator', 'svg-encoder', 'utm-builder'],
		difficulty: 'beginner',
		tags: ['youtube', 'thumbnail', 'download', 'media', 'video'],
		metaDescription:
			'YouTube thumbnail downloader. Get video thumbnails in all resolutions from any YouTube URL.',
		faqs: [
			{
				question: 'Какие разрешения доступны?',
				answer:
					'YouTube предоставляет миниатюры в нескольких разрешениях: default (120x90), medium (320x180), high (480x360), standard (640x480) и maxres (1280x720).'
			},
			{
				question: 'Можно ли скачать миниатюры любого видео YouTube?',
				answer:
					'Да, если видео публичное. Приватные или удалённые видео не имеют доступных миниатюр.'
			},
			{
				question: 'Это законно использовать?',
				answer:
					'Миниатюры публично доступны. Однако уважайте авторские права при использовании их в своих проектах.'
			},
			{
				question: 'Какие форматы URL поддерживаются?',
				answer:
					'Инструмент работает со всеми форматами YouTube URL: полные ссылки (youtube.com/watch?v=...), короткие (youtu.be/...), встраиваемые (youtube.com/embed/...) и мобильные (m.youtube.com/...).'
			},
			{
				question: 'Доступны ли миниатюры maxres для всех видео?',
				answer:
					'Нет. Maxres (1280x720) доступен только если автор загрузил кастомную миниатюру высокого разрешения. Для старых видео или автогенерируемых превью максимальное разрешение может быть standard (640x480).'
			}
		]
	},
	{
		id: 'mock-data-generator',
		icon: Database,
		category: 'tools',
		translationKey: 'mockDataGenerator',
		path: 'mock-data-generator',
		gradient: 'from-emerald-500 to-teal-600',
		title: 'Генератор тестовых данных API',
		description:
			'Бесплатный онлайн генератор тестовых данных. Получайте примеры данных из бесплатных API для тестирования',
		useCase:
			'Бесплатный генератор реалистичных тестовых данных для разработки и прототипирования',
		recommendedTools: ['html-tree', 'css-specificity', 'qr-generator'],
		difficulty: 'beginner',
		tags: ['api', 'mock', 'data', 'json', 'testing', 'development'],
		metaDescription:
			'Mock data generator using free public APIs. Get sample users, posts, products, and more.',
		faqs: [
			{
				question: 'Какие API включены?',
				answer:
					'Популярные бесплатные API, такие как JSONPlaceholder, RandomUser, FakeStore API, PokeAPI и другие. Все поддерживают CORS и не требуют аутентификации.'
			},
			{
				question: 'Можно ли использовать эти данные в продакшене?',
				answer:
					'Эти API предоставляют моковые данные для тестирования и разработки. Для продакшена используйте собственные источники данных или проверьте условия использования каждого API.'
			},
			{
				question: 'Есть ли ограничения по запросам?',
				answer:
					'Большинство API имеют щедрые или неограниченные лимиты для базового использования. Конкретные лимиты показаны для каждой конечной точки API.'
			},
			{
				question: 'Какие типы данных можно сгенерировать?',
				answer:
					'Пользователи с фото и адресами, посты блогов, товары с ценами, изображения, данные геолокации, JSON структуры любой сложности. Идеально для тестирования UI компонентов, таблиц, карточек товаров.'
			},
			{
				question: 'Как интегрировать с фреймворками?',
				answer:
					'Используйте fetch/axios в React/Vue/Angular. API возвращают JSON, готовый для useState/reactive data. Идеально для прототипирования перед подключением реального бэкенда.'
			}
		]
	},
	{
		id: 'utm-builder',
		icon: LinkIcon,
		category: 'tools',
		translationKey: 'utmBuilder',
		path: 'utm-link-builder',
		gradient: 'from-pink-500 to-rose-500',
		recommendedTools: [
			'qr-generator',
			'seo-markdown-generator',
			'youtube-thumbnail'
		],
		title: 'UTM конструктор ссылок',
		description:
			'Создавайте отслеживаемые ссылки с UTM параметрами для маркетинговых кампаний',
		useCase: 'Создание UTM-меток для отслеживания маркетинговых кампаний',
		difficulty: 'beginner',
		tags: ['utm', 'marketing', 'analytics', 'tracking', 'campaign'],
		metaDescription:
			'UTM link builder for marketing campaigns. Track traffic sources in Google Analytics.',
		faqs: [
			{
				question: 'Что такое UTM параметры и зачем их использовать?',
				answer:
					'UTM параметры - это метки, добавляемые к URL, которые помогают отслеживать эффективность маркетинговых кампаний в Google Analytics, идентифицируя источники трафика, каналы и кампании.'
			},
			{
				question: 'В чём разница между utm_source и utm_medium?',
				answer:
					'utm_source определяет источник трафика (google, facebook, newsletter), а utm_medium определяет маркетинговый канал (cpc, social, email).'
			},
			{
				question: 'Чувствительны ли UTM параметры к регистру?',
				answer:
					'Да! Используйте последовательное именование в нижнем регистре, чтобы избежать дублирования записей в аналитике. "Email" и "email" рассматриваются как разные источники.'
			},
			{
				question: 'Как отслеживать производительность UTM в Google Analytics?',
				answer:
					'Перейдите в Привлечение > Кампании > Все кампании в Google Analytics, чтобы увидеть детальные данные о производительности ваших UTM-меченых кампаний.'
			},
			{
				question:
					'Следует ли использовать UTM параметры для внутренних ссылок?',
				answer:
					'Нет, избегайте UTM параметров на внутренних ссылках, так как они могут сбросить данные сеанса и создать неточные отчёты аналитики внутри вашего сайта.'
			}
		]
	},
	{
		id: 'image-size-checker',
		icon: ImageIcon,
		category: 'tools',
		translationKey: 'imageSizeChecker',
		path: 'image-size-checker',
		gradient: 'from-cyan-500 to-blue-600',
		title: 'Проверка размера изображений',
		description:
			'Мгновенно проверьте размеры, размер файла и формат изображений',
		useCase:
			'Быстрая проверка размера и метаданных изображений для веб-оптимизации',
		recommendedTools: [
			'favicon-generator',
			'qr-generator',
			'youtube-thumbnail-downloader'
		],
		difficulty: 'beginner',
		tags: [
			'image',
			'size',
			'dimensions',
			'checker',
			'analyzer',
			'aspect-ratio'
		],
		metaDescription:
			'Image size checker and analyzer. Check dimensions, file size, format, and aspect ratio of multiple images.',
		faqs: [
			{
				question: 'Какие форматы изображений поддерживаются?',
				answer:
					'Инструмент поддерживает все распространенные форматы изображений включая JPG, PNG, GIF, WebP, SVG, BMP и TIFF. Он может анализировать любой формат, который может отобразить ваш браузер.'
			},
			{
				question: 'Есть ли ограничение на размер файла?',
				answer:
					'Жесткого ограничения нет, но очень большие изображения (более 50МБ) могут обрабатываться дольше. Инструмент работает полностью в вашем браузере, поэтому производительность зависит от вашего устройства.'
			},
			{
				question: 'Как рассчитывается соотношение сторон?',
				answer:
					'Соотношение сторон рассчитывается путем нахождения наибольшего общего делителя ширины и высоты, затем выражается как простейшее соотношение целых чисел (например, 16:9 вместо 1920:1080).'
			},
			{
				question: 'Можно ли проверить несколько изображений сразу?',
				answer:
					'Да! Вы можете выбрать или перетащить несколько изображений одновременно. Инструмент обработает их все и отобразит результаты в виде сетки.'
			},
			{
				question: 'Безопасны ли мои данные изображений?',
				answer:
					'Абсолютно. Вся обработка происходит локально в вашем браузере. Никакие изображения не загружаются на сервер. Ваши файлы остаются полностью конфиденциальными.'
			}
		]
	},
	{
		id: 'system-info',
		icon: Monitor,
		category: 'tools',
		translationKey: 'systemInfo',
		path: 'system-info',
		gradient: 'from-indigo-500 to-purple-600',
		title: 'Информация о системе',
		description:
			'Получите детальную информацию о вашем браузере, устройстве и операционной системе',
		recommendedTools: [
			'color-converter',
			'qr-code-generator',
			'css-specificity'
		],
		difficulty: 'beginner',
		tags: [
			'system',
			'hardware',
			'monitor',
			'resolution',
			'architecture',
			'device'
		],
		useCase:
			'Мгновенное определение архитектуры системы (32/64-бит), разрешения экрана и характеристик устройства',
		metaDescription:
			'System information detector. Check if your computer is 32-bit or 64-bit, get screen resolution and device specs.',
		faqs: [
			{
				question: 'Зачем знать разрядность системы (32/64-бит)?',
				answer:
					'При загрузке программ нужно выбирать правильную версию. 64-битные системы могут запускать как 32-битные, так и 64-битные программы, но 32-битные системы работают только с 32-битным ПО.'
			},
			{
				question: 'Что такое разрешение экрана и почему это важно?',
				answer:
					'Разрешение экрана - количество пикселей на дисплее. Важно для веб-дизайна, выбора обоев, настроек игр и покупки совместимых аксессуаров.'
			},
			{
				question: 'Насколько точно определяется устройство?',
				answer:
					'У нас есть база данных тысяч популярных устройств для точного определения. Однако некоторые новые или редкие устройства могут определяться неточно.'
			},
			{
				question: 'Безопасен ли сбор этой информации?',
				answer:
					'Да, вся информация собирается локально в браузере через стандартные веб-API. Никаких данных не отправляется на сервер - всё остается на вашем устройстве.'
			},
			{
				question: 'Как узнать версию браузера для техподдержки?',
				answer:
					'Инструмент показывает полную версию браузера и User Agent строку. Скопируйте эти данные при обращении в поддержку - это помогает диагностировать проблемы совместимости.'
			}
		]
	},
	{
		id: 'timer-countdown',
		icon: Clock,
		category: 'tools',
		translationKey: 'timerCountdown',
		path: 'timer-countdown',
		gradient: 'from-orange-500 to-red-600',
		title: 'Таймер и секундомер',
		description: 'Таймер, обратный отсчёт и секундомер с уведомлениями',
		recommendedTools: [
			'unit-converter',
			'temperature-converter',
			'dice-roller'
		],
		difficulty: 'beginner',
		tags: ['timer', 'countdown', 'stopwatch', 'time', 'productivity'],
		useCase: 'Управление временем для работы, спорта или готовки',
		metaDescription:
			'Timer and countdown tool with notifications. Stopwatch, timer, and countdown in one tool.',
		faqs: [
			{
				question: 'В чём разница между режимами таймера и обратного отсчёта?',
				answer:
					'Таймер считает вверх от нуля, чтобы отслеживать прошедшее время, а обратный отсчёт считает вниз от установленного времени до нуля. Оба включают звуковые и визуальные уведомления по завершении.'
			},
			{
				question:
					'Будет ли таймер продолжать работать, если я закрою вкладку браузера?',
				answer:
					'Нет, таймер работает в вашем браузере и остановится, если вы закроете вкладку. Держите вкладку открытой или используйте уведомления браузера, чтобы знать о завершении таймера.'
			},
			{
				question: 'Можно ли установить несколько таймеров одновременно?',
				answer:
					'Этот инструмент поддерживает один активный таймер за раз. Для запуска нескольких таймеров откройте инструмент в отдельных вкладках или окнах браузера.'
			},
			{
				question: 'Какие опции уведомлений доступны?',
				answer:
					'Можно включить уведомления браузера, звуковые сигналы и визуальные предупреждения. Таймер будет мигать и воспроизводить звук при истечении времени, даже если вкладка в фоне.'
			},
			{
				question: 'Насколько точны вычисления таймера?',
				answer:
					'Таймер использует высокоточный API времени JavaScript с точностью до миллисекунд. Однако производительность браузера может немного влиять на точность при высокой нагрузке системы.'
			}
		]
	},
	{
		id: 'php-syntax-checker',
		icon: Code,
		category: 'tools',
		translationKey: 'phpSyntaxChecker',
		path: 'php-syntax-checker',
		gradient: 'from-indigo-500 to-blue-600',
		title: 'PHP валидатор',
		description: 'Проверка синтаксиса PHP для версий 5, 7 и 8',
		recommendedTools: [
			'mysql-syntax-checker',
			'javascript-syntax-checker',
			'regex-tester'
		],
		difficulty: 'intermediate',
		tags: ['php', 'syntax', 'checker', 'validator', 'code'],
		useCase: 'Валидация PHP кода перед размещением на сервере',
		metaDescription:
			'PHP syntax checker for PHP 5/7/8. Validate PHP code and find syntax errors.',
		faqs: [
			{
				question: 'Какие версии PHP поддерживаются?',
				answer:
					'Проверка синтаксиса поддерживает PHP 5.6, 7.0, 7.1, 7.2, 7.3, 7.4, 8.0, 8.1, 8.2 и 8.3, позволяя проверять код по правилам синтаксиса конкретной версии PHP.'
			},
			{
				question: 'Какие типы ошибок он обнаруживает?',
				answer:
					'Проверяющий обнаруживает синтаксические ошибки, пропущенные точки с запятой, несоответствующие скобки, неправильные имена переменных, устаревшие функции и проблемы синтаксиса, специфичные для версии.'
			},
			{
				question: 'Проверяет ли он логические ошибки или только синтаксис?',
				answer:
					'Этот инструмент фокусируется только на проверке синтаксиса. Он не обнаружит логические ошибки, неопределённые переменные во время выполнения или несоответствия типов - только ошибки парсинга PHP.'
			},
			{
				question: 'Можно ли проверять частичные фрагменты PHP кода?',
				answer:
					'Да! Можно проверять фрагменты кода, функции, классы или полные PHP файлы. Инструмент обрабатывает как открывающие теги <?php, так и автономные блоки кода.'
			},
			{
				question: 'Насколько точна отчётность об ошибках?',
				answer:
					'Проверяющий использует реальный парсер PHP, предоставляя те же сообщения об ошибках и номера строк, которые вы увидели бы при запуске php -l на своём сервере.'
			}
		]
	},
	{
		id: 'mysql-syntax-checker',
		icon: Database,
		category: 'tools',
		translationKey: 'mysqlSyntaxChecker',
		path: 'mysql-syntax-checker',
		gradient: 'from-blue-500 to-teal-600',
		title: 'MySQL валидатор',
		description: 'Проверка синтаксиса MySQL запросов на ошибки',
		recommendedTools: ['php-syntax-checker', 'json-tools', 'regex-tester'],
		difficulty: 'intermediate',
		tags: ['mysql', 'sql', 'database', 'syntax', 'validator'],
		useCase: 'Проверка SQL запросов перед выполнением в базе',
		metaDescription:
			'MySQL syntax checker and validator. Check SQL queries for syntax errors.',
		faqs: [
			{
				question: 'Какие диалекты SQL поддерживаются?',
				answer:
					'Проверяющий в основном поддерживает синтаксис MySQL 5.7 и 8.0, включая хранимые процедуры, триггеры, функции и продвинутые функции, такие как CTE, оконные функции и JSON операции.'
			},
			{
				question: 'Можно ли проверять сложные многооператорные запросы?',
				answer:
					'Да! Инструмент обрабатывает множественные операторы, хранимые процедуры, триггеры, функции и сложные вложенные запросы. Каждый оператор проверяется индивидуально с детальной отчётностью об ошибках.'
			},
			{
				question:
					'Проверяет ли он логические ошибки или проблемы производительности?',
				answer:
					'Этот инструмент фокусируется только на проверке синтаксиса. Он не обнаружит логические ошибки, проблемы производительности или не проверит, существуют ли таблицы/колонки - только ошибки парсинга SQL.'
			},
			{
				question: 'Какие типы SQL операторов можно проверять?',
				answer:
					'Все типы операторов MySQL: SELECT, INSERT, UPDATE, DELETE, CREATE, ALTER, DROP, хранимые процедуры, триггеры, функции и DDL операторы.'
			},
			{
				question: 'Как он обрабатывает специфичные для MySQL функции?',
				answer:
					'Проверяющий распознаёт специфичный для MySQL синтаксис, включая идентификаторы в обратных кавычках, функции MySQL, спецификации движков и уникальные типы данных MySQL, такие как JSON и GEOMETRY.'
			}
		]
	},
	{
		id: 'ascii-art-generator',
		icon: TerminalSquare,
		category: 'tools',
		translationKey: 'asciiArtGenerator',
		path: 'ascii-art-generator',
		gradient: 'from-green-500 to-emerald-600',
		title: 'ASCII-арт генератор',
		description: 'Превращайте текст в ASCII искусство',
		recommendedTools: [
			'text-case-converter',
			'emoji-list',
			'fancy-text-generator'
		],
		difficulty: 'intermediate',
		tags: [
			'ascii',
			'art',
			'text',
			'image',
			'converter',
			'generator',
			'creative'
		],
		useCase: 'Создание ASCII арта для терминалов или подписей',
		metaDescription:
			'ASCII art generator - convert text and images to ASCII art. Create text banners, transform images, or browse ASCII art patterns.',
		faqs: [
			{
				question: 'Какие типы ASCII-арта можно создавать?',
				answer:
					'Вы можете создавать текстовый ASCII-арт с разными стилями шрифтов, конвертировать изображения в ASCII-символы или выбирать из библиотеки готовых паттернов, включая животных, объекты и символы.'
			},
			{
				question: 'Какие форматы изображений поддерживаются?',
				answer:
					'Инструмент поддерживает все распространенные форматы изображений, включая JPG, PNG, GIF и WebP. Для лучших результатов используйте изображения с хорошим контрастом и простыми объектами.'
			},
			{
				question: 'Можно ли настроить вывод ASCII?',
				answer:
					'Да! Для изображений можно настроить ширину, выбрать разные наборы символов и инвертировать яркость. Для текста можно выбрать из нескольких стилей шрифтов.'
			},
			{
				question: 'Как сохранить или поделиться ASCII-артом?',
				answer:
					'Вы можете скопировать ASCII-арт в буфер обмена, скачать как текстовый файл или сохранить как изображение PNG. Экспорт изображения сохраняет моноширинное форматирование.'
			},
			{
				question: 'Где используется ASCII-арт в современном мире?',
				answer:
					'ASCII-арт популярен в терминальных приложениях, старт-скринах CLI-инструментов, README файлах, email подписях, текстовых логотипах и ретро-дизайне. Также используется в ASCII играх и демосцене.'
			}
		]
	}
]
