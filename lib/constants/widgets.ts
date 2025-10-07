import {
	BarChart3,
	Binary,
	Box,
	Braces,
	Bug,
	Calculator,
	Circle,
	Clock,
	Code,
	Coins,
	CreditCard,
	Database,
	Dices,
	DollarSign,
	Droplet,
	FileImage,
	FileJson,
	FileSearch,
	FileText,
	Fingerprint,
	Fuel,
	Gauge,
	GitBranch,
	GitCompare,
	Globe,
	Grid3X3,
	Hash,
	Image,
	ImageIcon,
	Key,
	Languages,
	Layers,
	Link as LinkIcon,
	List,
	Lock,
	Mail,
	MessageSquare,
	Monitor,
	Palette,
	Percent,
	QrCode,
	Ruler,
	Search,
	Settings,
	Shuffle,
	Smile,
	Sparkles,
	Spline,
	Square,
	SunMoon,
	TerminalSquare,
	TestTube,
	Thermometer,
	Timer,
	TrendingUp,
	Type,
	Users,
	Volume2,
	Weight,
	Youtube,
	Zap
} from 'lucide-react'
import { JWTIcon } from '@/components/icons/JWTIcon'
import { SVGIcon } from '@/components/icons/SVGIcon'
import { MarkdownIcon } from '@/components/icons/MarkdownIcon'
export interface WidgetFAQ {
	question: string
	answer: string
}

export interface Widget {
	id: string
	icon: React.ComponentType<{ className?: string }>
	category: 'webdev' | 'content' | 'security' | 'lifestyle'
	translationKey: string
	path: string
	gradient: string
	title?: string
	description?: string
	useCase?: string
	recommendedTools?: string[] // Widget IDs that are related/recommended
	faqs?: WidgetFAQ[]
	tags?: string[] // For SEO and search
	difficulty?: 'beginner' | 'intermediate' | 'advanced'
	metaDescription?: string // For SEO
}

