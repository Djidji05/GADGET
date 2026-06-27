import { Store, sequelize } from './src/backend/models/index.js';
import { slugify } from './src/backend/utils/slugify.js';

async function populateStoreSlugs() {
  try {
    console.log('Fetching stores without slugs...');
    const stores = await Store.findAll({
      where: { slug: null }
    });

    console.log(`Found ${stores.length} stores to update.`);

    for (const store of stores) {
      let slug = slugify(store.name);
      
      // Check for uniqueness
      let uniqueSlug = slug;
      let counter = 1;
      let exists = true;
      
      while (exists) {
        const existing = await Store.findOne({ where: { slug: uniqueSlug } });
        if (existing) {
          uniqueSlug = `${slug}-${counter}`;
          counter++;
        } else {
          exists = false;
        }
      }
      
      store.slug = uniqueSlug;
      await store.save();
      console.log(`Updated: ${store.name} -> ${store.slug}`);
    }

    console.log('All store slugs populated successfully.');
  } catch (error) {
    console.error('Failed to populate store slugs:', error);
  } finally {
    await sequelize.close();
  }
}

populateStoreSlugs();
