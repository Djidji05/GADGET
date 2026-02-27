// test script
const TEST_URL = 'http://localhost:3003/api/orders';

async function testOrder() {
    try {
        const payload = {
            user_id: 1,
            items: [
                { product_id: 9, quantity: 1 }
            ],
            shipping_address: {
                street: 'Test Street',
                city: 'Test City',
                postalCode: '12345',
                country: 'Haïti',
                phone: '12345678'
            }
        };

        console.log('Sending payload:', JSON.stringify(payload, null, 2));
        const res = await fetch(TEST_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        const data = await res.json();
        if (res.ok) {
            console.log('Success:', data);
        } else {
            console.log('Error 400 Detail:', data);
        }
    } catch (err) {
        console.log('Error:', err.message);
    }
}

testOrder();
