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
	faqs?: {
		en: WidgetFAQ[]
		ru: WidgetFAQ[]
		he?: WidgetFAQ[]
	}
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
		faqs: {
			en: [
				{
					question: 'What is CSS clamp() function?',
					answer:
						'CSS clamp() function allows you to set a value that scales between a minimum and maximum, perfect for responsive typography.'
				},
				{
					question: 'How do I calculate the ideal values?',
					answer:
						'Input your minimum and maximum font sizes along with viewport widths. The calculator handles the complex math for you.'
				},
				{
					question: 'When should I use clamp() instead of media queries?',
					answer:
						'Use clamp() for smooth, fluid scaling between viewport sizes. Media queries are better for abrupt changes at specific breakpoints or layout changes.'
				},
				{
					question: 'What units can I use with clamp()?',
					answer:
						'You can use any CSS unit with clamp(): rem, em, px, vw, vh, %, etc. The calculator supports both px and rem units, automatically converting between them using the standard 16px base.'
				},
				{
					question: 'How do I test my clamp() values?',
					answer:
						'Use browser developer tools to resize your viewport and see how the values scale. The live preview in this calculator shows how your text will look at different viewport sizes.'
				}
			],
			ru: [
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
		}
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
		faqs: {
			en: [
				{
					question: 'What is CSS Flexbox?',
					answer:
						'Flexbox is a CSS layout model that allows you to arrange elements in a flexible container with powerful alignment options.'
				},
				{
					question: 'When should I use Flexbox instead of Grid?',
					answer:
						'Use Flexbox for one-dimensional layouts (row or column) and Grid for two-dimensional layouts. Flexbox is perfect for navigation bars, card layouts, and centering content.'
				},
				{
					question: 'How do I center content with Flexbox?',
					answer:
						'Set justify-content: center for horizontal centering and align-items: center for vertical centering on the flex container.'
				},
				{
					question: 'Can I nest Flexbox containers?',
					answer:
						'Yes, you can nest Flexbox containers to create complex layouts. Each child can also be a flex container with its own rules.'
				},
				{
					question: 'What are the main Flexbox properties?',
					answer:
						'Some key properties include display: flex, flex-direction, justify-content, align-items, flex-wrap, and align-self.'
				}
			],
			ru: [
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
		}
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
		faqs: {
			en: [
				{
					question: 'What is CSS Grid?',
					answer:
						'CSS Grid is a powerful layout system that allows you to create two-dimensional layouts with rows and columns.'
				},
				{
					question: 'How is Grid different from Flexbox?',
					answer:
						'Grid is for two-dimensional layouts (both rows and columns), while Flexbox is for one-dimensional layouts. Grid gives you more control over complex layouts.'
				},
				{
					question: 'What are fr units in CSS Grid?',
					answer:
						'The fr unit represents a fraction of available space in the grid container. For example, 1fr 2fr creates two columns where the second is twice as wide as the first.'
				}
			],
			ru: [
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
			],
			he: [
				{
					question: 'מה זה CSS Grid?',
					answer:
						'CSS Grid היא מערכת פריסה חזקה המאפשרת ליצור פריסות דו-ממדיות עם שורות ועמודות.'
				},
				{
					question: 'במה Grid שונה מ-Flexbox?',
					answer:
						'Grid מיועד לפריסות דו-ממדיות (שורות ועמודות), בעוד Flexbox לפריסות חד-ממדיות. Grid נותן יותר שליטה על פריסות מורכבות.'
				},
				{
					question: 'מה הן יחידות fr ב-CSS Grid?',
					answer:
						'יחידת fr מייצגת חלק מהמרחב הזמין במכל ה-grid. לדוגמה, 1fr 2fr יוצר שתי עמודות כאשר השנייה רחבה פי שניים מהראשונה.'
				}
			]
		}
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
		faqs: {
			en: [
				{
					question: 'What is CSS specificity?',
					answer:
						"CSS specificity determines which styles are applied when multiple rules target the same element. It's calculated based on the types of selectors used."
				},
				{
					question: 'How is specificity calculated?',
					answer:
						'Specificity is calculated as (inline styles, IDs, classes/attributes/pseudo-classes, elements). For example, #header .nav has specificity 0-1-1-0.'
				},
				{
					question: 'Why is my CSS not working?',
					answer:
						"Often it's due to specificity conflicts. A more specific selector will override less specific ones, regardless of order in your CSS file."
				}
			],
			ru: [
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
			],
			he: [
				{
					question: 'מהי ספציפיות CSS?',
					answer:
						'ספציפיות CSS קובעת אילו סגנונות מוחלים כאשר מספר כללים מכוונים לאותו אלמנט. היא מחושבת על סמך סוגי הסלקטורים בשימוש.'
				},
				{
					question: 'איך מחשבים ספציפיות?',
					answer:
						'ספציפיות מחושבת כ-(סגנונות inline, IDs, מחלקות/תכונות/pseudo-classes, אלמנטים). לדוגמה, #header .nav בעל ספציפיות 0-1-1-0.'
				},
				{
					question: 'למה ה-CSS שלי לא עובד?',
					answer:
						'לעתים קרובות זה בגלל קונפליקטים בספציפיות. סלקטור ספציפי יותר יעקוף פחות ספציפיים, ללא קשר לסדר בקובץ CSS.'
				}
			]
		}
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
		faqs: {
			en: [
				{
					question: 'What is a cubic-bezier function?',
					answer:
						'A cubic-bezier function defines custom easing for CSS transitions and animations, controlling the speed curve of the animation.'
				},
				{
					question: 'How do the control points work?',
					answer:
						'The two control points (P1 and P2) define the curve shape. P1 controls the start acceleration, P2 controls the end deceleration.'
				},
				{
					question: 'What are common easing functions?',
					answer:
						'Common easings include ease (default), ease-in (slow start), ease-out (slow end), ease-in-out (slow start and end), and linear (constant speed).'
				}
			],
			ru: [
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
			],
			he: [
				{
					question: 'מהי פונקציית cubic-bezier?',
					answer:
						'פונקציית cubic-bezier מגדירה האטה מותאמת אישית למעברים ואנימציות CSS, תוך שליטה בעקומת המהירות של האנימציה.'
				},
				{
					question: 'איך עובדות נקודות הבקרה?',
					answer:
						'שתי נקודות הבקרה (P1 ו-P2) מגדירות את צורת העקומה. P1 שולטת בתאוצה ההתחלתית, P2 שולטת בהאטה הסופית.'
				},
				{
					question: 'מהן פונקציות האטה נפוצות?',
					answer:
						'פונקציות נפוצות כוללות ease (ברירת מחדל), ease-in (התחלה איטית), ease-out (סוף איטי), ease-in-out (התחלה וסוף איטיים), ו-linear (מהירות קבועה).'
				}
			]
		}
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
		faqs: {
			en: [
				{
					question: 'What is SVG encoding?',
					answer:
						'SVG encoding converts SVG files into data URLs that can be embedded directly in CSS, eliminating the need for external files.'
				},
				{
					question: 'When should I use encoded SVGs?',
					answer:
						'Use encoded SVGs for small icons and decorative elements in CSS to reduce HTTP requests and improve page load speed.'
				},
				{
					question: 'What are the limitations?',
					answer:
						'Encoded SVGs increase CSS file size. Best for small graphics under 5KB. Larger files should remain external.'
				}
			],
			ru: [
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
			],
			he: [
				{
					question: 'מהו קידוד SVG?',
					answer:
						'קידוד SVG ממיר קבצי SVG ל-data URLs שניתן להטמיע ישירות ב-CSS, מבלי צורך בקבצים חיצוניים.'
				},
				{
					question: 'מתי להשתמש ב-SVG מקודדים?',
					answer:
						'השתמש ב-SVG מקודדים לאייקונים קטנים ואלמנטים דקורטיביים ב-CSS כדי להפחית בקשות HTTP ולשפר מהירות טעינה.'
				},
				{
					question: 'מהן המגבלות?',
					answer:
						'SVG מקודדים מגדילים את גודל קובץ ה-CSS. מומלץ לגרפיקה מתחת ל-5KB. קבצים גדולים צריכים להישאר חיצוניים.'
				}
			]
		}
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
		faqs: {
			en: [
				{
					question: 'What resolutions are available?',
					answer:
						'YouTube provides thumbnails in multiple resolutions: default (120x90), medium (320x180), high (480x360), standard (640x480), and maxres (1280x720).'
				},
				{
					question: 'Can I download thumbnails from any YouTube video?',
					answer:
						"Yes, as long as the video is public. Private or deleted videos won't have accessible thumbnails."
				},
				{
					question: 'Is this legal to use?',
					answer:
						'Thumbnails are publicly accessible. However, respect copyright and fair use when using them in your projects.'
				}
			],
			ru: [
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
			],
			he: [
				{
					question: 'אילו רזולוציות זמינות?',
					answer:
						'YouTube מספק תמונות ממוזערות במספר רזולוציות: default (120x90), medium (320x180), high (480x360), standard (640x480), ו-maxres (1280x720).'
				},
				{
					question: 'האם אפשר להוריד תמונות מכל סרטון YouTube?',
					answer:
						'כן, כל עוד הסרטון ציבורי. סרטונים פרטיים או מחוקים לא יהיו עם תמונות זמינות.'
				},
				{
					question: 'האם זה חוקי להשתמש?',
					answer:
						'התמונות נגישות לציבור. עם זאת, כבד זכויות יוצרים ושימוש הוגן בעת השימוש בהן בפרויקטים שלך.'
				}
			]
		}
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
		faqs: {
			en: [
				{
					question: 'What can I encode in a QR code?',
					answer:
						'You can encode URLs, text, WiFi credentials, email addresses, phone numbers, SMS messages, and app store links.'
				},
				{
					question: 'How do I scan QR codes?',
					answer:
						'Most modern smartphones can scan QR codes using the built-in camera app. Just point and tap the notification that appears.'
				},
				{
					question: "What's the maximum data capacity?",
					answer:
						'QR codes can store up to 7,089 numeric or 4,296 alphanumeric characters. For best scanning, keep content under 300 characters.'
				}
			],
			ru: [
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
			],
			he: [
				{
					question: 'מה אפשר לקדד בקוד QR?',
					answer:
						'אפשר לקדד כתובות URL, טקסט, פרטי WiFi, כתובות אימייל, מספרי טלפון, הודעות SMS וקישורים לחנויות אפליקציות.'
				},
				{
					question: 'איך סורקים קודי QR?',
					answer:
						'רוב הסמארטפונים המודרניים יכולים לסרוק קודי QR באמצעות אפליקציית המצלמה המובנית. פשוט כוונו והקישו על ההתראה.'
				},
				{
					question: 'מהי הקיבולת המקסימלית?',
					answer:
						'קודי QR יכולים לאחסן עד 7,089 ספרות או 4,296 תווים אלפאנומריים. לסריקה טובה יותר, השתמשו בפחות מ-300 תווים.'
				}
			]
		}
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
		faqs: {
			en: [
				{
					question: 'What color formats are supported?',
					answer:
						'The converter supports HEX, RGB, RGBA, HSL, HSLA, CMYK, LAB, and XYZ color formats with seamless conversion between them.'
				},
				{
					question: 'How accurate are the conversions?',
					answer:
						'Conversions use industry-standard algorithms. Note that some formats like CMYK may vary slightly depending on color profiles.'
				},
				{
					question: 'Can I convert transparent colors?',
					answer:
						'Yes! RGBA and HSLA formats support alpha transparency. The converter preserves transparency values during conversion.'
				}
			],
			ru: [
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
			],
			he: [
				{
					question: 'אילו פורמטים של צבעים נתמכים?',
					answer:
						'הממיר תומך בפורמטים HEX, RGB, RGBA, HSL, HSLA, CMYK, LAB ו-XYZ עם המרה חלקה ביניהם.'
				},
				{
					question: 'עד כמה ההמרות מדויקות?',
					answer:
						'ההמרות משתמשות באלגוריתמים סטנדרטיים בתעשייה. שימו לב שפורמטים כמו CMYK עשויים להשתנות מעט בהתאם לפרופילי צבע.'
				},
				{
					question: 'האם אפשר להמיר צבעים שקופים?',
					answer:
						'כן! פורמטים RGBA ו-HSLA תומכים בשקיפות אלפא. הממיר שומר על ערכי השקיפות במהלך ההמרה.'
				}
			]
		}
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
		faqs: {
			en: [
				{
					question: 'What is BEM methodology?',
					answer:
						'BEM (Block Element Modifier) is a naming convention for CSS classes that makes code more maintainable. It uses the pattern: block__element--modifier.'
				},
				{
					question: 'How does the HTML tree help?',
					answer:
						'The tree visualizer shows your HTML structure hierarchically, making it easy to spot nesting issues, missing closing tags, and validate BEM naming patterns.'
				},
				{
					question: 'What BEM violations does it detect?',
					answer:
						'It detects incorrect BEM syntax, nested blocks, orphaned elements, and modifier misuse, helping maintain consistent naming conventions.'
				}
			],
			ru: [
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
			],
			he: [
				{
					question: 'מהי מתודולוגיית BEM?',
					answer:
						'BEM (Block Element Modifier) היא קונבנציית שמות למחלקות CSS שהופכת קוד לניתן יותר לתחזוקה. היא משתמשת בדפוס: block__element--modifier.'
				},
				{
					question: 'איך עץ ה-HTML עוזר?',
					answer:
						'מציג העץ מראה את מבנה ה-HTML בצורה היררכית, מקל על זיהוי בעיות קינון, תגיות חסרות ואימות דפוסי BEM.'
				},
				{
					question: 'אילו הפרות BEM הוא מזהה?',
					answer:
						'מזהה תחביר BEM שגוי, בלוקים מקוננים, אלמנטים יתומים ושימוש לא נכון במודификаторים, עוזר לשמור על קונבנציות עקביות.'
				}
			]
		}
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
		faqs: {
			en: [
				{
					question: 'How does the speed test work?',
					answer:
						'The test downloads and uploads data chunks to measure throughput, then calculates latency by timing server responses. Results show real-world connection performance.'
				},
				{
					question: 'What affects internet speed?',
					answer:
						'Speed is affected by your ISP plan, network congestion, WiFi signal strength, device capabilities, and distance from servers. Wired connections typically perform better than WiFi.'
				},
				{
					question: 'What speeds do I need?',
					answer:
						'Basic browsing needs 5-10 Mbps, HD streaming requires 25 Mbps, 4K streaming needs 50+ Mbps, and online gaming benefits from low latency more than high bandwidth.'
				}
			],
			ru: [
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
			],
			he: [
				{
					question: 'איך בדיקת המהירות עובדת?',
					answer:
						'הבדיקה מורידה ומעלה נתונים למדידת תפוקה, ואז מחשבת השהיה על ידי מדידת זמני תגובה של השרת. התוצאות מראות ביצועי חיבור אמיתיים.'
				},
				{
					question: 'מה משפיע על מהירות האינטרנט?',
					answer:
						'המהירות מושפעת מתוכנית הספק, עומס רשת, עוצמת אות WiFi, יכולות המכשיר ומרחק מהשרתים. חיבורים קוויים בדרך כלל מהירים מ-WiFi.'
				},
				{
					question: 'איזו מהירות אני צריך?',
					answer:
						'גלישה בסיסית צריכה 5-10 Mbps, סטרימינג HD דורש 25 Mbps, סטרימינג 4K צריך 50+ Mbps, ומשחקים אונליין נהנים יותר מהשהיה נמוכה מאשר רוחב פס גבוה.'
				}
			]
		}
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
		faqs: {
			en: [
				{
					question: 'What APIs are included?',
					answer:
						'Popular free APIs like JSONPlaceholder, RandomUser, FakeStore API, PokeAPI, and more. All are CORS-enabled and require no authentication.'
				},
				{
					question: 'Can I use this data in production?',
					answer:
						"These APIs provide mock data for testing and development. For production, you should use your own data sources or check each API's terms of service."
				},
				{
					question: 'Are there rate limits?',
					answer:
						'Most APIs have generous or unlimited rate limits for basic usage. Specific limits are shown for each API endpoint.'
				}
			],
			ru: [
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
			],
			he: [
				{
					question: 'אילו APIs כלולים?',
					answer:
						'APIs חינמיים פופולריים כמו JSONPlaceholder, RandomUser, FakeStore API, PokeAPI ועוד. כולם תומכים ב-CORS ולא דורשים אימות.'
				},
				{
					question: 'האם אפשר להשתמש בנתונים האלה בייצור?',
					answer:
						'ה-APIs האלה מספקים נתוני דמה לבדיקות ופיתוח. לייצור, השתמשו במקורות נתונים משלכם או בדקו את תנאי השימוש של כל API.'
				},
				{
					question: 'האם יש מגבלות קצב?',
					answer:
						'לרוב ה-APIs יש מגבלות נדיבות או בלתי מוגבלות לשימוש בסיסי. מגבלות ספציפיות מוצגות לכל נקודת קצה של API.'
				}
			]
		}
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
		faqs: {
			en: [
				{
					question: 'What makes a password strong?',
					answer:
						'Strong passwords are at least 12 characters long, use a mix of uppercase, lowercase, numbers, and symbols, and avoid common words or patterns.'
				},
				{
					question: 'How are passwords generated?',
					answer:
						'The generator uses cryptographically secure random number generation to ensure true randomness, making passwords extremely difficult to predict or crack.'
				},
				{
					question: 'Should I use the same password everywhere?',
					answer:
						'Never! Use unique passwords for each account. Consider using a password manager to securely store all your different passwords.'
				}
			],
			ru: [
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
			],
			he: [
				{
					question: 'מה הופך סיסמה לחזקה?',
					answer:
						'סיסמאות חזקות הן באורך של לפחות 12 תווים, משתמשות בשילוב של אותיות גדולות, קטנות, מספרים וסמלים, ונמנעות ממילים או דפוסים נפוצים.'
				},
				{
					question: 'איך נוצרות הסיסמאות?',
					answer:
						'המחולל משתמש ביצירת מספרים אקראיים מאובטחת קריפטוגרפית להבטחת אקראיות אמיתית, מה שהופך סיסמאות לקשות מאוד לניחוש או לפיצוח.'
				},
				{
					question: 'האם להשתמש באותה סיסמה בכל מקום?',
					answer:
						'לעולם לא! השתמשו בסיסמאות ייחודיות לכל חשבון. שקלו להשתמש במנהל סיסמאות לאחסון מאובטח של כל הסיסמאות השונות שלכם.'
				}
			]
		}
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
		faqs: {
			en: [
				{
					question: 'What are UTM parameters and why use them?',
					answer:
						'UTM parameters are tags added to URLs that help track the effectiveness of marketing campaigns in Google Analytics by identifying traffic sources, mediums, and campaigns.'
				},
				{
					question: "What's the difference between utm_source and utm_medium?",
					answer:
						'utm_source identifies where traffic originates (google, facebook, newsletter), while utm_medium identifies the marketing medium (cpc, social, email).'
				},
				{
					question: 'Are UTM parameters case-sensitive?',
					answer:
						'Yes! Use consistent lowercase naming to avoid duplicate entries in analytics. "Email" and "email" are treated as separate sources.'
				},
				{
					question: 'How do I track UTM performance in Google Analytics?',
					answer:
						'Go to Acquisition > Campaigns > All Campaigns in Google Analytics to see detailed performance data for your UTM-tagged campaigns.'
				},
				{
					question: 'Should I use UTM parameters for internal links?',
					answer:
						'No, avoid UTM parameters on internal links as they can reset session data and create inaccurate analytics reports within your website.'
				}
			],
			ru: [
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
					question:
						'Как отслеживать производительность UTM в Google Analytics?',
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
		}
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
		faqs: {
			en: [
				{
					question: 'What is SEO markdown and why is it important?',
					answer:
						'SEO markdown includes metadata like title tags, descriptions, and structured data that help search engines understand and rank your content better.'
				},
				{
					question: 'What metadata fields should I include?',
					answer:
						'Essential fields include title, description, keywords, author, publish date, and Open Graph tags for social media sharing.'
				},
				{
					question: 'How do I optimize for featured snippets?',
					answer:
						'Use proper heading structure (H1-H6), include FAQ sections, create numbered lists, and answer common questions concisely.'
				},
				{
					question: 'Can I use this for different CMS platforms?',
					answer:
						'Yes! The generated markdown works with Jekyll, Hugo, Gatsby, Next.js, and most static site generators that support frontmatter.'
				},
				{
					question: "What's the ideal description length?",
					answer:
						'Keep meta descriptions between 150-160 characters for optimal display in search results without truncation.'
				}
			],
			ru: [
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
		}
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
		faqs: {
			en: [
				{
					question: 'How does the random distribution work?',
					answer:
						'The tool uses a Fisher-Yates shuffle algorithm to ensure truly random and fair team distribution, preventing bias in team selection.'
				},
				{
					question: 'Can I create uneven teams?',
					answer:
						'Yes! The tool handles remainder members by distributing them as evenly as possible across teams, ensuring no team is significantly larger.'
				},
				{
					question: "What's the maximum number of people?",
					answer:
						'The tool can handle hundreds of participants efficiently. For best results, keep individual names under 50 characters.'
				}
			],
			ru: [
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
			],
			he: [
				{
					question: 'איך עובד החלוקה האקראית?',
					answer:
						'הכלי משתמש באלגוריתם ערבוב פישר-יטס להבטחת חלוקת צוותים אקראית והוגנת באמת, למניעת הטיה בבחירת הצוותים.'
				},
				{
					question: 'האם אפשר ליצור צוותים לא שווים?',
					answer:
						'כן! הכלי מטפל בחברים הנותרים על ידי חלוקתם בצורה שווה ככל האפשר בין הצוותים, מבטיח שאף צוות לא יהיה גדול משמעותית.'
				},
				{
					question: 'מה המספר המקסימלי של אנשים?',
					answer:
						'הכלי יכול לטפל במאות משתתפים ביעילות. לתוצאות טובות יותר, שמרו על שמות עד 50 תווים.'
				}
			]
		}
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
		faqs: {
			en: [
				{
					question: 'How does the draw lots system work?',
					answer:
						'Items are converted into cards and shuffled using the Fisher-Yates algorithm. You can then click any card to reveal your random selection.'
				},
				{
					question: 'Can I draw multiple lots?',
					answer:
						'No, only one card can be selected per draw to ensure fairness. Reset and draw again for multiple selections.'
				},
				{
					question: 'Is this truly random?',
					answer:
						'Yes! The Fisher-Yates shuffle algorithm provides mathematically proven random distribution, ensuring every item has an equal chance of being selected.'
				}
			],
			ru: [
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
			],
			he: [
				{
					question: 'איך מערכת ההגרלה עובדת?',
					answer:
						'פריטים הופכים לכרטיסים ומעורבבים באמצעות אלגוריתם פישר-יטס. אז אתם יכולים ללחוץ על כל כרטיס כדי לחשוף את הבחירה האקראית שלכם.'
				},
				{
					question: 'האם אפשר למשוך כמה גורלות?',
					answer:
						'לא, ניתן לבחור רק כרטיס אחד בכל הגרלה כדי להבטיח הוגנות. אפסו והגרילו שוב לבחירות מרובות.'
				},
				{
					question: 'האם זה באמת אקראי?',
					answer:
						'כן! אלגוריתם הערבוב פישר-יטס מספק חלוקה אקראית מוכחת מתמטית, מבטיח שלכל פריט יש סיכוי שווה להיבחר.'
				}
			]
		}
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
		faqs: {
			en: [
				{
					question: 'What are Unicode symbols?',
					answer:
						'Unicode symbols are standardized characters that work across different platforms and applications. They include mathematical symbols, arrows, currency signs, and decorative characters.'
				},
				{
					question: 'How do I use these symbols?',
					answer:
						'Simply click any symbol to copy it to your clipboard, then paste it anywhere you need it - in documents, social media, emails, or any text field.'
				},
				{
					question: 'Will these symbols work everywhere?',
					answer:
						'Most modern applications support Unicode symbols. However, display may vary depending on the font and platform being used.'
				}
			],
			ru: [
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
			],
			he: [
				{
					question: 'מה הם סמלי Unicode?',
					answer:
						'סמלי Unicode הם תווים סטנדרטיים שעובדים על פני פלטפורמות ויישומים שונים. הם כוללים סמלים מתמטיים, חצים, סימני מטבע ותווים דקורטיביים.'
				},
				{
					question: 'איך משתמשים בסמלים האלה?',
					answer:
						'פשוט לחצו על כל סמל כדי להעתיק אותו ללוח, ואז הדביקו אותו בכל מקום שאתם צריכים - במסמכים, רשתות חברתיות, אימיילים או כל שדה טקסט.'
				},
				{
					question: 'האם הסמלים האלה יעבדו בכל מקום?',
					answer:
						'רוב היישומים המודרניים תומכים בסמלי Unicode. עם זאת, התצוגה עשויה להשתנות בהתאם לגופן ולפלטפורמה בשימוש.'
				}
			]
		}
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
		faqs: {
			en: [
				{
					question: 'How do fancy text fonts work?',
					answer:
						"These aren't actual fonts but Unicode characters that look like different font styles. They work anywhere Unicode is supported without installing fonts."
				},
				{
					question: 'Where can I use fancy text?',
					answer:
						'Use fancy text on social media (Instagram, Twitter, Facebook), messaging apps, usernames, bios, and anywhere that supports Unicode text input.'
				},
				{
					question: 'Why do some styles look broken?',
					answer:
						'Not all platforms support every Unicode character. If a style appears broken, try a different one or use it on a platform with better Unicode support.'
				}
			],
			ru: [
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
			],
			he: [
				{
					question: 'איך עובדים פונטים מעוצבים?',
					answer:
						'אלה לא פונטים אמיתיים אלא תווי Unicode שנראים כמו סגנונות פונט שונים. הם עובדים בכל מקום שתומך ב-Unicode ללא התקנת פונטים.'
				},
				{
					question: 'איפה אפשר להשתמש בטקסט מעוצב?',
					answer:
						'השתמשו בטקסט מעוצב ברשתות חברתיות (אינסטגרם, טוויטר, פייסבוק), אפליקציות הודעות, שמות משתמש, ביו ובכל מקום שתומך בקלט טקסט Unicode.'
				},
				{
					question: 'למה חלק מהסגנונות נראים שבורים?',
					answer:
						'לא כל הפלטפורמות תומכות בכל תו Unicode. אם סגנון נראה שבור, נסו אחר או השתמשו בפלטפורמה עם תמיכה טובה יותר ב-Unicode.'
				}
			]
		}
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
		faqs: {
			en: [
				{
					question: 'How secure are these random numbers?',
					answer:
						'This generator uses the Web Crypto API (crypto.getRandomValues) which provides cryptographically secure random numbers suitable for most cryptographic applications.'
				},
				{
					question: "What's the difference from Math.random()?",
					answer:
						"Unlike Math.random() which is predictable and not secure, crypto.getRandomValues() uses the operating system's entropy source to generate truly random numbers."
				},
				{
					question: 'Can I use this for lottery or gambling?',
					answer:
						'While the numbers are cryptographically secure, please follow local laws and regulations. The user is responsible for any legal compliance.'
				}
			],
			ru: [
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
			],
			he: [
				{
					question: 'כמה מאובטחים המספרים האקראיים האלה?',
					answer:
						'מחולל זה משתמש ב-Web Crypto API (crypto.getRandomValues) המספק מספרים אקראיים מאובטחים קריפטוגרפית המתאימים לרוב היישומים הקריפטוגרפיים.'
				},
				{
					question: 'מה ההבדל מ-Math.random()?',
					answer:
						'בניגוד ל-Math.random() שניתן לחיזוי ולא מאובטח, crypto.getRandomValues() משתמש במקור האנטרופיה של מערכת ההפעלה ליצירת מספרים אקראיים באמת.'
				},
				{
					question: 'האם אפשר להשתמש בזה להגרלה או הימורים?',
					answer:
						'למרות שהמספרים מאובטחים קריפטוגרפית, אנא עקבו אחר החוקים והתקנות המקומיים. המשתמש אחראי לכל ציות לחוק.'
				}
			]
		}
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
		faqs: {
			en: [
				{
					question: 'What is text case conversion?',
					answer:
						'Text case conversion is the process of changing the capitalization pattern of text. It includes converting to uppercase, lowercase, and various programming case conventions.'
				},
				{
					question: 'What is Title Case?',
					answer:
						"Title Case capitalizes the first letter of each major word while keeping articles, prepositions, and conjunctions lowercase (unless they're the first word)."
				},
				{
					question: "What's the difference between camelCase and PascalCase?",
					answer:
						'camelCase starts with a lowercase letter (helloWorld), while PascalCase starts with an uppercase letter (HelloWorld). Both are commonly used in programming.'
				},
				{
					question: 'When should I use snake_case vs kebab-case?',
					answer:
						'snake_case uses underscores and is common in Python and Ruby. kebab-case uses hyphens and is popular in URLs and CSS class names.'
				},
				{
					question: 'What is alternating case used for?',
					answer:
						"Alternating case (aLtErNaTiNg) alternates between lowercase and uppercase letters. It's mainly used for stylistic purposes or mockery in informal text."
				}
			],
			ru: [
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
		}
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
		faqs: {
			en: [
				{
					question: 'What image formats are supported?',
					answer:
						'The tool supports all common image formats including JPG, PNG, GIF, WebP, SVG, BMP, and TIFF. It can analyze any format your browser can display.'
				},
				{
					question: 'Is there a file size limit?',
					answer:
						"There's no hard limit, but very large images (over 50MB) might take longer to process. The tool works entirely in your browser, so performance depends on your device."
				},
				{
					question: 'How is aspect ratio calculated?',
					answer:
						'Aspect ratio is calculated by finding the greatest common divisor of width and height, then expressing them as the simplest whole number ratio (e.g., 16:9 instead of 1920:1080).'
				},
				{
					question: 'Can I check multiple images at once?',
					answer:
						'Yes! You can select or drag multiple images at once. The tool will process them all and display the results in a grid layout.'
				},
				{
					question: 'Is my image data safe?',
					answer:
						'Absolutely. All processing happens locally in your browser. No images are uploaded to any server. Your files remain completely private.'
				}
			],
			ru: [
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
		}
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
		faqs: {
			en: [
				{
					question: "What's the difference between HTML and XML parsing?",
					answer:
						'HTML is more forgiving and allows certain unclosed tags, while XML requires strict syntax with all tags properly closed and nested. The parser automatically detects the type based on content.'
				},
				{
					question: 'What does the minify option do?',
					answer:
						'Minification removes unnecessary whitespace, line breaks, and comments (optionally) to reduce file size. This is useful for production deployments to improve loading times.'
				},
				{
					question: 'How does data extraction work?',
					answer:
						'The extract mode traverses the document tree and outputs the path to each element along with its attributes and text content. This is useful for understanding document structure and extracting specific data.'
				},
				{
					question: 'What validation is performed?',
					answer:
						'The parser checks for well-formedness: proper tag nesting, closed tags, valid attribute syntax, and proper character encoding. It reports any parsing errors found.'
				},
				{
					question: 'Can it handle large documents?',
					answer:
						"Yes, but very large documents (over 10MB) might be slow to process. The parser runs entirely in your browser, so performance depends on your device's capabilities."
				}
			],
			ru: [
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
		}
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
		faqs: {
			en: [
				{
					question: 'How does the randomization work?',
					answer:
						'The tool uses the Fisher-Yates shuffle algorithm with crypto.getRandomValues() for cryptographically secure randomness, which is more random than Math.random().'
				},
				{
					question: 'Is my data safe?',
					answer:
						'Yes! All processing happens in your browser. No data is sent to any server. Your lists remain completely private.'
				},
				{
					question: "What's the maximum number of items?",
					answer:
						'You can shuffle up to 10,000 items at once. For larger lists, consider splitting them into smaller batches for better performance.'
				},
				{
					question: 'Can I save my shuffled lists?',
					answer:
						'Yes, you can download the shuffled results as a text file or copy them to your clipboard for use in other applications.'
				}
			],
			ru: [
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
			],
			he: [
				{
					question: 'איך האקראיות עובדת?',
					answer:
						'הכלי משתמש באלגוריתם הערבוב פישר-יטס עם crypto.getRandomValues() לאקראיות קריפטוגרפית מאובטחת, שהיא יותר אקראית מ-Math.random().'
				},
				{
					question: 'האם הנתונים שלי בטוחים?',
					answer:
						'כן! כל העיבוד מתרחש בדפדפן שלך. שום נתונים לא נשלחים לשרת. הרשימות שלך נשארות פרטיות לחלוטין.'
				},
				{
					question: 'מה המספר המקסימלי של פריטים?',
					answer:
						'ניתן לערבב עד 10,000 פריטים בבת אחת. לרשימות גדולות יותר, שקלו לחלק אותן לקבוצות קטנות יותר לביצועים טובים יותר.'
				},
				{
					question: 'האם אני יכול לשמור רשימות מעורבבות?',
					answer:
						'כן, אתם יכולים להוריד את התוצאות כקובץ טקסט או להעתיק אותן ללוח העריכה לשימוש ביישומים אחרים.'
				}
			]
		}
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
		faqs: {
			en: [
				{
					question: 'Is the coin flip truly random?',
					answer:
						'Yes! The tool uses crypto.getRandomValues() for cryptographically secure randomness, ensuring each flip has exactly 50% chance for heads or tails.'
				},
				{
					question: 'Can I use different types of coins?',
					answer:
						'Yes, you can choose from US Dollar, Euro, Russian Ruble, or a generic coin. Each has authentic heads and tails designs.'
				},
				{
					question: 'Is my flip history saved?',
					answer:
						'Your flip history is saved locally in your browser. It persists between sessions but is never sent to any server.'
				},
				{
					question: 'What do the statistics show?',
					answer:
						'The statistics display the total number and percentage of heads vs tails outcomes, helping you verify the randomness over many flips.'
				}
			],
			ru: [
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
			],
			he: [
				{
					question: 'האם הטלת המטבע באמת אקראית?',
					answer:
						'כן! הכלי משתמש ב-crypto.getRandomValues() לאקראיות קריפטוגרפית מאובטחת, מבטיח שלכל הטלה יש בדיוק 50% סיכוי לעץ או פלי.'
				},
				{
					question: 'האם אני יכול להשתמש בסוגי מטבעות שונים?',
					answer:
						'כן, אתם יכולים לבחור מדולר אמריקאי, יורו, רובל רוסי, או מטבע כללי. לכל אחד יש עיצוב אותנטי של עץ ופלי.'
				},
				{
					question: 'האם היסטוריית ההטלות נשמרת?',
					answer:
						'היסטוריית ההטלות נשמרת מקומית בדפדפן שלך. היא נשמרת בין הפעלות אך לעולם לא נשלחת לשרת כלשהו.'
				},
				{
					question: 'מה הסטטיסטיקה מראה?',
					answer:
						'הסטטיסטיקה מציגה את המספר הכולל והאחוז של תוצאות עץ מול פלי, עוזרת לאמת את האקראיות על פני הטלות רבות.'
				}
			]
		}
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
		faqs: {
			en: [
				{
					question: 'Are the dice rolls truly random?',
					answer:
						'Yes! The tool uses crypto.getRandomValues() which provides cryptographically secure random numbers, ensuring each roll is truly random and unpredictable.'
				},
				{
					question: 'What is the probability of rolling doubles?',
					answer:
						'With 2 dice, the probability of doubles is 16.67% (1 in 6). With 3 dice, the probability of triples is 2.78% (1 in 36).'
				},
				{
					question: 'Does the 3D animation work on all browsers?',
					answer:
						'The 3D animation uses CSS3 transforms and works on modern browsers (Chrome, Edge, Firefox). Older browsers automatically fall back to 2D animation.'
				},
				{
					question: 'Can I use this for board games?',
					answer:
						'Absolutely! This tool is perfect for any game requiring dice rolls. The history feature helps track rolls during gameplay.'
				}
			],
			ru: [
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
			],
			he: [
				{
					question: 'האם הטלות הקוביות באמת אקראיות?',
					answer:
						'כן! הכלי משתמש ב-crypto.getRandomValues() שמספק מספרים אקראיים מאובטחים קריפטוגרפית, מבטיח שכל הטלה היא באמת אקראית ובלתי צפויה.'
				},
				{
					question: 'מה ההסתברות לזרוק דאבלס?',
					answer:
						'עם 2 קוביות, ההסתברות לדאבלס היא 16.67% (1 מתוך 6). עם 3 קוביות, ההסתברות לטריפלס היא 2.78% (1 מתוך 36).'
				},
				{
					question: 'האם האנימציה התלת-ממדית עובדת בכל הדפדפנים?',
					answer:
						'האנימציה התלת-ממדית משתמשת בטרנספורמציות CSS3 ועובדת בדפדפנים מודרניים (Chrome, Edge, Firefox). דפדפנים ישנים עוברים אוטומטית לאנימציה דו-ממדית.'
				},
				{
					question: 'האם אפשר להשתמש בזה למשחקי לוח?',
					answer:
						'בהחלט! הכלי הזה מושלם לכל משחק הדורש הטלת קוביות. תכונת ההיסטוריה עוזרת לעקוב אחר הטלות במהלך המשחק.'
				}
			]
		}
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
		faqs: {
			en: [
				{
					question: 'How many emojis are available?',
					answer:
						'The tool includes 1,800+ emojis from Unicode 14.0, organized into 8 categories: Smileys & People, People & Body, Animals & Nature, Food & Drink, Activities, Travel & Places, Objects, Symbols, and Flags.'
				},
				{
					question: 'Will emojis display correctly on all devices?',
					answer:
						"Most modern devices (iOS, Android 4.4+, Windows 8.1+) support colorful emojis. If your device doesn't support certain emojis, they may appear as boxes or question marks."
				},
				{
					question: 'Are my recent emojis saved?',
					answer:
						'Yes, the tool automatically saves your last 30 used emojis locally in your browser for quick access.'
				},
				{
					question: 'Can I search for specific emojis?',
					answer:
						'Yes, use the search bar to find emojis quickly. The search works across all categories.'
				}
			],
			ru: [
				{
					question: 'Сколько эмодзи доступно?',
					answer:
						'Инструмент включает более 1800 эмодзи из Unicode 14.0, организованных в 8 категорий: Смайлики и люди, Люди и тело, Животные и природа, Еда и напитки, Активности, Путешествия и места, Объекты, Символы и Флаги.'
				},
				{
					question:
						'Будут ли эмодзи корректно отображаться на всех устройствах?',
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
			],
			he: [
				{
					question: "כמה אימוג'ים זמינים?",
					answer:
						"הכלי כולל 1,800+ אימוג'ים מ-Unicode 14.0, מאורגנים ב-8 קטגוריות: סמיילים ואנשים, אנשים וגוף, חיות וטבע, אוכל ומשקאות, פעילויות, נסיעות ומקומות, אובייקטים, סמלים ודגלים."
				},
				{
					question: "האם אימוג'ים יוצגו נכון בכל המכשירים?",
					answer:
						"רוב המכשירים המודרניים (iOS, Android 4.4+, Windows 8.1+) תומכים באימוג'ים צבעוניים. אם המכשיר שלך לא תומך באימוג'ים מסוימים, הם עשויים להופיע כקופסאות או סימני שאלה."
				},
				{
					question: "האם האימוג'ים האחרונים נשמרים?",
					answer:
						"כן, הכלי שומר אוטומטית את 30 האימוג'ים האחרונים ששימשו מקומית בדפדפן שלך לגישה מהירה."
				},
				{
					question: "האם אפשר לחפש אימוג'ים ספציפיים?",
					answer:
						"כן, השתמשו בשורת החיפוש כדי למצוא אימוג'ים במהירות. החיפוש עובד על פני כל הקטגוריות."
				}
			]
		}
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
		faqs: {
			en: [
				{
					question: 'What are emoticons and kaomoji?',
					answer:
						"Emoticons are text-based expressions using ASCII characters to show emotions. Kaomoji (顔文字) are Japanese emoticons that don't need to be rotated sideways to be read, like (^_^) or ¯\\_(ツ)_/¯."
				},
				{
					question: 'Will these work on all platforms?',
					answer:
						"Most basic emoticons work everywhere, but complex kaomoji using Unicode characters may not display correctly on older systems or platforms that don't support Unicode."
				},
				{
					question: "What's the difference between emoticons and emojis?",
					answer:
						'Emoticons are made from keyboard characters and punctuation marks (like :-) ), while emojis are actual pictographic symbols (like 😊). Emoticons were invented first in 1982.'
				},
				{
					question: 'Can I create my own emoticons?',
					answer:
						'Yes! Emoticons are created by combining keyboard characters creatively. Popular ones evolved naturally through internet culture and became widely recognized.'
				}
			],
			ru: [
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
			],
			he: [
				{
					question: "מה זה אמוטיקונים וקאומוג'י?",
					answer:
						"אמוטיקונים הם ביטויים טקסטואליים המשתמשים בתווי ASCII להצגת רגשות. קאומוג'י (顔文字) הם אמוטיקונים יפניים שלא צריך לסובב אותם הצידה לקריאה, כמו (^_^) או ¯\\_(ツ)_/¯."
				},
				{
					question: 'האם אלה יעבדו בכל הפלטפורמות?',
					answer:
						"רוב האמוטיקונים הבסיסיים עובדים בכל מקום, אבל קאומוג'י מורכבים עם תווי Unicode עשויים לא להציג נכון במערכות ישנות או פלטפורמות ללא תמיכת Unicode."
				},
				{
					question: "מה ההבדל בין אמוטיקונים לאמוג'ים?",
					answer:
						"אמוטיקונים נוצרים מתווי מקלדת וסימני פיסוק (כמו :-) ), בעוד אמוג'ים הם סמלים פיקטוגרפיים אמיתיים (כמו 😊). אמוטיקונים הומצאו ראשונים ב-1982."
				},
				{
					question: 'האם אני יכול ליצור אמוטיקונים משלי?',
					answer:
						'כן! אמוטיקונים נוצרים על ידי שילוב יצירתי של תווי מקלדת. הפופולריים התפתחו באופן טבעי דרך תרבות האינטרנט והפכו מוכרים באופן נרחב.'
				}
			]
		}
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
		faqs: {
			en: [
				{
					question: 'How does text-to-speech work?',
					answer:
						"The tool uses your browser's Speech Synthesis API to convert text into spoken audio. The available voices depend on your operating system and installed language packs."
				},
				{
					question: 'Can I use different languages?',
					answer:
						'Yes! The tool supports multiple languages based on the voices installed on your system. You can select voices for different languages from the dropdown menu.'
				},
				{
					question: 'Are there any text length limits?',
					answer:
						'Most browsers can handle long texts, but very long passages may be split into chunks. For best performance, keep individual texts under 1000 words.'
				},
				{
					question: 'Can I save the audio output?',
					answer:
						"The Speech Synthesis API generates audio in real-time and doesn't provide direct download functionality. You can use system audio recording software to capture the output."
				}
			],
			ru: [
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
			],
			he: [
				{
					question: 'איך סינתזת הדיבור עובדת?',
					answer:
						'הכלי משתמש ב-Speech Synthesis API של הדפדפן כדי להמיר טקסט לאודיו. הקולות הזמינים תלויים במערכת ההפעלה ובחבילות השפה המותקנות.'
				},
				{
					question: 'האם אפשר להשתמש בשפות שונות?',
					answer:
						'כן! הכלי תומך במספר שפות בהתבסס על הקולות המותקנים במערכת שלך. אתם יכולים לבחור קולות לשפות שונות מהתפריט הנפתח.'
				},
				{
					question: 'האם יש מגבלות על אורך הטקסט?',
					answer:
						'רוב הדפדפנים יכולים לטפל בטקסטים ארוכים, אבל קטעים ארוכים מאוד עשויים להתחלק לחלקים. לביצועים טובים יותר, שמרו על טקסטים עד 1000 מילים.'
				},
				{
					question: 'האם אפשר לשמור את פלט האודיו?',
					answer:
						'ה-Speech Synthesis API מייצר אודיו בזמן אמת ולא מספק אפשרות הורדה ישירה. ניתן להשתמש בתוכנת הקלטת שמע של המערכת כדי ללכוד את הפלט.'
				}
			]
		}
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
		faqs: {
			en: [
				{
					question: 'Why do I need to know if my system is 32-bit or 64-bit?',
					answer:
						'When downloading software, you need to choose the correct version. 64-bit systems can run both 32-bit and 64-bit programs, but 32-bit systems can only run 32-bit software.'
				},
				{
					question: 'What is screen resolution and why does it matter?',
					answer:
						"Screen resolution is the number of pixels displayed on your screen. It's important for web design, choosing wallpapers, gaming settings, and buying compatible accessories."
				},
				{
					question: 'How accurate is the device detection?',
					answer:
						'We maintain a database of thousands of popular devices for accurate detection. However, some newer or less common devices might not be perfectly identified.'
				},
				{
					question: 'Is this information collection safe?',
					answer:
						'Yes, all information is gathered locally in your browser using standard web APIs. No data is sent to any server - everything stays on your device.'
				}
			],
			ru: [
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
			],
			he: [
				{
					question: 'למה צריך לדעת אם המערכת 32-ביט או 64-ביט?',
					answer:
						'בעת הורדת תוכנות, צריך לבחור את הגרסה הנכונה. מערכות 64-ביט יכולות להריץ תוכנות 32-ביט ו-64-ביט, אבל מערכות 32-ביט יכולות רק תוכנות 32-ביט.'
				},
				{
					question: 'מהי רזולוציית מסך ולמה זה חשוב?',
					answer:
						'רזולוציית מסך היא מספר הפיקסלים המוצגים על המסך. חשוב לעיצוב ווב, בחירת רקעים, הגדרות משחקים וקניית אביזרים תואמים.'
				},
				{
					question: 'עד כמה מדויק זיהוי המכשיר?',
					answer:
						'יש לנו מאגר נתונים של אלפי מכשירים פופולריים לזיהוי מדויק. עם זאת, מכשירים חדשים או נדירים עלולים שלא להיות מזוהים במדויק.'
				},
				{
					question: 'האם איסוף המידע הזה בטוח?',
					answer:
						'כן, כל המידע נאסף מקומית בדפדפן באמצעות APIs סטנדרטיים. שום נתונים לא נשלחים לשרת - הכל נשאר על המכשיר שלך.'
				}
			]
		}
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
		faqs: {
			en: [
				{
					question: 'What is JSON validation?',
					answer:
						'JSON validation checks if your JSON data follows the correct syntax rules. Invalid JSON can cause errors in applications, so validation helps catch issues early.'
				},
				{
					question: "What's the difference between formatting and minifying?",
					answer:
						'Formatting adds indentation and line breaks for readability, while minifying removes all unnecessary whitespace to reduce file size for production use.'
				},
				{
					question: 'How accurate is the error detection?',
					answer:
						"The tool uses JavaScript's native JSON parser, providing exact error messages with line and column numbers when syntax errors are found."
				},
				{
					question: 'Can I upload large JSON files?',
					answer:
						'Yes, you can upload JSON files directly. The tool handles large files efficiently and provides detailed structure analysis.'
				}
			],
			ru: [
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
			],
			he: [
				{
					question: 'מהי אימות JSON?',
					answer:
						'אימות JSON בודק אם נתוני ה-JSON שלך עוקבים אחר כללי התחביר הנכונים. JSON לא תקין יכול לגרום לשגיאות ביישומים, כך שאימות עוזר לתפוס בעיות מוקדם.'
				},
				{
					question: 'מה ההבדל בין עיצוב לכיווץ?',
					answer:
						'עיצוב מוסיף הזחה ושורות חדשות לקריאות, בעוד כיווץ מסיר את כל הרווחים הלא נחוצים כדי להקטין את גודל הקובץ לשימוש בייצור.'
				},
				{
					question: 'עד כמה מדויק זיהוי השגיאות?',
					answer:
						'הכלי משתמש במפרש JSON המובנה של JavaScript, מספק הודעות שגיאה מדויקות עם מספרי שורות ועמודות כאשר נמצאות שגיאות תחביר.'
				},
				{
					question: 'האם אפשר להעלות קבצי JSON גדולים?',
					answer:
						'כן, אתם יכולים להעלות קבצי JSON ישירות. הכלי מטפל בקבצים גדולים ביעילות ומספק ניתוח מבנה מפורט.'
				}
			]
		}
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
		faqs: {
			en: [
				{
					question: 'What is code compression and minification?',
					answer:
						'Code compression removes unnecessary characters like whitespace, comments, and line breaks. Minification also shortens variable names and optimizes code structure to reduce file size.'
				},
				{
					question: 'Is compressed code safe to use?',
					answer:
						'Yes, when done correctly. The tool preserves code functionality while only removing unnecessary elements. However, always test compressed code before deploying to production.'
				},
				{
					question: 'How much space can I save?',
					answer:
						'Typical savings range from 20-70% depending on code style. JavaScript with many comments can see higher compression ratios than already optimized code.'
				},
				{
					question: 'Can I compress already minified code?',
					answer:
						'Yes, but savings will be minimal since minified code already has most optimizations applied. The tool will still remove any remaining whitespace and comments.'
				}
			],
			ru: [
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
			],
			he: [
				{
					question: 'מה זה דחיסת קוד ומינימיזציה?',
					answer:
						'דחיסת קוד מסירה תווים מיותרים כמו רווחים, הערות ושבירות שורה. מינימיזציה גם מקצרת שמות משתנים ומייעלת את מבנה הקוד כדי להקטין את גודל הקובץ.'
				},
				{
					question: 'האם בטוח להשתמש בקוד דחוס?',
					answer:
						'כן, כשזה נעשה נכון. הכלי שומר על פונקציונליות הקוד תוך הסרת רק אלמנטים מיותרים. עם זאת, תמיד בדקו קוד דחוס לפני פריסה לייצור.'
				},
				{
					question: 'כמה מקום אפשר לחסוך?',
					answer:
						'חיסכון טיפוסי נע בין 20-70% בהתאם לסגנון הקוד. JavaScript עם הרבה הערות יכול להראות יחס דחיסה גבוה יותר מקוד שכבר מותאם.'
				},
				{
					question: 'האם אפשר לדחוס קוד שכבר מוקטן?',
					answer:
						'כן, אבל החיסכון יהיה מינימלי כיון שלקוד מוקטן כבר יש את רוב האופטימיזציות. הכלי עדיין יסיר רווחים והערות שנותרו.'
				}
			]
		}
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
		faqs: {
			en: [
				{
					question: 'What does the JavaScript validator check?',
					answer:
						'The validator checks for syntax errors, undefined variables, missing semicolons, assignment in conditions, unclosed brackets, and other common JavaScript issues.'
				},
				{
					question: 'Which JavaScript versions are supported?',
					answer:
						'The tool supports ES5, ES2015, ES2017, ES2020, and ES2022, including modern features like async/await, classes, and modules.'
				},
				{
					question: 'What is the difference between errors and warnings?',
					answer:
						'Errors are syntax issues that prevent code from running. Warnings are style/quality issues that may cause problems or make code harder to maintain.'
				},
				{
					question: 'Can I use this for React or Node.js code?',
					answer:
						'Yes, the validator works with any JavaScript code including React JSX, Node.js modules, and modern ES6+ syntax.'
				}
			],
			ru: [
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
			],
			he: [
				{
					question: 'מה בודק מאמת JavaScript?',
					answer:
						'המאמת בודק שגיאות תחביר, משתנים לא מוגדרים, נקודה-פסיק חסרה, השמה בתנאים, סוגריים לא סגורים ובעיות JavaScript נפוצות אחרות.'
				},
				{
					question: 'אילו גרסאות JavaScript נתמכות?',
					answer:
						'הכלי תומך ב-ES5, ES2015, ES2017, ES2020 ו-ES2022, כולל תכונות מודרניות כמו async/await, מחלקות ומודולים.'
				},
				{
					question: 'מה ההבדל בין שגיאות לאזהרות?',
					answer:
						'שגיאות הן בעיות תחביר שמונעות מהקוד לרוץ. אזהרות הן בעיות סגנון/איכות שעלולות לגרום לבעיות או להקשות על תחזוקת הקוד.'
				},
				{
					question: 'האם אפשר להשתמש בזה עבור קוד React או Node.js?',
					answer:
						'כן, המאמת עובד עם כל קוד JavaScript כולל React JSX, מודולי Node.js ותחביר ES6+ מודרני.'
				}
			]
		}
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
		faqs: {
			en: [
				{
					question: 'What is BMI and why is it important?',
					answer:
						"BMI (Body Mass Index) is a measure that uses your height and weight to work out if your weight is healthy. It's a useful screening tool to identify potential weight-related health problems."
				},
				{
					question: 'How accurate is the BMI calculation?',
					answer:
						'The BMI calculation follows the standard formula: weight (kg) / height (m)². Our calculator provides precise results and includes health status interpretation based on WHO guidelines.'
				},
				{
					question: 'What BMI ranges are considered healthy?',
					answer:
						"Normal weight: 18.5-24.9, Underweight: below 18.5, Overweight: 25-29.9, Obese: 30 and above. However, BMI doesn't account for muscle mass, bone density, or body composition."
				},
				{
					question: 'Can I use both metric and imperial units?',
					answer:
						'Yes, the calculator supports both metric (kg, cm) and imperial (lbs, ft/in) units. You can switch between units easily and get accurate results in your preferred measurement system.'
				},
				{
					question: 'Are there limitations to using BMI?',
					answer:
						"BMI doesn't distinguish between muscle and fat mass, so athletes with high muscle mass may have high BMI but low body fat. It's best used as a general screening tool alongside other health assessments."
				}
			],
			ru: [
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
			],
			he: []
		}
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
		faqs: {
			en: [
				{
					question: 'What counts as a word in the counter?',
					answer:
						'Words are defined as sequences of characters separated by spaces. Hyphenated words count as single words, while contractions like "don\'t" are counted as one word.'
				},
				{
					question: 'Why are character limits important for social media?',
					answer:
						'Each platform has specific limits: Twitter posts (280 chars), Instagram captions (2,200 chars), Facebook posts (63,206 chars). Staying within limits ensures your content displays properly.'
				},
				{
					question: 'Does the counter include spaces and punctuation?',
					answer:
						'Yes! Character count includes all spaces, punctuation, and special characters. Word count excludes spaces and punctuation, focusing only on actual words.'
				},
				{
					question: 'How accurate is the reading time estimate?',
					answer:
						'Reading time is calculated using the average reading speed of 200-250 words per minute for adults. Actual reading speed varies based on text complexity and individual reading ability.'
				},
				{
					question: 'Can I use this for SEO optimization?',
					answer:
						'Absolutely! Meta descriptions should be 150-160 characters, title tags 50-60 characters, and blog posts typically 300+ words for better SEO performance.'
				}
			],
			ru: [
				{
					question: 'Что считается словом в счётчике?',
					answer:
						'Слова определяются как последовательности символов, разделённые пробелами. Слова через дефис считаются одним словом, а сокращения вроде "don\'t" считаются одним словом.'
				},
				{
					question:
						'Почему ограничения по символам важны для социальных сетей?',
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
		}
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
		faqs: {
			en: [
				{
					question: "What's the difference between timer and countdown modes?",
					answer:
						'Timer counts up from zero to track elapsed time, while countdown counts down from a set time to zero. Both include audio and visual notifications when complete.'
				},
				{
					question: 'Will the timer continue if I close the browser tab?',
					answer:
						'No, the timer runs in your browser and will stop if you close the tab. Keep the tab open or use browser notifications to stay aware of timer completion.'
				},
				{
					question: 'Can I set multiple timers at once?',
					answer:
						'This tool supports one active timer at a time. To run multiple timers, open the tool in separate browser tabs or windows.'
				},
				{
					question: 'What notification options are available?',
					answer:
						'You can enable browser notifications, audio alerts, and visual alerts. The timer will flash and play a sound when time expires, even if the tab is in the background.'
				},
				{
					question: 'How precise are the timer calculations?',
					answer:
						"The timer uses JavaScript's high-resolution time API for accuracy within milliseconds. However, browser performance may slightly affect precision during heavy system load."
				}
			],
			ru: [
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
		}
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
		faqs: {
			en: [
				{
					question: 'What types of differences does the tool detect?',
					answer:
						'The tool detects line additions (green), deletions (red), and modifications (yellow). It performs character-level comparison within changed lines for precise highlighting.'
				},
				{
					question: 'Can I compare code files with this tool?',
					answer:
						'Yes! The diff tool works great for comparing code, JSON, HTML, CSS, and any text-based files. It preserves formatting and indentation for accurate comparison.'
				},
				{
					question: 'How does the comparison algorithm work?',
					answer:
						'The tool uses the Myers diff algorithm, the same used by Git, to find the optimal set of changes between two texts with minimal differences.'
				},
				{
					question: 'Is there a file size limit for comparison?',
					answer:
						'For best performance, keep files under 1MB. Very large files may slow down the comparison process or cause browser performance issues.'
				},
				{
					question: 'Can I ignore whitespace differences?',
					answer:
						'The tool includes options to ignore trailing whitespace, leading whitespace, or normalize all whitespace differences for cleaner comparisons.'
				}
			],
			ru: [
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
		faqs: {
			en: [
				{
					question: 'Which PHP versions are supported?',
					answer:
						'The syntax checker supports PHP 5.6, 7.0, 7.1, 7.2, 7.3, 7.4, 8.0, 8.1, 8.2, and 8.3, allowing you to validate code against specific PHP version syntax rules.'
				},
				{
					question: 'What types of errors does it detect?',
					answer:
						'The checker detects syntax errors, missing semicolons, unmatched brackets, invalid variable names, deprecated functions, and version-specific syntax issues.'
				},
				{
					question: 'Does it check for logical errors or just syntax?',
					answer:
						"This tool focuses on syntax validation only. It won't detect logical errors, undefined variables at runtime, or type mismatches - only PHP parsing errors."
				},
				{
					question: 'Can I check partial PHP code snippets?',
					answer:
						'Yes! You can validate code fragments, functions, classes, or complete PHP files. The tool handles both opening <?php tags and standalone code blocks.'
				},
				{
					question: 'How accurate is the error reporting?',
					answer:
						"The checker uses PHP's actual parser, providing the same error messages and line numbers you'd see when running php -l on your server."
				}
			],
			ru: [
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
		}
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
		faqs: {
			en: [
				{
					question: 'Which SQL dialects are supported?',
					answer:
						'The checker primarily supports MySQL 5.7 and 8.0 syntax, including stored procedures, triggers, functions, and advanced features like CTEs, window functions, and JSON operations.'
				},
				{
					question: 'Can I validate complex multi-statement queries?',
					answer:
						'Yes! The tool handles multiple statements, stored procedures, triggers, functions, and complex nested queries. Each statement is validated individually with detailed error reporting.'
				},
				{
					question: 'Does it check for logical errors or performance issues?',
					answer:
						"This tool focuses on syntax validation only. It won't detect logical errors, performance issues, or check if tables/columns exist - only SQL parsing errors."
				},
				{
					question: 'What types of SQL statements can I check?',
					answer:
						'All MySQL statement types: SELECT, INSERT, UPDATE, DELETE, CREATE, ALTER, DROP, stored procedures, triggers, functions, and DDL statements.'
				},
				{
					question: 'How does it handle MySQL-specific features?',
					answer:
						'The checker recognizes MySQL-specific syntax including backtick identifiers, MySQL functions, engine specifications, and unique MySQL data types like JSON and GEOMETRY.'
				}
			],
			ru: [
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
		}
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
		faqs: {
			en: [
				{
					question: 'Which regex flavors are supported?',
					answer:
						'The tester supports JavaScript (ECMAScript), PHP (PCRE), Python (re module), and .NET regex flavors, each with their specific syntax and features.'
				},
				{
					question: 'What are the common regex flags and their meanings?',
					answer:
						'Common flags include: g (global match all), i (case insensitive), m (multiline), s (dotall), u (unicode), and x (extended/verbose). Each flavor may support different flags.'
				},
				{
					question: 'How do I test for email or URL patterns?',
					answer:
						'The tool includes common preset patterns for emails, URLs, phone numbers, and dates. You can also build custom patterns using the interactive regex builder.'
				},
				{
					question: 'Can I see which parts of my text match?',
					answer:
						'Yes! The tester highlights all matches in your test text and shows capture groups, making it easy to visualize what your regex is matching.'
				},
				{
					question:
						"What's the difference between greedy and non-greedy matching?",
					answer:
						'Greedy quantifiers (*, +, ?) match as much as possible, while non-greedy (??, *?, +?) match as little as possible. Use non-greedy for precise matching between delimiters.'
				}
			],
			ru: [
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
		}
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
		faqs: {
			en: [
				{
					question: 'What JavaScript versions does this support?',
					answer:
						'The checker supports modern JavaScript including ES6/ES2015, ES2017, ES2020, and beyond. It recognizes arrow functions, async/await, destructuring, modules, classes, template literals, and all modern syntax features.'
				},
				{
					question: 'Can I check React JSX code?',
					answer:
						'Yes! The syntax checker has built-in JSX support, so you can validate React components, JSX syntax, and mixed JavaScript/JSX code. It understands JSX elements, props, fragments, and React-specific patterns.'
				},
				{
					question: 'Does this execute my code?',
					answer:
						'No, this is purely a syntax checker - it only analyzes code structure and grammar without executing anything. Your code is safe and never runs, making it secure for checking any JavaScript, even potentially harmful code.'
				},
				{
					question: 'What types of errors does it catch?',
					answer:
						"It catches syntax errors like missing semicolons/brackets, typos in keywords, malformed functions, invalid JSX, unclosed strings, and structural problems. It won't catch runtime errors or logical issues."
				},
				{
					question: 'Why use this instead of my IDE?',
					answer:
						"Great for quick validation without opening an IDE, sharing code snippets with others, checking code on mobile devices, or when you need a second opinion on syntax. It's also useful for teaching and learning JavaScript syntax."
				}
			],
			ru: [
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
			],
			he: []
		}
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
		faqs: {
			en: [
				{
					question: "What's the difference between rem and em units?",
					answer:
						"rem units are relative to the root element's font size (usually 16px), while em units are relative to the parent element's font size. rem provides more predictable sizing."
				},
				{
					question: 'What should I use as the base font size?',
					answer:
						'Most browsers default to 16px. However, you can customize this based on your design system. Common alternatives are 14px, 15px, or 18px depending on accessibility needs.'
				},
				{
					question: 'When should I use pixels vs rem?',
					answer:
						'Use rem for scalable layouts, typography, and spacing. Use pixels for precise measurements like borders (1px), small icons, or when exact sizing is critical.'
				},
				{
					question: 'How do rem units improve accessibility?',
					answer:
						"rem units respect user browser font size preferences, allowing visually impaired users to scale content by adjusting their browser's default font size."
				},
				{
					question: 'Can I convert viewport units like vw and vh?',
					answer:
						'This converter focuses on px/rem/em conversion. Viewport units (vw, vh, vmin, vmax) are percentage-based relative to screen size, not font-based like rem/em.'
				}
			],
			ru: [
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
		}
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
		faqs: {
			en: [
				{
					question: 'What are the different box-shadow parameters?',
					answer:
						'Box-shadow uses: horizontal offset, vertical offset, blur radius, spread radius, color, and inset (optional). Each controls different shadow aspects like position, softness, and size.'
				},
				{
					question: "What's the difference between outset and inset shadows?",
					answer:
						'Outset shadows appear outside the element (default), creating depth and elevation. Inset shadows appear inside the element, creating a recessed or pressed effect.'
				},
				{
					question: 'Can I apply multiple shadows to one element?',
					answer:
						'Yes! Separate multiple shadows with commas. The first shadow appears on top, with subsequent shadows layered underneath. This allows complex shadow effects.'
				},
				{
					question: 'How do I create realistic drop shadows?',
					answer:
						'Use subtle offsets (2-8px), moderate blur (4-20px), minimal spread (0-2px), and low opacity colors (rgba with 0.1-0.3 alpha). Avoid harsh black shadows.'
				},
				{
					question: 'Do box-shadows affect layout and performance?',
					answer:
						"Box-shadows don't affect layout flow but can impact performance with many elements or complex shadows. Consider using transform: translateZ(0) for hardware acceleration on animated shadows."
				}
			],
			ru: [
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
		}
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
		faqs: {
			en: [
				{
					question:
						"What's the difference between linear, radial, and conic gradients?",
					answer:
						'Linear gradients transition colors along a straight line, radial gradients emanate from a center point outward in a circle/ellipse, and conic gradients rotate around a center point like a color wheel.'
				},
				{
					question: 'How do I control gradient direction?',
					answer:
						'For linear gradients, use angles (45deg) or keywords (to right, to bottom). For radial gradients, specify position (center, top left). Conic gradients use from angles to set the starting position.'
				},
				{
					question: 'Can I add multiple color stops?',
					answer:
						'Yes! Add as many color stops as needed. Each can have a specific position (red 0%, blue 50%, green 100%) to control exactly where colors appear in the gradient.'
				},
				{
					question: 'How do I create smooth vs sharp transitions?',
					answer:
						'Smooth transitions use distant color stops (red 0%, blue 100%). Sharp transitions place color stops close together (red 49%, blue 51%) for abrupt color changes.'
				},
				{
					question: 'Are CSS gradients better than images for performance?',
					answer:
						"Yes! CSS gradients are vectors, scale perfectly, have smaller file sizes than images, and don't require HTTP requests. They're also easily customizable and animatable."
				}
			],
			ru: [
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
					question:
						'Лучше ли CSS градиенты изображений для производительности?',
					answer:
						'Да! CSS градиенты - это векторы, идеально масштабируются, имеют меньший размер файла, чем изображения, и не требуют HTTP запросов. Они также легко настраиваемые и анимируемые.'
				}
			]
		}
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
		faqs: {
			en: [
				{
					question: 'What are the WCAG contrast ratio requirements?',
					answer:
						'WCAG requires minimum 4.5:1 contrast for normal text and 3:1 for large text (AA level). For AAA level, ratios are 7:1 for normal text and 4.5:1 for large text.'
				},
				{
					question: 'What qualifies as "large text" in accessibility?',
					answer:
						'Large text is defined as 18pt (24px) or larger in regular weight, or 14pt (18.66px) or larger in bold weight according to WCAG guidelines.'
				},
				{
					question: 'How is contrast ratio calculated?',
					answer:
						'Contrast ratio uses the formula (L1 + 0.05) / (L2 + 0.05), where L1 is the relative luminance of the lighter color and L2 is the relative luminance of the darker color.'
				},
				{
					question: 'Do I need to check contrast for non-text elements?',
					answer:
						'Yes! WCAG 2.1 requires 3:1 contrast for UI components like buttons, form controls, and focus indicators. Decorative elements are exempt from contrast requirements.'
				},
				{
					question: 'What colors should I avoid for accessibility?',
					answer:
						'Avoid red/green combinations (color blindness), low contrast gray combinations, and relying solely on color to convey information. Always provide additional visual cues.'
				}
			],
			ru: [
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
		}
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
		faqs: {
			en: [
				{
					question: 'What are CSS @keyframes and how do they work?',
					answer:
						'@keyframes define animation sequences by specifying CSS properties at different percentages (0%, 25%, 100%) of the animation timeline. Browsers smoothly interpolate between these keyframes.'
				},
				{
					question:
						"What's the difference between keyframe percentages and timing functions?",
					answer:
						'Keyframe percentages (0%, 50%, 100%) define when properties change during the animation. Timing functions (ease, linear, cubic-bezier) control the speed curve between keyframes.'
				},
				{
					question: 'How do I create smooth vs jerky animations?',
					answer:
						'Smooth animations use many keyframes with small property changes and appropriate timing functions. Jerky animations use few keyframes with large property jumps or linear timing.'
				},
				{
					question: 'What properties can I animate with keyframes?',
					answer:
						'You can animate most CSS properties: transform, opacity, colors, dimensions, positions. Avoid animating layout properties (width, height, padding) as they trigger expensive reflows.'
				},
				{
					question: 'How do I optimize animations for performance?',
					answer:
						'Stick to animating transform and opacity properties, which are GPU-accelerated. Use will-change property sparingly, and prefer transform: translate3d() over changing left/top positions.'
				}
			],
			ru: [
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
		faqs: {
			en: [
				{
					question: "What's the difference between JSON and YAML?",
					answer:
						'JSON uses brackets and quotes, making it compact but less readable. YAML uses indentation and is more human-readable. Both represent the same data structures (objects, arrays, strings, numbers), but YAML is easier to read and edit manually.'
				},
				{
					question: 'When should I use JSON vs YAML?',
					answer:
						'Use JSON for APIs, web applications, and when size matters. Use YAML for configuration files, documentation, and when human readability is important. JSON is faster to parse, YAML is easier to write and maintain.'
				},
				{
					question: 'Will converting between formats lose data?',
					answer:
						'No, both formats support the same data types (strings, numbers, booleans, arrays, objects, null). Conversion is lossless - your data structure and values remain identical, only the syntax changes.'
				},
				{
					question: 'How does the formatter handle invalid syntax?',
					answer:
						'The tool will show clear error messages pointing to the problematic line and character. For JSON, it catches missing quotes, trailing commas, and bracket mismatches. For YAML, it detects indentation and structure errors.'
				},
				{
					question: 'Can I format minified or compact data?',
					answer:
						'Yes! The formatter can take minified/compressed JSON or compact YAML and expand it with proper indentation and line breaks, making it much easier to read and debug.'
				}
			],
			ru: [
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
			],
			he: []
		}
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
		faqs: {
			en: [
				{
					question: 'What image formats can I upload?',
					answer:
						'You can upload PNG, JPG, JPEG, SVG, GIF, and other common image formats. The tool supports files up to 5MB in size.'
				},
				{
					question: 'What favicon sizes are generated?',
					answer:
						'The tool generates 10 different sizes: 16x16 (classic), 32x32 (standard), 48x48 (Windows), 57x57 (iOS), 76x76 (iPad), 120x120 (iPhone Retina), 152x152 (iPad Retina), 180x180 (iPhone X/11/12), 192x192 (Android), and 512x512 (Android large).'
				},
				{
					question: 'What is the best image size to upload?',
					answer:
						'Upload a square image (1:1 aspect ratio) with at least 512x512 pixels for best results. Simple, bold designs work better at small sizes than complex detailed images.'
				},
				{
					question: 'How do I implement the generated favicons?',
					answer:
						'Add the favicon files to your website root directory and include the appropriate <link> tags in your HTML <head> section. The tool provides sample HTML code for implementation.'
				}
			],
			ru: [
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
			],
			he: []
		}
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
		faqs: {
			en: [
				{
					question: 'What is Base64 encoding and why is it used?',
					answer:
						"Base64 is a method to convert binary data into ASCII text using 64 characters (A-Z, a-z, 0-9, +, /). It's commonly used in web development, email attachments, data URLs, and APIs where binary data needs to be transmitted as text."
				},
				{
					question: 'Is Base64 encoding secure?',
					answer:
						"No, Base64 is NOT encryption or security - it's just encoding. Anyone can easily decode Base64 data. Never use it to hide sensitive information. It's designed for data transmission, not security."
				},
				{
					question: 'What file types can I encode?',
					answer:
						'You can encode any file type: images (PNG, JPG), documents (PDF, DOC), text files, executables, etc. The tool converts the binary content to Base64 text, regardless of file format.'
				},
				{
					question: 'Why does encoded data look longer than original?',
					answer:
						'Base64 encoding increases data size by approximately 33% because it uses 4 ASCII characters to represent every 3 bytes of original data. This overhead is the trade-off for text-safe transmission.'
				},
				{
					question: 'When should I use Base64 encoding?',
					answer:
						'Use Base64 for embedding small images in CSS/HTML as data URLs, encoding binary data for JSON APIs, preparing file uploads for web forms, and any situation where you need to transmit binary data through text-only channels.'
				}
			],
			ru: [
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
			],
			he: []
		}
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
		faqs: {
			en: [
				{
					question: 'What is a JWT and how is it structured?',
					answer:
						'JWT (JSON Web Token) is a secure way to transmit information as a JSON object. It consists of three Base64-encoded parts separated by dots: Header (algorithm info), Payload (claims/data), and Signature (verification).'
				},
				{
					question: 'Is it safe to decode JWTs client-side?',
					answer:
						'Yes, decoding is safe - JWTs are designed to be readable by clients. However, never expose sensitive data in JWT claims since anyone can decode them. The signature verifies authenticity, but payload data is not encrypted.'
				},
				{
					question: 'What are JWT claims and how do I read them?',
					answer:
						'Claims are statements about an entity (usually the user). Standard claims include "iss" (issuer), "exp" (expiration), "sub" (subject), and "aud" (audience). Custom claims can contain any JSON data your application needs.'
				},
				{
					question: 'How do I verify if a JWT is valid?',
					answer:
						"This tool only decodes JWTs - it doesn't verify signatures. To verify validity, you need the secret key or public key used for signing. Check expiration dates, issuer, and other claims in your application logic."
				},
				{
					question: 'Why might JWT decoding fail?',
					answer:
						"Common reasons include: malformed token structure (not 3 parts), invalid Base64 encoding, corrupted characters, or tokens that aren't actually JWTs. Ensure you're pasting the complete token including all dots."
				}
			],
			ru: [
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
			],
			he: []
		}
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
		faqs: {
			en: [
				{
					question: "What's the difference between UUID versions?",
					answer:
						'UUID v1 uses timestamp + MAC address, v3/v5 use name-based hashing (MD5/SHA-1), v4 uses random data. v4 is most common for general use, v1 for time-ordered IDs.'
				},
				{
					question: 'Are UUIDs truly unique and collision-proof?',
					answer:
						'UUID v4 has extremely low collision probability (1 in 5.3×10^36). While not mathematically impossible, collisions are practically impossible in real-world applications.'
				},
				{
					question: 'When should I use UUID vs auto-incrementing IDs?',
					answer:
						'Use UUIDs for distributed systems, public APIs, or when you need non-sequential IDs for security. Use auto-increment for simple databases with single servers.'
				},
				{
					question: 'Can UUIDs be used as database primary keys?',
					answer:
						'Yes, but consider performance implications. UUIDs are larger (36 chars vs 4-8 bytes) and non-sequential, which can affect index performance. UUID v1 or ULID might be better for databases.'
				},
				{
					question: "What's the standard UUID format?",
					answer:
						'Standard UUID format is 8-4-4-4-12 hex digits: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx. Some systems use variations like removing hyphens or using uppercase.'
				}
			],
			ru: [
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
					question:
						'Когда следует использовать UUID против автоинкрементных ID?',
					answer:
						'Используйте UUID для распределённых систем, публичных API или когда нужны непоследовательные ID для безопасности. Используйте автоинкремент для простых баз данных с одним сервером.'
				},
				{
					question:
						'Можно ли использовать UUID как первичные ключи базы данных?',
					answer:
						'Да, но учитывайте влияние на производительность. UUID больше (36 символов против 4-8 байт) и непоследовательны, что может влиять на производительность индекса. UUID v1 или ULID могут быть лучше для баз данных.'
				},
				{
					question: 'Какой стандартный формат UUID?',
					answer:
						'Стандартный формат UUID: 8-4-4-4-12 шестнадцатеричных цифр: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx. Некоторые системы используют варианты, такие как удаление дефисов или использование заглавных букв.'
				}
			]
		}
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
		faqs: {
			en: [
				{
					question: 'What types of ASCII art can I create?',
					answer:
						'You can create text-based ASCII art with different font styles, convert images to ASCII characters, or choose from a library of pre-made patterns including animals, objects, and symbols.'
				},
				{
					question: 'What image formats are supported?',
					answer:
						'The tool supports all common image formats including JPG, PNG, GIF, and WebP. For best results, use images with good contrast and simple subjects.'
				},
				{
					question: 'Can I customize the ASCII output?',
					answer:
						'Yes! For images, you can adjust the width, choose different character sets, and invert brightness. For text, you can select from multiple font styles.'
				},
				{
					question: 'How can I save or share my ASCII art?',
					answer:
						'You can copy the ASCII art to clipboard, download it as a text file, or save it as a PNG image. The image export preserves the monospace formatting.'
				}
			],
			ru: [
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
			],
			he: []
		}
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
		faqs: {
			en: [
				{
					question: 'What are Open Graph tags?',
					answer:
						'Open Graph tags are HTML meta tags that control how your content appears when shared on social media platforms like Facebook, Twitter, and LinkedIn.'
				},
				{
					question: 'Which tags are required?',
					answer:
						'The essential tags are og:title, og:description, og:image, og:url, and og:type. These provide the basic information for social sharing.'
				},
				{
					question: 'How do I fix missing tags?',
					answer:
						'Add the missing meta tags to your HTML head section. Each tag should have a property attribute (like "og:title") and a content attribute with your value.'
				}
			],
			ru: [
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

export function getWidgetFAQs(
	widgetId: string,
	locale: 'en' | 'ru'
): WidgetFAQ[] {
	const widget = getWidgetById(widgetId)
	return widget?.faqs?.[locale] || []
}
