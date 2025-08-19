type LocaleMetadata = {
	title: string
	description: string
	keywords: string[]
}

type WidgetMetadata = {
	en: LocaleMetadata
	ru: LocaleMetadata
}

export const widgetMetadata: Record<string, WidgetMetadata> = {
	'css-clamp-calculator': {
		en: {
			title:
				'CSS Clamp Calculator - Create Responsive Typography | Online Tool',
			description:
				'Free online CSS clamp() calculator. Create fluid responsive typography and spacing. Generate clamp() values with visual preview. Perfect for responsive web design.',
			keywords: [
				'css clamp',
				'clamp calculator',
				'responsive typography',
				'fluid typography',
				'css calculator',
				'responsive design'
			]
		},
		ru: {
			title:
				'CSS Clamp Калькулятор - Адаптивная Типографика | Онлайн Инструмент',
			description:
				'Бесплатный онлайн калькулятор CSS clamp(). Создавайте адаптивную типографику и отступы. Генерируйте clamp() значения с визуальным превью.',
			keywords: [
				'css clamp калькулятор',
				'адаптивная типографика',
				'калькулятор css',
				'адаптивный дизайн',
				'clamp функция'
			]
		}
	},
	'color-converter': {
		en: {
			title: 'Color Converter - HEX to RGB, HSL, CMYK | Free Online Tool',
			description:
				'Convert colors between HEX, RGB, HSL, HSB, CMYK, LAB, and XYZ formats. Free online color converter with instant preview and one-click copy.',
			keywords: [
				'color converter',
				'hex to rgb',
				'rgb to hex',
				'color picker',
				'cmyk converter',
				'hsl converter',
				'color tool'
			]
		},
		ru: {
			title: 'Конвертер Цветов - HEX в RGB, HSL, CMYK | Бесплатный Онлайн',
			description:
				'Конвертируйте цвета между форматами HEX, RGB, HSL, HSB, CMYK, LAB и XYZ. Бесплатный онлайн конвертер с мгновенным превью.',
			keywords: [
				'конвертер цветов',
				'hex в rgb',
				'rgb в hex',
				'палитра цветов',
				'cmyk конвертер',
				'конвертер цвета онлайн'
			]
		}
	},
	'bezier-curve': {
		en: {
			title: 'Bezier Curve Generator - CSS Animation Easing | Online Tool',
			description:
				'Create custom cubic bezier curves for CSS animations. Visual curve editor with 30+ presets. Generate cubic-bezier() values for smooth animations.',
			keywords: [
				'bezier curve',
				'cubic bezier',
				'css animation',
				'easing function',
				'animation curve',
				'bezier generator'
			]
		},
		ru: {
			title: 'Генератор Кривых Безье - CSS Анимация | Онлайн Инструмент',
			description:
				'Создавайте кубические кривые Безье для CSS анимаций. Визуальный редактор с 30+ пресетами. Генерируйте cubic-bezier() значения.',
			keywords: [
				'кривые безье',
				'генератор безье',
				'css анимация',
				'easing функция',
				'кубические кривые'
			]
		}
	},
	'css-specificity': {
		en: {
			title: 'CSS Specificity Calculator - Analyze Selector Weight | Free Tool',
			description:
				'Calculate CSS selector specificity instantly. Understand selector weight and cascade. Visual breakdown of IDs, classes, and elements.',
			keywords: [
				'css specificity',
				'specificity calculator',
				'css selector',
				'selector weight',
				'css cascade',
				'css priority'
			]
		},
		ru: {
			title: 'Калькулятор Специфичности CSS - Анализ Селекторов | Бесплатно',
			description:
				'Рассчитайте специфичность CSS селекторов мгновенно. Понимайте вес селекторов и каскад. Визуальная разбивка по ID, классам и элементам.',
			keywords: [
				'специфичность css',
				'калькулятор специфичности',
				'css селекторы',
				'вес селектора',
				'css каскад'
			]
		}
	},
	'flexbox-generator': {
		en: {
			title: 'Flexbox Generator - Visual CSS Flexbox Builder | Online Tool',
			description:
				'Visual flexbox CSS generator with live preview. Create flexible layouts easily. Export clean CSS code for flex containers and items.',
			keywords: [
				'flexbox generator',
				'css flexbox',
				'flex layout',
				'flexbox builder',
				'css generator',
				'flex container'
			]
		},
		ru: {
			title: 'Генератор Flexbox - Визуальный Конструктор CSS | Онлайн',
			description:
				'Визуальный генератор CSS flexbox с живым превью. Создавайте гибкие макеты легко. Экспортируйте чистый CSS код.',
			keywords: [
				'генератор flexbox',
				'css flexbox',
				'flex макет',
				'конструктор flexbox',
				'генератор css'
			]
		}
	},
	'grid-generator': {
		en: {
			title: 'CSS Grid Generator - Visual Grid Layout Builder | Free Tool',
			description:
				'Create CSS Grid layouts visually. Generate grid-template code with live preview. Perfect tool for responsive grid design.',
			keywords: [
				'css grid generator',
				'grid layout',
				'css grid',
				'grid builder',
				'grid template',
				'responsive grid'
			]
		},
		ru: {
			title: 'Генератор CSS Grid - Визуальный Конструктор Сеток | Бесплатно',
			description:
				'Создавайте CSS Grid макеты визуально. Генерируйте grid-template код с живым превью. Идеальный инструмент для адаптивных сеток.',
			keywords: [
				'генератор css grid',
				'grid макет',
				'css сетка',
				'конструктор grid',
				'адаптивная сетка'
			]
		}
	},
	'password-generator': {
		en: {
			title: 'Strong Password Generator - Secure Random Passwords | Free Tool',
			description:
				'Generate strong, secure passwords instantly. Customize length and character types. Create unbreakable passwords for maximum security.',
			keywords: [
				'password generator',
				'strong password',
				'secure password',
				'random password',
				'password creator',
				'password tool'
			]
		},
		ru: {
			title: 'Генератор Паролей - Надежные Случайные Пароли | Бесплатно',
			description:
				'Генерируйте надежные, безопасные пароли мгновенно. Настройте длину и типы символов. Создавайте невзламываемые пароли.',
			keywords: [
				'генератор паролей',
				'надежный пароль',
				'безопасный пароль',
				'случайный пароль',
				'создать пароль'
			]
		}
	},
	'qr-generator': {
		en: {
			title: 'QR Code Generator - Create Custom QR Codes | Free Online Tool',
			description:
				'Generate QR codes for URLs, text, WiFi, and more. Customize colors, add logos, download in multiple formats. Free QR code maker.',
			keywords: [
				'qr code generator',
				'qr generator',
				'create qr code',
				'qr code maker',
				'custom qr code',
				'free qr code'
			]
		},
		ru: {
			title: 'Генератор QR Кодов - Создать QR Код Онлайн | Бесплатно',
			description:
				'Генерируйте QR коды для URL, текста, WiFi и другого. Настройте цвета, добавьте логотип, скачайте в разных форматах.',
			keywords: [
				'генератор qr кода',
				'qr генератор',
				'создать qr код',
				'qr код онлайн',
				'бесплатный qr код'
			]
		}
	},
	'svg-encoder': {
		en: {
			title: 'SVG Encoder - Convert SVG to Data URI | Online Tool',
			description:
				'Encode SVG to data URI for CSS. Optimize SVG for inline use. Convert SVG files to base64 or URL-encoded format instantly.',
			keywords: [
				'svg encoder',
				'svg to data uri',
				'svg to base64',
				'svg optimizer',
				'inline svg',
				'svg converter'
			]
		},
		ru: {
			title: 'SVG Кодировщик - Конвертер SVG в Data URI | Онлайн',
			description:
				'Кодируйте SVG в data URI для CSS. Оптимизируйте SVG для встроенного использования. Конвертируйте SVG в base64 или URL-формат.',
			keywords: [
				'svg кодировщик',
				'svg в data uri',
				'svg в base64',
				'оптимизатор svg',
				'конвертер svg'
			]
		}
	},
	'utm-builder': {
		en: {
			title: 'UTM Builder - Campaign URL Generator | Free Marketing Tool',
			description:
				'Build UTM tracking URLs for marketing campaigns. Track traffic sources in Google Analytics. Generate campaign URLs with proper UTM parameters.',
			keywords: [
				'utm builder',
				'utm generator',
				'campaign url',
				'utm parameters',
				'google analytics',
				'url builder'
			]
		},
		ru: {
			title: 'UTM Генератор - Создать UTM Метки для Кампаний | Бесплатно',
			description:
				'Создавайте UTM ссылки для маркетинговых кампаний. Отслеживайте источники трафика в Google Analytics. Генерируйте URL с UTM параметрами.',
			keywords: [
				'utm генератор',
				'utm метки',
				'utm ссылки',
				'генератор utm',
				'google analytics',
				'отслеживание кампаний'
			]
		}
	},
	'youtube-thumbnail': {
		en: {
			title: 'YouTube Thumbnail Downloader - Get HD Thumbnails | Free Tool',
			description:
				'Download YouTube video thumbnails in HD quality. Get all thumbnail sizes instantly. Free YouTube thumbnail grabber and downloader.',
			keywords: [
				'youtube thumbnail',
				'thumbnail downloader',
				'youtube thumbnail download',
				'thumbnail grabber',
				'youtube image'
			]
		},
		ru: {
			title: 'Скачать Превью YouTube - Миниатюры в HD Качестве | Бесплатно',
			description:
				'Скачивайте превью YouTube видео в HD качестве. Получите все размеры миниатюр мгновенно. Бесплатный загрузчик превью YouTube.',
			keywords: [
				'превью youtube',
				'скачать превью',
				'миниатюра youtube',
				'youtube thumbnail',
				'загрузчик превью'
			]
		}
	},
	'seo-markdown-generator': {
		en: {
			title: 'SEO Markdown Generator - Create Optimized Blog Posts | Free Tool',
			description:
				'Generate SEO-optimized markdown files for blog posts. Create structured content with metadata, keywords, and proper formatting. Perfect for bloggers and content creators.',
			keywords: [
				'seo markdown',
				'markdown generator',
				'blog post generator',
				'seo content',
				'markdown creator',
				'content generator'
			]
		},
		ru: {
			title:
				'SEO Markdown Генератор - Создание Оптимизированных Постов | Бесплатно',
			description:
				'Генерируйте SEO-оптимизированные markdown файлы для блога. Создавайте структурированный контент с метаданными и ключевыми словами.',
			keywords: [
				'seo markdown',
				'генератор markdown',
				'генератор постов',
				'seo контент',
				'создать markdown',
				'генератор контента'
			]
		}
	},
	'html-tree': {
		en: {
			title: 'HTML Tree Visualizer - DOM Structure Viewer | Developer Tool',
			description:
				'Visualize HTML DOM structure as an interactive tree. Analyze nested elements and hierarchy. Perfect tool for debugging HTML structure.',
			keywords: [
				'html tree',
				'dom visualizer',
				'html structure',
				'dom tree',
				'html viewer',
				'html analyzer'
			]
		},
		ru: {
			title: 'HTML Дерево - Визуализатор DOM Структуры | Инструмент',
			description:
				'Визуализируйте структуру HTML DOM как интерактивное дерево. Анализируйте вложенные элементы и иерархию.',
			keywords: [
				'html дерево',
				'визуализатор dom',
				'структура html',
				'dom дерево',
				'анализатор html'
			]
		}
	},
	'speed-test': {
		en: {
			title: 'Internet Speed Test - Check Download & Upload Speed | Free',
			description:
				'Test your internet connection speed. Measure download, upload, and ping. Free online speed test with accurate results.',
			keywords: [
				'speed test',
				'internet speed test',
				'bandwidth test',
				'connection speed',
				'download speed',
				'upload speed'
			]
		},
		ru: {
			title: 'Тест Скорости Интернета - Проверить Скорость | Бесплатно',
			description:
				'Протестируйте скорость интернет-соединения. Измерьте скорость загрузки, отдачи и пинг. Бесплатный онлайн тест скорости.',
			keywords: [
				'тест скорости',
				'скорость интернета',
				'проверить скорость',
				'тест соединения',
				'speedtest'
			]
		}
	},
	'tip-calculator': {
		en: {
			title: 'Tip Calculator - Calculate Gratuity & Split Bills | Free Tool',
			description:
				'Calculate tips for restaurants, bars, and services. Split bills among multiple people. Free tip calculator with customizable percentages and tipping guide.',
			keywords: [
				'tip calculator',
				'gratuity calculator',
				'split bill',
				'restaurant tip',
				'service tip',
				'bill splitter',
				'tip percentage'
			]
		},
		ru: {
			title: 'Калькулятор Чаевых - Расчёт и Разделение Счёта | Бесплатно',
			description:
				'Рассчитывайте чаевые для ресторанов, баров и услуг. Делите счета между несколькими людьми. Бесплатный калькулятор с гидом по чаевым.',
			keywords: [
				'калькулятор чаевых',
				'разделить счёт',
				'чаевые в ресторане',
				'расчёт чаевых',
				'процент чаевых',
				'калькулятор счёта'
			]
		}
	},
	'text-case-converter': {
		en: {
			title: 'Text Case Converter - Change Letter Case Online | Free Tool',
			description:
				'Convert text between different cases: UPPERCASE, lowercase, camelCase, snake_case, Title Case and more. Free online text case converter with instant results.',
			keywords: [
				'text case converter',
				'case converter',
				'uppercase converter',
				'lowercase converter',
				'camelcase converter',
				'snake case',
				'text transformation'
			]
		},
		ru: {
			title: 'Конвертер Регистра Текста - Изменить Регистр Онлайн | Бесплатно',
			description:
				'Конвертируйте текст между разными регистрами: ПРОПИСНЫЕ, строчные, camelCase, snake_case, Заголовочный и другие. Бесплатный онлайн конвертер.',
			keywords: [
				'конвертер регистра',
				'изменить регистр',
				'прописные буквы',
				'строчные буквы',
				'camelcase',
				'snake case',
				'преобразование текста'
			]
		}
	},
	'image-size-checker': {
		en: {
			title: 'Image Size Checker - Check Dimensions & File Size | Free Tool',
			description:
				'Check image dimensions, file size, and aspect ratio instantly. Analyze multiple images at once. Export data to CSV. Free online image size analyzer.',
			keywords: [
				'image size checker',
				'image dimensions',
				'image analyzer',
				'file size checker',
				'aspect ratio',
				'image properties',
				'image info'
			]
		},
		ru: {
			title: 'Проверка Размера Изображений - Размеры и Вес Файла | Бесплатно',
			description:
				'Проверяйте размеры изображений, вес файла и соотношение сторон мгновенно. Анализируйте несколько изображений сразу. Экспорт в CSV.',
			keywords: [
				'проверка размера изображений',
				'размеры изображения',
				'анализатор изображений',
				'вес файла',
				'соотношение сторон',
				'свойства изображения'
			]
		}
	},
	'html-xml-parser': {
		en: {
			title: 'HTML/XML Parser - Format, Validate & Minify | Developer Tool',
			description:
				'Parse, format, validate, and minify HTML and XML documents. Extract data from markup. Free online HTML/XML parser with syntax validation.',
			keywords: [
				'html parser',
				'xml parser',
				'html formatter',
				'xml validator',
				'html minifier',
				'markup parser',
				'code formatter'
			]
		},
		ru: {
			title: 'HTML/XML Парсер - Форматирование и Валидация | Инструмент',
			description:
				'Парсинг, форматирование, валидация и минификация HTML и XML документов. Извлечение данных из разметки. Бесплатный онлайн парсер.',
			keywords: [
				'html парсер',
				'xml парсер',
				'форматирование html',
				'валидатор xml',
				'минификатор html',
				'парсер разметки',
				'форматирование кода'
			]
		}
	},
	'mock-data-generator': {
		en: {
			title: 'Mock Data Generator - Create Test Data Sets | Free Online Tool',
			description:
				'Generate realistic mock data for testing and development. Create JSON datasets with names, emails, addresses, and custom fields. Export in multiple formats.',
			keywords: [
				'mock data generator',
				'test data',
				'fake data',
				'json generator',
				'sample data',
				'dummy data',
				'test dataset'
			]
		},
		ru: {
			title: 'Генератор Тестовых Данных - Создание Mock Данных | Бесплатно',
			description:
				'Генерируйте реалистичные тестовые данные для разработки. Создавайте JSON датасеты с именами, email, адресами. Экспорт в разных форматах.',
			keywords: [
				'генератор тестовых данных',
				'mock данные',
				'фейковые данные',
				'json генератор',
				'тестовые данные'
			]
		}
	},
	'email-validator': {
		en: {
			title: 'Email Validator - Verify Email Address Format | Free Tool',
			description:
				'Validate email addresses with advanced verification. Check syntax, domain validity, and disposable email detection. Perfect for form validation and data cleaning.',
			keywords: [
				'email validator',
				'email verification',
				'email checker',
				'validate email',
				'email format',
				'email syntax'
			]
		},
		ru: {
			title: 'Валидатор Email - Проверка Email Адресов | Бесплатно',
			description:
				'Проверяйте email адреса с расширенной валидацией. Проверка синтаксиса, домена и временных email. Идеально для валидации форм.',
			keywords: [
				'валидатор email',
				'проверка email',
				'валидация почты',
				'проверить email',
				'формат email'
			]
		}
	},
	'json-tools': {
		en: {
			title: 'JSON Tools - Format, Validate, Minify & Convert | Free Online',
			description:
				'Complete JSON toolkit: format, validate, minify, and convert JSON data. Compare JSON files, fix syntax errors, and transform between formats.',
			keywords: [
				'json formatter',
				'json validator',
				'json minifier',
				'json tools',
				'json beautifier',
				'json converter'
			]
		},
		ru: {
			title: 'JSON Инструменты - Форматирование и Валидация | Бесплатно',
			description:
				'Полный набор JSON инструментов: форматирование, валидация, минификация. Сравнение JSON файлов, исправление ошибок.',
			keywords: [
				'json форматирование',
				'json валидатор',
				'json минификатор',
				'json инструменты',
				'json конвертер'
			]
		}
	},
	'regex-tester': {
		en: {
			title: 'Regex Tester - Test Regular Expressions Online | Free Tool',
			description:
				'Test and debug regular expressions with real-time matching. Support for JavaScript, PHP, Python regex. Visual highlights and code generation.',
			keywords: [
				'regex tester',
				'regular expression',
				'regex validator',
				'pattern matching',
				'regex debugger',
				'regex tool'
			]
		},
		ru: {
			title: 'Тестер Регулярных Выражений - Regex Online | Бесплатно',
			description:
				'Тестируйте и отлаживайте регулярные выражения. Поддержка JavaScript, PHP, Python. Визуальная подсветка и генерация кода.',
			keywords: [
				'тестер regex',
				'регулярные выражения',
				'regex валидатор',
				'проверка паттернов',
				'отладчик regex'
			]
		}
	},
	'age-calculator': {
		en: {
			title: 'Age Calculator - Calculate Exact Age Online | Free Tool',
			description:
				'Calculate your exact age in years, months, days, hours, and minutes. Find age difference between dates. Birthday countdown and zodiac sign calculator.',
			keywords: [
				'age calculator',
				'birthday calculator',
				'age in days',
				'age difference',
				'date calculator',
				'zodiac calculator'
			]
		},
		ru: {
			title: 'Калькулятор Возраста - Точный Расчёт Возраста | Бесплатно',
			description:
				'Рассчитайте точный возраст в годах, месяцах, днях. Найдите разницу между датами. Обратный отсчёт до дня рождения.',
			keywords: [
				'калькулятор возраста',
				'сколько лет',
				'возраст в днях',
				'разница дат',
				'знак зодиака'
			]
		}
	},
	'text-counter': {
		en: {
			title: 'Text Counter - Word & Character Count Tool | Free Online',
			description:
				'Count words, characters, sentences, and paragraphs instantly. Check text length for social media, SEO, and essays. Reading time calculator included.',
			keywords: [
				'word counter',
				'character counter',
				'text counter',
				'word count',
				'letter count',
				'text length'
			]
		},
		ru: {
			title: 'Счётчик Текста - Подсчёт Слов и Символов | Бесплатно',
			description:
				'Считайте слова, символы, предложения и абзацы мгновенно. Проверка длины текста для соцсетей и SEO. Время чтения.',
			keywords: [
				'счётчик слов',
				'счётчик символов',
				'подсчёт текста',
				'количество слов',
				'длина текста'
			]
		}
	},
	'percentage-calculator': {
		en: {
			title: 'Percentage Calculator - Calculate Percentages Online | Free',
			description:
				'Calculate percentages, percentage change, and percentage difference. Find what percent X is of Y. Perfect for discounts, tips, and math problems.',
			keywords: [
				'percentage calculator',
				'percent calculator',
				'percentage change',
				'calculate percentage',
				'percent difference'
			]
		},
		ru: {
			title: 'Калькулятор Процентов - Расчёт Процентов Онлайн | Бесплатно',
			description:
				'Рассчитывайте проценты, процентное изменение и разницу. Найдите сколько процентов X от Y. Для скидок и расчётов.',
			keywords: [
				'калькулятор процентов',
				'расчёт процентов',
				'процентное изменение',
				'вычислить проценты'
			]
		}
	},
	'temperature-converter': {
		en: {
			title: 'Temperature Converter - Celsius, Fahrenheit, Kelvin | Free Tool',
			description:
				'Convert between Celsius, Fahrenheit, Kelvin, and Rankine temperature scales. Instant conversion with formula explanations. Perfect for science and cooking.',
			keywords: [
				'temperature converter',
				'celsius to fahrenheit',
				'fahrenheit to celsius',
				'kelvin converter',
				'temperature conversion'
			]
		},
		ru: {
			title: 'Конвертер Температуры - Цельсий, Фаренгейт, Кельвин | Бесплатно',
			description:
				'Конвертируйте между Цельсием, Фаренгейтом, Кельвином. Мгновенная конвертация с формулами. Для науки и кулинарии.',
			keywords: [
				'конвертер температуры',
				'цельсий в фаренгейт',
				'фаренгейт в цельсий',
				'кельвин',
				'перевод температуры'
			]
		}
	},
	'bmi-calculator': {
		en: {
			title: 'BMI Calculator - Body Mass Index Calculator | Free Health Tool',
			description:
				'Calculate your Body Mass Index (BMI) using height and weight. Get health category, ideal weight range, and personalized health recommendations.',
			keywords: [
				'bmi calculator',
				'body mass index',
				'bmi chart',
				'healthy weight',
				'obesity calculator',
				'weight calculator'
			]
		},
		ru: {
			title: 'Калькулятор ИМТ - Индекс Массы Тела | Бесплатно',
			description:
				'Рассчитайте индекс массы тела (ИМТ) по росту и весу. Узнайте категорию здоровья и идеальный вес. Рекомендации по здоровью.',
			keywords: [
				'калькулятор имт',
				'индекс массы тела',
				'рассчитать имт',
				'идеальный вес',
				'калькулятор веса'
			]
		}
	},
	'currency-converter': {
		en: {
			title: 'Currency Converter - Real-Time Exchange Rates | Free Tool',
			description:
				'Convert between 150+ currencies with live exchange rates. Historical rates, currency charts, and offline mode. Perfect for travel and business.',
			keywords: [
				'currency converter',
				'exchange rates',
				'currency exchange',
				'money converter',
				'forex rates',
				'currency calculator'
			]
		},
		ru: {
			title: 'Конвертер Валют - Актуальные Курсы Обмена | Бесплатно',
			description:
				'Конвертируйте между 150+ валютами с актуальными курсами. Исторические курсы и графики. Для путешествий и бизнеса.',
			keywords: [
				'конвертер валют',
				'курсы валют',
				'обмен валют',
				'калькулятор валют',
				'курс обмена'
			]
		}
	},
	'random-number-generator': {
		en: {
			title: 'Random Number Generator - Generate Random Numbers | Free Tool',
			description:
				'Generate truly random numbers with custom ranges. Create integer or decimal numbers, multiple numbers at once. Perfect for lottery, raffles, and testing.',
			keywords: [
				'random number generator',
				'number generator',
				'random numbers',
				'rng',
				'lottery numbers',
				'random picker'
			]
		},
		ru: {
			title: 'Генератор Случайных Чисел - ГСЧ Онлайн | Бесплатно',
			description:
				'Генерируйте случайные числа в заданном диапазоне. Целые или дробные числа. Идеально для лотерей и тестирования.',
			keywords: [
				'генератор случайных чисел',
				'гсч',
				'случайные числа',
				'генератор чисел',
				'лотерейные числа'
			]
		}
	},
	'compound-interest-calculator': {
		en: {
			title: 'Compound Interest Calculator - Investment Growth | Free Tool',
			description:
				'Calculate compound interest for investments and savings. Compare simple vs compound interest. Visualize growth with charts. Perfect for financial planning.',
			keywords: [
				'compound interest calculator',
				'investment calculator',
				'interest calculator',
				'compound interest',
				'roi calculator'
			]
		},
		ru: {
			title: 'Калькулятор Сложных Процентов - Рост Инвестиций | Бесплатно',
			description:
				'Рассчитайте сложные проценты для инвестиций. Сравните простые и сложные проценты. Визуализация роста. Для планирования.',
			keywords: [
				'калькулятор сложных процентов',
				'инвестиционный калькулятор',
				'сложный процент',
				'калькулятор доходности'
			]
		}
	},
	'loan-calculator': {
		en: {
			title: 'Loan Calculator - Mortgage & Payment Calculator | Free Tool',
			description:
				'Calculate loan payments, interest, and amortization schedules. Compare different loan terms. Perfect for mortgages, auto loans, and personal loans.',
			keywords: [
				'loan calculator',
				'mortgage calculator',
				'payment calculator',
				'amortization calculator',
				'loan payment',
				'interest calculator'
			]
		},
		ru: {
			title: 'Кредитный Калькулятор - Расчёт Платежей | Бесплатно',
			description:
				'Рассчитайте платежи по кредиту, проценты и график погашения. Сравните условия. Для ипотеки и автокредитов.',
			keywords: [
				'кредитный калькулятор',
				'ипотечный калькулятор',
				'расчёт платежей',
				'калькулятор кредита',
				'график платежей'
			]
		}
	},
	'fuel-consumption-calculator': {
		en: {
			title: 'Fuel Consumption Calculator - MPG & L/100km | Free Tool',
			description:
				'Calculate fuel consumption, cost per mile, and trip expenses. Convert between MPG and L/100km. Track fuel efficiency and optimize driving costs.',
			keywords: [
				'fuel calculator',
				'mpg calculator',
				'gas mileage',
				'fuel consumption',
				'fuel cost calculator',
				'fuel efficiency'
			]
		},
		ru: {
			title: 'Калькулятор Расхода Топлива - Литры на 100км | Бесплатно',
			description:
				'Рассчитайте расход топлива, стоимость поездки. Конвертация между л/100км и MPG. Отслеживайте эффективность.',
			keywords: [
				'расход топлива',
				'калькулятор бензина',
				'расход бензина',
				'стоимость поездки',
				'калькулятор топлива'
			]
		}
	},
	'text-diff-tool': {
		en: {
			title: 'Text Diff Tool - Compare Text Differences | Free Online',
			description:
				'Compare two texts and highlight differences. Line-by-line comparison with visual highlighting. Perfect for code review and document comparison.',
			keywords: [
				'text diff',
				'text compare',
				'diff tool',
				'compare texts',
				'text difference',
				'diff checker'
			]
		},
		ru: {
			title: 'Сравнение Текстов - Найти Различия | Бесплатно',
			description:
				'Сравнивайте два текста и находите различия. Построчное сравнение с подсветкой. Для код-ревью и документов.',
			keywords: [
				'сравнение текстов',
				'diff инструмент',
				'найти различия',
				'сравнить тексты',
				'текстовый diff'
			]
		}
	},
	'timer-countdown': {
		en: {
			title: 'Timer & Countdown - Online Timer Tool | Free',
			description:
				'Set custom timers and countdowns with alerts. Multiple timers, pause/resume, and preset options. Perfect for cooking, workouts, and time management.',
			keywords: [
				'online timer',
				'countdown timer',
				'timer tool',
				'kitchen timer',
				'workout timer',
				'stopwatch'
			]
		},
		ru: {
			title: 'Таймер и Обратный Отсчёт - Онлайн Таймер | Бесплатно',
			description:
				'Установите таймеры с оповещениями. Множественные таймеры, пауза/возобновление. Для готовки и тренировок.',
			keywords: [
				'онлайн таймер',
				'обратный отсчёт',
				'таймер',
				'кухонный таймер',
				'секундомер'
			]
		}
	},
	'world-time': {
		en: {
			title: 'World Time - Time Zone Converter & Clock | Free Tool',
			description:
				'Check current time in any timezone. Convert time between cities. Meeting planner for multiple timezones. DST aware with timezone map.',
			keywords: [
				'world time',
				'time zone converter',
				'world clock',
				'timezone converter',
				'time difference',
				'meeting planner'
			]
		},
		ru: {
			title: 'Мировое Время - Конвертер Часовых Поясов | Бесплатно',
			description:
				'Узнайте текущее время в любом часовом поясе. Конвертируйте время между городами. Планировщик встреч.',
			keywords: [
				'мировое время',
				'часовые пояса',
				'конвертер времени',
				'мировые часы',
				'разница времени'
			]
		}
	},
	'base64-encoder': {
		en: {
			title: 'Base64 Encoder/Decoder - Encode & Decode Online | Free Tool',
			description:
				'Encode and decode Base64 strings instantly. Support for text, files, and images. URL-safe encoding and data URI generation.',
			keywords: [
				'base64 encoder',
				'base64 decoder',
				'base64 converter',
				'encode base64',
				'decode base64',
				'base64 tool'
			]
		},
		ru: {
			title: 'Base64 Кодировщик - Кодирование и Декодирование | Бесплатно',
			description:
				'Кодируйте и декодируйте Base64 строки мгновенно. Поддержка текста, файлов и изображений. URL-безопасное кодирование.',
			keywords: [
				'base64 кодировщик',
				'base64 декодер',
				'конвертер base64',
				'кодирование base64',
				'декодирование base64'
			]
		}
	},
	'uuid-generator': {
		en: {
			title: 'UUID Generator - Generate Unique IDs | Free Online Tool',
			description:
				'Generate UUID v1, v3, v4, v5 and NIL UUIDs. Bulk generation, validation, and custom namespaces. Perfect for database IDs and unique identifiers.',
			keywords: [
				'uuid generator',
				'guid generator',
				'unique id generator',
				'uuid v4',
				'generate uuid',
				'random uuid'
			]
		},
		ru: {
			title: 'Генератор UUID - Уникальные Идентификаторы | Бесплатно',
			description:
				'Генерируйте UUID v1, v3, v4, v5. Массовая генерация, валидация. Идеально для ID в базах данных.',
			keywords: [
				'генератор uuid',
				'генератор guid',
				'уникальный id',
				'uuid v4',
				'создать uuid'
			]
		}
	},
	'jwt-decoder': {
		en: {
			title: 'JWT Decoder - Decode JSON Web Tokens | Free Online Tool',
			description:
				'Decode and validate JWT tokens online. View header, payload, and signature. Verify token expiration and claims. Perfect for debugging authentication.',
			keywords: [
				'jwt decoder',
				'jwt token decoder',
				'json web token',
				'jwt validator',
				'decode jwt',
				'jwt debugger'
			]
		},
		ru: {
			title: 'JWT Декодер - Декодирование JSON Web Token | Бесплатно',
			description:
				'Декодируйте и валидируйте JWT токены онлайн. Просмотр header, payload и подписи. Для отладки аутентификации.',
			keywords: [
				'jwt декодер',
				'декодер токенов',
				'json web token',
				'jwt валидатор',
				'декодировать jwt'
			]
		}
	},
	'favicon-generator': {
		en: {
			title: 'Favicon Generator - Create Website Icons | Free Online Tool',
			description:
				'Generate favicons in all sizes from any image. Create ico, png, and apple-touch-icon formats. Perfect for website branding and mobile apps.',
			keywords: [
				'favicon generator',
				'icon generator',
				'website icon',
				'favicon creator',
				'ico generator',
				'apple touch icon'
			]
		},
		ru: {
			title: 'Генератор Favicon - Создание Иконок Сайта | Бесплатно',
			description:
				'Генерируйте favicon всех размеров из любого изображения. Создавайте ico, png форматы. Для брендинга сайта.',
			keywords: [
				'генератор favicon',
				'создать иконку',
				'иконка сайта',
				'favicon creator',
				'генератор ico'
			]
		}
	},
	'ascii-art-generator': {
		en: {
			title: 'ASCII Art Generator - Text to ASCII Art | Free Online Tool',
			description:
				'Convert text to ASCII art with multiple fonts and styles. Create banners, signatures, and decorative text. Export as text or image.',
			keywords: [
				'ascii art generator',
				'text to ascii',
				'ascii text',
				'ascii banner',
				'text art generator',
				'ascii converter'
			]
		},
		ru: {
			title: 'Генератор ASCII Арт - Текст в ASCII | Бесплатно',
			description:
				'Конвертируйте текст в ASCII арт с разными шрифтами. Создавайте баннеры и подписи. Экспорт как текст или изображение.',
			keywords: [
				'генератор ascii',
				'текст в ascii',
				'ascii арт',
				'ascii баннер',
				'генератор текстового арта'
			]
		}
	},
	'css-specificity-calculator': {
		en: {
			title: 'CSS Specificity Calculator - Analyze Selector Weight | Free Tool',
			description:
				'Calculate CSS selector specificity instantly. Understand selector weight, cascade order, and inheritance. Visual breakdown with detailed explanations.',
			keywords: [
				'css specificity calculator',
				'selector specificity',
				'css weight',
				'cascade calculator',
				'css priority',
				'selector strength'
			]
		},
		ru: {
			title: 'Калькулятор Специфичности CSS - Анализ Селекторов | Бесплатно',
			description:
				'Рассчитайте специфичность CSS селекторов мгновенно. Понимайте вес селекторов и каскад. Визуальная разбивка с объяснениями.',
			keywords: [
				'калькулятор специфичности css',
				'специфичность селекторов',
				'вес css',
				'приоритет css',
				'сила селектора'
			]
		}
	},
	'css-bezier-curve-generator': {
		en: {
			title: 'CSS Bezier Curve Generator - Custom Animation Easing | Free Tool',
			description:
				'Create custom cubic-bezier curves for CSS animations. Visual curve editor with real-time preview. Generate smooth easing functions for transitions.',
			keywords: [
				'bezier curve generator',
				'css cubic bezier',
				'animation easing',
				'transition timing',
				'easing generator',
				'css animation tool'
			]
		},
		ru: {
			title: 'Генератор Кривых Безье CSS - Плавные Анимации | Бесплатно',
			description:
				'Создавайте кубические кривые Безье для CSS анимаций. Визуальный редактор с превью. Генерируйте плавные функции для переходов.',
			keywords: [
				'генератор кривых безье',
				'css cubic bezier',
				'плавность анимации',
				'timing function',
				'генератор easing'
			]
		}
	},
	'svg-to-base64-encoder': {
		en: {
			title: 'SVG to Base64 Encoder - Convert SVG for CSS | Free Tool',
			description:
				'Encode SVG images to base64 for inline CSS use. Optimize SVG files and generate data URIs. Perfect for embedding icons and graphics.',
			keywords: [
				'svg to base64',
				'svg encoder',
				'data uri svg',
				'inline svg',
				'svg optimization',
				'base64 converter'
			]
		},
		ru: {
			title: 'SVG в Base64 Кодировщик - Конвертер для CSS | Бесплатно',
			description:
				'Кодируйте SVG изображения в base64 для встраивания в CSS. Оптимизируйте SVG и генерируйте data URI. Для иконок и графики.',
			keywords: [
				'svg в base64',
				'кодировщик svg',
				'data uri svg',
				'встроенный svg',
				'оптимизация svg'
			]
		}
	},
	'youtube-thumbnail-downloader': {
		en: {
			title: 'YouTube Thumbnail Downloader - HD Quality Images | Free Tool',
			description:
				'Download YouTube video thumbnails in all sizes and HD quality. Get maxresdefault, hqdefault, and standard thumbnails instantly.',
			keywords: [
				'youtube thumbnail downloader',
				'download youtube thumbnail',
				'youtube image grabber',
				'video thumbnail',
				'youtube preview'
			]
		},
		ru: {
			title: 'Скачать Превью YouTube - HD Качество | Бесплатно',
			description:
				'Скачивайте превью YouTube видео во всех размерах и HD качестве. Получите maxresdefault, hqdefault миниатюры мгновенно.',
			keywords: [
				'скачать превью youtube',
				'youtube thumbnail',
				'миниатюра видео',
				'превью ютуб',
				'загрузчик превью'
			]
		}
	},
	'html-tree-visualizer': {
		en: {
			title: 'HTML Tree Visualizer - DOM Structure Viewer | Developer Tool',
			description:
				'Visualize HTML DOM structure as an interactive tree. Analyze element hierarchy, nesting levels, and document structure. Debug HTML layouts easily.',
			keywords: [
				'html tree viewer',
				'dom visualizer',
				'html structure',
				'element hierarchy',
				'dom tree',
				'html analyzer'
			]
		},
		ru: {
			title: 'Визуализатор HTML Дерева - Структура DOM | Инструмент',
			description:
				'Визуализируйте структуру HTML DOM как интерактивное дерево. Анализируйте иерархию элементов и структуру документа.',
			keywords: [
				'просмотр html дерева',
				'визуализатор dom',
				'структура html',
				'иерархия элементов',
				'дерево dom'
			]
		}
	},
	'internet-speed-test': {
		en: {
			title: 'Internet Speed Test - Check Download & Upload Speed | Free',
			description:
				'Test your internet connection speed accurately. Measure download, upload speeds and ping latency. Check bandwidth for streaming and gaming.',
			keywords: [
				'internet speed test',
				'speed test',
				'bandwidth test',
				'download speed',
				'upload speed',
				'connection test'
			]
		},
		ru: {
			title: 'Тест Скорости Интернета - Проверка Соединения | Бесплатно',
			description:
				'Точно протестируйте скорость интернет-соединения. Измерьте скорость загрузки, отдачи и пинг. Проверка для стриминга и игр.',
			keywords: [
				'тест скорости интернета',
				'speedtest',
				'проверка скорости',
				'скорость загрузки',
				'тест соединения'
			]
		}
	},
	'utm-link-builder': {
		en: {
			title: 'UTM Link Builder - Campaign URL Generator | Marketing Tool',
			description:
				'Build UTM tracking links for marketing campaigns. Generate URLs with UTM parameters for Google Analytics. Track campaign performance accurately.',
			keywords: [
				'utm builder',
				'utm generator',
				'campaign url builder',
				'utm parameters',
				'marketing links',
				'analytics tracking'
			]
		},
		ru: {
			title: 'UTM Конструктор Ссылок - Генератор для Кампаний | Бесплатно',
			description:
				'Создавайте UTM ссылки для маркетинговых кампаний. Генерируйте URL с UTM параметрами для Google Analytics. Отслеживайте эффективность.',
			keywords: [
				'utm конструктор',
				'генератор utm',
				'utm ссылки',
				'параметры utm',
				'маркетинговые ссылки'
			]
		}
	},
	'team-randomizer': {
		en: {
			title: 'Team Randomizer - Fair Team Generator | Free Online Tool',
			description:
				'Randomly divide people into fair teams. Perfect for sports, games, and group activities. Create balanced teams with custom constraints.',
			keywords: [
				'team randomizer',
				'team generator',
				'random teams',
				'group divider',
				'team picker',
				'fair teams'
			]
		},
		ru: {
			title: 'Генератор Команд - Случайное Деление на Группы | Бесплатно',
			description:
				'Случайно делите людей на справедливые команды. Идеально для спорта, игр и групповых активностей. Создавайте сбалансированные команды.',
			keywords: [
				'генератор команд',
				'деление на команды',
				'случайные команды',
				'разделение групп',
				'формирование команд'
			]
		}
	},
	'draw-lots': {
		en: {
			title: 'Draw Lots - Random Selection Tool | Free Online',
			description:
				'Draw lots fairly from a list of participants. Random selection for contests, giveaways, and decision making. Transparent and unbiased results.',
			keywords: [
				'draw lots',
				'random selection',
				'lottery draw',
				'random picker',
				'fair draw',
				'selection tool'
			]
		},
		ru: {
			title: 'Жеребьёвка - Случайный Выбор Онлайн | Бесплатно',
			description:
				'Проводите честную жеребьёвку из списка участников. Случайный выбор для конкурсов и розыгрышей. Прозрачные результаты.',
			keywords: [
				'жеребьёвка онлайн',
				'случайный выбор',
				'розыгрыш',
				'лотерея',
				'честная жеребьёвка'
			]
		}
	},
	'special-symbols-picker': {
		en: {
			title: 'Special Symbols Picker - Unicode Characters | Copy & Paste',
			description:
				'Browse and copy special symbols, Unicode characters, and emojis. Organized by categories. One-click copy for arrows, math, currency symbols.',
			keywords: [
				'special symbols',
				'unicode symbols',
				'character picker',
				'symbol keyboard',
				'special characters',
				'copy symbols'
			]
		},
		ru: {
			title: 'Специальные Символы - Unicode Знаки | Копировать',
			description:
				'Просматривайте и копируйте специальные символы, Unicode знаки и эмодзи. Организовано по категориям. Стрелки, математика, валюты.',
			keywords: [
				'специальные символы',
				'unicode символы',
				'выбор символов',
				'клавиатура символов',
				'спецсимволы'
			]
		}
	},
	'fancy-text-generator': {
		en: {
			title: 'Fancy Text Generator - Stylish Font Converter | Free Tool',
			description:
				'Convert plain text to fancy fonts and styles. Create cool text for social media, usernames, and bios. Unicode font generator with 50+ styles.',
			keywords: [
				'fancy text generator',
				'font generator',
				'stylish text',
				'cool fonts',
				'text converter',
				'unicode fonts'
			]
		},
		ru: {
			title: 'Генератор Красивого Текста - Стильные Шрифты | Бесплатно',
			description:
				'Конвертируйте обычный текст в красивые шрифты и стили. Создавайте крутой текст для соцсетей. Генератор с 50+ стилями.',
			keywords: [
				'генератор красивого текста',
				'генератор шрифтов',
				'стильный текст',
				'красивые шрифты',
				'конвертер текста'
			]
		}
	},
	'random-list-generator': {
		en: {
			title: 'Random List Generator - Shuffle & Randomize Lists | Free Tool',
			description:
				'Generate random lists or shuffle existing ones. Perfect for creating random orders, selections, and sequences. Export results easily.',
			keywords: [
				'random list generator',
				'list randomizer',
				'shuffle list',
				'random order',
				'list shuffler',
				'randomize items'
			]
		},
		ru: {
			title: 'Генератор Случайных Списков - Перемешать Список | Бесплатно',
			description:
				'Генерируйте случайные списки или перемешивайте существующие. Идеально для случайного порядка и выбора. Легкий экспорт.',
			keywords: [
				'генератор случайных списков',
				'рандомайзер списка',
				'перемешать список',
				'случайный порядок'
			]
		}
	},
	'coin-flip': {
		en: {
			title: 'Coin Flip - Heads or Tails Online | Decision Maker',
			description:
				'Flip a virtual coin online. Make quick decisions with heads or tails. Fair 50/50 probability with flip animation and statistics.',
			keywords: [
				'coin flip',
				'flip a coin',
				'heads or tails',
				'coin toss',
				'decision maker',
				'random coin'
			]
		},
		ru: {
			title: 'Подбросить Монету - Орёл или Решка | Онлайн',
			description:
				'Подбросьте виртуальную монету онлайн. Принимайте быстрые решения с орлом или решкой. Честная вероятность 50/50.',
			keywords: [
				'подбросить монету',
				'орёл или решка',
				'бросок монеты',
				'монетка онлайн',
				'принятие решений'
			]
		}
	},
	'dice-roller': {
		en: {
			title: 'Dice Roller - Roll Virtual Dice Online | Free Tool',
			description:
				'Roll virtual dice online with multiple dice types. Perfect for board games, RPGs, and probability. Support for D4, D6, D8, D10, D12, D20.',
			keywords: [
				'dice roller',
				'roll dice',
				'virtual dice',
				'online dice',
				'd20 roller',
				'rpg dice'
			]
		},
		ru: {
			title: 'Бросок Кубиков - Виртуальные Кости Онлайн | Бесплатно',
			description:
				'Бросайте виртуальные кубики онлайн. Идеально для настольных игр и RPG. Поддержка D4, D6, D8, D10, D12, D20.',
			keywords: [
				'бросок кубиков',
				'кости онлайн',
				'виртуальные кубики',
				'd20',
				'кубики для rpg'
			]
		}
	},
	'social-media-formatter': {
		en: {
			title: 'Social Media Formatter - Format Text for All Platforms | Free',
			description:
				'Format text for social media posts. Add bold, italic, strikethrough styles. Character counter for Twitter, Instagram, Facebook limits.',
			keywords: [
				'social media formatter',
				'text formatter',
				'social media text',
				'post formatter',
				'character counter',
				'social formatting'
			]
		},
		ru: {
			title:
				'Форматирование для Соцсетей - Текст для Всех Платформ | Бесплатно',
			description:
				'Форматируйте текст для постов в соцсетях. Добавляйте жирный, курсив, зачёркнутый стили. Счётчик символов для лимитов.',
			keywords: [
				'форматирование соцсетей',
				'форматтер текста',
				'текст для соцсетей',
				'счётчик символов'
			]
		}
	},
	'emoji-list': {
		en: {
			title: 'Emoji List - Complete Emoji Library | Copy & Paste',
			description:
				'Browse complete emoji list with search and categories. Copy emojis for all platforms. Find emoji meanings and Unicode codes.',
			keywords: [
				'emoji list',
				'emoji library',
				'emoji picker',
				'copy emoji',
				'emoji meanings',
				'emoji database'
			]
		},
		ru: {
			title: 'Список Эмодзи - Полная Библиотека | Копировать',
			description:
				'Просматривайте полный список эмодзи с поиском по категориям. Копируйте эмодзи для всех платформ. Значения и коды Unicode.',
			keywords: [
				'список эмодзи',
				'библиотека эмодзи',
				'выбор эмодзи',
				'копировать эмодзи',
				'база эмодзи'
			]
		}
	},
	'text-emoticons': {
		en: {
			title: 'Text Emoticons - ASCII Emoticons & Kaomoji | Copy Collection',
			description:
				'Collection of text emoticons, ASCII faces, and Japanese kaomoji. Copy classic emoticons like ¯\\_(ツ)_/¯ and (╯°□°)╯︵ ┻━┻.',
			keywords: [
				'text emoticons',
				'ascii emoticons',
				'kaomoji',
				'text faces',
				'emoticon list',
				'ascii faces'
			]
		},
		ru: {
			title: 'Текстовые Смайлики - ASCII и Каомодзи | Коллекция',
			description:
				'Коллекция текстовых смайликов, ASCII лиц и японских каомодзи. Копируйте классические смайлики как ¯\\_(ツ)_/¯.',
			keywords: [
				'текстовые смайлики',
				'ascii смайлики',
				'каомодзи',
				'текстовые лица',
				'список смайликов'
			]
		}
	},
	'text-to-speech': {
		en: {
			title: 'Text to Speech - Convert Text to Audio | Free TTS Tool',
			description:
				'Convert text to natural-sounding speech. Multiple voices and languages. Download audio as MP3. Perfect for content creation and accessibility.',
			keywords: [
				'text to speech',
				'tts',
				'text to audio',
				'voice generator',
				'speech synthesis',
				'audio converter'
			]
		},
		ru: {
			title: 'Текст в Речь - Озвучка Текста Онлайн | Бесплатно',
			description:
				'Конвертируйте текст в естественную речь. Множество голосов и языков. Скачивайте аудио в MP3. Для контента и доступности.',
			keywords: [
				'текст в речь',
				'озвучка текста',
				'синтез речи',
				'генератор голоса',
				'аудио конвертер'
			]
		}
	},
	'system-info': {
		en: {
			title: 'System Info - Device & Browser Information | Diagnostic Tool',
			description:
				'Check your system information including OS, browser, screen resolution, and hardware details. Useful for tech support and diagnostics.',
			keywords: [
				'system info',
				'device info',
				'browser info',
				'system diagnostics',
				'hardware info',
				'tech specs'
			]
		},
		ru: {
			title: 'Информация о Системе - Данные Устройства | Диагностика',
			description:
				'Проверьте информацию о системе: ОС, браузер, разрешение экрана и железо. Полезно для техподдержки и диагностики.',
			keywords: [
				'информация о системе',
				'данные устройства',
				'информация браузера',
				'диагностика системы'
			]
		}
	},
	'js-css-compressor': {
		en: {
			title: 'JS/CSS Compressor - Minify Code Online | Free Tool',
			description:
				'Compress JavaScript and CSS files to reduce size. Remove whitespace, comments, and optimize code. Improve website loading speed.',
			keywords: [
				'js compressor',
				'css compressor',
				'code minifier',
				'javascript minify',
				'css minify',
				'compress code'
			]
		},
		ru: {
			title: 'JS/CSS Компрессор - Минификация Кода | Бесплатно',
			description:
				'Сжимайте JavaScript и CSS файлы для уменьшения размера. Удаляйте пробелы, комментарии. Ускорьте загрузку сайта.',
			keywords: [
				'js компрессор',
				'css компрессор',
				'минификатор кода',
				'сжатие javascript',
				'минификация css'
			]
		}
	},
	'js-validator': {
		en: {
			title: 'JavaScript Validator - Syntax Checker | Free Code Tool',
			description:
				'Validate JavaScript code syntax online. Find errors, warnings, and potential issues. Support for ES6+ and JSX. Real-time error highlighting.',
			keywords: [
				'javascript validator',
				'js validator',
				'syntax checker',
				'code validator',
				'javascript linter',
				'error checker'
			]
		},
		ru: {
			title: 'Валидатор JavaScript - Проверка Синтаксиса | Бесплатно',
			description:
				'Валидируйте синтаксис JavaScript кода онлайн. Находите ошибки и предупреждения. Поддержка ES6+ и JSX. Подсветка ошибок.',
			keywords: [
				'валидатор javascript',
				'проверка js',
				'проверка синтаксиса',
				'валидатор кода',
				'javascript линтер'
			]
		}
	},
	'php-syntax-checker': {
		en: {
			title: 'PHP Syntax Checker - Validate PHP Code | Developer Tool',
			description:
				'Check PHP code syntax online without execution. Find syntax errors and parse issues. Support for PHP 5.6 to 8.x versions.',
			keywords: [
				'php syntax checker',
				'php validator',
				'php linter',
				'code checker',
				'php error checker',
				'syntax validation'
			]
		},
		ru: {
			title: 'Проверка Синтаксиса PHP - Валидатор Кода | Инструмент',
			description:
				'Проверяйте синтаксис PHP кода онлайн без выполнения. Находите синтаксические ошибки. Поддержка PHP 5.6 - 8.x.',
			keywords: [
				'проверка синтаксиса php',
				'валидатор php',
				'php линтер',
				'проверка кода',
				'проверка ошибок php'
			]
		}
	},
	'mysql-syntax-checker': {
		en: {
			title: 'MySQL Syntax Checker - SQL Query Validator | Free Tool',
			description:
				'Validate MySQL queries and SQL syntax online. Check for errors in SELECT, INSERT, UPDATE, DELETE statements. Format SQL code.',
			keywords: [
				'mysql syntax checker',
				'sql validator',
				'query checker',
				'mysql validator',
				'sql syntax',
				'query validator'
			]
		},
		ru: {
			title: 'Проверка Синтаксиса MySQL - Валидатор SQL | Бесплатно',
			description:
				'Валидируйте MySQL запросы и SQL синтаксис онлайн. Проверяйте ошибки в SELECT, INSERT, UPDATE, DELETE. Форматирование SQL.',
			keywords: [
				'проверка синтаксиса mysql',
				'валидатор sql',
				'проверка запросов',
				'mysql валидатор',
				'sql синтаксис'
			]
		}
	},
	'javascript-syntax-checker': {
		en: {
			title: 'JavaScript Syntax Checker - ES6+ Code Validator | Free',
			description:
				'Check JavaScript syntax with support for latest ES features. Real-time error detection, code hints, and best practice suggestions.',
			keywords: [
				'javascript syntax checker',
				'js syntax',
				'es6 validator',
				'code checker',
				'syntax validator',
				'javascript checker'
			]
		},
		ru: {
			title: 'Проверка Синтаксиса JavaScript - ES6+ Валидатор | Бесплатно',
			description:
				'Проверяйте синтаксис JavaScript с поддержкой последних ES функций. Обнаружение ошибок в реальном времени.',
			keywords: [
				'проверка синтаксиса javascript',
				'js синтаксис',
				'es6 валидатор',
				'проверка кода',
				'javascript проверка'
			]
		}
	},
	'px-rem-converter': {
		en: {
			title: 'PX to REM Converter - CSS Unit Calculator | Web Design Tool',
			description:
				'Convert pixels to rem units for responsive design. Calculate rem values based on root font size. Batch conversion with custom base size.',
			keywords: [
				'px to rem converter',
				'rem calculator',
				'css units',
				'pixel to rem',
				'responsive units',
				'font size converter'
			]
		},
		ru: {
			title: 'Конвертер PX в REM - Калькулятор CSS Единиц | Инструмент',
			description:
				'Конвертируйте пиксели в rem единицы для адаптивного дизайна. Рассчитывайте rem на основе базового размера шрифта.',
			keywords: [
				'конвертер px в rem',
				'калькулятор rem',
				'css единицы',
				'пиксели в rem',
				'адаптивные единицы'
			]
		}
	},
	'css-box-shadow-generator': {
		en: {
			title: 'CSS Box Shadow Generator - Visual Shadow Builder | Free Tool',
			description:
				'Create beautiful CSS box shadows visually. Adjust blur, spread, color, and position. Generate code for multiple shadows and inset effects.',
			keywords: [
				'box shadow generator',
				'css shadow',
				'shadow builder',
				'css generator',
				'box shadow css',
				'shadow effects'
			]
		},
		ru: {
			title: 'Генератор CSS Box Shadow - Визуальный Конструктор | Бесплатно',
			description:
				'Создавайте красивые CSS тени визуально. Настройте размытие, распространение, цвет. Генерируйте код для множественных теней.',
			keywords: [
				'генератор box shadow',
				'css тени',
				'конструктор теней',
				'генератор css',
				'тени блоков'
			]
		}
	},
	'css-gradient-generator': {
		en: {
			title: 'CSS Gradient Generator - Linear & Radial Gradients | Free',
			description:
				'Create stunning CSS gradients with visual editor. Generate linear, radial, and conic gradients. Export code with vendor prefixes.',
			keywords: [
				'css gradient generator',
				'gradient builder',
				'linear gradient',
				'radial gradient',
				'css backgrounds',
				'gradient tool'
			]
		},
		ru: {
			title: 'Генератор CSS Градиентов - Линейные и Радиальные | Бесплатно',
			description:
				'Создавайте потрясающие CSS градиенты с визуальным редактором. Линейные, радиальные и конические градиенты.',
			keywords: [
				'генератор css градиентов',
				'конструктор градиентов',
				'линейный градиент',
				'радиальный градиент'
			]
		}
	},
	'color-contrast-checker': {
		en: {
			title: 'Color Contrast Checker - WCAG Accessibility Tool | Free',
			description:
				'Check color contrast ratios for WCAG compliance. Test text and background colors for AA and AAA accessibility standards. Improve readability.',
			keywords: [
				'color contrast checker',
				'wcag contrast',
				'accessibility checker',
				'contrast ratio',
				'a11y tool',
				'readable colors'
			]
		},
		ru: {
			title: 'Проверка Контраста Цветов - WCAG Доступность | Бесплатно',
			description:
				'Проверяйте контраст цветов для соответствия WCAG. Тестируйте текст и фон для стандартов доступности AA и AAA.',
			keywords: [
				'проверка контраста',
				'wcag контраст',
				'доступность',
				'контрастность цветов',
				'читаемость'
			]
		}
	},
	'css-keyframes-generator': {
		en: {
			title: 'CSS Keyframes Generator - Animation Builder | Free Tool',
			description:
				'Create CSS @keyframes animations visually. Design complex animations with timeline editor. Export optimized animation code.',
			keywords: [
				'css keyframes generator',
				'animation builder',
				'css animations',
				'keyframe editor',
				'animation tool',
				'css motion'
			]
		},
		ru: {
			title: 'Генератор CSS Keyframes - Конструктор Анимаций | Бесплатно',
			description:
				'Создавайте CSS @keyframes анимации визуально. Проектируйте сложные анимации с редактором таймлайна.',
			keywords: [
				'генератор css keyframes',
				'конструктор анимаций',
				'css анимации',
				'редактор keyframe',
				'css движение'
			]
		}
	},
	'json-yaml-formatter': {
		en: {
			title: 'JSON/YAML Formatter - Convert & Validate | Developer Tool',
			description:
				'Format, validate, and convert between JSON and YAML. Syntax highlighting, error detection, and beautification. Perfect for configuration files.',
			keywords: [
				'json yaml formatter',
				'json to yaml',
				'yaml to json',
				'formatter tool',
				'config converter',
				'yaml validator'
			]
		},
		ru: {
			title: 'JSON/YAML Форматтер - Конвертер и Валидатор | Инструмент',
			description:
				'Форматируйте, валидируйте и конвертируйте между JSON и YAML. Подсветка синтаксиса и обнаружение ошибок.',
			keywords: [
				'json yaml форматтер',
				'json в yaml',
				'yaml в json',
				'конвертер конфигов',
				'yaml валидатор'
			]
		}
	},
	'analytics-dashboard': {
		en: {
			title: 'Analytics Dashboard - Website Stats Viewer | Free Tool',
			description:
				'View website analytics and statistics in one place. Track visitors, page views, and user behavior. Export reports and insights.',
			keywords: [
				'analytics dashboard',
				'website stats',
				'traffic analytics',
				'visitor tracking',
				'web analytics',
				'stats viewer'
			]
		},
		ru: {
			title: 'Аналитическая Панель - Статистика Сайта | Бесплатно',
			description:
				'Просматривайте аналитику и статистику сайта в одном месте. Отслеживайте посетителей и поведение. Экспорт отчётов.',
			keywords: [
				'аналитическая панель',
				'статистика сайта',
				'веб аналитика',
				'отслеживание трафика',
				'просмотр статистики'
			]
		}
	}
}
