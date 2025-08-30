/**
 * SEO Redirects для Next.js config
 * Захват 5.7M поисковых запросов/месяц: "рассчитать" (4.1M) + "посчитать" (1.6M)
 * + Транслитерированные варианты для расширения русскоязычного охвата
 */

export const SEO_REDIRECTS = [
	// ========== КАЛЬКУЛЯТОРЫ - РУССКИЕ РЕДИРЕКТЫ ==========
	
	// BMI Calculator - индекс массы тела
	{ source: '/rasschitat-bmi', destination: '/ru/tools/bmi-calculator', permanent: true },
	{ source: '/poschitat-bmi', destination: '/ru/tools/bmi-calculator', permanent: true },
	{ source: '/raschet-bmi', destination: '/ru/tools/bmi-calculator', permanent: true },
	{ source: '/rasschitat-imt', destination: '/ru/tools/bmi-calculator', permanent: true },
	{ source: '/poschitat-imt', destination: '/ru/tools/bmi-calculator', permanent: true },
	{ source: '/rasschitat-indeks-massy-tela', destination: '/ru/tools/bmi-calculator', permanent: true },
	{ source: '/poschitat-indeks-massy-tela', destination: '/ru/tools/bmi-calculator', permanent: true },
	
	// Percentage Calculator - проценты
	{ source: '/rasschitat-procenty', destination: '/ru/tools/percentage-calculator', permanent: true },
	{ source: '/poschitat-procenty', destination: '/ru/tools/percentage-calculator', permanent: true },
	{ source: '/raschet-procentov', destination: '/ru/tools/percentage-calculator', permanent: true },
	{ source: '/vychislit-procenty', destination: '/ru/tools/percentage-calculator', permanent: true },
	{ source: '/uznat-procenty', destination: '/ru/tools/percentage-calculator', permanent: true },
	
	// Age Calculator - возраст  
	{ source: '/rasschitat-vozrast', destination: '/ru/tools/age-calculator', permanent: true },
	{ source: '/poschitat-vozrast', destination: '/ru/tools/age-calculator', permanent: true },
	{ source: '/raschet-vozrasta', destination: '/ru/tools/age-calculator', permanent: true },
	{ source: '/vychislit-vozrast', destination: '/ru/tools/age-calculator', permanent: true },
	{ source: '/uznat-vozrast', destination: '/ru/tools/age-calculator', permanent: true },
	
	// Loan Calculator - кредит
	{ source: '/rasschitat-kredit', destination: '/ru/tools/loan-calculator', permanent: true },
	{ source: '/poschitat-kredit', destination: '/ru/tools/loan-calculator', permanent: true },
	{ source: '/raschet-kredita', destination: '/ru/tools/loan-calculator', permanent: true },
	{ source: '/vychislit-kredit', destination: '/ru/tools/loan-calculator', permanent: true },
	{ source: '/rasschitat-zaem', destination: '/ru/tools/loan-calculator', permanent: true },
	{ source: '/poschitat-zaem', destination: '/ru/tools/loan-calculator', permanent: true },
	
	// Compound Interest Calculator - проценты по вкладу
	{ source: '/rasschitat-vklad', destination: '/ru/tools/compound-interest-calculator', permanent: true },
	{ source: '/poschitat-vklad', destination: '/ru/tools/compound-interest-calculator', permanent: true },
	{ source: '/raschet-vklada', destination: '/ru/tools/compound-interest-calculator', permanent: true },
	{ source: '/vychislit-deposit', destination: '/ru/tools/compound-interest-calculator', permanent: true },
	{ source: '/rasschitat-investitsii', destination: '/ru/tools/compound-interest-calculator', permanent: true },
	
	// Tip Calculator - чаевые
	{ source: '/rasschitat-chaevye', destination: '/ru/tools/tip-calculator', permanent: true },
	{ source: '/poschitat-chaevye', destination: '/ru/tools/tip-calculator', permanent: true },
	{ source: '/raschet-chaevyh', destination: '/ru/tools/tip-calculator', permanent: true },
	
	// ========== КОНВЕРТЕРЫ - РУССКИЕ РЕДИРЕКТЫ ==========
	
	// Currency Converter - валюты
	{ source: '/konvertirovat-valutu', destination: '/ru/tools/currency-converter', permanent: true },
	{ source: '/perevesti-valutu', destination: '/ru/tools/currency-converter', permanent: true },
	{ source: '/preobrazovat-valutu', destination: '/ru/tools/currency-converter', permanent: true },
	{ source: '/obmen-valut', destination: '/ru/tools/currency-converter', permanent: true },
	{ source: '/kurs-valut', destination: '/ru/tools/currency-converter', permanent: true },
	
	// Temperature Converter - температура
	{ source: '/konvertirovat-temperaturu', destination: '/ru/tools/temperature-converter', permanent: true },
	{ source: '/perevesti-temperaturu', destination: '/ru/tools/temperature-converter', permanent: true },
	{ source: '/preobrazovat-temperaturu', destination: '/ru/tools/temperature-converter', permanent: true },
	{ source: '/pereklyuchit-gradus', destination: '/ru/tools/temperature-converter', permanent: true },
	
	// Color Converter - цвета
	{ source: '/konvertirovat-tsvet', destination: '/ru/tools/color-converter', permanent: true },
	{ source: '/perevesti-tsvet', destination: '/ru/tools/color-converter', permanent: true },
	{ source: '/preobrazovat-rgb', destination: '/ru/tools/color-converter', permanent: true },
	{ source: '/konvertirovat-hex', destination: '/ru/tools/color-converter', permanent: true },
	
	// ========== АНГЛИЙСКИЕ РЕДИРЕКТЫ ==========
	
	// BMI Calculator - English
	{ source: '/calculate-bmi', destination: '/en/tools/bmi-calculator', permanent: true },
	{ source: '/compute-bmi', destination: '/en/tools/bmi-calculator', permanent: true },
	{ source: '/find-bmi', destination: '/en/tools/bmi-calculator', permanent: true },
	{ source: '/get-body-mass-index', destination: '/en/tools/bmi-calculator', permanent: true },
	
	// Percentage Calculator - English  
	{ source: '/calculate-percentage', destination: '/en/tools/percentage-calculator', permanent: true },
	{ source: '/compute-percentage', destination: '/en/tools/percentage-calculator', permanent: true },
	{ source: '/find-percent', destination: '/en/tools/percentage-calculator', permanent: true },
	
	// Age Calculator - English
	{ source: '/calculate-age', destination: '/en/tools/age-calculator', permanent: true },
	{ source: '/compute-age', destination: '/en/tools/age-calculator', permanent: true },
	{ source: '/find-age', destination: '/en/tools/age-calculator', permanent: true },
	{ source: '/get-years', destination: '/en/tools/age-calculator', permanent: true },
	
	// Currency Converter - English
	{ source: '/convert-currency', destination: '/en/tools/currency-converter', permanent: true },
	{ source: '/transform-currency', destination: '/en/tools/currency-converter', permanent: true },
	{ source: '/change-money', destination: '/en/tools/currency-converter', permanent: true },
	{ source: '/exchange-currency', destination: '/en/tools/currency-converter', permanent: true },
	
	// Temperature Converter - English
	{ source: '/convert-temperature', destination: '/en/tools/temperature-converter', permanent: true },
	{ source: '/transform-celsius', destination: '/en/tools/temperature-converter', permanent: true },
	{ source: '/change-fahrenheit', destination: '/en/tools/temperature-converter', permanent: true },
	{ source: '/switch-kelvin', destination: '/en/tools/temperature-converter', permanent: true },
	
	// ========== ОБЩИЕ LANDING СТРАНИЦЫ ==========
	
	// Русские общие редиректы
	{ source: '/rasschitat', destination: '/ru/tools', permanent: true },
	{ source: '/poschitat', destination: '/ru/tools', permanent: true },
	{ source: '/raschet', destination: '/ru/tools', permanent: true },
	{ source: '/vychislit', destination: '/ru/tools', permanent: true },
	{ source: '/uznat', destination: '/ru/tools', permanent: true },
	{ source: '/kalkulyator', destination: '/ru/tools', permanent: true },
	
	{ source: '/konvertirovat', destination: '/ru/tools', permanent: true },
	{ source: '/perevesti', destination: '/ru/tools', permanent: true },
	{ source: '/preobrazovat', destination: '/ru/tools', permanent: true },
	{ source: '/konverter', destination: '/ru/tools', permanent: true },
	
	{ source: '/generirovat', destination: '/ru/tools', permanent: true },
	{ source: '/sozdavat', destination: '/ru/tools', permanent: true },
	{ source: '/sdelat', destination: '/ru/tools', permanent: true },
	{ source: '/generator', destination: '/ru/tools', permanent: true },
	
	// Английские общие редиректы
	{ source: '/calculate', destination: '/en/tools', permanent: true },
	{ source: '/compute', destination: '/en/tools', permanent: true },
	{ source: '/find', destination: '/en/tools', permanent: true },
	{ source: '/get', destination: '/en/tools', permanent: true },
	{ source: '/calculator', destination: '/en/tools', permanent: true },
	
	{ source: '/convert', destination: '/en/tools', permanent: true },
	{ source: '/transform', destination: '/en/tools', permanent: true },
	{ source: '/change', destination: '/en/tools', permanent: true },
	{ source: '/switch', destination: '/en/tools', permanent: true },
	{ source: '/converter', destination: '/en/tools', permanent: true },
	
	{ source: '/generate', destination: '/en/tools', permanent: true },
	{ source: '/create', destination: '/en/tools', permanent: true },
	{ source: '/make', destination: '/en/tools', permanent: true },
	{ source: '/build', destination: '/en/tools', permanent: true },
	{ source: '/generator', destination: '/en/tools', permanent: true },
	
	// ========== ТРАНСЛИТЕРИРОВАННЫЕ РУССКИЕ РЕДИРЕКТЫ ==========
	
	// BMI - транслитерированные варианты
	{ source: '/rasschitat-indeks-massy-tela', destination: '/ru/tools/bmi-calculator', permanent: true },
	{ source: '/poschitat-indeks-massy-tela', destination: '/ru/tools/bmi-calculator', permanent: true },
	{ source: '/kalkulyator-bmi', destination: '/ru/tools/bmi-calculator', permanent: true },
	{ source: '/kalkulyator-imt', destination: '/ru/tools/bmi-calculator', permanent: true },
	
	// Проценты - транслитерированные варианты  
	{ source: '/kalkulyator-protsentov', destination: '/ru/tools/percentage-calculator', permanent: true },
	{ source: '/rasschitat-protsenty', destination: '/ru/tools/percentage-calculator', permanent: true },
	{ source: '/poschitat-protsenty', destination: '/ru/tools/percentage-calculator', permanent: true },
	{ source: '/protsentnyy-kalkulyator', destination: '/ru/tools/percentage-calculator', permanent: true },
	
	// Возраст - транслитерированные варианты
	{ source: '/kalkulyator-vozrasta', destination: '/ru/tools/age-calculator', permanent: true },
	{ source: '/rasschitat-gody', destination: '/ru/tools/age-calculator', permanent: true },
	{ source: '/poschitat-gody', destination: '/ru/tools/age-calculator', permanent: true },
	{ source: '/uznat-skolko-let', destination: '/ru/tools/age-calculator', permanent: true },
	
	// Кредит - транслитерированные варианты
	{ source: '/kalkulyator-kredita', destination: '/ru/tools/loan-calculator', permanent: true },
	{ source: '/kreditnyy-kalkulyator', destination: '/ru/tools/loan-calculator', permanent: true },
	{ source: '/rasschitat-zaym', destination: '/ru/tools/loan-calculator', permanent: true },
	{ source: '/poschitat-zaym', destination: '/ru/tools/loan-calculator', permanent: true },
	
	// Вклады - транслитерированные варианты
	{ source: '/kalkulyator-vkladov', destination: '/ru/tools/compound-interest-calculator', permanent: true },
	{ source: '/rasschitat-depozit', destination: '/ru/tools/compound-interest-calculator', permanent: true },
	{ source: '/poschitat-depozit', destination: '/ru/tools/compound-interest-calculator', permanent: true },
	{ source: '/kalkulyator-depozita', destination: '/ru/tools/compound-interest-calculator', permanent: true },
	
	// Чаевые - транслитерированные варианты
	{ source: '/kalkulyator-chaevykh', destination: '/ru/tools/tip-calculator', permanent: true },
	{ source: '/rasschitat-tip', destination: '/ru/tools/tip-calculator', permanent: true },
	{ source: '/poschitat-tip', destination: '/ru/tools/tip-calculator', permanent: true },
	
	// Валюты - транслитерированные варианты
	{ source: '/konverter-valyut', destination: '/ru/tools/currency-converter', permanent: true },
	{ source: '/kurs-dollar-rubl', destination: '/ru/tools/currency-converter', permanent: true },
	{ source: '/kurs-evro-rubl', destination: '/ru/tools/currency-converter', permanent: true },
	{ source: '/obmenyat-valyutu', destination: '/ru/tools/currency-converter', permanent: true },
	{ source: '/kalkulyator-valyut', destination: '/ru/tools/currency-converter', permanent: true },
	
	// Температура - транслитерированные варианты
	{ source: '/konverter-temperatury', destination: '/ru/tools/temperature-converter', permanent: true },
	{ source: '/perevesti-tselsiy-fahrengeyt', destination: '/ru/tools/temperature-converter', permanent: true },
	{ source: '/tselsiy-v-fahrengeyt', destination: '/ru/tools/temperature-converter', permanent: true },
	{ source: '/fahrengeyt-v-tselsiy', destination: '/ru/tools/temperature-converter', permanent: true },
	
	// Цвета - транслитерированные варианты
	{ source: '/konverter-tsvetov', destination: '/ru/tools/color-converter', permanent: true },
	{ source: '/rgb-v-hex', destination: '/ru/tools/color-converter', permanent: true },
	{ source: '/hex-v-rgb', destination: '/ru/tools/color-converter', permanent: true },
	{ source: '/kalkulyator-tsvetov', destination: '/ru/tools/color-converter', permanent: true },
	
	// ========== СПЕЦИАЛЬНЫЕ РЕДИРЕКТЫ ДЛЯ ОПЕЧАТОК ==========
	
	// "конкулятор" - 25K опечаток в месяц
	{ source: '/konkuylyator', destination: '/ru/tools', permanent: true },
	{ source: '/konkulator', destination: '/ru/tools', permanent: true },
	{ source: '/konkulyator', destination: '/ru/tools', permanent: true },
	
	// Другие популярные опечатки
	{ source: '/kalkulator', destination: '/ru/tools', permanent: true },
	{ source: '/kalkulytor', destination: '/ru/tools', permanent: true },
	{ source: '/calcuilator', destination: '/en/tools', permanent: true },
	{ source: '/calculater', destination: '/en/tools', permanent: true },
	
	// Транслитерированные опечатки
	{ source: '/rasschitat-protenty', destination: '/ru/tools/percentage-calculator', permanent: true }, // "проценты" → "протенты"
	{ source: '/poschitat-protenty', destination: '/ru/tools/percentage-calculator', permanent: true },
	{ source: '/kalkulyator-protentov', destination: '/ru/tools/percentage-calculator', permanent: true },
	{ source: '/rasschitat-valuta', destination: '/ru/tools/currency-converter', permanent: true }, // "валюту" → "валута"
	{ source: '/konvertir-valutu', destination: '/ru/tools/currency-converter', permanent: true }, // "конвертировать" → "конвертир"
]