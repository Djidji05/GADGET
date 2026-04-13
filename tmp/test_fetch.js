async function testEndpoints() {
    const API_URL = 'http://localhost:3003/api';
    const endpoints = [
        '/products/search?q=casual',
        '/products/featured',
        '/products/new'
    ];

    for (const ep of endpoints) {
        console.log(`📡 Calling ${ep}...`);
        const start = Date.now();
        try {
            const res = await fetch(`${API_URL}${ep}`);
            const data = await res.json();
            const duration = Date.now() - start;
            console.log(`✅ ${ep} took ${duration}ms. Results count: ${Array.isArray(data) ? data.length : (data.products ? data.products.length : 'N/A')}`);
        } catch (err) {
            console.error(`❌ ${ep} failed:`, err.message);
        }
    }
}

testEndpoints();
