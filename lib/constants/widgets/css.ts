import { Widget } from './index'
import {
	Box,
	Circle,
	Grid3X3,
	Hash,
	Layers,
	Palette,
	Ruler,
	Sparkles,
	Spline,
	Square
} from 'lucide-react'

export const cssWidgets: Widget[] = [
	{
		id: 'css-clamp-calculator',
		icon: Ruler,
		iconName: 'Ruler',
		category: 'css',
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
		category: 'css',
		translationKey: 'flexboxGenerator',
		path: 'flexbox-generator',
		gradient: 'from-blue-500 to-indigo-500',
		title: 'CSS Flexbox генератор',
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
		category: 'css',
		translationKey: 'gridGenerator',
		path: 'grid-generator',
		gradient: 'from-green-500 to-emerald-500',
		title: 'CSS Grid генератор',
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
			},
			{
				question: 'Как создать отзывчивый grid без медиа-запросов?',
				answer:
					'Используйте функции auto-fit и minmax(). Например: grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)) автоматически адаптирует количество столбцов под ширину экрана.'
			},
			{
				question: 'Поддерживают ли все браузеры CSS Grid?',
				answer:
					'Да! CSS Grid поддерживается всеми современными браузерами (Chrome 57+, Firefox 52+, Safari 10.1+, Edge 16+). Для старых браузеров используйте Flexbox как fallback.'
			}
		]
	},
	{
		id: 'css-specificity',
		icon: Hash,
		category: 'css',
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
			},
			{
				question: 'Что делает !important и когда его использовать?',
				answer:
					'!important переопределяет все правила специфичности и должен использоваться редко. Применяйте только для utility-классов или переопределения сторонних библиотек. Злоупотребление усложняет поддержку кода.'
			},
			{
				question: 'Как избежать войн специфичности в больших проектах?',
				answer:
					'Используйте методологии БЭМ или CSS-in-JS, избегайте ID селекторов в стилях, применяйте низкую специфичность для базовых стилей, документируйте переопределения.'
			}
		]
	},
	{
		id: 'bezier-curve',
		icon: Spline,
		category: 'css',
		translationKey: 'bezierCurve',
		path: 'css-bezier-curve-generator',
		gradient: 'from-purple-500 to-indigo-500',
		title: 'CSS Cubic-bezier генератор',
		description:
			'Создавайте пользовательские функции плавности cubic-bezier для CSS анимаций',
		useCase: 'Создание пользовательских функций плавности для CSS анимаций',
		recommendedTools: [
			'css-clamp-calculator',
			'flexbox-generator',
			'css-keyframes'
		],
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
			},
			{
				question: 'Можно ли использовать cubic-bezier для переходов?',
				answer:
					'Да! Функцию cubic-bezier можно использовать как с CSS transitions, так и с CSS animations. Она работает со свойствами transition-timing-function и animation-timing-function.'
			},
			{
				question: 'Как создать эффект отскока с cubic-bezier?',
				answer:
					'Для эффекта отскока используйте значения за пределами диапазона 0-1, например cubic-bezier(0.68, -0.55, 0.265, 1.55). Отрицательные значения создают "провал" перед анимацией, значения больше 1 создают "перелёт".'
			}
		]
	},
	{
		id: 'color-converter',
		icon: Palette,
		category: 'css',
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
			},
			{
				question: 'Когда использовать HSL вместо RGB?',
				answer:
					'HSL (Hue, Saturation, Lightness) интуитивнее для регулировки цветов - легко создать светлее/темнее варианты, изменяя только Lightness. RGB лучше для точного математического управления.'
			},
			{
				question: 'Зачем нужен формат LAB?',
				answer:
					'LAB разработан для восприятия человеком - расстояния в LAB соответствуют визуальным различиям. Идеален для алгоритмов подбора цветов, градиентов и доступности (контраст WCAG).'
			}
		]
	},
	{
		id: 'css-minifier',
		icon: Palette,
		iconName: 'Palette',
		category: 'css',
		translationKey: 'cssMinifier',
		path: 'css-minifier',
		gradient: 'from-pink-500 to-purple-600',
		title: 'CSS Минификатор',
		description:
			'Оптимизируйте и сжимайте CSS файлы для лучшей производительности',
		useCase: 'Уменьшение размера CSS файлов для быстрой загрузки сайта',
		recommendedTools: ['js-minifier', 'html-css-formatter', 'base64-converter'],
		difficulty: 'beginner',
		tags: [
			'minify',
			'css',
			'styles',
			'optimization',
			'performance',
			'compress'
		],
		metaDescription:
			'CSS минификатор. Сжимайте и оптимизируйте таблицы стилей, уменьшайте размер файлов, улучшайте производительность сайта.',
		faqs: [
			{
				question: 'Что такое минификация CSS?',
				answer:
					'Минификация CSS удаляет ненужные символы: пробелы, комментарии и переносы строк. Также оптимизирует коды цветов, единицы измерения и сокращённые свойства для уменьшения размера файла.'
			},
			{
				question: 'Как работает минификация CSS?',
				answer:
					'Минификатор удаляет комментарии, сжимает пробелы, сокращает коды цветов (#ffffff → #fff), удаляет единицы из нулевых значений (0px → 0) и оптимизирует сокращённые свойства.'
			},
			{
				question: 'Сломает ли минификация мои стили?',
				answer:
					'Нет, правильная минификация сохраняет всю функциональность CSS. Инструмент удаляет только ненужные элементы и оптимизирует значения без изменения поведения стилей.'
			},
			{
				question: 'Насколько меньше станет мой CSS?',
				answer:
					'Обычная экономия составляет 20-60% в зависимости от стиля кода. CSS с большим количеством комментариев и отступов может достичь более высокой степени сжатия.'
			},
			{
				question: 'Поддерживает ли минификатор современный CSS?',
				answer:
					'Да! Минификатор поддерживает современные CSS возможности, включая CSS Grid, Flexbox, переменные (custom properties), calc(), медиа-запросы и все современные селекторы и свойства.'
			}
		]
	},
	{
		id: 'px-rem-converter',
		icon: Ruler,
		category: 'css',
		translationKey: 'pxRemConverter',
		path: 'px-rem-converter',
		gradient: 'from-pink-500 to-rose-600',
		title: 'Конвертер единиц CSS',
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
		category: 'css',
		translationKey: 'cssBoxShadow',
		path: 'css-box-shadow-generator',
		gradient: 'from-gray-600 to-gray-800',
		title: 'CSS Box-shadow генератор теней',
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
		category: 'css',
		translationKey: 'cssGradient',
		path: 'css-gradient-generator',
		gradient: 'from-purple-500 via-pink-500 to-red-500',
		title: 'CSS Gradient генератор',
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
		category: 'css',
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
		category: 'css',
		translationKey: 'cssKeyframes',
		path: 'css-keyframes-generator',
		gradient: 'from-blue-500 to-purple-600',
		title: 'CSS Keyframes анимации',
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
	}
]
