import sequelize from './src/backend/config/database.js';
import Product from './src/backend/models/Product.js';

async function findProduct() {
    try {
        const product = await Product.findOne({ where: { status: 'active' } });
        if (product) {
            console.log('Valid Product ID:', product.id);
            console.log('Product Name:', product.name);
        } else {
            console.log('No active products found');
        }
    } catch (err) {
        console.error('Error:', err.message);
    } finally {
        await sequelize.close();
    }
}

findProduct();
