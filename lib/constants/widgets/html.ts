import { Widget } from './index'
import {
	Code,
	FileImage,
	GitBranch,
	Globe
} from 'lucide-react'
import { MarkdownIcon } from '@/components/icons/MarkdownIcon'

export const htmlWidgets: Widget[] = [
	{
			id: 'html-tree',
			icon: GitBranch,
			category: 'html',
			translationKey: 'htmlTree',
			path: 'html-tree-visualizer',
			gradient: 'from-purple-500 to-indigo-500',
			title: 'HTML древо визуализатор',
			description: 'Визуализируйте HTML структуру в виде дерева с валидацией БЭМ',
			useCase: 'Визуализация HTML структуры и валидация БЭМ соглашений',
			recommendedTools: ['css-specificity', 'html-tree', 'flexbox-generator'],
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
				},
				{
					question: 'Полезен ли визуализатор для аудита доступности?',
					answer:
						'Да! Древовидная структура помогает проверить семантическую вложенность (nav внутри header, section содержит заголовки), правильное использование ARIA-атрибутов и логический порядок документа для скринридеров.'
				},
				{
					question: 'Можно ли использовать с React/Vue компонентами?',
					answer:
						'Да! Вставьте отрендеренный HTML из инспектора браузера (Dev Tools). Визуализатор работает с любым HTML, включая вывод JSX/Vue templates. Особенно полезен для сложных компонентных структур.'
				}
			]
		},
	{
			id: 'seo-markdown-generator',
			icon: MarkdownIcon,
			category: 'html',
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
			id: 'html-xml-parser',
			icon: Code,
			category: 'html',
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
			id: 'favicon-generator',
			icon: FileImage,
			category: 'html',
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
				},
				{
					question: 'Нужны ли разные размеры для разных устройств?',
					answer:
						'Да! Разные устройства и платформы используют разные размеры: браузеры (16x16, 32x32), iOS (120x120, 180x180), Android (192x192, 512x512). Полный набор обеспечивает правильное отображение везде.'
				}
			]
		},
	{
			id: 'opengraph-validator',
			path: 'opengraph-validator',
			translationKey: 'openGraphValidator',
			icon: Globe,
			gradient: 'from-blue-500 to-purple-600',
			category: 'html',
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
				},
				{
					question: 'Какой размер изображения og:image рекомендуется?',
					answer:
						'Рекомендуется 1200x630px (соотношение 1.91:1). Минимум 600x315px. Facebook, LinkedIn и Twitter используют это соотношение. Файл до 8МБ, форматы JPG, PNG или GIF.'
				},
				{
					question: 'Почему Facebook показывает старое превью после обновления?',
					answer:
						'Facebook кэширует Open Graph данные. Используйте Facebook Sharing Debugger (developers.facebook.com/tools/debug) для очистки кэша и обновления превью. Для Twitter используйте Card Validator.'
				}
			]
		}
]
