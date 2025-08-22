#!/usr/bin/env node

/**
 * Simple homepage test using fetch API
 * Tests basic functionality of the main page
 */

const BASE_URL = 'http://localhost:3001';

async function testEndpoint(url, expectedStatus = 200) {
    try {
        const response = await fetch(url);
        console.log(`✅ ${url}: ${response.status} ${response.statusText}`);
        
        if (response.status !== expectedStatus) {
            console.log(`❌ Expected ${expectedStatus}, got ${response.status}`);
            return false;
        }
        
        const text = await response.text();
        return { status: response.status, text, headers: response.headers };
    } catch (error) {
        console.log(`❌ ${url}: Error - ${error.message}`);
        return false;
    }
}

async function runTests() {
    console.log('🚀 Starting homepage tests...\n');
    
    const tests = [
        {
            name: 'Homepage redirect',
            url: `${BASE_URL}`,
            test: async () => {
                const result = await testEndpoint(`${BASE_URL}`, 307);
                return result && result.headers.get('location') === '/en';
            }
        },
        {
            name: 'English homepage',
            url: `${BASE_URL}/en`,
            test: async () => {
                const result = await testEndpoint(`${BASE_URL}/en`);
                if (!result) return false;
                
                const checks = [
                    result.text.includes('lang="en"'),
                    result.text.includes('PixelTool - Free Online Developer Tools'),
                    result.text.includes('Professional web developer tools collection'),
                ];
                
                console.log(`   - Language tag: ${checks[0] ? '✅' : '❌'}`);
                console.log(`   - English title: ${checks[1] ? '✅' : '❌'}`);
                console.log(`   - English description: ${checks[2] ? '✅' : '❌'}`);
                
                return checks.every(Boolean);
            }
        },
        {
            name: 'Russian homepage',
            url: `${BASE_URL}/ru`,
            test: async () => {
                const result = await testEndpoint(`${BASE_URL}/ru`);
                if (!result) return false;
                
                const checks = [
                    result.text.includes('lang="ru"'),
                    result.text.includes('PixelTool - Бесплатные Онлайн Инструменты'),
                    result.text.includes('Профессиональная коллекция инструментов'),
                ];
                
                console.log(`   - Language tag: ${checks[0] ? '✅' : '❌'}`);
                console.log(`   - Russian title: ${checks[1] ? '✅' : '❌'}`);
                console.log(`   - Russian description: ${checks[2] ? '✅' : '❌'}`);
                
                return checks.every(Boolean);
            }
        },
        {
            name: 'Tools page (Russian)',
            url: `${BASE_URL}/ru/tools`,
            test: async () => {
                const result = await testEndpoint(`${BASE_URL}/ru/tools`);
                if (!result) return false;
                
                const checks = [
                    result.text.includes('Бесплатные Онлайн Инструменты'),
                    result.text.includes('Веб-разработка'),
                    result.text.includes('Безопасность'), // Should be shortened now
                ];
                
                console.log(`   - Tools page title: ${checks[0] ? '✅' : '❌'}`);
                console.log(`   - Web development category: ${checks[1] ? '✅' : '❌'}`);
                console.log(`   - Security category (shortened): ${checks[2] ? '✅' : '❌'}`);
                
                return checks.every(Boolean);
            }
        },
        {
            name: 'Timer countdown widget',
            url: `${BASE_URL}/ru/tools/timer-countdown`,
            test: async () => {
                const result = await testEndpoint(`${BASE_URL}/ru/tools/timer-countdown`);
                if (!result) return false;
                
                const checks = [
                    result.text.includes('Таймер и обратный отсчёт'),
                    !result.text.includes('Pomodoro'), // Should not have duplicate pomodoro
                ];
                
                console.log(`   - Timer page loads: ${checks[0] ? '✅' : '❌'}`);
                console.log(`   - No duplicate Pomodoro: ${checks[1] ? '✅' : '❌'}`);
                
                return checks.every(Boolean);
            }
        }
    ];
    
    console.log('Running tests:\n');
    
    let passed = 0;
    let total = tests.length;
    
    for (const test of tests) {
        console.log(`🧪 Testing: ${test.name}`);
        const result = await test.test();
        if (result) {
            console.log(`✅ PASSED: ${test.name}\n`);
            passed++;
        } else {
            console.log(`❌ FAILED: ${test.name}\n`);
        }
    }
    
    console.log(`\n📊 Results: ${passed}/${total} tests passed`);
    
    if (passed === total) {
        console.log('🎉 All tests passed!');
    } else {
        console.log('⚠️  Some tests failed');
        process.exit(1);
    }
}

runTests().catch(console.error);