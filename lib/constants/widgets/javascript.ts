import { Widget } from './index'
import {
	Braces,
	Bug,
	Code,
	FileJson,
	Search
} from 'lucide-react'

export const javascriptWidgets: Widget[] = [
	{
			id: 'json-tools',
			icon: Braces,
			category: 'javascript',
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
				},
				{
					question: 'Поддерживаются ли комментарии в JSON?',
					answer:
						'Стандартный JSON не поддерживает комментарии. Однако некоторые инструменты используют JSON5 или JSONC. Наш валидатор работает со стандартным JSON - удалите комментарии перед валидацией.'
				}
			]
		},
	{
			id: 'js-minifier',
			icon: Code,
			iconName: 'Code',
			category: 'javascript',
			translationKey: 'jsMinifier',
			path: 'js-minifier',
			gradient: 'from-blue-500 to-indigo-600',
			title: 'JavaScript Минификатор',
			description:
				'Оптимизируйте и сжимайте JavaScript код для лучшей производительности',
			useCase: 'Уменьшение размера JavaScript файлов для быстрой загрузки сайта',
			recommendedTools: ['css-minifier', 'json-tools', 'html-css-formatter'],
			difficulty: 'beginner',
			tags: [
				'minify',
				'javascript',
				'js',
				'optimization',
				'performance',
				'compress'
			],
			metaDescription:
				'JavaScript минификатор. Сжимайте и оптимизируйте JS код, уменьшайте размер файлов, улучшайте производительность сайта.',
			faqs: [
				{
					question: 'Что такое минификация JavaScript?',
					answer:
						'Минификация JavaScript удаляет ненужные символы: пробелы, комментарии и переносы строк. Также сокращает имена переменных для уменьшения размера файла при сохранении функциональности.'
				},
				{
					question: 'Безопасно ли использовать минифицированный JavaScript?',
					answer:
						'Да, при правильной минификации. Инструмент сохраняет функциональность кода, удаляя только ненужные элементы. Всегда тестируйте минифицированный код перед развёртыванием в продакшн.'
				},
				{
					question: 'Сколько места можно сэкономить?',
					answer:
						'Обычная экономия составляет 30-70% в зависимости от стиля кода. JavaScript с большим количеством комментариев может достичь большего сжатия, чем уже оптимизированный код.'
				},
				{
					question: 'Нужно ли минифицировать код в продакшне?',
					answer:
						'Да! Минификация критична для продакшна - она уменьшает размер файлов, ускоряет загрузку страниц и снижает использование трафика. Используйте оригинальные файлы для разработки, минифицированные для развёртывания.'
				},
				{
					question: 'Поддерживается ли современный синтаксис ES6+?',
					answer:
						'Да! Минификатор полностью поддерживает ES6+ синтаксис, включая стрелочные функции, async/await, деструктуризацию, классы и модули. Работает с современным JavaScript кодом.'
				}
			]
		},
	{
			id: 'js-validator',
			icon: Bug,
			category: 'javascript',
			translationKey: 'jsValidator',
			path: 'js-validator',
			gradient: 'from-red-500 to-pink-600',
			title: 'JavaScript валидатор',
			description: 'Найдите ошибки в JavaScript коде',
			useCase: 'Быстрая проверка JavaScript на ошибки',
			recommendedTools: ['js-minifier', 'json-tools', 'html-css-formatter'],
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
				},
				{
					question: 'Заменяет ли валидатор ESLint или TypeScript?',
					answer:
						'Нет, это инструмент для быстрой проверки синтаксиса. ESLint обеспечивает комплексный линтинг и проверку стиля, TypeScript добавляет типизацию. Используйте валидатор для быстрых проверок, профессиональные инструменты для проектов.'
				}
			]
		},
	{
			id: 'regex-tester',
			icon: Search,
			category: 'javascript',
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
			category: 'javascript',
			translationKey: 'javascriptSyntaxChecker',
			path: 'javascript-syntax-checker',
			gradient: 'from-yellow-500 to-red-600',
			title: 'JavaScript валидатор',
			description: 'Проверка синтаксиса JavaScript/ES6/ES2020+ с JSX',
			recommendedTools: ['json-tools', 'js-minifier', 'regex-tester'],
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
			id: 'json-yaml-formatter',
			icon: FileJson,
			category: 'javascript',
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
]
