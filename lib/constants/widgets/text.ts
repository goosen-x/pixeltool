import { Widget } from './index'
import { FileSearch, GitCompare, Smile, Type, Volume2 } from 'lucide-react'

export const textWidgets: Widget[] = [
	{
		id: 'special-symbols-picker',
		icon: Type,
		category: 'text',
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
			},
			{
				question: 'Какие категории символов доступны?',
				answer:
					'Математические (∑ ∫ ∞), стрелки (→ ⇒ ↔), валюты (€ ₽ ¥), геометрические фигуры (★ ♦ ●), греческие буквы (α β γ), дроби (½ ¼), пунктуация (• § †) и многое другое.'
			},
			{
				question: 'Можно ли использовать в паролях?',
				answer:
					'Технически да, но не рекомендуется. Многие сайты ограничивают набор символов в паролях до ASCII. Лучше используйте символы вроде !@#$% из стандартной клавиатуры.'
			}
		]
	},
	{
		id: 'fancy-text-generator',
		icon: Type,
		category: 'text',
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
			},
			{
				question: 'Работает ли стилизованный текст в SEO?',
				answer:
					'Поисковики индексируют Unicode-символы, но чрезмерное использование fancy text может выглядеть как спам. Используйте экономно в заголовках или для выделения, не злоупотребляйте в контенте.'
			},
			{
				question: 'Можно ли скопировать текст обратно в обычный?',
				answer:
					'Нет автоматического способа конвертировать обратно - Unicode символы не хранят информацию об оригинальном тексте. Сохраните оригинал отдельно если планируете редактирование.'
			}
		]
	},
	{
		id: 'text-case-converter',
		icon: Type,
		category: 'text',
		translationKey: 'textCaseConverter',
		path: 'text-case-converter',
		gradient: 'from-indigo-500 to-purple-600',
		title: 'Конвертер регистра текста',
		description:
			'Конвертируйте текст в различные форматы регистра одним кликом',
		useCase: 'Изменение регистра текста для заголовков, кода или стилизации',
		recommendedTools: [
			'text-counter',
			'fancy-text-generator',
			'special-symbols-picker'
		],
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
		id: 'emoji-list',
		icon: Smile,
		category: 'text',
		translationKey: 'emojiList',
		path: 'emoji-list',
		gradient: 'from-yellow-400 to-orange-500',
		title: 'Список эмодзи',
		description: 'Просмотрите и скопируйте 1800+ эмодзи по категориям',
		recommendedTools: [
			'special-symbols-picker',
			'fancy-text-generator',
			'text-emoticons'
		],
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
			},
			{
				question: 'Что такое вариации эмодзи с оттенками кожи?',
				answer:
					'Многие эмодзи людей поддерживают модификаторы оттенков кожи (5 вариантов от светлого до темного). Выберите базовый эмодзи и примените нужный оттенок, если поддерживается.'
			}
		]
	},
	{
		id: 'text-emoticons',
		icon: Type,
		category: 'text',
		translationKey: 'textEmoticons',
		path: 'text-emoticons',
		gradient: 'from-purple-500 to-pink-600',
		title: 'Текстовые эмотиконы',
		description: 'ASCII смайлики и японские каомодзи для чатов',
		recommendedTools: [
			'emoji-list',
			'special-symbols-picker',
			'fancy-text-generator'
		],
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
			},
			{
				question: 'Кто изобрёл первый эмотикон?',
				answer:
					'Первый документированный эмотикон :-) создал Scott Fahlman 19 сентября 1982 года на доске объявлений Carnegie Mellon University, предложив использовать его для обозначения шуток.'
			}
		]
	},
	{
		id: 'text-to-speech',
		icon: Volume2,
		category: 'text',
		translationKey: 'textToSpeech',
		path: 'text-to-speech',
		gradient: 'from-green-500 to-teal-600',
		title: 'Текст в речь',
		description: 'Превращайте текст в речь с разными голосами',
		recommendedTools: [
			'special-symbols-picker',
			'fancy-text-generator',
			'emoji-list'
		],
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
			},
			{
				question: 'Для чего используется TTS в доступности?',
				answer:
					'Text-to-Speech критически важен для людей с нарушениями зрения или дислексией, позволяя им воспринимать письменный контент через слух. Также помогает в обучении и многозадачности.'
			}
		]
	},
	{
		id: 'text-counter',
		icon: FileSearch,
		category: 'text',
		translationKey: 'textCounter',
		path: 'text-counter',
		gradient: 'from-indigo-500 to-purple-600',
		title: 'Счётчик текста',
		description: 'Подсчитайте слова, символы, абзацы и время чтения мгновенно',
		useCase: 'Анализ длины текста для соцсетей, статей или эссе',
		recommendedTools: [
			'text-to-speech',
			'fancy-text-generator',
			'text-case-converter'
		],
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
		id: 'text-diff',
		icon: GitCompare,
		category: 'text',
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
	}
]