export const widgets: Widget[] = [
	// CSS Tools
	{
		id: 'css-clamp-calculator',
		icon: Ruler,
		category: 'webdev',
		translationKey: 'clampCalculator',
		path: 'css-clamp-calculator',
		gradient: 'from-amber-500 to-orange-500',
		title: 'CSS Clamp калькулятор',
		description:
			'Создавайте адаптивную типографику и отступы, которые плавно масштабируются между размерами экрана',
		useCase:
			'Создание адаптивной типографики и отступов, масштабируемых между размерами экрана',
		recommendedTools: ['flexbox-generator', 'grid-generator', 'bezier-curve'],
		difficulty: 'intermediate',
		tags: ['css', 'responsive', 'typography', 'fluid', 'clamp'],
		metaDescription:
			'Generate CSS clamp() functions for fluid typography. Create responsive text that scales perfectly between viewports.',
		faqs: [
			{
				question: 'Что такое функция CSS clamp()?',
				answer:
					'Функция CSS clamp() позволяет задать значение, которое масштабируется между минимумом и максимумом, идеально для адаптивной типографики.'
			},
			{
				question: 'Как рассчитать идеальные значения?',
				answer:
					'Введите минимальный и максимальный размеры шрифта вместе с шириной viewport. Калькулятор выполнит сложные вычисления за вас.'
			},
			{
				question: 'Когда использовать clamp() вместо медиа-запросов?',
				answer:
					'Используйте clamp() для плавного масштабирования между размерами viewport. Медиа-запросы лучше для резких изменений в определенных точках или изменений layout.'
			},
			{
				question: 'Какие единицы измерения можно использовать с clamp()?',
				answer:
					'Вы можете использовать любые CSS единицы с clamp(): rem, em, px, vw, vh, % и т.д. Калькулятор поддерживает px и rem, автоматически конвертируя между ними с базой 16px.'
			},
			{
				question: 'Как протестировать мои значения clamp()?',
				answer:
					'Используйте инструменты разработчика в браузере для изменения размера viewport и наблюдения за масштабированием. Живой превью в калькуляторе показывает, как будет выглядеть текст при разных размерах экрана.'
			}
		]
	},
	{
		id: 'flexbox-generator',
		icon: Box,
		category: 'webdev',
		translationKey: 'flexboxGenerator',
		path: 'flexbox-generator',
		gradient: 'from-blue-500 to-indigo-500',
		title: 'Генератор CSS Flexbox онлайн',
		description:
			'Бесплатный онлайн генератор CSS Flexbox. Визуальный инструмент для создания и изучения CSS Flexbox макетов с кодом',
		useCase:
			'Бесплатный генератор Flexbox для создания адаптивных CSS макетов и изучения flexbox',
		recommendedTools: [
			'grid-generator',
			'css-clamp-calculator',
			'css-specificity'
		],
		difficulty: 'beginner',
		tags: ['css', 'flexbox', 'layout', 'responsive', 'alignment'],
		metaDescription:
			'Interactive Flexbox CSS generator. Visualize and generate flexbox layouts with real-time preview.',
		faqs: [
			{
				question: 'Что такое CSS Flexbox?',
				answer:
					'Flexbox — это модель компоновки CSS, которая позволяет располагать элементы в гибком контейнере с мощными опциями выравнивания.'
			},
			{
				question: 'Когда использовать Flexbox вместо Grid?',
				answer:
					'Используйте Flexbox для одномерных макетов (строка или столбец) и Grid для двумерных. Flexbox идеально подходит для навигационных панелей, карточек и центрирования контента.'
			},
			{
				question: 'Как центрировать контент с помощью Flexbox?',
				answer:
					'Установите justify-content: center для горизонтального центрирования и align-items: center для вертикального на flex-контейнере.'
			},
			{
				question: 'Можно ли вкладывать Flexbox-контейнеры?',
				answer:
					'Да, можно. Вложенные flex-контейнеры позволяют создавать сложные макеты, где каждый дочерний элемент также может иметь свои flex-правила.'
			},
			{
				question: 'Какие основные свойства Flexbox?',
				answer:
					'Ключевые свойства: display: flex, flex-direction, justify-content, align-items, flex-wrap и align-self.'
			}
		]
	},
	{
		id: 'grid-generator',
		icon: Grid3X3,
		category: 'webdev',
		translationKey: 'gridGenerator',
		path: 'grid-generator',
		gradient: 'from-green-500 to-emerald-500',
		title: 'Генератор CSS Grid онлайн',
		description:
			'Бесплатный онлайн генератор CSS Grid. Визуальный инструмент для создания и изучения CSS Grid макетов с кодом',
		useCase:
			'Бесплатный генератор CSS Grid для создания адаптивных сеток и изучения grid макетов',
		recommendedTools: [
			'flexbox-generator',
			'css-clamp-calculator',
			'css-specificity'
		],
		difficulty: 'intermediate',
		tags: ['css', 'grid', 'layout', 'responsive', 'css-grid'],
		metaDescription:
			'CSS Grid layout generator with visual editor. Create complex responsive grid layouts easily.',
		faqs: [
			{
				question: 'Что такое CSS Grid?',
				answer:
					'CSS Grid - это мощная система компоновки, позволяющая создавать двумерные макеты с строками и столбцами.'
			},
			{
				question: 'Чем Grid отличается от Flexbox?',
				answer:
					'Grid для двумерных макетов (строки и столбцы), а Flexbox для одномерных. Grid даёт больше контроля над сложными макетами.'
			},
			{
				question: 'Что такое единицы fr в CSS Grid?',
				answer:
					'Единица fr представляет долю доступного пространства в grid-контейнере. Например, 1fr 2fr создаёт два столбца, где второй в два раза шире первого.'
			}
		]
	},
	{
		id: 'css-specificity',
		icon: Hash,
		category: 'webdev',
		translationKey: 'cssSpecificity',
		path: 'css-specificity-calculator',
		gradient: 'from-indigo-500 to-blue-600',
		title: 'CSS калькулятор специфичности',
		description:
			'Анализируйте специфичность CSS селекторов для понимания правил каскада',
		useCase:
			'Отладка CSS конфликтов путём расчёта и сравнения специфичности селекторов',
		recommendedTools: ['html-tree', 'flexbox-generator', 'grid-generator'],
		difficulty: 'advanced',
		tags: ['css', 'specificity', 'selectors', 'debugging', 'cascade'],
		metaDescription:
			'CSS Specificity calculator and analyzer. Understand cascade and debug CSS conflicts.',
		faqs: [
			{
				question: 'Что такое специфичность CSS?',
				answer:
					'Специфичность CSS определяет, какие стили применяются, когда несколько правил нацелены на один элемент. Она рассчитывается на основе типов используемых селекторов.'
			},
			{
				question: 'Как рассчитывается специфичность?',
				answer:
					'Специфичность рассчитывается как (встроенные стили, ID, классы/атрибуты/псевдоклассы, элементы). Например, #header .nav имеет специфичность 0-1-1-0.'
			},
			{
				question: 'Почему мой CSS не работает?',
				answer:
					'Часто это из-за конфликтов специфичности. Более специфичный селектор переопределит менее специфичные, независимо от порядка в CSS файле.'
			}
		]
	},
	{
		id: 'bezier-curve',
		icon: Spline,
		category: 'webdev',
		translationKey: 'bezierCurve',
		path: 'css-bezier-curve-generator',
		gradient: 'from-purple-500 to-indigo-500',
		title: 'Генератор кривых Безье',
		description:
			'Создавайте пользовательские функции плавности cubic-bezier для CSS анимаций',
		useCase: 'Создание пользовательских функций плавности для CSS анимаций',
		recommendedTools: ['css-clamp-calculator', 'flexbox-generator'],
		difficulty: 'intermediate',
		tags: ['css', 'animation', 'bezier', 'easing', 'transition'],
		metaDescription:
			'Interactive cubic-bezier curve generator for CSS animations. Create custom easing functions visually.',
		faqs: [
			{
				question: 'Что такое функция cubic-bezier?',
				answer:
					'Функция cubic-bezier определяет пользовательское смягчение для CSS переходов и анимаций, контролируя кривую скорости анимации.'
			},
			{
				question: 'Как работают контрольные точки?',
				answer:
					'Две контрольные точки (P1 и P2) определяют форму кривой. P1 контролирует начальное ускорение, P2 контролирует конечное замедление.'
			},
			{
				question: 'Какие есть распространённые функции смягчения?',
				answer:
					'Распространённые функции: ease (по умолчанию), ease-in (медленный старт), ease-out (медленный конец), ease-in-out (медленные старт и конец), linear (постоянная скорость).'
			}
		]
	},

	// Media & Content
	{
		id: 'svg-encoder',
		icon: SVGIcon,
		category: 'webdev',
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
			}
		]
	},
	{
		id: 'youtube-thumbnail',
		icon: Youtube,
		category: 'content',
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
			}
		]
	},
	{
		id: 'qr-generator',
		icon: QrCode,
		category: 'lifestyle',
		translationKey: 'qrGenerator',
		path: 'qr-generator',
		gradient: 'from-violet-500 to-purple-500',
		title: 'Генератор QR кодов онлайн - создать QR код бесплатно',
		description:
			'Бесплатный генератор QR кодов онлайн. Создайте QR код для URL, WiFi, App Store за секунды. Генератор qr работает без регистрации',
		useCase:
			'Бесплатный онлайн генератор qr кодов для URL, WiFi сетей, визиток и мобильных приложений',
		recommendedTools: ['utm-builder', 'svg-encoder', 'youtube-thumbnail'],
		difficulty: 'beginner',
		tags: ['qr', 'qrcode', 'generator', 'wifi', 'mobile'],
		metaDescription:
			'QR code generator for URLs, WiFi, and apps. Create customizable QR codes with colors and logos.',
		faqs: [
			{
				question: 'Что можно закодировать в QR-код?',
				answer:
					'Можно закодировать URL, текст, данные WiFi, email адреса, номера телефонов, SMS сообщения и ссылки на приложения.'
			},
			{
				question: 'Как сканировать QR-коды?',
				answer:
					'Большинство современных смартфонов могут сканировать QR-коды через встроенную камеру. Просто наведите и нажмите на уведомление.'
			},
			{
				question: 'Какова максимальная вместимость?',
				answer:
					'QR-коды могут хранить до 7089 цифр или 4296 буквенно-цифровых символов. Для лучшего сканирования используйте менее 300 символов.'
			}
		]
	},
	{
		id: 'color-converter',
		icon: Palette,
		category: 'webdev',
		translationKey: 'colorConverter',
		path: 'color-converter',
		gradient: 'from-pink-500 to-purple-500',
		title: 'Конвертер цветов',
		description:
			'Конвертируйте цвета между HEX, RGB, HSL, CMYK, LAB и другими цветовыми моделями',
		useCase:
			'Конвертация цветов между различными форматами для дизайна и разработки',
		recommendedTools: ['svg-encoder', 'bezier-curve', 'css-clamp-calculator'],
		difficulty: 'beginner',
		tags: ['color', 'converter', 'hex', 'rgb', 'hsl', 'cmyk'],
		metaDescription:
			'Universal color converter. Convert between HEX, RGB, HSL, CMYK, LAB, and XYZ color formats.',
		faqs: [
			{
				question: 'Какие форматы цветов поддерживаются?',
				answer:
					'Конвертер поддерживает HEX, RGB, RGBA, HSL, HSLA, CMYK, LAB и XYZ форматы с бесшовным преобразованием между ними.'
			},
			{
				question: 'Насколько точны преобразования?',
				answer:
					'Преобразования используют отраслевые стандартные алгоритмы. Некоторые форматы, такие как CMYK, могут немного отличаться в зависимости от цветовых профилей.'
			},
			{
				question: 'Можно ли преобразовывать прозрачные цвета?',
				answer:
					'Да! Форматы RGBA и HSLA поддерживают альфа-прозрачность. Конвертер сохраняет значения прозрачности при преобразовании.'
			}
		]
	},

	// Dev Tools
	{
		id: 'html-tree',
		icon: GitBranch,
		category: 'webdev',
		translationKey: 'htmlTree',
		path: 'html-tree-visualizer',
		gradient: 'from-purple-500 to-indigo-500',
		title: 'HTML древо визуализатор',
		description: 'Визуализируйте HTML структуру в виде дерева с валидацией БЭМ',
		useCase: 'Визуализация HTML структуры и валидация БЭМ соглашений',
		recommendedTools: ['css-specificity', 'speed-test', 'flexbox-generator'],
		difficulty: 'intermediate',
		tags: ['html', 'tree', 'bem', 'structure', 'visualization'],
		metaDescription:
			'HTML tree visualizer with BEM validation. Analyze HTML structure and class naming.',
		faqs: [
			{
				question: 'Что такое методология BEM?',
				answer:
					'BEM (Блок Элемент Модификатор) - это соглашение об именовании CSS-классов, которое делает код более поддерживаемым. Использует паттерн: блок__элемент--модификатор.'
			},
			{
				question: 'Как помогает HTML дерево?',
				answer:
					'Визуализатор дерева показывает структуру HTML иерархически, упрощая поиск проблем с вложенностью, незакрытых тегов и валидацию BEM-паттернов.'
			},
			{
				question: 'Какие нарушения BEM определяет?',
				answer:
					'Определяет неправильный BEM-синтаксис, вложенные блоки, осиротевшие элементы и неправильное использование модификаторов, помогая поддерживать единообразие.'
			}
		]
	},
	{
		id: 'speed-test',
		icon: Gauge,
		category: 'lifestyle',
		translationKey: 'speedTest',
		path: 'internet-speed-test',
		gradient: 'from-slate-500 to-gray-600',
		title: 'Тест скорости интернета',
		description: 'Проверьте скорость вашего интернет-соединения',
		useCase: 'Тестирование скорости интернет-соединения и задержки',
		recommendedTools: ['html-tree', 'css-specificity', 'svg-encoder'],
		difficulty: 'beginner',
		tags: ['speed', 'performance', 'internet', 'bandwidth', 'latency'],
		metaDescription:
			'Internet speed test tool. Measure download, upload speeds and latency.',
		faqs: [
			{
				question: 'Как работает тест скорости?',
				answer:
					'Тест загружает и выгружает порции данных для измерения пропускной способности, затем вычисляет задержку, измеряя время ответа сервера. Результаты показывают реальную производительность.'
			},
			{
				question: 'Что влияет на скорость интернета?',
				answer:
					'На скорость влияет тарифный план, загруженность сети, сила WiFi-сигнала, возможности устройства и расстояние до серверов. Проводное соединение обычно быстрее WiFi.'
			},
			{
				question: 'Какая скорость мне нужна?',
				answer:
					'Для базового сёрфинга нужно 5-10 Мбит/с, HD-стриминг требует 25 Мбит/с, 4K-стриминг нужно 50+ Мбит/с, а для онлайн-игр важнее низкая задержка, чем высокая скорость.'
			}
		]
	},
	{
		id: 'mock-data-generator',
		icon: Database,
		category: 'webdev',
		translationKey: 'mockDataGenerator',
		path: 'mock-data-generator',
		gradient: 'from-emerald-500 to-teal-600',
		title: 'Генератор тестовых данных онлайн API',
		description:
			'Бесплатный онлайн генератор тестовых данных. Получайте примеры данных из бесплатных API для тестирования',
		useCase:
			'Бесплатный генератор реалистичных тестовых данных для разработки и прототипирования',
		recommendedTools: ['html-tree', 'speed-test', 'qr-generator'],
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
			}
		]
	},

	// Productivity
	{
		id: 'password-generator',
		icon: Key,
		category: 'security',
		translationKey: 'passwordGenerator',
		path: 'password-generator',
		gradient: 'from-emerald-500 to-teal-600',
		title: 'Генератор паролей онлайн',
		description:
			'Бесплатный генератор паролей онлайн. Создать пароль любой сложности. Генератор надежных паролей с анализом стойкости',
		useCase:
			'Бесплатный онлайн генератор паролей для соцсетей, почты, аккаунтов и защиты данных',
		recommendedTools: ['qr-generator', 'utm-builder'],
		difficulty: 'beginner',
		tags: ['password', 'security', 'generator', 'random', 'secure'],
		metaDescription:
			'Secure password generator. Create strong passwords with custom length and character sets.',
		faqs: [
			{
				question: 'Что делает пароль надёжным?',
				answer:
					'Надёжные пароли имеют минимум 12 символов, используют сочетание заглавных, строчных букв, цифр и символов, избегают распространённых слов или паттернов.'
			},
			{
				question: 'Как генерируются пароли?',
				answer:
					'Генератор использует криптографически безопасную генерацию случайных чисел для обеспечения истинной случайности, делая пароли крайне сложными для предсказания или взлома.'
			},
			{
				question: 'Можно ли использовать один пароль везде?',
				answer:
					'Никогда! Используйте уникальные пароли для каждого аккаунта. Рассмотрите использование менеджера паролей для безопасного хранения всех ваших паролей.'
			}
		]
	},
	{
		id: 'utm-builder',
		icon: LinkIcon,
		category: 'content',
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
		id: 'seo-markdown-generator',
		icon: MarkdownIcon,
		category: 'content',
		translationKey: 'seoMarkdownGenerator',
		path: 'seo-markdown-generator',
		gradient: 'from-yellow-500 to-amber-500',
		title: 'SEO Markdown генератор',
		description:
			'Генерируйте SEO-оптимизированные markdown файлы для блог постов',
		useCase: 'Генерация SEO-оптимизированных markdown файлов для блог постов',
		recommendedTools: ['utm-builder', 'password-generator', 'html-tree'],
		difficulty: 'intermediate',
		tags: ['seo', 'markdown', 'blog', 'content', 'generator'],
		metaDescription:
			'SEO markdown generator for blogs. Create optimized blog post templates with metadata.',
		faqs: [
			{
				question: 'Что такое SEO markdown и почему это важно?',
				answer:
					'SEO markdown включает метаданные, такие как теги заголовков, описания и структурированные данные, которые помогают поисковым системам лучше понимать и ранжировать ваш контент.'
			},
			{
				question: 'Какие поля метаданных следует включить?',
				answer:
					'Основные поля включают заголовок, описание, ключевые слова, автора, дату публикации и теги Open Graph для обмена в социальных сетях.'
			},
			{
				question: 'Как оптимизировать для расширенных сниппетов?',
				answer:
					'Используйте правильную структуру заголовков (H1-H6), включайте разделы FAQ, создавайте нумерованные списки и кратко отвечайте на общие вопросы.'
			},
			{
				question: 'Можно ли использовать это для разных CMS платформ?',
				answer:
					'Да! Сгенерированный markdown работает с Jekyll, Hugo, Gatsby, Next.js и большинством генераторов статических сайтов, поддерживающих frontmatter.'
			},
			{
				question: 'Какая идеальная длина описания?',
				answer:
					'Держите мета-описания в пределах 150-160 символов для оптимального отображения в результатах поиска без обрезания.'
			}
		]
	},
	{
		id: 'team-randomizer',
		icon: Users,
		category: 'lifestyle',
		translationKey: 'teamRandomizer',
		path: 'team-randomizer',
		gradient: 'from-indigo-500 to-purple-600',
		recommendedTools: [
			'password-generator',
			'qr-generator',
			'utm-builder',
			'draw-lots'
		],
		difficulty: 'beginner',
		tags: ['team', 'random', 'groups', 'picker', 'fair'],
		title: 'Рандомайзер команд',
		description:
			'Создавайте случайные команды быстро и честно. Отлично подходит для игр, работы или развлечений',
		useCase:
			'Случайное деление людей на сбалансированные команды для игр или активностей',
		metaDescription:
			'Random team generator. Create fair and balanced teams from a list of names.',
		faqs: [
			{
				question: 'Как работает случайное распределение?',
				answer:
					'Инструмент использует алгоритм перемешивания Фишера-Йетса для обеспечения действительно случайного и справедливого распределения команд, предотвращая предвзятость в выборе команд.'
			},
			{
				question: 'Можно ли создать неравные команды?',
				answer:
					'Да! Инструмент обрабатывает оставшихся участников, распределяя их максимально равномерно по командам, гарантируя, что ни одна команда не будет значительно больше.'
			},
			{
				question: 'Какое максимальное количество людей?',
				answer:
					'Инструмент может эффективно обрабатывать сотни участников. Для лучших результатов держите имена до 50 символов.'
			}
		]
	},
	{
		id: 'draw-lots',
		icon: Shuffle,
		category: 'lifestyle',
		translationKey: 'drawLots',
		path: 'draw-lots',
		gradient: 'from-purple-500 to-pink-600',
		recommendedTools: [
			'team-randomizer',
			'random-number-generator',
			'password-generator'
		],
		difficulty: 'beginner',
		tags: ['random', 'draw', 'lots', 'picker', 'selection', 'straws'],
		title: 'Жеребьёвка',
		description:
			'Цифровая жеребьёвка - выбирайте имена или делайте случайный выбор честно',
		useCase: 'Честный случайный выбор из списка опций или имён',
		metaDescription:
			'Digital draw lots tool. Draw straws, pick cards randomly for fair selection and decision making.',
		faqs: [
			{
				question: 'Как работает система жеребьёвки?',
				answer:
					'Элементы преобразуются в карточки и перемешиваются с использованием алгоритма Фишера-Йетса. Затем вы можете нажать на любую карточку, чтобы открыть случайный выбор.'
			},
			{
				question: 'Можно ли вытянуть несколько жребиев?',
				answer:
					'Нет, за один раз можно выбрать только одну карточку для обеспечения справедливости. Сбросьте и тяните снова для множественного выбора.'
			},
			{
				question: 'Это действительно случайно?',
				answer:
					'Да! Алгоритм перемешивания Фишера-Йетса обеспечивает математически доказанное случайное распределение, гарантируя, что каждый элемент имеет равные шансы быть выбранным.'
			}
		]
	},
	{
		id: 'special-symbols-picker',
		icon: Type,
		category: 'content',
		translationKey: 'specialSymbolsPicker',
		path: 'special-symbols-picker',
		gradient: 'from-violet-500 to-indigo-600',
		recommendedTools: [
			'password-generator',
			'qr-generator',
			'utm-builder',
			'fancy-text-generator'
		],
		difficulty: 'beginner',
		tags: ['symbols', 'unicode', 'characters', 'copy', 'paste'],
		title: 'Выбор специальных символов',
		description:
			'Кликните для копирования специальных символов и Unicode символов для любого текста',
		useCase:
			'Быстрое копирование специальных символов и Unicode символов для использования в тексте',
		metaDescription:
			'Special symbols picker with one-click copy. Access Unicode symbols, emojis, and special characters.',
		faqs: [
			{
				question: 'Что такое символы Unicode?',
				answer:
					'Символы Unicode - это стандартизированные символы, которые работают на разных платформах и в приложениях. Они включают математические символы, стрелки, знаки валют и декоративные символы.'
			},
			{
				question: 'Как использовать эти символы?',
				answer:
					'Просто нажмите на любой символ, чтобы скопировать его в буфер обмена, затем вставьте его где угодно - в документах, социальных сетях, электронной почте или любом текстовом поле.'
			},
			{
				question: 'Будут ли эти символы работать везде?',
				answer:
					'Большинство современных приложений поддерживают символы Unicode. Однако отображение может отличаться в зависимости от используемого шрифта и платформы.'
			}
		]
	},
	{
		id: 'fancy-text-generator',
		icon: Type,
		category: 'content',
		translationKey: 'fancyTextGenerator',
		path: 'fancy-text-generator',
		gradient: 'from-fuchsia-500 to-pink-600',
		recommendedTools: [
			'special-symbols-picker',
			'password-generator',
			'seo-markdown-generator'
		],
		difficulty: 'beginner',
		tags: ['text', 'unicode', 'fonts', 'style', 'generator'],
		title: 'Генератор текста онлайн - создать стилизованный текст бесплатно',
		description:
			'Бесплатный генератор текста онлайн. Создать красивый стилизованный текст в Unicode стилях для соцсетей и постов',
		useCase:
			'Бесплатный онлайн генератор стилизованного текста для соцсетей, постов, профилей и сообщений',
		metaDescription:
			'Fancy text generator with Unicode fonts. Convert text to bold, italic, script, and decorative styles.',
		faqs: [
			{
				question: 'Как работают красивые шрифты?',
				answer:
					'Это не настоящие шрифты, а символы Unicode, которые выглядят как разные стили шрифтов. Они работают везде, где поддерживается Unicode, без установки шрифтов.'
			},
			{
				question: 'Где можно использовать красивый текст?',
				answer:
					'Используйте красивый текст в социальных сетях (Instagram, Twitter, Facebook), мессенджерах, именах пользователей, био и везде, где поддерживается ввод Unicode.'
			},
			{
				question: 'Почему некоторые стили выглядят сломанными?',
				answer:
					'Не все платформы поддерживают каждый символ Unicode. Если стиль выглядит сломанным, попробуйте другой или используйте на платформе с лучшей поддержкой Unicode.'
			}
		]
	},
	{
		id: 'random-number-generator',
		icon: Dices,
		category: 'lifestyle',
		translationKey: 'randomNumberGenerator',
		path: 'random-number-generator',
		gradient: 'from-cyan-500 to-blue-600',
		recommendedTools: [
			'password-generator',
			'team-randomizer',
			'fancy-text-generator'
		],
		difficulty: 'beginner',
		tags: ['random', 'number', 'generator', 'crypto', 'secure'],
		title: 'Генератор случайных чисел онлайн',
		description:
			'Бесплатный онлайн генератор случайных чисел. Генерируйте криптографически надёжные случайные числа с опцией без дубликатов для игр и розыгрышей',
		useCase:
			'Бесплатный генератор случайных чисел для игр, выборки, розыгрышей и безопасности',
		metaDescription:
			'Cryptographically secure random number generator. Generate random numbers with no duplicates option.',
		faqs: [
			{
				question: 'Насколько безопасны эти случайные числа?',
				answer:
					'Этот генератор использует Web Crypto API (crypto.getRandomValues), который предоставляет криптографически безопасные случайные числа, подходящие для большинства криптографических приложений.'
			},
			{
				question: 'В чём отличие от Math.random()?',
				answer:
					'В отличие от Math.random(), который предсказуем и небезопасен, crypto.getRandomValues() использует источник энтропии операционной системы для генерации действительно случайных чисел.'
			},
			{
				question: 'Можно ли использовать для лотереи или азартных игр?',
				answer:
					'Хотя числа криптографически безопасны, пожалуйста, следуйте местным законам и правилам. Пользователь несёт ответственность за соблюдение законодательства.'
			}
		]
	},

	{
		id: 'text-case-converter',
		icon: Type,
		category: 'content',
		translationKey: 'textCaseConverter',
		path: 'text-case-converter',
		gradient: 'from-indigo-500 to-purple-600',
		title: 'Конвертер регистра текста',
		description:
			'Конвертируйте текст в различные форматы регистра одним кликом',
		useCase: 'Изменение регистра текста для заголовков, кода или стилизации',
		recommendedTools: ['text-counter', 'fancy-text-generator'],
		difficulty: 'beginner',
		tags: [
			'text',
			'case',
			'converter',
			'uppercase',
			'lowercase',
			'camelCase',
			'snake_case'
		],
		metaDescription:
			'Text case converter for uppercase, lowercase, camelCase, snake_case, kebab-case, and more formatting styles.',
		faqs: [
			{
				question: 'Что такое преобразование регистра текста?',
				answer:
					'Преобразование регистра текста - это процесс изменения шаблона использования заглавных букв в тексте. Включает преобразование в верхний, нижний регистр и различные программистские соглашения.'
			},
			{
				question: 'Что такое заголовочный регистр?',
				answer:
					'Заголовочный регистр делает заглавной первую букву каждого значимого слова, оставляя артикли, предлоги и союзы в нижнем регистре (если они не первое слово).'
			},
			{
				question: 'В чем разница между camelCase и PascalCase?',
				answer:
					'camelCase начинается со строчной буквы (helloWorld), а PascalCase - с заглавной (HelloWorld). Оба широко используются в программировании.'
			},
			{
				question: 'Когда использовать snake_case или kebab-case?',
				answer:
					'snake_case использует подчеркивания и распространен в Python и Ruby. kebab-case использует дефисы и популярен в URL-адресах и CSS-классах.'
			},
			{
				question: 'Для чего используется чередующийся регистр?',
				answer:
					'Чередующийся регистр (чЕрЕдУюЩиЙсЯ) чередует строчные и заглавные буквы. В основном используется для стилистических целей или насмешки в неформальном тексте.'
			}
		]
	},
	{
		id: 'image-size-checker',
		icon: ImageIcon,
		category: 'content',
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
		id: 'html-xml-parser',
		icon: Code,
		category: 'webdev',
		translationKey: 'htmlXmlParser',
		path: 'html-xml-parser',
		gradient: 'from-amber-500 to-orange-600',
		title: 'HTML/XML парсер',
		description:
			'Парсинг и валидация HTML/XML документов с подсветкой синтаксиса',
		useCase:
			'Отладка и валидация HTML/XML кода с визуальным представлением структуры',
		recommendedTools: [
			'json-yaml-formatter',
			'javascript-syntax-checker',
			'php-syntax-checker'
		],
		difficulty: 'intermediate',
		tags: ['html', 'xml', 'parser', 'formatter', 'validator', 'minify'],
		metaDescription:
			'HTML/XML parser and formatter. Beautify, minify, validate, and extract data from HTML and XML documents.',
		faqs: [
			{
				question: 'В чем разница между парсингом HTML и XML?',
				answer:
					'HTML более снисходителен и позволяет некоторые незакрытые теги, в то время как XML требует строгого синтаксиса со всеми правильно закрытыми и вложенными тегами. Парсер автоматически определяет тип на основе содержимого.'
			},
			{
				question: 'Что делает опция минификации?',
				answer:
					'Минификация удаляет ненужные пробелы, переносы строк и комментарии (опционально) для уменьшения размера файла. Это полезно для продакшн развертываний для улучшения времени загрузки.'
			},
			{
				question: 'Как работает извлечение данных?',
				answer:
					'Режим извлечения обходит дерево документа и выводит путь к каждому элементу вместе с его атрибутами и текстовым содержимым. Это полезно для понимания структуры документа и извлечения конкретных данных.'
			},
			{
				question: 'Какая валидация выполняется?',
				answer:
					'Парсер проверяет правильность формирования: правильную вложенность тегов, закрытые теги, валидный синтаксис атрибутов и правильную кодировку символов. Он сообщает о любых найденных ошибках парсинга.'
			},
			{
				question: 'Может ли он обрабатывать большие документы?',
				answer:
					'Да, но очень большие документы (более 10МБ) могут обрабатываться медленно. Парсер работает полностью в вашем браузере, поэтому производительность зависит от возможностей вашего устройства.'
			}
		]
	},
	{
		id: 'random-list-generator',
		icon: List,
		category: 'content',
		translationKey: 'randomListGenerator',
		path: 'random-list-generator',
		gradient: 'from-violet-500 to-purple-600',
		title: 'Генератор случайных списков',
		description:
			'Создавайте случайные списки элементов для тестирования или творчества',
		useCase:
			'Генерация случайных списков для тестов, розыгрышей или вдохновения',
		recommendedTools: [
			'draw-lots',
			'random-number-generator',
			'team-randomizer'
		],
		difficulty: 'beginner',
		tags: ['random', 'list', 'shuffle', 'sort', 'generator', 'cryptographic'],
		metaDescription:
			'Random list generator using crypto.getRandomValues. Shuffle names, items, or numbers with true randomness.',
		faqs: [
			{
				question: 'Как работает рандомизация?',
				answer:
					'Инструмент использует алгоритм перемешивания Фишера-Йетса с crypto.getRandomValues() для криптографически безопасной случайности, что более случайно, чем Math.random().'
			},
			{
				question: 'Безопасны ли мои данные?',
				answer:
					'Да! Вся обработка происходит в вашем браузере. Никакие данные не отправляются на сервер. Ваши списки остаются полностью конфиденциальными.'
			},
			{
				question: 'Какое максимальное количество элементов?',
				answer:
					'Вы можете перемешать до 10 000 элементов за раз. Для больших списков рекомендуется разделить их на меньшие части для лучшей производительности.'
			},
			{
				question: 'Могу ли я сохранить перемешанные списки?',
				answer:
					'Да, вы можете скачать результаты как текстовый файл или скопировать их в буфер обмена для использования в других приложениях.'
			}
		]
	},
	{
		id: 'coin-flip',
		icon: Coins,
		category: 'lifestyle',
		translationKey: 'coinFlip',
		path: 'coin-flip',
		gradient: 'from-amber-500 to-yellow-600',
		title: 'Подбрасывание монеты',
		description:
			'Виртуальное подбрасывание монеты с анимацией для принятия решений',
		recommendedTools: [
			'draw-lots',
			'random-number-generator',
			'random-list-generator'
		],
		difficulty: 'beginner',
		tags: ['coin', 'flip', 'random', 'decision', 'heads', 'tails', '3d'],
		useCase: 'Принятие случайных решений орёл/решка с красивой анимацией',
		metaDescription:
			'Online coin flip with 3D animation. Heads or tails with multiple coin types and statistics.',
		faqs: [
			{
				question: 'Действительно ли бросок монеты случайный?',
				answer:
					'Да! Инструмент использует crypto.getRandomValues() для криптографически безопасной случайности, обеспечивая ровно 50% шанс для орла или решки.'
			},
			{
				question: 'Могу ли я использовать разные типы монет?',
				answer:
					'Да, вы можете выбрать доллар США, евро, российский рубль или обычную монету. У каждой есть аутентичный дизайн орла и решки.'
			},
			{
				question: 'Сохраняется ли история бросков?',
				answer:
					'История бросков сохраняется локально в вашем браузере. Она сохраняется между сеансами, но никогда не отправляется на сервер.'
			},
			{
				question: 'Что показывает статистика?',
				answer:
					'Статистика отображает общее количество и процент выпадений орла против решки, помогая проверить случайность на множестве бросков.'
			}
		]
	},
	{
		id: 'dice-roller',
		icon: Dices,
		category: 'lifestyle',
		translationKey: 'diceRoller',
		path: 'dice-roller',
		gradient: 'from-red-500 to-pink-600',
		title: 'Бросок костей',
		description:
			'Виртуальный бросок костей с несколькими конфигурациями и анимациями',
		recommendedTools: ['coin-flip', 'draw-lots', 'random-number-generator'],
		difficulty: 'beginner',
		tags: ['dice', 'random', 'game', '3d', 'probability', 'roll'],
		useCase: 'Бросок костей для настольных игр или случайной генерации чисел',
		metaDescription:
			'Online dice roller with 3D animation. Roll up to 6 dice with true random numbers.',
		faqs: [
			{
				question: 'Действительно ли броски костей случайны?',
				answer:
					'Да! Инструмент использует crypto.getRandomValues(), который обеспечивает криптографически безопасные случайные числа, гарантируя истинную случайность каждого броска.'
			},
			{
				question: 'Какова вероятность выпадения дубля?',
				answer:
					'С 2 костями вероятность дубля составляет 16,67% (1 из 6). С 3 костями вероятность тройки составляет 2,78% (1 из 36).'
			},
			{
				question: 'Работает ли 3D анимация во всех браузерах?',
				answer:
					'3D анимация использует CSS3 трансформации и работает в современных браузерах (Chrome, Edge, Firefox). Старые браузеры автоматически переключаются на 2D анимацию.'
			},
			{
				question: 'Можно ли использовать для настольных игр?',
				answer:
					'Конечно! Этот инструмент идеально подходит для любой игры, требующей бросков костей. Функция истории помогает отслеживать броски во время игры.'
			}
		]
	},
	{
		id: 'emoji-list',
		icon: Smile,
		category: 'content',
		translationKey: 'emojiList',
		path: 'emoji-list',
		gradient: 'from-yellow-400 to-orange-500',
		title: 'Список эмодзи',
		description: 'Просмотрите и скопируйте 1800+ эмодзи по категориям',
		recommendedTools: ['special-symbols-picker', 'fancy-text-generator'],
		difficulty: 'beginner',
		tags: ['emoji', 'emoticons', 'unicode', 'copy', 'paste', 'symbols'],
		useCase: 'Быстрый поиск и копирование эмодзи для соцсетей и чатов',
		metaDescription:
			'Complete emoji list with instant copy. Browse 1800+ emojis in 8 categories.',
		faqs: [
			{
				question: 'Сколько эмодзи доступно?',
				answer:
					'Инструмент включает более 1800 эмодзи из Unicode 14.0, организованных в 8 категорий: Смайлики и люди, Люди и тело, Животные и природа, Еда и напитки, Активности, Путешествия и места, Объекты, Символы и Флаги.'
			},
			{
				question: 'Будут ли эмодзи корректно отображаться на всех устройствах?',
				answer:
					'Большинство современных устройств (iOS, Android 4.4+, Windows 8.1+) поддерживают цветные эмодзи. Если ваше устройство не поддерживает определенные эмодзи, они могут отображаться как квадраты или знаки вопроса.'
			},
			{
				question: 'Сохраняются ли недавние эмодзи?',
				answer:
					'Да, инструмент автоматически сохраняет последние 30 использованных эмодзи локально в вашем браузере для быстрого доступа.'
			},
			{
				question: 'Можно ли искать конкретные эмодзи?',
				answer:
					'Да, используйте строку поиска для быстрого поиска эмодзи. Поиск работает по всем категориям.'
			}
		]
	},
	{
		id: 'text-emoticons',
		icon: Type,
		category: 'content',
		translationKey: 'textEmoticons',
		path: 'text-emoticons',
		gradient: 'from-purple-500 to-pink-600',
		title: 'Текстовые эмотиконы',
		description: 'ASCII смайлики и японские каомодзи для чатов',
		recommendedTools: ['emoji-list', 'special-symbols-picker'],
		difficulty: 'beginner',
		tags: ['emoticons', 'ascii', 'kaomoji', 'text', 'expressions', 'japanese'],
		useCase: 'Коллекция текстовых смайликов для выражения эмоций',
		metaDescription:
			'Text emoticons and kaomoji collection. Copy ASCII art faces and Japanese emoticons.',
		faqs: [
			{
				question: 'Что такое эмотиконы и каомодзи?',
				answer:
					'Эмотиконы - это текстовые выражения из ASCII символов для показа эмоций. Каомодзи (顔文字) - японские эмотиконы, которые не нужно поворачивать на бок, как (^_^) или ¯\\_(ツ)_/¯.'
			},
			{
				question: 'Будут ли они работать на всех платформах?',
				answer:
					'Большинство базовых эмотиконов работают везде, но сложные каомодзи с Unicode символами могут неправильно отображаться на старых системах без поддержки Unicode.'
			},
			{
				question: 'В чём разница между эмотиконами и эмодзи?',
				answer:
					'Эмотиконы создаются из символов клавиатуры (как :-) ), а эмодзи - это настоящие пиктографические символы (как 😊). Эмотиконы изобрели первыми в 1982 году.'
			},
			{
				question: 'Могу ли я создать свои эмотиконы?',
				answer:
					'Да! Эмотиконы создаются творческим сочетанием символов клавиатуры. Популярные возникли естественно в интернет-культуре и стали широко узнаваемыми.'
			}
		]
	},
	{
		id: 'text-to-speech',
		icon: Volume2,
		category: 'lifestyle',
		translationKey: 'textToSpeech',
		path: 'text-to-speech',
		gradient: 'from-green-500 to-teal-600',
		title: 'Текст в речь',
		description: 'Превращайте текст в речь с разными голосами',
		recommendedTools: ['special-symbols-picker', 'fancy-text-generator'],
		difficulty: 'beginner',
		tags: ['tts', 'speech', 'voice', 'audio', 'accessibility', 'synthesis'],
		useCase: 'Озвучивание текстов для аудиокниг или доступности',
		metaDescription:
			'Text to speech converter with voice customization. Convert any text to audio with different voices.',
		faqs: [
			{
				question: 'Как работает синтез речи?',
				answer:
					'Инструмент использует Speech Synthesis API браузера для преобразования текста в звук. Доступные голоса зависят от вашей операционной системы и установленных языковых пакетов.'
			},
			{
				question: 'Можно ли использовать разные языки?',
				answer:
					'Да! Инструмент поддерживает несколько языков в зависимости от голосов, установленных в системе. Вы можете выбрать голоса для разных языков из выпадающего меню.'
			},
			{
				question: 'Есть ли ограничения по длине текста?',
				answer:
					'Большинство браузеров могут обрабатывать длинные тексты, но очень длинные отрывки могут быть разделены на части. Для лучшей производительности держите тексты до 1000 слов.'
			},
			{
				question: 'Можно ли сохранить аудиовывод?',
				answer:
					'Speech Synthesis API генерирует аудио в реальном времени и не предоставляет прямую возможность загрузки. Можно использовать системное ПО для записи звука.'
			}
		]
	},
	{
		id: 'system-info',
		icon: Monitor,
		category: 'lifestyle',
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
			'Instantly detect system architecture (32/64-bit), screen resolution, and device specifications',
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
			}
		]
	},
	{
		id: 'json-tools',
		icon: Braces,
		category: 'webdev',
		translationKey: 'jsonTools',
		path: 'json-tools',
		gradient: 'from-orange-500 to-red-600',
		title: 'JSON инструменты',
		description: 'Форматирование, валидация, минификация и сравнение JSON',
		useCase: 'Комплексная обработка JSON файлов для разработки',
		recommendedTools: ['html-css-formatter', 'base64-converter', 'url-encoder'],
		difficulty: 'beginner',
		tags: [
			'json',
			'validator',
			'formatter',
			'beautifier',
			'minifier',
			'parser'
		],
		metaDescription:
			'JSON validator and formatter tool. Validate JSON syntax, format/beautify code, minify for production.',
		faqs: [
			{
				question: 'Что такое валидация JSON?',
				answer:
					'Валидация JSON проверяет, соответствуют ли ваши JSON данные правилам синтаксиса. Невалидный JSON может вызвать ошибки в приложениях, поэтому валидация помогает выявить проблемы заранее.'
			},
			{
				question: 'В чем разница между форматированием и сжатием?',
				answer:
					'Форматирование добавляет отступы и переносы строк для читаемости, а сжатие удаляет все лишние пробелы для уменьшения размера файла в production.'
			},
			{
				question: 'Насколько точно определяются ошибки?',
				answer:
					'Инструмент использует встроенный JSON парсер JavaScript, предоставляя точные сообщения об ошибках с номерами строк и колонок при обнаружении синтаксических ошибок.'
			},
			{
				question: 'Можно ли загружать большие JSON файлы?',
				answer:
					'Да, вы можете загружать JSON файлы напрямую. Инструмент эффективно обрабатывает большие файлы и предоставляет детальный анализ структуры.'
			}
		]
	},
	{
		id: 'js-css-compressor',
		icon: Zap,
		category: 'webdev',
		translationKey: 'jsCssCompressor',
		path: 'js-css-compressor',
		gradient: 'from-yellow-500 to-orange-600',
		title: 'JS/CSS компрессор',
		description:
			'Минифицируйте JavaScript и CSS для улучшения производительности',
		useCase: 'Оптимизация размера файлов для быстрой загрузки сайтов',
		recommendedTools: ['json-tools', 'html-css-formatter', 'base64-converter'],
		difficulty: 'beginner',
		tags: [
			'minify',
			'compress',
			'javascript',
			'css',
			'optimization',
			'performance'
		],
		metaDescription:
			'JavaScript and CSS compressor tool. Minify JS/CSS code, reduce file sizes, optimize for production.',
		faqs: [
			{
				question: 'Что такое сжатие и минификация кода?',
				answer:
					'Сжатие кода удаляет ненужные символы как пробелы, комментарии и переносы строк. Минификация также сокращает имена переменных и оптимизирует структуру кода для уменьшения размера файла.'
			},
			{
				question: 'Безопасно ли использовать сжатый код?',
				answer:
					'Да, при правильном выполнении. Инструмент сохраняет функциональность кода, удаляя только ненужные элементы. Однако всегда тестируйте сжатый код перед развертыванием в production.'
			},
			{
				question: 'Сколько места можно сэкономить?',
				answer:
					'Типичная экономия составляет 20-70% в зависимости от стиля кода. JavaScript с множеством комментариев может показать большую степень сжатия, чем уже оптимизированный код.'
			},
			{
				question: 'Можно ли сжимать уже минифицированный код?',
				answer:
					'Да, но экономия будет минимальной, поскольку минифицированный код уже имеет большинство оптимизаций. Инструмент всё равно удалит оставшиеся пробелы и комментарии.'
			}
		]
	},
	{
		id: 'js-validator',
		icon: Bug,
		category: 'webdev',
		translationKey: 'jsValidator',
		path: 'js-validator',
		gradient: 'from-red-500 to-pink-600',
		title: 'JavaScript валидатор',
		description: 'Найдите ошибки в JavaScript коде',
		useCase: 'Быстрая проверка JavaScript на ошибки',
		recommendedTools: ['js-css-compressor', 'json-tools', 'html-css-formatter'],
		difficulty: 'beginner',
		tags: [
			'javascript',
			'validator',
			'syntax',
			'linter',
			'debugging',
			'quality'
		],
		metaDescription:
			'JavaScript validator and syntax checker. Detect JS errors, validate code quality, debug syntax issues.',
		faqs: [
			{
				question: 'Что проверяет JavaScript валидатор?',
				answer:
					'Валидатор проверяет синтаксические ошибки, неопределенные переменные, пропущенные точки с запятой, присваивание в условиях, незакрытые скобки и другие распространенные проблемы JavaScript.'
			},
			{
				question: 'Какие версии JavaScript поддерживаются?',
				answer:
					'Инструмент поддерживает ES5, ES2015, ES2017, ES2020 и ES2022, включая современные возможности как async/await, классы и модули.'
			},
			{
				question: 'В чем разница между ошибками и предупреждениями?',
				answer:
					'Ошибки - это синтаксические проблемы, которые не позволяют коду работать. Предупреждения - это проблемы стиля/качества, которые могут вызвать проблемы или усложнить поддержку кода.'
			},
			{
				question: 'Можно ли использовать для React или Node.js кода?',
				answer:
					'Да, валидатор работает с любым JavaScript кодом, включая React JSX, модули Node.js и современный синтаксис ES6+.'
			}
		]
	},

	{
		id: 'bmi-calculator',
		icon: Weight,
		category: 'lifestyle',
		translationKey: 'bmiCalculator',
		path: 'bmi-calculator',
		gradient: 'from-green-500 to-emerald-600',
		title: 'Калькулятор ИМТ',
		description: 'Рассчитайте индекс массы тела с интерпретацией результатов',
		recommendedTools: [
			'temperature-converter',
			'percentage-calculator',
			'unit-converter'
		],
		difficulty: 'beginner',
		tags: ['bmi', 'health', 'weight', 'calculator', 'fitness'],
		useCase: 'Оценка состояния здоровья по индексу массы тела',
		metaDescription:
			'BMI calculator with health interpretation. Calculate your Body Mass Index and health status.',
		faqs: [
			{
				question: 'Что такое ИМТ и почему это важно?',
				answer:
					'ИМТ (Индекс Массы Тела) — это показатель, который использует ваш рост и вес для определения здорового веса. Это полезный инструмент скрининга для выявления потенциальных проблем со здоровьем, связанных с весом.'
			},
			{
				question: 'Насколько точен расчёт ИМТ?',
				answer:
					'Расчёт ИМТ следует стандартной формуле: вес (кг) / рост (м)². Наш калькулятор предоставляет точные результаты и включает интерпретацию состояния здоровья на основе рекомендаций ВОЗ.'
			},
			{
				question: 'Какие диапазоны ИМТ считаются здоровыми?',
				answer:
					'Нормальный вес: 18.5-24.9, Недостаточный вес: ниже 18.5, Избыточный вес: 25-29.9, Ожирение: 30 и выше. Однако ИМТ не учитывает мышечную массу, плотность костей или состав тела.'
			},
			{
				question: 'Можно ли использовать метрические и имперские единицы?',
				answer:
					'Да, калькулятор поддерживает как метрические (кг, см), так и имперские (фунты, футы/дюймы) единицы. Вы можете легко переключаться между единицами и получать точные результаты в предпочитаемой системе измерений.'
			},
			{
				question: 'Есть ли ограничения в использовании ИМТ?',
				answer:
					'ИМТ не различает мышечную и жировую массу, поэтому спортсмены с высокой мышечной массой могут иметь высокий ИМТ при низком содержании жира. Лучше всего использовать как общий инструмент скрининга наряду с другими оценками здоровья.'
			}
		]
	},
	{
		id: 'text-counter',
		icon: FileSearch,
		category: 'content',
		translationKey: 'textCounter',
		path: 'text-counter',
		gradient: 'from-indigo-500 to-purple-600',
		title: 'Счётчик текста',
		description: 'Подсчитайте слова, символы, абзацы и время чтения мгновенно',
		useCase: 'Анализ длины текста для соцсетей, статей или эссе',
		recommendedTools: ['text-to-speech', 'fancy-text-generator'],
		difficulty: 'beginner',
		tags: ['text', 'counter', 'seo', 'words', 'characters', 'social-media'],
		metaDescription:
			'Text counter for SEO and social media. Count characters, words, sentences with platform limits.',
		faqs: [
			{
				question: 'Что считается словом в счётчике?',
				answer:
					'Слова определяются как последовательности символов, разделённые пробелами. Слова через дефис считаются одним словом, а сокращения вроде "don\'t" считаются одним словом.'
			},
			{
				question: 'Почему ограничения по символам важны для социальных сетей?',
				answer:
					'У каждой платформы есть специфические ограничения: посты Twitter (280 символов), подписи Instagram (2,200 символов), посты Facebook (63,206 символов). Соблюдение лимитов обеспечивает правильное отображение контента.'
			},
			{
				question: 'Включает ли счётчик пробелы и пунктуацию?',
				answer:
					'Да! Подсчёт символов включает все пробелы, знаки пунктуации и специальные символы. Подсчёт слов исключает пробелы и пунктуацию, фокусируясь только на реальных словах.'
			},
			{
				question: 'Насколько точна оценка времени чтения?',
				answer:
					'Время чтения рассчитывается на основе средней скорости чтения взрослых 200-250 слов в минуту. Фактическая скорость чтения варьируется в зависимости от сложности текста и индивидуальных способностей.'
			},
			{
				question: 'Можно ли использовать это для SEO оптимизации?',
				answer:
					'Конечно! Мета-описания должны быть 150-160 символов, теги заголовков 50-60 символов, а посты блога обычно 300+ слов для лучшей SEO производительности.'
			}
		]
	},
	{
		id: 'timer-countdown',
		icon: Clock,
		category: 'lifestyle',
		translationKey: 'timerCountdown',
		path: 'timer-countdown',
		gradient: 'from-orange-500 to-red-600',
		title: 'Таймер и секундомер',
		description: 'Таймер, обратный отсчёт и секундомер с уведомлениями',
		recommendedTools: [
			'bmi-calculator',
			'unit-converter',
			'temperature-converter'
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
		id: 'text-diff',
		icon: GitCompare,
		category: 'webdev',
		translationKey: 'textDiff',
		path: 'text-diff-tool',
		gradient: 'from-purple-500 to-indigo-600',
		title: 'Сравнение текстов',
		description: 'Сравнивайте два текста и находите различия',
		recommendedTools: ['json-tools', 'html-css-formatter', 'js-validator'],
		difficulty: 'intermediate',
		tags: ['diff', 'compare', 'text', 'code', 'changes'],
		useCase: 'Анализ изменений в коде или документах',
		metaDescription:
			'Text difference tool. Compare two texts and see changes highlighted line by line.',
		faqs: [
			{
				question: 'Какие типы различий обнаруживает инструмент?',
				answer:
					'Инструмент обнаруживает добавления строк (зелёный), удаления (красный) и изменения (жёлтый). Он выполняет сравнение на уровне символов в изменённых строках для точного выделения.'
			},
			{
				question: 'Можно ли сравнивать файлы с кодом этим инструментом?',
				answer:
					'Да! Инструмент diff отлично подходит для сравнения кода, JSON, HTML, CSS и любых текстовых файлов. Он сохраняет форматирование и отступы для точного сравнения.'
			},
			{
				question: 'Как работает алгоритм сравнения?',
				answer:
					'Инструмент использует алгоритм diff Майерса, тот же, что используется в Git, для поиска оптимального набора изменений между двумя текстами с минимальными различиями.'
			},
			{
				question: 'Есть ли ограничение на размер файла для сравнения?',
				answer:
					'Для лучшей производительности держите файлы до 1 МБ. Очень большие файлы могут замедлить процесс сравнения или вызвать проблемы с производительностью браузера.'
			},
			{
				question: 'Можно ли игнорировать различия в пробелах?',
				answer:
					'Инструмент включает опции для игнорирования конечных пробелов, начальных пробелов или нормализации всех различий в пробелах для более чистого сравнения.'
			}
		]
	},
	{
		id: 'php-syntax-checker',
		icon: Code,
		category: 'webdev',
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
		category: 'webdev',
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
		id: 'regex-tester',
		icon: Search,
		category: 'webdev',
		translationKey: 'regexTester',
		path: 'regex-tester',
		gradient: 'from-green-500 to-teal-600',
		title: 'Тестер регулярных выражений',
		description: 'Тестируйте регулярные выражения для JavaScript, PHP и Python',
		recommendedTools: [
			'javascript-syntax-checker',
			'php-syntax-checker',
			'text-diff'
		],
		difficulty: 'advanced',
		tags: ['regex', 'regular-expression', 'pattern', 'test', 'match'],
		useCase: 'Отладка и тестирование регулярных выражений',
		metaDescription:
			'Regex tester for JavaScript, PHP, Python. Test and debug regular expressions.',
		faqs: [
			{
				question: 'Какие типы regex поддерживаются?',
				answer:
					'Тестер поддерживает JavaScript (ECMAScript), PHP (PCRE), Python (модуль re) и .NET regex, каждый со своим специфическим синтаксисом и функциями.'
			},
			{
				question: 'Что означают распространённые флаги regex?',
				answer:
					'Общие флаги включают: g (глобальное совпадение всех), i (без учёта регистра), m (многострочный), s (dotall), u (unicode) и x (расширенный/подробный). Каждый тип может поддерживать разные флаги.'
			},
			{
				question: 'Как тестировать паттерны для email или URL?',
				answer:
					'Инструмент включает распространённые предустановленные паттерны для email, URL, номеров телефонов и дат. Также можно создавать пользовательские паттерны с помощью интерактивного конструктора regex.'
			},
			{
				question: 'Могу ли я видеть, какие части моего текста совпадают?',
				answer:
					'Да! Тестер выделяет все совпадения в вашем тестовом тексте и показывает группы захвата, упрощая визуализацию того, что ваш regex находит.'
			},
			{
				question: 'В чём разница между жадным и нежадным сопоставлением?',
				answer:
					'Жадные квантификаторы (*, +, ?) сопоставляют как можно больше, а нежадные (??, *?, +?) сопоставляют как можно меньше. Используйте нежадные для точного сопоставления между разделителями.'
			}
		]
	},
	{
		id: 'javascript-syntax-checker',
		icon: Code,
		category: 'webdev',
		translationKey: 'javascriptSyntaxChecker',
		path: 'javascript-syntax-checker',
		gradient: 'from-yellow-500 to-red-600',
		title: 'JavaScript валидатор',
		description: 'Проверка синтаксиса JavaScript/ES6/ES2020+ с JSX',
		recommendedTools: ['json-tools', 'js-css-compressor', 'regex-tester'],
		difficulty: 'intermediate',
		tags: ['javascript', 'es6', 'syntax', 'checker', 'validator'],
		useCase: 'Проверка JavaScript кода перед развёртыванием',
		metaDescription:
			'JavaScript syntax checker for ES6/ES2020+. Validate JS code with JSX support.',
		faqs: [
			{
				question: 'Какие версии JavaScript это поддерживает?',
				answer:
					'Проверка поддерживает современный JavaScript, включая ES6/ES2015, ES2017, ES2020 и новее. Распознает стрелочные функции, async/await, деструктуризацию, модули, классы, шаблонные строки и все современные синтаксические возможности.'
			},
			{
				question: 'Могу ли я проверить код React JSX?',
				answer:
					'Да! Проверка синтаксиса имеет встроенную поддержку JSX, поэтому вы можете проверять React компоненты, синтаксис JSX и смешанный код JavaScript/JSX. Понимает JSX элементы, props, фрагменты и React-специфичные паттерны.'
			},
			{
				question: 'Выполняется ли мой код?',
				answer:
					'Нет, это исключительно проверка синтаксиса - анализирует только структуру и грамматику кода без выполнения. Ваш код безопасен и никогда не запускается, что делает инструмент безопасным для проверки любого JavaScript, даже потенциально вредного кода.'
			},
			{
				question: 'Какие типы ошибок он обнаруживает?',
				answer:
					'Обнаруживает синтаксические ошибки, такие как пропущенные точки с запятой/скобки, опечатки в ключевых словах, неправильные функции, недопустимый JSX, незакрытые строки и структурные проблемы. Не обнаружит ошибки времени выполнения или логические проблемы.'
			},
			{
				question: 'Зачем использовать это вместо моей IDE?',
				answer:
					'Отлично для быстрой проверки без открытия IDE, обмена фрагментами кода с другими, проверки кода на мобильных устройствах или когда нужно второе мнение о синтаксисе. Также полезно для обучения синтаксису JavaScript.'
			}
		]
	},
	{
		id: 'px-rem-converter',
		icon: Ruler,
		category: 'webdev',
		translationKey: 'pxRemConverter',
		path: 'px-rem-converter',
		gradient: 'from-pink-500 to-rose-600',
		title: 'Конвертер px в rem/em',
		description:
			'Конвертируйте пиксели в rem и em единицы с настраиваемым базовым размером',
		recommendedTools: ['css-gradient', 'css-box-shadow', 'color-converter'],
		difficulty: 'beginner',
		tags: ['px', 'rem', 'em', 'converter', 'css', 'units'],
		useCase:
			'Convert between px, rem, and em CSS units with custom base font size',
		metaDescription:
			'PX to REM/EM converter for CSS. Convert between pixel, rem, and em units.',
		faqs: [
			{
				question: 'В чём разница между единицами rem и em?',
				answer:
					'Единицы rem относительны к размеру шрифта корневого элемента (обычно 16px), а единицы em - к размеру шрифта родительского элемента. rem обеспечивает более предсказуемое изменение размеров.'
			},
			{
				question: 'Какой размер базового шрифта следует использовать?',
				answer:
					'Большинство браузеров по умолчанию используют 16px. Однако можно настроить это в зависимости от вашей дизайн-системы. Распространённые альтернативы - 14px, 15px или 18px в зависимости от потребностей доступности.'
			},
			{
				question: 'Когда следует использовать пиксели против rem?',
				answer:
					'Используйте rem для масштабируемых макетов, типографики и отступов. Используйте пиксели для точных измерений, таких как границы (1px), маленькие иконки или когда критично точное размещение.'
			},
			{
				question: 'Как единицы rem улучшают доступность?',
				answer:
					'Единицы rem учитывают пользовательские предпочтения размера шрифта браузера, позволяя пользователям с нарушениями зрения масштабировать контент, изменяя размер шрифта по умолчанию в браузере.'
			},
			{
				question:
					'Могу ли я конвертировать единицы viewport, такие как vw и vh?',
				answer:
					'Этот конвертер фокусируется на конверсии px/rem/em. Единицы viewport (vw, vh, vmin, vmax) основаны на процентах относительно размера экрана, а не на шрифте, как rem/em.'
			}
		]
	},
	{
		id: 'css-box-shadow',
		icon: Square,
		category: 'webdev',
		translationKey: 'cssBoxShadow',
		path: 'css-box-shadow-generator',
		gradient: 'from-gray-600 to-gray-800',
		title: 'Генератор CSS теней',
		description: 'Создавайте CSS тени с визуальным предпросмотром',
		recommendedTools: ['css-gradient', 'px-rem-converter', 'color-converter'],
		difficulty: 'intermediate',
		tags: ['css', 'box-shadow', 'shadow', 'generator', 'design'],
		useCase: 'Generate CSS box-shadow with visual preview and multiple shadows',
		metaDescription:
			'CSS box-shadow generator with preview. Create custom shadows for your designs.',
		faqs: [
			{
				question: 'Какие есть параметры box-shadow?',
				answer:
					'Box-shadow использует: горизонтальное смещение, вертикальное смещение, радиус размытия, радиус распространения, цвет и inset (опционально). Каждый контролирует разные аспекты тени, такие как позиция, мягкость и размер.'
			},
			{
				question: 'В чём разница между внешними и внутренними тенями?',
				answer:
					'Внешние тени появляются снаружи элемента (по умолчанию), создавая глубину и возвышение. Внутренние тени появляются внутри элемента, создавая углублённый или нажатый эффект.'
			},
			{
				question: 'Могу ли я применить несколько теней к одному элементу?',
				answer:
					'Да! Разделяйте несколько теней запятыми. Первая тень появляется сверху, с последующими тенями, размещёнными снизу. Это позволяет создавать сложные эффекты теней.'
			},
			{
				question: 'Как создать реалистичные тени?',
				answer:
					'Используйте тонкие смещения (2-8px), умеренное размытие (4-20px), минимальное распространение (0-2px) и цвета с низкой непрозрачностью (rgba с альфа 0.1-0.3). Избегайте резких чёрных теней.'
			},
			{
				question: 'Влияют ли box-shadows на макет и производительность?',
				answer:
					'Box-shadows не влияют на поток макета, но могут влиять на производительность при множестве элементов или сложных теней. Рассмотрите использование transform: translateZ(0) для аппаратного ускорения анимированных теней.'
			}
		]
	},
	{
		id: 'css-gradient',
		icon: Layers,
		category: 'webdev',
		translationKey: 'cssGradient',
		path: 'css-gradient-generator',
		gradient: 'from-purple-500 via-pink-500 to-red-500',
		title: 'Генератор CSS градиентов',
		description:
			'Создавайте линейные, радиальные и конические градиенты с визуальным редактором',
		recommendedTools: ['css-box-shadow', 'color-converter', 'px-rem-converter'],
		difficulty: 'intermediate',
		tags: ['css', 'gradient', 'linear', 'radial', 'conic', 'generator'],
		useCase:
			'Create linear, radial, and conic CSS gradients with visual editor',
		metaDescription:
			'CSS gradient generator for linear, radial, conic gradients. Visual gradient editor.',
		faqs: [
			{
				question:
					'В чём разница между линейными, радиальными и коническими градиентами?',
				answer:
					'Линейные градиенты переходят цвета вдоль прямой линии, радиальные градиенты исходят от центральной точки наружу в виде круга/эллипса, а конические градиенты вращаются вокруг центральной точки как цветовое колесо.'
			},
			{
				question: 'Как контролировать направление градиента?',
				answer:
					'Для линейных градиентов используйте углы (45deg) или ключевые слова (to right, to bottom). Для радиальных градиентов укажите позицию (center, top left). Конические градиенты используют углы from для установки начальной позиции.'
			},
			{
				question: 'Могу ли я добавить несколько цветовых остановок?',
				answer:
					'Да! Добавляйте столько цветовых остановок, сколько нужно. Каждая может иметь определённую позицию (red 0%, blue 50%, green 100%) для точного контроля того, где цвета появляются в градиенте.'
			},
			{
				question: 'Как создать плавные против резких переходов?',
				answer:
					'Плавные переходы используют отдалённые цветовые остановки (red 0%, blue 100%). Резкие переходы размещают цветовые остановки близко друг к другу (red 49%, blue 51%) для резких изменений цвета.'
			},
			{
				question: 'Лучше ли CSS градиенты изображений для производительности?',
				answer:
					'Да! CSS градиенты - это векторы, идеально масштабируются, имеют меньший размер файла, чем изображения, и не требуют HTTP запросов. Они также легко настраиваемые и анимируемые.'
			}
		]
	},
	{
		id: 'color-contrast',
		icon: Circle,
		category: 'webdev',
		translationKey: 'colorContrast',
		path: 'color-contrast-checker',
		gradient: 'from-black to-white',
		title: 'Проверка контраста цветов',
		description:
			'Проверяйте соотношение контраста цветов для соответствия WCAG',
		recommendedTools: ['color-converter', 'css-gradient', 'css-box-shadow'],
		difficulty: 'intermediate',
		tags: ['color', 'contrast', 'wcag', 'accessibility', 'a11y'],
		useCase: 'Check color contrast ratios for WCAG accessibility compliance',
		metaDescription:
			'Color contrast checker for WCAG. Test color combinations for accessibility.',
		faqs: [
			{
				question: 'Каковы требования WCAG к контрастности?',
				answer:
					'WCAG требует минимум 4.5:1 контраста для обычного текста и 3:1 для крупного текста (уровень AA). Для уровня AAA соотношения составляют 7:1 для обычного текста и 4.5:1 для крупного текста.'
			},
			{
				question: 'Что считается "крупным текстом" в доступности?',
				answer:
					'Крупный текст определяется как 18pt (24px) или больше в обычном весе, или 14pt (18.66px) или больше в жирном весе согласно руководящим принципам WCAG.'
			},
			{
				question: 'Как вычисляется коэффициент контрастности?',
				answer:
					'Коэффициент контрастности использует формулу (L1 + 0.05) / (L2 + 0.05), где L1 - относительная яркость более светлого цвета, а L2 - относительная яркость более тёмного цвета.'
			},
			{
				question: 'Нужно ли проверять контраст для нетекстовых элементов?',
				answer:
					'Да! WCAG 2.1 требует контраст 3:1 для компонентов интерфейса, таких как кнопки, элементы форм и индикаторы фокуса. Декоративные элементы освобождены от требований контрастности.'
			},
			{
				question: 'Каких цветов следует избегать для доступности?',
				answer:
					'Избегайте комбинаций красного/зелёного (дальтонизм), низкоконтрастных серых комбинаций и полагания только на цвет для передачи информации. Всегда предоставляйте дополнительные визуальные сигналы.'
			}
		]
	},
	{
		id: 'css-keyframes',
		icon: Sparkles,
		category: 'webdev',
		translationKey: 'cssKeyframes',
		path: 'css-keyframes-generator',
		gradient: 'from-blue-500 to-purple-600',
		title: 'Генератор CSS анимаций',
		description: 'Создавайте CSS @keyframes анимации с визуальным редактором',
		recommendedTools: ['css-gradient', 'css-box-shadow', 'px-rem-converter'],
		difficulty: 'advanced',
		tags: ['css', 'animation', 'keyframes', 'generator', 'motion'],
		useCase: 'Generate CSS @keyframes animations with visual editor',
		metaDescription:
			'CSS keyframes animation generator. Create custom animations visually.',
		faqs: [
			{
				question: 'Что такое CSS @keyframes и как они работают?',
				answer:
					'@keyframes определяют последовательности анимации, указывая CSS свойства в разных процентах (0%, 25%, 100%) временной шкалы анимации. Браузеры плавно интерполируют между этими ключевыми кадрами.'
			},
			{
				question:
					'В чём разница между процентами ключевых кадров и функциями времени?',
				answer:
					'Проценты ключевых кадров (0%, 50%, 100%) определяют, когда свойства изменяются во время анимации. Функции времени (ease, linear, cubic-bezier) контролируют кривую скорости между ключевыми кадрами.'
			},
			{
				question: 'Как создать плавные против резких анимаций?',
				answer:
					'Плавные анимации используют много ключевых кадров с небольшими изменениями свойств и подходящими функциями времени. Резкие анимации используют мало ключевых кадров с большими скачками свойств или линейное время.'
			},
			{
				question: 'Какие свойства можно анимировать с ключевыми кадрами?',
				answer:
					'Можно анимировать большинство CSS свойств: transform, opacity, цвета, размеры, позиции. Избегайте анимации свойств макета (width, height, padding), так как они вызывают дорогие пересчёты.'
			},
			{
				question: 'Как оптимизировать анимации для производительности?',
				answer:
					'Придерживайтесь анимации свойств transform и opacity, которые ускоряются GPU. Используйте свойство will-change экономно и предпочитайте transform: translate3d() изменению позиций left/top.'
			}
		]
	},
	{
		id: 'json-yaml-formatter',
		icon: FileJson,
		category: 'webdev',
		translationKey: 'jsonYamlFormatter',
		path: 'json-yaml-formatter',
		gradient: 'from-orange-500 to-yellow-600',
		title: 'JSON/YAML форматтер',
		description: 'Форматирование, валидация и конвертация JSON/YAML',
		recommendedTools: [
			'json-tools',
			'base64-encoder',
			'javascript-syntax-checker'
		],
		difficulty: 'beginner',
		tags: ['json', 'yaml', 'formatter', 'validator', 'converter'],
		useCase: 'Обработка и конвертация конфигурационных файлов',
		metaDescription:
			'JSON/YAML formatter and converter. Validate and convert between formats.',
		faqs: [
			{
				question: 'В чем разница между JSON и YAML?',
				answer:
					'JSON использует скобки и кавычки, что делает его компактным, но менее читаемым. YAML использует отступы и более читаем для человека. Оба представляют одинаковые структуры данных (объекты, массивы, строки, числа), но YAML легче читать и редактировать вручную.'
			},
			{
				question: 'Когда использовать JSON против YAML?',
				answer:
					'Используйте JSON для API, веб-приложений и когда размер имеет значение. Используйте YAML для конфигурационных файлов, документации и когда важна читаемость для человека. JSON быстрее парсится, YAML легче писать и поддерживать.'
			},
			{
				question: 'Будут ли потеряны данные при конверсии между форматами?',
				answer:
					'Нет, оба формата поддерживают одинаковые типы данных (строки, числа, булевы значения, массивы, объекты, null). Конверсия без потерь - структура данных и значения остаются идентичными, изменяется только синтаксис.'
			},
			{
				question: 'Как форматтер обрабатывает неверный синтаксис?',
				answer:
					'Инструмент покажет четкие сообщения об ошибках, указывающие на проблемную строку и символ. Для JSON обнаруживает пропущенные кавычки, завершающие запятые и несовпадения скобок. Для YAML обнаруживает ошибки отступов и структуры.'
			},
			{
				question:
					'Могу ли я форматировать минифицированные или компактные данные?',
				answer:
					'Да! Форматтер может взять минифицированный/сжатый JSON или компактный YAML и развернуть его с правильными отступами и переносами строк, что значительно облегчает чтение и отладку.'
			}
		]
	},
	{
		id: 'favicon-generator',
		icon: FileImage,
		category: 'webdev',
		translationKey: 'faviconGenerator',
		path: 'favicon-generator',
		gradient: 'from-blue-500 to-purple-600',
		title: 'Генератор Favicon',
		description: 'Создайте favicon для вашего веб-сайта всех размеров',
		useCase: 'Создание иконок сайта всех необходимых размеров',
		recommendedTools: ['color-converter', 'css-box-shadow', 'html-tree'],
		difficulty: 'beginner',
		tags: ['favicon', 'icon', 'generator', 'upload', 'png'],
		metaDescription:
			'Free favicon generator tool. Upload an image and generate favicon files in multiple sizes for websites and mobile apps.',
		faqs: [
			{
				question: 'Какие форматы изображений можно загружать?',
				answer:
					'Можно загружать PNG, JPG, JPEG, SVG, GIF и другие распространенные форматы изображений. Инструмент поддерживает файлы размером до 5 МБ.'
			},
			{
				question: 'Какие размеры фавиконок генерируются?',
				answer:
					'Инструмент генерирует 10 различных размеров: 16x16 (классический), 32x32 (стандартный), 48x48 (Windows), 57x57 (iOS), 76x76 (iPad), 120x120 (iPhone Retina), 152x152 (iPad Retina), 180x180 (iPhone X/11/12), 192x192 (Android) и 512x512 (Android большой).'
			},
			{
				question: 'Какой лучший размер изображения для загрузки?',
				answer:
					'Загружайте квадратное изображение (соотношение 1:1) размером не менее 512x512 пикселей для лучших результатов. Простые, яркие дизайны работают лучше в маленьких размерах, чем сложные детализированные изображения.'
			},
			{
				question: 'Как внедрить сгенерированные фавиконки?',
				answer:
					'Добавьте файлы фавиконок в корневую папку вашего сайта и включите соответствующие теги <link> в секцию <head> вашего HTML. Инструмент предоставляет примерный HTML код для внедрения.'
			}
		]
	},
	{
		id: 'base64-encoder',
		icon: Lock,
		category: 'security',
		translationKey: 'base64Encoder',
		path: 'base64-encoder',
		gradient: 'from-green-500 to-teal-600',
		title: 'Base64 кодировщик',
		description: 'Кодируйте и декодируйте данные в формате Base64',
		recommendedTools: ['jwt-decoder', 'hash-generator', 'json-tools'],
		difficulty: 'beginner',
		tags: ['base64', 'encode', 'decode', 'converter', 'encryption'],
		useCase:
			'Кодирование изображений и файлов в Base64 для встраивания в CSS/HTML',
		metaDescription:
			'Base64 encoder/decoder with file support. Encode and decode Base64 data.',
		faqs: [
			{
				question: 'Что такое кодирование Base64 и зачем оно используется?',
				answer:
					'Base64 - это метод преобразования двоичных данных в ASCII-текст с использованием 64 символов (A-Z, a-z, 0-9, +, /). Широко используется в веб-разработке, вложениях электронной почты, data URL и API, где двоичные данные нужно передавать как текст.'
			},
			{
				question: 'Является ли кодирование Base64 безопасным?',
				answer:
					'Нет, Base64 - это НЕ шифрование или защита, это просто кодирование. Любой может легко декодировать данные Base64. Никогда не используйте его для скрытия конфиденциальной информации. Он предназначен для передачи данных, а не для безопасности.'
			},
			{
				question: 'Какие типы файлов можно кодировать?',
				answer:
					'Можно кодировать файлы любого типа: изображения (PNG, JPG), документы (PDF, DOC), текстовые файлы, исполняемые файлы и т.д. Инструмент конвертирует двоичное содержимое в текст Base64, независимо от формата файла.'
			},
			{
				question: 'Почему закодированные данные выглядят длиннее оригинала?',
				answer:
					'Кодирование Base64 увеличивает размер данных примерно на 33%, поскольку использует 4 ASCII-символа для представления каждых 3 байтов исходных данных. Эти накладные расходы - компромисс за безопасную передачу через текст.'
			},
			{
				question: 'Когда следует использовать кодирование Base64?',
				answer:
					'Используйте Base64 для встраивания небольших изображений в CSS/HTML как data URLs, кодирования двоичных данных для JSON API, подготовки загрузки файлов для веб-форм и в любых ситуациях, где нужно передавать двоичные данные через текстовые каналы.'
			}
		]
	},
	{
		id: 'jwt-decoder',
		icon: JWTIcon,
		category: 'security',
		translationKey: 'jwtDecoder',
		path: 'jwt-decoder',
		gradient: 'from-purple-500 to-pink-600',
		title: 'JWT декодер',
		description: 'Декодируйте и анализируйте JSON Web Token без ключа',
		recommendedTools: ['base64-encoder', 'json-tools', 'uuid-generator'],
		difficulty: 'intermediate',
		tags: ['jwt', 'json', 'token', 'decoder', 'authentication'],
		useCase: 'Анализ структуры JWT токенов для отладки авторизации',
		metaDescription:
			'JWT decoder and analyzer. Decode JSON Web Tokens and inspect claims.',
		faqs: [
			{
				question: 'Что такое JWT и как он структурирован?',
				answer:
					'JWT (JSON Web Token) - это безопасный способ передачи информации в виде JSON объекта. Состоит из трех частей, закодированных в Base64 и разделенных точками: Заголовок (информация об алгоритме), Полезная нагрузка (утверждения/данные) и Подпись (проверка).'
			},
			{
				question: 'Безопасно ли декодировать JWT на стороне клиента?',
				answer:
					'Да, декодирование безопасно - JWT созданы для чтения клиентами. Однако никогда не размещайте чувствительные данные в утверждениях JWT, поскольку любой может их декодировать. Подпись проверяет подлинность, но данные полезной нагрузки не зашифрованы.'
			},
			{
				question: 'Что такое утверждения JWT и как их читать?',
				answer:
					'Утверждения - это заявления о сущности (обычно пользователе). Стандартные утверждения включают "iss" (издатель), "exp" (истечение), "sub" (субъект) и "aud" (аудитория). Пользовательские утверждения могут содержать любые JSON данные, необходимые вашему приложению.'
			},
			{
				question: 'Как проверить, действителен ли JWT?',
				answer:
					'Этот инструмент только декодирует JWT - он не проверяет подписи. Для проверки действительности нужен секретный ключ или открытый ключ, использованный для подписи. Проверяйте даты истечения, издателя и другие утверждения в логике приложения.'
			},
			{
				question: 'Почему может не удаться декодирование JWT?',
				answer:
					'Частые причины: неправильная структура токена (не 3 части), недопустимое кодирование Base64, поврежденные символы или токены, которые на самом деле не являются JWT. Убедитесь, что вставляете полный токен, включая все точки.'
			}
		]
	},
	{
		id: 'uuid-generator',
		icon: Fingerprint,
		category: 'security',
		translationKey: 'uuidGenerator',
		path: 'uuid-generator',
		gradient: 'from-indigo-500 to-blue-600',
		title: 'Генератор UUID',
		description: 'Создавайте уникальные идентификаторы UUID всех версий',
		recommendedTools: ['hash-generator', 'password-generator', 'jwt-decoder'],
		difficulty: 'beginner',
		tags: ['uuid', 'guid', 'generator', 'unique', 'identifier'],
		useCase: 'Генерация уникальных идентификаторов для API и баз данных',
		metaDescription:
			'UUID generator for all versions. Generate unique identifiers (UUID/GUID).',
		faqs: [
			{
				question: 'В чём разница между версиями UUID?',
				answer:
					'UUID v1 использует временную метку + MAC адрес, v3/v5 используют хеширование на основе имени (MD5/SHA-1), v4 использует случайные данные. v4 наиболее распространён для общего использования, v1 для временно упорядоченных ID.'
			},
			{
				question: 'Действительно ли UUID уникальны и защищены от коллизий?',
				answer:
					'UUID v4 имеет крайне низкую вероятность коллизий (1 к 5.3×10^36). Хотя математически это не невозможно, коллизии практически невозможны в реальных приложениях.'
			},
			{
				question: 'Когда следует использовать UUID против автоинкрементных ID?',
				answer:
					'Используйте UUID для распределённых систем, публичных API или когда нужны непоследовательные ID для безопасности. Используйте автоинкремент для простых баз данных с одним сервером.'
			},
			{
				question: 'Можно ли использовать UUID как первичные ключи базы данных?',
				answer:
					'Да, но учитывайте влияние на производительность. UUID больше (36 символов против 4-8 байт) и непоследовательны, что может влиять на производительность индекса. UUID v1 или ULID могут быть лучше для баз данных.'
			},
			{
				question: 'Какой стандартный формат UUID?',
				answer:
					'Стандартный формат UUID: 8-4-4-4-12 шестнадцатеричных цифр: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx. Некоторые системы используют варианты, такие как удаление дефисов или использование заглавных букв.'
			}
		]
	},

	{
		id: 'ascii-art-generator',
		icon: TerminalSquare,
		category: 'webdev',
		translationKey: 'asciiArtGenerator',
		path: 'ascii-art-generator',
		gradient: 'from-green-500 to-emerald-600',
		title: 'Генератор ASCII арта',
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
			}
		]
	},
	{
		id: 'opengraph-validator',
		path: 'opengraph-validator',
		translationKey: 'openGraphValidator',
		icon: Globe,
		gradient: 'from-blue-500 to-purple-600',
		category: 'webdev',
		title: 'OpenGraph валидатор',
		description: 'Проверяйте OpenGraph теги для соцсетей',
		tags: ['opengraph', 'meta', 'social', 'seo', 'preview', 'validator'],
		difficulty: 'intermediate',
		useCase: 'Оптимизация превью ссылок в социальных сетях',
		metaDescription:
			'OpenGraph validator and previewer. Test how your webpage appears when shared on social platforms.',
		recommendedTools: [
			'html-xml-parser',
			'seo-markdown-generator',
			'utm-link-builder'
		],
		faqs: [
			{
				question: 'Что такое теги Open Graph?',
				answer:
					'Open Graph теги - это HTML мета-теги, которые контролируют, как ваш контент отображается при публикации в социальных сетях вроде Facebook, Twitter и LinkedIn.'
			},
			{
				question: 'Какие теги обязательны?',
				answer:
					'Основные теги: og:title, og:description, og:image, og:url и og:type. Они предоставляют базовую информацию для социального обмена.'
			},
			{
				question: 'Как исправить отсутствующие теги?',
				answer:
					'Добавьте недостающие мета-теги в секцию head вашего HTML. Каждый тег должен иметь атрибут property (например "og:title") и атрибут content с вашим значением.'
			}
		]
	}
]

export const widgetCategories = {
	webdev: 'Web Development',
	content: 'Content Creation',
	security: 'Security & Privacy',
	lifestyle: 'Health & Lifestyle'
} as const

export function getWidgetsByCategory(category: Widget['category']): Widget[] {
	return widgets.filter(widget => widget.category === category)
}

export function getWidgetById(id: string): Widget | undefined {
	return widgets.find(widget => widget.id === id)
}

export function getWidgetByPath(path: string): Widget | undefined {
	return widgets.find(widget => widget.path === path)
}

export function getRecommendedWidgets(widgetId: string): Widget[] {
	const widget = getWidgetById(widgetId)
	if (!widget?.recommendedTools) return []

	return widget.recommendedTools
		.map(id => getWidgetById(id))
		.filter((w): w is Widget => w !== undefined)
}

export function getWidgetsByDifficulty(
	difficulty: Widget['difficulty']
): Widget[] {
	return widgets.filter(widget => widget.difficulty === difficulty)
}

export function getWidgetsByTag(tag: string): Widget[] {
	return widgets.filter(widget => widget.tags?.includes(tag))
}

export function getWidgetFAQs(widgetId: string): WidgetFAQ[] {
	const widget = getWidgetById(widgetId)
	return widget?.faqs || []
}
