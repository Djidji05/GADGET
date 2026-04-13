import axios from 'axios';

const API_URL = 'http://localhost:3003/api';

async function testPerformance() {
    console.log('🚀 Starting performance test...');

    const queries = ['casual', 'samba', 'phone', 'laptop'];

    for (const q of queries) {
        const start = Date.now();
        try {
            console.log(`🔍 Searching for: ${q}...`);
            const response = await axios.get(`${API_URL}/products/search`, {
                params: { q },
                timeout: 30000
            });
            const duration = Date.now() - start;
            console.log(`✅ Search "${q}" took ${duration}ms. Results: ${response.data.length}`);
        } catch (error) {
            const duration = Date.now() - start;
            console.error(`❌ Search "${q}" failed after ${duration}ms:`, error.message);
        }
    }

    // Test Home Page endpoints
    const homeEndpoints = [
        '/products/featured',
        '/products/new',
        '/promotions',
        '/notifications'
    ];

    console.log('\n🏠 Testing Home Page endpoints...');
    for (const endpoint of homeEndpoints) {
        const start = Date.now();
        try {
            console.log(`📡 Fetching ${endpoint}...`);
            await axios.get(`${API_URL}${endpoint}`, { timeout: 30000 });
            const duration = Date.now() - start;
            console.log(`✅ ${endpoint} took ${duration}ms.`);
        } catch (error) {
            const duration = Date.now() - start;
            console.error(`❌ ${endpoint} failed after ${duration}ms:`, error.message);
        }
    }
}

testPerformance().catch(console.error);
