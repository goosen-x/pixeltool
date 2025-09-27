/**
 * SEO Redirects для Next.js config
 * Захват 5.7M поисковых запросов/месяц: "рассчитать" (4.1M) + "посчитать" (1.6M)
 * + Транслитерированные варианты для расширения русскоязычного охвата
 * Обновлено для плоской структуры без [locale] маршрутов
 */

export const SEO_REDIRECTS = [
	// ========== КАЛЬКУЛЯТОРЫ - РУССКИЕ РЕДИРЕКТЫ ==========
	
	// BMI Calculator - индекс массы тела
	{ source: '/rasschitat-bmi', destination: '/tools/bmi-calculator', permanent: true },
	{ source: '/poschitat-bmi', destination: '/tools/bmi-calculator', permanent: true },
	{ source: '/raschet-bmi', destination: '/tools/bmi-calculator', permanent: true },
	{ source: '/rasschitat-imt', destination: '/tools/bmi-calculator', permanent: true },
	{ source: '/poschitat-imt', destination: '/tools/bmi-calculator', permanent: true },
	{ source: '/rasschitat-indeks-massy-tela', destination: '/tools/bmi-calculator', permanent: true },
	{ source: '/poschitat-indeks-massy-tela', destination: '/tools/bmi-calculator', permanent: true },
	
	// Percentage Calculator - проценты
	{ source: '/rasschitat-procenty', destination: '/tools/percentage-calculator', permanent: true },
	{ source: '/poschitat-procenty', destination: '/tools/percentage-calculator', permanent: true },
	{ source: '/raschet-procentov', destination: '/tools/percentage-calculator', permanent: true },
	{ source: '/vychislit-procenty', destination: '/tools/percentage-calculator', permanent: true },
	{ source: '/uznat-procenty', destination: '/tools/percentage-calculator', permanent: true },
	
	// Age Calculator - возраст  
	{ source: '/rasschitat-vozrast', destination: '/tools/age-calculator', permanent: true },
	{ source: '/poschitat-vozrast', destination: '/tools/age-calculator', permanent: true },
	{ source: '/raschet-vozrasta', destination: '/tools/age-calculator', permanent: true },
	{ source: '/vychislit-vozrast', destination: '/tools/age-calculator', permanent: true },
	{ source: '/uznat-vozrast', destination: '/tools/age-calculator', permanent: true },
	
	// Loan Calculator - кредит
	{ source: '/rasschitat-kredit', destination: '/tools/loan-calculator', permanent: true },
	{ source: '/poschitat-kredit', destination: '/tools/loan-calculator', permanent: true },
	{ source: '/raschet-kredita', destination: '/tools/loan-calculator', permanent: true },
	{ source: '/vychislit-kredit', destination: '/tools/loan-calculator', permanent: true },
	{ source: '/rasschitat-zaem', destination: '/tools/loan-calculator', permanent: true },
	{ source: '/poschitat-zaem', destination: '/tools/loan-calculator', permanent: true },
	
	// Compound Interest Calculator - проценты по вкладу
	{ source: '/rasschitat-vklad', destination: '/tools/compound-interest-calculator', permanent: true },
	{ source: '/poschitat-vklad', destination: '/tools/compound-interest-calculator', permanent: true },
	{ source: '/raschet-vklada', destination: '/tools/compound-interest-calculator', permanent: true },
	{ source: '/vychislit-deposit', destination: '/tools/compound-interest-calculator', permanent: true },
	{ source: '/rasschitat-investitsii', destination: '/tools/compound-interest-calculator', permanent: true },
	
	// Tip Calculator - чаевые
	{ source: '/rasschitat-chaevye', destination: '/tools/tip-calculator', permanent: true },
	{ source: '/poschitat-chaevye', destination: '/tools/tip-calculator', permanent: true },
	{ source: '/raschet-chaevyh', destination: '/tools/tip-calculator', permanent: true },
	
	// ========== КОНВЕРТЕРЫ - РУССКИЕ РЕДИРЕКТЫ ==========
	
	// Currency Converter - валюты
	{ source: '/konvertirovat-valutu', destination: '/tools/currency-converter', permanent: true },
	{ source: '/perevesti-valutu', destination: '/tools/currency-converter', permanent: true },
	{ source: '/preobrazovat-valutu', destination: '/tools/currency-converter', permanent: true },
	{ source: '/obmen-valut', destination: '/tools/currency-converter', permanent: true },
	{ source: '/kurs-valut', destination: '/tools/currency-converter', permanent: true },
	
	// Temperature Converter - температура
	{ source: '/konvertirovat-temperaturu', destination: '/tools/temperature-converter', permanent: true },
	{ source: '/perevesti-temperaturu', destination: '/tools/temperature-converter', permanent: true },
	{ source: '/preobrazovat-temperaturu', destination: '/tools/temperature-converter', permanent: true },
	{ source: '/pereklyuchit-gradus', destination: '/tools/temperature-converter', permanent: true },
	
	// Color Converter - цвета
	{ source: '/konvertirovat-tsvet', destination: '/tools/color-converter', permanent: true },
	{ source: '/perevesti-tsvet', destination: '/tools/color-converter', permanent: true },
	{ source: '/preobrazovat-rgb', destination: '/tools/color-converter', permanent: true },
	{ source: '/konvertirovat-hex', destination: '/tools/color-converter', permanent: true },
	
	// ========== АНГЛИЙСКИЕ РЕДИРЕКТЫ ==========
	
	// BMI Calculator - English
	{ source: '/calculate-bmi', destination: '/tools/bmi-calculator', permanent: true },
	{ source: '/compute-bmi', destination: '/tools/bmi-calculator', permanent: true },
	{ source: '/find-bmi', destination: '/tools/bmi-calculator', permanent: true },
	{ source: '/get-body-mass-index', destination: '/tools/bmi-calculator', permanent: true },
	
	// Percentage Calculator - English  
	{ source: '/calculate-percentage', destination: '/tools/percentage-calculator', permanent: true },
	{ source: '/compute-percentage', destination: '/tools/percentage-calculator', permanent: true },
	{ source: '/find-percent', destination: '/tools/percentage-calculator', permanent: true },
	
	// Age Calculator - English
	{ source: '/calculate-age', destination: '/tools/age-calculator', permanent: true },
	{ source: '/compute-age', destination: '/tools/age-calculator', permanent: true },
	{ source: '/find-age', destination: '/tools/age-calculator', permanent: true },
	{ source: '/get-years', destination: '/tools/age-calculator', permanent: true },
	
	// Currency Converter - English
	{ source: '/convert-currency', destination: '/tools/currency-converter', permanent: true },
	{ source: '/transform-currency', destination: '/tools/currency-converter', permanent: true },
	{ source: '/change-money', destination: '/tools/currency-converter', permanent: true },
	{ source: '/exchange-currency', destination: '/tools/currency-converter', permanent: true },
	
	// Temperature Converter - English
	{ source: '/convert-temperature', destination: '/tools/temperature-converter', permanent: true },
	{ source: '/transform-celsius', destination: '/tools/temperature-converter', permanent: true },
	{ source: '/change-fahrenheit', destination: '/tools/temperature-converter', permanent: true },
	{ source: '/switch-kelvin', destination: '/tools/temperature-converter', permanent: true },
	
	// ========== ОБЩИЕ LANDING СТРАНИЦЫ ==========
	
	// Русские общие редиректы
	{ source: '/rasschitat', destination: '/tools', permanent: true },
	{ source: '/poschitat', destination: '/tools', permanent: true },
	{ source: '/raschet', destination: '/tools', permanent: true },
	{ source: '/vychislit', destination: '/tools', permanent: true },
	{ source: '/uznat', destination: '/tools', permanent: true },
	{ source: '/kalkulyator', destination: '/tools', permanent: true },
	
	{ source: '/konvertirovat', destination: '/tools', permanent: true },
	{ source: '/perevesti', destination: '/tools', permanent: true },
	{ source: '/preobrazovat', destination: '/tools', permanent: true },
	{ source: '/konverter', destination: '/tools', permanent: true },
	
	{ source: '/generirovat', destination: '/tools', permanent: true },
	{ source: '/sozdavat', destination: '/tools', permanent: true },
	{ source: '/sdelat', destination: '/tools', permanent: true },
	{ source: '/generator', destination: '/tools', permanent: true },
	
	// Английские общие редиректы
	{ source: '/calculate', destination: '/tools', permanent: true },
	{ source: '/compute', destination: '/tools', permanent: true },
	{ source: '/find', destination: '/tools', permanent: true },
	{ source: '/get', destination: '/tools', permanent: true },
	{ source: '/calculator', destination: '/tools', permanent: true },
	
	{ source: '/convert', destination: '/tools', permanent: true },
	{ source: '/transform', destination: '/tools', permanent: true },
	{ source: '/change', destination: '/tools', permanent: true },
	{ source: '/switch', destination: '/tools', permanent: true },
	{ source: '/converter', destination: '/tools', permanent: true },
	
	{ source: '/generate', destination: '/tools', permanent: true },
	{ source: '/create', destination: '/tools', permanent: true },
	{ source: '/make', destination: '/tools', permanent: true },
	{ source: '/build', destination: '/tools', permanent: true },
	{ source: '/generator', destination: '/tools', permanent: true },
	
	// ========== ТРАНСЛИТЕРИРОВАННЫЕ РУССКИЕ РЕДИРЕКТЫ ==========
	
	// BMI - транслитерированные варианты
	{ source: '/rasschitat-indeks-massy-tela', destination: '/tools/bmi-calculator', permanent: true },
	{ source: '/poschitat-indeks-massy-tela', destination: '/tools/bmi-calculator', permanent: true },
	{ source: '/kalkulyator-bmi', destination: '/tools/bmi-calculator', permanent: true },
	{ source: '/kalkulyator-imt', destination: '/tools/bmi-calculator', permanent: true },
	
	// Проценты - транслитерированные варианты  
	{ source: '/kalkulyator-protsentov', destination: '/tools/percentage-calculator', permanent: true },
	{ source: '/rasschitat-protsenty', destination: '/tools/percentage-calculator', permanent: true },
	{ source: '/poschitat-protsenty', destination: '/tools/percentage-calculator', permanent: true },
	{ source: '/protsentnyy-kalkulyator', destination: '/tools/percentage-calculator', permanent: true },
	
	// Возраст - транслитерированные варианты
	{ source: '/kalkulyator-vozrasta', destination: '/tools/age-calculator', permanent: true },
	{ source: '/rasschitat-gody', destination: '/tools/age-calculator', permanent: true },
	{ source: '/poschitat-gody', destination: '/tools/age-calculator', permanent: true },
	{ source: '/uznat-skolko-let', destination: '/tools/age-calculator', permanent: true },
	
	// Кредит - транслитерированные варианты
	{ source: '/kalkulyator-kredita', destination: '/tools/loan-calculator', permanent: true },
	{ source: '/kreditnyy-kalkulyator', destination: '/tools/loan-calculator', permanent: true },
	{ source: '/rasschitat-zaym', destination: '/tools/loan-calculator', permanent: true },
	{ source: '/poschitat-zaym', destination: '/tools/loan-calculator', permanent: true },
	
	// Вклады - транслитерированные варианты
	{ source: '/kalkulyator-vkladov', destination: '/tools/compound-interest-calculator', permanent: true },
	{ source: '/rasschitat-depozit', destination: '/tools/compound-interest-calculator', permanent: true },
	{ source: '/poschitat-depozit', destination: '/tools/compound-interest-calculator', permanent: true },
	{ source: '/kalkulyator-depozita', destination: '/tools/compound-interest-calculator', permanent: true },
	
	// Чаевые - транслитерированные варианты
	{ source: '/kalkulyator-chaevykh', destination: '/tools/tip-calculator', permanent: true },
	{ source: '/rasschitat-tip', destination: '/tools/tip-calculator', permanent: true },
	{ source: '/poschitat-tip', destination: '/tools/tip-calculator', permanent: true },
	
	// Валюты - транслитерированные варианты
	{ source: '/konverter-valyut', destination: '/tools/currency-converter', permanent: true },
	{ source: '/kurs-dollar-rubl', destination: '/tools/currency-converter', permanent: true },
	{ source: '/kurs-evro-rubl', destination: '/tools/currency-converter', permanent: true },
	{ source: '/obmenyat-valyutu', destination: '/tools/currency-converter', permanent: true },
	{ source: '/kalkulyator-valyut', destination: '/tools/currency-converter', permanent: true },
	
	// Температура - транслитерированные варианты
	{ source: '/konverter-temperatury', destination: '/tools/temperature-converter', permanent: true },
	{ source: '/perevesti-tselsiy-fahrengeyt', destination: '/tools/temperature-converter', permanent: true },
	{ source: '/tselsiy-v-fahrengeyt', destination: '/tools/temperature-converter', permanent: true },
	{ source: '/fahrengeyt-v-tselsiy', destination: '/tools/temperature-converter', permanent: true },
	
	// Цвета - транслитерированные варианты
	{ source: '/konverter-tsvetov', destination: '/tools/color-converter', permanent: true },
	{ source: '/rgb-v-hex', destination: '/tools/color-converter', permanent: true },
	{ source: '/hex-v-rgb', destination: '/tools/color-converter', permanent: true },
	{ source: '/kalkulyator-tsvetov', destination: '/tools/color-converter', permanent: true },
	
	// ========== СПЕЦИАЛЬНЫЕ РЕДИРЕКТЫ ДЛЯ ОПЕЧАТОК ==========
	
	// "конкулятор" - 25K опечаток в месяц
	{ source: '/konkuylyator', destination: '/tools', permanent: true },
	{ source: '/konkulator', destination: '/tools', permanent: true },
	{ source: '/konkulyator', destination: '/tools', permanent: true },
	
	// Другие популярные опечатки
	{ source: '/kalkulator', destination: '/tools', permanent: true },
	{ source: '/kalkulytor', destination: '/tools', permanent: true },
	{ source: '/calcuilator', destination: '/tools', permanent: true },
	{ source: '/calculater', destination: '/tools', permanent: true },
	
	// Транслитерированные опечатки
	{ source: '/rasschitat-protenty', destination: '/tools/percentage-calculator', permanent: true }, // "проценты" → "протенты"
	{ source: '/poschitat-protenty', destination: '/tools/percentage-calculator', permanent: true },
	{ source: '/kalkulyator-protentov', destination: '/tools/percentage-calculator', permanent: true },
	{ source: '/rasschitat-valuta', destination: '/tools/currency-converter', permanent: true }, // "валюту" → "валута"
	{ source: '/konvertir-valutu', destination: '/tools/currency-converter', permanent: true }, // "конвертировать" → "конвертир"
]