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
      title: 'CSS Clamp Calculator - Create Responsive Typography | Online Tool',
      description: 'Free online CSS clamp() calculator. Create fluid responsive typography and spacing. Generate clamp() values with visual preview. Perfect for responsive web design.',
      keywords: ['css clamp', 'clamp calculator', 'responsive typography', 'fluid typography', 'css calculator', 'responsive design']
    },
    ru: {
      title: 'CSS Clamp Калькулятор - Адаптивная Типографика | Онлайн Инструмент',
      description: 'Бесплатный онлайн калькулятор CSS clamp(). Создавайте адаптивную типографику и отступы. Генерируйте clamp() значения с визуальным превью.',
      keywords: ['css clamp калькулятор', 'адаптивная типографика', 'калькулятор css', 'адаптивный дизайн', 'clamp функция']
    },
  },
  'color-converter': {
    en: {
      title: 'Color Converter - HEX to RGB, HSL, CMYK | Free Online Tool',
      description: 'Convert colors between HEX, RGB, HSL, HSB, CMYK, LAB, and XYZ formats. Free online color converter with instant preview and one-click copy.',
      keywords: ['color converter', 'hex to rgb', 'rgb to hex', 'color picker', 'cmyk converter', 'hsl converter', 'color tool']
    },
    ru: {
      title: 'Конвертер Цветов - HEX в RGB, HSL, CMYK | Бесплатный Онлайн',
      description: 'Конвертируйте цвета между форматами HEX, RGB, HSL, HSB, CMYK, LAB и XYZ. Бесплатный онлайн конвертер с мгновенным превью.',
      keywords: ['конвертер цветов', 'hex в rgb', 'rgb в hex', 'палитра цветов', 'cmyk конвертер', 'конвертер цвета онлайн']
    },
  },
  'bezier-curve': {
    en: {
      title: 'Bezier Curve Generator - CSS Animation Easing | Online Tool',
      description: 'Create custom cubic bezier curves for CSS animations. Visual curve editor with 30+ presets. Generate cubic-bezier() values for smooth animations.',
      keywords: ['bezier curve', 'cubic bezier', 'css animation', 'easing function', 'animation curve', 'bezier generator']
    },
    ru: {
      title: 'Генератор Кривых Безье - CSS Анимация | Онлайн Инструмент',
      description: 'Создавайте кубические кривые Безье для CSS анимаций. Визуальный редактор с 30+ пресетами. Генерируйте cubic-bezier() значения.',
      keywords: ['кривые безье', 'генератор безье', 'css анимация', 'easing функция', 'кубические кривые']
    },
  },
  'css-specificity': {
    en: {
      title: 'CSS Specificity Calculator - Analyze Selector Weight | Free Tool',
      description: 'Calculate CSS selector specificity instantly. Understand selector weight and cascade. Visual breakdown of IDs, classes, and elements.',
      keywords: ['css specificity', 'specificity calculator', 'css selector', 'selector weight', 'css cascade', 'css priority']
    },
    ru: {
      title: 'Калькулятор Специфичности CSS - Анализ Селекторов | Бесплатно',
      description: 'Рассчитайте специфичность CSS селекторов мгновенно. Понимайте вес селекторов и каскад. Визуальная разбивка по ID, классам и элементам.',
      keywords: ['специфичность css', 'калькулятор специфичности', 'css селекторы', 'вес селектора', 'css каскад']
    },
  },
  'flexbox-generator': {
    en: {
      title: 'Flexbox Generator - Visual CSS Flexbox Builder | Online Tool',
      description: 'Visual flexbox CSS generator with live preview. Create flexible layouts easily. Export clean CSS code for flex containers and items.',
      keywords: ['flexbox generator', 'css flexbox', 'flex layout', 'flexbox builder', 'css generator', 'flex container']
    },
    ru: {
      title: 'Генератор Flexbox - Визуальный Конструктор CSS | Онлайн',
      description: 'Визуальный генератор CSS flexbox с живым превью. Создавайте гибкие макеты легко. Экспортируйте чистый CSS код.',
      keywords: ['генератор flexbox', 'css flexbox', 'flex макет', 'конструктор flexbox', 'генератор css']
    },
  },
  'grid-generator': {
    en: {
      title: 'CSS Grid Generator - Visual Grid Layout Builder | Free Tool',
      description: 'Create CSS Grid layouts visually. Generate grid-template code with live preview. Perfect tool for responsive grid design.',
      keywords: ['css grid generator', 'grid layout', 'css grid', 'grid builder', 'grid template', 'responsive grid']
    },
    ru: {
      title: 'Генератор CSS Grid - Визуальный Конструктор Сеток | Бесплатно',
      description: 'Создавайте CSS Grid макеты визуально. Генерируйте grid-template код с живым превью. Идеальный инструмент для адаптивных сеток.',
      keywords: ['генератор css grid', 'grid макет', 'css сетка', 'конструктор grid', 'адаптивная сетка']
    },
  },
  'password-generator': {
    en: {
      title: 'Strong Password Generator - Secure Random Passwords | Free Tool',
      description: 'Generate strong, secure passwords instantly. Customize length and character types. Create unbreakable passwords for maximum security.',
      keywords: ['password generator', 'strong password', 'secure password', 'random password', 'password creator', 'password tool']
    },
    ru: {
      title: 'Генератор Паролей - Надежные Случайные Пароли | Бесплатно',
      description: 'Генерируйте надежные, безопасные пароли мгновенно. Настройте длину и типы символов. Создавайте невзламываемые пароли.',
      keywords: ['генератор паролей', 'надежный пароль', 'безопасный пароль', 'случайный пароль', 'создать пароль']
    },
  },
  'qr-generator': {
    en: {
      title: 'QR Code Generator - Create Custom QR Codes | Free Online Tool',
      description: 'Generate QR codes for URLs, text, WiFi, and more. Customize colors, add logos, download in multiple formats. Free QR code maker.',
      keywords: ['qr code generator', 'qr generator', 'create qr code', 'qr code maker', 'custom qr code', 'free qr code']
    },
    ru: {
      title: 'Генератор QR Кодов - Создать QR Код Онлайн | Бесплатно',
      description: 'Генерируйте QR коды для URL, текста, WiFi и другого. Настройте цвета, добавьте логотип, скачайте в разных форматах.',
      keywords: ['генератор qr кода', 'qr генератор', 'создать qr код', 'qr код онлайн', 'бесплатный qr код']
    },
  },
  'svg-encoder': {
    en: {
      title: 'SVG Encoder - Convert SVG to Data URI | Online Tool',
      description: 'Encode SVG to data URI for CSS. Optimize SVG for inline use. Convert SVG files to base64 or URL-encoded format instantly.',
      keywords: ['svg encoder', 'svg to data uri', 'svg to base64', 'svg optimizer', 'inline svg', 'svg converter']
    },
    ru: {
      title: 'SVG Кодировщик - Конвертер SVG в Data URI | Онлайн',
      description: 'Кодируйте SVG в data URI для CSS. Оптимизируйте SVG для встроенного использования. Конвертируйте SVG в base64 или URL-формат.',
      keywords: ['svg кодировщик', 'svg в data uri', 'svg в base64', 'оптимизатор svg', 'конвертер svg']
    },
  },
  'utm-builder': {
    en: {
      title: 'UTM Builder - Campaign URL Generator | Free Marketing Tool',
      description: 'Build UTM tracking URLs for marketing campaigns. Track traffic sources in Google Analytics. Generate campaign URLs with proper UTM parameters.',
      keywords: ['utm builder', 'utm generator', 'campaign url', 'utm parameters', 'google analytics', 'url builder']
    },
    ru: {
      title: 'UTM Генератор - Создать UTM Метки для Кампаний | Бесплатно',
      description: 'Создавайте UTM ссылки для маркетинговых кампаний. Отслеживайте источники трафика в Google Analytics. Генерируйте URL с UTM параметрами.',
      keywords: ['utm генератор', 'utm метки', 'utm ссылки', 'генератор utm', 'google analytics', 'отслеживание кампаний']
    },
  },
  'youtube-thumbnail': {
    en: {
      title: 'YouTube Thumbnail Downloader - Get HD Thumbnails | Free Tool',
      description: 'Download YouTube video thumbnails in HD quality. Get all thumbnail sizes instantly. Free YouTube thumbnail grabber and downloader.',
      keywords: ['youtube thumbnail', 'thumbnail downloader', 'youtube thumbnail download', 'thumbnail grabber', 'youtube image']
    },
    ru: {
      title: 'Скачать Превью YouTube - Миниатюры в HD Качестве | Бесплатно',
      description: 'Скачивайте превью YouTube видео в HD качестве. Получите все размеры миниатюр мгновенно. Бесплатный загрузчик превью YouTube.',
      keywords: ['превью youtube', 'скачать превью', 'миниатюра youtube', 'youtube thumbnail', 'загрузчик превью']
    },
  },
  'seo-markdown-generator': {
    en: {
      title: 'SEO Markdown Generator - Create Optimized Blog Posts | Free Tool',
      description: 'Generate SEO-optimized markdown files for blog posts. Create structured content with metadata, keywords, and proper formatting. Perfect for bloggers and content creators.',
      keywords: ['seo markdown', 'markdown generator', 'blog post generator', 'seo content', 'markdown creator', 'content generator']
    },
    ru: {
      title: 'SEO Markdown Генератор - Создание Оптимизированных Постов | Бесплатно',
      description: 'Генерируйте SEO-оптимизированные markdown файлы для блога. Создавайте структурированный контент с метаданными и ключевыми словами.',
      keywords: ['seo markdown', 'генератор markdown', 'генератор постов', 'seo контент', 'создать markdown', 'генератор контента']
    },
  },
  'html-tree': {
    en: {
      title: 'HTML Tree Visualizer - DOM Structure Viewer | Developer Tool',
      description: 'Visualize HTML DOM structure as an interactive tree. Analyze nested elements and hierarchy. Perfect tool for debugging HTML structure.',
      keywords: ['html tree', 'dom visualizer', 'html structure', 'dom tree', 'html viewer', 'html analyzer']
    },
    ru: {
      title: 'HTML Дерево - Визуализатор DOM Структуры | Инструмент',
      description: 'Визуализируйте структуру HTML DOM как интерактивное дерево. Анализируйте вложенные элементы и иерархию.',
      keywords: ['html дерево', 'визуализатор dom', 'структура html', 'dom дерево', 'анализатор html']
    },
  },
  'speed-test': {
    en: {
      title: 'Internet Speed Test - Check Download & Upload Speed | Free',
      description: 'Test your internet connection speed. Measure download, upload, and ping. Free online speed test with accurate results.',
      keywords: ['speed test', 'internet speed test', 'bandwidth test', 'connection speed', 'download speed', 'upload speed']
    },
    ru: {
      title: 'Тест Скорости Интернета - Проверить Скорость | Бесплатно',
      description: 'Протестируйте скорость интернет-соединения. Измерьте скорость загрузки, отдачи и пинг. Бесплатный онлайн тест скорости.',
      keywords: ['тест скорости', 'скорость интернета', 'проверить скорость', 'тест соединения', 'speedtest']
    },
  }
}