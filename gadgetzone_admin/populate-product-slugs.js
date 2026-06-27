import { Product, sequelize } from './src/backend/models/index.js';
import { slugify } from './src/backend/utils/slugify.js';

async function populateSlugs() {
  try {
    console.log('Fetching products without slugs...');
    const products = await Product.findAll({
      where: { slug: null }
    });

    console.log(`Found ${products.length} products to update.`);

    for (const product of products) {
      let slug = slugify(product.name);
      
      // Check for uniqueness
      let uniqueSlug = slug;
      let counter = 1;
      let exists = true;
      
      while (exists) {
        const existing = await Product.findOne({ where: { slug: uniqueSlug } });
        if (existing) {
          uniqueSlug = `${slug}-${counter}`;
          counter++;
        } else {
          exists = false;
        }
      }
      
      product.slug = uniqueSlug;
      await product.save();
      console.log(`Updated: ${product.name} -> ${product.slug}`);
    }

    console.log('All slugs populated successfully.');
  } catch (error) {
    console.error('Failed to populate slugs:', error);
  } finally {
    await sequelize.close();
  }
}

populateSlugs();
