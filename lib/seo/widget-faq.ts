interface LocaleFAQ {
	question: string
	answer: string
}

type WidgetFAQ = {
	en: LocaleFAQ[]
	ru: LocaleFAQ[]
}

export const widgetFAQ: Record<string, WidgetFAQ> = {
	'css-clamp-calculator': {
		en: [
			{
				question: 'What is CSS clamp() function?',
				answer:
					"The CSS clamp() function allows you to set a value that scales between a minimum and maximum based on the viewport size. It's perfect for creating responsive typography and spacing that adapts smoothly to different screen sizes."
			},
			{
				question: 'How do I use clamp() for responsive fonts?',
				answer:
					'Use clamp() with three values: minimum size, preferred size (usually with vw units), and maximum size. For example: font-size: clamp(1rem, 2vw + 0.5rem, 3rem);'
			},
			{
				question: 'What browsers support CSS clamp()?',
				answer:
					'CSS clamp() is supported in all modern browsers including Chrome 79+, Firefox 75+, Safari 13.1+, and Edge 79+. For older browsers, you may need fallbacks.'
			},
			{
				question: 'Can I use negative values in clamp()?',
				answer:
					"Yes, clamp() can accept negative values, which is useful for properties like margin or transform. However, be careful as some properties don't accept negative values."
			}
		],
		ru: [
			{
				question: 'Что такое CSS функция clamp()?',
				answer:
					'CSS функция clamp() позволяет задать значение, которое масштабируется между минимумом и максимумом в зависимости от размера вьюпорта. Идеально подходит для создания адаптивной типографики.'
			},
			{
				question: 'Как использовать clamp() для адаптивных шрифтов?',
				answer:
					'Используйте clamp() с тремя значениями: минимальный размер, предпочтительный размер (обычно с vw единицами) и максимальный размер. Например: font-size: clamp(1rem, 2vw + 0.5rem, 3rem);'
			},
			{
				question: 'Какие браузеры поддерживают CSS clamp()?',
				answer:
					'CSS clamp() поддерживается всеми современными браузерами: Chrome 79+, Firefox 75+, Safari 13.1+ и Edge 79+. Для старых браузеров могут потребоваться фоллбэки.'
			},
			{
				question: 'Можно ли использовать отрицательные значения в clamp()?',
				answer:
					'Да, clamp() может принимать отрицательные значения, что полезно для свойств margin или transform. Однако будьте осторожны, так как некоторые свойства не принимают отрицательные значения.'
			}
		]
	},
	'color-converter': {
		en: [
			{
				question: 'What color formats does this converter support?',
				answer:
					'Our color converter supports HEX, RGB, HSL, HSB/HSV, CMYK, LAB, and XYZ color formats. You can convert between any of these formats instantly.'
			},
			{
				question: 'How accurate is the CMYK conversion?',
				answer:
					'CMYK conversion is an approximation since CMYK is for print and RGB/HEX are for screens. The actual printed color may vary depending on the printer and paper.'
			},
			{
				question: "What's the difference between HSL and HSB?",
				answer:
					'HSL (Hue, Saturation, Lightness) and HSB/HSV (Hue, Saturation, Brightness/Value) are similar but calculate the color differently. HSL is often more intuitive for web design.'
			},
			{
				question: 'Can I use these color values in CSS?',
				answer:
					'Yes! HEX, RGB, and HSL values can be used directly in CSS. CMYK, LAB, and XYZ are not natively supported in CSS but are useful for other applications.'
			}
		],
		ru: [
			{
				question: 'Какие форматы цветов поддерживает конвертер?',
				answer:
					'Наш конвертер поддерживает форматы HEX, RGB, HSL, HSB/HSV, CMYK, LAB и XYZ. Вы можете конвертировать между любыми из этих форматов мгновенно.'
			},
			{
				question: 'Насколько точна конвертация в CMYK?',
				answer:
					'Конвертация CMYK является приближенной, так как CMYK предназначен для печати, а RGB/HEX для экранов. Фактический печатный цвет может отличаться.'
			},
			{
				question: 'В чем разница между HSL и HSB?',
				answer:
					'HSL (тон, насыщенность, светлота) и HSB/HSV (тон, насыщенность, яркость) похожи, но вычисляют цвет по-разному. HSL часто более интуитивен для веб-дизайна.'
			}
		]
	},
	'flexbox-generator': {
		en: [
			{
				question: 'What is CSS Flexbox?',
				answer:
					'Flexbox (Flexible Box Layout) is a CSS layout method that allows you to arrange elements in a row or column, with powerful alignment and distribution options.'
			},
			{
				question: 'When should I use Flexbox vs Grid?',
				answer:
					'Use Flexbox for one-dimensional layouts (row OR column) and when you need flexible sizing. Use Grid for two-dimensional layouts (rows AND columns) and when you need precise control.'
			},
			{
				question: 'What does flex-wrap do?',
				answer:
					"Flex-wrap controls whether flex items wrap to new lines when they run out of space. 'nowrap' keeps them on one line, 'wrap' allows wrapping, and 'wrap-reverse' wraps in reverse order."
			},
			{
				question: 'How do I center elements with Flexbox?',
				answer:
					'To center elements both horizontally and vertically, use: display: flex; justify-content: center; align-items: center; on the parent container.'
			}
		],
		ru: [
			{
				question: 'Что такое CSS Flexbox?',
				answer:
					'Flexbox (гибкая блочная разметка) - это метод CSS разметки, который позволяет располагать элементы в строке или столбце с мощными опциями выравнивания.'
			},
			{
				question: 'Когда использовать Flexbox vs Grid?',
				answer:
					'Используйте Flexbox для одномерных макетов (строка ИЛИ столбец) и когда нужны гибкие размеры. Используйте Grid для двумерных макетов (строки И столбцы).'
			},
			{
				question: 'Как центрировать элементы с Flexbox?',
				answer:
					'Для центрирования элементов по горизонтали и вертикали используйте: display: flex; justify-content: center; align-items: center; на родительском контейнере.'
			}
		]
	},
	'grid-generator': {
		en: [
			{
				question: 'What is CSS Grid?',
				answer:
					'CSS Grid is a powerful two-dimensional layout system that allows you to create complex layouts with rows and columns. It provides precise control over both axes simultaneously.'
			},
			{
				question: 'What does fr unit mean in Grid?',
				answer:
					'The "fr" (fractional) unit represents a fraction of the available space in the grid container. For example, "1fr 2fr" creates two columns where the second is twice as wide as the first.'
			},
			{
				question: 'How do I make a responsive grid?',
				answer:
					'Use auto-fit or auto-fill with minmax() function. For example: grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); creates a responsive grid that automatically adjusts the number of columns.'
			},
			{
				question: 'What is the difference between gap and grid-gap?',
				answer:
					'They are the same! grid-gap is the old syntax, while gap is the newer standard. Modern browsers support both, but gap is recommended as it also works with Flexbox.'
			},
			{
				question: 'Can I overlap grid items?',
				answer:
					'Yes! Use grid-row and grid-column properties to explicitly place items. Items can occupy the same cells, and you can control their stacking with z-index.'
			},
			{
				question: 'What is grid-auto-flow dense?',
				answer:
					'The "dense" keyword tells Grid to fill in holes in the layout by moving smaller items up. This creates a more compact layout but may change the visual order of items.'
			}
		],
		ru: [
			{
				question: 'Что такое CSS Grid?',
				answer:
					'CSS Grid - это мощная двумерная система разметки, которая позволяет создавать сложные макеты со строками и столбцами. Она обеспечивает точный контроль над обеими осями одновременно.'
			},
			{
				question: 'Что означает единица fr в Grid?',
				answer:
					'Единица "fr" (fractional) представляет долю доступного пространства в контейнере. Например, "1fr 2fr" создает два столбца, где второй в два раза шире первого.'
			},
			{
				question: 'Как сделать адаптивную сетку?',
				answer:
					'Используйте auto-fit или auto-fill с функцией minmax(). Например: grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); создает адаптивную сетку, которая автоматически подстраивает количество столбцов.'
			},
			{
				question: 'В чем разница между gap и grid-gap?',
				answer:
					'Это одно и то же! grid-gap - старый синтаксис, а gap - новый стандарт. Современные браузеры поддерживают оба варианта, но gap рекомендуется, так как работает и с Flexbox.'
			},
			{
				question: 'Можно ли накладывать элементы Grid друг на друга?',
				answer:
					'Да! Используйте свойства grid-row и grid-column для явного размещения элементов. Элементы могут занимать одни и те же ячейки, а их порядок наложения контролируется через z-index.'
			},
			{
				question: 'Что такое grid-auto-flow dense?',
				answer:
					'Ключевое слово "dense" указывает Grid заполнять пробелы в макете, перемещая меньшие элементы вверх. Это создает более компактный макет, но может изменить визуальный порядок элементов.'
			}
		]
	}
}
